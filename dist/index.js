"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reducer = exports.createStore = void 0;
function createStore(defaultState, watchers, reducers) {
    let proxyState;
    defaultState._update = (name, payload) => {
        proxyState._ = {
            name,
            value: payload,
        };
    };
    proxyState = new Proxy(defaultState, {
        set(target, prop, action) {
            if (Object.keys(reducers).indexOf(action.name) > -1) {
                return reducers[action.name](target, action.value)
                    .then((state) => {
                    Reflect.set(target, prop, state[prop]);
                    Object.keys(watchers).map(key => watchers[key](target));
                    return true;
                });
            }
            throw new Error(`[${action.name}] is not a valid reducer, (ﾉ⊙﹏⊙)ﾉ`);
        },
    });
    return proxyState;
}
exports.createStore = createStore;
function reducer(mutation) {
    return function (state, value) {
        mutation(state, value);
        return new Promise(resolve => {
            resolve(state);
        });
    };
}
exports.reducer = reducer;
