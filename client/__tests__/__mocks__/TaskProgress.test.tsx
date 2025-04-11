import React from 'react';
import { render } from '@testing-library/react';
import { TaskProgress } from './TaskProgress';

describe('TaskProgress', () => {
  test('renders progress value', () => {
    const { getByTestId } = render(<TaskProgress progress={50} />);
    expect(getByTestId('mock-task-progress')).toHaveTextContent('50%');
  });
});