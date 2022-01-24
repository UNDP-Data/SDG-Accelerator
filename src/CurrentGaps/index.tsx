import styled from 'styled-components';
import { PageTitle } from '../Components/PageTitle';
import { DonutChartCard } from './DonutChartCard';
import { SDGGapsList } from './SDGGapsList';

const RootEl = styled.div`
  max-width: 128rem;
  margin: 2rem auto 0 auto;
`;

const RowEl = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: stretch;
`;

export const CurrentGaps = () => (
  <div>
    <PageTitle
      title='Current Gaps'
      description='Visualization of SDG gaps nationally allows for easy identification of where SDG goals are being left behind. Using up to date data, explore SDG progress in your country and which targets are at risk of not being met by 2030. These insights will be the basis for evidence-based, holistic dialogue at the national level.'
    />
    <RootEl>
      <RowEl>
        <DonutChartCard
          title='SDG Gaps Overview'
          centralText='SDG Goals'
          onTrack={8}
          identifiedGap={5}
          forReview={4}
        />
        <SDGGapsList
          onTrack={['SDG1', 'SDG2', 'SDG3', 'SDG4', 'SDG8', 'SDG9', 'SDG10', 'SDG11', 'SDG13', 'SDG17']}
          identifiedGap={['SDG5', 'SDG6', 'SDG12']}
          forReview={['SDG7', 'SDG14', 'SDG15', 'SDG16']}
        />
      </RowEl>
    </RootEl>
  </div>
);
