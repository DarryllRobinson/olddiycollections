import React from 'react';
import {
  Button,
  Checkbox,
  Container,
  Grid,
  Header,
  Message,
  Segment,
  Sidebar,
} from 'semantic-ui-react';

import { Report } from './Report';
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
      selected: null,
      visible: true,
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
          <div key={idx}>
            <Button
              onClick={() => {
                this.setState({ selected: report });
              }}
            >
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
            </Button>
          </div>
        );
      } else if (reports.entities[report].type === 'line') {
        return (
          <div key={idx}>
            <Grid.Column width={4} style={{ padding: 0 }}>
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
      } else {
        return <div key={idx}> No report type found</div>;
      }
    });

    return reportsDisplay;
  }

  refreshButtonRender() {
    return (
      <Message>
        Auto-refresh every 30 minutes or{' '}
        <Button
          onClick={() => {
            this.loadData();
          }}
          primary
        >
          Reload
        </Button>
        <Checkbox
          checked={this.state.visible}
          label={{ children: <p>Show report selection</p> }}
          onChange={(e, data) => this.setVisible(data.checked)}
        />
      </Message>
    );
  }

  selectedChartRender() {
    if (this.state.selected) {
      const reportObject = this.state.reports.entities[this.state.selected];
      const { data, description, title } = reportObject;
      //console.log('reportObject: ', reportObject);

      return (
        <Report
          data={data}
          description={description}
          report={this.state.selected}
          title={title}
        />
      );
    } else {
      return <div>Please select a report</div>;
    }
  }

  setVisible(event) {
    this.setState({ visible: event });
  }

  render() {
    return (
      <Container fluid>
        <Grid columns={1} divided stackable textAlign="center">
          <Grid.Column>{this.refreshButtonRender()}</Grid.Column>
          <Grid.Column>
            <Sidebar.Pushable as={Segment}>
              <Sidebar
                as={Segment}
                animation="overlay"
                color="grey"
                icon="labeled"
                inverted
                onHide={() => this.setVisible(false)}
                vertical
                visible={this.state.visible}
                width="very wide"
              >
                <Header as="h2">Report Selection</Header>
                {this.customChartRender()}
              </Sidebar>
              <Sidebar.Pusher style={{ height: '750px' }}>
                {this.selectedChartRender()}
              </Sidebar.Pusher>
            </Sidebar.Pushable>
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}

export default Reports;
