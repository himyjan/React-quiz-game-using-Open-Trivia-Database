import React from 'react';
import { AxisOptions, Chart } from 'react-charts';
import ResizableBox from './ResizableBox';
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
        min: 0,
      },
    ],
    []
  );

  return (
    <>
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
