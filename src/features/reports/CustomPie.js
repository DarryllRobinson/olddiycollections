import React from 'react';
import { VictoryAnimation, VictoryLabel, VictoryPie } from 'victory';

export const CustomPie = () => {
  const [data, setData] = React.useState([
    { x: 1, percent: 25 },
    { x: 2, percent: 36 },
    { x: 3, percent: 75 },
  ]);

  return (
    <div>
      <svg viewBox="0 0 400 400" width="20%" height="20%">
        <VictoryPie
          animate={{ duration: 1000 }}
          cornerRadius={25}
          data={data}
          height={400}
          innerRadius={120}
          labels={() => null}
          standalone={false}
          style={{
            data: {
              fill: ({ datum }) => {
                const color = datum.y > 30 ? 'green' : 'red';
                return datum.x === 1 ? color : 'transparent';
              },
            },
          }}
          width={400}
        />
        <VictoryAnimation duration={1000} data={data}>
          {(newProps) => {
            return (
              <VictoryLabel
                textAnchor="middle"
                verticalAnchor="middle"
                x={200}
                y={200}
                text={`${Math.round(newProps.percent)}%`}
                style={{ fontSize: 45 }}
              />
            );
          }}
        </VictoryAnimation>
      </svg>
    </div>
  );
};
