/* eslint-disable no-await-in-loop */
import {
  GlobalWorkerOptions,
  getDocument,
  PDFDocumentProxy,
  PDFPageProxy,
} from 'pdfjs-dist';
import workerSrc from 'pdfjs-dist/build/pdf.worker?worker&url';
import { getLIDModel } from 'fasttext.wasm.js/common';
import { LanguageIdentificationModel } from 'fasttext.wasm.js/dist/models/language-identification/common.js';
import { detectLanguageViaAPI, extractTextViaAPI } from '../api/prioritiesCall';
import { LanguageExtractionResult } from '../Types';

GlobalWorkerOptions.workerSrc = workerSrc;
let lidModelPromise: Promise<LanguageIdentificationModel> | null = null;

const detectLanguageWithFastText = async (texts: string[]): Promise<LanguageExtractionResult[]> => {
  if (!lidModelPromise) {
    lidModelPromise = getLIDModel().then(async (model) => {
      await model.load();
      return model;
    });
  }

  const lidModel = await lidModelPromise;

  const response = await Promise.all(
    texts.map(async (text) => {
      const predictions = await lidModel.identify(text);
      const results: { official: string; name: string; probability: string }[] = [];

      const { alpha2, refName, possibility } = predictions;

      results.push({
        official: alpha2 || 'unk',
        name: refName,
        probability: possibility.toString(),
      });

      return results[0] || { official: null, name: null, probability: '0' };
    }),
  );

  return response;
};

async function pdfToText(file: File) {
  const blobUrl = URL.createObjectURL(file);
  let extractedText = '';
  let pageCount = 0;
  let hadParsingError = false;

  try {
    const loadingTask = getDocument(blobUrl);
    const pdf: PDFDocumentProxy = await loadingTask.promise;
    const { numPages } = pdf;
    pageCount = numPages;

    for (let pageNumber = 1; pageNumber <= numPages; pageNumber += 1) {
      const page: PDFPageProxy = await pdf.getPage(pageNumber);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item) => ('str' in item ? item.str : ''))
        .join(' ');
      extractedText += `${pageText} \n`;
    }

    URL.revokeObjectURL(blobUrl);
    loadingTask.destroy();
  } catch (error) {
    hadParsingError = true;
  }

  if (hadParsingError) {
    try {
      const [extractedTextViaAPI, pageCountViaAPI] = await extractTextViaAPI(
        file,
      );
      extractedText = extractedTextViaAPI;
      pageCount = pageCountViaAPI;
    } catch (error: any) {
      throw new Error(
        `Both PDF parsing and API extraction failed: ${error.message}`,
      );
    }
  }

  if (extractedText.trim().length === 0) {
    throw new Error(
      'Unable to extract text from this document, might be a scanned file.',
    );
  }

  return [extractedText.trim(), pageCount];
}

export async function extractTextFromPDFs(files: File[]) {
  const texts = await Promise.all(
    files.map(async (file) => {
      try {
        const [text, pageCount] = await pdfToText(file);
        return {
          file_name: file.name,
          text,
          pageCount,
          error: false,
        };
      } catch (error: any) {
        return {
          file_name: file.name,
          text: error?.message,
          pageCount: 0,
          error: true,
        };
      }
    }),
  );

  const validTexts = texts.filter((t) => !t.error).map((t) => t.text);

  const truncatedTexts = validTexts.map((text) => text
    .slice(0, 50000)
    .replace(/[\r\n]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim());

  let languages: LanguageExtractionResult[] | null = null;
  try {
    languages = await detectLanguageWithFastText(truncatedTexts);
  } catch (error) {
    languages = await detectLanguageViaAPI(truncatedTexts);
  }

  const textResults = texts.map((t, index) => {
    if (!t.error && languages && languages[index].official !== 'en') {
      return {
        ...t,
        error: true,
        text: `Document contains ${languages[index].name} which is unsupported by the model.`,
      };
    }
    return t;
  });

  return textResults;
}
