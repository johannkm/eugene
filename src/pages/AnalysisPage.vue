<template>
  <div>

  <div class=" is-fluid">

    <balance :balance="$store.state.balance"></balance>

    <analytics :transactions="$store.state.transactions"></analytics>

    <transactions :transactions="$store.state.transactions"></transactions>

  </div>

  </div>
</template>

<script>
import Balance from '../components/Balance.vue'
import Transactions from '../components/Transactions.vue'
import Analytics from '../components/Analytics.vue'

export default {
  name: 'analysis-page',

  components: {
    Balance,
    Transactions,
    Analytics
  },
}
</script>

<style>
#app {

  /*
    font-family: 'Rubik', sans-serif;
    font-family: 'Baloo', cursive;
    font-family: 'Fredoka One', cursive;
    font-family: 'Gochi Hand', cursive;
    font-family: 'Just Another Hand', cursive;
    font-family: 'Short Stack', cursive;
  */

  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

</style>
