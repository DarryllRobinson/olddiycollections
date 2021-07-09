import React from 'react';
import { Container } from 'semantic-ui-react';

import CustomBar from './CustomBar';
import CustomLine from './CustomLine';
import MysqlLayer from '../../services/MysqlLayer';

class Reports extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reports: {
        ids: ['aging', 'agentPTP', 'datePTP'],
        entities: {
          aging: {
            data: null,
            description: 'Amount owed per period',
            title: 'Aging',
            type: 'bar',
          },
          agentPTP: {
            data: null,
            description: 'PTP sum per agent',
            title: 'PTP by Agent',
            type: 'bar',
          },
          datePTP: {
            data: null,
            description: 'PTP sum per date',
            title: 'PTP by Date',
            type: 'bar',
          },
        },
      },
    };

    this.mysqlLayer = new MysqlLayer();
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.loadData();
    this.interval = setInterval(() => this.loadData(), 30 * 60 * 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  loadData() {
    const reportList = this.state.reports.ids;

    reportList.forEach(async (report) => {
      const reportObject = this.state.reports.entities[report];
      reportObject.data = null;
      this.setState({ ...this.state, reportObject });

      const reportData = await this.mysqlLayer.Get(`/reports/${report}`);

      reportObject.data = this.prepData(reportData);
      //console.log('reportObject: ', reportObject);
      this.setState({ ...this.state, reportObject });
    });
  }

  prepData(data) {
    let tempArray = [];

    if (data.length === 1) {
      for (const [key, value] of Object.entries(data[0])) {
        let tempObj = {};
        tempObj.name = key;
        tempObj.value = value;
        tempArray.push(tempObj);
      }
    } else {
      for (let i = 0; i < data.length; i++) {
        const obj = Object.entries(data[i]);
        let tempObj = {};
        for (const [key, value] of Object.entries(obj)) {
          if (key === '0') {
            tempObj.name = value[1];
          }
          if (key === '1') {
            tempObj.value = value[1];
          }
        }
        tempArray.push(tempObj);
      }
    }

    return tempArray;
  }

  customChartRender() {
    const reports = this.state.reports;
    const { styleType } = this.props;

    const reportsDisplay = reports.ids.map((report, idx) => {
      if (reports.entities[report].type === 'bar') {
        return (
          <span key={idx}>
            {reports.entities[report].data && (
              <CustomBar
                chartNumber={idx}
                data={reports.entities[report].data}
                description={reports.entities[report].description}
                styleType={styleType}
                title={reports.entities[report].title}
              />
            )}
            {!reports.entities[report].data && (
              <div key={idx}>
                <div className="ui active inverted dimmer">
                  <div className="ui text loader">Loading</div>
                </div>
                <p></p>
              </div>
            )}
          </span>
        );
      } else if (reports.entities[report].type === 'line') {
        return (
          <span key={idx}>
            {reports.entities[report].data && (
              <CustomLine
                chartNumber={idx}
                data={reports.entities[report].data}
                description={reports.entities[report].description}
                styleType={styleType}
                title={reports.entities[report].title}
              />
            )}
            {!reports.entities[report].data && (
              <div key={idx}>
                <div className="ui active inverted dimmer">
                  <div className="ui text loader">Loading</div>
                </div>
                <p></p>
              </div>
            )}
          </span>
        );
      } else {
        return <div key={idx}> No report type found</div>;
      }
    });

    return reportsDisplay;
  }

  render() {
    return <Container fluid>{this.customChartRender()}</Container>;
  }
}

export default Reports;
