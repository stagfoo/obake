"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createStore(defaultState, render, reducers) {
    return new Proxy(defaultState, {
        set(target, prop, value) {
            if (Object.keys(reducers).indexOf(value.action) > -1) {
                return reducers[value.action](target, prop, value).then(res => {
                    Reflect.set(target, prop, res[prop]);
                }).then(() => {
                    render();
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
