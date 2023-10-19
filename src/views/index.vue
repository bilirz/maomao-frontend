<template>
  <div>
    <div v-if="showTencentTip" class="tip custom-block">
      <p class="custom-block-title">友情赞助</p>
      <p class="custom-block-text">非常感谢腾讯云轻量应用服务器(TencentCloud Lighthouse)提供服务器，让我一个高一学生也有机会上线网站。</p>
      <p class="custom-block-text"><el-link type="primary" href="https://curl.qcloud.com/mzc5gXg0" target="_blank">点击这里领取本网站优惠购买轻量应用服务器</el-link></p>
      <el-link type="primary" @click="closeTip('tencent')">关闭</el-link>
    </div>

    <div v-if="showQQTip" class="tip custom-block-qq">
      <p class="custom-block-title">QQ群</p>
      <p class="custom-block-text">我的粉丝QQ群：883422705</p>
      <el-link type="primary" @click="closeTip('qq')">关闭</el-link>
    </div>
    
    <VideoList />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import VideoList from '@/components/video/VideoList.vue';


const showTencentTip = ref(true);
const showQQTip = ref(true);

// 在组件加载时检查localStorage
onMounted(() => {
  const tencentCloseTime = localStorage.getItem('tencentTipCloseTime');
  const qqCloseTime = localStorage.getItem('qqTipCloseTime');
  const now = Date.now();
  const twoDays = 48 * 60 * 60 * 1000; // 48小时

  if (tencentCloseTime && now - tencentCloseTime < twoDays) {
    showTencentTip.value = false;
  }
  if (qqCloseTime && now - qqCloseTime < twoDays) {
    showQQTip.value = false;
  }
});

// 关闭提示并在localStorage中设置关闭时间
const closeTip = (type) => {
  const now = Date.now();
  if (type === 'tencent') {
    showTencentTip.value = false;
    localStorage.setItem('tencentTipCloseTime', now);
  } else if (type === 'qq') {
    showQQTip.value = false;
    localStorage.setItem('qqTipCloseTime', now);
  }
};
</script>

<style scoped>
.custom-block.tip {
  padding: 8px 16px;
  background-color: #EDF5FF;
  border-radius: 4px;
  border-left: 5px solid var(--el-color-primary);
  margin: 20px 0;
}


.custom-block-qq.tip {
  padding: 8px 16px;
  background-color: #ffeded;
  border-radius: 4px;
  border-left: 5px solid #ff6262;
  margin: 20px 0;
}

.custom-block-title {
  font-size: 17px;
}

.custom-block-text {
  font-size: 14px;
}

p {
  margin-top: 8px;
  margin-bottom: 8px;
}

</style>