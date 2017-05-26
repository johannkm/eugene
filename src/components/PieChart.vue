<script>
// CommitChart.js
import { Doughnut, mixins } from 'vue-chartjs'

export default Doughnut.extend({
  mixins: [mixins.reactiveProp],
  props: ['chartData', 'options', 'sums'],
  watch: {
    sums: function (newSum) {
      this.chartData.datasets[0].data = newSum
      this.renderChart(this.chartData, this.options)
    }
  },
  mounted: function(){
    this.chartData.datasets[0].data = this.sums
    this.renderChart(this.chartData, this.options)
  }
})

</script>
