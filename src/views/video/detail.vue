<template>
  <div>
    <player v-if="videoInfo" :videoUrl="videoUrl" :aid="videoInfo.aid" :videoInfo="videoInfo" />
    <mmCard v-if="videoInfo" title="详情" style="margin-bottom: 10px;">
      <div class="video-info">
        <div><v-btn @click="toggleLike">点赞 ({{ videoInfo.data.like || '0' }})</v-btn></div>
        <div v-if="videoInfo.description">{{ videoInfo.description || '0' }}</div>
        <div v-if="videoInfo.origin"><strong>搬运于:</strong> {{ videoInfo.origin }}</div>
        <div><strong>发布时间:</strong> {{ formatTimestamp(videoInfo.time) }}</div>
        <div v-if="formattedTags.length">
          <strong>标签:</strong> 
          <el-tag v-for="tag in formattedTags" :key="tag" style="margin-left: 10px">{{ tag }}</el-tag>
        </div>
      </div>
    </mmCard>
    <mmCard v-if="videoInfo && upInfo" title="喵绘者" style="margin-bottom: 10px;">
      <div class="video-info up-details">
        <avatar :src="upFaceUrl" style="margin-right: 20px;"></avatar>
        <div class="up-info-details">
          <v-icon icon="mdi-account-circle" style="margin-right: 10px; margin-bottom: 10px;" /><strong class="up-name">#{{ upInfo.exp_rank }} / {{ upInfo.name }}</strong>
          <p><v-icon icon="mdi-battery-plus-variant" style="margin-right: 5px; margin-bottom: 10px;" /> {{ (upInfo.experience || '0').toFixed(1) }} 点经验</p>
          <v-btn @click="$router.push(`/space/${videoInfo.uid}`)">前往TA的空间</v-btn>
        </div>
      </div>
    </mmCard>
    <comment :aid="+aid"></comment>
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '@/store/userStore';
import { useUrlStore } from '@/store/urlStore';
import mmCard from '@/components/rzm/mmCard.vue';
import avatar from '@/components/user/avatar.vue';
import comment from '@/components/common/comment.vue';
import player from '@/components/video/player.vue';
import useFormat from "@/composables/useFormat";

const route = useRoute();
const aid = route.params.aid;
const userStore = useUserStore();
const urlStore = useUrlStore();
const apiUrl = computed(() => urlStore.apiUrl);
const cosUrl = computed(() => urlStore.cosUrl);
const sessionData = computed(() => userStore.sessionData);

let videoUrl;
if (parseInt(aid) > 116) {
    videoUrl = `${cosUrl.value}/videos/${aid}/${aid}.m3u8`;
} else {
    videoUrl = `${cosUrl.value}/videos/${aid}/index.m3u8`;
}

const posterUrl = `${cosUrl.value}/covers/${aid}.jpg`;
const { formatTimestamp, getCategoryByValue } = useFormat();

const videoInfo = ref(null);
const lastLikeClickTime = ref(0);

// 格式化视频标签
const formattedTags = computed(() => {
  if (videoInfo.value && videoInfo.value.tags) {
    let newTags = [];

    if (videoInfo.value.source) {
      newTags.push(videoInfo.value.source);
    }
    if (getCategoryByValue(videoInfo.category)) {
      newTags.push(getCategoryByValue(videoInfo.value.category));
    }

    return [...newTags, ...videoInfo.value.tags];
  }
  return [];
});

// 获取视频信息
axios.get(`${apiUrl.value}/api/video/get/${aid}`)
  .then(response => {
    videoInfo.value = response.data;
  });

const upInfo = ref(null);
const upFaceUrl = computed(() => `${cosUrl.value}/face/${videoInfo.value.uid}.jpg`);

// 当有videoInfo时，获取UP主信息
watch(videoInfo, async () => {
  if (videoInfo.value) {
    const response = await axios.get(`${apiUrl.value}/api/space/${videoInfo.value.uid}`);
    upInfo.value = response.data;
  }
});


// 点赞功能，防止用户连续点击
const toggleLike = async () => {
  const currentTime = Date.now();
  if (currentTime - lastLikeClickTime.value < 1000) {
    ElMessage({
      message: '请稍等一秒再点击！',
      type: 'warning',
    });
    return;
  }
  lastLikeClickTime.value = currentTime;
  try {
    const response = await axios.post(`${apiUrl.value}/api/video/toggle/like/${aid}`);
    videoInfo.value.data.like += response.data.likes;
    ElMessage({
      message: '操作成功',
      type: 'success',
    });
  } catch (error) {
    const errorMessage = error.response?.data?.message || '操作失败，请稍后再试';
    ElMessage({
      message: errorMessage,
      type: 'error',
    });
  }
};
</script>

<style scoped>
.video-container video {
  width: 100%;
  height: 100%;
}

.video-info div {
  margin-bottom: 15px;
}

.up-details {
  display: flex;
  align-items: center;
}

.up-name {
  font-size: 1.2em;
  margin-bottom: 10px;
}

.up-info-details {
  flex-grow: 1;
  color: #666;
}
</style>