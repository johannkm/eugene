<template>
  <div
    <div style="background-color: white">
        <pie-chart :chartData="datas" :sums="sums" :options="{responsive: true, maintainAspectRatio: false}" style="width:100%; padding-bottom: 1.5em; padding-top: 0.2em"></pie-chart>
    </div>
  </div>

</template>

<script>
  import PieChart from './PieChart.vue'

  export default {
    name: 'analytics',
    components: {
      PieChart
    },
    props: ['transactions'],
    computed: {
      sums: function () {
        let ans = [0, 0, 0, 0, 10]

        for (let t = 0; t < this.transactions.length; t++) {
          if (this.transactions[t].value > 0) {
            let msg = this.transactions[t].message.toLowerCase()
            if (msg.includes(this.keywords[0])) {
              ans[0] += this.transactions[t].value
            } else if (msg.includes(this.keywords[1])) {
              ans[1] += this.transactions[t].value
            } else if (msg.includes(this.keywords[2])) {
              ans[2] += this.transactions[t].value
            } else if (msg.includes(this.keywords[3])) {
              ans[3] += this.transactions[t].value
            }
          }
        }
        this.datas.total++
        return ans
      }
    },
    data () {
      return {
        keywords: ['allowance', 'raking', 'trash', 'seed'],
        datas: {
          datasets: [{
            data: [5, 5, 5, 5, 5],
            backgroundColor: [
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
              'rgb(75, 192, 192)',
              'rgb(54, 162, 235)'
            ]
          }],
          labels: [
            'Allowance',
            'Raking the Leaves',
            'Taking out the Garbage',
            'Farming',
            'Other'
          ],
          total: 0
        }
      }
    }
}
</script>
