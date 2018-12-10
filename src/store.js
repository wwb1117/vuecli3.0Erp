
import Vue from 'vue'
import Vuex from 'vuex'
import home from './store/modules/home'
import purchase from './store/modules/purchase'
import depot from './store/modules/depot'

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        home,
        purchase,
        depot
    }
})

export default store
