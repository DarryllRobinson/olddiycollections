import React from 'react';

import CustomBar from './CustomBar';
//import MysqlLayer from '../../services/MysqlLayer';
//const mysqlLayer = new MysqlLayer();

export const Report = (props) => {
  //console.log('Report props: ', props);
  const { data, description, report, title } = props;
  /*const [data, setData] = React.useState(null);

  React.useEffect(() => {
    const loadData = async () => {
      if (report) {
        const reportData = await mysqlLayer.Get(`/reports/${report}`);
        console.log('reportData: ', reportData);
        setData(reportData);
      }
    };
    window.scrollTo(0, 0);
    loadData();
  }, [report]);*/

  const renderChart = () => {
    if (!report) {
      return <div>Please select a report</div>;
    } else if (!data) {
      <div className="ui active inverted dimmer">
        <div className="ui text loader">Loading</div>
      </div>;
    } else {
      return (
        <div>
          <CustomBar
            chartNumber={null}
            data={data}
            description={description}
            styleType="test"
            title={title}
          />
        </div>
      );
    }
  };

  return <div>{renderChart()}</div>;
};
