<template>
  <div class="period-select">
    <select 
      v-model="selectedPeriod"
      @change="handleChange"
      class="select-input"
    >
      <option 
        v-for="period in predefinedPeriods" 
        :key="period.value"
        :value="period.value"
      >
        {{ period.label }}
      </option>
      <option value="custom">Custom Range</option>
    </select>

    <div v-if="showCustomRange" class="custom-range">
      <input
        type="date"
        v-model="startDate"
        :max="endDate"
        min="2015-01-01"
        class="date-input"
      >
      <input
        type="date"
        v-model="endDate"
        :min="startDate"
        :max="today"
        class="date-input"
      >
      <button 
        @click="applyCustomRange"
        class="apply-button"
      >
        Apply
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    initialPeriod: {
      type: String,
      default: 'week'
    }
  },
  data() {
    return {
      selectedPeriod: this.initialPeriod,
      predefinedPeriods: [
        { value: 'day', label: '24 Hours' },
        { value: 'week', label: '1 Week' },
        { value: 'month', label: '1 Month' },
        { value: 'year', label: '1 Year' }
      ],
      startDate: '',
      endDate: '',
      today: new Date().toISOString().split('T')[0]
    }
  },
  computed: {
    showCustomRange() {
      return this.selectedPeriod === 'custom'
    }
  },
  methods: {
    handleChange() {
      if (this.selectedPeriod !== 'custom') {
        this.$emit('period-change', this.selectedPeriod)
      }
    },
    applyCustomRange() {
      if (this.startDate && this.endDate) {
        this.$emit('period-change', {
          type: 'custom',
          start: this.startDate,
          end: this.endDate
        })
      }
    }
  }
}
</script>

<style scoped>
.period-select {
  margin: 1rem 0;
}

.select-input {
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 1rem;
}

.custom-range {
  margin-top: 1rem;
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.date-input {
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.apply-button {
  padding: 0.5rem 1rem;
  background-color: #f7931a;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.apply-button:hover {
  background-color: #e07b0c;
}
</style>
