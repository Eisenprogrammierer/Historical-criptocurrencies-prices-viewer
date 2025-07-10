<script setup>
const props = defineProps({
  modelValue: String
})

const emit = defineEmits(['update:modelValue'])

const periods = [
  { value: 'day', label: '24 Hours' },
  { value: 'week', label: '1 Week' },
  { value: 'month', label: '1 Month' },
  { value: 'year', label: '1 Year' },
  { value: 'custom', label: 'Custom' }
]
</script>

<template>
  <div class="selector">
    <select 
      :value="modelValue"
      @change="emit('update:modelValue', $event.target.value)"
    >
      <option 
        v-for="period in periods" 
        :key="period.value" 
        :value="period.value"
      >
        {{ period.label }}
      </option>
    </select>
  </div>
</template>
