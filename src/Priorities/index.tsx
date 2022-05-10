import styled from 'styled-components';
import { PrioritiesViz } from './PrioritiesViz';
import { PageTitle } from '../Components/PageTitle';
import { Nav } from '../Header/Nav';

interface Props {
  country?: string;
}

const RootEl = styled.div`
  width: 128rem;
  margin: 2rem auto 5rem auto;
`;

const DescriptionEl = styled.div`
  padding: 2rem;
  background-color: var(--black-200);
  margin: 0 0 4rem 0;
`;

const FileAttachementEl = styled.div`
  padding: 2rem 0;
  font-size: 1.4rem;
  line-height: 2rem;
  color: var(--black-550);
  font-style: italic;
`;

const FileAttacehmentButton = styled.div`
  background-color: var(--white);
  color: var(--black-700);
  border-radius: 3px;
  text-align: center;
  font-style: normal;
  font-size: 1.4rem;
  margin-top: 1rem;
  padding: 1rem;
  border: 1px dashed var(--black-550); 
`;

const HR = styled.hr`
  margin: 2rem 0 0 0;
`;

export const Priorities = (props: Props) => {
  const { country } = props;
  return (
    <>
      <Nav
        pageURL='/acceleration-oppurtunities'
      />
      <div>
        <PageTitle
          title='Acceleration Oppurtunities — How Do We Get There?'
          description='Scan reports and policy documents in the database and upload your own for run text analysis to identify national accelerators. Explore assumptions in the areas of Digital, Social Protection, Governance, Green Economy and other national priority areas.'
        />
        <RootEl>
          <DescriptionEl>
            <div>
              Determine priorities for your
              {' '}
              {country}
              {' '}
              based on analysis of relevant documentation. Acceleration Oppurtunities represent areas which require urgent national attention and action based on SDG progress gaps and importance level prescribed by government and relevant national actors.
            </div>
            <>
              <HR />
              <FileAttachementEl>
                <>
                  Complement the existing database of national planning documents and voluntary national reviews by uploading a relevant national resource such as a policy brief, assessment, development intervention proposal, etc. to analyse and identify Acceleration Oppurtunities
                </>
                <FileAttacehmentButton>
                  Attach a file
                </FileAttacehmentButton>
              </FileAttachementEl>
            </>
          </DescriptionEl>
          <PrioritiesViz />
        </RootEl>
      </div>
    </>
  );
};
