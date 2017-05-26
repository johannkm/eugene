<template>
  <div id="app">
    <div class="has-text-centered">

      <div class="gradient" style="margin-bottom:0.6em">
        <div class="tile is-ancestor">
          <div class="tile is-parent">
            <article class="tile is-child">
            	<h6 class="subtitle is-6" style="color:#fff; margin-top: 1em">Current Balance</h6>
            	<h4 class="title is-4" style="color:#fff"><b>${{ $store.state.balance }}</b></h4>
            </article>
          </div>
        </div>
      </div>

      <br>

      <form v-on:submit.prevent="postTransaction">

        <div class="field has-addons">


          <p class="control">
            <input name="amount" class="input" type="number" placeholder="Amount" v-model="transactionForm.balance" required :disabled="waiting">
          </p>

          <p class="control">
            <span class="select">
              <select v-model="reasonSelect">
                <option>Allowance</option>
                <option>Raking leaves</option>
                <option>Taking out trash</option>
                <option>Investing</option>
                <option>Other</option>
              </select>
            </span>
          </p>

          <p class="control">
            <input class="button is-primary" type="submit" value="Send" :disabled="waiting">
          </p>
        </div>

        <transition name="component-fade" mode="out-in">
          <div class="field" v-if="reasonSelect=='Other'">
            <p class="control">
              <textarea name="message" class="textarea" placeholder="Message" v-model="transactionForm.message" :disabled="waiting"></textarea>
            </p>
          </div>
        </transition>

      </form>

      <br>
      <a href="/#/analysis">
        <span class="tag is-medium">
          <strong >Analyze</strong>
        </span>
      </a>
      <br><br>
      <p style="background-color: #734b6d; color: white"><small>Recent Transactions</small></p>

      <table class="table is-narrow is-striped">
        <tbody>
          <tr v-for="transaction in $store.state.transactions">
            <td style="color: #757575">
              <strong v-if="transaction.value > 0" style="color: #00D1B2">${{ transaction.value }}.00</strong>
              <strong v-if="transaction.value <= 0" style="color: red">${{ transaction.value }}.00</strong>
                <br>
              <small>{{ getDateString(transaction.date) }}</small>
            </td>

            <td>{{ transaction.message }}</td>
          </tr>
        </tbody>
      </table>

    </div>
  </div>
</template>

<script>
import axios from 'axios'



export default {
  name: 'parent-page',
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
    },
    getDateString: function (dateS) {
      var months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December']
      var d = new Date(dateS)
      console.log(dateS)
      return (d.getHours() + ':' + d.getMinutes() + ' ' + months[d.getMonth()] + ', ' + d.getDay() + ' ')
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


<style scoped>

.gradient{
	background-color: #42275a;
  background-image: linear-gradient(#42275a, #734b6d);
  background: linear-gradient(#42275a, #734b6d);
}

</style>
