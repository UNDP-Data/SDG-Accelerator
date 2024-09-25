/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/label-has-associated-control */
import styled from 'styled-components';
import {
  Collapse,
  Modal,
  Radio,
  Select, Tabs,
} from 'antd';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { VNRAnalysis } from './VNRAnalysis';
import { GoalStatusType } from '../Types';
import IMAGES from '../img/images';
import { fetchDocumentById, fetchMetadata, submitDocumentsForAnalysis } from '../api/prioritiesCall';
import { extractTextFromMultiplePdfs } from '../utils/extractPDF';

interface Props {
  countrySelected: string;
  countryFullName: string;
  goalStatuses: GoalStatusType[];
}

const HeroImageEl = styled.div`
  background: url(${IMAGES.heroImage}) rgba(0, 0, 0, 0.3) no-repeat center;
  background-size: cover;
  margin-top: 7.1875rem;
`;

const UploadEl = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  width: fit-content;
  background-color: var(--gray-300);
`;

const UploadButtonEl = styled.div`
  color: var(--black);
  text-transform: uppercase;
  cursor:  pointer;
  justify-content: center;
  padding: 1rem 0.75rem;
  align-items: center;
  display: flex;
  font-size: 0.875rem;
  line-height: 1;
  width: fit-content;
  font-weight: bold;
  &:hover{
    background-color: var(--gray-400);
  }
`;

const CloseIcon = styled.div`
  margin-left: 0.5rem;
  width: 24px;
  height: 24px;
  background-color: var(--dark-red);
  -webkit-mask-image: url(https://design.undp.org/icons/times.svg);
  mask-image: url(https://design.undp.org/icons/times.svg);
  mask-size: 24px;
`;

const FileAttachmentButton = styled.input`
  display: none;
`;

const FILES_LIMIT = 20;

export const Priorities = (props: Props) => {
  const {
    countrySelected,
    countryFullName,
    goalStatuses,
  } = props;
  const fileInputRef = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const [countryFilePresent, setCountryFilePresent] = useState<boolean | undefined>(false);
  const [totalFileSize, setTotalFileSize] = useState(0);
  const [noOfFiles, setNoOfFiles] = useState(0);
  const [selectedFile, setSelectedFile] = useState<any>([]);
  const [selectedFileNotAnalyzed, setSelectedFileNotAnalyzed] = useState<any>([]);
  const [vnrYear, setVNRYear] = useState<null | number>(null);
  const [selectYear, setSelectYear] = useState<null | number>(null);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  const [countryVNRs, setCountryVNRs] = useState<any>(null);
  const [strategy, setStrategy] = useState<'equal' | 'proportional'>('equal');
  const [selectedDocument, setSelectedDocument] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const metadata = await fetchMetadata(countrySelected);
        setCountryFilePresent(metadata.length > 0);
        if (metadata.length > 0) {
          setCountryVNRs(metadata);
          setSelectedDocument(metadata[0]._id);
        } else {
          setError('No VNRs');
        }
      } catch (err) {
        setError(err);
      }
    };

    fetchData();
  }, [countrySelected]);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        if (selectedDocument) {
          const documentData = await fetchDocumentById(selectedDocument);
          setData({ mode: 'defaultDocs', data: documentData.sdgs, documents: documentData.metadata });
        }
      } catch (err) {
        setError(err);
      }
    };

    fetchDocument();
  }, [selectedDocument]);

  const handleFileSelect = (event: any) => {
    if (event.target.files) {
      if (event.target.files[0]) {
        const files: any = [...selectedFileNotAnalyzed].concat([...event.target.files].map((d: any) => d));
        let totalSize = 0;
        files.forEach((d: any) => { totalSize += (d.size / 1024 / 1024); });
        setTotalFileSize(totalSize);
        setNoOfFiles(files.length);
        setSelectedFileNotAnalyzed(files);
      }
    }
  };

  const handleFileRemove = (fileToRemove: any) => {
    const updatedFiles = selectedFileNotAnalyzed.filter((file: any) => file !== fileToRemove);
    let totalSize = 0;
    updatedFiles.forEach((file: any) => { totalSize += (file.size / 1024 / 1024); });
    setTotalFileSize(totalSize);
    setNoOfFiles(updatedFiles.length);
    setSelectedFileNotAnalyzed(updatedFiles);
  };

  const analyzeDocument = async () => {
    try {
      const textsFiles = await extractTextFromMultiplePdfs(selectedFileNotAnalyzed);

      const validFiles = textsFiles.filter((file) => !file.error && file.text);
      const invalidFiles = textsFiles.filter((file) => file.error || !file.text);

      console.log('error files: ', invalidFiles);

      const plaintextFiles = validFiles.map((file) => {
        const blob = new Blob([file.text], { type: 'text/plain' });
        return new File([blob], `${file.file_name}.txt`, { type: 'text/plain' });
      });

      if (plaintextFiles.length === 0) {
        setError('No valid text files to submit for analysis.');
        setLoading(false);
        return;
      }

      const pagesArray = validFiles.map((file) => Number(file.pageCount));
      const response = await submitDocumentsForAnalysis(
        plaintextFiles,
        strategy === 'proportional' ? pagesArray : undefined,
      );

      const filesWithoutTxtExtension = plaintextFiles.map((file) => {
        const originalFileName = file.name.replace(/\.txt$/, '');
        return new File([file], originalFileName, { type: file.type });
      });

      setSelectedFile(filesWithoutTxtExtension);
      setData({ mode: 'analyze', data: response.sdgs });
      setLoading(false);
      setError(null);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  const analyzeVNR = async () => {
    try {
      if (selectYear) {
        const metadata = await fetchMetadata(countrySelected, selectYear);
        if (metadata.length > 0) {
          const documentData = await fetchDocumentById(metadata[0].id);
          setData(documentData.sdgs);
          setVNRYear(selectYear);
          setError(null);
        } else {
          setError('No VNRs');
        }
      }
    } catch (err) {
      setError(err);
    }
  };

  return (
    <>
      <HeroImageEl className='undp-hero-image'>
        <div className='undp-breadcrumb-light margin-bottom-10 max-width-1440' style={{ marginLeft: 'auto', marginRight: 'auto' }}>
          <a href='../'>
            SDG Push Diagnostics
          </a>
          <div className='divider'>/</div>
          <a href='./'>
            {countryFullName}
          </a>
          <div className='divider'>/</div>
          <span>
            National Priorities
          </span>
        </div>
        <div
          className='max-width-1440'
          style={{
            backgroundColor: 'var(--white)', color: 'var(--black)', padding: 'var(--spacing-06)', margin: 'auto',
          }}
        >
          <h1 className='undp-typography'>
            National Priorities For
            {' '}
            {countryFullName}
          </h1>
          <div className='margin-top-07'>
            {
              !data && countryFilePresent === undefined
                ? (
                  <div style={{ margin: '10rem auto 3rem auto', minHeight: '5rem' }}>
                    <div className='undp-loader' style={{ margin: 'auto' }} />
                  </div>
                )
                : (
                  <Tabs
                    defaultActiveKey={!data && countryFilePresent === false ? 'vnrs' : 'nationalPriorities'}
                    className='undp-tabs'
                    onChange={() => {
                      setStrategy('equal');
                    }}
                    items={[
                      {
                        label: !data && countryFilePresent === false ? 'Analyze VNRs' : 'National Priorities',
                        key: !data && countryFilePresent === false ? 'vnrs' : 'nationalPriorities',
                        children: !data && countryFilePresent === false ? (
                          <>
                            <h5 className='undp-typography' style={{ color: 'var(--black)' }}>
                              Countries national priorities are generated using machine learning to reveal the most prominent SDGs referenced in national policy documents. This analysis uses a custom-built model for SDG classification. The training data is based on an improved
                              {' '}
                              <a href='https://zenodo.org/record/6831287#.ZGVKt3ZBxhZ' target='_blank' rel='noreferrer noopener' className='undp-style'>OSDG Community Dataset</a>
                              . It considers 100k+ terms, including phrases and expressions.
                              <br />
                              <br />
                              Documents such as
                              {' '}
                              <a href='https://sustainabledevelopment.un.org/vnrs/' target='_blank' rel='noreferrer noopener' className='undp-style'>Voluntary National Reviews (VNRs)</a>
                              {' '}
                              indicates priorities of the government that can be mapped to the SDGs. These priorities are important as we develop the SDG Push interventions by country.
                              <br />
                              <br />
                              Explore the analysis of these priorities using Machine Learning.
                            </h5>
                            {
                              countryVNRs
                                ? countryVNRs.length > 0
                                  ? (
                                    <>
                                      <div className='margin-top-07'>
                                        <p className='label undp-typography'>Select year</p>
                                        <Select
                                          className='undp-select margin-bottom-07'
                                          placeholder='Select Year'
                                          value={selectYear}
                                          onChange={(value) => { setSelectYear(value); }}
                                        >
                                          {
                                            countryVNRs.map((d: any, i: number) => (
                                              <Select.Option key={i} className='undp-select-option' value={d.year}>
                                                {d.year}
                                              </Select.Option>
                                            ))
                                          }
                                        </Select>
                                      </div>
                                      <button
                                        type='button'
                                        className='margin-top-05 undp-button button-primary button-arrow margin-top-07'
                                        onClick={() => {
                                          analyzeVNR();
                                        }}
                                      >
                                        Analyze VNR
                                      </button>
                                    </>
                                  )
                                  : (
                                    <>
                                      <div className='margin-top-07 margin-bottom-07'>
                                        <Select
                                          className='undp-select'
                                          placeholder='No VNRs Available'
                                          disabled
                                        />
                                      </div>
                                      <button type='button' className='margin-top-05 undp-button button-primary button-arrow margin-top-07 disabled'>
                                        Analyze VNR
                                      </button>
                                    </>
                                  )
                                : (
                                  <div>
                                    <div className='undp-loader' style={{ margin: 'auto' }} />
                                  </div>
                                )
                            }
                          </>
                        ) : (
                          <>
                            <h5 className='undp-typography' style={{ color: 'var(--black)', lineHeight: 1.5 }}>
                              Documents such as National Development Plans indicate priorities of the government that can be mapped to the SDGs. These priorities are important as we develop the SDG Push interventions by country.
                              <br />
                              <br />
                              Explore the analysis of these priorities using Machine Learning.
                            </h5>
                            <Select
                              className='undp-select margin-bottom-07'
                              placeholder='Select Document'
                              value={selectedDocument}
                              onChange={(value) => { setSelectedDocument(value); }}
                            >
                              {
                                countryVNRs.map((d: any, i: number) => (
                                  <Select.Option key={i} className='undp-select-option' value={d._id}>
                                    {d.name}
                                  </Select.Option>
                                ))
                              }
                            </Select>
                          </>
                        ),
                      },
                      {
                        label: 'Upload documents',
                        key: 'upload',
                        children: (
                          <>
                            <h5 className='undp-typography' style={{ color: 'var(--black)' }}>
                              Documents such as National Development Plans indicates priorities of the government that can be mapped to the SDGs. Upload a development plan, to discover which SDGs feature most prominently as a priority.
                              <br />
                              <br />
                              Explore the analysis of these priorities using Machine Learning.
                              {' '}
                              <span className='italics' style={{ color: 'var(--gray-500)' }}>
                                Upto
                                {' '}
                                {FILES_LIMIT}
                                {' '}
                                documents allowed
                              </span>
                            </h5>
                            <>
                              <div className='margin-top-07'>
                                {
                                  selectedFileNotAnalyzed.length > 0
                                    ? (
                                      <div className='flex-div margin-bottom-05 flex-wrap'>
                                        {
                                          selectedFileNotAnalyzed.map((d: any, i: number) => (
                                            <div className='undp-chip-gray undp-chip' key={i}>
                                              {d.name}
                                              {' '}
                                              (
                                              {(d.size / 1024 / 1024).toFixed(1)}
                                              {' '}
                                              MBs)
                                              <CloseIcon onClick={() => handleFileRemove(d)} />
                                            </div>
                                          ))
                                        }
                                      </div>
                                    ) : null
                                }
                                <UploadEl>
                                  <label htmlFor='file-upload-analyze' className='custom-file-upload'>
                                    <UploadButtonEl>Add Documents</UploadButtonEl>
                                  </label>
                                  <FileAttachmentButton multiple ref={fileInputRef} id='file-upload-analyze' accept='application/pdf' type='file' onChange={handleFileSelect} />
                                </UploadEl>
                              </div>
                              <div className='margin-top-07 margin-bottom-07'>
                                <Collapse
                                  className='undp-accordion no-background'
                                  accordion
                                  bordered={false}
                                  expandIcon={({ isActive }) => (isActive ? (<ChevronUp size={32} strokeWidth={1} stroke='var(--red)' />) : (<ChevronDown size={32} strokeWidth={1} stroke='var(--red)' />))}
                                  size='small'
                                  expandIconPosition='end'
                                >
                                  <Collapse.Panel header='Advanced Options' key='1'>
                                    <p className='label'>Document Weighting Strategy</p>
                                    <Radio.Group value={strategy} onChange={(target) => { setStrategy(target.target.value); }}>
                                      <Radio className='undp-radio' value='equal'>Place Equal Weight on All Documents</Radio>
                                      <br />
                                      <Radio className='undp-radio' value='proportional'>Place More Weight on Longer Documents</Radio>
                                    </Radio.Group>
                                  </Collapse.Panel>
                                </Collapse>
                              </div>
                              {
                                selectedFileNotAnalyzed.length > 0 && noOfFiles <= FILES_LIMIT && totalFileSize <= 150
                                  ? (
                                    <button
                                      type='button'
                                      className='margin-top-05 undp-button button-primary button-arrow margin-top-07'
                                      onClick={() => {
                                        setLoading(true);
                                        analyzeDocument();
                                      }}
                                    >
                                      Analyze Document
                                    </button>
                                  )
                                  : (
                                    <button type='button' className='margin-top-05 undp-button button-primary button-arrow margin-top-07 disabled'>
                                      Analyze Document
                                    </button>
                                  )
                              }
                              {
                                noOfFiles > FILES_LIMIT || totalFileSize > 150 ? (
                                  <p className='undp-typography small-font italics margin-top-05' style={{ color: 'var(--dark-red)' }}>
                                    {
                                      noOfFiles > FILES_LIMIT ? `You have exceeded the limit of ${FILES_LIMIT} files. Please remove ${noOfFiles - FILES_LIMIT} file(s)). ` : ''
                                    }
                                    {
                                      totalFileSize > 150 ? 'Maximum total file size allowed is 200Mbs' : ''
                                    }
                                  </p>
                                ) : null
                              }
                            </>
                          </>
                        ),
                      },
                    ]}
                  />
                )
            }
          </div>
        </div>
      </HeroImageEl>
      {
        error
          ? (
            <div
              className='margin-top-07 margin-bottom-13 max-width'
              style={{
                padding: 'var(--spacing-09)', backgroundColor: 'var(--gray-200)', width: '100%', textAlign: 'center',
              }}
            >
              <h6 className='undp-typography margin-bottom-00' style={{ color: 'var(--dark-red)' }}>
                {
                  error === 'No VNRs' ? `We don't a VNR for ${countryFullName} available in our database. Please try to upload a document and analyze it.`
                    : (
                      <>
                        We are sorry! Something went wrong in the analysis.
                        <br />
                        <br />
                        Please try again later after sometime and make sure you are uploading a PDF document
                      </>
                    )
                }
              </h6>
            </div>
          )
          : data
            ? (
              <VNRAnalysis
                data={data.mode === 'analyze' || data.mode === 'defaultDocs' ? data.data : data}
                goalStatuses={goalStatuses}
                document={data.mode === 'analyze' ? selectedFile.map((d: any) => d.name) : data.mode === 'defaultDocs' ? data.documents : [`VNR ${vnrYear}`]}
                defaultDocs={data.mode === 'defaultDocs'}
                onlyBubbleChart={false}
              />
            )
            : null
      }
      <Modal
        className='undp-modal undp-loading-modal'
        title=''
        open={loading}
      >
        <div style={{ margin: 'auto' }}>
          <div className='undp-loader' style={{ margin: 'auto' }} />
        </div>
      </Modal>
    </>
  );
};
