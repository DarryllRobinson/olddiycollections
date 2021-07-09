import React from 'react';

import CustomBar from './CustomBar';
//import MysqlLayer from '../../services/MysqlLayer';
//const mysqlLayer = new MysqlLayer();

export const Report = (props) => {
  //console.log('Report props: ', props);
  const { data, description, report, styleType, title } = props;

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
            styleType={styleType}
            title={title}
          />
        </div>
      );
    }
  };

  return <div>{renderChart()}</div>;
};
