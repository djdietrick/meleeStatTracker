import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '',
    player: {},
    status: ''
  },
  getters: {
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status,
    playerId: state => {
      if(!!state.player) {
        return state.player._id;
      }
      return undefined;
    }
  },
  mutations: {
    auth_request(state){
      state.status = 'loading';
    },
    auth_success(state, payload){
      state.status = 'success';
      state.token = payload.token;
      state.player = payload.player;
    },
    auth_error(state){
      state.status = 'error';
    },
    logout(state){
      state.status = '';
      state.token = '';
      state.player = {};
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
          //localStorage.setItem('token', token);
          axios.defaults.headers.common['Authorization'] = token;
          commit('auth_success', {token, player});
          console.log("Successfully logged in player:", player);
          resolve(resp);
        }).catch(err => {
          commit('auth_error')
          console.log("Error logging in player:", err);
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
          //localStorage.setItem('token', token);
          axios.defaults.headers.common['Authorization'] = token;
          commit('auth_success', token, player);
          console.log("Response:", resp);
          console.log("Successfully registered player:", player);
          resolve(resp);
        }).catch(err => {
          commit('auth_error')
          localStorage.removeItem('vuex')
          reject(err)
        })
      })
    },
    logout({commit}){
      return new Promise((resolve, reject) => {
        axios.defaults.headers.common['Authorization'] = this.state.token;
        axios({
          url: 'http://localhost:3000/player/logout',
          data: this.state.player,
          method: 'POST'
        }).then(resp => {      
          commit('logout');
          //localStorage.removeItem('vuex');
          delete axios.defaults.headers.common['Authorization'];
          console.log("Successfully logged out on client side");
          resolve(resp);
        }).catch(err => {
          commit('auth_error')
          console.log(err);
          reject(err);
        })
      })
    }
  },
  plugins: [createPersistedState()]
})

// createPersistedState({
//   storage: {
//     getItem: key => Cookies.getJSON(key),
//     setItem: (key, value) => Cookies.set(key, value, {expires: 3, secure:true}),
//     removeItem: key => Cookies.remove(key)
//   }
// })