/* eslint-disable jsx-a11y/label-has-associated-control */
import styled from 'styled-components';
import axios, { AxiosResponse } from 'axios';
import {
  Modal,
  Radio,
  Select, Tabs,
} from 'antd';
import { useEffect, useRef, useState } from 'react';
import sortBy from 'lodash.sortby';
import reverse from 'lodash.reverse';
import { json } from 'd3-request';
import { VNRAnalysis } from './VNRAnalysis';
import { GoalStatusType } from '../Types';
import { API_ACCESS_TOKEN, COUNTRIES_WITH_DOCS, DATASOURCELINK } from '../Constants';
import IMAGES from '../img/images';

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

export const Priorities = (props: Props) => {
  const {
    countrySelected,
    countryFullName,
    goalStatuses,
  } = props;
  const fileInputRef = useRef<any>(null);
  const [loading, setLoading] = useState(false);
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

  const analyzeDocument = () => {
    if (selectedFileNotAnalyzed) {
      const formData = new FormData();
      for (let i = 0; i < selectedFileNotAnalyzed.length; i += 1) {
        formData.append('files', selectedFileNotAnalyzed[i]);
      }
      setSelectedFile(selectedFileNotAnalyzed);
      axios({
        method: 'post',
        url: `https://sdg-push-diagnostic-api.azurewebsites.net/v1/upload/files?strategy=${strategy}`,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          access_token: API_ACCESS_TOKEN,
        },
      })
        .then((response: AxiosResponse) => {
          if (typeof response.data === 'string') setError('PDF File Required');
          else {
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
      axios.get(
        `https://sdg-push-diagnostic-api.azurewebsites.net/v1/vnrs/find?iso=${countrySelected.toLowerCase()}&year=${selectYear}&language=${language}`,
        {
          headers: { access_token: API_ACCESS_TOKEN },
        },
      )
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
    if (COUNTRIES_WITH_DOCS.indexOf(countrySelected) === -1) {
      axios.get(
        'https://sdg-push-diagnostic-api.azurewebsites.net/v1/vnrs/list',
        {
          headers: { access_token: API_ACCESS_TOKEN },
        },
      )
        .then((response:AxiosResponse) => {
          const countryData = reverse(sortBy(response.data.filter((country: any) => country.iso === countrySelected.toLowerCase()), 'year'));
          setCountryVNRs(countryData);
          if (countryData.length > 0) {
            setVNRYear(countryData[0].year);
            setSelectYear(countryData[0].year);
            axios.get(
              `https://sdg-push-diagnostic-api.azurewebsites.net/v1/vnrs/find?iso=${countrySelected.toLowerCase()}&year=${countryData[0].year}&language=${countryData[0].language}`,
              {
                headers: { access_token: API_ACCESS_TOKEN },
              },
            )
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
    } else {
      json(`${DATASOURCELINK}/data/PrioritiesData/${countrySelected}.json`, (err: any, d: any) => {
        if (err) { setError(err); }
        setData({ mode: 'defaultDocs', data: d.sdgs, documents: d.doc_name });
      });
    }
  }, [countrySelected]);
  return (
    <>
      <HeroImageEl className='undp-hero-image'>
        <div className='max-width-1440' style={{ backgroundColor: 'var(--white)', color: 'var(--black)', padding: 'var(--spacing-06)' }}>
          <h1 className='undp-typography'>
            National Priorities For
            {' '}
            {countryFullName}
          </h1>
          <div className='margin-top-07'>
            <Tabs
              defaultActiveKey={COUNTRIES_WITH_DOCS.indexOf(countrySelected) === -1 ? 'vnrs' : 'nationalPriorities'}
              className='undp-tabs'
              onChange={() => {
                setStrategy('equal');
              }}
              items={[
                {
                  label: COUNTRIES_WITH_DOCS.indexOf(countrySelected) === -1 ? 'Analyze VNRs' : 'National Priorities',
                  key: COUNTRIES_WITH_DOCS.indexOf(countrySelected) === -1 ? 'vnrs' : 'nationalPriorities',
                  children: COUNTRIES_WITH_DOCS.indexOf(countrySelected) === -1 ? (
                    <>
                      <h5 className='undp-typography' style={{ color: 'var(--black)' }}>
                        Countries national priorities are generated using machine learning to reveal the most prominent SDGs referenced in national policy documents. This analysis uses a custom-built model for SDG classification. The training data is an improved and cleaned
                        {' '}
                        <a href='https://zenodo.org/record/6831287#.ZGVKt3ZBxhZ' target='_blank' rel='noreferrer' className='undp-style'>OSDG Community Dataset</a>
                        {' '}
                        from UNDP IICPSD SDG AI Lab. It considers 100k+ terms, including phrases and expressions.
                        <br />
                        <br />
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
                                    className='undp-select margin-bottom-07'
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
                    <h5 className='undp-typography' style={{ color: 'var(--black)', lineHeight: 1.5 }}>
                      Countries national priorities are generated using machine learning to reveal the most prominent SDGs referenced in national policy documents. This analysis uses a custom-built model for SDG classification. The training data is an improved and cleaned
                      {' '}
                      <a href='https://zenodo.org/record/6831287#.ZGVKt3ZBxhZ' target='_blank' rel='noreferrer' className='undp-style'>OSDG Community Dataset</a>
                      {' '}
                      from UNDP IICPSD SDG AI Lab. It considers 100k+ terms, including phrases and expressions.
                      <br />
                      <br />
                      Documents such as National Development Plans indicate priorities of the government that can be mapped to the SDGs. These priorities are important as we develop the SDG Push interventions by country.
                      <br />
                      <br />
                      Explore the analysis of these priorities using Machine Learning.
                    </h5>
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
                        <span className='italics' style={{ color: 'var(--gray-500)' }}>Maximum 10 documents allowed</span>
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
                                        <CloseIcon onClick={() => { setSelectedFileNotAnalyzed(selectedFileNotAnalyzed.filter((el: any) => d !== el)); }} />
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
                        <div className='margin-top-07'>
                          <p className='label'>Document Weighting Strategy</p>
                          <Radio.Group value={strategy} onChange={(target) => { setStrategy(target.target.value); }}>
                            <Radio className='undp-radio' value='equal'>Place Equal Weight on All Documents</Radio>
                            <Radio className='undp-radio' value='proportional'>Place More Weight on Longer Documents</Radio>
                          </Radio.Group>
                        </div>
                        {
                          selectedFileNotAnalyzed.length > 0 && noOfFiles < 11 && totalFileSize <= 100
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
                          noOfFiles > 10 || totalFileSize > 100 ? (
                            <p className='undp-typography small-font italics margin-top-05' style={{ color: 'var(--dark-red)' }}>
                              {
                                noOfFiles > 10 ? `Maximum 10 files allowed (please remove ${noOfFiles - 10} files). ` : ''
                              }
                              {
                                totalFileSize > 100 ? 'Maximum total file size allowed is 100Mbs' : ''
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
                document={data.mode === 'analyze' ? selectedFile.map((d:any) => d.name) : data.mode === 'defaultDocs' ? data.documents : [`VNR ${vnrYear}`]}
                defaultDocs={data.mode === 'defaultDocs'}
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
