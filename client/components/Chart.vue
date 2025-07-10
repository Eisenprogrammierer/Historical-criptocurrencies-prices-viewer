<template>
  <div class="chart-container">
    <LineChart 
      :chart-data="chartData"
      :options="chartOptions"
      :height="350"
    />
    
    <div v-if="loading" class="loading-overlay">
      <div class="loader"></div>
      <p>Loading chart data...</p>
    </div>
  </div>
</template>

<script>
import { Line } from 'vue-chartjs'
import { 
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
  TimeScale
} from 'chart.js'

// Регистрируем необходимые компоненты Chart.js
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
  TimeScale
)

export default {
  name: 'BitcoinPriceChart',
  components: { LineChart: Line },
  props: {
    prices: {
      type: Array,
      required: true,
      validator: value => value.every(item => 
        item.date && typeof item.price === 'number'
      )
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.dataset.label || ''
                const value = context.parsed.y || 0
                return `${label}: $${value.toLocaleString()}`
              }
            }
          },
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Historical Bitcoin Price',
            font: {
              size: 16
            }
          }
        },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'month',
              tooltipFormat: 'YYYY-MM-DD',
              displayFormats: {
                day: 'MMM D',
                week: 'MMM D',
                month: 'MMM YYYY',
                year: 'YYYY'
              }
            },
            title: {
              display: true,
              text: 'Date'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Price (USD)'
            },
            ticks: {
              callback: (value) => `$${value.toLocaleString()}`
            }
          }
        }
      }
    }
  },
  computed: {
    chartData() {
      return {
        labels: this.prices.map(item => item.date),
        datasets: [
          {
            label: 'BTC/USD',
            data: this.prices.map(item => item.price),
            borderColor: '#F7931A',
            backgroundColor: 'rgba(247, 147, 26, 0.1)',
            borderWidth: 2,
            pointRadius: 1,
            tension: 0.1,
            fill: true
          }
        ]
      }
    }
  }
}
</script>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
  min-height: 350px;
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255,255,255,0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #F7931A;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
