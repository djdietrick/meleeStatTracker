import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    player: {},
    tokens: localStorage.getItem('token') || '',
    status: ''
  },
  getters: {
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status,
    playerId: state => state.player.playerId
  },
  mutations: {
    auth_request(state){
      state.status = 'loading';
    },
    auth_success(state, token, player){
      state.status = 'success';
      state.token = token;
      state.player = player;
    },
    auth_error(state){
      state.status = 'error';
    },
    logout(state){
      state.status = '';
      state.token = '';
    }
  },
  actions: {
    login({commit}, player) {
      return new Promise((resolve, reject) => {
        commit('auth_request');
        axios({
          url: 'http://localhost:3000/player/login',
          data: player,
          method: 'POST'
        }).then(resp => {
          const token = resp.data.token;
          const player  = resp.data.player;
          localStorage.setItem('token', token);
          axios.defaults.headers.common['Authorization'] = token;
          commit('auth_success', token, player);
          resolve(resp);
        }).catch(err => {
          commit('auth_error')
          localStorage.removeItem('token')
          reject(err)
        })
      });
    },
    register({commit}, player) {
      return new Promise((resolve, reject) => {
        commit('auth_request');
        axios({
          url: 'http://localhost:3000/player/register',
          data: player,
          method: 'POST'
        }).then(resp => {
          const token = resp.data.token;
          const player  = resp.data.player;
          localStorage.setItem('token', token);
          axios.defaults.headers.common['Authorization'] = token;
          commit('auth_success', token, player);
          resolve(resp);
        }).catch(err => {
          commit('auth_error')
          localStorage.removeItem('token')
          reject(err)
        })
      })
    },
    logout({commit}){
      return new Promise((resolve, reject) => {
        axios({
          url: 'http://localhost:3000/player/logout',
          data: player,
          method: 'POST'
        }).then(() => {      
          commit('logout')
          localStorage.removeItem('token')
          delete axios.defaults.headers.common['Authorization']
          resolve()
        }).catch(err => {
          commit('auth_error')
          reject(err)
        })

      })
    }
  }
})
