// 手写vuex的dispatch提供的subscribeAction功能
// 类似AOP编程思想
const Vuex = {
    _state: {},
    _actions: {},
    _actionSubscribers: [],
    createStore({state, actions}) {
        this._state = state();
        this._actions = actions;
        return this;
    },
    subscribeAction(subscriber) {
        this._actionSubscribers.push(subscriber);
    },
    dispatch(actions) {
        for (let subscriber of this._actionSubscribers) {
            subscriber.before(actions, this._state);
        }
        const {type} = actions;
        let fn = this._actions[type];
        if (fn.then === undefined) {
            fn = Promise.resolve(fn(this._state));
        }
        fn.then(res => {
            for (let subscriber of this._actionSubscribers) {
                subscriber.after(actions, this._state);
            }
        });
    }
}


const store = Vuex.createStore({
    state() {
        return {
            id: "rootStore",
            count: 0
        }
    },
    actions: {
        increment(state) {
            console.warn("actions increment触发");
            state.count++
        }
    },
})

store.subscribeAction({
    before: (action, state) => {
        console.log(`before1 action ${action.type}`)
    },
    after: (action, state) => {
        console.log(`after1 action ${action.type}`)
    }
});

store.subscribeAction({
    before: (action, state) => {
        console.log(`before2 action ${action.type}`)
    },
    after: (action, state) => {
        console.log(`after2 action ${action.type}`)
    }
});

store.dispatch({type: "increment"});