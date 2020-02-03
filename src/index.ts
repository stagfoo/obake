export function createStore(defaultState: object, watchers: Array<Function>, reducers: object) {
  let proxyState;
  if(Object.keys(defaultState).indexOf('_update') > -1) {
    throw new Error("update is a reserved key (ﾉ⊙﹏⊙)ﾉ");
  }
  //Better update syntax
  defaultState['_update'] = (name, payload) => {
    proxyState._ = {
      name,
      value: payload
    };
  };
  return new Proxy(defaultState, {
    set(target, prop, action) {
      // Check the reducer is real
      if (Object.keys(reducers).indexOf(action.name) > -1) {
        return reducers[action.name](target, prop, action.value).then(res => {
          // This actually sets the props on the proxy object
          Reflect.set(target, prop, res[prop]);
          // Re-render the app
        }).then(() => {
          //render(target);
          Object.keys(watchers).map(key => watchers[func](target, prop, action.name));
          return true
        });
        ;
      } else {
        throw new Error("This is not a valid reducer, (ﾉ⊙﹏⊙)ﾉ");
      }
    }
  });
}

// Optional Reducer function
export function reducer(mutation){
  return function (state, value) {
    mutation(state, value)
    return new Promise(function(resolve, reject) {
      resolve(state);
    });
  }
}
