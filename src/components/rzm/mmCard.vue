<template>
  <div>
    <el-card class="rzm-card-title">
      <span>{{ title }}</span>
    </el-card>
    <div class="rzm-card-line"></div>
    <el-card>
      <slot></slot>
    </el-card>
  </div>
</template>
<script>
  export default {
    props: ['title']
  }
</script>
<style scoped>
  .rzm-card-title{
    --el-card-padding: 5px
  }
  .rzm-card-line{
    border:2px solid #25ACE3;
    border-radius: 3px;
    margin-top: 2px;
    margin-bottom: 3px;
  }
  .rzm-card-title span{
    color: #55A5FF;
    font-weight:600;
    font-size: 20px;
  }
</style>