import React from 'react';
import { render, screen } from '@testing-library/react';
import Checkboxes from '../Checkboxes';

test('renders the component', () => {
  render(
    <Checkboxes
      legend="Test legend"
      hint="Test hint"
      errorMessage="Test error"
      items={[
        { label: 'Box A', value: 'a' },
        { label: 'Box B', value: 'b' },
      ]}
      id="testId"
    />,
  );
  expect(screen.getByText('Test hint')).toBeInTheDocument();
  expect(screen.getByText('Test legend')).toBeInTheDocument();
  expect(screen.getByText('Test error')).toBeInTheDocument();
  expect(screen.getByLabelText('Box A')).toBeInTheDocument();
  expect(screen.getByLabelText('Box B')).toBeInTheDocument();
});

test('renders conditional elements', () => {
  render(
    <Checkboxes
      items={[
        { label: 'Box A', value: 'a' },
        { label: 'Box B', value: 'b', conditional: 'Test conditional' },
      ]}
      defaultValue="b"
      id="testId"
    />,
  );
  expect(screen.getByText('Test conditional')).toBeInTheDocument();
});
