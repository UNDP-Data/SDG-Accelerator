/* eslint-disable jsx-a11y/label-has-associated-control */
import styled from 'styled-components';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import sortBy from 'lodash.sortby';
import reverse from 'lodash.reverse';
import {
  forceCollide, forceManyBody, forceSimulation, forceX, forceY,
} from 'd3-force';
import { Modal, Radio } from 'antd';
import {
  GoalStatusType, LinkageDataType, SDGSListType, TargetStatusWithDetailsType,
} from '../Types';

import '../style/tabStyle.css';
import '../style/selectStyle.css';
import '../style/modalStyle.css';
import '../style/radioStyle.css';
import { ReportEl } from './ReportEl';

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
interface WidthProps {
  width: string;
}

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

const FileAttachmentButton = styled.input`
  display: none;
`;

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

export const ReportGenerationModal = (props: Props) => {
  const {
    countrySelected,
    targetStatuses,
    countryFullName,
    goalStatuses,
    openModal,
    setOpenModal,
  } = props;
  const [docName, setDocName] = useState<string | undefined>(undefined);
  const [generatePDFClicked, setGeneratePDFClicked] = useState(false);
  const [isVnrAvailable, setIsVnrAvailable] = useState(false);
  const [nodeData, setNodeData] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  const [selectedTarget, setSelectedTarget] = useState<undefined | string>(undefined);
  const [dataWithStatuses, setDataWithStatuses] = useState<any>(null);
  const [sdgForInterlinkage, setSDGForInterlinkage] = useState<any>(null);
  const fileInputRef = useRef<any>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<any>(null);
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
    axios.get('https://sdg-accelerator-api.azurewebsites.net/vnrs')
      .then((response:any) => {
        setIsVnrAvailable(response.data.filter((country: any) => country.iso === countrySelected.toLowerCase()).length > 0);
      });
  }, [countrySelected]);
  const handleFileSelect = (event: any) => {
    if (event.target.files) {
      if (event.target.files[0]) {
        setSelectedFile(event.target.files[0]);
        setSelectedFileName(event.target.files[0].name);
      }
    }
  };
  const analyzeVNR = (doc: string) => {
    if (doc === 'VNR') {
      axios.get('https://sdg-accelerator-api.azurewebsites.net/vnrs')
        .then((response:any) => {
          const countryData = reverse(sortBy(response.data.filter((country: any) => country.iso === countrySelected.toLowerCase()), 'year'));
          if (countryData.length > 0) {
            axios.get(`https://sdg-accelerator-api.azurewebsites.net/vnrs/${countrySelected.toLowerCase()}/${countryData[0].year}/${countryData[0].language}/multiclass/sentence`)
              .then((res) => {
                setDocName(`VNR ${countryData[0].year}`);
                setData(res.data.sdgs);
                setDataWithStatuses(res.data.sdgs.map((d: any) => ({ ...d, category: d.salience === 0 ? 'No Mention' : d.category.charAt(0).toUpperCase() + d.category.slice(1), status: goalStatuses[goalStatuses.findIndex((el) => el.goal === d.sdg)].status || 'Gaps NA' })));
              })
              .catch((errorFetchingVNR) => {
                setError(errorFetchingVNR.message);
              });
          }
        });
    } else if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      axios({
        method: 'post',
        url: 'https://sdg-accelerator-api.azurewebsites.net/upload?model=multilabel&granularity=paragraph',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      })
        .then((response: any) => {
          if (typeof response.data === 'string') setError('PDF File Required');
          else {
            setDocName(selectedFileName);
            setData(response.data.sdgs);
            setDataWithStatuses(response.data.sdgs.map((d: any) => ({ ...d, category: d.salience === 0 ? 'No Mention' : d.category.charAt(0).toUpperCase() + d.category.slice(1), status: goalStatuses[goalStatuses.findIndex((el) => el.goal === d.sdg)].status || 'Gaps NA' })));
            setError(null);
          }
        })
        .catch((err) => {
          setError(err.message);
        });
    }
  };
  const resetValues = () => {
    setDocName(undefined);
    setGeneratePDFClicked(false);
    setNodeData(null);
    setError(null);
    setData(null);
    setSelectedTarget(undefined);
    setDataWithStatuses(null);
    setSDGForInterlinkage(null);
    setSelectedFileName('');
    setSelectedFile(null);
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
          Please select a VNR or upload a document to identify the national priorities
        </p>
        <Radio.Group onChange={(d) => { setDocType(d.target.value); }} value={docType}>
          <Radio className='undp-radio' value='Custom'>Upload a document</Radio>
          <Radio disabled={!isVnrAvailable} className='undp-radio' value='VNR'>Most Recent VNR</Radio>
        </Radio.Group>
        {
        docType === 'Custom'
          ? (
            <>
              <p className='undp-typography margin-bottom-00 margin-top-07' style={{ color: 'var(--black)' }}>
                Documents such as National Development Plans indicates priorities of the government that can be mapped to the SDGs. Upload a development plan, to discover which SDGs feature most prominently as a priority.
              </p>
              <>
                <div className='margin-top-03'>
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
                    <FileAttachmentButton ref={fileInputRef} id='file-upload-analyze' accept='application/pdf' type='file' onChange={handleFileSelect} />
                  </UploadEl>
                </div>
              </>
            </>
          ) : (
            <p className='undp-typography margin-bottom-00 margin-top-07' style={{ color: 'var(--black)' }}>
              Documents such as Voluntary National Reviews (VNRs) indicates priorities of the government that can be mapped to the SDGs. These priorities are important as we develop the SDG Push interventions by country.
            </p>
          )
      }
        <button
          disabled={error ? true : docType === 'Custom' ? !selectedFileName : !isVnrAvailable}
          className={`undp-button button-primary button-arrow margin-top-07${error ? ' disabled' : docType === 'Custom' ? !selectedFileName ? ' disabled' : '' : !isVnrAvailable ? ' disabled' : ''}`}
          type='button'
          onClick={() => {
            setNodeData(null); analyzeVNR(docType); setGeneratePDFClicked(true);
          }}
        >
          Generate Report
        </button>
        <ReportEl
          docName={docName}
          nodeData={nodeData}
          data={data}
          countryFullName={countryFullName}
          countrySelected={countrySelected}
          selectedTarget={selectedTarget}
          dataWithStatuses={dataWithStatuses}
          sdgForInterlinkage={sdgForInterlinkage}
          goalStatuses={goalStatuses}
          targetStatus={targetStatus}
          generatePDFClicked={generatePDFClicked}
        />
      </div>
    </Modal>
  );
};
