import styled from 'styled-components';
import IMAGES from '../img/images';

interface Props {
  countryCode: string;
}

const HeroImageEl = styled.div`
  background: url(${IMAGES.heroImage}) no-repeat center;
  background-size: cover;
  margin-top: 7.1875rem;
`;

export const ReportView = (props: Props) => {
  const {
    countryCode,
  } = props;
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
        <div className='max-width flex-div flex-wrap' style={{ padding: '0 1rem', gap: '4rem' }}>
          <div className='undp-section-content' style={{ width: 'calc(50% - 2rem)', minWidth: '20rem', flexGrow: 1 }}>
            <h2 className='undp-typography'>What are the Integrated SDG Insights?</h2>
          </div>
          <div className='undp-section-content' style={{ width: 'calc(50% - 2rem)', minWidth: '20rem', flexGrow: 1 }}>
            This report provides an integrated analysis of SDG trends, national priorities and explores critical SDG interlinkages to inform policy pathways and development choices. The insights support Member State preparation for the SDG Summit and builds towards effective policy implementation in the second half of the 2030 Agenda.
          </div>
        </div>
      </div>
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
