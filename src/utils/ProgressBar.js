import React from 'react';
import { Progress } from 'semantic-ui-react';

export const ProgressBar = (props) => {
  const { file, percent } = props;

  if (percent < 100) {
    return <Progress percent={percent} progress active />;
  } else {
    return (
      <Progress percent={percent} success>
        {file} successfully uploaded
      </Progress>
    );
  }
};
