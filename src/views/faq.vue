<template>
  <div>
    <mmCard title="关于积分">
      <li>
        目前，已注册的用户每8小时签到可以获得10点积分和10经验值。消耗积分可以增加等量的经验。
      </li>
      <li>消耗积分可以评论、发布视频、修改头像等。</li>
      <li>
        发布评论消耗0.2积分，发送弹幕消耗0.2积分，发布视频消耗1积分，修改头像或名字消耗5积分。
      </li>
      <li>视频被点赞可增加10积分，在自己的视频下评论不增加积分。</li>
    </mmCard>
    <comment type="faq" class="mt-5"></comment>
  </div>
</template>

<script setup>
import mmCard from '@/components/rzm/mmCard.vue'
</script>

<style>
li {
  margin-bottom: 10px;
  font-size: 16px;
  color: #555;
}
</style>
