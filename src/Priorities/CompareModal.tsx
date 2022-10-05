/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/label-has-associated-control */
import styled from 'styled-components';
import axios from 'axios';
import {
  Modal, Progress, Radio,
} from 'antd';
import { useEffect, useRef, useState } from 'react';

interface Props {
  // eslint-disable-next-line no-unused-vars
  setData: (_d: any) => void;
  // eslint-disable-next-line no-unused-vars
  setError: (_d: string | null) => void;
  // eslint-disable-next-line no-unused-vars
  setFile: (_d: string) => void;
  // eslint-disable-next-line no-unused-vars
  setModalState:(_d: boolean) => void;
  state: boolean;
}

const FileAttacehmentButton = styled.input`
  display: none;
`;

const FileSelectedBannerEl = styled.div`
  width: 100%;
  font-size: 3.2rem;
  padding: 2rem;
  margin: 0;
  color: var(--black-700);
`;

interface DisabledProps {
  disabled?: boolean;
}

const PrimaryButtonEl = styled.div<DisabledProps>`
  color: #fff;
  cursor:  ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  justify-content: center;
  padding: 2.4rem;
  align-items: center;
  display: flex;
  font-size: 1.6rem;
  font-weight: 700;
  letter-spacing: .03em;
  line-height: 1;
  text-transform: uppercase;
  width: fit-content;
  margin-top: 2.4rem;
  background-color: ${(props) => (props.disabled ? 'var(--black-500)' : '#d12800')};
  &:hover{
    animation: lineLoop-animation 2s linear infinite;
    background-color: ${(props) => (props.disabled ? 'var(--black-500)' : '#ee402d')};
  }
  &:after {
    transition: .2s ease;
    background: url(https://design.undp.org/static/media/chevron-right-black.f618eac3.svg) no-repeat left center;
    content: "";
    height: 20px;
    margin-left: 0.75rem;
    width: 13px;
    opacity: ${(props) => (props.disabled ? '0.3' : '1')}
  }
`;

const RadioEl = styled.div`
  font-size: 1.6rem;
  margin: 1.6rem 0;
`;

const ModalHeading = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1.6rem;
  margin-top: 0;
`;

const RadioContainer = styled.div`
  display: flex;
  gap: 4rem;
  margin-top: 2rem;
`;

const HR = styled.hr`
  border: 1px solid #000;
  margin: 1rem 0;
`;

const UploadEl = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  border: 1px solid var(--black-500);
  background-color: var(--black-100);
  margin-top: 2rem;
  border-radius: 0.3rem;
`;

const SelectedEl = styled.div`
  font-size: 1.6rem;
`;

const UploadButtonEl = styled.div<DisabledProps>`
  color: var(--black-700);
  cursor:  ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  justify-content: center;
  padding: 1.5rem 1rem;
  align-items: center;
  display: flex;
  font-size: 1.6rem;
  line-height: 1;
  font-weight: bold;
  width: fit-content;
  background-color: var(--black-400);
  border-radius: 0.3rem 0 0 0.3rem;
  border-right: 1px solid var(--black-500);
  &:hover{
    background-color: var(--black-500);
  }
`;

const granularityOptions = [
  { label: 'Paragraph (recommended)', value: 'paragraph' },
  { label: 'Sentence', value: 'sentence' },
];
const modelOptions = [
  { label: 'Multi-Label (recommended)', value: 'multilabel' },
  { label: 'Multi-Class', value: 'multiclass' },
];

export const CompareModal = (props: Props) => {
  const {
    setData,
    setFile,
    setError,
    state,
    setModalState,
  } = props;
  const fileInputRef = useRef<any>(null);
  const [selectedFile1, setSelectedFile1] = useState<any>(null);
  const [selectedFile2, setSelectedFile2] = useState<any>(null);
  const [selectedFileName1, setSelectedFileName1] = useState<string>('');
  const [selectedFileName2, setSelectedFileName2] = useState<string>('');
  const [openAnalyzeModal, setOpenAnalyzeModal] = useState(false);
  const [intervalId, setIntervalId] = useState<any>(0);
  const [progressValue, setProgressValue] = useState(0);
  const [selectedModel, setSelectedModel] = useState<'multiclass' | 'multilabel'>('multilabel');
  const [selectedGranularity, setSelectedGranularity] = useState<'sentence' | 'paragraph'>('paragraph');

  useEffect(() => {
    if (selectedFile1 && selectedFile2 && openAnalyzeModal) {
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
        setProgressValue(parseFloat(progress.toFixed(1)));
      }, 100);
      setIntervalId(newIntervalId);
    } else if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(0);
    }
  }, [selectedFile1, selectedFile2, openAnalyzeModal]);

  const handleFile1Select = (event: any) => {
    if (event.target.files) {
      if (event.target.files[0]) {
        setSelectedFile1(event.target.files[0]);
        setSelectedFileName1(event.target.files[0].name);
      }
    }
  };
  const handleFile2Select = (event: any) => {
    if (event.target.files) {
      if (event.target.files[0]) {
        setSelectedFile2(event.target.files[0]);
        setSelectedFileName2(event.target.files[0].name);
      }
    }
  };

  const analyzeDocument = () => {
    if (selectedFile1 && selectedFile2) {
      setProgressValue(0);
      setOpenAnalyzeModal(true);
      const formData1 = new FormData();
      formData1.append('file', selectedFile1);
      formData1.append('model', selectedModel);
      formData1.append('granularity', selectedGranularity);
      const formData2 = new FormData();
      formData2.append('file', selectedFile2);
      formData2.append('model', selectedModel);
      formData2.append('granularity', selectedGranularity);
      axios({
        method: 'post',
        url: 'https://sdg-accelerator-api.azurewebsites.net/upload',
        data: formData1,
        headers: { 'Content-Type': 'multipart/form-data' },
      })
        .then((response1: any) => {
          axios({
            method: 'post',
            url: 'https://sdg-accelerator-api.azurewebsites.net/upload',
            data: formData2,
            headers: { 'Content-Type': 'multipart/form-data' },
          })
            .then((response2: any) => {
              if (typeof response2.data === 'string' || typeof response1.data === 'string') setError('PDF File Required');
              else {
                setData({ mode: 'compare', data: [response1.data.sdgs, response2.data.sdgs] });
                setError(null);
              }
              setFile(`${selectedFileName1}____${selectedFileName2}`);
              setOpenAnalyzeModal(false);
              setModalState(false);
            })
            .catch((err) => {
              setError(err.message);
              setFile(`${selectedFileName1}____${selectedFileName2}`);
              setOpenAnalyzeModal(false);
              setModalState(false);
            });
        })
        .catch((err) => {
          setError(err.message);
          setFile(`${selectedFileName1}____${selectedFileName2}`);
          setOpenAnalyzeModal(false);
          setModalState(false);
        });
    }
  };

  return (
    <>
      <Modal
        title=''
        visible={state}
        width='75%'
        onOk={() => {
          setModalState(false);
          if (fileInputRef.current) { fileInputRef.current.value = null; }
        }}
        onCancel={() => {
          setModalState(false);
          if (fileInputRef.current) { fileInputRef.current.value = null; }
        }}
        className='undp-modal'
      >
        <ModalHeading>Compare 2 documents</ModalHeading>
        <UploadEl>
          <label htmlFor='file1-upload' className='custom-file-upload'>
            <UploadButtonEl>Upload first document</UploadButtonEl>
          </label>
          {
            selectedFileName1 !== '' ? (
              <SelectedEl>
                Selected
                {' '}
                <span className='bold'>{selectedFileName1}</span>
              </SelectedEl>
            ) : <SelectedEl style={{ opacity: '0.6' }}>No file selected</SelectedEl>
          }
          <FileAttacehmentButton ref={fileInputRef} id='file1-upload' accept='application/pdf' type='file' onChange={handleFile1Select} />
        </UploadEl>
        <UploadEl>
          <label htmlFor='file2-upload' className='custom-file-upload'>
            <UploadButtonEl>Upload second document</UploadButtonEl>
          </label>
          {
            selectedFileName2 !== '' ? (
              <SelectedEl>
                Selected
                {' '}
                <span className='bold'>{selectedFileName2}</span>
              </SelectedEl>
            ) : <SelectedEl style={{ opacity: '0.6' }}>No file selected</SelectedEl>
          }
          <FileAttacehmentButton ref={fileInputRef} id='file2-upload' accept='application/pdf' type='file' onChange={handleFile2Select} />
        </UploadEl>
        <RadioContainer>
          <RadioEl>
            <div className='bold'>
              Choose Granularity
            </div>
            <Radio.Group options={granularityOptions} onChange={(e) => { setSelectedGranularity(e.target.value); }} value={selectedGranularity} />
          </RadioEl>
          <RadioEl>
            <div className='bold'>
              Choose Model
            </div>
            <Radio.Group options={modelOptions} onChange={(e) => { setSelectedModel(e.target.value); }} value={selectedModel} />
          </RadioEl>
        </RadioContainer>
        <HR />
        <PrimaryButtonEl
          disabled={selectedFileName1 === '' || selectedFileName2 === ''}
          onClick={() => {
            if (selectedFileName1 !== '' && selectedFileName2 !== '') {
              analyzeDocument();
            }
          }}
        >
          Analyze document
        </PrimaryButtonEl>
      </Modal>
      <Modal
        title=''
        visible={openAnalyzeModal}
        width='75%'
        onOk={() => { setOpenAnalyzeModal(true); }}
        onCancel={() => setOpenAnalyzeModal(true)}
        className='undp-modal'
      >
        <FileSelectedBannerEl>
          <div>
            Processing
            {' '}
            <span className='bold'>
              {selectedFile1?.name}
              {' '}
              and
              {' '}
              {selectedFile2?.name}
            </span>
            {' '}
            <span className='italics'>(this can take a few minutes)</span>
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
      </Modal>
    </>
  );
};