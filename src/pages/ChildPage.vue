<template>
  <div id="app">
    <div class="container has-text-centered">

      <p>You have:</p>
      <p class="title is-1 balance"><strong>${{$store.state.balance}}</strong></p>

      <a href="/#/seeds">
        <span class="tag is-large is-primary">
          <strong style="color:white">Plant seeds</strong>
        </span>
      </a>

      <table v-if="$store.state.transactions.length>0" class="table is-bordered is-striped" style="margin-top:2em">
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



export default {
  name: 'child-page',
  data () {
    return {
      balance: '',
      transactionForm: {
        balance: '',
        message: ''
      },
      transactions: [],
      messageExpanded: false,
      waiting: false,
      reasonSelect: 'Allowance'
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
        var message = this.reasonSelect!='Other' ? this.reasonSelect : this.transactionForm.message
        console.log('posting ' + amount + ' ' + message)
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
