<template>
  <div>
  <hr>
    <p style="background-color: #734b6d; color: white"><small>Recent Transactions</small></p>
    <table class="table is-narrow is-striped">
      <tbody>
        <tr v-for="transaction in transactions">
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

</template>

<script>
export default {
  name: 'transactions',
  props: ['transactions'],
  methods: {
    getDateString: function (dateS) {
      var months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December']
      var d = new Date(dateS)
      console.log(dateS)
      return (d.getHours() + ':' + (d.getMinutes()<10 ? '0' + d.getMinutes() : d.getMinutes()) + ' ' + months[d.getMonth()] + ', ' + d.getDay() + ' ')
    }
  }
}
</script>

<style>
hr {
  margin:0;
}
</style>
