var socketAd = "https://eugenesocket.localtunnel.me"
var serverAd = "http://eugene-server.ngrok.io/"

import Vue from 'vue'
import Vuex from 'vuex'

import axios from 'axios'
var io = require('socket.io-client')
var socket = io.connect(socketAd)

Vue.use(Vuex)

// root state object.
// each Vuex instance is just a single state tree.
const state = {
  balance: '',
  transactions: [],
}

socket.on('receiveMoney', function(data){
    state.balance = data.value
    state.transactions = data.transactions
  })

// actions are functions that causes side effects and can involve
// asynchronous operations.
const actions = {
  postTransaction (context, {amount, message}){
    axios.get(serverAd+'/transfer',{
      params: {
        amount,
        message
      }})
      .then(function(response){
        console.log(response)
      })
      .catch(function (error) {
        console.log(error);
      });
  },
}

// A Vuex instance is created by combining the state, mutations, actions,
// and getters.
export default new Vuex.Store({
  state,
  actions
})
