import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form } from 'semantic-ui-react';
import moment from 'moment';

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

  let outcomesNotes;
  let outcomesNotesArray = [];
  //console.log('this.state.outcomeRecords: ', this.state.outcomeRecords);
  outcomes.forEach((outcome, idx) => {
    //console.log('outcomeRecord.outcomeNotes: ', outcomeRecord.outcomeNotes);
    outcomesNotesArray[idx] = `${idx + 1}: ` + outcome.outcomeNotes + '\n\r';
  });
  //console.log('outcomesNotes before: ', outcomesNotes);
  outcomesNotes = outcomesNotesArray.join('\n');

  let outcomesBundle;
  let outcomesArray = [];

  outcomes.forEach((outcome, idx) => {
    let ptpDate = outcome.ptpDate
      ? moment(outcome.ptpDate).format('YYYY-MM-DD')
      : '--';
    let debitResubmissionDate = outcome.debitResubmissionDate
      ? moment(outcome.debitResubmissionDate).format('YYYY-MM-DD')
      : '--';

    outcomesArray[idx] =
      moment(outcome.createdDate).format('YYYY-MM-DD HH:mm:ss') +
      ' by user ' +
      outcome.createdBy +
      '\n' +
      'Transaction type: ' +
      outcome.transactionType +
      '\n' +
      'Contacted person: ' +
      outcome.contactPerson +
      '\n' +
      'Number called: ' +
      outcome.numberCalled +
      '\n' +
      'Email used: ' +
      outcome.emailUsed +
      '\n' +
      'PTP date: ' +
      ptpDate +
      '\n' +
      'PTP amount: R' +
      outcome.ptpAmount +
      '\n' +
      'Pend reason: ' +
      outcome.pendReason +
      '\n' +
      'Debit order resubmission date: ' +
      debitResubmissionDate +
      '\n' +
      'Debit order resubmission amount: R' +
      outcome.debitResubmissionAmount +
      '\n' +
      'Outcome resolution: ' +
      outcome.outcomeResolution +
      '\n' +
      'Next visit date and time: ' +
      moment(outcome.nextVisitDateTime).format('YYYY-MM-DD HH:mm') +
      '\n' +
      'Next steps: ' +
      outcome.nextSteps +
      '\n' +
      'Outcome notes: \n' +
      outcomesNotes +
      '\n' +
      '-----------------------------------------\n\r';
  });
  outcomesBundle = outcomesArray.join('\n');

  let content;
  if (outcomesStatus === 'succeeded') {
    content = (
      <Form.Group widths="equal">
        <Form.TextArea
          label="Outcomes History"
          id="form-input-control-outcomesHistory"
          rows="10"
          readOnly
          defaultValue={outcomesBundle}
        />
      </Form.Group>
    );
  } else if (outcomesStatus === 'error') {
    content = (
      <Form.Group widths="equal">
        <Form.TextArea>{error}</Form.TextArea>
      </Form.Group>
    );
  }

  return <div>{content}</div>;
};
