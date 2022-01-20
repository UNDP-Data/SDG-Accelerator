import styled from 'styled-components';
import { PageTitle } from '../Components/PageTitle';
import { DonutChartCard } from './DonutChartCard';

const RootEl = styled.div`
  max-width: 128rem;
  margin: 2rem auto 0 auto;
`;

export const CurrentGaps = () => (
  <div>
    <PageTitle
      title='Current Gaps'
      description='Visualization of SDG gaps nationally allows for easy identification of where SDG goals are being left behind. Using up to date data, explore SDG progress in your country and which targets are at risk of not being met by 2030. These insights will be the basis for evidence-based, holistic dialogue at the national level.'
    />
    <RootEl>
      <DonutChartCard
        title='SDG Gaps Overview'
        centralText='SDG Goals'
        onTrack={8}
        identifiedGap={5}
        forReview={4}
      />
    </RootEl>
  </div>
);
