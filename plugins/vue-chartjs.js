import Vue from 'vue'
import { Radar, Line } from 'vue-chartjs'

Vue.component('radar-chart', {
  extends: Radar,
  props: ['data', 'options'],
  mounted () {
    this.renderChart(this.data, this.options)
  }
})
