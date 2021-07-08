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

class Reports extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reports: { ids: ['aging', 'agentPTP', 'datePTP'] },
      selected: null,
      visible: true,
    };
  }

  customBarRender() {
    const reports = this.state.reports;

    const reportsDisplay = reports.ids.map((report, idx) => {
      return (
        <div key={idx}>
          <Button
            onClick={() => {
              this.setState({ selected: report });
            }}
          >
            {report}
          </Button>
        </div>
      );
    });

    return reportsDisplay;
  }

  setVisible(event) {
    this.setState({ visible: event });
  }

  render() {
    return (
      <Container fluid>
        <Grid columns={1} divided stackable textAlign="center">
          <Grid.Column>
            <Message>
              Auto-refresh every 30 minutes or <Button primary>Reload</Button>
              <Checkbox
                checked={this.state.visible}
                label={{ children: <p>Show report selection</p> }}
                onChange={(e, data) => this.setVisible(data.checked)}
              />
            </Message>
          </Grid.Column>
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
                {this.customBarRender()}
              </Sidebar>
              <Sidebar.Pusher style={{ height: '350px' }}>
                selected report {this.state.selected}
              </Sidebar.Pusher>
            </Sidebar.Pushable>
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}

export default Reports;
