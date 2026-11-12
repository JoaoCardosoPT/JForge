import { useEffect, useState } from 'react';
import './Endpoints.css';

export default function Endpoints() {
  const [health, setHealth] = useState({
    message: 'Checking backend...',
    statusCode: null,
    state: 'checking',
  });

  // A side effect to check the backend health when the component mounts
  useEffect(() => {
    const controller = new AbortController();

    async function checkHealth() {
      let statusCode = null;

      try {
        const response = await fetch('/api/health', {
          signal: controller.signal,
        });
        statusCode = response.status;

        if (!response.ok) {
          throw new Error(response.statusText || 'HTTP request failed');
        }

        const data = await response.json();

        if (data.status !== 'OK') {
          throw new Error('Unexpected health response');
        }

        if (!controller.signal.aborted) {
          setHealth({ message: 'OK', statusCode, state: 'ok' });
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setHealth({
            message: `Error: ${error.message}`,
            statusCode,
            state: 'error',
          });
        }
      }
    }

    checkHealth();

    return () => controller.abort();
  }, []);

  return (
    <div className={`health-status health-status--${health.state}`} role="status">
      <span className="health-status__message">{health.message}</span>
      <span className="health-status__code">{health.statusCode ?? '—'}</span>
    </div>
  );
}
