/* eslint-disable no-await-in-loop */
import axios from 'axios';
import {
  GlobalWorkerOptions,
  getDocument,
  PDFDocumentProxy,
  PDFPageProxy,
} from 'pdfjs-dist';

import {
  LANGUAGE_DETECTION_API_BASE_URL,
  LANGUAGE_DETECTION_API_KEY,
  PDFJS_DIST_CDNS,
  TEXT_EXTRACTION_API_BASE_URL,
  TEXT_EXTRACTION_API_KEY,
} from '../Constants';

GlobalWorkerOptions.workerSrc = '';

async function checkCdn(cdn: string, index: number) {
  try {
    const response = await fetch(cdn, { method: 'HEAD' });
    if (response.ok) {
      return cdn;
    }
    console.error(
      `CDN ${index + 1} down or invalid MIME type: ${response.headers.get(
        'Content-Type',
      )}`,
    );
  } catch (error) {
    console.error(`Error checking CDN ${index + 1}:`, error);
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

async function detectLanguage(text: string) {
  try {
    const response = await axios({
      method: 'post',
      url: LANGUAGE_DETECTION_API_BASE_URL,
      data: JSON.stringify({ text }),
      headers: {
        'Content-Type': 'application/json',
        api_key: LANGUAGE_DETECTION_API_KEY,
      },
    });

    return response.data.official;
  } catch (err: any) {
    throw new Error('Language detection failed for this document');
  }
}

async function extractViaAPI(fileData: File) {
  const formData = new FormData();
  formData.append('file', fileData);

  try {
    const response = await axios({
      method: 'post',
      url: TEXT_EXTRACTION_API_BASE_URL,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        accept: 'application/json',
        api_key: TEXT_EXTRACTION_API_KEY,
      },
    });

    return [
      response.data.pages.map((page: any) => page.text).join(' '),
      response.data.pages.length,
    ];
  } catch (err: any) {
    throw new Error('Text extraction failed for this document');
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

  const language = await detectLanguage(extractedText.trim());
  if (language !== 'en') {
    throw new Error('Document contains Non-English content');
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

  return texts;
}
