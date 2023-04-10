/* eslint-disable no-unused-vars */
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
import { VNRAnalysis } from './VNRAnalysis';
import { GoalStatusType } from '../Types';

import '../style/tabStyle.css';
import '../style/selectStyle.css';
import '../style/modalStyle.css';
import '../style/radioStyle.css';
import Background from '../img/UNDP-hero-image.png';
import ChevronRight from '../img/chevron-small-right.svg';
import ChevronDown from '../img/chevron-small-down.svg';
import { API_ACCESS_TOKEN } from '../Constants';

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

const UploadEl = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  width: fit-content;
  background-color: var(--gray-300);
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
              onChange={() => {
                setStrategy('equal');
              }}
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
                                <div className='flex-div margin-bottom-05'>
                                  {
                                selectedFileNotAnalyzed.map((d: any, i: number) => (
                                  <div className='undp-chip-dark-gray undp-chip' key={i}>
                                    {d.name}
                                    <CloseIcon onClick={() => { setSelectedFileNotAnalyzed(selectedFileNotAnalyzed.filter((el: any) => d !== el)); }} />
                                  </div>
                                ))
                              }
                                </div>
                              ) : null
                          }
                          <UploadEl>
                            <label htmlFor='file-upload-analyze' className='custom-file-upload'>
                              <UploadButtonEl>Add Document</UploadButtonEl>
                            </label>
                            <FileAttachmentButton multiple ref={fileInputRef} id='file-upload-analyze' accept='application/pdf' type='file' onChange={handleFileSelect} />
                          </UploadEl>
                        </div>
                        <div className='margin-top-07'>
                          <p className='label'>Document Proportional Strategy</p>
                          <Radio.Group value={strategy} onChange={(target) => { setStrategy(target.target.value); }}>
                            <Radio className='undp-radio' value='equal'>Equal</Radio>
                            <Radio className='undp-radio' value='proportional'>Proportional</Radio>
                          </Radio.Group>
                        </div>
                        {
                          selectedFileNotAnalyzed.length > 0
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
                data={data.mode === 'analyze' ? data.data : data}
                goalStatuses={goalStatuses}
                document={data.mode === 'analyze' ? selectedFile.map((d:any) => d.name) : [`VNR ${vnrYear}`]}
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
