<template>
  <div id="app">
    <div class="container has-text-centered">

      <p>Your child has:</p>
      <p class="title is-1 balance"><strong>${{$store.state.balance}}</strong></p>

      <form v-on:submit.prevent="postTransaction">

        <div class="field has-addons">
          <p class="control is-expanded">
            <input name="amount" class="input" type="number" placeholder="Amount" v-model="transactionForm.balance" required :disabled="waiting">
          </p>
          <p class="control">
            <input class="button is-primary" type="submit" value="Send" :disabled="waiting">
          </p>
        </div>

        <transition name="component-fade" mode="out-in">
          <div class="field" v-if="messageExpanded">
            <p class="control">
              <textarea name="message" class="textarea" placeholder="Message" v-model="transactionForm.message" :disabled="waiting"></textarea>
            </p>
          </div>
          <a v-else @click="messageExpanded=true" :disabled="waiting"><small>Add message</small></a>
        </transition>

      </form>



      <table class="table is-bordered is-striped" style="margin-top:2em">
        <thead>
          <tr>
            <td><b>Amount</b></td>
            <td><b>Message</b></td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in $store.state.transactions">
            <td v-if="row.value>0">${{row.value}}</td>
            <td v-else style="color:red">-${{-row.value}}</td>
            <td>{{row.message}}</td>
          </tr>
        </tbody>
      </table>

    </div>
  </div>
</template>

<script>
import axios from 'axios'
var io = require('socket.io-client')
var socket = io.connect('http://d4a3ebcd.ngrok.io')



export default {
  name: 'main-page',
  data () {
    return {
      balance: '',
      transactionForm: {
        balance: '',
        message: ''
      },
      transactions: [],
      messageExpanded: false,
      waiting: false
    }
  },
  methods: {
    postTransaction: function(){
      var vm = this
      if(this.validateBalance()){
        console.log('here')
        vm.waiting = true
        setTimeout(function(){
          vm.waiting = false
          vm.reset()
        }, 500)
        var amount = this.transactionForm.balance
        var message = this.transactionForm.message
        console.log('posting ' + this.transactionForm.balance + ' ' + this.transactionForm.message)
        this.$store.dispatch('postTransaction', {amount:amount, message:message});
        this.reset()
      } else{
        alert('Please enter an amount')
      }
    },
    validateBalance: function(){
      if(this.transactionForm.balance==''){ return false }
      if(isNaN(this.transactionForm.balance)){ return false }
      if(this.transactionForm.balance<=0){ return false }
      return true
    },
    reset: function(){
      this.transactionForm.balance = ''
      this.transactionForm.message = ''
      this.messageExpanded = false
    }
  }
}
</script>


<style>

div.container {
  padding: 8px;
}

.component-fade-enter-active, .component-fade-leave-active {
  transition: opacity .1s ease;
}
.component-fade-enter, .component-fade-leave-to
/* .component-fade-leave-active for <2.1.8 */ {
  opacity: 0;
}

:disabled {
    background-color: #000
}
</style>
