import browser from './browser'
import Vuex from 'vuex'
import Vue from 'vue'

const createStore = () => {
    return new Vuex.Store({
        modules: {
            browser
        },
        state: {
            pageData: {},
            sidebarOpen: false,
            menuOpen: false,
            subscribeOpen: false,
            submitOpen: false
        },
        mutations: {
            SET_PAGE_DATA: (state, { key, data }) => {
                Vue.set(state.pageData, key, data)
            },
            REMOVE_PAGE_DATA: (state, key) => {
                Vue.delete(state.pageData, key)
            },
            OPEN_SIDEBAR: state => {
                state.sidebarOpen = true
            },
            CLOSE_SIDEBAR: state => {
                state.sidebarOpen = false
            },
            OPEN_MENU: state => {
                state.menuOpen = true
            },
            CLOSE_MENU: state => {
                state.menuOpen = false
            },
            OPEN_SUBSCRIBE: state => {
                state.subscribeOpen = true
            },
            CLOSE_SUBSCRIBE: state => {
                state.subscribeOpen = false
            },
            OPEN_SUBMIT: state => {
                state.submitOpen = true
            },
            CLOSE_SUBMIT: state => {
                state.submitOpen = false
            }
        },
        actions: {}
    })
}

export default createStore
