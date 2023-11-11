<template>
  <div>
    <v-card v-ripple="showRipple" flat :style="cardStyle">
      <slot></slot>
    </v-card>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  showRipple: {
    type: Boolean,
    default: false,
  },
  enableShadow: {
    type: Boolean,
    default: true,
  },
})

const cardStyle = computed(() => {
  let baseStyle = 'padding: 20px;'
  if (props.enableShadow) {
    baseStyle += 'box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);'
  }
  return baseStyle
})
</script>
