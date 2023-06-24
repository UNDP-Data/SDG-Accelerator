import CarbonIntensityFromFossilFuel from '../../Data/CarbonIntensityFromFossilFuel.json';
import CarbonIntensityFromFossilFuelAndLandUse from '../../Data/CarbonIntensityFromFossilFuelAndLandUse.json';
import { SlopeGraphCarbonIntensity } from '../../GraphForReport/SlopeGraphCarbonIntensity';

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
      {CarbonIntensityFromFossilFuel.findIndex(
        (d) => d.iso3 === countryCode,
      ) !== -1
            && CarbonIntensityFromFossilFuelAndLandUse.findIndex(
              (d) => d.iso3 === countryCode,
            ) !== -1 ? (
              <SlopeGraphCarbonIntensity
                data={[
                  CarbonIntensityFromFossilFuel[
                    CarbonIntensityFromFossilFuel.findIndex(
                      (d) => d.iso3 === countryCode,
                    )
                  ],
                  CarbonIntensityFromFossilFuelAndLandUse[
                    CarbonIntensityFromFossilFuelAndLandUse.findIndex(
                      (d) => d.iso3 === countryCode,
                    )
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
