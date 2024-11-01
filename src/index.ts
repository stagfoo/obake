import { produce, Draft } from 'immer';

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

type ImmerReducer<T> = (draft: Draft<T>, payload: unknown) => void;

interface Reducers<T> {
  [key: string]: ImmerReducer<T>;
}

// Error classes
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
 * Creates a store with Immer-based state management
 * @param initialState Initial state object
 * @param reducers Object containing Immer reducer functions
 * @returns Store object with dispatch and subscription capabilities
 */
export function createStore<T extends object>(
  initialState: T,
  reducers: Reducers<T>
): Store<T> {
  if (!initialState || typeof initialState !== 'object') {
    throw new StoreError('Initial state must be an object');
  }

  if (!reducers || typeof reducers !== 'object') {
    throw new StoreError('Reducers must be an object');
  }

  let currentState = initialState;
  const subscribers = new Set<(state: T) => void>();

  const notifySubscribers = (state: T): void => {
    subscribers.forEach(subscriber => subscriber(state));
  };

  return {
    getState: () => currentState,

    dispatch: async (action: Action): Promise<void> => {
      if (!action.type) {
        throw new StoreError('Action must have a type');
      }

      const reducer = reducers[action.type];
      if (!reducer) {
        throw new ReducerError(action.type);
      }

      try {
        currentState = produce(currentState, draft => {
          reducer(draft, action.payload);
        });
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



// Example usage with TypeScript:
/*
interface TodoState {
  todos: Array<{
    id: number;
    text: string;
    completed: boolean;
  }>;
}

const todoReducers: Reducers<TodoState> = {
  ADD_TODO: (draft, payload: string) => {
    draft.todos.push({
      id: Date.now(),
      text: payload,
      completed: false
    });
  },
  TOGGLE_TODO: (draft, payload: number) => {
    const todo = draft.todos.find(t => t.id === payload);
    if (todo) {
      todo.completed = !todo.completed;
    }
  },
  DELETE_TODO: (draft, payload: number) => {
    const index = draft.todos.findIndex(t => t.id === payload);
    if (index !== -1) {
      draft.todos.splice(index, 1);
    }
  }
};

const store = createStoreWithMiddleware<TodoState>(
  { todos: [] },
  todoReducers,
  [logger]
);

// Usage:
await store.dispatch({ type: 'ADD_TODO', payload: 'Learn Immer' });
*/
