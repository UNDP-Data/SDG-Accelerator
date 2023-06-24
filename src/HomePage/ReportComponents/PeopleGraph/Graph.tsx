/* eslint-disable camelcase */
import Poverty2_15 from '../../Data/Poverty2_15.json';
import Poverty3_65 from '../../Data/Poverty3_65.json';
import Poverty6_85 from '../../Data/Poverty6_85.json';
import Poverty14 from '../../Data/Poverty14.json';
import { SlopeGraphPovertySeparated } from '../../GraphForReport/SlopeGraphPovertySeparated';

interface Props {
  countryCode: string;
  width: number;
}
export const Graph = (props: Props) => {
  const {
    countryCode, width,
  } = props;
  return (
    <>
      {Poverty2_15.findIndex((d) => d.iso3 === countryCode) !== -1
      && Poverty3_65.findIndex((d) => d.iso3 === countryCode) !== -1
      && Poverty6_85.findIndex((d) => d.iso3 === countryCode) !== -1
      && Poverty14.findIndex((d) => d.iso3 === countryCode) !== -1 ? (
        <SlopeGraphPovertySeparated
          data={[
            Poverty2_15[
              Poverty2_15.findIndex((d) => d.iso3 === countryCode)
            ],
            Poverty3_65[
              Poverty3_65.findIndex((d) => d.iso3 === countryCode)
            ],
            Poverty6_85[
              Poverty6_85.findIndex((d) => d.iso3 === countryCode)
            ],
            Poverty14[
              Poverty14.findIndex((d) => d.iso3 === countryCode)
            ],
          ]}
          svgWidth={width}
          svgHeight={300}
        />
        ) : (
          <p className='undp-typography bold'>Data Not Available</p>
        )}
    </>
  );
};
