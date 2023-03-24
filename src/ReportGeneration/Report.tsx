/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  Page, Text, View, Document, StyleSheet, Image, Link,
} from '@react-pdf/renderer';
import html2canvas from 'html2canvas';
import { useEffect, useState } from 'react';

interface Props {
  countryName: string;
  gapDiv: HTMLDivElement;
  prioritiesDiv: HTMLDivElement;
  gapPrioritiesMatrixDiv: HTMLDivElement;
  interlinkagesDiv: HTMLDivElement;
  dataWithStatus: any;
  selectedTarget: string;
  sdgForInterlinkage: any;
  docName?: string;
}

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  documentName: {
    fontSize: '36px',
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
    color: '#006EB5',
  },
  title: {
    fontSize: '24px',
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
    color: '#006EB5',
    marginTop: 32,
  },
  year: {
    fontSize: '20px',
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    padding: 10,
    marginBottom: 30,
    width: 300,
  },
  subNote: {
    fontSize: '14px',
    textAlign: 'center',
    fontFamily: 'Helvetica',
    width: 300,
  },
  text: {
    fontSize: '14px',
    textAlign: 'left',
    fontFamily: 'Helvetica',
    marginBottom: 20,
  },
  boldText: {
    fontSize: '14px',
    textAlign: 'left',
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
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
    fontFamily: 'Helvetica-Bold',
    color: '#006EB5',
    marginBottom: 36,
  },
  SVGText: {
    fontSize: '30px',
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
  },
  SVGTextNote: {
    fontSize: '16px',
    fontFamily: 'Helvetica',
  },
  SVGKeyText: {
    fontSize: '14px',
    fontWeight: 'bold',
    fontFamily: 'Helvetica',
  },
  pageH2: {
    fontSize: '18px',
    fontFamily: 'Helvetica-Bold',
    marginBottom: 24,
  },
  image: {
    width: 500,
    height: 500,
  },
});

export const MyDocument = (props: Props) => {
  const {
    countryName,
    gapDiv,
    prioritiesDiv,
    gapPrioritiesMatrixDiv,
    dataWithStatus,
    interlinkagesDiv,
    selectedTarget,
    sdgForInterlinkage,
    docName,
  } = props;
  let highPrioritySDG = '';
  dataWithStatus.filter((d: any) => d.category === 'High').forEach((d: any) => {
    highPrioritySDG += `SDG${d.sdg}, `;
  });
  const [currentGapsCanvas, setCurrentGapCanvas] = useState<string | null>(null);
  const [prioritiesCanvas, setPrioritiesCanvas] = useState<string | null>(null);
  const [gapPrioritiesMatrixCanvas, setGapPrioritiesMatrixCanvas] = useState<string | null>(null);
  const [interlinkageCanvas, setInterlinkageCanvas] = useState<string | null>(null);
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
  return (
    <>
      {
        currentGapsCanvas && prioritiesCanvas && gapPrioritiesMatrixCanvas && interlinkageCanvas
          ? (
            <Document>
              <Page style={styles.page}>
                <View style={styles.coverSection}>
                  <Text style={styles.documentName}>Integrated SDG Insights</Text>
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
                    Powered by
                    {' '}
                    <Link style={{ textDecoration: 'underline', color: '#006EB5', fontStyle: 'italics' }} src='https://data.undp.org/'>Data Futures Platform</Link>
                  </Text>
                </View>
              </Page>
              <Page style={{ padding: 50 }}>
                <View style={styles.section}>
                  <Text
                    style={{
                      fontSize: 20,
                      fontFamily: 'Helvetica-Bold',
                      fontWeight: 'bold',
                      marginBottom: 20,
                    }}
                  >
                    {countryName}
                    {' '}
                    Summary Report
                  </Text>
                  <Text
                    style={{
                      fontSize: 20,
                      fontFamily: 'Helvetica',
                      marginBottom: 20,
                    }}
                  >
                    SDG Push Diagnostic
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontStyle: 'italics',
                      fontFamily: 'Helvetica',
                      marginBottom: 20,
                      lineHeight: 1.5,
                    }}
                  >
                    This report has been generated through the
                    {' '}
                    <Link style={{ textDecoration: 'underline', color: '#006EB5', fontStyle: 'italics' }} src='https://data.undp.org/sdg-push-diagnostic-test/'>SDG Push Diagnostic</Link>
                    {' '}
                    for
                    {' '}
                    {countryName}
                    {' '}
                    on
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
                        fontFamily: 'Helvetica-Bold',
                        marginBottom: 10,
                      }}
                    >
                      Background
                    </Text>
                    <Text
                      style={{
                        fontSize: '12px',
                        textAlign: 'left',
                        fontFamily: 'Helvetica',
                        marginBottom: 10,
                        lineHeight: 1.5,
                      }}
                    >
                      The SDG Push Diagnostic helps countries practically advance transformative pathways. It integrates multiple data sources and digital innovation to establish a rapid landscape analysis – national priorities, current trends, potential futures, and interlinkages.
                    </Text>
                    <Text
                      style={{
                        fontSize: '12px',
                        lineHeight: 1.5,
                        textAlign: 'left',
                        fontFamily: 'Helvetica',
                      }}
                    >
                      The SDG Push Diagnostic is the foundation for a tailored ‘Integrated SDG Insights’ report that helps member states assess areas where they are making investments with biggest multiplier effects, and chart transformative pathways as part of their national commitments at the SDG Summit.
                    </Text>
                  </View>
                  <Text style={styles.boldText}>
                    Current Priorities
                  </Text>
                  <Text
                    style={{
                      fontSize: '12px',
                      lineHeight: 1.5,
                      textAlign: 'left',
                      fontFamily: 'Helvetica',
                      marginBottom: 20,
                    }}
                  >
                    This section analysis national SDG priorities based on key national documents such as national development plans, Voluntary National Reviews (VNRs) and any other relevant policy documents outlining government development priorities. This text analysis provides a summarized review of lengthy policy documents and maps them to the SDGs. The output reveals the most prominent SDGs that are mentioned across key policy documents.
                  </Text>
                  {
                    prioritiesCanvas
                      ? (
                        <Image
                          src={prioritiesCanvas}
                        />
                      ) : null
                  }

                  <View style={styles.highlightSection}>
                    <Text
                      style={{
                        fontSize: '14px',
                        textAlign: 'left',
                        fontWeight: 'bold',
                        lineHeight: 1.5,
                        fontFamily: 'Helvetica-Bold',
                      }}
                    >
                      For
                      {' '}
                      {countryName}
                      , analyzing the major priorities in the current action documents by the country, we find
                      {' '}
                      {highPrioritySDG}
                      are likely high priority.
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: '12px',
                      lineHeight: 1.5,
                      textAlign: 'left',
                      fontFamily: 'Helvetica',
                      marginBottom: 20,
                    }}
                  >
                    The analysis is generated using machine learning text analysis to surface priorities that can be mapped to the SDGs. The model analyses the document by linking its constituent pieces to SDGs and then aggregates the statistics before presenting the results. The underlying assumption of the analysis is that the amount of text linked to each SDG defines how important each SDG is. In this context, the “importance” of an SDG is referred to as “salience”. Thus, the most salient SDG is the one to which most of the text pieces, e.g., paragraphs, could be linked. Refer to the
                    {' '}
                    <Link style={{ textDecoration: 'underline', color: '#006EB5', fontStyle: 'italics' }} src='https://data.undp.org/sdg-push-diagnostic-test/Methodology.pdf'>SDG Push - Diagnostic Methodological Note & User Guide.pdf</Link>
                    {' '}
                    for a detailed methodology.
                  </Text>
                  <Text
                    style={{
                      fontSize: '12px',
                      lineHeight: 1.5,
                      textAlign: 'left',
                      fontFamily: 'Helvetica',
                      marginBottom: 20,
                    }}
                  >
                    The output from the text analysis is overlayed with the SDG ‘status’, to map which SDGs are off-track in reaching the 2030 goals. This comparison is important in pointing out the gaps and opportunities of the current national SDG policy priorities versus how the SDGs are performing on the ground. The comparison can guide potential opportunities for SDG investments in optimizing national priorities and achieving the sustainable development goals.
                  </Text>
                  <Text
                    style={{
                      fontSize: '12px',
                      lineHeight: 1.5,
                      textAlign: 'left',
                      fontFamily: 'Helvetica',
                      marginBottom: 20,
                    }}
                  >
                    The matrix below maps national priorities and current trends. This can provide meaningful insights for national dialogues and identification of transformative pathways.
                  </Text>
                  <Text style={{
                    fontSize: '14px',
                    textAlign: 'left',
                    fontWeight: 'bold',
                    fontFamily: 'Helvetica-Bold',
                    marginBottom: 5,
                  }}
                  >
                    Comparing SDG national priorities based on
                    {' '}
                    {docName}
                    {' '}
                    and SDG gaps
                  </Text>
                  <Text
                    style={{
                      fontSize: '12px',
                      lineHeight: 1.5,
                      textAlign: 'left',
                      fontFamily: 'Helvetica',
                      marginBottom: 5,
                    }}
                  >
                    This matrix maps the SDGs along two parameters
                  </Text>
                  <Text
                    style={{
                      fontSize: '12px',
                      lineHeight: 1.5,
                      textAlign: 'left',
                      fontFamily: 'Helvetica',
                      marginBottom: 5,
                    }}
                  >
                    1. their current trend status and
                  </Text>
                  <Text
                    style={{
                      fontSize: '12px',
                      lineHeight: 1.5,
                      textAlign: 'left',
                      fontFamily: 'Helvetica',
                      marginBottom: 0,
                    }}
                  >
                    2. their priority status as identified in
                    {' '}
                    {docName}
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
                      fontFamily: 'Helvetica',
                      color: '#AAA',
                      marginTop: 10,
                    }}
                  >
                    Disclaimer: The current priorities identified in
                    {' '}
                    {docName}
                    {' '}
                    may not reflect the actual and complete priorities of the government. They are a starting point for further discussion.
                  </Text>
                </View>
              </Page>
              <Page style={{ padding: 50 }}>
                <View style={styles.section}>
                  <Text style={styles.boldText}>
                    Current Trends
                  </Text>
                  <Text
                    style={{
                      fontSize: '12px',
                      lineHeight: 1.5,
                      textAlign: 'left',
                      fontFamily: 'Helvetica',
                      marginBottom: 20,
                    }}
                  >
                    The ’Current Trends’ measures the progress of the SDGs. Progress on the 17 SDGs are tracked through 169 sub-targets, which in turn are measured using 231 unique indicators. This analysis provides a categorization and overview of the SDGs and corresponding targets and indicators which are on-track or off-track at the national level, providing the baseline landscape against which to build the SDG Push.
                  </Text>
                  <View style={styles.highlightSection}>
                    <Text
                      style={{
                        fontSize: '14px',
                        textAlign: 'left',
                        fontWeight: 'bold',
                        lineHeight: 1.5,
                        fontFamily: 'Helvetica-Bold',
                      }}
                    >
                      For
                      {' '}
                      <Text
                        style={{
                          fontSize: '14px',
                          textAlign: 'left',
                          fontWeight: 'bold',
                          lineHeight: 1.5,
                          fontFamily: 'Helvetica-Bold',
                        }}
                      >
                        {countryName}
                      </Text>
                      , out of 17 SDGs,
                      {' '}
                      <Text
                        style={{
                          fontSize: '14px',
                          textAlign: 'left',
                          fontWeight: 'bold',
                          lineHeight: 1.5,
                          fontFamily: 'Helvetica-Bold',
                          color: '#59BA47',
                        }}
                      >
                        {dataWithStatus.filter((d: any) => d.status === 'On Track').length}
                        {' '}
                        are On Track,
                      </Text>
                      <Text
                        style={{
                          fontSize: '14px',
                          textAlign: 'left',
                          fontWeight: 'bold',
                          lineHeight: 1.5,
                          fontFamily: 'Helvetica-Bold',
                          color: '#FBC412',
                        }}
                      >
                        {' '}
                        {dataWithStatus.filter((d: any) => d.status === 'For Review').length}
                        {' '}
                        are For Review
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
                          fontFamily: 'Helvetica-Bold',
                          color: '#D12800',
                        }}
                      >
                        {dataWithStatus.filter((d: any) => d.status === 'Identified Gap').length}
                        {' '}
                        are Identified Gaps
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
                    SDG Interlinkages
                  </Text>
                  <Text
                    style={{
                      fontSize: '12px',
                      lineHeight: 1.5,
                      textAlign: 'left',
                      fontFamily: 'Helvetica',
                      marginBottom: 20,
                    }}
                  >
                    The SDGs do not exist in silos, understanding how the goals are interconnected, both positively and negatively, is essential to understanding the mechanisms for achieving the targets. A better understanding of patterns of synergies and trade-offs can support strategic decision making and promote game-changing interventions for the SDGs.
                    {' '}

                  </Text>
                  <Text
                    style={{
                      fontSize: '12px',
                      lineHeight: 1.5,
                      textAlign: 'left',
                      fontFamily: 'Helvetica',
                      marginBottom: 20,
                    }}
                  >
                    This section considers the interlinkages between SDGs and their targets. It considers the national priorities and their SDG ‘status’ and investigates which SDG targets has the most synergies and hence potential for a positive multiplier effect on other SDG targets.
                  </Text>
                  <View style={styles.highlightSection}>
                    <Text
                      style={{
                        fontSize: '12px',
                        textAlign: 'left',
                        fontFamily: 'Helvetica',
                        marginBottom: 10,
                        lineHeight: 1.5,
                      }}
                    >
                      For
                      {' '}
                      {countryName}
                      , SDG
                      {' '}
                      {sdgForInterlinkage.sdg}
                      {' '}
                      has been identified as having
                      {' '}
                      {sdgForInterlinkage.status}
                      {' '}
                      as well as being high priority as per the national documents uploaded.
                    </Text>
                    <Text
                      style={{
                        fontSize: '12px',
                        lineHeight: 1.5,
                        textAlign: 'left',
                        fontFamily: 'Helvetica',
                      }}
                    >
                      Within SDG
                      {' '}
                      {sdgForInterlinkage.sdg}
                      ,
                      {' '}
                      {selectedTarget}
                      {' '}
                      has the highest potential for a positive multiplier effect as it’s connected with the most targets across the SDGS.
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
            </Document>
          ) : null
      }
    </>
  );
};
