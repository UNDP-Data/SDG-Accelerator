/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/label-has-associated-control */
import styled from 'styled-components';
import axios from 'axios';
import {
  Modal,
  Radio,
  Select, Tabs,
} from 'antd';
import { useEffect, useRef, useState } from 'react';
import sortBy from 'lodash.sortby';
import reverse from 'lodash.reverse';
import { VNRAnalysis } from './VNRAnalysis';
import { CompareAnalysis } from './CompareTable';
import { GoalStatusType } from '../Types';

import '../style/tabStyle.css';
import '../style/selectStyle.css';
import '../style/modalStyle.css';
import '../style/radioStyle.css';
import Background from '../img/UNDP-hero-image.png';
import ChevronRight from '../img/chevron-small-right.svg';
import ChevronDown from '../img/chevron-small-down.svg';

interface Props {
  countrySelected: string;
  countryFullName: string;
  goalStatuses: GoalStatusType[];
}

const HeroImageEl = styled.div`
  background: url(${Background}) rgba(0, 0, 0, 0.3) no-repeat center;
  background-size: cover;
  margin-top: 7.1875rem;
`;

interface WidthProps {
  width: string;
}

const UploadEl = styled.div<WidthProps>`
  display: flex;
  gap: 1rem;
  align-items: center;
  border: 2px solid var(--gray-700);
  background-color: var(--white);
  width: ${(props) => props.width};
  @media (max-width: 1172px) {
    width: 100%;
  }
`;

const Button = styled.button`
  border: 0;
  background-color: transparent;
  padding: 0;
  margin: 0;
  cursor: pointer;
  opacity: 0.7;
  &:hover {
    opacity: 0.9;
  }
`;

const SelectedEl = styled.div`
  font-size: 1rem;
  background-color: var(--gray-100);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
  background-color: var(--gray-200);
  font-weight: bold;
  border-right: 2px solid var(--gray-400);
  &:hover{
    background-color: var(--gray-300);
  }
`;

const FileAttacehmentButton = styled.input`
  display: none;
`;

export const Priorities = (props: Props) => {
  const {
    countrySelected,
    countryFullName,
    goalStatuses,
  } = props;
  const fileInputRef = useRef<any>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [selectedFileNameAnalyzed, setSelectedFileNameAnalyzed] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [selectedCompareFileName1, setSelectedCompareFileName1] = useState<string>('');
  const [selectedCompareFileName1Analyzed, setSelectedCompareFileName1Analyzed] = useState<string>('');
  const [selectedCompareFile1, setSelectedCompareFile1] = useState<any>(null);
  const [selectedCompareFileName2, setSelectedCompareFileName2] = useState<string>('');
  const [selectedCompareFileName2Analyzed, setSelectedCompareFileName2Analyzed] = useState<string>('');
  const [selectedCompareFile2, setSelectedCompareFile2] = useState<any>(null);
  const [vnrYear, setVNRYear] = useState<null | number>(null);
  const [selectYear, setSelectYear] = useState<null | number>(null);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  const [countryVNRs, setCountryVNRs] = useState<any>(null);

  const handleFileSelect = (event: any) => {
    if (event.target.files) {
      if (event.target.files[0]) {
        setSelectedFile(event.target.files[0]);
        setSelectedFileName(event.target.files[0].name);
      }
    }
  };
  const handleCompareFileSelect1 = (event: any) => {
    if (event.target.files) {
      if (event.target.files[0]) {
        setSelectedCompareFile1(event.target.files[0]);
        setSelectedCompareFileName1(event.target.files[0].name);
      }
    }
  };
  const handleCompareFileSelect2 = (event: any) => {
    if (event.target.files) {
      if (event.target.files[0]) {
        setSelectedCompareFile2(event.target.files[0]);
        setSelectedCompareFileName2(event.target.files[0].name);
      }
    }
  };

  const compareDocument = () => {
    if (selectedCompareFile1 && selectedCompareFile2) {
      const formData1 = new FormData();
      formData1.append('file', selectedCompareFile1);
      const formData2 = new FormData();
      formData2.append('file', selectedCompareFile2);
      axios({
        method: 'post',
        url: 'https://sdg-accelerator-api.azurewebsites.net/upload',
        data: formData1,
        headers: { 'Content-Type': 'multipart/form-data' },
      })
        .then((response1: any) => {
          axios({
            method: 'post',
            url: 'https://sdg-accelerator-api.azurewebsites.net/upload',
            data: formData2,
            headers: { 'Content-Type': 'multipart/form-data' },
          })
            .then((response2: any) => {
              if (typeof response2.data === 'string' || typeof response1.data === 'string') setError('PDF File Required');
              else {
                setSelectedCompareFileName1Analyzed(selectedCompareFileName1);
                setSelectedCompareFileName2Analyzed(selectedCompareFileName2);
                setData({ mode: 'compare', data: [response1.data.sdgs, response2.data.sdgs] });
                setError(null);
                setLoading(false);
              }
            })
            .catch((err) => {
              setError(err.message);
              setLoading(false);
            });
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  };

  const analyzeDocument = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      axios({
        method: 'post',
        url: 'https://sdg-accelerator-api.azurewebsites.net/upload',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      })
        .then((response: any) => {
          if (typeof response.data === 'string') setError('PDF File Required');
          else {
            setSelectedFileNameAnalyzed(selectedFileName);
            setData({ mode: 'analyze', data: response.data.sdgs });
            setLoading(false);
            setError(null);
          }
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  };

  const analyzeVNR = () => {
    if (selectYear) {
      const { language } = countryVNRs[countryVNRs.findIndex((d: any) => d.year === selectYear)];
      axios.get(`https://sdg-accelerator-api.azurewebsites.net/vnrs/${countrySelected.toLowerCase()}/${selectYear}/${language}/multilabel/paragraph`)
        .then((res) => {
          setData(res.data.sdgs);
          setVNRYear(selectYear);
          setError(null);
        })
        .catch((errorFetchingVNR) => {
          setError(errorFetchingVNR.message);
        });
    }
  };

  useEffect(() => {
    axios.get('https://sdg-accelerator-api.azurewebsites.net/vnrs')
      .then((response:any) => {
        const countryData = reverse(sortBy(response.data.filter((country: any) => country.iso === countrySelected.toLowerCase()), 'year'));
        setCountryVNRs(countryData);
        if (countryData.length > 0) {
          setVNRYear(countryData[0].year);
          setSelectYear(countryData[0].year);
          axios.get(`https://sdg-accelerator-api.azurewebsites.net/vnrs/${countrySelected.toLowerCase()}/${countryData[0].year}/${countryData[0].language}/multiclass/sentence`)
            .then((res) => {
              setData(res.data.sdgs);
            })
            .catch((errorFetchingVNR) => {
              setError(errorFetchingVNR.message);
            });
        } else {
          setError('No VNRs');
        }
      });
  }, [countrySelected]);
  return (
    <>
      <HeroImageEl className='undp-hero-image'>
        <div className='max-width-1440' style={{ backgroundColor: 'var(--white)', color: 'var(--black)', padding: 'var(--spacing-06)' }}>
          <h1 className='undp-typography'>
            Show Current Priorities For
            {' '}
            {countryFullName}
          </h1>
          <div className='margin-top-07'>
            <Tabs
              defaultActiveKey='vnrs'
              className='undp-tabs'
              items={[
                {
                  label: 'Analyze VNRs',
                  key: 'vnrs',
                  children: (
                    <>
                      <h5 className='undp-typography' style={{ color: 'var(--black)' }}>
                        Documents such as
                        {' '}
                        <a href='https://sustainabledevelopment.un.org/vnrs/' target='_blank' rel='noreferrer' className='undp-style'>Voluntary National Reviews (VNRs)</a>
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
                                    className='undp-select'
                                    placeholder='Select Year'
                                    value={selectYear}
                                    onChange={(value) => { setSelectYear(value); }}
                                  >
                                    {
                                      countryVNRs.map((d: any, i: number) => <Select.Option key={i} className='undp-select-option' value={d.year}>{d.year}</Select.Option>)
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
                                <div className='margin-top-07'>
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
                  ),
                },
                {
                  label: 'Upload a document',
                  key: 'upload',
                  children: (
                    <>
                      <h5 className='undp-typography' style={{ color: 'var(--black)' }}>
                        Documents such as National Development Plans indicates priorities of the government that can be mapped to the SDGs. Upload a development plan, to discover which SDGs feature most prominently as a priority.
                        <br />
                        <br />
                        Explore the analysis of these priorities using Machine Learning.
                      </h5>
                      <>
                        <div className='margin-top-07'>
                          <UploadEl width='100%'>
                            <label htmlFor='file-upload-analyze' className='custom-file-upload'>
                              <UploadButtonEl style={{ width: '177.55px' }}>Upload a document</UploadButtonEl>
                            </label>
                            {
                              selectedFileName !== '' ? (
                                <SelectedEl>
                                  Selected
                                  {' '}
                                  <span className='bold'>{selectedFileName}</span>
                                </SelectedEl>
                              ) : <SelectedEl style={{ opacity: '0.6' }}>No file selected</SelectedEl>
                            }
                            <FileAttacehmentButton ref={fileInputRef} id='file-upload-analyze' accept='application/pdf' type='file' onChange={handleFileSelect} />
                          </UploadEl>
                        </div>
                        {
                          selectedFileName !== ''
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
                      </>
                    </>
                  ),
                },
                {
                  label: 'Compare two document',
                  key: 'compare',
                  children: (
                    <>
                      <h5 className='undp-typography' style={{ color: 'var(--black)' }}>
                        Upload multiple documents, and compare which SDGs feature most prominently as a priority in each of the documents.
                      </h5>
                      <>
                        <div className='margin-top-07 flex-div flex-wrap'>
                          <UploadEl width='calc(50% - 0.5rem)'>
                            <label htmlFor='file-upload-doc1' className='custom-file-upload'>
                              <UploadButtonEl style={{ width: '205.25px' }}>Upload first document</UploadButtonEl>
                            </label>
                            {
                              selectedCompareFileName1 !== '' ? (
                                <SelectedEl>
                                  Selected
                                  {' '}
                                  <span className='bold'>{selectedCompareFileName1}</span>
                                </SelectedEl>
                              ) : <SelectedEl style={{ opacity: '0.6' }}>No file selected</SelectedEl>
                            }
                            <FileAttacehmentButton ref={fileInputRef} id='file-upload-doc1' accept='application/pdf' type='file' onChange={handleCompareFileSelect1} />
                          </UploadEl>
                          <UploadEl width='calc(50% - 0.5rem)'>
                            <label htmlFor='file-upload-doc2' className='custom-file-upload'>
                              <UploadButtonEl style={{ width: '225.11px' }}>Upload second document</UploadButtonEl>
                            </label>
                            {
                              selectedCompareFileName2 !== '' ? (
                                <SelectedEl>
                                  Selected
                                  {' '}
                                  <span className='bold'>{selectedCompareFileName2}</span>
                                </SelectedEl>
                              ) : <SelectedEl style={{ opacity: '0.6' }}>No file selected</SelectedEl>
                            }
                            <FileAttacehmentButton ref={fileInputRef} id='file-upload-doc2' accept='application/pdf' type='file' onChange={handleCompareFileSelect2} />
                          </UploadEl>
                        </div>
                        {
                          selectedCompareFileName1 !== '' && selectedCompareFileName2 !== ''
                            ? (
                              <button
                                type='button'
                                className='margin-top-05 undp-button button-primary button-arrow margin-top-07'
                                onClick={() => {
                                  setLoading(true);
                                  compareDocument();
                                }}
                              >
                                Compare Documents
                              </button>
                            )
                            : (
                              <button type='button' className='margin-top-05 undp-button button-primary button-arrow margin-top-07 disabled'>
                                Compare Documents
                              </button>
                            )
                        }
                      </>
                    </>
                  ),
                },
              ]}
            />
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
                  error === 'No VNRs' ? `We don't a VNR for ${countryFullName} available in our database. Plese try to upload a document and analyze it.`
                    : (
                      <>
                        We are sorry! Something went wrong in the analysis.
                        <br />
                        <br />
                        Please try again later after sometime and make sure you are uplaoding a PDF document
                      </>
                    )
                }
              </h6>
            </div>
          )
          : data
            ? data.mode !== 'compare'
              ? (
                <VNRAnalysis
                  data={data.mode === 'analyze' ? data.data : data}
                  goalStatuses={goalStatuses}
                  document={data.mode === 'analyze' ? selectedFileNameAnalyzed : `VNR ${vnrYear}`}
                />
              ) : (
                <CompareAnalysis
                  data={data.data}
                  goalStatuses={goalStatuses}
                  document={[selectedCompareFileName1Analyzed, selectedCompareFileName2Analyzed]}
                />
              )
            : null
      }
      <Modal
        className='undp-modal undp-loading-modal'
        title='UNDP Modal'
        open={loading}
      >
        <div style={{ margin: 'auto' }}>
          <div className='undp-loader' style={{ margin: 'auto' }} />
        </div>
      </Modal>
    </>
  );
};
