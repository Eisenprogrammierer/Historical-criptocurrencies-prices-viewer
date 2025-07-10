<script setup>
const selectedPeriod = ref('week')
const chartData = ref([])

const fetchData = async () => {
  try {
    const { data } = await useFetch('/api/history', {
      params: { period: selectedPeriod.value }
    })
    chartData.value = data.value
  } catch (err) {
    console.error('Failed to fetch data:', err)
  }
}

watch(selectedPeriod, fetchData)
onMounted(fetchData)
</script>

<template>
  <div class="container">
    <DateSelector v-model="selectedPeriod" />
    <ChartWrapper 
      v-if="chartData.length" 
      :data="chartData" 
      :period="selectedPeriod"
    />
    <div v-else class="loading">
      Loading data...
    </div>
  </div>
</template>
