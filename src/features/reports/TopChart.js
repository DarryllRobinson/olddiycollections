import React from 'react';
import {
  VictoryArea,
  VictoryAxis,
  VictoryChart,
  VictoryContainer,
  VictoryLabel,
  VictoryLegend,
  VictoryStack,
  VictoryVoronoiContainer,
} from 'victory';

export const TopChart = () => {
  const owed = [
    { x: 1, y: 100000 },
    { x: 2, y: 112244 },
    { x: 3, y: 232211 },
    { x: 4, y: 175000 },
    { x: 5, y: 213133 },
  ];

  const ptp = [
    { x: 1, y: 100000 * 0.75 },
    { x: 2, y: 112244 * 0.75 },
    { x: 3, y: 232211 * 0.75 },
    { x: 4, y: 175000 * 0.75 },
    { x: 5, y: 213133 * 0.75 },
  ];

  const collected = [
    { x: 1, y: 100000 * 0.63 },
    { x: 2, y: 112244 * 0.63 },
    { x: 3, y: 232211 * 0.63 },
    { x: 4, y: 175000 * 0.63 },
    { x: 5, y: 213133 * 0.63 },
  ];

  const styles = {
    parent: {
      boxSizing: 'border-box',
      display: 'inline',
      height: '200',
      padding: 0,
      fontFamily: "'Fira Sans', sans-serif",
    },
  };

  return (
    <svg
      style={{
        boxSizing: 'border-box',
        display: 'inline',
        height: '250',
        padding: 0,
        fontFamily: "'Fira Sans', sans-serif",
      }}
      viewBox="0 0 1950 450"
    >
      <VictoryLabel
        x={25}
        y={24}
        style={{
          textAnchor: 'start',
          verticalAnchor: 'end',
          fill: '#000000',
          fontFamily: 'inherit',
          fontSize: '20px',
          fontWeight: 'bold',
        }}
        text="Top Chart"
      />
      <VictoryLabel
        x={430}
        y={20}
        style={{
          textAnchor: 'middle',
          fill: '#ffffff',
          fontFamily: 'inherit',
          fontSize: '14px',
        }}
        text="1"
      />
      <VictoryLabel
        x={25}
        y={55}
        style={{ fontFamily: 'inherit', fontSize: 18, fontStyle: 'italic' }}
        text="Top chart for dashboard"
      />

      <VictoryLegend
        x={55}
        y={90}
        centerTitle
        orientation="vertical"
        gutter={20}
        standalone={false}
        style={{ border: { stroke: 'black' } }}
        data={[
          {
            name: 'Owed',
            symbol: { fill: '#1F5DBB', fillOpacity: 0.8 },
            labels: { fontSize: 12 },
          },
          {
            name: 'PTP',
            symbol: { fill: '#254D8A', fillOpacity: 0.8 },
            labels: { fontSize: 12 },
          },
          {
            name: 'Collected',
            symbol: { fill: '#254D8A', fillOpacity: 1 },
            labels: { fontSize: 12 },
          },
        ]}
      />

      <g transform={'translate(0, 40)'}>
        <VictoryChart
          animate={{
            duration: 2000,
            easing: 'backOut',
            onLoad: { duration: 1000 },
          }}
          containerComponent={<VictoryContainer responsive={false} />}
          height={435}
          standalone={false}
          width={1950}
        >
          <VictoryAxis
            dependentAxis
            standalone={false}
            style={{
              ticks: { stroke: 'grey', size: 5 },
              tickLabels: { fontSize: 13, padding: 5 },
            }}
            tickFormat={(t) => `R ${Math.round(t) / 1000} k`}
          />
          <VictoryAxis
            standalone={false}
            style={{
              ticks: { stroke: 'grey', size: 5 },
              tickLabels: { fontSize: 13, padding: 5 },
            }}
          />
          <VictoryArea
            animate={{ duration: 2000, onLoad: { duration: 1000 } }}
            data={[
              { x: 1, y: 100000 },
              { x: 2, y: 112244 },
              { x: 3, y: 232211 },
              { x: 4, y: 175000 },
              { x: 5, y: 213133 },
            ]}
            style={{ data: { fill: '#1F5DBB', fillOpacity: 0.7 } }}
          />
          <VictoryArea
            animate={{ duration: 2000, onLoad: { duration: 1000 } }}
            data={[
              { x: 1, y: 100000 * 0.75 },
              { x: 2, y: 112244 * 0.75 },
              { x: 3, y: 232211 * 0.75 },
              { x: 4, y: 175000 * 0.75 },
              { x: 5, y: 213133 * 0.75 },
            ]}
            style={{ data: { fill: '#254D8A', fillOpacity: 1 } }}
          />
          <VictoryArea
            animate={{ duration: 2000, onLoad: { duration: 1000 } }}
            data={[
              { x: 1, y: 100000 * 0.63 },
              { x: 2, y: 112244 * 0.63 },
              { x: 3, y: 232211 * 0.63 },
              { x: 4, y: 175000 * 0.63 },
              { x: 5, y: 213133 * 0.63 },
            ]}
            style={{ data: { fill: '#142744', fillOpacity: 1 } }}
          />
        </VictoryChart>
      </g>
    </svg>
  );
};
