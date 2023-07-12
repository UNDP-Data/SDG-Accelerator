import { queue } from 'd3-queue';
import { json } from 'd3-request';
import {
  useEffect, useState, FC, Children,
} from 'react';
import { useInView } from 'react-intersection-observer';
import styled, { keyframes } from 'styled-components';
import { useTrail, a } from '@react-spring/web';
import IMAGES from '../img/images';
import {
  GoalStatusType,
  ScenarioDataType,
  TargetStatusType,
  TargetStatusWithDetailsType,
  SummaryReportDataType,
} from '../Types';
import { DATASOURCELINK } from '../Constants';
import { SDGList } from '../Data/SDGGoalList';
import { SDGTrendsSlide } from './ReportSections/SDGTrendsSlide';
import { NationalPrioritiesSlide } from './ReportSections/NationalPrioritiesSlide';
import { FiscalSlide } from './ReportSections/FiscalSlide';
import { InterlinkagesSlide } from './ReportSections/InterlinkagesSlide';
import { SDGPushSlide } from './ReportSections/SDGPushSlide';
import { SDGMomentSlide } from './ReportSections/SDGMomentSlide';

interface Props {
  countryCode: string;
  targetStatuses: TargetStatusType[];
  countryFullName: string;
  goalStatuses: GoalStatusType[];
  reportData: SummaryReportDataType;
}

const RotateAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  } 
`;

const HeroImageEl = styled.div`
  background: url(${IMAGES.heroImage}) no-repeat center;
  background-size: cover;
  margin-top: 7.1875rem;
  background-attachment: fixed;
  min-height: calc(100vh - 15.1875rem);
  padding: 4rem 1rem !important;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-09);
`;

const SDGWheelImg = styled.img`
  width: min(20vw, 30vh);
  height: min(20vw, 30vh);
  animation: ${RotateAnimation} 25s linear infinite;
`;

const Trail: FC<{ open: boolean }> = ({ open, children }) => {
  const items = Children.toArray(children);
  const trail = useTrail(items.length, {
    config: {
      mass: 5,
      tension: 2000,
      friction: 200,
    },
    opacity: open ? 1 : 0,
    x: open ? 0 : 20,
    height: open ? 50 : 0,
    from: {
      opacity: 0,
      x: 20,
      height: 0,
    },
  });
  return (
    <div>
      {trail.map(({ height, ...style }, index) => (
        <a.div key={index} style={style}>
          <a.div style={{ height }}>{items[index]}</a.div>
        </a.div>
      ))}
    </div>
  );
};

export const SummaryReportView = (props: Props) => {
  const {
    countryCode,
    targetStatuses,
    countryFullName,
    goalStatuses,
    reportData,
  } = props;
  const [scenarioData, setScenarioData] = useState<ScenarioDataType[] | undefined>(undefined);
  const [docList, setDocList] = useState<any>(null);
  const [targetStatus, setTargetStatus] = useState<TargetStatusWithDetailsType[] | undefined>(undefined);
  const [dataWithStatuses, setDataWithStatuses] = useState<any>(undefined);
  const [ref, inView] = useInView({
    threshold: 0.25,
  });
  useEffect(() => {
    queue()
      .defer(json, `${DATASOURCELINK}/data/PrioritiesData/${countryCode}.json`)
      .defer(json, `${DATASOURCELINK}/data/ScenarioData/${countryCode}.json`)
      .await(
        (
          err: any,
          d: any,
          scenarioDataFromFile: ScenarioDataType[],
        ) => {
          // eslint-disable-next-line no-console
          if (err) { console.error('Error loading files'); }

          const targetStatusTemp: TargetStatusWithDetailsType[] = [];
          SDGList.forEach((goal) => {
            goal.Targets.forEach((target) => {
              const status = targetStatuses.findIndex((el) => `Target ${el.target}` === target.Target) !== -1 ? targetStatuses[targetStatuses.findIndex((el) => `Target ${el.target}` === target.Target)].status : null;
              targetStatusTemp.push({
                goal: goal.Goal,
                target: target.Target,
                description: target['Target Description'],
                status,
              });
            });
          });
          setTargetStatus(targetStatusTemp);
          setScenarioData(scenarioDataFromFile);
          setDocList(d.doc_name);
          setDataWithStatuses(d.sdgs.map((el: any) => ({ ...el, category: el.importance === 0 ? 'No Mention' : el.category.charAt(0).toUpperCase() + el.category.slice(1), status: goalStatuses[goalStatuses.findIndex((el1) => el1.goal === el.sdg)].status || 'Gaps NA' })));
        },
      );
  }, [countryCode]);
  return (
    <div>
      {
        dataWithStatuses && targetStatus && docList && scenarioData ? (
          <div>
            <HeroImageEl ref={ref}>
              <SDGWheelImg src={IMAGES.SDGWheel} alt='sdg-wheel' />
              <div style={{ color: 'var(--white)' }}>
                <Trail open={inView}>
                  <h2 className='undp-typography'>
                    Integrated SDG
                  </h2>
                  <h2 className='undp-typography'>
                    Report
                  </h2>
                  <h2 className='undp-typography'>
                    {countryFullName}
                  </h2>
                </Trail>
              </div>
            </HeroImageEl>
            <SDGMomentSlide reportData={reportData} countryCode={countryCode} countryFullName={countryFullName} />
            <SDGTrendsSlide targetStatuses={targetStatuses} countryFullName={countryFullName} />
            <NationalPrioritiesSlide countryFullName={countryFullName} priorityData={dataWithStatuses} />
            <InterlinkagesSlide reportData={reportData} />
            <SDGPushSlide reportData={reportData} countryFullName={countryFullName} />
            <FiscalSlide reportData={reportData} />
          </div>
        ) : null
      }
    </div>
  );
};
