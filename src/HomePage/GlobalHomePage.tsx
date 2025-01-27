import styled from 'styled-components';
import {
  Alert,
  message, Modal, Popover, Segmented, Select, Table, Tooltip, Upload, UploadFile,
} from 'antd';
import sortBy from 'lodash.sortby';
import TextTransition, { presets } from 'react-text-transition';
import { useState, useEffect } from 'react';
import { UploadChangeParam } from 'antd/es/upload/interface';
import { InfoCircleOutlined } from '@ant-design/icons';
import { FileUpIcon, InfoIcon } from 'lucide-react';
import CountryTaxonomy from '../Data/countryTaxonomy.json';
import IMAGES from '../img/images';
import { InterlinkageOverview } from './InterlinkageOverview';
import { FILES_LIMIT, SDG_COLOR_ARRAY } from '../Constants';
import { AccordionEl } from './Accordion';
import { ForceDirectedGraph } from './InterlinkageOverview/FDG';
import './HomePageStyle.css';
import { extractTextFromPDFs } from '../utils/extractPDF';
import { submitDocumentsForAnalysis } from '../api/prioritiesCall';
import { VNRAnalysis } from '../Priorities/VNRAnalysis';

const FirstColumn = styled.div`
  width: 100%;
  max-width: 1024px;
  flex-grow: 1;
  @media (max-width: 600px) {
    width: 100%;
  }
`;
const SecondColumn = styled.div`
  width: 100%;
  flex-grow: 1;
  @media (max-width: 600px) {
    width: 100%;
  }
`;

const AccordionColumn = styled.div`
  width: calc(66.66% - 2rem);
  @media (max-width: 720px) {
    width: 100%;
  }
`;

const AccordionImageColumn = styled.div`
  width: 33%;
  @media (max-width: 720px) {
    display: none;
  }
`;

const Button = styled.button`
  width: 3rem;
  height: 3rem;
  border-radius: 3rem;
  background-color: var(--white);
  border: 0;
`;

const FileNameChip = styled.div`
  font-size: 1rem;
  padding: 0.5rem;
  background-color: var(--gray-300);
  font-weight: bold;
  margin: 2px;
`;

const HeaderTextDiv = styled.div`
  position: absolute;
  top: 0;
  height: calc(100vh - 115px - 1rem);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: 115px;
  padding-left: var(--spacing-09);
  padding-right: var(--spacing-09);
  @media (max-width: 720px) {
    padding-left: var(--spacing-05);
    padding-right: var(--spacing-05);
  }
`;
export const GlobalHomePage = () => {
  const [index, setIndex] = useState(0);
  const countriesList = ['Everyone', 'South Africa', 'Kuwait', 'Nepal', 'Sri Lanka', 'Benin', 'Everyone', 'Gabon', 'Cuba', 'Botswana', 'Iran', 'Cabo Verde', 'Everyone', 'Gambia', 'Philippines', 'Iraq', 'Namibia', 'Malawi', 'Everyone', 'Kyrgyzstan', 'Lesotho', 'Senegal', 'Bangladesh', 'Serbia', 'Everyone', 'Cameroon', 'Djibouti', 'Bhutan', 'Egypt', 'Maldives'];

  const [fileNames, setFileNames] = useState(new Set());
  const [model, setModel] = useState<'legacy' | 'newer'>('legacy');
  const [strategy, setStrategy] = useState<'equal' | 'proportional' | 'custom'>('equal');
  const [textFiles, setTextFiles] = useState<any[]>([]);
  const [processingCount, setProcessingCount] = useState<number>(0);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionError, setExtractionError] = useState(new Set<string>());
  const [selectedFileNotAnalyzed, setSelectedFileNotAnalyzed] = useState<any>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [customWeights, setCustomWeights] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<any>([]);
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    const intervalId = setInterval(
      () => setIndex((indx) => indx + 1),
      1000, // every 3 seconds
    );
    return () => clearTimeout(intervalId);
  }, []);

  useEffect(() => {
    if (processingCount === 0) {
      setIsExtracting(false);
    }
  }, [processingCount]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleCustomWeightChange = (fileName: string, value: number) => {
    setCustomWeights((prevWeights) => ({
      ...prevWeights,
      [fileName]: value,
    }));
  };

  const analyzeDocuments = async (textsFiles: any[]) => {
    try {
      setStatus('Starting analysis...');

      const plaintextFiles = textsFiles.map((file) => {
        const blob = new Blob([file.text], { type: 'text/plain' });
        return new File([blob], `${file.file_name}.txt`, { type: 'text/plain' });
      });

      if (plaintextFiles.length === 0) {
        setError('No valid text files to submit for analysis.');
        setLoading(false);
        return;
      }

      setStatus(`Analyzing ${textFiles.length} document(s)...`);
      const pagesArray = textsFiles.map((file) => Number(file.pageCount));
      const customWeightsArray = textsFiles.map((file) => customWeights[file.file_name] || 1);

      const response = await submitDocumentsForAnalysis(
        plaintextFiles,
        strategy === 'proportional' ? pagesArray : strategy === 'custom' ? customWeightsArray : undefined,
        model === 'newer' ? 2 : 1,
      );

      const filesWithoutTxtExtension = plaintextFiles.map((file) => {
        const originalFileName = file.name.replace(/\.txt$/, '');
        return new File([file], originalFileName, { type: file.type });
      });

      setStatus('Analysis complete');

      setSelectedFile(filesWithoutTxtExtension);
      setData({ mode: 'analyze', data: response.sdgs });
      setLoading(false);
      setStatus(null);
      setError(null);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };
  return (
    <>
      <div className='background'>
        <div className='blob blob1' />
        <div className='blob blob2' />
        <HeaderTextDiv>
          <div style={{ color: 'var(--white)', maxWidth: '65rem' }}>
            <h1 className='undp-typography' style={{ wordBreak: 'break-word', marginBottom: 0 }}>
              How is
            </h1>
            <h1 className='undp-typography' style={{ wordBreak: 'break-word', marginBottom: 0 }}>
              <TextTransition springConfig={presets.wobbly} inline>{countriesList[index % countriesList.length]}</TextTransition>
            </h1>
            <h1 className='undp-typography' style={{ wordBreak: 'break-word' }}>doing?</h1>
            <p className='undp-typography'>
              UNDP&apos;s Integrated SDG Insights explore how to achieve the SDGs by 2030.
              <br />
              So that no one is left behind.
            </p>
            <Button onClick={() => { document.getElementById('section-2')?.scrollIntoView(); }} type='button'><img className='margin-top-02' width={24} src='https://design.undp.org/icons/chevron-down.svg' alt='icon' /></Button>
          </div>
        </HeaderTextDiv>
      </div>
      <div className='flex-div gap-00' style={{ flexGrow: 1 }}>
        {
        Array.from(Array(17).keys()).map((d) => <div key={d} style={{ height: '1rem', backgroundColor: SDG_COLOR_ARRAY[d], flexGrow: 1 }} />)
      }
      </div>
      <div id='section-2' className='padding-left-07 padding-right-07' style={{ backgroundColor: 'var(--gray-700)', paddingTop: '8rem', paddingBottom: '8rem' }}>
        <div style={{
          maxWidth: '1024px',
          margin: 'auto',
          textAlign: 'center',
          color: 'var(--white)',
        }}
        >
          <h2 className='undp-typography'>
            See how your country is doing
          </h2>
          <p className='undp-typography margin-bottom-07'>
            The SDG Push Diagnostic provides a dynamic visualization of the development landscape  to help countries chart acceleration pathways through their policy choices.
          </p>
          <Select
            style={{ width: '100%' }}
            className='undp-select'
            placeholder='Select Country'
            showSearch
            onChange={(value) => { window.open(`../../${CountryTaxonomy[CountryTaxonomy.findIndex((d) => d['Country or Area'] === value)]['Alpha-3 code-1']}`, '_self'); }}
          >
            {
            sortBy(CountryTaxonomy, 'Country or Area').map((d, i: number) => <Select.Option key={i} className='undp-select-option' value={d['Country or Area']}>{d['Country or Area']}</Select.Option>)
          }
          </Select>
        </div>
      </div>
      <div className='padding-top-12 padding-bottom-12 padding-left-07 padding-right-07' style={{ backgroundColor: 'var(--blue-600)' }}>
        <div className='max-width'>
          <div className='flex-div flex-wrap margin-bottom-09' style={{ color: 'var(--white)' }}>
            <SecondColumn className='undp-section-content'>
              <h2 className='undp-typography margin-bottom-00'>SDG Push Diagnostic Features</h2>
            </SecondColumn>
            <FirstColumn className='undp-section-content'>
              The SDG Push Diagnostic provides a dynamic visualization of the development landscape to help countries chart acceleration pathways through their policy choices. It integrates multiple data sources to establish a rapid landscape analysis that showcases SDG trends, national priorities, interlinkages, and potential futures.
            </FirstColumn>
          </div>
          <div className='margin-bottom-05'>
            <AccordionEl
              title='SDG Moment'
              body={(
                <div className='flex-div gap-07'>
                  <AccordionColumn>
                    <p className='undp-typography large-font'>
                      Assesses challenges and opportunities in national growth trajectories with insights on environmental sustainability and inclusiveness.
                      <br />
                      <br />
                      <span className='bold'>Data Sources</span>
                      <br />
                      Future trajectories to 2025 are based on IMF-WEO GDP projections, distributions of per capita income or consumption from the World Bank, and CO2 emissions from the Global Carbon Budget 2022 and EDGAR (JRC and IEA).
                    </p>
                  </AccordionColumn>
                  <AccordionImageColumn>
                    <img alt='sgd moment' src={IMAGES.img06} style={{ width: '100%' }} />
                  </AccordionImageColumn>
                </div>
          )}
            />
          </div>
          <div className='margin-bottom-05'>
            <AccordionEl
              title='SDG Trends'
              body={(
                <div className='flex-div gap-07'>
                  <AccordionColumn>
                    <p className='undp-typography large-font'>
                      Progress on the 17 SDGs are tracked through 169 sub-targets, which in turn are measured using
                      {' '}
                      <a href='https://unstats.un.org/sdgs/indicators/Global%20Indicator%20Framework%20after%20refinement_Eng.pdf' target='_blank' rel='noreferrer' className='undp-style'>232 unique indicators</a>
                      .
                      <br />
                      <br />
                      Understanding how countries perform against these provides an assessment of SDG progress and the baseline landscape against which to build SDG policy pathways.
                      <br />
                      <br />
                      Countries SDG trends are based on
                      {' '}
                      <a href='https://unstats.un.org/sdgs/dataportal' target='_blank' rel='noreferrer' className='undp-style'>data</a>
                      {' '}
                      and
                      {' '}
                      <a href='https://unstats.un.org/sdgs/report/2022/Progress_Chart_Technical_Note_2022.pdf' target='_blank' rel='noreferrer' className='undp-style'>methodology</a>
                      {' '}
                      from the UN Statistics Division. Additional data may be added to address gaps at government request, to provide a comprehensive landscape for identification of SDG policy pathways.
                    </p>
                    <p className='label margin-top-07'>Select a country or territory to explore SDG trends </p>
                    <Select
                      style={{ width: '100%' }}
                      className='undp-select'
                      placeholder='Select Country'
                      showSearch
                      onChange={(value) => { window.open(`./${CountryTaxonomy[CountryTaxonomy.findIndex((d) => d['Country or Area'] === value)]['Alpha-3 code-1']}/sdg-trends`, '_self'); }}
                    >
                      {
                    sortBy(CountryTaxonomy, 'Country or Area').map((d, i: number) => <Select.Option key={i} className='undp-select-option' value={d['Country or Area']}>{d['Country or Area']}</Select.Option>)
                  }
                    </Select>
                  </AccordionColumn>
                  <AccordionImageColumn>
                    <img alt='sgd trends' src={IMAGES.imgO1} style={{ width: '100%' }} />
                  </AccordionImageColumn>
                </div>
          )}
            />
          </div>
          <div className='margin-bottom-05'>
            <AccordionEl
              title='National Priorities'
              body={(
                <div className='flex-div gap-07'>
                  <AccordionColumn>
                    <p className='undp-typography large-font'>
                      Current priorities are analysed using machine learning to reveal the most prominent SDGs referenced in national policy documents. This analysis uses a custom-built model for SDG classification. The training data is based on an improved
                      {' '}
                      <a href='https://zenodo.org/record/6831287#.ZGVpKHZBxhZ' target='_blank' rel='noreferrer' className='undp-style'>OSDG Community Dataset</a>
                      . It considers 100k+ terms, including phrases and expressions.
                      <br />
                      <br />
                      Explore the analysis of these priorities using Machine Learning by country.
                    </p>
                    <p className='label margin-top-07'>Select a country or territory to explore national priorities</p>
                    <Select
                      style={{ width: '100%' }}
                      className='undp-select'
                      placeholder='Select Country'
                      showSearch
                      onChange={(value) => { window.open(`./${CountryTaxonomy[CountryTaxonomy.findIndex((d) => d['Country or Area'] === value)]['Alpha-3 code-1']}/current-priorities`, '_self'); }}
                    >
                      {
                  sortBy(CountryTaxonomy, 'Country or Area').map((d, i: number) => <Select.Option key={i} className='undp-select-option' value={d['Country or Area']}>{d['Country or Area']}</Select.Option>)
                }
                    </Select>
                  </AccordionColumn>
                  <AccordionImageColumn>
                    <img alt='Future Scenarios' src={IMAGES.img02} style={{ width: '100%' }} />
                  </AccordionImageColumn>
                </div>
          )}
            />
          </div>
          <div className='margin-bottom-05'>
            <AccordionEl
              title='SDG Interlinkages'
              body={(
                <div className='flex-div gap-07'>
                  <AccordionColumn>
                    <p className='undp-typography large-font'>
                      The SDGs do not exist in silos. Understanding the interactions across social, economic and environmental elements of sustainable development is essential to move the needle on the SDGs. SDG Interlinkages show how actions directed towards one SDG can influence the others. Uncovering and understanding these interactions helps in achieving the 2030 Agenda - avoiding the unintended deterioration of the SDGs and their 169 associated targets.
                      <br />
                      <br />
                      The target-level interlinkages are based on the latest available methodology by the
                      {' '}
                      <a href='https://knowsdgs.jrc.ec.europa.eu/interlinkages-targets' target='_blank' rel='noreferrer' className='undp-style'>KnowSDGs Platform by European Commission</a>
                      . A first literature review (
                      <a href='https://publications.jrc.ec.europa.eu/repository/handle/JRC115163' target='_blank' rel='noreferrer' className='undp-style'>Miola et al., 2019</a>
                      ) was updated and expanded in
                      {' '}
                      <a href='https://knowsdgs.jrc.ec.europa.eu/intro-interlinkages' target='_blank' rel='noreferrer' className='undp-style'>2021-2022</a>
                      {' '}
                      by a team of researchers who retrieved and analysed all relevant scientific and grey literature* on SDG interlinkages, both in Scopus and Google Scholar.
                    </p>
                    <p className='label margin-top-07'>Select a country or territory to explore SDG interlinkages</p>
                    <Select
                      style={{ width: '100%' }}
                      className='undp-select'
                      placeholder='Select Country'
                      showSearch
                      onChange={(value) => { window.open(`./${CountryTaxonomy[CountryTaxonomy.findIndex((d) => d['Country or Area'] === value)]['Alpha-3 code-1']}/synergies-and-tradeoffs`, '_self'); }}
                    >
                      {
                  sortBy(CountryTaxonomy, 'Country or Area').map((d, i: number) => <Select.Option key={i} className='undp-select-option' value={d['Country or Area']}>{d['Country or Area']}</Select.Option>)
                }
                    </Select>
                  </AccordionColumn>
                  <AccordionImageColumn>
                    <img alt='interlinkages' src={IMAGES.img04} style={{ width: '100%' }} />
                  </AccordionImageColumn>
                </div>
          )}
            />
          </div>
          <div className='margin-bottom-05'>
            <AccordionEl
              title='Future Scenarios'
              body={(
                <div className='flex-div gap-07'>
                  <AccordionColumn>
                    <p className='undp-typography large-font'>
                      SDG Push identifies national
                      {' '}
                      <a href='https://sdgintegration.undp.org/covid-impact-low-and-medium-hdi-groups' target='_blank' className='undp-style' rel='noreferrer'>SDG insights based on integrated accelerators</a>
                      {' '}
                      across Governance, Social Protection, Green Economy and Digital Disruption.
                      <br />
                      <br />
                      Based on the systems model of
                      {' '}
                      <a href='https://korbel.du.edu/pardee/international-futures-platform' target='_blank' className='undp-style' rel='noreferrer'>international futures</a>
                      , SDG Push models the impact that incorporating SDG Push accelerators in development can make, providing valuable insights into systems interactions across the SDGs.
                    </p>
                    <p className='label margin-top-07'>Select a country or territory to explore future scenarios</p>
                    <Select
                      style={{ width: '100%' }}
                      className='undp-select'
                      placeholder='Select Country'
                      showSearch
                      onChange={(value) => { window.open(`./${CountryTaxonomy[CountryTaxonomy.findIndex((d) => d['Country or Area'] === value)]['Alpha-3 code-1']}/future-scenarios`, '_self'); }}
                    >
                      {
                  sortBy(CountryTaxonomy, 'Country or Area').map((d, i: number) => <Select.Option key={i} className='undp-select-option' value={d['Country or Area']}>{d['Country or Area']}</Select.Option>)
                }
                    </Select>
                  </AccordionColumn>
                  <AccordionImageColumn>
                    <img alt='future scenarios' src={IMAGES.img03} style={{ width: '100%' }} />
                  </AccordionImageColumn>
                </div>
          )}
            />
          </div>
          <div className='margin-bottom-05'>
            <AccordionEl
              title='Finance & Stimulus'
              body={(
                <div className='flex-div gap-07'>
                  <AccordionColumn>
                    <p className='undp-typography large-font'>
                      Provides insight into indicators of fiscal and financial stress with options (INFF) for stimulus and other means to accelerate progress.
                      <br />
                      <br />
                      <span className='bold'>Data Sources</span>
                      <br />
                      Most recent resource data from UNU-WIDER GRD (between 2018 and 2021), debt and revenue from IMF WEO (between 2020 and forecasts for 2023), external debt from IDS (2023), yields from Haver Analytics (8 June 2023), credit ratings from S&P, Moodys and FITCH (2023), and DSA ratings from World Bank/IMF (31 May 2023).
                    </p>
                  </AccordionColumn>
                  <AccordionImageColumn>
                    <img alt='finance and stimulus' src={IMAGES.img05} style={{ width: '100%' }} />
                  </AccordionImageColumn>
                </div>
          )}
            />
          </div>
        </div>
      </div>
      <div className='padding-top-12 padding-bottom-12 padding-left-07 padding-right-07' style={{ backgroundColor: 'var(--gray-100)' }}>
        <div className='flex-div flex-wrap margin-bottom-09 max-width'>
          <SecondColumn className='undp-section-content'>
            <h2 className='undp-typography'>The Integrated SDG Insight reports</h2>
          </SecondColumn>
          <FirstColumn className='undp-section-content large-font'>
            <p className='undp-typography'>
              The Diagnostic powers the Integrated SDG Insights which provide a strong evidence-base and relevant insights to support national ambition at the SDG Summit 2023.
            </p>
            <p className='undp-typography'>
              The methodology for the diagnostics can be found
              {' '}
              <a className='undp-style' href='https://sdgigeneralstorage.blob.core.windows.net/sdg-push/Methodology.pdf' target='_blank' rel='noreferrer'>here</a>
              .
            </p>
          </FirstColumn>
        </div>
        <div className='max-width'>
          <div className='margin-bottom-05'>
            <AccordionEl
              title='What is distinct about the Integrated SDG Insight reports?'
              body={(
                <div className='flex-div flex-wrap gap-07' style={{ alignItems: 'stretch' }}>
                  <FirstColumn>
                    <p className='undp-typography'>
                      The insights are unique — not a statistical gaps report or evaluation of development impact — but a playbook, showing the policy choices that build SDG pathways.
                    </p>
                    <p className='undp-typography'>
                      UNDP supported 90+ countries to generate these insights to come to the SDG Summit with a high level of ambition — and evidence-based pathways to achieve it. These insights are a result of country-level and government consultation, data analysis, machine learning, interlinkage mapping, and generating futures scenarios.
                    </p>
                    <p className='undp-typography margin-bottom-00'>
                      It also includes national analysis of economic growth pathways and fiscal and financial constraints, providing insights that are grounded in the countries&apos; realities.
                    </p>
                  </FirstColumn>
                  <SecondColumn style={{ backgroundColor: 'var(--gray-200)', display: 'flex', alignItems: 'center' }}>
                    <div className='stat-card'>
                      <h2>
                        90+
                      </h2>
                      <p>Countries supported by UNDP</p>
                    </div>
                  </SecondColumn>
                </div>
            )}
            />
          </div>
          <div className='margin-bottom-05'>
            <AccordionEl
              title='How SDG interlinkages helped to chart integrated SDG pathways?'
              body={(
                <div className='flex-div flex-wrap' style={{ alignItems: 'stretch' }}>
                  <p className='undp-typography'>
                    Building from national trends and priorities, SDG interlinkages help to chart integrated SDG pathways that reflect policy choices with the most potential to accelerate the SDGs.
                  </p>
                  <p className='undp-typography'>
                    SDG interlinkages reveal how actions directed towards one SDG can impact others. Uncovering and understanding these interactions can help to achieve the 2030 Agenda for Sustainable Development and navigating trade-offs.
                  </p>
                </div>
            )}
            />
          </div>
        </div>
      </div>
      <div className='padding-top-12 padding-bottom-12 padding-left-07 padding-right-07'>
        <div>
          <div className='flex-div flex-wrap margin-bottom-09 max-width' style={{ padding: '0 1rem' }}>
            <SecondColumn className='undp-section-content'>
              <h2 className='undp-typography margin-bottom-00'>Emerging Patterns</h2>
            </SecondColumn>
            <FirstColumn className='undp-section-content large-font'>
              Across 90+ reports, common SDG targets emerged as key entry points where investment in one SDG can unlock progress on others. The visuals below show the key SDG targets and the combination of policy choices that can re-balance social, environmental, and economic achievements.
            </FirstColumn>
          </div>
          <div style={{ padding: '0 1rem' }}>
            <div className='max-width'>
              <ForceDirectedGraph />
            </div>
          </div>
        </div>
      </div>
      <div className='padding-top-12 padding-bottom-12 padding-left-07 padding-right-07' style={{ backgroundColor: 'var(--blue-600)' }}>
        <div>
          <div className='flex-div flex-wrap margin-bottom-09 max-width' style={{ padding: '0 1rem', color: 'white' }}>
            <SecondColumn className='undp-section-content'>
              <h2 className='undp-typography margin-bottom-00'>Explore National Priorities</h2>
            </SecondColumn>
            <div className='undp-section-content large-font'>
              <h5 className='undp-typography margin-bottom-06'>
                One of the significant contributions of SDG Push Diagnostics is the Machine Learning algorithm that helps classify national documents based on the SDGs.
                {' '}
                <Popover
                  placement='top'
                  content={(
                    <div style={{
                      maxWidth: '500px',
                      maxHeight: '400px',
                      padding: '0.25rem',
                      textAlign: 'justify',
                      overflowY: 'auto',
                      borderRadius: 0,
                    }}
                    >
                      <p className='undp-typography margin-bottom-00' style={{ color: 'var(--black)' }}>
                        Countries&apos; national priorities are generated using machine learning to reveal the most prominent SDGs referenced in national policy documents. This analysis uses a custom-built model for SDG classification.
                        {' '}
                        <br />
                        <br />
                        {' '}
                        The training data is based on an improved
                        {' '}
                        <a href='https://zenodo.org/record/6831287#.ZGVKt3ZBxhZ' target='_blank' rel='noreferrer noopener' className='undp-style'>OSDG Community Dataset</a>
                        . It considers 100k+ terms, including phrases and expressions.
                      </p>
                    </div>
              )}
                >
                  <span style={{
                    cursor: 'pointer', textDecoration: 'underline', textDecorationStyle: 'dotted', textDecorationColor: 'var(--dark-red)', background: 'none', border: 'none', padding: 0,
                  }}
                  >
                    This methodology
                  </span>
                </Popover>
                {' '}
                can be applied to any document you may want to classify into SDGs. Explore here and analyze any document of your choice.
                {' '}
                <Tooltip title="The documents you upload are not stored in our system. The results you obtain are not shown to other users. For more robust results, use the documents that offer a comprehensive account of the country&apos;s activities and policies rather than thematic, narrowly-scoped or sectoral documents" placement='bottom'><InfoIcon size={20} /></Tooltip>
              </h5>
              <div
                className='max-width-1440'
                style={{
                  backgroundColor: 'var(--white)',
                  color: 'var(--black)',
                  padding: 'var(--spacing-06)',
                  margin: 'auto',
                  cursor: isExtracting ? 'progress' : 'default',
                }}
              >
                <div className='margin-top-04'>
                  <Upload.Dragger
                    name='file'
                    multiple
                    accept='.pdf'
                    showUploadList
                    maxCount={FILES_LIMIT}
                    beforeUpload={(file) => {
                      const isPDF = file.type === 'application/pdf';
                      if (!isPDF) {
                        message.error(`${file.name} is not a PDF file`);
                        return Upload.LIST_IGNORE;
                      }

                      if (fileNames.has(file.name)) {
                        message.error(`${file.name} is a duplicate file`, 5);
                        return Upload.LIST_IGNORE;
                      }

                      if (selectedFileNotAnalyzed.length >= FILES_LIMIT) {
                        message.error(`You can only upload up to ${FILES_LIMIT} files`, 8);
                        return Upload.LIST_IGNORE;
                      }

                      return true;
                    }}
                    onChange={
                        (info: UploadChangeParam<UploadFile>) => {
                          const newFileList = info.fileList;

                          setSelectedFileNotAnalyzed(newFileList);

                          const newFileNames = new Set(newFileList.map((file) => file.name));
                          setFileNames(newFileNames);

                          const newUploadErrors = new Set<string>();
                          newFileList.forEach((file) => {
                            if (file.status === 'error') {
                              newUploadErrors.add(file.uid);
                            }
                          });
                          setExtractionError(newUploadErrors);
                        }
                      }
                    onRemove={(file) => {
                      setTextFiles((prevTextFiles) => prevTextFiles.filter((textFile) => textFile.file_name !== file.name));
                      return true;
                    }}
                    onDrop={(e) => {
                      message.info(`Dropped files: ${e.dataTransfer.files.length}`);
                    }}
                    customRequest={async ({ file, onSuccess, onError }: any) => {
                      setProcessingCount((prev: number) => prev + 1);
                      setIsExtracting(true);
                      try {
                        const [extractedText] = await extractTextFromPDFs([file]);

                        if (extractedText.error) {
                          throw new Error(extractedText.text);
                        }

                        if (onSuccess) {
                          onSuccess('ok');
                        }

                        setSelectedFileNotAnalyzed((prevList: any[]) => prevList.map((f) => (f.uid === file.uid
                          ? { ...f, status: 'done', response: 'ok' }
                          : f)));

                        setTextFiles((prevTextFiles) => [...prevTextFiles, extractedText]);
                        // eslint-disable-next-line no-shadow
                      } catch (error: any) {
                        if (onError) {
                          onError(error);
                        }
                        setSelectedFileNotAnalyzed((prevList: any[]) => prevList.map((f) => (f.uid === file.uid
                          ? { ...f, status: 'error', error: error.message }
                          : f)));
                      } finally {
                        setProcessingCount((prev: number) => prev - 1);
                      }
                    }}
                    itemRender={(originNode) => (
                      <div
                        style={{
                          flexGrow: 0,
                          flexShrink: 1,
                          minWidth: '210px',
                          maxWidth: '210px',
                        }}
                      >
                        {originNode}
                      </div>
                    )}
                  >
                    <FileUpIcon />
                    <p className='ant-upload-text'>Click or drag file(s) to this area then click Analyze Documents</p>
                    <p className='ant-upload-hint'>
                      Up to
                      {' '}
                      {FILES_LIMIT}
                      {' '}
                      PDF files allowed.
                      <br />
                      <b>Note</b>
                      : Only English language is currently supported by the model. If your document is not in English please use Google Translate to translate the document in English and then upload the document.
                    </p>
                  </Upload.Dragger>
                </div>
                {extractionError.size > 0 && !isExtracting && (
                <Alert
                  style={{ marginTop: 20 }}
                  type='error'
                  message='Remove invalid documents to proceed with analysis. Hover on each file to understand why a file is invalid, or click below to auto remove all invalid files once processing is finished.'
                />
                )}

                {extractionError.size > 0 && !isExtracting
                      && (
                        <button
                          type='button'
                          style={{
                            backgroundColor: 'white',
                            border: 'none',
                            fontSize: 'small',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                          }}
                          onClick={() => {
                            const updatedSelectedFileNotAnalyzed = selectedFileNotAnalyzed.filter(
                              (file: { uid: string; }) => !extractionError.has(file.uid),
                            );

                            setSelectedFileNotAnalyzed(updatedSelectedFileNotAnalyzed);
                            const uploadComponent = document.querySelector('.ant-upload-list');
                            if (uploadComponent) {
                              const fileItems = uploadComponent.querySelectorAll('.ant-upload-list-item');
                              fileItems.forEach((item) => {
                                const fileName = item.querySelector('.ant-upload-list-item-name')?.textContent;
                                if (fileName && !updatedSelectedFileNotAnalyzed.some((file: { name: string; }) => file.name === fileName)) {
                                  const deleteButton = item.querySelector('.ant-upload-list-item-actions button') as HTMLButtonElement;
                                  if (deleteButton) {
                                    setTimeout(() => {
                                      deleteButton.click();
                                      // item.remove();
                                    }, 0);
                                  }
                                }
                              });
                            }
                            setExtractionError(new Set());
                          }}
                        >
                          Remove all invalid files
                        </button>
                      )}
                <div className='margin-top-07 margin-bottom-04' style={{ display: 'flex', flexDirection: 'row', gap: 20 }}>

                  <div>
                    <button
                      type='button'
                      className='undp-button button-primary button-arrow'
                      style={{ backgroundColor: textFiles.length === 0 || textFiles.length > FILES_LIMIT || isExtracting || extractionError.size > 0 ? 'gray' : '' }}
                      onClick={() => {
                        setLoading(true);
                        analyzeDocuments(textFiles);
                      }}
                      disabled={textFiles.length === 0 || textFiles.length > FILES_LIMIT || isExtracting || extractionError.size > 0}
                    >
                      Analyze Documents
                    </button>
                  </div>

                  <div>
                    <button
                      type='button'
                      className='undp-button button-secondary'
                      style={{ backgroundColor: 'white', color: 'black' }}
                      onClick={showModal}
                    >
                      Advanced Options
                    </button>
                    <Modal
                      className='undp-modal'
                      title='Advanced Options'
                      open={isModalVisible}
                      onOk={handleOk}
                      onCancel={handleCancel}
                    >
                      <p className='undp-typography label'>
                        Model Type
                        {' '}
                        <Tooltip title='Select which machine learning model version to use' placement='topLeft'>
                          <InfoCircleOutlined />
                        </Tooltip>
                      </p>
                      <Segmented
                        className='undp-segmented-small'
                        options={[
                          { label: 'Legacy Model', value: 'legacy' },
                          { label: 'Newer Model (Coming Soon)', value: 'newer', disabled: true },
                        ]}
                        value={model}
                        onChange={(value: 'legacy' | 'newer') => setModel(value)}
                      />

                      <p className='undp-typography label margin-top-05'>
                        Document Weights
                        {' '}
                        <Tooltip title='Select how the results are aggregated across the documents.' placement='topLeft'>
                          <InfoCircleOutlined />
                        </Tooltip>
                      </p>
                      <Segmented
                        className='undp-segmented-small'
                        options={[
                          { label: 'Equal', value: 'equal' },
                          { label: 'Length-based', value: 'proportional' },
                          { label: 'Manual', value: 'custom' },
                        ]}
                        value={strategy}
                        onChange={(value: 'equal' | 'proportional' | 'custom') => setStrategy(value)}
                      />

                      {strategy === 'equal' && (
                      <div style={{ marginTop: '1rem' }}>
                        <p style={{ fontSize: 'smaller' }}>Equal weights assigns uniform weights to all documents. This means that shorter documents contribute to the result as much as longer ones. Select this if the shorter documents in your set are conceptually and practically equally important to the longer ones.</p>
                        <Table
                          columns={[
                            {
                              title: 'Document',
                              dataIndex: 'name',
                              key: 'name',
                            },
                            {
                              title: (
                                <>
                                  Weight
                                  {' '}
                                  <Tooltip title='All documents have equal importance' placement='topRight'>
                                    <InfoCircleOutlined />
                                  </Tooltip>
                                </>
                              ),
                              dataIndex: 'value',
                              key: 'value',
                            },
                          ]}
                          dataSource={textFiles
                            .map((file) => ({
                              key: file.file_name,
                              name: file.file_name,
                              value: 1,
                            }))
                            .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))}
                          pagination={false}
                        />
                      </div>
                      )}

                      {strategy === 'proportional' && (
                      <div style={{ marginTop: '1rem' }}>
                        <p style={{ fontSize: 'smaller' }}>Length-based weights assigns more weight to longer documents, measured in terms of tokens (words). This means shorter documents contribute less to the result that longer ones. Select this if the shorter documents in your set are conceptually and practically less important than the longer ones.</p>
                        <Table
                          columns={[
                            {
                              title: 'Document',
                              dataIndex: 'name',
                              key: 'name',
                            },
                            {
                              title: (
                                <>
                                  Weight
                                  {' '}
                                  <Tooltip title='The importance of each document is determined by the number of pages' placement='topRight'>
                                    <InfoCircleOutlined />
                                  </Tooltip>
                                </>
                              ),
                              dataIndex: 'pageCount',
                              key: 'pageCount',
                            },
                          ]}
                          dataSource={textFiles
                            .map((file) => ({
                              key: file.file_name,
                              name: file.file_name,
                              pageCount: file.pageCount,
                            }))
                            .sort((a, b) => b.pageCount - a.pageCount)}
                          pagination={false}
                        />
                      </div>
                      )}

                      {strategy === 'custom' && (
                      <div style={{ marginTop: '1rem' }}>
                        <p style={{ fontSize: 'smaller' }}>Manual weights enables you to specify the weight of each document on a 5-point scale. Larger weight means that the document will have a larger contribution to the end result. Select this is the importance of documents cannot be measured in terms of their lengths alone.</p>
                        <Table
                          columns={[
                            {
                              title: 'Document',
                              dataIndex: 'name',
                              key: 'name',
                            },
                            {
                              title: (
                                <>
                                  Weight
                                  {' '}
                                  <Tooltip title='Set relative importance weight for each document' placement='topRight'>
                                    <InfoCircleOutlined />
                                  </Tooltip>
                                </>
                              ),
                              dataIndex: 'customWeight',
                              key: 'customWeight',
                              render: (text, record) => (
                                <Segmented
                                  className='undp-segmented-small'
                                  options={[1, 2, 3, 4, 5].map((val) => ({ label: val.toString(), value: val }))}
                                  value={customWeights[record.name] || 3}
                                  onChange={(value) => handleCustomWeightChange(record.name, value)}
                                  placeholder='Set custom weight'
                                />
                              ),
                            },
                          ]}
                          dataSource={textFiles
                            .map((file) => ({
                              key: file.file_name,
                              name: file.file_name,
                              customWeight: customWeights[file.file_name] || 1,
                            }))
                            .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))}
                          pagination={false}
                        />
                      </div>
                      )}
                    </Modal>
                  </div>

                </div>

                {
                  error
                    ? (
                      <div
                        className='margin-top-07 max-width'
                        style={{
                          padding: 'var(--spacing-09)', backgroundColor: 'var(--gray-200)', width: 'calc(100% - 6rem)', textAlign: 'center',
                        }}
                      >
                        <h6 className='undp-typography margin-bottom-00' style={{ color: 'var(--dark-red)' }}>
                          We are sorry! Something went wrong in the analysis.
                          <br />
                          <br />
                          Please try again later after sometime and make sure you are uploading a PDF document
                        </h6>
                      </div>
                    )
                    : data
                      ? (
                        <div
                          className='margin-top-11'
                        >
                          <div className='flex-div flex-vert-align-center flex-wrap'>
                            <h5 className='undp-typography margin-bottom-00'>
                              National Priorities Based on
                            </h5>
                            {selectedFile.map((d: any) => d.name).length === 1 ? (
                              <FileNameChip>
                                {selectedFile.link ? (
                                  <a href={selectedFile[0].link} target='_blank' rel='noreferrer' className='undp-style'>{selectedFile[0].name}</a>
                                ) : (
                                  selectedFile[0].name
                                )}
                              </FileNameChip>
                            ) : (
                              <Popover
                                title='Analysis based on the following files'
                                placement='topRight'
                                content={(
                                  <div style={{ maxHeight: '200px', overflowY: 'scroll' }}>
                                    {selectedFile.map((d: any) => d.name) && selectedFile.map((d: any) => d.name).map((d: any, i: number) => <FileNameChip key={i}>{d}</FileNameChip>)}
                                  </div>
                            )}
                              >
                                <Button>
                                  {selectedFile.map((d: any) => d.name).length}
                                  {' '}
                                  file(s)
                                </Button>
                              </Popover>
                            )}
                          </div>
                          <VNRAnalysis
                            data={data.mode === 'analyze' || data.mode === 'defaultDocs' ? data.data : data}
                            document={selectedFile.map((d: any) => d.name)}
                            defaultDocs={false}
                            onlyBubbleChart
                            hideTitle
                          />
                        </div>
                      )
                      : null
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='padding-top-12 padding-bottom-12 padding-left-07 padding-right-07'>
        <div>
          <div className='flex-div flex-wrap margin-bottom-09 max-width' style={{ padding: '0 1rem' }}>
            <SecondColumn className='undp-section-content'>
              <h2 className='undp-typography margin-bottom-00'>Regional and Income Group Comparisons</h2>
            </SecondColumn>
            <FirstColumn className='undp-section-content large-font'>
              <p className='undp-typography'>
                Explore the full dataset by region and income classification to show unique entry points for integrated SDG pathways.
              </p>
              <p className='undp-typography italics'>
                Explore the secondary targets associated to each primary target by clicking on the primary target bubbles below.
                Click on the regions or income groups to see more detail of the countries analyzed within each group.
              </p>
            </FirstColumn>
          </div>
          <div className='max-width'>
            <InterlinkageOverview />
          </div>
        </div>
      </div>
      <div className='padding-top-12 padding-bottom-12 padding-left-07 padding-right-07' style={{ backgroundColor: 'var(--gray-700)' }}>
        <div style={{
          maxWidth: '1024px',
          margin: 'auto',
          textAlign: 'center',
          color: 'var(--white)',
        }}
        >
          <h2 className='undp-typography'>
            See how your country is doing
          </h2>
          <p className='undp-typography margin-bottom-07'>
            The SDG Push Diagnostic provides a dynamic visualization of the development landscape  to help countries chart acceleration pathways through their policy choices.
          </p>
          <Select
            style={{ width: '100%' }}
            className='undp-select'
            placeholder='Select Country'
            showSearch
            onChange={(value) => { window.open(`../../${CountryTaxonomy[CountryTaxonomy.findIndex((d) => d['Country or Area'] === value)]['Alpha-3 code-1']}`, '_self'); }}
          >
            {
            sortBy(CountryTaxonomy, 'Country or Area').map((d, i: number) => <Select.Option key={i} className='undp-select-option' value={d['Country or Area']}>{d['Country or Area']}</Select.Option>)
          }
          </Select>
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
      <Modal
        className='undp-modal undp-loading-modal'
        title=''
        open={loading}
      >
        <div style={{ margin: 'auto' }}>
          <div className='undp-loader' style={{ margin: 'auto' }} />
        </div>
        <div style={{
          display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%',
        }}
        >
          <p>
            {status}
          </p>
        </div>
      </Modal>
    </>
  );
};
