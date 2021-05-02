import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Container, Form, Input } from 'semantic-ui-react';
import moment from 'moment';

import { fetchCollection, selectCollectionById } from './collectionsSlice';

export const Collection = (props) => {
  const { id } = props.match.params;
  //console.log('Collection id: ', id);
  const dispatch = useDispatch();
  const collection = useSelector((state) => selectCollectionById(state, id));

  const collectionStatus = useSelector((state) => state.collections.status);
  const error = useSelector((state) => state.collections.error);

  useEffect(() => {
    if (collectionStatus === 'idle') {
      dispatch(fetchCollection());
    }
  }, [dispatch, collectionStatus]);

  const regIdNumberRender = () => {
    if (collection.customerEntity === 'Enterprise') {
      return (
        <Form.Input
          fluid
          label="Registration Number"
          id="form-input-control-regIdNumber"
          readOnly
          defaultValue={collection.regIdNumber}
        />
      );
    } else if (collection.customerEntity === 'Consumer') {
      return (
        <Form.Input
          fluid
          label="ID Number"
          id="form-input-control-regIdNumber"
          readOnly
          defaultValue={collection.regIdNumber}
        />
      );
    }
  };

  const cipcIdvStatus = () => {
    if (collection.customerEntity === 'Enterprise') {
      return <Form.Input label="CIPC Status" defaultValue="cipc" />;
    } else if (collection.customerEntity === 'Consumer') {
      return <Form.Input label="IDV Status" defaultValue="idv" />;
    }
  };

  let content;

  if (collectionStatus === 'loading') {
    content = <Form loading></Form>;
  } else if (collectionStatus === 'failed') {
    content = <Form>{error}</Form>;
  } else if (collectionStatus === 'succeeded') {
    content = (
      <Form>
        <Form.Group widths="equal">
          <Form.Input
            fluid
            label="Case Number"
            id="form-input-control-caseNumber"
            readOnly
            defaultValue={collection.caseNumber}
          />
          <Form.Input
            fluid
            label={`Account Number ${collection.accountNumber} - Notes`}
            id="form-input-control-accountNumber"
            readOnly
            defaultValue={collection.accountNotes}
          />
        </Form.Group>
        <Form.Group widths="equal">
          <Form.TextArea
            label="Case Notes"
            id="form-input-control-caseNotes"
            readOnly
            defaultValue={collection.caseNotes}
          />
          <Form.TextArea
            label="KAM Notes"
            id="form-input-control-kamNotes"
            readOnly
            defaultValue={collection.kamNotes}
          />
        </Form.Group>
        <Form.Group widths="equal">
          <Form.Input
            fluid
            label="Customer Name"
            id="form-input-control-customerName"
            readOnly
            defaultValue={collection.customerName}
          />
        </Form.Group>
        <Form.Group widths="equal">
          {regIdNumberRender()}
          {cipcIdvStatus()}
        </Form.Group>
        <Form.Group widths="equal">
          <Form.Input
            fluid
            label="Debtor Age"
            id="form-input-control-debtorAge"
            readOnly
            defaultValue={collection.debtorAge}
          />
          <Form.Input
            fluid
            label="Credit Limit"
            id="form-input-control-creditLimit"
            readOnly
            defaultValue={collection.creditLimit}
          />
          <Form.Input
            fluid
            label="Total Balance"
            id="form-input-control-totalBalance"
            readOnly
            defaultValue={collection.totalBalance}
          />
        </Form.Group>
        <Form.Group widths="equal">
          <Form.Input
            fluid
            label="Amount Due"
            id="form-input-control-amountDue"
            readOnly
            defaultValue={collection.amountDue}
          />
          <Form.Input
            fluid
            label="Current Balance"
            id="form-input-control-currentBalance"
            readOnly
            defaultValue={collection.currentBalance}
          />
          <Form.Input
            fluid
            label="Account Status"
            id="form-input-control-accountStatus"
            readOnly
            defaultValue={collection.accountStatus}
          />
        </Form.Group>
        <Form.Group widths="equal">
          <Form.Input
            fluid
            label="30 Days"
            id="form-input-control-days30"
            readOnly
            defaultValue={collection.days30}
          />
          <Form.Input
            fluid
            label="60 Days"
            id="form-input-control-days60"
            readOnly
            defaultValue={collection.days60}
          />
          <Form.Input
            fluid
            label="90 Days"
            id="form-input-control-days90"
            readOnly
            defaultValue={collection.days90}
          />
        </Form.Group>
        <Form.Group widths="equal">
          <Form.Input
            fluid
            label="120 Days"
            id="form-input-control-days120"
            readOnly
            defaultValue={collection.days120}
          />
          <Form.Input
            fluid
            label="150 Days"
            id="form-input-control-days150"
            readOnly
            defaultValue={collection.days150}
          />
          <Form.Input
            fluid
            label="180 Days"
            id="form-input-control-days180"
            readOnly
            defaultValue={collection.days180}
          />
          <Form.Input
            fluid
            label="+180 Days"
            id="form-input-control-days180Over"
            readOnly
            defaultValue={collection.days180Over}
          />
        </Form.Group>
        <Form.Group widths="equal">
          <Form.Input
            fluid
            label="Payment Due Date"
            id="form-input-control-paymentDueDate"
            readOnly
            defaultValue={collection.paymentDueDate}
          />
          <Form.Input
            fluid
            label="Debit Order Date"
            id="form-input-control-debitOrderDate"
            readOnly
            defaultValue={collection.debitOrderDate}
          />
        </Form.Group>
        <Form.Group widths="equal">
          <Form.Input
            fluid
            label="Last Payment Date"
            id="form-input-control-lastPaymentDate"
            readOnly
            defaultValue={collection.lastPaymentDate}
          />
          <Form.Input
            fluid
            label="Last Payment Amount"
            id="form-input-control-lastPaymentAmount"
            readOnly
            defaultValue={collection.lastPaymentAmount}
          />
        </Form.Group>
        <Form.Group widths="equal">
          <Form.Input
            fluid
            label="Last PTP Date"
            id="form-input-control-ptpDate"
            readOnly
            defaultValue={collection.ptpDate}
          />
          <Form.Input
            fluid
            label="Last PTP Amount"
            id="form-input-control-ptpAmount"
            readOnly
            defaultValue={collection.lastPTPAmount}
          />
          <Form.Input
            fluid
            label="Next Visit Date and Time"
            id="form-input-control-nextVisitDateTime"
            readOnly
            defaultValue={collection.nextVisitDateTime}
          />
          <Form.Input
            fluid
            label="Representative Name"
            id="form-input-control-representativeName"
            readOnly
            defaultValue={collection.representativeName}
          />
        </Form.Group>
      </Form>
    );
  }

  return <Container fluid>{content}</Container>;
};
