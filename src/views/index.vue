<template>
  <div>
    <div class="tip custom-block">
      <p class="custom-block-title">友情赞助</p>
      <p>非常感谢腾讯云轻量应用服务器(TencentCloud Lighthouse)提供服务器，让我一个高一学生也有机会上线网站。</p>
      <p><el-link type="primary" href="https://curl.qcloud.com/mzc5gXg0" target="_blank">点击这里领取本网站优惠购买轻量应用服务器</el-link></p>
    </div>

    <div class="tip custom-block-qq">
      <p class="custom-block-title">一件很重要的事</p>
      <p>官方QQ群：883422705（也是我的粉丝群）</p>
      <p>如果你想支持这个网站，也欢迎加群赞助！真的非常感谢！</p>
    </div>

    
    <VideoList />
  </div>
</template>

<script setup>
import VideoList from '@/components/video/VideoList.vue';

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
</style>