<p align="center"><img width="300px" src="docs/github-logo.png" />
</p>
<p align="center">Statement management with proxies and promise...in a spooky way</p>
<hr>
<p align="center">
<a href="https://opensource.org/licenses/MIT">
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" />
</a>
</p>

---

# Why make this?

- I found objects in javascript and that have mutation listeners
- they allow for valuation |･д･)ﾉ	
- promise so no race conditions!  ٩(ˊ〇ˋ*)و	

## Getting started

```js
// the defaultState is the state you want to proxy

import { reducer } from 'obake.js';

export const defaultState = {
  greeting: '🍖🍖🍖🍖',
  currentPage: { name: 'HOME', activePage: "/" },
  notification: {
    text: "",
    show: false
  }
 }

 export const routes = {
    'Home': '/',
    'Example Fetch': '/example-fetch',
 }

 export const activePage = {
   "HOME": "/",
   "EXAMPLE_FETCH": "/example-fetch"
 }
export const reducers = {
  updateCurrentPage: reducer((state, value: string) => {
    state.currentPage = { name: value, activePage:activePage[value]  };
  }),
  updateGreeting: reducer((state, value: string) => {
    state.greeting = value;
  }),
  updateNotification: reducer((state, value:{text: string, show: boolean}) => {
    state.notification = value;
  }),
}

```
as you can see however it takes an reducer name which must be registered in the reducers,
this way you can't just mutate the object willy nilly.

there you go; you have reducers, you have a safe way to mutate it your store.

*Optional* function `reducer` to make your reducers easier to read and keep the return consistent but its optional

## Demo
https://obake.glitch.me/