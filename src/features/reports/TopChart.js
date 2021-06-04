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
        background: '#DEE0E1',
        height: '250',
        padding: 0,
        fontFamily: "'Fira Sans', sans-serif",
      }}
      viewBox="-45 0 2000 480"
    >
      <VictoryLabel
        x={25}
        y={45}
        style={{
          textAnchor: 'start',
          verticalAnchor: 'end',
          fill: '#000000',
          fontFamily: 'inherit',
          fontSize: '50px',
          fontWeight: 'bold',
        }}
        text="Owed, PTP and Collections"
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
        y={65}
        style={{
          fill: 'grey',
          fontFamily: 'inherit',
          fontSize: 25,
          fontStyle: 'italic',
        }}
        text="Previous two years"
      />

      <g transform={'translate(0, 40)'}>
        <VictoryChart
          animate={{
            duration: 2000,
            easing: 'backOut',
            onLoad: { duration: 1000 },
          }}
          containerComponent={<VictoryContainer responsive={false} />}
          height={455}
          standalone={false}
          width={1990}
        >
          <VictoryAxis
            dependentAxis
            standalone={false}
            style={{
              ticks: { stroke: 'grey', size: 5 },
              tickLabels: { fontSize: 25, padding: 5 },
            }}
            tickFormat={(t) => `R ${Math.round(t) / 1000} k`}
          />
          <VictoryAxis
            standalone={false}
            style={{
              ticks: { stroke: 'grey', size: 5 },
              tickLabels: { fontSize: 25, padding: 5 },
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

          <VictoryLegend
            x={1400}
            y={280}
            background="white"
            centerTitle
            orientation="horizontal"
            gutter={30}
            standalone={false}
            style={{ border: { fill: 'grey', stroke: 'white' } }}
            data={[
              {
                name: 'Owed',
                symbol: { fill: '#1F5DBB', fillOpacity: 0.7 },
                labels: { fill: 'white', fontSize: 25 },
              },
              {
                name: 'PTP',
                symbol: { fill: '#254D8A', fillOpacity: 0.5 },
                labels: { fill: 'white', fontSize: 25 },
              },
              {
                name: 'Collected',
                symbol: { fill: '#254D8A', fillOpacity: 0.3 },
                labels: { fill: 'white', fontSize: 25 },
              },
            ]}
          />
        </VictoryChart>
      </g>
    </svg>
  );
};
