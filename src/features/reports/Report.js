import React from 'react';

import CustomBar from './CustomBar';
import MysqlLayer from '../../services/MysqlLayer';
const mysqlLayer = new MysqlLayer();

export const Report = (props) => {
  const { report } = props;
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    window.scrollTo(0, 0);
    loadData();
  }, [report]);

  const loadData = async () => {
    if (report) {
      const reportData = await mysqlLayer.Get(`/reports/${report}`);
      console.log('reportData: ', reportData);
      setData(reportData);
    }
  };

  const renderChart = () => {
    if (!data) {
      return <div>Please select a report</div>;
    } else {
      return (
        <div>
          Report: {report}
          <CustomBar
            chartNumber={null}
            data={data}
            description="aging"
            styleType="test"
            title="Aging"
          />
        </div>
      );
    }
  };

  return <div>{renderChart()}</div>;
};
