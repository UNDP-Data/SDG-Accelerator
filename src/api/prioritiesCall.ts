import axios from 'axios';
import {
  DIAGNOSTICS_API_BASE_URL,
  DIAGNOSTICS_API_ACCESS_TOKEN,
} from '../Constants';

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
  const response = await axios.get(`${DIAGNOSTICS_API_BASE_URL}/metadata`, {
    params,
    headers: {
      accept: 'application/json',
      api_key: DIAGNOSTICS_API_ACCESS_TOKEN,
    },
  });
  return response.data;
};

export const fetchDocumentById = async (id: string) => {
  const response = await axios.get(
    `${DIAGNOSTICS_API_BASE_URL}/documents/${id}`,
    {
      headers: {
        accept: 'application/json',
        api_key: DIAGNOSTICS_API_ACCESS_TOKEN,
      },
    },
  );
  return response.data;
};

export const submitDocumentsForAnalysis = async (
  files: File[],
  weights?: number[],
) => {
  const formData = new FormData();

  files.forEach((file) => formData.append('files', file));

  const weightParam = weights && weights.length > 0
    ? `?${weights.map((weight) => `weights=${weight}`).join('&')}`
    : '';

  const response = await axios.post(
    `${DIAGNOSTICS_API_BASE_URL}/documents${weightParam}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        api_key: DIAGNOSTICS_API_ACCESS_TOKEN,
      },
    },
  );

  return response.data;
};
