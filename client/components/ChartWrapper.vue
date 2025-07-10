<script setup>
import { Line } from 'vue-chartjs'

const props = defineProps({
  data: Array,
  period: String
})

const chartData = computed(() => ({
  labels: props.data.map(d => d.date),
  datasets: [{
    label: `BTC Price (${props.period})`,
    data: props.data.map(d => d.price),
    borderColor: '#f7931a',
    backgroundColor: 'rgba(247, 147, 26, 0.1)'
  }]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false
}
</script>

<template>
  <div class="chart-container">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<style scoped>
.chart-container {
  height: 400px;
  margin-top: 20px;
}
</style>
