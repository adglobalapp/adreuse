import { Component, type ErrorInfo, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
  /** Ha megváltozik (pl. útvonal), a hibaállapot törlődik. */
  resetKey?: string;
  message?: string;
  reloadLabel?: string;
};

type State = { error: Error | null };

/**
 * Összeomlás esetén fekete képernyő helyett hibaüzenet + újratöltés gomb.
 * A hiba szövege kicsiben látszik, hogy jelezni lehessen, mi történt.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info.componentStack);
  }

  componentDidUpdate(prev: Props) {
    if (this.state.error && prev.resetKey !== this.props.resetKey) this.setState({ error: null });
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;
    return (
      <div className="container page" role="alert">
        <p className="notice notice--error">{this.props.message ?? 'Something went wrong.'}</p>
        <p>
          <button type="button" className="btn btn--primary" onClick={() => window.location.reload()}>
            {this.props.reloadLabel ?? 'Reload'}
          </button>
        </p>
        <p>
          <small className="text-muted">{String(error.message || error)}</small>
        </p>
      </div>
    );
  }
}
