import React from 'react';
import { AxisOptions, Chart } from 'react-charts';
import ResizableBox from './ResizableBox';
import ComboBox from './comboBox';
import { chartDataType } from 'src/types/chartDataType';

type RightWrongStatisticsChartProps = {
  data: chartDataType[];
};

const RightWrongStatisticsChart = (props: RightWrongStatisticsChartProps) => {
  const data = props.data;
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
        elementType: 'bar',
      },
    ],
    []
  );

  return (
    <>
      <ResizableBox width={300}>
        <ComboBox />
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
