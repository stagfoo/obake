export function createStore(defaultState: object, watchers: object, reducers: object) {
  let proxyState;
  defaultState['_update'] = (name, payload) => {
    proxyState._ = {
      name,
      value: payload
    };
  };
  proxyState = new Proxy(defaultState, {
    set(target, prop, action) {
      // Check the reducer is real
      if (Object.keys(reducers).indexOf(action.name) > -1) {
        return reducers[action.name](target, action.value)
          .then(res => {
            // This actually sets the props on the proxy object
            Reflect.set(target, prop, res[prop]);
            // Re-render the app
          })
          .then(() => {
            //render the newState
            Object.keys(watchers).map(key => watchers[key](target))
            return true;
          });
      } else {
        throw new Error("This is not a valid reducer, (ﾉ⊙﹏⊙)ﾉ");
        return false;
      }
    }
  });
  return proxyState;
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
