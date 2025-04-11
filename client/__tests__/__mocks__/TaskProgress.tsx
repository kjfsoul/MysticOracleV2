import React from 'react';
import { render, screen } from '@testing-library/react';
import { progress } from 'framer-motion';
import { data } from 'react-router-dom';

export const TaskProgress: React.FC<{ progress: number }> = ({ progress }) => (
  <div data-testid="mock-task-progress">{progress}%</div>
);

describe('TaskProgress Mock', () => {
  test('renders progress value', () => {
    render(<TaskProgress progress={50} />);
    expect(screen.getByTestId('mock-task-progress')).toHaveTextContent('50%');
  });

  test('accepts different progress values', () => {
    render(<TaskProgress progress={75} />);
    expect(screen.getByTestId('mock-task-progress')).toHaveTextContent('75%');
  });
});
