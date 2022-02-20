
type Update = (_name: string, payload: unknown) => void

interface ProxiedObject {
  [k:string | symbol]: any,
  _update?: Update
  _?: { name:string, value:unknown }
}

type MutationFunction = (state: ProxiedObject, value: unknown) => void;
type Reducer = (state: ProxiedObject, value: unknown) => Promise<ProxiedObject>;
type Watcher = (state: ProxiedObject) => void;

type Watchers = {
  [k:string]: Watcher
}
type Reducers = {
  [k:string]: Reducer
}

export function createStore(defaultState: ProxiedObject, watchers: Watchers, reducers: Reducers) {
  let proxyState: ProxiedObject;
  defaultState._update = (name, payload) => {
    proxyState._ = {
      name,
      value: payload,
    };
  };

  proxyState = new Proxy(defaultState, {
    // TODO: internal type isn't accurate I think
    set(target, prop, action): any {
      // Check the reducer is real
      if (Object.keys(reducers).indexOf(action.name) > -1) {
        return reducers[action.name](target, action.value)
          .then((state: ProxiedObject) => {
            // This actually sets the props on the proxy object
            Reflect.set(target, prop, state[prop]);
            // Render the newState
            Object.keys(watchers).map(key => watchers[key](target));
            return true;
            // Re-render the app
          });
      }

      throw new Error('This is not a valid reducer, (ﾉ⊙﹏⊙)ﾉ');
    },
  });
  return proxyState;
}

// Optional Reducer function
export function reducer(mutation: MutationFunction): Reducer {
  return function (state: ProxiedObject, value: unknown) {
    mutation(state, value);
    return new Promise(resolve => {
      resolve(state);
    });
  };
}
