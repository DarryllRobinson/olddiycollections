import React from 'react';
import { Container, Grid } from 'semantic-ui-react';

import CustomBar from './CustomBar';
import MysqlLayer from '../../services/MysqlLayer';

class Reports extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reports: {
        ids: ['aging', 'agentPTP', 'datePTP', 'penetrationRate'],
        entities: {
          aging: {
            data: null,
            description: 'Amount owed per period',
            title: 'Aging',
          },
          agentPTP: {
            data: null,
            description: 'PTP sum per agent',
            title: 'PTP by Agent',
          },
          datePTP: {
            data: null,
            description: 'PTP sum per date',
            title: 'PTP by Date',
          },
          penetrationRate: {
            data: null,
            description: 'Contacts made per account per month',
            title: 'Penetration rate',
          },
        },
      },
    };

    this.mysqlLayer = new MysqlLayer();
  }

  componentDidMount() {
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

  customBarRender() {
    const reports = this.state.reports;
    const { styleType } = this.props;

    const reportsDisplay = reports.ids.map((report, idx) => {
      return (
        <div key={idx}>
          <Grid.Column width={4} style={{ padding: 0 }}>
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
                <Grid.Column width={4} style={{ padding: 0 }}>
                  <div className="ui active inverted dimmer">
                    <div className="ui text loader">Loading</div>
                  </div>
                  <p></p>
                </Grid.Column>
              </div>
            )}
          </Grid.Column>
        </div>
      );
    });

    return reportsDisplay;
  }

  refreshButtonRender() {
    return (
      <div className="ui  message">
        Auto-refresh every 30 minutes or{' '}
        <button
          className="ui button primary"
          onClick={() => {
            this.loadData();
          }}
        >
          Reload
        </button>
      </div>
    );
  }

  render() {
    return (
      <Container fluid>
        <Grid stackable textAlign="center">
          <Grid.Row>{this.customBarRender()}</Grid.Row>
        </Grid>
      </Container>
    );
  }
}

export default Reports;
