// Types
interface Action {
  type: string;
  payload: unknown;
}

interface Store<T extends object> {
  getState: () => T;
  dispatch: (action: Action) => Promise<void>;
  subscribe: (watcher: (state: T) => void) => () => void;
}

type Reducer<T> = (state: T, action: Action) => Promise<T>;

interface Reducers<T> {
  [key: string]: Reducer<T>;
}

// Error classes for better error handling
class ReducerError extends Error {
  constructor(type: string) {
    super(`[${type}] is not a valid reducer`);
    this.name = 'ReducerError';
  }
}

class StoreError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StoreError';
  }
}

/**
 * Creates a store with state management capabilities
 * @param initialState Initial state object
 * @param reducers Object containing reducer functions
 * @returns Store object with dispatch and subscription capabilities
 */
export function createStore<T extends object>(
  initialState: T,
  reducers: Reducers<T>
): Store<T> {
  // Validate inputs
  if (!initialState || typeof initialState !== 'object') {
    throw new StoreError('Initial state must be an object');
  }

  if (!reducers || typeof reducers !== 'object') {
    throw new StoreError('Reducers must be an object');
  }

  let currentState = { ...initialState };
  const subscribers = new Set<(state: T) => void>();

  const notifySubscribers = (state: T): void => {
    subscribers.forEach(subscriber => subscriber(state));
  };

  return {
    getState: () => ({ ...currentState }),

    dispatch: async (action: Action): Promise<void> => {
      if (!action.type) {
        throw new StoreError('Action must have a type');
      }

      const reducer = reducers[action.type];
      if (!reducer) {
        throw new ReducerError(action.type);
      }

      try {
        const newState = await reducer(currentState, action);
        currentState = newState;
        notifySubscribers(currentState);
      } catch (error) {
        console.error(`Error in reducer ${action.type}:`, error);
        throw error;
      }
    },

    subscribe: (watcher: (state: T) => void): (() => void) => {
      subscribers.add(watcher);
      return () => {
        subscribers.delete(watcher);
      };
    }
  };
}

/**
 * Creates a reducer function that wraps a synchronous state mutation
 * @param mutation Function that modifies state
 * @returns Promise-based reducer function
 */
export function reducer<T>(
  mutation: (state: T, payload: unknown) => void
): Reducer<T> {
  return async (state: T, action: Action): Promise<T> => {
    const newState = { ...state };
    try {
      mutation(newState, action.payload);
      return newState;
    } catch (error) {
      console.error('Error in mutation:', error);
      throw error;
    }
  };
}
