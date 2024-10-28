/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/label-has-associated-control */
import styled from 'styled-components';
import {
  Alert,
  message,
  Modal,
  Popover,
  Segmented,
  Select,
  Table,
  Tabs,
  Tooltip,
  Upload,
} from 'antd';
import { UploadFile, UploadChangeParam } from 'antd/lib/upload/interface';
import { useEffect, useState } from 'react';
import { FileUpIcon } from 'lucide-react';
import { InfoCircleOutlined } from '@ant-design/icons';
import { VNRAnalysis } from './VNRAnalysis';
import { GoalStatusType } from '../Types';
import IMAGES from '../img/images';
import { fetchDocumentById, fetchMetadata, submitDocumentsForAnalysis } from '../api/prioritiesCall';
import { extractTextFromPDFs } from '../utils/extractPDF';
import './index.css';

interface Props {
  countrySelected: string;
  countryFullName: string;
  goalStatuses: GoalStatusType[];
}

const HeroImageEl = styled.div`
  background: url(${IMAGES.blueHeroImage}) rgba(0, 0, 0, 0.3) no-repeat center;
  background-size: cover;
  margin-top: 7.1875rem;
`;

const FILES_LIMIT = 30;

export const Priorities = (props: Props) => {
  const {
    countrySelected,
    countryFullName,
    goalStatuses,
  } = props;
  const [loading, setLoading] = useState(false);
  const [countryFilePresent, setCountryFilePresent] = useState<boolean | undefined>(false);
  const [selectedFile, setSelectedFile] = useState<any>([]);
  const [selectedFileNotAnalyzed, setSelectedFileNotAnalyzed] = useState<any>([]);
  const [vnrYear, setVNRYear] = useState<null | number>(null);
  const [selectYear, setSelectYear] = useState<null | number>(null);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  const [countryVNRs, setCountryVNRs] = useState<any>(null);
  const [model, setModel] = useState<'legacy' | 'newer'>('newer');
  const [strategy, setStrategy] = useState<'equal' | 'proportional' | 'custom'>('equal');
  const [status, setStatus] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState();
  const [fileNames, setFileNames] = useState(new Set());
  const [textFiles, setTextFiles] = useState<any[]>([]);
  const [isExtracting, setisExtracting] = useState(false);
  const [extractionError, setExtractionError] = useState(new Set<string>());
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [customWeights, setCustomWeights] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const metadata = await fetchMetadata(countrySelected);
        setCountryFilePresent(metadata.length > 0);
        if (metadata.length > 0) {
          setCountryVNRs(metadata);
          setSelectedDocument(metadata[0]._id);
        } else {
          setCountryVNRs([]);
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

  const analyzeDocuments = async (textsFiles: any[]) => {
    try {
      setStatus('Starting analysis...');

      const plaintextFiles = textsFiles.map((file) => {
        const blob = new Blob([file.text], { type: 'text/plain' });
        return new File([blob], `${file.file_name}.txt`, { type: 'text/plain' });
      });

      if (plaintextFiles.length === 0) {
        setError('No valid text files to submit for analysis.');
        setLoading(false);
        return;
      }

      setStatus(`Analyzing ${textFiles.length} document(s)...`);
      const pagesArray = textsFiles.map((file) => Number(file.pageCount));
      const customWeightsArray = textsFiles.map((file) => customWeights[file.file_name] || 1);

      const response = await submitDocumentsForAnalysis(
        plaintextFiles,
        strategy === 'proportional' ? pagesArray : strategy === 'custom' ? customWeightsArray : undefined,
        model === 'newer' ? 2 : 1,
      );

      const filesWithoutTxtExtension = plaintextFiles.map((file) => {
        const originalFileName = file.name.replace(/\.txt$/, '');
        return new File([file], originalFileName, { type: file.type });
      });

      setStatus('Analysis complete');

      setSelectedFile(filesWithoutTxtExtension);
      setData({ mode: 'analyze', data: response.sdgs });
      setLoading(false);
      setStatus(null);
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

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleCustomWeightChange = (fileName: string, value: number) => {
    setCustomWeights((prevWeights) => ({
      ...prevWeights,
      [fileName]: value,
    }));
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
            backgroundColor: 'var(--white)', color: 'var(--black)', padding: 'var(--spacing-06)', margin: 'auto', cursor: isExtracting ? 'progress' : '',
          }}
        >
          <h1 className='undp-typography'>
            National Priorities For
            {' '}
            {countryFullName}
          </h1>
          <div className='margin-top-05'>
            <h5 className='undp-typography margin-bottom-06' style={{ color: 'var(--black)' }}>
              Documents such as National Development Plans indicate priorities of the government that can be mapped to the SDGs. These priorities are important as we develop the SDG Push interventions by country. Upload a development plan, or select from the list of documents to discover which SDGs feature most prominently as a priority.
              {' '}
              <br />
              <br />
              Explore the analysis of these priorities using
              {' '}
              <Popover
                placement='rightBottom'
                content={(
                  <div style={{
                    maxWidth: '500px', maxHeight: '400px', padding: 25, textAlign: 'justify', overflowY: 'scroll',
                  }}
                  >
                    <h5 className='undp-typography' style={{ color: 'var(--black)', fontSize: 16 }}>
                      Countries&apos; national priorities are generated using machine learning to reveal the most prominent SDGs referenced in national policy documents. This analysis uses a custom-built model for SDG classification.
                      {' '}
                      <br />
                      <br />
                      {' '}
                      The training data is based on an improved
                      {' '}
                      <a href='https://zenodo.org/record/6831287#.ZGVKt3ZBxhZ' target='_blank' rel='noreferrer noopener' className='undp-style'>OSDG Community Dataset</a>
                      . It considers 100k+ terms, including phrases and expressions.
                    </h5>
                  </div>
                )}
              >
                <span style={{
                  cursor: 'pointer', textDecoration: 'underline', textDecorationStyle: 'dotted', textDecorationColor: 'var(--dark-red)', background: 'none', border: 'none', padding: 0,
                }}
                >
                  our machine learning approach
                  {' '}
                  <InfoCircleOutlined />
                </span>
              </Popover>
            </h5>
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
                      setModel('newer');
                      setStrategy('equal');
                    }}
                    items={[
                      {
                        label: !data && countryFilePresent === false ? 'Select Documents' : 'Select Documents',
                        key: !data && countryFilePresent === false ? 'vnrs' : 'nationalPriorities',
                        children: !data && countryFilePresent === false ? (
                          <>
                            {
                              countryVNRs
                                ? countryVNRs.length > 0
                                  ? (
                                    <>
                                      <div className='margin-top-00'>
                                        <p className='label undp-typography'>Select year</p>
                                        <Select
                                          className='undp-select margin-bottom-02'
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
                                      <span style={{
                                        fontSize: 'smaller', color: 'GrayText', paddingTop: 2, marginTop: 0,
                                      }}
                                      >
                                        Scroll down to explore the analysis
                                      </span>
                                    </>
                                  )
                                  : (
                                    <>
                                      <div className='margin-bottom-02'>
                                        <Select
                                          className='undp-select'
                                          placeholder='No VNRs Available'
                                          disabled
                                        />
                                      </div>
                                      <button type='button' className='margin-top-05 undp-button button-primary button-arrow margin-top-07 disabled'>
                                        Analyze VNR
                                      </button>
                                      <span style={{
                                        fontSize: 'smaller', color: 'GrayText', paddingTop: 0, marginTop: 0,
                                      }}
                                      >
                                        Upload documents on the next tab, and scroll down to explore the analysis
                                      </span>
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
                            <Select
                              className='undp-select margin-bottom-02'
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
                            <span style={{
                              fontSize: 'smaller', color: 'GrayText', paddingTop: 0, marginTop: 0,
                            }}
                            >
                              Scroll down to explore the analysis
                            </span>
                          </>
                        ),
                      },
                      {
                        label: 'Analyze Custom Documents',
                        key: 'upload',
                        children: (
                          <>
                            <>
                              <div className='margin-top-04'>
                                <Upload.Dragger
                                  name='file'
                                  multiple
                                  accept='.pdf'
                                  showUploadList
                                  maxCount={FILES_LIMIT}
                                  beforeUpload={(file) => {
                                    const isPDF = file.type === 'application/pdf';
                                    if (!isPDF) {
                                      message.error(`${file.name} is not a PDF file`);
                                      return Upload.LIST_IGNORE;
                                    }

                                    if (fileNames.has(file.name)) {
                                      message.error(`${file.name} is a duplicate file`);
                                      return Upload.LIST_IGNORE;
                                    }

                                    if (selectedFileNotAnalyzed.length >= FILES_LIMIT) {
                                      message.error(`You can only upload up to ${FILES_LIMIT} files`);
                                      return Upload.LIST_IGNORE;
                                    }

                                    return true;
                                  }}
                                  onChange={
                                    (info: UploadChangeParam<UploadFile>) => {
                                      const newFileList = info.fileList;

                                      setSelectedFileNotAnalyzed(newFileList);

                                      const newFileNames = new Set(newFileList.map((file) => file.name));
                                      setFileNames(newFileNames);

                                      const newUploadErrors = new Set<string>();
                                      newFileList.forEach((file) => {
                                        if (file.status === 'error') {
                                          newUploadErrors.add(file.uid);
                                        }
                                      });
                                      setExtractionError(newUploadErrors);
                                    }
                                  }
                                  onRemove={(file) => {
                                    setTextFiles((prevTextFiles) => prevTextFiles.filter((textFile) => textFile.file_name !== file.name));
                                    return true;
                                  }}
                                  onDrop={(e) => {
                                    message.info(`Dropped files: ${e.dataTransfer.files.length}`);
                                  }}
                                  customRequest={async ({ file, onSuccess, onError }: any) => {
                                    setisExtracting(true);
                                    try {
                                      const [extractedText] = await extractTextFromPDFs([file]);

                                      if (extractedText.error) {
                                        throw new Error(extractedText.text);
                                      }

                                      if (onSuccess) {
                                        onSuccess('ok');
                                      }

                                      setSelectedFileNotAnalyzed((prevList: any[]) => prevList.map((f) => (f.uid === file.uid
                                        ? { ...f, status: 'done', response: 'ok' }
                                        : f)));

                                      setTextFiles((prevTextFiles) => [...prevTextFiles, extractedText]);

                                      // eslint-disable-next-line no-shadow
                                    } catch (error: any) {
                                      if (onError) {
                                        onError(error);
                                      }

                                      setSelectedFileNotAnalyzed((prevList: any[]) => prevList.map((f) => (f.uid === file.uid
                                        ? { ...f, status: 'error', error: error.message }
                                        : f)));
                                    } finally {
                                      setisExtracting(false);
                                    }
                                  }}
                                  itemRender={(originNode) => (
                                    <div>
                                      <div
                                        style={{
                                          flexGrow: 0,
                                          flexShrink: 1,
                                          minWidth: '205px',
                                          maxWidth: '205px',
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                        }}
                                      >
                                        {originNode}
                                      </div>
                                    </div>
                                  )}
                                >
                                  <FileUpIcon />
                                  <p className='ant-upload-text'>Click or drag file(s) to this area then click Analyze Documents</p>
                                  <p className='ant-upload-hint'>
                                    Up to
                                    {' '}
                                    {FILES_LIMIT}
                                    {' '}
                                    PDFs allowed. Only English language is currently supported by the model
                                    {' '}
                                    <br />
                                    <b>Note:</b>
                                    {' '}
                                    Documents are not persisted after analysis, you will not be able to access the raw document later
                                  </p>
                                </Upload.Dragger>
                              </div>
                              <>
                                {extractionError.size > 0 && <Alert style={{ marginTop: 20 }} type='error' message='Remove invalid documents to proceed with analysis. Hover on each file to understand why a file is invalid' />}

                                <div className='margin-top-07 margin-bottom-04' style={{ display: 'flex', flexDirection: 'row', gap: 20 }}>

                                  <div>
                                    <button
                                      type='button'
                                      className='undp-button button-primary button-arrow'
                                      style={{ backgroundColor: textFiles.length === 0 || textFiles.length > FILES_LIMIT || isExtracting || extractionError.size > 0 ? 'gray' : '' }}
                                      onClick={() => {
                                        setLoading(true);
                                        analyzeDocuments(textFiles);
                                      }}
                                      disabled={textFiles.length === 0 || textFiles.length > FILES_LIMIT || isExtracting || extractionError.size > 0}
                                    >
                                      Analyze Documents
                                    </button>
                                  </div>

                                  <div>
                                    <button
                                      type='button'
                                      className='undp-button button-secondary'
                                      style={{ backgroundColor: 'white', color: 'black' }}
                                      onClick={showModal}
                                    >
                                      Advanced Options
                                    </button>
                                    <Modal
                                      className='undp-modal'
                                      title='Advanced Options'
                                      open={isModalVisible}
                                      onOk={handleOk}
                                      onCancel={handleCancel}
                                    >
                                      <p className='undp-typography label'>
                                        Model Selection
                                        {' '}
                                        <Tooltip title='Select which machine learning model version to use' placement='topLeft'>
                                          <InfoCircleOutlined />
                                        </Tooltip>
                                      </p>
                                      <Segmented
                                        className='undp-segmented-small'
                                        options={[
                                          { label: 'Legacy Model', value: 'legacy' },
                                          { label: 'Newer Model', value: 'newer' },
                                        ]}
                                        value={model}
                                        onChange={(value: 'legacy' | 'newer') => setModel(value)}
                                      />

                                      <p className='undp-typography label margin-top-05'>
                                        Document Weighting Strategy
                                        {' '}
                                        <Tooltip title='Are some documents more important than others?' placement='topLeft'>
                                          <InfoCircleOutlined />
                                        </Tooltip>
                                      </p>
                                      <Segmented
                                        className='undp-segmented-small'
                                        options={[
                                          { label: 'Equal', value: 'equal' },
                                          { label: 'Length-based', value: 'proportional' },
                                          { label: 'Custom', value: 'custom' },
                                        ]}
                                        value={strategy}
                                        onChange={(value: 'equal' | 'proportional' | 'custom') => setStrategy(value)}
                                      />

                                      {strategy === 'equal' && (
                                        <div style={{ marginTop: '1rem' }}>
                                          <h4>The model treats all documents to have equal importance.</h4>
                                        </div>
                                      )}

                                      {strategy === 'proportional' && (
                                        <div style={{ marginTop: '1rem' }}>
                                          <Table
                                            columns={[
                                              {
                                                title: 'Documents',
                                                dataIndex: 'name',
                                                key: 'name',
                                              },
                                              {
                                                title: (
                                                  <>
                                                    Pages
                                                    {' '}
                                                    <Tooltip title='The importance of each document is determined by the number of pages' placement='topRight'>
                                                      <InfoCircleOutlined />
                                                    </Tooltip>
                                                  </>
                                                ),
                                                dataIndex: 'pageCount',
                                                key: 'pageCount',
                                              },
                                            ]}
                                            dataSource={textFiles
                                              .map((file) => ({
                                                key: file.file_name,
                                                name: file.file_name,
                                                pageCount: file.pageCount,
                                              }))
                                              .sort((a, b) => b.pageCount - a.pageCount)}
                                            pagination={false}
                                          />
                                        </div>
                                      )}

                                      {strategy === 'custom' && (
                                        <div style={{ marginTop: '1rem' }}>
                                          <Table
                                            columns={[
                                              {
                                                title: 'Documents',
                                                dataIndex: 'name',
                                                key: 'name',
                                              },
                                              {
                                                title: (
                                                  <>
                                                    Importance Weight
                                                    {' '}
                                                    <Tooltip title='Set relative importance weight for each document' placement='topRight'>
                                                      <InfoCircleOutlined />
                                                    </Tooltip>
                                                  </>
                                                ),
                                                dataIndex: 'customWeight',
                                                key: 'customWeight',
                                                render: (text, record) => (
                                                  <Segmented
                                                    className='undp-segmented-small'
                                                    options={[1, 2, 3, 4, 5].map((val) => ({ label: val.toString(), value: val }))}
                                                    value={customWeights[record.name] || 3}
                                                    onChange={(value) => handleCustomWeightChange(record.name, value)}
                                                    placeholder='Set custom weight'
                                                  />
                                                ),
                                              },
                                            ]}
                                            dataSource={textFiles
                                              .map((file) => ({
                                                key: file.file_name,
                                                name: file.file_name,
                                                customWeight: customWeights[file.file_name] || 1,
                                              }))
                                              .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))}
                                            pagination={false}
                                          />
                                        </div>
                                      )}
                                    </Modal>
                                  </div>

                                </div>

                                <span style={{
                                  fontSize: 'smaller', color: 'GrayText', paddingTop: 2, marginTop: 0,
                                }}
                                >
                                  Scroll down to explore the analysis
                                </span>
                              </>
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
        <div style={{
          display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%',
        }}
        >
          <p>
            {status}
          </p>
        </div>
      </Modal>
    </>
  );
};
