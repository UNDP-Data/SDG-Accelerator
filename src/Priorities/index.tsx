/* eslint-disable jsx-a11y/label-has-associated-control */
import styled from 'styled-components';
import axios from 'axios';
import { Progress } from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// import { PrioritiesViz } from './PrioritiesViz';
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
  padding: 2rem 2rem 0 2rem;
  background-color: var(--black-200);
  margin: 0 0 2rem 0;
`;

const FileAttachementEl = styled.div`
  padding: 2rem 0;
  font-size: 1.4rem;
  line-height: 2rem;
  color: var(--black-550);
  font-style: italic;
`;

const FileAttacehmentLabel = styled.label`
  background-color: #fff;
  color: var(--black-700);
  border-radius: 3px;
  text-align: center;
  font-style: normal;
  font-size: 1.4rem;
  font-weight: bold;
  margin-top: 1rem;
  padding: 1rem;
  border: 1px dashed var(--black-550); 
  width: 100%;
  justify-content: center;
  display: flex;
  cursor: pointer;
  align-items: center;
`;

const FileAttacehmentButton = styled.input`
  display: none;
`;

const HR = styled.hr`
  margin: 2rem 0 0 0;
`;

interface FileSelectedBannerElProps {
  backgroundColor: string;
  borderColor: string;
}

const FileSelectedBannerEl = styled.div<FileSelectedBannerElProps>`
  width: 100%;
  font-size: 1.6rem;
  padding: 2rem;
  margin: 0 0 2rem 0;
  background-color: ${(props) => props.backgroundColor};
  color: var(--black-700);
  border: ${(props) => `1px solid  ${props.borderColor}`};
`;

export const Priorities = () => {
  const countrySelected = useParams().country || 'ZAF';
  const countryFullName = COUNTRYOPTION[COUNTRYOPTION.findIndex((d) => d.code === countrySelected)].countryName;
  const [selectedFile, setSelectedFile] = useState<any>(null);
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
        })
        .catch((err) => {
          setError(err.message);
        });
    }
  }, [selectedFile]);

  useEffect(() => {
    if (selectedFile && !data && !error) {
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
        setProgressValue(Math.round(progress));
      }, 100);
      setIntervalId(newIntervalId);
    } else if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(0);
    }
  }, [selectedFile, data, error]);
  useEffect(() => {
    queue()
      .defer(json, `${DATASOURCELINK}/data/TimeSeriesData/${countrySelected}.json`)
      .defer(json, `${DATASOURCELINK}/data/TimeSeriesToUse/${countrySelected}.json`)
      .await((err: any, d: any, timeSeriesToUse: any) => {
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
      });
  }, [countrySelected]);

  const handleFileSelect = (event: any) => {
    setData(null);
    setError(null);
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
            <div>
              Determine priorities for
              {' '}
              <span className='bold'>{countryFullName}</span>
              {' '}
              based on analysis of relevant documentation. Acceleration Opportunities represent areas which require urgent national attention and action based on SDG gaps and importance level prescribed by government and relevant national actors.
            </div>
            <>
              <HR />
              <FileAttachementEl>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img src='https://raw.githubusercontent.com/UNDP-Data/SDG-Accelerator/main/public/img/vnr_thumbnail.png' alt='Access all data info' width='25%' style={{ maxWidth: '16rem', marginRight: '2rem' }} />
                  <div>
                    Complement the existing database of national planning documents and voluntary national reviews by uploading a relevant national resource such as a policy brief, assessment, development intervention proposal, etc. to analyse and identify Acceleration Opportunities
                    <br />
                    <br />
                    The voluntary national reviews (VNRs) are regular and inclusive reviews conducted by member states on progress at the national and sub-national levels, which are country-led and country-driven. The VNRs aim to facilitate the sharing of experiences, including successes, challenges and lessons learned, with a view to accelerating the implementation of the 2030 Agenda.
                    <br />
                    <br />
                    National development plans (NDP) aim to demonstrate national aspirations and, at times, craft a new vision for economic transformation. These plans are produced at regular intervals and are usually led by Finance, Economic or National Planning related ministries.
                  </div>
                </div>
                <div>
                  <FileAttacehmentLabel htmlFor='file-upload' className='custom-file-upload'>
                    Click to Attach a File
                  </FileAttacehmentLabel>
                  <FileAttacehmentButton id='file-upload' type='file' onChange={handleFileSelect} />
                </div>
              </FileAttachementEl>
            </>
          </DescriptionEl>
          {
            selectedFile
              ? !data
                ? error ? (
                  <FileSelectedBannerEl backgroundColor='var(--accent-red-light)' borderColor='var(--accent-red)'>
                    Error Processing
                    {' '}
                    <span className='bold'>{selectedFile.name}</span>
                    :
                    {' '}
                    {error}
                    {' '}
                    (please check the file is pdf format and try again)
                  </FileSelectedBannerEl>
                )
                  : (
                    <FileSelectedBannerEl backgroundColor='var(--accent-yellow-light)' borderColor='var(--accent-yellow)'>
                      <div>
                        Processing
                        {' '}
                        <span className='bold'>{selectedFile.name}</span>
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
                  ) : (
                    <FileSelectedBannerEl backgroundColor='var(--accent-green-light)' borderColor='var(--accent-green)'>
                      Showing results for
                      {' '}
                      <span className='bold'>{selectedFile.name}</span>
                      .
                      {' '}
                      <span className='italics'>Click on the goal to see the priorities</span>
                    </FileSelectedBannerEl>
                )
              : null
          }
          {
            selectedFile && goalStatuses && !error ? (
              <>
                {
                  data ? <PrioritiesVizCard data={data} statuses={goalStatuses} /> : null
                }
              </>
            )
              : null
          }
        </RootEl>
      </div>
    </>
  );
};
