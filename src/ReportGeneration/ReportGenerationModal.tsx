/* eslint-disable jsx-a11y/label-has-associated-control */
import styled from 'styled-components';
import axios, { AxiosResponse } from 'axios';
import { useEffect, useRef, useState } from 'react';
import sortBy from 'lodash.sortby';
import reverse from 'lodash.reverse';
import {
  forceCollide, forceManyBody, forceSimulation, forceX, forceY,
} from 'd3-force';
import { Modal, Radio } from 'antd';
import {
  GoalStatusType, LanguageList, LinkageDataType, SDGSListType, TargetStatusWithDetailsType,
} from '../Types';

import '../style/tabStyle.css';
import '../style/selectStyle.css';
import '../style/modalStyle.css';
import '../style/radioStyle.css';
import { ReportEl } from './ReportEl';
import { API_ACCESS_TOKEN } from '../Constants';

const SDGList:SDGSListType[] = require('../Data/SDGGoalList.json');

const LinkageData:LinkageDataType[] = require('../Data/linkages.json');

interface Props {
  countrySelected: string;
  countryFullName: string;
  goalStatuses: GoalStatusType[];
  // eslint-disable-next-line no-unused-vars
  setOpenModal: (_d: boolean) => void;
  openModal: boolean;
  targetStatuses: any;
}

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

const FileAttachmentButton = styled.input`
  display: none;
`;

const UploadEl = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  width: fit-content;
  background-color: var(--gray-300);
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

export const ReportGenerationModal = (props: Props) => {
  const {
    countrySelected,
    targetStatuses,
    countryFullName,
    goalStatuses,
    openModal,
    setOpenModal,
  } = props;
  const countryCode = countrySelected === 'IDNWithCountryGovInput' ? 'IDN' : countrySelected;
  const [docName, setDocName] = useState<string[]>([]);
  const [totalFileSize, setTotalFileSize] = useState(0);
  const [noOfFiles, setNoOfFiles] = useState(0);
  const [strategy, setStrategy] = useState<'equal' | 'proportional'>('equal');
  const [generatePDFClicked, setGeneratePDFClicked] = useState(false);
  const [isVnrAvailable, setIsVnrAvailable] = useState(false);
  const [nodeData, setNodeData] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  const [language, setLanguage] = useState<LanguageList>('en');
  const [selectedTarget, setSelectedTarget] = useState<undefined | string>(undefined);
  const [dataWithStatuses, setDataWithStatuses] = useState<any>(null);
  const [sdgForInterlinkage, setSDGForInterlinkage] = useState<any>(null);
  const fileInputRef = useRef<any>(null);
  const [selectedFile, setSelectedFile] = useState<any>([]);
  const [docType, setDocType] = useState('Custom');
  const gridSize = 600;
  const margin = 20;
  const cellSize = (gridSize - margin) / 4;
  const nodeRadius = 15;
  const statusArray = ['Identified Gap', 'For Review', 'On Track', 'Gaps NA'];
  const priorityArray = ['High', 'Medium', 'Low', 'No Mention'];
  const targetStatus: TargetStatusWithDetailsType[] = [];
  SDGList.forEach((goal) => {
    goal.Targets.forEach((target) => {
      const status = targetStatuses.findIndex((el: any) => `Target ${el.target}` === target.Target) !== -1 ? targetStatuses[targetStatuses.findIndex((el: any) => `Target ${el.target}` === target.Target)].status : null;
      targetStatus.push({
        goal: goal.Goal,
        target: target.Target,
        description: target['Target Description'],
        status,
      });
    });
  });

  useEffect(() => {
    setNodeData(null);
    const dataTemp = JSON.parse(JSON.stringify(dataWithStatuses));
    forceSimulation(dataTemp)
      .force('charge', forceManyBody().strength(2.25))
      .force('y', forceX().strength(1).x((d: any) => (priorityArray.indexOf(d.category) * cellSize + (cellSize / 2))))
      .force('x', forceY().strength(1).y((d: any) => (statusArray.indexOf(d.status) * cellSize + (cellSize / 2))))
      .force('collision', forceCollide().radius(nodeRadius + 1))
      .tick(100)
      .on('end', () => { setNodeData(dataTemp); });
    if (dataWithStatuses) {
      const SDGListToHighlight = dataWithStatuses.filter((d: any) => d.category === 'High' && d.status === 'Identified Gap').length > 0
        ? dataWithStatuses.filter((d: any) => d.category === 'High' && d.status === 'Identified Gap')
        : dataWithStatuses.filter((d: any) => d.category === 'High' && d.status === 'For Review').length > 0
          ? dataWithStatuses.filter((d: any) => d.category === 'High' && d.status === 'For Review')
          : dataWithStatuses.filter((d: any) => d.category === 'High' && d.status === 'On Track').length > 0
            ? dataWithStatuses.filter((d: any) => d.category === 'High' && d.status === 'On Track')
            : dataWithStatuses.filter((d: any) => d.category === 'High' && d.status === 'Gaps NA');

      const selectedTargetTemp = sortBy(LinkageData.filter((d) => SDGListToHighlight.findIndex((el: any) => el.sdg === parseInt(d.id.split(' ')[1].split('.')[0], 10)) !== -1), (d) => d.synergies.length).reverse()[0].id;
      setSelectedTarget(selectedTargetTemp);
      setSDGForInterlinkage(dataWithStatuses.filter((d:any) => d.sdg === parseInt(selectedTargetTemp.split(' ')[1].split('.')[0], 10))[0]);
    }
  }, [dataWithStatuses]);
  useEffect(() => {
    axios.get(
      'https://sdg-push-diagnostic-api.azurewebsites.net/v1/vnrs/list',
      {
        headers: { access_token: API_ACCESS_TOKEN },
      },
    )
      .then((response:AxiosResponse) => {
        setIsVnrAvailable(response.data.filter((country: any) => country.iso === countryCode.toLowerCase()).length > 0);
      });
  }, [countryCode]);
  const handleFileSelect = (event: any) => {
    if (event.target.files) {
      if (event.target.files[0]) {
        const files: any = [...selectedFile].concat([...event.target.files].map((d: any) => d));
        let totalSize = 0;
        files.forEach((d: any) => { totalSize += (d.size / 1024 / 1024); });
        setTotalFileSize(totalSize);
        setNoOfFiles(files.length);
        setSelectedFile(files);
      }
    }
  };
  const analyzeVNR = (doc: string) => {
    if (doc === 'VNR') {
      axios.get(
        'https://sdg-push-diagnostic-api.azurewebsites.net/v1/vnrs/list',
        {
          headers: { access_token: API_ACCESS_TOKEN },
        },
      )
        .then((response:AxiosResponse) => {
          const countryData = reverse(sortBy(response.data.filter((country: any) => country.iso === countryCode.toLowerCase()), 'year'));
          if (countryData.length > 0) {
            axios.get(
              `https://sdg-push-diagnostic-api.azurewebsites.net/v1/vnrs/find?iso=${countryCode.toLowerCase()}&year=${countryData[0].year}&language=${countryData[0].language}`,
              {
                headers: { access_token: API_ACCESS_TOKEN },
              },
            )
              .then((res) => {
                setDocName([`VNR ${countryData[0].year}`]);
                setData(res.data.sdgs);
                setDataWithStatuses(res.data.sdgs.map((d: any) => ({ ...d, category: d.importance === 0 ? 'No Mention' : d.category.charAt(0).toUpperCase() + d.category.slice(1), status: goalStatuses[goalStatuses.findIndex((el) => el.goal === d.sdg)].status || 'Gaps NA' })));
              })
              .catch((errorFetchingVNR) => {
                setError(errorFetchingVNR.message);
              });
          }
        });
    } else if (selectedFile.length > 0) {
      const formData = new FormData();
      for (let i = 0; i < selectedFile.length; i += 1) {
        formData.append('files', selectedFile[i]);
      }
      axios({
        method: 'post',
        url: `https://sdg-push-diagnostic-api.azurewebsites.net/v1/upload/files?strategy=${strategy}`,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          access_token: API_ACCESS_TOKEN,
        },
      })
        .then((response: any) => {
          if (typeof response.data === 'string') setError('PDF File Required');
          else {
            setDocName(selectedFile.map((d: any) => d.name));
            setData(response.data.sdgs);
            setDataWithStatuses(response.data.sdgs.map((d: any) => ({ ...d, category: d.importance === 0 ? 'No Mention' : d.category.charAt(0).toUpperCase() + d.category.slice(1), status: goalStatuses[goalStatuses.findIndex((el) => el.goal === d.sdg)].status || 'Gaps NA' })));
            setError(null);
          }
        })
        .catch((err) => {
          setError(err.message);
        });
    }
  };
  const resetValues = () => {
    setDocName([]);
    setGeneratePDFClicked(false);
    setNodeData(null);
    setError(null);
    setData(null);
    setSelectedTarget(undefined);
    setDataWithStatuses(null);
    setSDGForInterlinkage(null);
    setSelectedFile([]);
    setDocType('Custom');
    setOpenModal(false);
  };
  return (
    <Modal
      className='undp-modal'
      open={openModal}
      onCancel={() => { resetValues(); }}
      onOk={() => { resetValues(); }}
    >
      <div style={{ width: '70vw', maxWidth: '960px' }}>
        <h5 className='undp-typography'>Generate and Download Report</h5>
        <p className='undp-typography'>
          Please upload documents (max. 10) or or analyze the most recent VNR to identify the national priorities
        </p>
        <Radio.Group onChange={(d) => { setDocType(d.target.value); }} value={docType}>
          <Radio className='undp-radio' value='Custom'>Upload documents</Radio>
          <Radio disabled={!isVnrAvailable} className='undp-radio' value='VNR'>Most Recent VNR</Radio>
        </Radio.Group>
        {
          docType === 'Custom'
            ? (
              <>
                <p className='undp-typography small-font margin-bottom-00 margin-top-07 italics' style={{ color: 'var(--black)' }}>
                  Documents such as National Development Plans indicates priorities of the government that can be mapped to the SDGs. Upload documents, to discover which SDGs feature most prominently as a priority.
                  {' '}
                  <span className='italics' style={{ color: 'var(--gray-500)' }}>Maximum 10 documents allowed</span>
                </p>
                <>
                  <div className='margin-top-03'>
                    {
                      selectedFile.length > 0
                        ? (
                          <div className='flex-div margin-bottom-05 flex-wrap'>
                            {
                              selectedFile.map((d: any, i: number) => (
                                <div className='undp-chip-dark-gray undp-chip' key={i}>
                                  {d.name}
                                  {' '}
                                  (
                                  {(d.size / 1024 / 1024).toFixed(1)}
                                  {' '}
                                  MBs)
                                  <CloseIcon onClick={() => { setSelectedFile(selectedFile.filter((el: any) => d !== el)); }} />
                                </div>
                              ))
                            }
                          </div>
                        ) : null
                    }
                    <UploadEl>
                      <label htmlFor='file-upload-analyze-1' className='custom-file-upload-1'>
                        <UploadButtonEl>Add Documents</UploadButtonEl>
                      </label>
                      <FileAttachmentButton multiple ref={fileInputRef} id='file-upload-analyze-1' accept='application/pdf' type='file' onChange={handleFileSelect} />
                    </UploadEl>
                  </div>
                </>
                <div className='margin-top-07'>
                  <p className='label'>Document Weighting Strategy</p>
                  <Radio.Group value={strategy} onChange={(target) => { setStrategy(target.target.value); }}>
                    <Radio className='undp-radio' value='equal'>Place Equal Weight on All Documents</Radio>
                    <Radio className='undp-radio' value='proportional'>Place More Weight on Longer Documents</Radio>
                  </Radio.Group>
                </div>
              </>
            ) : (
              <p className='undp-typography margin-bottom-00 margin-top-07' style={{ color: 'var(--black)' }}>
                Documents such as Voluntary National Reviews (VNRs) indicates priorities of the government that can be mapped to the SDGs. These priorities are important as we develop the SDG Push interventions by country.
              </p>
            )
        }
        <hr className='undp-style margin-top-07' />
        <p className='undp-typography margin-top-07'>
          Choose the language for the report
        </p>
        <Radio.Group onChange={(d) => { setLanguage(d.target.value); }} value={language}>
          <Radio className='undp-radio' value='en'>English</Radio>
          <Radio className='undp-radio' value='fr'>French</Radio>
          <Radio className='undp-radio' value='es'>Spanish</Radio>
        </Radio.Group>
        <button
          disabled={error ? true : docType === 'Custom' ? selectedFile.length === 0 || noOfFiles > 10 || totalFileSize > 100 : !isVnrAvailable}
          className={`undp-button button-primary button-arrow margin-top-07${error ? ' disabled' : docType === 'Custom' ? selectedFile.length === 0 || noOfFiles > 10 || totalFileSize > 100 ? ' disabled' : '' : !isVnrAvailable ? ' disabled' : ''}`}
          type='button'
          onClick={() => {
            setNodeData(null); analyzeVNR(docType); setGeneratePDFClicked(true);
          }}
        >
          Generate Report
        </button>
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
        <ReportEl
          docName={docName}
          nodeData={nodeData}
          data={data}
          countryFullName={countryFullName}
          countrySelected={countryCode}
          selectedTarget={selectedTarget}
          dataWithStatuses={dataWithStatuses}
          sdgForInterlinkage={sdgForInterlinkage}
          goalStatuses={goalStatuses}
          targetStatus={targetStatus}
          generatePDFClicked={generatePDFClicked}
          language={language}
        />
      </div>
    </Modal>
  );
};
