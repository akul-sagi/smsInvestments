import { Component, type ErrorInfo, type ReactNode } from 'react';

type Props = { children: ReactNode };
type State = { hasError: boolean };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  private handleRetry = (): void => {
    this.setState({ hasError: false });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="error-fallback" role="alert">
          <h1 className="error-fallback-title">Something went wrong</h1>
          <p className="error-fallback-copy">
            Please refresh the page. If the problem continues, contact the site owner.
          </p>
          <button type="button" className="primary-action" onClick={this.handleRetry}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
