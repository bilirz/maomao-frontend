<template>
  <div>
    <v-card flat class="rzm-card-title-card custom-shadow">
      <span>{{ title }}</span>
    </v-card>
    <div class="rzm-card-line"></div>
    <v-card flat style="padding: 15px" class="custom-shadow">
      <slot></slot>
    </v-card>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
  },
}
</script>
<style scoped>
.rzm-card-title-card {
  border-radius: 5px;
  padding: 3px;
}

.rzm-card-title-card span {
  padding: 10px;
  color: #61aefb;
  font-weight: 600;
  font-size: 20px;
}

.rzm-card-line {
  border: 2px solid #61aefb;
  border-radius: 5px;
  margin-top: 2px;
  margin-bottom: 2px;
}

.custom-shadow {
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);
}
</style>
