/* eslint-disable no-await-in-loop */
import {
  GlobalWorkerOptions,
  getDocument,
  PDFDocumentProxy,
  PDFPageProxy,
} from 'pdfjs-dist';
import { detectLanguages, extractViaAPI } from '../api/prioritiesCall';
import { PDFJS_DIST_CDNS } from '../Constants';

GlobalWorkerOptions.workerSrc = '';

async function checkCdn(cdn: string, index: number) {
  try {
    const response = await fetch(cdn, { method: 'HEAD' });
    if (response.ok) {
      return cdn;
    }
    console.error(
      `CDN ${index + 1} down or invalid MIME type of : ${response.headers.get(
        'Content-Type',
      )}`,
    );
  } catch (error) {
    console.error(`CDN ${index + 1} down: `, error);
  }
  return null;
}

async function loadPdfWorker() {
  const validCdn = await PDFJS_DIST_CDNS.reduce(
    async (accPromise, cdn, index) => {
      const acc = await accPromise;
      if (acc) return acc;

      return checkCdn(cdn, index);
    },
    Promise.resolve(null as string | null),
  );

  if (validCdn) {
    GlobalWorkerOptions.workerSrc = validCdn;
  } else {
    throw new Error('All CDNs failed');
  }
}

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
      const [extractedTextViaAPI, pageCountViaAPI] = await extractViaAPI(file);
      extractedText = extractedTextViaAPI;
      pageCount = pageCountViaAPI;
    } catch (error: any) {
      throw new Error(
        `Both PDF parsing and API extraction failed: ${error.message}`,
      );
    }
  }

  if (extractedText.trim().length === 0) {
    throw new Error('Unable to extract text from this document');
  }

  return [extractedText.trim(), pageCount];
}

export async function extractTextFromMultiplePdfs(files: File[]) {
  await loadPdfWorker();

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
  const languages = await detectLanguages(validTexts);

  const textResults = texts.map((t, index) => {
    if (!t.error && languages[index].official !== 'en') {
      return {
        ...t,
        error: true,
        text: `Document contains ${languages[index].name} content that is currently unsupported by the model.`,
      };
    }
    return t;
  });

  return textResults;
}
