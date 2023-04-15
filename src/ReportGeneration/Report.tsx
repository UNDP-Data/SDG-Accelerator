/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  Page, Text, View, Document, StyleSheet, Image, Link,
} from '@react-pdf/renderer';
import html2canvas from 'html2canvas';
import { useEffect, useState } from 'react';
import { ReportTranslation } from './ReportLanguage';
import { LanguageList } from '../Types';

interface Props {
  countryName: string;
  gapDiv: HTMLDivElement;
  prioritiesDiv: HTMLDivElement;
  gapPrioritiesMatrixDiv: HTMLDivElement;
  interlinkagesDiv: HTMLDivElement;
  futureScenarioDiv: HTMLDivElement;
  dataWithStatus: any;
  selectedTarget: string;
  sdgForInterlinkage: any;
  docName: string[];
  language: LanguageList;
}

// Create styles

export const MyDocument = (props: Props) => {
  const {
    countryName,
    gapDiv,
    prioritiesDiv,
    gapPrioritiesMatrixDiv,
    dataWithStatus,
    interlinkagesDiv,
    futureScenarioDiv,
    selectedTarget,
    sdgForInterlinkage,
    docName,
    language,
  } = props;
  const font = 'Helvetica';
  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#fff',
    },
    documentName: {
      fontSize: '36px',
      textAlign: 'center',
      fontWeight: 'bold',
      fontFamily: `${font}-Bold`,
      color: '#006EB5',
    },
    title: {
      fontSize: '24px',
      textAlign: 'center',
      fontWeight: 'bold',
      fontFamily: `${font}-Bold`,
      color: '#006EB5',
      marginTop: 32,
    },
    year: {
      fontSize: '20px',
      textAlign: 'center',
      fontWeight: 'bold',
      fontFamily: `${font}-Bold`,
      textTransform: 'uppercase',
      padding: 10,
      marginBottom: 30,
      width: 300,
    },
    subNote: {
      fontSize: '14px',
      textAlign: 'center',
      fontFamily: font,
      width: 300,
    },
    subNoteSmall: {
      fontSize: '14px',
      textAlign: 'center',
      fontFamily: font,
      width: 300,
      color: '#999',
      marginTop: 20,
    },
    text: {
      fontSize: '14px',
      textAlign: 'left',
      fontFamily: font,
      marginBottom: 20,
    },
    boldText: {
      fontSize: '14px',
      textAlign: 'left',
      fontWeight: 'bold',
      fontFamily: `${font}-Bold`,
      marginBottom: 20,
    },
    coverSection: {
      margin: 10,
      marginTop: 240,
      padding: 10,
      alignItems: 'center',
      flexDirection: 'column',
      display: 'flex',
    },
    section: {
      padding: 0,
    },
    highlightSection: {
      padding: 32,
      backgroundColor: 'rgba(0, 110, 181, 0.05)',
      marginBottom: '20px',
    },
    insidePageSection: {
      margin: 10,
      padding: 50,
      flexDirection: 'column',
      display: 'flex',
    },
    pageTitle: {
      fontSize: '36px',
      fontWeight: 'bold',
      fontFamily: `${font}-Bold`,
      color: '#006EB5',
      marginBottom: 36,
    },
    SVGText: {
      fontSize: '30px',
      fontWeight: 'bold',
      fontFamily: `${font}-Bold`,
    },
    SVGTextNote: {
      fontSize: '16px',
      fontFamily: font,
    },
    SVGKeyText: {
      fontSize: '14px',
      fontWeight: 'bold',
      fontFamily: font,
    },
    pageH2: {
      fontSize: '18px',
      fontFamily: `${font}-Bold`,
      marginBottom: 24,
    },
    image: {
      width: 500,
      height: 500,
    },
  });
  let highPrioritySDG = '';
  dataWithStatus.filter((d: any) => d.category === 'High').forEach((d: any) => {
    highPrioritySDG += `SDG${d.sdg}, `;
  });
  const [currentGapsCanvas, setCurrentGapCanvas] = useState<string | null>(null);
  const [prioritiesCanvas, setPrioritiesCanvas] = useState<string | null>(null);
  const [gapPrioritiesMatrixCanvas, setGapPrioritiesMatrixCanvas] = useState<string | null>(null);
  const [interlinkageCanvas, setInterlinkageCanvas] = useState<string | null>(null);
  const [futureScenarioCanvas, setFutureScenarioCanvas] = useState<string | null>(null);
  useEffect(() => {
    if (gapDiv) {
      html2canvas(gapDiv).then((canvas) => {
        setCurrentGapCanvas(canvas.toDataURL());
      });
    }
  }, [gapDiv]);
  useEffect(() => {
    if (prioritiesDiv) {
      html2canvas(prioritiesDiv).then((canvas) => {
        setPrioritiesCanvas(canvas.toDataURL());
      });
    }
  }, [prioritiesDiv]);
  useEffect(() => {
    if (gapPrioritiesMatrixDiv) {
      html2canvas(gapPrioritiesMatrixDiv).then((canvas) => {
        setGapPrioritiesMatrixCanvas(canvas.toDataURL());
      });
    }
  }, [gapPrioritiesMatrixDiv]);
  useEffect(() => {
    if (interlinkagesDiv) {
      html2canvas(interlinkagesDiv).then((canvas) => {
        setInterlinkageCanvas(canvas.toDataURL());
      });
    }
  }, [interlinkagesDiv]);
  useEffect(() => {
    if (futureScenarioDiv) {
      html2canvas(futureScenarioDiv).then((canvas) => {
        setFutureScenarioCanvas(canvas.toDataURL());
      });
    }
  }, [futureScenarioDiv]);
  return (
    <>
      {
        currentGapsCanvas && prioritiesCanvas && gapPrioritiesMatrixCanvas && interlinkageCanvas
          ? (
            <Document>
              <Page style={styles.page}>
                <View style={styles.coverSection}>
                  <Text style={styles.documentName}>{ReportTranslation[ReportTranslation.findIndex((d) => d.key === 'docTitle')][language]}</Text>
                  <Text style={styles.documentName}>{countryName}</Text>
                  <Text style={styles.title}>SDG Push Diagnostic</Text>
                  <Text style={styles.year}>
                    {new Date().getDate() + 1}
                    /
                    {new Date().getMonth()}
                    /
                    {new Date().getFullYear()}
                  </Text>
                  <Text style={styles.subNote}>
                    {ReportTranslation[ReportTranslation.findIndex((d) => d.key === 'poweredBy')][language]}
                    {' '}
                    <Link style={{ textDecoration: 'underline', color: '#006EB5', fontStyle: 'italics' }} src='https://data.undp.org/'>Data Futures Platform</Link>
                  </Text>
                  <Text style={styles.subNoteSmall}>
                    {ReportTranslation[ReportTranslation.findIndex((d) => d.key === 'autoGenerated')][language]}
                  </Text>
                </View>
              </Page>
              <Page style={{ padding: 50 }}>
                <View style={styles.section}>
                  <Text
                    style={{
                      fontSize: 20,
                      fontFamily: `${font}-Bold`,
                      fontWeight: 'bold',
                      marginBottom: 20,
                    }}
                  >
                    {countryName}
                    {' '}
                    {ReportTranslation[ReportTranslation.findIndex((d) => d.key === 'summaryReport')][language]}
                  </Text>
                  <Text
                    style={{
                      fontSize: 20,
                      fontFamily: font,
                      marginBottom: 20,
                    }}
                  >
                    SDG Push Diagnostic
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontStyle: 'italics',
                      fontFamily: font,
                      marginBottom: 20,
                      lineHeight: 1.5,
                    }}
                  >
                    {ReportTranslation[ReportTranslation.findIndex((d) => d.key === 'reportGenerated')][language]}
                    {' '}
                    <Link style={{ textDecoration: 'underline', color: '#006EB5', fontStyle: 'italics' }} src='https://data.undp.org/sdg-push-diagnostic/'>SDG Push Diagnostic</Link>
                    {' '}
                    {ReportTranslation[ReportTranslation.findIndex((d) => d.key === 'for')][language]}
                    {' '}
                    {countryName}
                    {' '}
                    {ReportTranslation[ReportTranslation.findIndex((d) => d.key === 'on')][language]}
                    {' '}
                    {new Date().getDate() + 1}
                    /
                    {new Date().getMonth()}
                    /
                    {new Date().getFullYear()}
                  </Text>
                  <View style={styles.highlightSection}>
                    <Text
                      style={{
                        fontSize: '14px',
                        textAlign: 'left',
                        fontWeight: 'bold',
                        fontFamily: `${font}-Bold`,
                        marginBottom: 10,
                      }}
                    >
                      {ReportTranslation[ReportTranslation.findIndex((d) => d.key === 'background')][language]}
                    </Text>
                    <Text
                      style={{
                        fontSize: '12px',
                        textAlign: 'left',
                        fontFamily: font,
                        marginBottom: 10,
                        lineHeight: 1.5,
                      }}
                    >
                      {ReportTranslation[ReportTranslation.findIndex((d) => d.key === 'docIntro')][language]}
                    </Text>
                    <Text
                      style={{
                        fontSize: '12px',
                        lineHeight: 1.5,
                        textAlign: 'left',
                        fontFamily: font,
                      }}
                    >
                      {ReportTranslation[ReportTranslation.findIndex((d) => d.key === 'sdgPushIntro')][language]}
                    </Text>
                  </View>
                  <Text style={styles.boldText}>
                    {ReportTranslation[ReportTranslation.findIndex((d) => d.key === 'currentPriorities')][language]}
                  </Text>
                  <Text
                    style={{
                      fontSize: '12px',
                      lineHeight: 1.5,
                      textAlign: 'left',
                      fontFamily: font,
                      marginBottom: 20,
                    }}
                  >
                    {ReportTranslation[ReportTranslation.findIndex((d) => d.key === 'priorityAnalysis')][language]}
                  </Text>
                  {
                    prioritiesCanvas
                      ? (
                        <Image
                          src={prioritiesCanvas}
                        />
                      ) : null
                  }
                  <Text
                    style={{
                      fontSize: '12px',
                      lineHeight: 1.5,
                      textAlign: 'left',
                      fontFamily: font,
                      marginBottom: 20,
                    }}
                  >
                    {ReportTranslation[ReportTranslation.findIndex((d) => d.key === 'sdgAnalysisMethodology')][language]}
                    {' '}
                    <Link style={{ textDecoration: 'underline', color: '#006EB5', fontStyle: 'italics' }} src='https://data.undp.org/sdg-push-diagnostic/Methodology.pdf'>SDG Push - Diagnostic Methodological Note & User Guide.pdf</Link>
                    {' '}
                    {ReportTranslation[ReportTranslation.findIndex((d) => d.key === 'detailedMethodology')][language]}
                  </Text>
                  <View style={styles.highlightSection}>
                    <Text
                      style={{
                        fontSize: '14px',
                        textAlign: 'left',
                        fontWeight: 'bold',
                        lineHeight: 1.5,
                        fontFamily: `${font}-Bold`,
                      }}
                    >
                      {ReportTranslation[ReportTranslation.findIndex((d) => d.key === 'countryActionPriorities')][language].replaceAll('{{countryName}}', countryName).replaceAll('{{sdgList}}', highPrioritySDG).replaceAll('SDG', ReportTranslation[ReportTranslation.findIndex((d) => d.key === 'sdg')][language])}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: '12px',
                      lineHeight: 1.5,
                      textAlign: 'left',
                      fontFamily: font,
                      marginBottom: 20,
                    }}
                  >
                    {ReportTranslation[ReportTranslation.findIndex((d) => d.key === 'detailedMethodologyPara1')][language]}
                  </Text>
                  <Text
                    style={{
                      fontSize: '12px',
                      lineHeight: 1.5,
                      textAlign: 'left',
                      fontFamily: font,
                      marginBottom: 20,
                    }}
                  >
                    {ReportTranslation[ReportTranslation.findIndex((d) => d.key === 'MatrixMapping')][language]}
                  </Text>
                  <Text style={{
                    fontSize: '12px',
                    textAlign: 'left',
                    fontWeight: 'bold',
                    fontFamily: `${font}-Bold`,
                    marginBottom: 10,
                    lineHeight: 1.5,
                  }}
                  >
                    {ReportTranslation[ReportTranslation.findIndex((d) => d.key === 'comparingSDGNationalPriorities')][language].replaceAll('{{docName}}', docName.join(', '))}
                  </Text>
                  <Text
                    style={{
                      fontSize: '12px',
                      lineHeight: 1.5,
                      textAlign: 'left',
                      fontFamily: font,
                      marginBottom: 5,
                    }}
                  >
                    {ReportTranslation[ReportTranslation.findIndex((d) => d.key === 'SDGMatrixParameters')][language]}
                  </Text>
                  <Text
                    style={{
                      fontSize: '12px',
                      lineHeight: 1.5,
                      textAlign: 'left',
                      fontFamily: font,
                      marginBottom: 5,
                    }}
                  >
                    1.
                    {' '}
                    {ReportTranslation[ReportTranslation.findIndex((d) => d.key === 'SDGMatrixParametersPoint1')][language]}
                  </Text>
                  <Text
                    style={{
                      fontSize: '12px',
                      lineHeight: 1.5,
                      textAlign: 'left',
                      fontFamily: font,
                      marginBottom: 0,
                    }}
                  >
                    2.
                    {' '}
                    {ReportTranslation[ReportTranslation.findIndex((d) => d.key === 'SDGMatrixParametersPoint2')][language].replaceAll('{{docName}}', docName.join(', '))}
                  </Text>
                  {
                    gapPrioritiesMatrixCanvas
                      ? (
                        <Image
                          src={gapPrioritiesMatrixCanvas}
                        />
                      ) : null
                  }
                  <Text
                    style={{
                      fontSize: '8px',
                      lineHeight: 1.5,
                      textAlign: 'left',
                      fontStyle: 'italic',
                      fontFamily: font,
                      color: '#AAA',
                      marginTop: 10,
                    }}
                  >
                    {ReportTranslation[ReportTranslation.findIndex((d) => d.key === 'disclaimer')][language]}
                  </Text>
                </View>
              </Page>
              <Page style={{ padding: 50 }}>
                <View style={styles.section}>
                  <Text style={styles.boldText}>
                    {ReportTranslation[ReportTranslation.findIndex((d) => d.key === 'currentTrends')][language]}
                  </Text>
                  <Text
                    style={{
                      fontSize: '12px',
                      lineHeight: 1.5,
                      textAlign: 'left',
                      fontFamily: font,
                      marginBottom: 20,
                    }}
                  >
                    {ReportTranslation[ReportTranslation.findIndex((d) => d.key === 'currentTrendsIntro')][language]}
                  </Text>
                  <View style={styles.highlightSection}>
                    <Text
                      style={{
                        fontSize: '14px',
                        textAlign: 'left',
                        fontWeight: 'bold',
                        lineHeight: 1.5,
                        fontFamily: `${font}-Bold`,
                      }}
                    >
                      {ReportTranslation[ReportTranslation.findIndex((d) => d.key === 'for')][language]}
                      {' '}
                      <Text
                        style={{
                          fontSize: '14px',
                          textAlign: 'left',
                          fontWeight: 'bold',
                          lineHeight: 1.5,
                          fontFamily: `${font}-Bold`,
                        }}
                      >
                        {countryName}
                      </Text>
                      {ReportTranslation[ReportTranslation.findIndex((d) => d.key === 'outOf')][language]}
                      {' '}
                      <Text
                        style={{
                          fontSize: '14px',
                          textAlign: 'left',
                          fontWeight: 'bold',
                          lineHeight: 1.5,
                          fontFamily: `${font}-Bold`,
                          color: '#59BA47',
                        }}
                      >
                        {dataWithStatus.filter((d: any) => d.status === 'On Track').length}
                        {' '}
                        {ReportTranslation[ReportTranslation.findIndex((d) => (dataWithStatus.filter((el: any) => el.status === 'On Track').length === 1 ? d.key === 'is' : d.key === 'are'))][language]}
                        {' '}
                        On Track,
                      </Text>
                      <Text
                        style={{
                          fontSize: '14px',
                          textAlign: 'left',
                          fontWeight: 'bold',
                          lineHeight: 1.5,
                          fontFamily: `${font}-Bold`,
                          color: '#FBC412',
                        }}
                      >
                        {' '}
                        {dataWithStatus.filter((d: any) => d.status === 'For Review').length}
                        {' '}

                        {ReportTranslation[ReportTranslation.findIndex((d) => (dataWithStatus.filter((el: any) => el.status === 'For Review').length === 1 ? d.key === 'is' : d.key === 'are'))][language]}
                        {' '}
                        For Review
                      </Text>
                      {' '}
                      and
                      {' '}
                      <Text
                        style={{
                          fontSize: '14px',
                          textAlign: 'left',
                          fontWeight: 'bold',
                          lineHeight: 1.5,
                          fontFamily: `${font}-Bold`,
                          color: '#D12800',
                        }}
                      >
                        {dataWithStatus.filter((d: any) => d.status === 'Identified Gap').length}
                        {' '}

                        {ReportTranslation[ReportTranslation.findIndex((d) => (dataWithStatus.filter((el: any) => el.status === 'Identified Gap').length === 1 ? d.key === 'is' : d.key === 'are'))][language]}
                        {' '}
                        Identified Gaps
                      </Text>
                    </Text>
                  </View>
                  {
                    currentGapsCanvas
                      ? (
                        <Image
                          src={currentGapsCanvas}
                        />
                      ) : null
                  }
                </View>
              </Page>
              <Page style={{ padding: 50 }}>
                <View style={styles.section}>
                  <Text style={styles.boldText}>
                    {ReportTranslation[ReportTranslation.findIndex((d) => d.key === 'sdgInterlinkages')][language]}
                  </Text>
                  <Text
                    style={{
                      fontSize: '12px',
                      lineHeight: 1.5,
                      textAlign: 'left',
                      fontFamily: font,
                      marginBottom: 20,
                    }}
                  >
                    {ReportTranslation[ReportTranslation.findIndex((d) => d.key === 'interlinkagesPara1')][language]}
                  </Text>
                  <Text
                    style={{
                      fontSize: '12px',
                      lineHeight: 1.5,
                      textAlign: 'left',
                      fontFamily: font,
                      marginBottom: 20,
                    }}
                  >
                    {ReportTranslation[ReportTranslation.findIndex((d) => d.key === 'interlinkagesPara2')][language]}
                  </Text>
                  <View style={styles.highlightSection}>
                    <Text
                      style={{
                        fontSize: '12px',
                        textAlign: 'left',
                        fontFamily: font,
                        marginBottom: 10,
                        lineHeight: 1.5,
                      }}
                    >
                      {ReportTranslation[ReportTranslation.findIndex((d) => d.key === 'interlinkagesBoxPara1')][language].replaceAll('{{countryName}}', countryName).replaceAll('{{sdgNo}}', sdgForInterlinkage.sdg).replaceAll('{{status}}', sdgForInterlinkage.status)}
                    </Text>
                    <Text
                      style={{
                        fontSize: '12px',
                        lineHeight: 1.5,
                        textAlign: 'left',
                        fontFamily: font,
                      }}
                    >
                      {ReportTranslation[ReportTranslation.findIndex((d) => d.key === 'interlinkagesBoxPara2')][language].replaceAll('{{sdgNo}}', sdgForInterlinkage.sdg).replaceAll('{{targetNo}}', selectedTarget)}
                    </Text>
                  </View>
                  {
                    interlinkageCanvas
                      ? (
                        <Image
                          src={interlinkageCanvas}
                        />
                      ) : null
                  }
                </View>
              </Page>
              <Page style={{ padding: 50 }}>
                <View style={styles.section}>
                  <Text style={styles.boldText}>
                    {ReportTranslation[ReportTranslation.findIndex((d) => d.key === 'futureScenarios')][language]}
                  </Text>
                  <Text
                    style={{
                      fontSize: '12px',
                      lineHeight: 1.5,
                      textAlign: 'left',
                      fontFamily: font,
                      marginBottom: 20,
                    }}
                  >
                    {ReportTranslation[ReportTranslation.findIndex((d) => d.key === 'futureScenariosPara1')][language]}
                  </Text>
                  <Text
                    style={{
                      fontSize: '12px',
                      lineHeight: 1.5,
                      textAlign: 'left',
                      fontFamily: font,
                      marginBottom: 20,
                    }}
                  >
                    {ReportTranslation[ReportTranslation.findIndex((d) => d.key === 'futureScenariosPara2')][language]}

                  </Text>
                  <Text
                    style={{
                      fontSize: '12px',
                      lineHeight: 1.5,
                      textAlign: 'left',
                      fontFamily: font,
                      marginBottom: 20,
                    }}
                  >
                    {ReportTranslation[ReportTranslation.findIndex((d) => d.key === 'futureScenariosPara3')][language]}
                  </Text>
                  <Text
                    style={{
                      fontSize: '12px',
                      lineHeight: 1.5,
                      textAlign: 'left',
                      fontFamily: font,
                      marginBottom: 20,
                    }}
                  >
                    {ReportTranslation[ReportTranslation.findIndex((d) => d.key === 'futureScenariosPara4Part1')][language]}
                    <Link style={{ textDecoration: 'underline', color: '#006EB5', fontStyle: 'italics' }} src='https://data.undp.org/wp-content/uploads/2021/04/Leaving-No-One-Behind-COVID-impact-on-the-SDGs-second-flagship-2.pdf'>
                      {ReportTranslation[ReportTranslation.findIndex((d) => d.key === 'futureScenariosPara4Part2')][language]}
                    </Link>
                    {ReportTranslation[ReportTranslation.findIndex((d) => d.key === 'futureScenariosPara4Part3')][language]}
                  </Text>
                  {
                    futureScenarioCanvas
                      ? (
                        <Image
                          src={futureScenarioCanvas}
                        />
                      ) : null
                  }
                </View>
              </Page>
            </Document>
          ) : null
      }
    </>
  );
};
