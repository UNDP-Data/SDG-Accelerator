/* eslint-disable jsx-a11y/label-has-associated-control */
import styled from 'styled-components';
import axios from 'axios';
import { Progress } from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PrioritiesViz } from './PrioritiesViz';
import { PageTitle } from '../Components/PageTitle';
import { Nav } from '../Header/Nav';
import { COUNTRYOPTION } from '../Constants';

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
            selectedFile && !error ? (
              <>
                {
                  data ? <PrioritiesViz data={data} /> : null
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
