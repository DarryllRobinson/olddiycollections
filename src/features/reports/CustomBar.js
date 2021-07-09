import React from 'react';
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryContainer,
  VictoryLabel,
  VictoryTooltip,
} from 'victory';

class CustomBar extends React.Component {
  getStylesDashboard() {
    const BLUE_COLOR = '#003d6a';
    const PURPLE_COLOR = '#2062ae';

    return {
      parent: {
        background: '#ffffff',
        border: '1px solid #000000',
        boxSizing: 'border-box',
        display: 'inline',
        height: '275',
        margin: '15px 3px',
        fontFamily: "'Fira Sans', sans-serif",
      },
      title: {
        textAnchor: 'start',
        verticalAnchor: 'end',
        fill: '#333740',
        fontFamily: 'inherit',
        fontSize: '18px',
        fontWeight: 'bold',
      },
      labelNumber: {
        textAnchor: 'middle',
        fill: '#ffffff',
        fontFamily: 'inherit',
        fontSize: '14px',
      },

      // INDEPENDENT AXIS
      axisX: {
        axis: { stroke: 'black', strokeWidth: 1 },
        domainPadding: { x: 20, y: 5 },
        tickLabels: {
          fill: '#333740',
          fontFamily: 'inherit',
          fontSize: 10,
        },
      },

      // DATA SET
      axisOne: {
        grid: {
          stroke: ({ tick }) => (tick === -10 ? 'transparent' : '#a8abac'),
          strokeWidth: 2,
        },
        axis: { stroke: BLUE_COLOR, strokeWidth: 0 },
        ticks: { strokeWidth: 0 },
        tickLabels: {
          fill: BLUE_COLOR,
          fontFamily: 'inherit',
          fontSize: 10,
          padding: 3,
        },
      },
      labelOne: {
        fill: BLUE_COLOR,
        fontFamily: 'inherit',
        fontSize: 12,
        fontStyle: 'italic',
      },
      barOne: {
        data: { fill: PURPLE_COLOR },
      },

      // Tooltip
      axisOneCustomLabel: {
        fill: BLUE_COLOR,
        fontFamily: 'inherit',
        fontWeight: 300,
        fontSize: 21,
      },
    };
  }

  getStylesMain() {
    const BLUE_COLOR = '#003d6a';
    const PURPLE_COLOR = '#2062ae';

    return {
      parent: {
        background: '#ffffff',
        border: '1px solid #000000',
        boxSizing: 'border-box',
        display: 'inline',
        height: '80vh',
        margin: '15px 3px',
        fontFamily: "'Fira Sans', sans-serif",
      },
      title: {
        textAnchor: 'start',
        verticalAnchor: 'end',
        fill: '#333740',
        fontFamily: 'inherit',
        fontSize: '18px',
        fontWeight: 'bold',
      },
      labelNumber: {
        textAnchor: 'middle',
        fill: '#ffffff',
        fontFamily: 'inherit',
        fontSize: '14px',
      },

      // INDEPENDENT AXIS
      axisX: {
        axis: { stroke: 'black', strokeWidth: 1 },
        domainPadding: { x: 20, y: 5 },
        tickLabels: {
          fill: '#333740',
          fontFamily: 'inherit',
          fontSize: 10,
        },
      },

      // DATA SET
      axisOne: {
        grid: {
          stroke: ({ tick }) => (tick === -10 ? 'transparent' : '#a8abac'),
          strokeWidth: 2,
        },
        axis: { stroke: BLUE_COLOR, strokeWidth: 0 },
        ticks: { strokeWidth: 0 },
        tickLabels: {
          fill: BLUE_COLOR,
          fontFamily: 'inherit',
          fontSize: 10,
          padding: 3,
        },
      },
      labelOne: {
        fill: BLUE_COLOR,
        fontFamily: 'inherit',
        fontSize: 12,
        fontStyle: 'italic',
      },
      barOne: {
        data: { fill: PURPLE_COLOR },
      },

      // Tooltip
      axisOneCustomLabel: {
        fill: BLUE_COLOR,
        fontFamily: 'inherit',
        fontWeight: 300,
        fontSize: 21,
      },
    };
  }

  getStylesSidebar() {
    const BLUE_COLOR = '#003d6a';
    const PURPLE_COLOR = '#2062ae';

    return {
      parent: {
        background: '#ffffff',
        border: '1px solid #000000',
        boxSizing: 'border-box',
        display: 'inline',
        height: '200',
        margin: '15px 3px',
        fontFamily: "'Fira Sans', sans-serif",
      },
      title: {
        textAnchor: 'start',
        verticalAnchor: 'end',
        fill: '#333740',
        fontFamily: 'inherit',
        fontSize: '18px',
        fontWeight: 'bold',
      },
      labelNumber: {
        textAnchor: 'middle',
        fill: '#ffffff',
        fontFamily: 'inherit',
        fontSize: '14px',
      },

      // INDEPENDENT AXIS
      axisX: {
        axis: { stroke: 'black', strokeWidth: 1 },
        domainPadding: { x: 20, y: 5 },
        tickLabels: {
          fill: '#333740',
          fontFamily: 'inherit',
          fontSize: 10,
        },
      },

      // DATA SET
      axisOne: {
        grid: {
          stroke: ({ tick }) => (tick === -10 ? 'transparent' : '#a8abac'),
          strokeWidth: 2,
        },
        axis: { stroke: BLUE_COLOR, strokeWidth: 0 },
        ticks: { strokeWidth: 0 },
        tickLabels: {
          fill: BLUE_COLOR,
          fontFamily: 'inherit',
          fontSize: 10,
          padding: 3,
        },
      },
      labelOne: {
        fill: BLUE_COLOR,
        fontFamily: 'inherit',
        fontSize: 12,
        fontStyle: 'italic',
      },
      barOne: {
        data: { fill: PURPLE_COLOR },
      },

      // Tooltip
      axisOneCustomLabel: {
        fill: BLUE_COLOR,
        fontFamily: 'inherit',
        fontWeight: 300,
        fontSize: 21,
      },
    };
  }

  getDataSetOne() {
    return this.props.data;
  }

  whichStyle() {
    const { styleType } = this.props;

    switch (styleType) {
      case 'dash':
        return this.getStylesDashboard();
      case 'main':
        return this.getStylesMain();
      case 'sidebar':
        return this.getStylesSidebar();
      default:
        return this.getStylesMain();
    }
  }

  render() {
    const { chartNumber, description, title } = this.props;
    const styles = this.whichStyle();
    const dataSetOne = this.getDataSetOne();

    return (
      <svg style={styles.parent} viewBox="0 0 450 350">
        {/* Create stylistic elements */}
        <rect x="0" y="0" width="10" height="30" fill="#ee303d" />
        <rect x="420" y="10" width="20" height="20" fill="#517790" />

        {/* Define labels */}
        <VictoryLabel x={25} y={24} style={styles.title} text={title} />
        <VictoryLabel
          x={430}
          y={20}
          style={styles.labelNumber}
          text={chartNumber + 1}
        />
        <VictoryLabel
          x={25}
          y={55}
          style={styles.labelOne}
          text={description}
        />

        <g transform={'translate(0, 40)'}>
          <VictoryChart
            animate={{
              duration: 2000,
              easing: 'backOut',
              onLoad: { duration: 1000 },
            }}
            containerComponent={<VictoryContainer responsive={false} />}
            domainPadding={{ x: 20, y: 5 }}
            standalone={false}
          >
            {/* Independent axis */}
            <VictoryAxis standalone={false} style={styles.axisX} />

            {/* Dependent axis */}
            <VictoryAxis
              dependentAxis
              standalone={false}
              style={styles.axisOne}
              tickFormat={(t) => `R ${Math.round(t) / 1000} k`}
            />

            {/* Adding the dataset */}
            <VictoryBar
              labelComponent={
                <VictoryTooltip
                  dy={0}
                  centerOffset={{ x: 25 }}
                  renderInPortal={false} // Have to make false for custom chart
                  style={styles.axisOneCustomLabel}
                />
              }
              labels={({ datum }) => [`R ${Math.round(datum.value / 1000)} k`]}
              data={dataSetOne}
              standalone={false}
              style={styles.barOne}
              x="name"
              y="value"
            />
          </VictoryChart>
        </g>
      </svg>
    );
  }
}

export default CustomBar;
