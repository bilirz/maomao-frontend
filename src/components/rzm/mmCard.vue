<template>
  <div>
    <v-card flat class="rzm-card-title custom-shadow">
      <span>{{ title }}</span>
    </v-card>
    <div class="rzm-card-line"></div>
    <v-card flat style="padding: 15px;" class="custom-shadow">
      <slot></slot>
    </v-card>
  </div>
</template>
<script>
  export default {
    props: ['title']
  }
</script>
<style scoped>
.rzm-card-title{
  padding: 10px;
}
.rzm-card-line{
  border:2px solid #61aefb;
  border-radius: 3px;
  margin-top: 5px;
  margin-bottom: 5px;
}
.rzm-card-title span{
  color: #61aefb;
  font-weight:600;
  font-size: 20px;
}
.custom-shadow {
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);
}
</style>