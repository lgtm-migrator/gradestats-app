import React, { FC, memo } from 'react';
import { VictoryAxis, VictoryChart, VictoryLine, VictoryLabel } from 'victory';

import { calculateFailureRate } from 'common/utils/grades';
import { Grade } from 'models/Grade';

interface Props {
  grades: Grade[];
}

export const FailedChartComponent: FC<Props> = ({ grades }) => {
  const gradesData = grades.map((grade) => ({
    x: grade.semester_code,
    y: calculateFailureRate(grade),
  }));
  const ticks = gradesData.map((datum) => datum.x);
  return (
    <VictoryChart
      height={220}
      width={350}
      domainPadding={5}
      padding={{
        bottom: 32,
      }}
      style={{
        parent: {
          border: '1px solid #666666',
          background: '#ffffff',
        },
      }}
    >
      <VictoryAxis
        label="Semester"
        style={{
          axisLabel: { padding: 30 },
        }}
        tickFormat={ticks}
      />
      <VictoryLine
        data={gradesData}
        domain={{
          y: [Math.min(...gradesData.map((datum) => datum.y)) - 5, Math.max(...gradesData.map((datum) => datum.y)) + 5],
        }}
        labels={({ datum }) => `${datum.y.toFixed(0)} %`}
        labelComponent={<VictoryLabel renderInPortal dy={-10} />}
      />
    </VictoryChart>
  );
};

export const FailedChart = memo(FailedChartComponent, (prevProps, nextProps) => {
  const prevGrades = prevProps.grades.map((grade) => grade.id);
  const nextGrades = nextProps.grades.map((grade) => grade.id);
  return String(prevGrades) === String(nextGrades);
});

export default FailedChart;