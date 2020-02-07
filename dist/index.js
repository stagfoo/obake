"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createStore(defaultState, watchers, reducers) {
    let proxyState;
    defaultState['_update'] = (name, payload) => {
        proxyState._ = {
            name,
            value: payload
        };
    };
    proxyState = new Proxy(defaultState, {
        set(target, prop, action) {
            if (Object.keys(reducers).indexOf(action.name) > -1) {
                return reducers[action.name](target, action.value)
                    .then(res => {
                    Reflect.set(target, prop, res[prop]);
                })
                    .then(() => {
                    Object.keys(watchers).map(key => watchers[key](target));
                    return true;
                });
            }
            else {
                throw new Error("This is not a valid reducer, (ﾉ⊙﹏⊙)ﾉ");
                return false;
            }
        }
    });
    return proxyState;
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
