import React, { Component, FC, ReactNode } from 'react';
import { ApiError } from '../../api';
import styles from './withErrorBoundary.module.scss';

type ErrorBoundaryState = { error?: ApiError };

// eslint-disable-next-line @typescript-eslint/ban-types
export function withErrorBoundary<P extends {}>(
  WrappedComponent: FC<P>,
  renderError: (error: ApiError) => ReactNode
): FC<P> {
  class ErrorBoundary extends Component<P, ErrorBoundaryState> {
    state = {} as ErrorBoundaryState;

    static getDerivedStateFromError(error: ApiError): ErrorBoundaryState {
      return { error };
    }

    render(): ReactNode {
      if (this.state.error) {
        return (
          <span data-name="message" className={styles.error}>
            {renderError(this.state.error)}
          </span>
        );
      }

      return <WrappedComponent {...this.props} />;
    }
  }

  return (ErrorBoundary as unknown) as FC<P>;
}
