import CarbonIntensityFromFossilFuel from '../../Data/CarbonIntensityFromFossilFuel.json';
import CarbonIntensityFromFossilFuelAndLandUse from '../../Data/CarbonIntensityFromFossilFuelAndLandUse.json';
import { SlopeGraphCarbonIntensity } from '../../GraphForReport/SlopeGraphCarbonIntensity';

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
      {CarbonIntensityFromFossilFuel.findIndex(
        (d) => d.iso3 === countryCode,
      ) === -1
        && CarbonIntensityFromFossilFuelAndLandUse.findIndex(
          (d) => d.iso3 === countryCode,
        ) === -1 ? (
          <p className='undp-typography bold'>Data Not Available</p>
        ) : (
          <SlopeGraphCarbonIntensity
            data={[
              CarbonIntensityFromFossilFuel.findIndex(
                (d) => d.iso3 === countryCode,
              ) === -1
                ? undefined
                : CarbonIntensityFromFossilFuel[
                  CarbonIntensityFromFossilFuel.findIndex(
                    (d) => d.iso3 === countryCode,
                  )
                ],
              CarbonIntensityFromFossilFuelAndLandUse.findIndex(
                (d) => d.iso3 === countryCode,
              ) === -1
                ? undefined
                : CarbonIntensityFromFossilFuelAndLandUse[
                  CarbonIntensityFromFossilFuelAndLandUse.findIndex(
                    (d) => d.iso3 === countryCode,
                  )
                ],
            ]}
            svgWidth={width}
            svgHeight={height - 175}
          />
        )}
    </>
  );
};
