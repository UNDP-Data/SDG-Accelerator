/* eslint-disable jsx-a11y/label-has-associated-control */
import styled from 'styled-components';
import axios from 'axios';
import { Spin } from 'antd';
import { useEffect, useState } from 'react';
import { PrioritiesViz } from './PrioritiesViz';
import { PageTitle } from '../Components/PageTitle';
import { Nav } from '../Header/Nav';

interface Props {
  country?: string;
}

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
  background-color: var(--white);
  color: var(--black-700);
  border-radius: 3px;
  text-align: center;
  font-style: normal;
  font-size: 1.4rem;
  margin-top: 1rem;
  padding: 1rem;
  border: 1px dashed var(--black-550); 
  width: 100%;
  justify-content: center;
  display: flex;
  cursor: pointer;
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

export const Priorities = (props: Props) => {
  const { country } = props;
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      axios({
        method: 'post',
        url: 'https://undp.livedata.link/nlp/upload',
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

  const handleFileSelect = (event: any) => {
    setData(null);
    setError(null);
    setSelectedFile(event.target.files[0]);
  };
  return (
    <>
      <Nav
        pageURL='/acceleration-Opportunities'
      />
      <div>
        <PageTitle
          title='Acceleration Opportunities — How Do We Get There?'
          description='Scan reports and policy documents in the database and upload your own for run text analysis to identify national accelerators. Explore assumptions in the areas of Digital, Social Protection, Governance, Green Economy and other national priority areas.'
        />
        <RootEl>
          <DescriptionEl>
            <div>
              Determine priorities for your
              {' '}
              {country}
              {' '}
              based on analysis of relevant documentation. Acceleration Opportunities represent areas which require urgent national attention and action based on SDG progress gaps and importance level prescribed by government and relevant national actors.
            </div>
            <>
              <HR />
              <FileAttachementEl>
                <>
                  Complement the existing database of national planning documents and voluntary national reviews by uploading a relevant national resource such as a policy brief, assessment, development intervention proposal, etc. to analyse and identify Acceleration Opportunities
                </>
                <div>
                  <FileAttacehmentLabel htmlFor='file-upload' className='custom-file-upload'>
                    Attach a File
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
                      Processing
                      {' '}
                      <span className='bold'>{selectedFile.name}</span>
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
            selectedFile && !error ? (
              <>
                {
                  data ? <PrioritiesViz data={data} /> : <Spin size='large' />
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
