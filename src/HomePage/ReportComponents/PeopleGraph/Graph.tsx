/* eslint-disable camelcase */
import Poverty2_15 from '../../DataForReport/Poverty2_15.json';
import Poverty3_65 from '../../DataForReport/Poverty3_65.json';
import Poverty6_85 from '../../DataForReport/Poverty6_85.json';
import Poverty14 from '../../DataForReport/Poverty14.json';
import { SlopeGraphPovertySeparated } from '../../GraphForReport/SlopeGraphPovertySeparated';

interface Props {
  countryCode: string;
  width: number;
  height: number;
}
export const Graph = (props: Props) => {
  const {
    countryCode, width, height,
  } = props;
  return (
    <>
      {
        Poverty2_15.findIndex((d) => d.iso3 === countryCode) === -1
          && Poverty3_65.findIndex((d) => d.iso3 === countryCode) === -1
          && Poverty6_85.findIndex((d) => d.iso3 === countryCode) === -1
          && Poverty14.findIndex((d) => d.iso3 === countryCode) === -1 ? (
            <p className='undp-typography bold'>Data Not Available</p>
          ) : (
            <SlopeGraphPovertySeparated
              data={[
                Poverty2_15.findIndex((d) => d.iso3 === countryCode) !== -1
                  ? Poverty2_15[
                    Poverty2_15.findIndex((d) => d.iso3 === countryCode)
                  ]
                  : undefined,
                Poverty3_65.findIndex((d) => d.iso3 === countryCode) !== -1
                  ? Poverty3_65[
                    Poverty3_65.findIndex((d) => d.iso3 === countryCode)
                  ]
                  : undefined,
                Poverty6_85.findIndex((d) => d.iso3 === countryCode) !== -1
                  ? Poverty6_85[
                    Poverty6_85.findIndex((d) => d.iso3 === countryCode)
                  ]
                  : undefined,
                Poverty14.findIndex((d) => d.iso3 === countryCode) !== -1
                  ? Poverty14[
                    Poverty14.findIndex((d) => d.iso3 === countryCode)
                  ]
                  : undefined,
              ]}
              svgWidth={width}
              svgHeight={height - 175}
            />
          )
}
    </>
  );
};
