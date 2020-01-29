"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createStore(defaultState, render, reducers) {
    let proxyState;
    if (Object.keys(defaultState).indexOf('_update') > -1) {
        throw new Error("update is a reserved key (ﾉ⊙﹏⊙)ﾉ");
    }
    defaultState['_update'] = (name, payload) => {
        proxyState._ = {
            name,
            value: payload
        };
    };
    return new Proxy(defaultState, {
        set(target, prop, action) {
            if (Object.keys(reducers).indexOf(action.name) > -1) {
                return reducers[action.name](target, prop, action.value).then(res => {
                    Reflect.set(target, prop, res[prop]);
                }).then(() => {
                    render(target);
                    return true;
                });
                ;
            }
            else {
                throw new Error("This is not a valid reducer, (ﾉ⊙﹏⊙)ﾉ");
            }
        }
    });
}
exports.createStore = createStore;
function reducer(mutation) {
    return function (state, value) {
        mutation(state, value);
        return new Promise(function (resolve, reject) {
            resolve(state);
        });
    };
}
exports.reducer = reducer;
