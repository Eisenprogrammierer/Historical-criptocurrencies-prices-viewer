<template>
  <div class="container">
    <h1>Bitcoin Price History</h1>
    
    <PeriodSelect 
      @period-change="handlePeriodChange"
      class="period-selector"
    />

    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <Chart 
      :prices="chartData"
      :loading="loading"
      class="price-chart"
    />
  </div>
</template>

<script>
import Chart from '~/components/Chart.vue'
import PeriodSelect from '~/components/PeriodSelect.vue'

export default {
  components: { Chart, PeriodSelect },
  data() {
    return {
      loading: false,
      error: null,
      chartData: []
    }
  },
  methods: {
    async handlePeriodChange(period) {
      this.loading = true
      this.error = null
      
      try {
        if (typeof period === 'string') {
          await this.fetchData(period)
        } else {
          await this.fetchCustomData(period.start, period.end)
        }
      } catch (err) {
        console.error('Failed to load data:', err)
        this.error = 'Failed to load data. Please try again later.'
      } finally {
        this.loading = false
      }
    },

    async fetchData(period) {
      const { data } = await this.$axios.get('/api/history', {
        params: { period }
      })
      this.chartData = data
    },

    async fetchCustomData(startDate, endDate) {
      const { data } = await this.$axios.get('/api/history/custom', {
        params: { start: startDate, end: endDate }
      })
      this.chartData = data
    }
  },
  async mounted() {
    await this.fetchData('week') // Load initial data
  }
}
</script>

<style scoped>
.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.period-selector {
  margin: 20px 0;
}

.error-message {
  color: #ff4d4f;
  margin: 10px 0;
  padding: 10px;
  background: #fff2f0;
  border: 1px solid #ffccc7;
  border-radius: 4px;
}

.price-chart {
  margin-top: 30px;
}
</style>
