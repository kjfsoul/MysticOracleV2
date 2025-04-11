import React, { useState, useEffect } from 'react';
import { useAIOrchestrator } from '../hooks/useAIOrchestrator';
import { TaskProgress } from './TaskProgress';
import { ErrorBoundary } from './ErrorBoundary';

export const AITaskManager: React.FC<AITaskManagerProps> = ({ task, userContext }) => {
  const [status, setStatus] = useState<'idle' | 'processing' | 'complete' | 'error'>('idle');
  const [result, setResult] = useState<AIResponse | null>(null);
  const { processTask } = useAIOrchestrator();

  const handleTaskExecution = async () => {
    try {
      setStatus('processing');
      const response = await processTask(task, userContext);
      setResult(response);
      setStatus('complete');
    } catch (error) {
      setStatus('error');
      console.error('Task execution failed:', error);
    }
  };

  return (
    <ErrorBoundary>
      <div className="ai-task-manager">
        <TaskProgress status={status} />
        {result && <TaskResult result={result} />}
      </div>
    </ErrorBoundary>
  );
};