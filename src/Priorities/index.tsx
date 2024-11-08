/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
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
import { FileUpIcon, InfoIcon } from 'lucide-react';
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
  const [model, setModel] = useState<'legacy' | 'newer'>('legacy');
  const [strategy, setStrategy] = useState<'equal' | 'proportional' | 'custom'>('equal');
  const [status, setStatus] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState();
  const [fileNames, setFileNames] = useState(new Set());
  const [textFiles, setTextFiles] = useState<any[]>([]);
  const [processingCount, setProcessingCount] = useState<number>(0);
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

  useEffect(() => {
    if (processingCount === 0) {
      setisExtracting(false);
    }
  }, [processingCount]);

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

        <h1 className='undp-typography'>
          National Priorities:
          <br />
          {countryFullName}
        </h1>
        <div className='margin-top-05'>
          <h5 className='undp-typography margin-bottom-06'>
            Policy documents, such as Voluntary National Reviews (VNRs) and National Development Plans (NDPs), provide an insight into the priorities of the country in terms of SDGs.
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
                Our machine learning approach
              </span>
            </Popover>
            {' '}
            allows you to uncover these priorities in such documents. Select an existing document to explore or upload documents to analyze.
            {' '}
            <Tooltip title="The documents you upload are not stored in our system. The results you obtain are not shown to other users. For more robust results, use the documents that offer a comprehensive account of the country&apos;s activities and policies rather than thematic, narrowly-scoped or sectoral documents" placement='bottom'><InfoIcon size={20} /></Tooltip>
          </h5>
          <div
            className='max-width-1440'
            style={{
              backgroundColor: 'var(--white)', color: 'var(--black)', padding: 'var(--spacing-06)', margin: 'auto', cursor: isExtracting ? 'progress' : 'default',
            }}
          >
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
                      setModel('legacy');
                      setStrategy('equal');
                    }}
                    items={[
                      {
                        label: !data && countryFilePresent === false ? 'Explore Documents' : 'Explore Documents',
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
                        label: 'Analyze Documents',
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
                                      message.error(`${file.name} is a duplicate file`, 5);
                                      return Upload.LIST_IGNORE;
                                    }

                                    if (selectedFileNotAnalyzed.length >= FILES_LIMIT) {
                                      message.error(`You can only upload up to ${FILES_LIMIT} files`, 8);
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
                                    setProcessingCount((prev: number) => prev + 1);
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
                                      setProcessingCount((prev: number) => prev - 1);
                                    }
                                  }}
                                  itemRender={(originNode) => (
                                    <div
                                      style={{
                                        flexGrow: 0,
                                        flexShrink: 1,
                                        minWidth: '210px',
                                        maxWidth: '210px',
                                      }}
                                    >
                                      {originNode}
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
                                    PDF files allowed.
                                    {' '}
                                    <b>Note</b>
                                    : Only English language is currently supported by the model
                                    {' '}
                                  </p>
                                </Upload.Dragger>
                              </div>
                              <>
                                {extractionError.size > 0 && (
                                  <Alert
                                    style={{ marginTop: 20 }}
                                    type='error'
                                    message='Remove invalid documents to proceed with analysis. Hover on each file to understand why a file is invalid, or click below to auto remove all invalid files.'
                                  />
                                )}

                                {extractionError.size > 0 && !isExtracting
                                  && (
                                    <button
                                      type='button'
                                      style={{
                                        backgroundColor: 'white', border: 'none', fontSize: 'small', textDecoration: 'underline', cursor: 'pointer',
                                      }}
                                      onClick={() => {
                                        const updatedSelectedFileNotAnalyzed = selectedFileNotAnalyzed.filter(
                                          (file: { uid: string; }) => !extractionError.has(file.uid),
                                        );

                                        setSelectedFileNotAnalyzed(updatedSelectedFileNotAnalyzed);
                                        setExtractionError(new Set());

                                        const uploadComponent = document.querySelector('.ant-upload-list');
                                        if (uploadComponent) {
                                          const fileItems = uploadComponent.querySelectorAll('.ant-upload-list-item');
                                          fileItems.forEach((item) => {
                                            const fileName = item.querySelector('.ant-upload-list-item-name')?.textContent;
                                            if (fileName && !updatedSelectedFileNotAnalyzed.some((file: { name: string; }) => file.name === fileName)) {
                                              const deleteButton = item.querySelector('.ant-upload-list-item-actions button') as HTMLButtonElement;
                                              if (deleteButton) {
                                                setTimeout(() => {
                                                  deleteButton.click();
                                                  item.remove();
                                                }, 5);
                                              }
                                            }
                                          });
                                        }
                                      }}
                                    >
                                      Remove all invalid files
                                    </button>
                                  )}

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
                                        Model Type
                                        {' '}
                                        <Tooltip title='Select which machine learning model version to use' placement='topLeft'>
                                          <InfoCircleOutlined />
                                        </Tooltip>
                                      </p>
                                      <Segmented
                                        className='undp-segmented-small'
                                        options={[
                                          { label: 'Legacy Model', value: 'legacy' },
                                          { label: 'Newer Model (Coming Soon)', value: 'newer', disabled: true },
                                        ]}
                                        value={model}
                                        onChange={(value: 'legacy' | 'newer') => setModel(value)}
                                      />

                                      <p className='undp-typography label margin-top-05'>
                                        Document Weights
                                        {' '}
                                        <Tooltip title='Select how the results are aggregated across the documents.' placement='topLeft'>
                                          <InfoCircleOutlined />
                                        </Tooltip>
                                      </p>
                                      <Segmented
                                        className='undp-segmented-small'
                                        options={[
                                          { label: 'Equal', value: 'equal' },
                                          { label: 'Length-based', value: 'proportional' },
                                          { label: 'Manual', value: 'custom' },
                                        ]}
                                        value={strategy}
                                        onChange={(value: 'equal' | 'proportional' | 'custom') => setStrategy(value)}
                                      />

                                      {strategy === 'equal' && (
                                        <div style={{ marginTop: '1rem' }}>
                                          <p style={{ fontSize: 'smaller' }}>Equal weights assigns uniform weights to all documents. This means that shorter documents contribute to the result as much as longer ones. Select this if the shorter documents in your set are conceptually and practically equally important to the longer ones.</p>
                                          <Table
                                            columns={[
                                              {
                                                title: 'Document',
                                                dataIndex: 'name',
                                                key: 'name',
                                              },
                                              {
                                                title: (
                                                  <>
                                                    Weight
                                                    {' '}
                                                    <Tooltip title='All documents have equal importance' placement='topRight'>
                                                      <InfoCircleOutlined />
                                                    </Tooltip>
                                                  </>
                                                ),
                                                dataIndex: 'value',
                                                key: 'value',
                                              },
                                            ]}
                                            dataSource={textFiles
                                              .map((file) => ({
                                                key: file.file_name,
                                                name: file.file_name,
                                                value: 1,
                                              }))
                                              .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))}
                                            pagination={false}
                                          />
                                        </div>
                                      )}

                                      {strategy === 'proportional' && (
                                        <div style={{ marginTop: '1rem' }}>
                                          <p style={{ fontSize: 'smaller' }}>Length-based weights assigns more weight to longer documents, measured in terms of tokens (words). This means shorter documents contribute less to the result that longer ones. Select this if the shorter documents in your set are conceptually and practically less important than the longer ones.</p>
                                          <Table
                                            columns={[
                                              {
                                                title: 'Document',
                                                dataIndex: 'name',
                                                key: 'name',
                                              },
                                              {
                                                title: (
                                                  <>
                                                    Weight
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
                                          <p style={{ fontSize: 'smaller' }}>Manual weights enables you to specify the weight of each document on a 5-point scale. Larger weight means that the document will have a larger contribution to the end result. Select this is the importance of documents cannot be measured in terms of their lengths alone.</p>
                                          <Table
                                            columns={[
                                              {
                                                title: 'Document',
                                                dataIndex: 'name',
                                                key: 'name',
                                              },
                                              {
                                                title: (
                                                  <>
                                                    Weight
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
