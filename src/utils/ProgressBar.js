import React from 'react';
import { Progress } from 'semantic-ui-react';

export const ProgressBar = (progress) => {
  const [percent, setPercent] = React.useState(0);

  setPercent((prevState, percent) => ({
    percent: prevState.percent === 0 ? 100 : 0,
  }));

  return <Progress percent={percent} autoSuccess />;
};
