import { useEffect, useState } from 'react';
import { sleep } from '../../utils/core/sleep';

export function useAsyncState<Data>(
  promise: Promise<Data> | ((...args: any[]) => Promise<Data>),
  initialState: Data,
  Option: UseAsyncStateOptions,
) {
  const {
    immediate = true,
    delay = 0,
    onError = () => {},
    resetOnExecute = true,
    throwError = false,
  } = Option;
  const [state, setState] = useState(initialState);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown | undefined>(undefined);

  const execute = async (...args: any[]) => {
    if (resetOnExecute) {
      setState(initialState);
      setIsReady(false);
      setIsLoading(true);
      setError(undefined);
    }
    if (delay > 0) {
      await sleep(delay);
    }
    const _promise = typeof promise === 'function' ? await promise(...args) : promise;
    try {
      const data = await _promise;
      setState(data);
      setIsReady(true);
    } catch (err) {
      onError(err);
      setError(err);
      if (throwError) {
        throw err;
      }
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, []);
  return {
    execute,
    isLoading,
    isReady,
    error,
    state,
    setState,
  };
}
export interface UseAsyncStateOptions {
  /**
   * Delay for executing the promise. In milliseconds.
   *
   * @default 0
   */
  delay?: number;
  /**
   * Execute the promise right after the function is invoked.
   * Will apply the delay if any.
   *
   * When set to false, you will need to execute it manually.
   *
   * @default true
   */
  immediate?: boolean;
  /**
   * Callback when error is caught.
   */
  onError?: (e: unknown) => void;
  /**
   * Sets the state to initialState before executing the promise.
   *
   * This can be useful when calling the execute function more than once (for
   * example, to refresh data). When set to false, the current state remains
   * unchanged until the promise resolves.
   *
   * @default true
   */
  resetOnExecute?: boolean;
  /**
   *
   * An error is thrown when executing the execute function
   *
   * @default false
   */
  throwError?: boolean;
}
