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

import CustomBar from './CustomBar';
import CustomLine from './CustomLine';
import MysqlLayer from '../../services/MysqlLayer';

class Reports extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reports: {
        ids: ['aging', 'agentPTP', 'datePTP'],
        //  ids: ['aging', 'penetrationRate'],
        entities: {
          aging: {
            data: null /*[
              {
                name: '30',
                value: 314882.58,
              },
              {
                name: '60',
                value: 994234.76,
              },
              {
                name: '90',
                value: 1242800.2,
              },
              {
                name: '120',
                value: 945464.55,
              },
              {
                name: '150',
                value: 231865.32,
              },
              {
                name: '180',
                value: 815360.12,
              },
              {
                name: 'Current',
                value: 828551.51,
              },
              {
                name: '>180',
                value: 829422.3,
              },
            ],*/,
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
          /*penetrationRate: {
            data: [
              {
                name: 'Dec 20',
                value: 32,
              },
              {
                name: 'Jan 21',
                value: 36,
              },
              {
                name: 'Feb 21',
                value: 42,
              },
              {
                name: 'Mar 21',
                value: 36,
              },
              {
                name: 'Apr 21',
                value: 70,
              },
              {
                name: 'May 21',
                value: 64,
              },
            ],
            description: 'Contacts made per account per month',
            title: 'Penetration rate',
            type: 'line',
          },*/
        },
      },
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
                this.selectedChartRender(report);
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

  selectedChartRender(selection) {
    const reports = this.state.reports;

    if (!selection) {
      console.log('I am here! ', selection);
      return (
        <Segment style={{ height: '350px' }}>
          Please select a report from the menu on the left
        </Segment>
      );
    } else {
      console.log('I am here with a selection! ', selection);
      this.setState({ selected: selection });
      return (
        reports.entities[selection].data && (
          <>
            <p>still trying</p>
            <CustomBar
              chartNumber={null}
              data={reports.entities[selection].data}
              description={reports.entities[selection].description}
              styleType="dash"
              title={reports.entities[selection].title}
            />
          </>
        )
      );
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
              <Sidebar.Pusher>{this.selectedChartRender()}</Sidebar.Pusher>
            </Sidebar.Pushable>
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}

export default Reports;
