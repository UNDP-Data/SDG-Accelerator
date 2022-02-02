import { useState } from 'react';
import Select from 'react-dropdown-select';
import styled from 'styled-components';
import { PrioritiesViz } from './PrioritiesViz';
import { PageTitle } from '../Components/PageTitle';
import { CountryListTypeSDGPush } from '../Types';

const SDGPushData: CountryListTypeSDGPush[] = require('../Data/countrySDGPush.json');

const RootEl = styled.div`
  width: 128rem;
  margin: 2rem auto 5rem auto;
`;

const DescriptionEl = styled.div`
  padding: 2rem;
  background-color: var(--black-200);
  margin: 0 0 4rem 0;
`;

const SelectEl = styled.div`
  margin: 2rem 0;
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
  margin: 0;
`;

export const Priorities = () => {
  const [country, setCountry] = useState<string | undefined>(undefined);
  const countryList = SDGPushData.map((d) => (
    {
      label: d['Country or Area'],
    }
  )).sort((a, b) => a.label.localeCompare(b.label));
  return (
    <div>
      <PageTitle
        title='SDG Priorities — How Do We Get There?'
        description='Scan reports and policy documents in the database and upload your own for run text analysis to identify national accelerators. Explore assumptions in the areas of Digital, Social Protection, Governance, Green Economy and other national priority areas.'
      />
      <RootEl>
        <DescriptionEl>
          <div>
            Determine priorities for your country based on analysis of relevant documentation. SDG Priorities represent areas which require urgent national attention and action based on SDG progress gaps and importance level prescribed by government and relevant national actors.
          </div>
          <SelectEl>
            <Select
              options={countryList}
              className='countrySelectDropDown'
              onChange={(el: any) => { setCountry(el[0].label); }}
              values={country ? [{ label: country }] : []}
              labelField='label'
              valueField='label'
              dropdownHeight='250px'
              dropdownPosition='auto'
              searchable
              dropdownGap={2}
            />
          </SelectEl>
          {
            country ? (
              <>
                <HR />
                <FileAttachementEl>
                  <>
                    Complement the existing database of national planning documents and voluntary national reviews by uploading a relevant national resource such as a policy brief, assessment, development intervention proposal, etc. to analyse and identify SDG Priorities
                  </>
                  <FileAttacehmentButton>
                    Attach a file
                  </FileAttacehmentButton>
                </FileAttachementEl>
              </>
            )
              : null
          }
        </DescriptionEl>
        {
          country ? (
            <PrioritiesViz />
          )
            : null

        }
      </RootEl>
    </div>
  );
};
