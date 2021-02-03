import React from 'react';
import { useHistory } from 'react-router-dom';
import Form from '../forms/Form';
import FieldInput from '../forms/FieldInput';
import FormStep from '../forms/FormStep';
import FormBack from '../forms/FormBack';
import FormProgress from '../forms/FormProgress';
import Button from '../govuk/Button';
import SecondaryButton from '../govuk/SecondaryButton';
import FormActions from '../forms/FormActions';
import FieldSelect from '../forms/FieldSelect';
import FieldRadios from '../forms/FieldRadios';
import FieldAutocomplete from '../forms/FieldAutocomplete';

const IssueTargetPage = () => {
  const history = useHistory();

  return (
    <Form
      id="target-sheet-form"
      onSubmit={async () => {
        await new Promise((resolve) => {
          setTimeout(() => {
            resolve({});
          }, 2000);
        });
      }}
      onCancel={() => history.push('/')}
    >
      {({ values, isLastStep, cancel }) => (
        <>
          <FormBack />
          <FormProgress />

          <h1 className="govuk-heading-xl">Issue a target</h1>

          <FormStep name="one">
            <h2 className="govuk-heading-m">General Target Information</h2>

            <FieldAutocomplete
              label="Test autocomplete"
              required="Not so fast!"
              options={[
                { label: 'Option A', value: 'a' },
                { label: 'Option B', value: 'b' },
                { label: 'Option C', value: 'c' },
                { label: 'Option D', value: 'd' },
                { label: 'Option E', value: 'e' },
                { label: 'Option F', value: 'f' },
              ]}
              name="testAutocomplete"
            />

            <FieldRadios
              legend="What type of RoRo movement is this?"
              name="roroFreightType"
              required="Chose RoRo movement type"
              inline
              items={[
                { label: 'Accompanied', value: 'accompanied' },
                { label: 'Unaccompanied', value: 'unaccompanied' },
              ]}
            />

            <FieldInput name="test" type="text" label="Test input" />
            <FieldSelect
              name="testSelect"
              options={[
                { label: 'Option A', value: 'a' },
                { label: 'Option B', value: 'b' },
              ]}
            />
          </FormStep>

          <FormStep name="two">
            <h2 className="govuk-heading-m">Second step</h2>

            <FieldInput name="test2" type="text" label="Test input 2" />
          </FormStep>

          <pre>
            <code>
              {JSON.stringify(values, 0, 2)}
            </code>
          </pre>

          <FormActions>
            <Button>{isLastStep() ? 'Submit' : 'Save and continue'}</Button>
            <SecondaryButton onClick={(e) => { e.preventDefault(); cancel(); }}>Cancel</SecondaryButton>
          </FormActions>
        </>
      )}
    </Form>
  );
};

export default IssueTargetPage;
