import React from 'react';
import Tabs from '../govuk/Tabs';
import tasks from './__fixtures__/tasks';

const TaskListPage = () => {
  return (
    <>
      <h1 className="govuk-heading-xl">Task management</h1>

      <Tabs
        title="Title"
        id="tasks"
        items={[
          {
            id: 'new',
            label: 'New',
            panel: tasks.map((task) => <p className="govuk-body" key={task.title}>{task.title}</p>),
          },
          { id: 'in-progress', label: 'In progress', panel: <p className="govuk-body">No tasks available</p> },
          { id: 'paused', label: 'Paused', panel: <p className="govuk-body">No tasks available</p> },
          { id: 'complete', label: 'Complete', panel: <p className="govuk-body">No tasks available</p> },
        ]}
      />
    </>
  );
};

export default TaskListPage;