import { useEffect, useState, type DependencyList } from 'react';

type State<T> = { data: T | null; error: unknown; loading: boolean };

/** Betölti a `load` eredményét, és újratölti, ha a függőségek változnak. */
export function useAsync<T>(load: () => Promise<T>, deps: DependencyList) {
  const [state, setState] = useState<State<T>>({ data: null, error: null, loading: true });

  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));
    load().then(
      (data) => !cancelled && setState({ data, error: null, loading: false }),
      (error) => !cancelled && setState({ data: null, error, loading: false }),
    );
    return () => {
      cancelled = true;
    };
  }, deps);

  return { ...state, setData: (data: T) => setState({ data, error: null, loading: false }) };
}
