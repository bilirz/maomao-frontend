import { createStore } from 'vuex'
import axios from 'axios';

export default createStore({
  state: {
    sessionData: null,
    // apiUrl: 'https://v.bilirz.com',
    apiUrl: 'http://localhost:5000'
  },
  mutations: {
    SET_SESSION_DATA(state, data) {
      state.sessionData = data;
    }
  },
  actions: {
    async fetchSessionData({ commit, state }) {
      try {
        const response = await axios.get(`${state.apiUrl}/api/user/session/get`);
        commit('SET_SESSION_DATA', response.data);
      } catch (error) {
        // handle error
        console.error('获取会话数据出错：', error);
      }
    },
  },
  modules: {
  }
})
