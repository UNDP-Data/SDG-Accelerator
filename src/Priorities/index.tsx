/* eslint-disable jsx-a11y/label-has-associated-control */
import styled from 'styled-components';
import axios from 'axios';
import { Modal, Progress, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { json } from 'd3-request';
import { queue } from 'd3-queue';
import isEqual from 'lodash.isequal';
import omit from 'lodash.omit';
import uniqBy from 'lodash.uniqby';
import meanBy from 'lodash.meanby';
import { getYearsAndValues } from '../utils/getYearsAndValues';
import { PrioritiesVizCard } from './PrioritiesVizCards';
import { COUNTRYOPTION, DATASOURCELINK } from '../Constants';
import { Nav } from '../Header/Nav';
import { PageTitle } from '../Components/PageTitle';
import { getStatus } from '../utils/getStatus';

const RootEl = styled.div`
  width: 128rem;
  margin: 2rem auto 5rem auto;
  padding-bottom: 5rem;
`;

const DescriptionEl = styled.div`
  margin: 0 0 2rem 0;
`;

const SubNote = styled.div`
  font-size: 1.6rem;
  line-height: 2.4rem;
  color: var(--black-700);
  margin-top: 1.6rem;
`;

const FileAttacehmentButton = styled.input`
  display: none;
`;

const FileSelectedBannerEl = styled.div`
  width: 100%;
  font-size: 3.2rem;
  padding: 2rem;
  margin: 0;
  color: var(--black-700);
`;

const SummaryEl = styled.div`
  padding: 4.8rem;
  background-color: var(--black-200);
  font-size: 3rem;
  line-height: 4rem;
  margin-bottom: 2rem;
`;

const ButtonEl = styled.div`
  color: var(--black-700);
  cursor: pointer;
  justify-content: center;
  padding: 0;
  align-items: center;
  display: flex;
  font-size: 1.6rem;
  font-weight: 700;
  letter-spacing: .03em;
  line-height: 1;
  text-transform: uppercase;
  width: fit-content;
  margin-top: 4.8rem;
  &:hover{
    animation: lineLoop-animation 2s linear infinite;
  }
  &:after {
    transition: .2s ease;
    background: url(https://design.undp.org/icons/chevron-right.svg) no-repeat left center;
    content: "";
    height: 20px;
    margin-left: 0.75rem;
    width: 13px;
  }
`;

export const Priorities = () => {
  const countrySelected = useParams().country || 'ZAF';
  const countryFullName = COUNTRYOPTION[COUNTRYOPTION.findIndex((d) => d.code === countrySelected)].countryName;
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [intervalId, setIntervalId] = useState<any>(0);
  const [progressValue, setProgressValue] = useState(0);
  const [goalStatuses, setGoalStatuses] = useState<any>(undefined);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  useEffect(() => {
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
          setData(response.data);
          setOpen(false);
        })
        .catch((err) => {
          setError(err.message);
        });
    }
  }, [selectedFile]);

  useEffect(() => {
    if (selectedFile && open && !error) {
      let currentProgress = 0;
      let step = 0.05;
      const newIntervalId = setInterval(() => {
        currentProgress += step;
        let progress = Math.round((Math.atan(currentProgress) / (Math.PI / 2)) * 100 * 1000) / 1000;
        if (progress > 99.8) {
          progress = 99.9;
        } else if (progress >= 90) {
          step = 0.01;
        }
        setProgressValue(parseFloat(progress.toFixed(1)));
      }, 100);
      setIntervalId(newIntervalId);
    } else if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(0);
    }
  }, [selectedFile, open, error]);
  useEffect(() => {
    setSelectedFile(null);
    queue()
      .defer(json, `${DATASOURCELINK}/data/TimeSeriesData/${countrySelected}.json`)
      .defer(json, `${DATASOURCELINK}/data/TimeSeriesToUse/${countrySelected}.json`)
      .defer(json, `${DATASOURCELINK}/data/PrioritiesData/${countrySelected}/data.json`)
      .await((err: any, d: any, timeSeriesToUse: any, prioritiesData: any) => {
        if (err) throw err;
        const filteredTimeseriesData:any = [];
        d.forEach((el:any) => {
          if (timeSeriesToUse.findIndex((el1: any) => isEqual(el1, omit(el, ['values', 'targetfor2030']))) !== -1 || el.series === '***') filteredTimeseriesData.push(el);
        });
        const filteredTimeseriesDataWithStatus = filteredTimeseriesData.map((element: any) => {
          const values = uniqBy(element.values, 'year').filter((el: any) => el.value !== null);

          const targetValue = element.targetfor2030 !== 0 ? element.targetfor2030 : null;
          const yearsAndValues = getYearsAndValues(values as any);
          const status = element.indicator === '8.1.1'
            ? meanBy(element.values.filter((val: any) => val.year > 2014), 'value') > 2 ? 'On Track'
              : meanBy(element.values.filter((val: any) => val.year > 2014), 'value') > 1.5 ? 'Fair progress but acceleration needed'
                : meanBy(element.values.filter((val: any) => val.year > 2014), 'value') > 1 ? 'Limited or No Progress'
                  : 'Deterioration'
            : targetValue === null
              ? undefined
              : yearsAndValues === null
                ? 'Insufficient Data'
                : getStatus(yearsAndValues, targetValue.targetValue, targetValue.type);
          return { ...element, status };
        });
        const allIndicators = uniqBy(filteredTimeseriesDataWithStatus.filter((el: any) => el.status), 'indicator').map((el: any) => el.indicator);
        const indicatorsStatus = allIndicators.map((indicator: string) => {
          const filtered = filteredTimeseriesDataWithStatus.filter((el: any) => el.indicator === indicator && el.status && el.status !== 'Insufficient Data');
          if (filtered.length === 0) {
            return {
              indicator, goal: indicator.split('.')[0], target: `${indicator.split('.')[0]}.${indicator.split('.')[1]}`, status: undefined,
            };
          }
          let total = 0;
          filtered.forEach((f: any) => {
            switch (f.status) {
              case 'Target Achieved':
                total += 1;
                break;
              case 'On Track':
                total += 1;
                break;
              case 'Fair progress but acceleration needed':
                total += 2;
                break;
              case 'Limited or No Progress':
                total += 3;
                break;
              case 'Deterioration':
                total += 4;
                break;
              default:
              // eslint-disable-next-line no-console
                console.log(f);
                break;
            }
          });
          if (total / filtered.length < 1.5) {
            return {
              indicator, goal: indicator.split('.')[0], target: `${indicator.split('.')[0]}.${indicator.split('.')[1]}`, status: 'On Track',
            };
          }
          if (total / filtered.length > 2.499) {
            return {
              indicator, goal: indicator.split('.')[0], target: `${indicator.split('.')[0]}.${indicator.split('.')[1]}`, status: 'Identified Gap',
            };
          }
          return {
            indicator, goal: indicator.split('.')[0], target: `${indicator.split('.')[0]}.${indicator.split('.')[1]}`, status: 'For Review',
          };
        });
        const allTargets = uniqBy(indicatorsStatus.filter((el: any) => el.status), 'target').map((el: any) => el.target);
        const targetStatus = allTargets.map((target: string) => {
          const filtered = indicatorsStatus.filter((el: any) => el.target === target && el.status && el.status !== 'Insufficient Data');
          if (filtered.length === 0) {
            return {
              target, goal: target.split('.')[0], status: undefined,
            };
          }
          let total = 0;
          filtered.forEach((f: any) => {
            switch (f.status) {
              case 'On Track':
                total += 1;
                break;
              case 'Identified Gap':
                total += 3;
                break;
              case 'For Review':
                total += 2;
                break;
              default:
              // eslint-disable-next-line no-console
                console.log(f);
                break;
            }
          });
          if (Math.round(total / filtered.length) === 1) {
            return {
              target, goal: target.split('.')[0], status: 'On Track',
            };
          }
          if (Math.round(total / filtered.length) === 2) {
            return {
              target, goal: target.split('.')[0], status: 'Identified Gap',
            };
          }
          return {
            target, goal: target.split('.')[0], status: 'For Review',
          };
        });
        const allGoals = uniqBy(targetStatus.filter((el: any) => el.status), 'goal').map((el: any) => el.goal);
        const goalStatus = allGoals.map((goal: string) => {
          const filtered = targetStatus.filter((el: any) => el.goal === goal && el.status && el.status !== 'Insufficient Data');
          if (filtered.length === 0) {
            return {
              goal, status: undefined,
            };
          }
          let total = 0;
          filtered.forEach((f: any) => {
            switch (f.status) {
              case 'On Track':
                total += 1;
                break;
              case 'Identified Gap':
                total += 3;
                break;
              case 'For Review':
                total += 2;
                break;
              default:
              // eslint-disable-next-line no-console
                console.log(f);
                break;
            }
          });
          if (Math.round(total / filtered.length) === 1) {
            return {
              goal, status: 'On Track',
            };
          }
          if (Math.round(total / filtered.length) === 3) {
            return {
              goal, status: 'Identified Gap',
            };
          }
          return {
            goal, status: 'For Review',
          };
        });
        setGoalStatuses(goalStatus);
        setData(prioritiesData);
      });
  }, [countrySelected]);

  const handleFileSelect = (event: any) => {
    setError(null);
    setOpen(true);
    setProgressValue(0);
    setSelectedFile(event.target.files[0]);
  };
  return (
    <>
      <Nav
        pageURL='acceleration-Opportunities'
      />
      <div>
        <PageTitle
          title='Current Priorities — How Do We Get There?'
          description='Scan reports and policy documents in the database and upload your own for run text analysis to identify national accelerators. Explore assumptions in the areas of Digital, Social Protection, Governance, Green Economy and other national priority areas.'
        />
        <RootEl>
          <DescriptionEl>
            <SummaryEl>
              Showing priorities for
              {' '}
              <span className='bold'>{countryFullName}</span>
              {' '}
              based on
              {' '}
              {
                selectedFile ? <span className='bold'>{selectedFile.name}</span>
                  : <a className='bold italics' href={`${DATASOURCELINK}/data/PrioritiesData/${countrySelected}/file.pdf`} target='_blank' rel='noreferrer'>most recently available VNRs</a>
              }
              <SubNote>
                Acceleration Opportunities represent areas which require urgent national attention and action based on SDG gaps and importance level prescribed by government and relevant national actors.
              </SubNote>

              <label htmlFor='file-upload' className='custom-file-upload'>
                <ButtonEl className='undp-button'>Upload and analyze another document</ButtonEl>
              </label>
              <FileAttacehmentButton id='file-upload' type='file' onChange={handleFileSelect} />
            </SummaryEl>
            {
              !error ? goalStatuses && data ? <PrioritiesVizCard data={data} statuses={goalStatuses} /> : <Spin /> : null
            }
          </DescriptionEl>
          <Modal
            title='Basic Modal'
            visible={open}
            width='75%'
            onOk={() => { setOpen(true); }}
            onCancel={() => setOpen(true)}
            className='undp-modal'
          >
            <FileSelectedBannerEl>
              <div>
                Processing
                {' '}
                <span className='bold'>{selectedFile?.name}</span>
              </div>
              <Progress
                strokeColor={{
                  from: '#108ee9',
                  to: '#87d068',
                }}
                percent={progressValue}
                status='active'
              />
            </FileSelectedBannerEl>
          </Modal>
        </RootEl>
      </div>
    </>
  );
};
