import React from 'react';
import { AxisOptions, Chart } from 'react-charts';
import useDemoConfig from './useDemoConfig';
import ResizableBox from './ResizableBox';
import ComboBox from './comboBox';

const RightWrongStatisticsChart = () => {
  const { data, randomizeData } = useDemoConfig({
    series: 2,
    dataType: 'ordinal',
    datums: 1,
  });

  const primaryAxis = React.useMemo<
    AxisOptions<typeof data[number]['data'][number]>
  >(
    () => ({
      getValue: (datum) => datum.primary,
    }),
    []
  );

  const secondaryAxes = React.useMemo<
    AxisOptions<typeof data[number]['data'][number]>[]
  >(
    () => [
      {
        getValue: (datum) => datum.secondary,
      },
    ],
    []
  );

  return (
    <>
      <ComboBox />
      <ResizableBox width={300}>
        <Chart
          options={{
            data,
            primaryAxis,
            secondaryAxes,
          }}
        />
      </ResizableBox>
    </>
  );
};

export default RightWrongStatisticsChart;
