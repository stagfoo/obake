"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createStore(defaultState, render, reducers) {
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
                console.error('This is not a valid reducer, ya turkey 🦃');
                return false;
            }
        }
    });
}
exports.createStore = createStore;
