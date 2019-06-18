export function createStore(defaultState: object, render: Function, reducers: object) {
  return new Proxy(defaultState, {
  set(target, prop, value) {
    // Check the reducer is real
    if(Object.keys(reducers).indexOf(value.action) > -1){
      return reducers[value.action](target, prop, value).then(res => {
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
