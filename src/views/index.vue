<template>
  <div>
    <VideoList />

    <comment type="index"></comment>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import VideoList from '@/components/video/VideoList.vue'
import comment from '@/components/common/comment.vue'

const showTencentTip = ref(true)
const showQQTip = ref(true)

// 在组件加载时检查localStorage
onMounted(() => {
  const tencentCloseTime = localStorage.getItem('tencentTipCloseTime')
  const qqCloseTime = localStorage.getItem('qqTipCloseTime')
  const now = Date.now()
  const twoDays = 72 * 60 * 60 * 1000 // 48小时

  if (tencentCloseTime && now - tencentCloseTime < twoDays) {
    showTencentTip.value = false
  }
  if (qqCloseTime && now - qqCloseTime < twoDays) {
    showQQTip.value = false
  }
})
</script>
