export function createStore(defaultState: object, render: Function, reducers: object) {
  return new Proxy(defaultState, {
    set(target, prop, action) {
      // Check the reducer is real
      if (Object.keys(reducers).indexOf(action.name) > -1) {
        return reducers[action.name](target, prop, action.value).then(res => {
          // This actually sets the props on the proxy object
          Reflect.set(target, prop, res[prop]);
          // Re-render the app
        }).then(() => {
          render();
          return true
        });
        ;
      } else {
        console.error('This is not a valid reducer, ya turkey 🦃')
        return false
      }
    }
  });
}
