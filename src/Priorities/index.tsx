/* eslint-disable jsx-a11y/label-has-associated-control */
import styled from 'styled-components';
import axios from 'axios';
import {
  Result, Spin,
} from 'antd';
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
import { COUNTRYOPTION, DATASOURCELINK, COUNTRY_VNR_YEAR } from '../Constants';
import { Nav } from '../Header/Nav';
import { PageTitle } from '../Components/PageTitle';
import { getStatus } from '../utils/getStatus';
import { CompareIcon, UploadIcon } from '../icons';
import { UploadModal } from './UploadModal';
import { CompareModal } from './CompareModal';
import { CompareTable } from './CompareTable';

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
  gap: 1rem;
  text-transform: uppercase;
  width: fit-content;
  margin-top: 3rem;
`;

export const Priorities = () => {
  const countrySelected = useParams().country || 'ZAF';
  const countryFullName = COUNTRYOPTION[COUNTRYOPTION.findIndex((d) => d.code === countrySelected)].countryName;
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [openCompareModal, setOpenCompareModal] = useState(false);
  const [goalStatuses, setGoalStatuses] = useState<any>(undefined);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    setSelectedFileName('');
    setData(null);
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
        axios.get(`https://sdg-accelerator-api.azurewebsites.net/vnrs/${countrySelected.toLowerCase()}/${COUNTRY_VNR_YEAR[COUNTRY_VNR_YEAR.findIndex((c) => c.countryCode === countrySelected)].year}/multiclass/sentence`).then((res) => {
          setData(res.data.sdgs);
        });
      });
  }, [countrySelected]);
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
              {
                selectedFileName ? (
                  <>
                    {
                    selectedFileName.split('____').length > 1 ? (
                      <>
                        Comparing priorities for
                        {' '}
                        <span className='bold'>{countryFullName}</span>
                        {' '}
                        based on
                        {' '}
                        <span className='bold italics'>
                          {selectedFileName.split('____')[0]}
                        </span>
                        {' '}
                        and
                        <span className='bold italics'>
                          {selectedFileName.split('____')[1]}
                        </span>
                      </>
                    ) : (
                      <>
                        Showing priorities for
                        {' '}
                        <span className='bold'>{countryFullName}</span>
                        {' '}
                        based on
                        {' '}
                        <span className='bold italics'>
                          {selectedFileName}
                        </span>
                      </>
                    )
                  }
                  </>
                ) : (
                  <>
                    Showing priorities for
                    {' '}
                    <span className='bold'>{countryFullName}</span>
                    {' '}
                    based on
                    {' '}
                    <span className='bold italics'>
                      {COUNTRY_VNR_YEAR[COUNTRY_VNR_YEAR.findIndex((c) => c.countryCode === countrySelected)].year}
                      {' '}
                      VNR
                    </span>
                  </>
                )
              }
              <SubNote>
                Acceleration Opportunities represent areas which require urgent national attention and action based on SDG gaps and importance level prescribed by government and relevant national actors.
              </SubNote>
              {
                data ? (
                  <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <ButtonEl onClick={() => { setOpenUploadModal(true); }}>
                      <div>Upload and analyze another document</div>
                      <UploadIcon size={24} />
                    </ButtonEl>
                    <div style={{
                      marginTop: '2.2rem', width: '1px', height: '24px', backgroundColor: 'var(--black-500)',
                    }}
                    />
                    <ButtonEl onClick={() => { setOpenCompareModal(true); }}>
                      <div>Compare mutiple document</div>
                      <CompareIcon size={24} />
                    </ButtonEl>
                  </div>
                ) : null
              }
            </SummaryEl>
            {
              !error ? goalStatuses && data ? data.mode === 'analyze' ? <PrioritiesVizCard data={data.data} statuses={goalStatuses} /> : data.mode === 'compare' ? <CompareTable data={data.data} statuses={goalStatuses} file1={selectedFileName.split('____')[0]} file2={selectedFileName.split('____')[1]} /> : <PrioritiesVizCard data={data} statuses={goalStatuses} />
                : (
                  <RootEl>
                    <Spin size='large' />
                  </RootEl>
                )
                : (
                  <Result
                    status={error === 'PDF File Required' ? 'error' : '500'}
                    title='Analysis Failed'
                    subTitle={error === 'PDF File Required' ? 'Please upload a PDF file, we are unable to analyze any other file formats' : 'Sorry, something went wrong. Please try again with a different document or after some time.'}
                  />
                )
            }
          </DescriptionEl>
          {
            openUploadModal ? <UploadModal state setData={setData} setError={setError} setFile={setSelectedFileName} setModalState={setOpenUploadModal} /> : <UploadModal state={false} setModalState={setOpenUploadModal} setData={setData} setError={setError} setFile={setSelectedFileName} />
          }
          {
            openCompareModal ? <CompareModal state setData={setData} setError={setError} setFile={setSelectedFileName} setModalState={setOpenCompareModal} /> : <CompareModal state={false} setModalState={setOpenCompareModal} setData={setData} setError={setError} setFile={setSelectedFileName} />
          }
        </RootEl>
      </div>
    </>
  );
};
