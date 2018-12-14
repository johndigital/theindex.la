import browser from './browser'
import Vuex from 'vuex'
import Vue from 'vue'

const createStore = () => {
    return new Vuex.Store({
        modules: {
            browser
        },
        state: {
            pageData: {}
        },
        mutations: {
            SET_PAGE_DATA: (state, { key, data }) => {
                Vue.set(state.pageData, key, data)
            },
            REMOVE_PAGE_DATA: (state, key) => {
                Vue.delete(state.pageData, key)
            }
        },
        actions: {}
    })
}

export default createStore
