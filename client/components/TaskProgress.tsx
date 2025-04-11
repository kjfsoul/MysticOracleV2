import React from 'react';

interface TaskProgressProps {
  progress: number;
}

export const TaskProgress: React.FC<TaskProgressProps> = ({ progress }) => {
  return (
    <div className="task-progress">
      <div className="progress-bar" style={{ width: `${progress}%` }}>
        {progress}%
      </div>
    </div>
  );
};