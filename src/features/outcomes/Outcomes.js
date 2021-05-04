import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchOutcomesByCase, selectAllOutcomesByCase } from './outcomesSlice';

export const Outcomes = (props) => {
  const { id } = props;

  const dispatch = useDispatch();
  const outcomes = useSelector((state) => selectAllOutcomesByCase(state, id));

  const outcomesStatus = useSelector((state) => state.outcomes.status);
  const error = useSelector((state) => state.outcomes.error);

  React.useEffect(() => {
    if (outcomesStatus === 'idle') {
      dispatch(fetchOutcomesByCase(id));
    }
  }, [dispatch, outcomesStatus, id]);

  let content;

  if (outcomesStatus === 'loading') {
    content = <div>Loading...</div>;
  } else if (outcomesStatus === 'failed') {
    content = <div>{error}</div>;
  } else if (outcomesStatus === 'succeeded') {
    content = <div>success</div>;
  }

  return <div>{content}</div>;
};
