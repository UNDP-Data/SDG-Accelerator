import axios from 'axios';
import { AIAAS_API_BASE_URL, AIAAS_API_KEY } from '../Constants';

export const fetchMetadata = async (
  iso: string,
  year?: number,
  language?: string,
  kind?: string,
) => {
  const params = {
    iso: iso.toLowerCase(),
    year,
    language,
    kind,
  };
  const response = await axios.get(
    `${AIAAS_API_BASE_URL}/diagnostic/metadata`,
    {
      params,
      headers: {
        accept: 'application/json',
        api_key: AIAAS_API_KEY,
      },
    },
  );
  return response.data;
};

export const fetchDocumentById = async (id: string) => {
  const response = await axios.get(`${AIAAS_API_BASE_URL}/diagnostic/${id}`, {
    headers: {
      accept: 'application/json',
      api_key: AIAAS_API_KEY,
    },
  });
  return response.data;
};

export const submitDocumentsForAnalysis = async (
  files: File[],
  weights?: number[],
  version?: number,
) => {
  const formData = new FormData();

  files.forEach((file) => formData.append('files', file));

  const weightAndFeaturesParam = weights && weights.length > 0
    ? `?${weights.map((weight) => `weights=${weight}`).join('&')}&version=${version}&features=true`
    : `?&version=${version}&features=true`;

  const response = await axios.post(
    `${AIAAS_API_BASE_URL}/diagnostic${weightAndFeaturesParam}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        api_key: AIAAS_API_KEY,
      },
    },
  );

  return response.data;
};

export async function detectLanguageViaAPI(texts: string[]) {
  try {
    const response = await axios({
      method: 'post',
      url: `${AIAAS_API_BASE_URL}/identification`,
      data: JSON.stringify({ texts }),
      headers: {
        'Content-Type': 'application/json',
        api_key: AIAAS_API_KEY,
      },
    });

    return response.data.map((result: any) => result[0]);
  } catch (err: any) {
    throw new Error('Language detection failed for the documents');
  }
}

export async function extractTextViaAPI(fileData: File) {
  const formData = new FormData();
  formData.append('file', fileData);

  try {
    const response = await axios({
      method: 'post',
      url: `${AIAAS_API_BASE_URL}/extraction`,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        accept: 'application/json',
        api_key: AIAAS_API_KEY,
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
