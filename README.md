# obake (ﾉ⊙﹏⊙)ﾉ
exploring statement management with proxies and promise...in a spooky way

## Getting started

```js
// the defaultState is the state you want to proxy
const defaultState = {
 greeting: 'BoOOOoo!'
}
const render = () => {
  //re-render your app like react, vue or lit
}
const reducers {
  CHANGE_GREETING: (state, propName, value) => {
    //Do something to the state
    state.greeting = value;
    return new Promise(function(resolve, reject) { resolve(state) });
  }
}
const state = createStore(defaultState, render, reducers);

```
Because its a proxy it means you set it like a normal object when you want to change the state

```js

state.greeting = {
  name: 'CHANGE_GREETING',
  value: 'HelloooOOOoo!'
}

```
as you can see however it takes an reducer name which must be registered in the reducers,
this way you can just mutate the object willy nilly.

and there you go;
you have reducers, you have immutable state and you have a safe way to mutate it.
