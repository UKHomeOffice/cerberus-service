import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import Form from '../forms/Form';
import FieldInput from '../forms/FieldInput';
import FormStep from '../forms/FormStep';
import FormBack from '../forms/FormBack';
import FormProgress from '../forms/FormProgress';
import Button from '../govuk/Button';
import SecondaryButton from '../govuk/SecondaryButton';
import FormActions from '../forms/FormActions';
import Panel from '../govuk/Panel';
import FieldRadios from '../forms/FieldRadios';
import FieldAddress from '../forms/FieldAddress';
import FieldAutocomplete from '../forms/FieldAutocomplete';
import Details from '../govuk/Details';
import FieldDateTime from '../forms/FieldDateTime';
import FieldTextarea from '../forms/FieldTextarea';
import FieldCheckboxes from '../forms/FieldCheckboxes';

const dummyOptions = [
  { label: 'Option A', value: 'a' },
  { label: 'Option B', value: 'b' },
  { label: 'Option C', value: 'c' },
  { label: 'Option D', value: 'd' },
  { label: 'Option E', value: 'e' },
  { label: 'Option F', value: 'f' },
];

const FieldPersonTraveling = ({ header, name }) => (
  <>
    {header && <h2 className="govuk-heading-m">{header}</h2>}

    <FieldInput
      label="First name (optional)"
      name={`${name}.firstName`}
    />

    <FieldInput
      label="Middle name(s) (optional)"
      name={`${name}.middleName`}
    />

    <FieldInput
      label="Last name (optional)"
      name={`${name}.lastName`}
    />

    <FieldDateTime
      legend="Date of birth (optional)"
      name={`${name}.dob`}
    />

    <FieldAutocomplete
      label="Nationality (optional)"
      name={`${name}.nationality`}
      options={dummyOptions}
    />

    <FieldAutocomplete
      label="Sex (optional)"
      name={`${name}.sex`}
      options={dummyOptions}
    />

    <FieldAutocomplete
      label="Travel document type (optional)"
      name={`${name}.docType`}
      options={dummyOptions}
    />

    <FieldInput
      label="Travel document number (optional)"
      name={`${name}.docNumber`}
    />

    <FieldDateTime
      legend="Travel document expiry (optional)"
      name={`${name}.docExpiry`}
    />
  </>
);

const FieldPersonNotTraveling = ({ header, name, nameLabel = 'Full name' }) => (
  <>
    {header && <h2 className="govuk-heading-m">{header}</h2>}
    <FieldInput label={`${nameLabel} (optional)`} name={`${name}.name`} />
    <FieldAddress name={`${name}.address`} />
  </>
);

const IssueTargetPage = () => {
  const history = useHistory();

  const [success, setSuccess] = useState(false);

  if (success) {
    return <Panel title="Form submitted">Thank you for submitting the target information sheet.</Panel>;
  }

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
      onSuccess={() => setSuccess(true)}
      onCancel={() => history.push('/')}
    >
      {({ values, isLastStep, cancel }) => (
        <>
          <FormBack />
          <FormProgress />

          <h1 className="govuk-heading-xl">Issue a target</h1>

          <FormStep name="generalInformation">
            <h2 className="govuk-heading-m">General Target Information</h2>

            <FieldAutocomplete
              label="Issuing hub (optional)"
              name="issuingHub"
              options={dummyOptions}
            />

            <FieldAutocomplete
              label="Target category"
              name="category"
              required="Select target category"
              options={dummyOptions}
            />

            <FieldAutocomplete
              label="Port"
              name="eventPort"
              required="Select port"
              options={dummyOptions}
              hint="The port that the target is scheduled to arrive at"
              formGroup={{
                suffix: (
                  <Details
                    summary="How to find the port from the dropdown list"
                    className="govuk-!-margin-top-2"
                  >
                    To search for a port, enter the first three letters in the search bar of the dropdown list.
                    This will filter the list based on those letters
                  </Details>
                ),
              }}
            />

            <FieldInput
              label="Operation name (optional)"
              name="operation"
            />

            <FieldAutocomplete
              label="Threat indicators"
              name="threatIndicators"
              required="Select thread indicators"
              options={dummyOptions}
              isMulti
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

            <h2 className="govuk-heading-m">Interception details</h2>

            <FieldInput
              label="Vessel name (optional)"
              name="vessel.name"
            />

            <FieldInput
              label="Shipping company (optional)"
              name="vessel.company"
            />

            <FieldDateTime
              legend="Estimated date and time of arrival"
              required="Enter the estimated date and time of arrival"
              name="eta"
              showTime
            />

            <h2 className="govuk-heading-m">Vehicle details</h2>

            <FieldInput
              label="Vehicle make (optional)"
              name="vehicle.make"
            />

            <FieldInput
              label="Vehicle model (optional)"
              name="vehicle.model"
            />

            <FieldInput
              label="Vehicle colour (optional)"
              name="vehicle.colour"
            />

            <FieldInput
              label="Vehicle registration nationality (optional)"
              name="vehicle.registrationNationality"
              options={dummyOptions}
            />

            <FieldInput
              label="Vehicle registration number (optional)"
              name="vehicle.registrationNumber"
            />

            <FieldInput
              label="Trailer registration number (optional)"
              name="vehicle.trailer.regNumber"
            />

            <FieldInput
              label="Trailer Type (optional)"
              name="vehicle.trailer.type"
              options={dummyOptions}
            />

            <FieldAutocomplete
              label="Trailer registration nationality (optional)"
              name="vehicle.trailer.registrationNationality"
              options={dummyOptions}
            />

            <h2 className="govuk-heading-m">Pre-arrival details</h2>

            <FieldAutocomplete
              label="Control strategy"
              required="Select control strategy"
              name="strategy"
              options={dummyOptions}
            />

            <FieldAutocomplete
              label="Selection indicators (optional)"
              name="selectionTypes"
              options={dummyOptions}
              isMulti
            />

            <FieldInput
              label="Account name (optional)"
              name="account.name"
            />

            <FieldInput
              label="Account number (optional)"
              name="account.number"
            />

            <FieldTextarea
              label="Comments on reason for selection (optional)"
              hint="Provide as much useful information as possible. This target will be sent to a frontline team for interdiction."
              name="selectionReasoning"
            />

            <FieldRadios
              legend="Have any warnings been identified?"
              name="warningsIdentified"
              required="Answer if any warnings have have been identified"
              hint="Use this to notify the target recipient of any warnings or markers, for example the person has a history of violence or has previously ran the controls"
              inline
              items={[
                { label: 'Yes', value: 'yes' },
                { label: 'No', value: 'No' },
              ]}
            />

            {values.warningsIdentified === 'yes' && (
              <FieldTextarea
                label="Details of the warnings"
                hint="This information will be shown to the target recipient as a primary warning. Be as descriptive as possible."
                required="Provide details of the identified warnings"
                name="warningDetails"
              />
            )}

            <FieldInput
              label="Watchlist IRN / BSM reference (optional)"
              name="watchlistIrn"
            />

            {values.roroFreightType === 'accompanied' && (
              <>
                <FieldPersonTraveling header="Driver details" name="driver" />
                <FieldPersonTraveling header="Passenger details" name="passenger" />
              </>
            )}

            <FieldRadios
              legend="Is there a second passenger? (optional)"
              name="secondPassenger"
              inline
              items={[
                { label: 'Yes', value: 'yes' },
                { label: 'No', value: 'No' },
              ]}
            />

            {values.secondPassenger === 'yes' && (
              <FieldPersonTraveling header="Additional passenger details" name="additionalPassenger" />
            )}

            <h2 className="govuk-heading-m">Cargo details</h2>

            <FieldInput
              label="Manifest load (optional)"
              name="load.manifestedLoad"
            />

            <FieldInput
              label="Manifest weight (optional)"
              name="load.manifestedWeight"
            />

            <FieldAutocomplete
              label="Country of destination (optional)"
              name="load.countryOfDestination"
              options={dummyOptions}
            />

            <FieldCheckboxes
              legend="Details are available for (optional)"
              name="detailsOf"
              items={[
                { label: 'Consignor', value: 'consignor' },
                { label: 'Consignee', value: 'consignee' },
                { label: 'Haulier', value: 'haulier' },
              ]}
            />

            {values.detailsOf?.includes('consignor') && (
              <FieldPersonNotTraveling header="Consignor details" nameLabel="Consignor name" name="consignor" />
            )}

            {values.detailsOf?.includes('consignee') && (
              <FieldPersonNotTraveling header="Consignee details" nameLabel="Consignee name" name="consignee" />
            )}

            {values.detailsOf?.includes('haulier') && (
              <FieldPersonNotTraveling header="Haulier details" nameLabel="Haulier name" name="haulier" />
            )}
          </FormStep>

          <FormStep name="recipientDetails">
            <FieldAutocomplete
              label="Select the team that should receive the target"
              required="You need to select a team"
              name="teamToReceiveTheTarget"
              options={dummyOptions}
            />
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
