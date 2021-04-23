import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import * as pluralise from 'pluralise';
import axios from 'axios';
import { get } from 'lodash';

import config from '../config';
import { FORM_NAME_TARGET_INFORMATION_SHEET, LONG_DATE_FORMAT } from '../constants';
import { useKeycloak } from '../utils/keycloak';
import useAxiosInstance from '../utils/axiosInstance';
import Accordion from '../govuk/Accordion';
import Button from '../govuk/Button';
import LoadingSpinner from '../forms/LoadingSpinner';
import ErrorSummary from '../govuk/ErrorSummary';
import ClaimButton from '../components/ClaimTaskButton';
import RenderForm from '../components/RenderForm';
import Panel from '../govuk/Panel';
import { useFormSubmit } from '../utils/formioSupport';

import './__assets__/TaskDetailsPage.scss';

// See Camunda docs for all operation types: https://docs.camunda.org/javadoc/camunda-bpm-platform/7.7/org/camunda/bpm/engine/history/UserOperationLogEntry.html
const OPERATION_TYPE_CLAIM = 'Claim';
const OPERATION_TYPE_ASSIGN = 'Assign';

const TaskVersions = ({ taskVersions }) => (
  <Accordion
    className="task-versions"
    id="task-versions"
    items={taskVersions.slice(0).reverse().map((task, index) => {
      const { taskSummary } = task;
      const versionNumber = taskVersions.length - index;
      const vehicle = get(task, 'vehicleHistory[0][0]vehicle', {});
      const trailer = get(taskSummary, 'trailers[0]', {});
      const account = taskSummary?.organisations.find(({ type }) => type === 'ORGACCOUNT') || {};
      const haulier = taskSummary?.organisations.find(({ type }) => type === 'ORGHAULIER') || {};
      const driver = taskSummary?.people.find(({ role }) => role === 'DRIVER') || {};
      const passengers = taskSummary?.people.filter(({ role }) => role === 'PASSENGER') || [];
      const freight = taskSummary?.freight;
      const consignee = taskSummary?.consignee;
      const consignor = taskSummary?.consignor;
      const matchedRules = get(task, 'ruleHistory[0]', []);
      return (
        {
          heading: `Version ${versionNumber}`,
          summary: (
            <>
              <div className="task-versions--left">
                <div className="govuk-caption-m">{moment(task.bookingDateTime).format(LONG_DATE_FORMAT)}</div>
              </div>
              <div className="task-versions--right">
                <ul className="govuk-list">
                  <li>{pluralise.withCount(0, '% change', '% changes', 'No changes')} in this version</li>
                  <li>Highest threat level is <strong className="govuk-tag govuk-tag--red">{taskSummary?.matchedSelectors[0].priority}</strong> from version {versionNumber}</li>
                </ul>
              </div>
            </>
          ),
          children: (
            <>
              <h2 className="govuk-heading-m">Vehicle details</h2>

              <dl className="govuk-summary-list govuk-!-margin-bottom-9">
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Registration number</dt>
                  <dd className="govuk-summary-list__value">{vehicle.registrationNumber}</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Type</dt>
                  <dd className="govuk-summary-list__value">{vehicle.type}</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Make</dt>
                  <dd className="govuk-summary-list__value">{vehicle.make}</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Model</dt>
                  <dd className="govuk-summary-list__value">{vehicle.model}</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Country of registration</dt>
                  <dd className="govuk-summary-list__value">{vehicle.registrationCountry}</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Trailer registration number</dt>
                  <dd className="govuk-summary-list__value">{trailer.registrationNumber}</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Trailer type</dt>
                  <dd className="govuk-summary-list__value">TODO</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Trailer country of registration</dt>
                  <dd className="govuk-summary-list__value">TODO</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Empty or loaded</dt>
                  <dd className="govuk-summary-list__value">TODO</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Trailer length</dt>
                  <dd className="govuk-summary-list__value">TODO</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Trailer height</dt>
                  <dd className="govuk-summary-list__value">TODO</dd>
                </div>
              </dl>

              <h2 className="govuk-heading-m">Account details</h2>

              <dl className="govuk-summary-list govuk-!-margin-bottom-9">
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Full name</dt>
                  <dd className="govuk-summary-list__value">{account.name}</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Short name</dt>
                  <dd className="govuk-summary-list__value">TODO</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Reference number</dt>
                  <dd className="govuk-summary-list__value">TODO</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Address</dt>
                  <dd className="govuk-summary-list__value">TODO</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Telephone</dt>
                  <dd className="govuk-summary-list__value">TODO</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Mobile</dt>
                  <dd className="govuk-summary-list__value">TODO</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Email</dt>
                  <dd className="govuk-summary-list__value">TODO</dd>
                </div>
              </dl>

              <h2 className="govuk-heading-m">Haulier details</h2>

              <dl className="govuk-summary-list govuk-!-margin-bottom-9">
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Name</dt>
                  <dd className="govuk-summary-list__value">{haulier.name}</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Address</dt>
                  <dd className="govuk-summary-list__value">TODO</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Telephone</dt>
                  <dd className="govuk-summary-list__value">TODO</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Mobile</dt>
                  <dd className="govuk-summary-list__value">TODO</dd>
                </div>
              </dl>

              <h2 className="govuk-heading-m">Driver</h2>

              <dl className="govuk-summary-list govuk-!-margin-bottom-9">
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Name</dt>
                  <dd className="govuk-summary-list__value">{driver.name}</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Date of birth</dt>
                  <dd className="govuk-summary-list__value">TODO</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Gender</dt>
                  <dd className="govuk-summary-list__value">TODO</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Nationality</dt>
                  <dd className="govuk-summary-list__value">TODO</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Travel document type</dt>
                  <dd className="govuk-summary-list__value">TODO</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Travel document number</dt>
                  <dd className="govuk-summary-list__value">TODO</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Travel document expiry</dt>
                  <dd className="govuk-summary-list__value">TODO</dd>
                </div>
              </dl>

              {passengers.length > 0 && <h2 className="govuk-heading-m">Passengers</h2>}

              {passengers.map((passenger) => (
                <dl key={passenger.name} className="govuk-summary-list govuk-!-margin-bottom-9">
                  <div className="govuk-summary-list__row">
                    <dt className="govuk-summary-list__key">Name</dt>
                    <dd className="govuk-summary-list__value">{passenger.name}</dd>
                  </div>
                  <div className="govuk-summary-list__row">
                    <dt className="govuk-summary-list__key">Date of birth</dt>
                    <dd className="govuk-summary-list__value">TODO</dd>
                  </div>
                  <div className="govuk-summary-list__row">
                    <dt className="govuk-summary-list__key">Gender</dt>
                    <dd className="govuk-summary-list__value">TODO</dd>
                  </div>
                  <div className="govuk-summary-list__row">
                    <dt className="govuk-summary-list__key">Nationality</dt>
                    <dd className="govuk-summary-list__value">TODO</dd>
                  </div>
                  <div className="govuk-summary-list__row">
                    <dt className="govuk-summary-list__key">Travel document type</dt>
                    <dd className="govuk-summary-list__value">TODO</dd>
                  </div>
                  <div className="govuk-summary-list__row">
                    <dt className="govuk-summary-list__key">Travel document number</dt>
                    <dd className="govuk-summary-list__value">TODO</dd>
                  </div>
                  <div className="govuk-summary-list__row">
                    <dt className="govuk-summary-list__key">Travel document expiry</dt>
                    <dd className="govuk-summary-list__value">TODO</dd>
                  </div>
                </dl>
              ))}

              <h2 className="govuk-heading-m">Goods</h2>

              <dl className="govuk-summary-list govuk-!-margin-bottom-9">
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Description of goods</dt>
                  <dd className="govuk-summary-list__value">{freight?.descriptionOfCargo}</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Is cargo hazardous?</dt>
                  <dd className="govuk-summary-list__value">{freight?.hazardousCargo === 'true' ? 'Yes' : 'No'}</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Weight of goods</dt>
                  <dd className="govuk-summary-list__value">TODO</dd>
                </div>
              </dl>

              <h2 className="govuk-heading-m">Booking</h2>

              <dl className="govuk-summary-list govuk-!-margin-bottom-9">
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Reference</dt>
                  <dd className="govuk-summary-list__value">TODO</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Ticket number</dt>
                  <dd className="govuk-summary-list__value">TODO</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Type</dt>
                  <dd className="govuk-summary-list__value">TODO</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Name</dt>
                  <dd className="govuk-summary-list__value">TODO</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Address</dt>
                  <dd className="govuk-summary-list__value">TODO</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Date and time</dt>
                  <dd className="govuk-summary-list__value">{moment(taskSummary?.bookingDateTime).format(LONG_DATE_FORMAT)}</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Country</dt>
                  <dd className="govuk-summary-list__value">TODO</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Payment method</dt>
                  <dd className="govuk-summary-list__value">TODO</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Ticket price</dt>
                  <dd className="govuk-summary-list__value">TODO</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Ticket type</dt>
                  <dd className="govuk-summary-list__value">TODO</dd>
                </div>
              </dl>

              <h2 className="govuk-heading-m">Consignee details</h2>

              <dl className="govuk-summary-list govuk-!-margin-bottom-9">
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Name</dt>
                  <dd className="govuk-summary-list__value">{consignee?.name}</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Address</dt>
                  <dd className="govuk-summary-list__value">{consignee?.address}</dd>
                </div>
              </dl>

              <h2 className="govuk-heading-m">Consignor details</h2>

              <dl className="govuk-summary-list govuk-!-margin-bottom-9">
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Name</dt>
                  <dd className="govuk-summary-list__value">{consignor?.name}</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Address</dt>
                  <dd className="govuk-summary-list__value">{consignor?.address}</dd>
                </div>
              </dl>

              {matchedRules.length > 0 && <h2 className="govuk-heading-m">Rules matched</h2>}

              {matchedRules.map((rule) => (
                <dl key={rule.ruleName} className="govuk-summary-list govuk-!-margin-bottom-9">
                  <div className="govuk-summary-list__row">
                    <dt className="govuk-summary-list__key">Name</dt>
                    <dd className="govuk-summary-list__value">{rule.ruleName}</dd>
                  </div>
                  <div className="govuk-summary-list__row">
                    <dt className="govuk-summary-list__key">Category</dt>
                    <dd className="govuk-summary-list__value">TODO</dd>
                  </div>
                  <div className="govuk-summary-list__row">
                    <dt className="govuk-summary-list__key">Version</dt>
                    <dd className="govuk-summary-list__value">{rule.ruleVersion}</dd>
                  </div>
                  <div className="govuk-summary-list__row">
                    <dt className="govuk-summary-list__key">Abuse type</dt>
                    <dd className="govuk-summary-list__value">{rule.abuseType}</dd>
                  </div>
                  <div className="govuk-summary-list__row">
                    <dt className="govuk-summary-list__key">Agency</dt>
                    <dd className="govuk-summary-list__value">TODO</dd>
                  </div>
                  <div className="govuk-summary-list__row">
                    <dt className="govuk-summary-list__key">Description</dt>
                    <dd className="govuk-summary-list__value">{rule.ruleDescription}</dd>
                  </div>
                </dl>
              ))}

              <h2 className="govuk-heading-m">Risk factors</h2>
              <p>TODO</p>
            </>
          ),
        }
      );
    })}
  />
);

const TaskManagementForm = ({ formName, onCancel, taskId, taskData, ...props }) => {
  const submitForm = useFormSubmit();
  return (
    <div id={formName}>
      <RenderForm
        formName={formName}
        onCancel={() => onCancel(false)}
        preFillData={taskData}
        onSubmit={async (data, form) => {
          await submitForm(
            `/task/${taskId}/submit-form`,
            data.data.businessKey,
            form,
            { ...data.data, actionTarget: false },
            FORM_NAME_TARGET_INFORMATION_SHEET,
          );
        }}
        {...props}
      />
    </div>
  );
};

const NotesForm = ({ businessKey, processInstanceId }) => {
  const keycloak = useKeycloak();
  const camundaClient = useAxiosInstance(keycloak, config.camundaApiUrl);
  return (
    <>
      <h2 className="govuk-heading-m">Notes</h2>
      <RenderForm
        formName="noteCerberus"
        onSubmit={async (data, form) => {
          const { versionId, id, title, name } = form;
          await camundaClient.post('/message', {
            messageName: 'addNotes',
            processInstanceId,
            businessKey,
            processVariables: {
              note: {
                value: JSON.stringify({
                  form: {
                    formVersionId: versionId,
                    formId: id,
                    title,
                    name,
                    submissionDate: new Date(),
                    submittedBy: keycloak.tokenParsed.email,
                  },
                  ...data.data,
                }),
                type: 'Json',
              },
            },
          });
        }}
      />
    </>
  );
};

const TaskDetailsPage = () => {
  const { taskId } = useParams();
  const [error, setError] = useState(null);
  const [taskVersions, setTaskVersions] = useState([]);
  const [activityLog, setActivityLog] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const keycloak = useKeycloak();
  const camundaClient = useAxiosInstance(keycloak, config.camundaApiUrl);
  const currentUser = keycloak.tokenParsed.email;
  const assignee = taskVersions?.[0]?.assignee;
  const currentUserIsOwner = assignee === currentUser;
  const [isCompleteFormOpen, setCompleteFormOpen] = useState();
  const [isDismissFormOpen, setDismissFormOpen] = useState();
  const [isIssueTargetFormOpen, setIssueTargetFormOpen] = useState();
  const source = axios.CancelToken.source();

  const TaskCompletedSuccessMessage = ({ message }) => {
    return (
      <>
        <Panel title={message} />
        <p className="govuk-body">We have sent your request to the relevant team.</p>
        <h2 className="govuk-heading-m">What happens next</h2>
        <p className="govuk-body">The task is now paused pending a response.</p>
        <Button
          className="govuk-button"
          onClick={() => {
            setIssueTargetFormOpen(false);
            setCompleteFormOpen(false);
            setDismissFormOpen(false);
          }}
        >
          Finish
        </Button>
      </>
    );
  };

  useEffect(() => {
    const loadTask = async () => {
      try {
        const taskResponse = await camundaClient.get(`/task/${taskId}`);
        const processInstanceId = taskResponse.data.processInstanceId;

        const [variableInstanceResponse, operationsHistoryResponse, taskHistoryResponse] = await Promise.all([
          camundaClient.get(
            '/variable-instance',
            { params: { processInstanceIdIn: processInstanceId, deserializeValues: false } },
          ),
          camundaClient.get(
            '/history/user-operation',
            { params: { processInstanceId, deserializeValues: false } },
          ),
          camundaClient.get(
            '/history/task',
            { params: { processInstanceId, deserializeValues: false } },
          ),
        ]);

        const parsedNotes = JSON.parse(variableInstanceResponse.data.find((processVar) => {
          return processVar.name === 'notes';
        }).value).map((note) => ({
          date: moment(note.timeStamp).format(),
          user: note.userId,
          note: note.note,
        }));

        const parsedOperationsHistory = operationsHistoryResponse.data.map((operation) => {
          const getNote = () => {
            if ([OPERATION_TYPE_CLAIM, OPERATION_TYPE_ASSIGN].includes(operation.operationType)) {
              return operation.newValue ? 'User has claimed the task' : 'User has unclaimed the task';
            }
            return `Property ${operation.property} changed from ${operation.orgValue || 'none'} to ${operation.newValue || 'none'}`;
          };
          return {
            date: operation.timestamp,
            user: operation.userId,
            note: getNote(operation),
          };
        });
        const parsedTaskHistory = taskHistoryResponse.data.map((historyLog) => ({
          date: historyLog.startTime,
          user: historyLog.assignee,
          note: historyLog.name,
        }));
        setActivityLog([
          ...parsedOperationsHistory,
          ...parsedTaskHistory,
          ...parsedNotes,
        ].sort((a, b) => -a.date.localeCompare(b.date)));

        const whitelistedCamundaVars = ['taskSummary', 'vehicleHistory', 'orgHistory', 'ruleHistory', 'targetInformationSheet'];
        const parsedTaskVariables = variableInstanceResponse.data
          .filter((t) => whitelistedCamundaVars.includes(t.name))
          .reduce((acc, camundaVar) => {
            acc[camundaVar.name] = JSON.parse(camundaVar.value);
            return acc;
          }, {});
        setTaskVersions([{
          ...taskResponse.data,
          ...parsedTaskVariables,
        }]);
      } catch (e) {
        setError(e.response?.status === 404 ? "Task doesn't exist." : e.message);
        setTaskVersions([]);
      } finally {
        setLoading(false);
      }
    };

    loadTask();
    return () => {
      source.cancel('Cancelling request');
    };
  }, []);

  if (isLoading) {
    return <LoadingSpinner><br /><br /><br /></LoadingSpinner>;
  }

  const getAssignee = () => {
    if (!assignee) {
      return 'Unassigned';
    }
    if (currentUserIsOwner) {
      return 'Assigned to you';
    }
    return `Assigned to ${assignee}`;
  };

  return (
    <>
      {error && <ErrorSummary title={error} />}

      {taskVersions.length > 0 && (
        <>
          <div className="govuk-grid-row">
            <div className="govuk-grid-column-one-half">
              <span className="govuk-caption-xl">{taskVersions[0].taskSummary?.businessKey}</span>
              <h1 className="govuk-heading-xl govuk-!-margin-bottom-0">Task details</h1>
              <p className="govuk-body">
                {getAssignee()}
                <ClaimButton assignee={assignee} taskId={taskId} setError={setError} />
              </p>
            </div>

            <div className="govuk-grid-column-one-half task-actions--buttons">
              {currentUserIsOwner && (
                <>
                  <Button
                    className="govuk-!-margin-right-1"
                    onClick={() => {
                      setIssueTargetFormOpen(true);
                      setCompleteFormOpen(false);
                      setDismissFormOpen(false);
                    }}
                  >
                    Issue target
                  </Button>
                  <Button
                    className="govuk-button--secondary govuk-!-margin-right-1"
                    onClick={() => {
                      setIssueTargetFormOpen(false);
                      setCompleteFormOpen(true);
                      setDismissFormOpen(false);
                    }}
                  >
                    Assessment complete
                  </Button>
                </>
              )}
              {(currentUserIsOwner || !assignee) && (
                <Button
                  className="govuk-button--warning"
                  onClick={() => {
                    setIssueTargetFormOpen(false);
                    setCompleteFormOpen(false);
                    setDismissFormOpen(true);
                  }}
                >
                  Dismiss
                </Button>
              )}
            </div>
          </div>

          <div className="govuk-grid-row">
            <div className="govuk-grid-column-two-thirds">
              {isCompleteFormOpen && (
                <TaskManagementForm
                  formName="assessmentComplete"
                  onCancel={() => setCompleteFormOpen(false)}
                  taskId={taskVersions[0].id}
                >
                  <TaskCompletedSuccessMessage message="Task has been completed" />
                </TaskManagementForm>
              )}
              {isDismissFormOpen && (
                <TaskManagementForm
                  formName="dismissTarget"
                  onCancel={() => setDismissFormOpen(false)}
                  taskId={taskVersions[0].id}
                >
                  <TaskCompletedSuccessMessage message="Task has been dismissed" />
                </TaskManagementForm>
              )}
              {isIssueTargetFormOpen && (
                <>
                  <div className="govuk-warning-text">
                    <span className="govuk-warning-text__icon" aria-hidden="true">!</span>
                    <strong className="govuk-warning-text__text">
                      <span className="govuk-warning-text__assistive">Warning</span>
                      Check the details before issuing target
                    </strong>
                  </div>
                  <TaskManagementForm
                    formName="targetInformationSheet"
                    onCancel={() => setIssueTargetFormOpen(false)}
                    taskId={taskVersions[0].id}
                    taskData={taskVersions[0].targetInformationSheet}
                  >
                    <TaskCompletedSuccessMessage message="Target created successfully" />
                  </TaskManagementForm>
                </>
              )}
              {!isCompleteFormOpen && !isDismissFormOpen && !isIssueTargetFormOpen && (
                <TaskVersions taskVersions={taskVersions} />
              )}
            </div>

            <div className="govuk-grid-column-one-third">
              {currentUserIsOwner && (
                <NotesForm
                  businessKey={taskVersions[0].taskSummary?.businessKey}
                  processInstanceId={taskVersions.find((task) => !!task.processInstanceId).processInstanceId}
                />
              )}

              <hr className="govuk-section-break govuk-section-break--m govuk-section-break--visible" />

              <h3 className="govuk-heading-m">Activity</h3>

              {activityLog.map((activity) => (
                <React.Fragment key={activity.date}>
                  <p className="govuk-body-s govuk-!-margin-bottom-2">
                    <span className="govuk-!-font-weight-bold">
                      {new Date(activity.date).toLocaleDateString()}
                    </span>
                    &nbsp;at <span className="govuk-!-font-weight-bold">{new Date(activity.date).toLocaleTimeString()}</span>
                    {activity.user && <>&nbsp;by <a href={`mailto:${activity.user}`}>{activity.user}</a></>}
                  </p>
                  <p className="govuk-body">{activity.note}</p>
                </React.Fragment>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default TaskDetailsPage;
