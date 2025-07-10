<template>
  <div>
    <Chart 
      :prices="chartData" 
      :loading="isLoading"
    />
  </div>
</template>

<script>
import Chart from '~/components/Chart.vue'

export default {
  components: { Chart },
  data() {
    return {
      isLoading: false,
      chartData: [] // Массив вида [{ date: '2023-01-01', price: 16500 }, ...]
    }
  },
  async mounted() {
    await this.loadData()
  },
  methods: {
    async loadData() {
      this.isLoading = true
      try {
        const { data } = await this.$axios.get('/api/history?period=year')
        this.chartData = data
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>
