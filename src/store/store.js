var serverAd = "http://localhost:5000"

import Vue from 'vue'
import Vuex from 'vuex'

import axios from 'axios'

Vue.use(Vuex)

// root state object.
// each Vuex instance is just a single state tree.
const state = {
  balance: '',
  transactions: [],
}

var getTransactions = function(){
  axios.get(serverAd+'/payments')
    .then(function(data){
      state.balance = data.data.value
      state.transactions = data.data.transactions
    })
    .catch(function(error){
      console.log(error)
    })
}

getTransactions()
setInterval(function(){
    getTransactions()
  }, (10 * 1000))

// actions are functions that causes side effects and can involve
// asynchronous operations.
const actions = {
  postTransaction (context, {amount, message}){
    axios.post(serverAd+'/transfer',{
        amount,
        message
      })
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
