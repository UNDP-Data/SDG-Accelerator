import { Tabs } from 'antd';
import { queue } from 'd3-queue';
import { json } from 'd3-request';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import IMAGES from '../img/images';
import { dataForReportType, InterlinkagesForReportType } from '../Types';
import { SectionCard } from './SectionCard';

interface Props {
  countryCode: string;
}

interface SectionProps {
  color: string;
  background: string;
}

const HeroImageEl = styled.div`
  background: url(${IMAGES.heroImage}) no-repeat center;
  background-size: cover;
  margin-top: 7.1875rem;
`;

const SectionEl = styled.div<SectionProps>`
  background-color: ${(props) => props.background};
  color: ${(props) => props.color};
  padding: var(--spacing-09);
`;

export const ReportView = (props: Props) => {
  const { countryCode } = props;
  const [reportData, setReportData] = useState<
    dataForReportType | undefined
  >(undefined);
  useEffect(() => {
    queue()
      .defer(json, '../data/ReportPages/ZAF.json')
      .await(
        (
          err: any,
          data: dataForReportType,
        ) => {
          if (err) throw err;
          setReportData(data);
        },
      );
  }, []);

  return (
    <>
      <HeroImageEl className='undp-hero-image'>
        <div className='max-width'>
          <h1 className='undp-typography'>
            Integrated SDG Insights
          </h1>
        </div>
      </HeroImageEl>
      <div className='undp-hero-section padding-top-13 padding-bottom-13'>
        <div
          className='max-width flex-div flex-wrap flex-space-around'
          style={{
            maxWidth: '70rem', margin: 'auto', justifyContent: 'space-between', padding: '2rem 0rem', gap: '4rem',
          }}
        >
          <div className='undp-section-content' style={{ width: 'calc(40% - 2rem)', minWidth: '20rem', flexGrow: 1 }}>
            <h3 className='undp-typography'>What are the Integrated SDG Insights?</h3>
          </div>
          <div className='undp-section-content' style={{ width: 'calc(60% - 2rem)', minWidth: '20rem', flexGrow: 1 }}>
            This report provides an integrated analysis of SDG trends, national priorities and explores critical SDG interlinkages to inform policy pathways and development choices. The insights support Member State preparation for the SDG Summit and builds towards effective policy implementation in the second half of the 2030 Agenda.
          </div>
        </div>
        <div
          className='max-width-1280 flex-div flex-wrap'
          style={{
            maxWidth: '70rem', margin: 'auto', gap: '1rem',
          }}
        >
          <SectionCard cardTitle='Growth Pathways' cardDescription='Lorem ipsum dolor sit amet, consectetur domus adipiscing elit, sed do eiusmod tempor incididunt' cardIcon={IMAGES.iconSnapshot} />
          <SectionCard cardTitle='SDG Trends' cardDescription='Lorem ipsum dolor sit amet, consectetur domus adipiscing elit, sed do eiusmod tempor incididunt' cardIcon={IMAGES.iconTrends} />
          <SectionCard cardTitle='National Priorities' cardDescription='Lorem ipsum dolor sit amet, consectetur domus adipiscing elit, sed do eiusmod tempor incididunt' cardIcon={IMAGES.iconPriorities} />
          <SectionCard cardTitle='Interlinkages' cardDescription='Lorem ipsum dolor sit amet, consectetur domus adipiscing elit, sed do eiusmod tempor incididunt' cardIcon={IMAGES.iconInterlinkages} />
          <SectionCard cardTitle='Futures' cardDescription='Lorem ipsum dolor sit amet, consectetur domus adipiscing elit, sed do eiusmod tempor incididunt' cardIcon={IMAGES.iconFutures} />
          <SectionCard cardTitle='Fiscal/financial constraints' cardDescription='Lorem ipsum dolor sit amet, consectetur domus adipiscing elit, sed do eiusmod tempor incididunt' cardIcon={IMAGES.iconConstraints} />
        </div>
      </div>
      {reportData ? (
        <>
          <SectionEl className='max-width' color='var(--white)' background='var(--blue-600)'>
            <h5 className='undp-typography margin-bottom-02'>Section 1</h5>
            <h2 className='undp-typography'>Growth Pathways</h2>
            <div className='margin-top-07 margin-bottom-05'>
              {reportData['Growth Pathways']}
            </div>
          </SectionEl>
          <SectionEl className='max-width' color='var(--black)' background='var(--gray-200)'>
            <h5 className='undp-typography margin-bottom-02'>Section 2</h5>
            <h2 className='undp-typography'>Trends</h2>
            <div className='margin-top-07 margin-bottom-05'>
              {reportData.Trends}
            </div>
          </SectionEl>
          <SectionEl className='max-width' color='var(--black)' background='var(--white)'>
            <h5 className='undp-typography margin-bottom-02'>Section 3</h5>
            <h2 className='undp-typography'>National Priorities</h2>
            <div className='margin-top-07 margin-bottom-05'>
              {reportData['National Priorities']}
            </div>
          </SectionEl>
          <SectionEl className='max-width' color='var(--black)' background='var(--gray-200)'>
            <h5 className='undp-typography margin-bottom-02'>Section 4</h5>
            <h2 className='undp-typography'>Interlinkages</h2>
            <div className='margin-top-07 margin-bottom-05'>
              Lorem ipsum
            </div>
            <Tabs
              defaultActiveKey='Insight 1'
              className='undp-tabs'
              onChange={() => {
              }}
              items={[
                {
                  label: 'Insight 1',
                  key: '1',
                  children: (
                    <>
                      {reportData.Interlinkages.map((interlinkage: InterlinkagesForReportType, index:number) => (
                        <div key={index}>
                          <h3>
                            Interlinkage
                            {' '}
                            {index + 1}
                          </h3>
                          <p>
                            Target:
                            {' '}
                            {interlinkage.Target}
                          </p>
                          <p>
                            Target Text:
                            {' '}
                            {interlinkage['Target Text']}
                          </p>
                          <p>
                            Description:
                            {' '}
                            {interlinkage.Description}
                          </p>
                        </div>
                      ))}
                    </>
                  ),
                },
              ]}
            />

          </SectionEl>
          <SectionEl className='max-width' color='var(--white)' background='var(--blue-600)'>
            <h5 className='undp-typography margin-bottom-02'>Section 5</h5>
            <h2 className='undp-typography'>Futures</h2>
            <div className='margin-top-07 margin-bottom-05'>
              {reportData.Futures}
            </div>
          </SectionEl>
          <SectionEl className='max-width' color='var(--black)' background='var(--white)'>
            <h5 className='undp-typography margin-bottom-02'>Section 6</h5>
            <h2 className='undp-typography'>Fiscal</h2>
            <div className='margin-top-07 margin-bottom-05'>
              {reportData.Fiscal}
            </div>
          </SectionEl>
        </>
      )
        : (
          <div style={{
            width: 'calc(75% - 1rem)', height: '200px', backgroundColor: 'var(--gray-100)', paddingTop: '80px',
          }}
          >
            <div className='undp-loader' style={{ margin: 'auto' }} />
          </div>
        )}
      <div className='undp-hero-section-gray'>
        <div className='max-width flex-div flex-wrap' style={{ padding: '0 1rem' }}>
          <div className='undp-section-content'>
            <h2 className='undp-typography'>Get in touch</h2>
          </div>
          <div className='undp-section-content'>
            Want to upload your own data to power the Diagnostic?
            <br />
            Email
            {' '}
            <a href='mailto:data@undp.org' className='undp-style dark-bg' target='_blank' rel='noreferrer'>data@undp.org</a>
            <br />
            <br />
            This tool is powered by the latest data available on
            {' '}
            <a href={countryCode ? `https://unstats.un.org/sdgs/dataportal/countryprofiles/${countryCode === 'IDNWithCountryGovInput' ? 'IDN' : countryCode}` : 'https://unstats.un.org/sdgs/dataportal'} className='undp-style dark-bg' target='_blank' rel='noreferrer'>UNStats</a>
            . The interlinkages visualization is powered by data available on
            {' '}
            <a href='https://knowsdgs.jrc.ec.europa.eu/interlinkages-visualization' className='undp-style dark-bg' target='_blank' rel='noreferrer'>KnowSDGs Platform by European Commission</a>
            .
            <br />
            <br />
            If you have additional or proxy data on the SDG indicators, get in touch and we can support in uploading the information to tailor the tool to meet the country needs and context.
          </div>
        </div>
      </div>
      <div style={{
        backgroundColor: 'var(--gray-200)',
        borderTop: '1px solid var(--gray-600)',
        padding: 'var(--spacing-09) var(--spacing-03)',
        textAlign: 'center',
      }}
      >
        <h6 className='undp-typography margin-bottom-07'>With the support of the German Federal Ministry for Economic Cooperation and Development</h6>
        <img alt='giz logo' src={IMAGES.gizLogo} style={{ width: '250px', margin: 'auto' }} />
      </div>
    </>
  );
};
