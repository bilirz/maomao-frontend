<template>
  <div>
    <mmCard title="关于本网站" class="mb-20">
      <li>本网站仅供B站UP主认真猫学习编程使用。</li>
      <li>前端设计和相关想法借鉴了我最喜欢的网站BiliOB观测者，这个网站也是我全栈开发的启蒙之地。</li>
    </mmCard>
    <mmCard title="联系我" class="mb-20">
      <li>我的粉丝QQ群：883422705，这里也是网站讨论群。</li>
      <li>我的技术交流群：542174643。</li>
      <li>欢迎前往本网站github提issus和pr，也欢迎Star和Fork。</li>
    </mmCard>
    <mmCard title="本网站使用的技术架构">
      <h4>友情赞助</h4>
      <li>感谢腾讯云轻量应用服务器赞助本网站，让我一个高一学生也有机会上线网站。</li>
      <h4>前端</h4>
      <li>
        使用Vue3.0进行开发，应用了Pinia前端状态管理与vue-router前端路由，使用vite搭建项目。
      </li>
      <li>
        前端UI组件库大部分采用的是Vuetify.js，少部分使用Element-plus（完全重构后会移除）
      </li>
      <h4>后端</h4>
      <li>后端采用Flask构建API。</li>
      <h4>数据库</h4>
      <li>
        数据库采用MongoDB存储文本数据。
      </li>
      <h4>缓存</h4>
      <li>
        缓存数据库采用的是Redis。未来会将热门视频加入Redis队列。
      </li>
      <h4>存储</h4>
      <li>使用了腾讯云对象存储COS存储媒体文件。</li>
      <h4>CDN</h4>
      <li>使用了Cloudflare CDN Free计划。</li>
    </mmCard>
    <comment type="about" style="margin-top: 20px;"></comment>
  </div>
</template>
<script setup>
import mmCard from '@/components/rzm/mmCard.vue';

</script>

<style scoped>
.mb-20 {
  margin-bottom: 20px;
}

h4 {
  font-size: 18px;
  font-weight: 600;
  padding-bottom: 10px;
  color: #333;
}

li {
  margin-bottom: 10px;
  font-size: 16px;
  color: #555;
}
</style>