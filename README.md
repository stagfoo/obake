# obake (ﾉ⊙﹏⊙)ﾉ
Statement management with proxies and promise...in a spooky way

Demo: https://obake.glitch.me/

## Getting started

```js
// the defaultState is the state you want to proxy
const defaultState = {
 greeting: 'BoOOOoo!'
}
const render = () => {
  //re-render your app like react, vue, lit, morphdom
}
const reducers {
  CHANGE_GREETING: (state, propName, value) => {
    //Do something to the state
    state.greeting = value;
    return new Promise(function(resolve, reject) { resolve(state) });
  }
}
const state = createStore(defaultState, render, reducers);

function changeGreeting(){
  state._update('CHANGE_GREETING', "HelloooOOOoo")
}

```
as you can see however it takes an reducer name which must be registered in the reducers,
this way you can't just mutate the object willy nilly.

and there you go;
you have reducers, you have a safe way to mutate it your store.

*Optional* function `reducer` to make your reducers easier to read and keep the return consistent

```js

const reducers {
  CHANGE_GREETING: reducer((state, value) => {
        state.greeting = value;
    })
  }
}
```


