<template>
  <div>
    <mmCard v-if="videoInfo" :title="`${videoInfo.aid}: ${videoInfo.title}`" style="margin-bottom: 10px;">
      <div class="video-container">
        <video ref="videoElement" class="video-js vjs-default-skin" controls width="600"></video>
      </div>
    </mmCard>
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
import 'video.js/dist/video-js.css'; // 引入video.js样式
import videojs from 'video.js';
// import { io } from 'socket.io-client';
import { ref, onMounted, computed, nextTick, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '@/store/userStore';
import { useUrlStore } from '@/store/urlStore';
import mmCard from '@/components/rzm/mmCard.vue';
import avatar from '@/components/user/avatar.vue';
import comment from '@/components/common/comment.vue';
import useFormat from "@/composables/useFormat";

const route = useRoute();
const aid = route.params.aid;
const userStore = useUserStore();
const urlStore = useUrlStore();
const apiUrl = computed(() => urlStore.apiUrl);
const cosUrl = computed(() => urlStore.cosUrl);
const sessionData = computed(() => userStore.sessionData);
// const socket = io(apiUrl.value);

// 如果用DPlayer，设置XMLHttpRequest进行跨域带cookie
// const oldOpen = XMLHttpRequest.prototype.open;
// XMLHttpRequest.prototype.open = function() {
//     oldOpen.apply(this, arguments);
//     this.withCredentials = true;
// };

const videoElement = ref(null);
let player

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

// 视频浏览量+1
const incrementViewCount = async () => {
  await axios.post(`${apiUrl.value}/api/video/add/view/${aid}`);
}

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

const loadVideoAndCover = async () => {
  try {
    await axios.get(videoUrl);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      ElNotification({
        title: '视频不存在！',
        message: '即将为您跳转到首页...',
        type: 'warning',
      });
      window.location.href = "/";
    }
  }
};

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

// 播放器加载时的逻辑
onMounted(async () => {
  await nextTick();
  
  loadVideoAndCover();
  setTimeout(() => {
    player = videojs(videoElement.value, {
    controls: true,
    autoplay: false,
    preload: 'auto',
    playbackRates: [0.25, 0.5, 1, 1.5, 2, 3],
    fluid: true,
    aspectRatio: '16:9',
    controlBar: {
      volumePanel: false,
      pictureInPictureToggle: false,
      playbackRateMenuButton: false
    },
    sources: [{
      src: videoUrl,
      type: 'application/x-mpegURL'
    }]
  });
  player.on('play', () => {
    incrementViewCount();
  });
  }, 1000);
});



</script>

<style scoped>

.margin-div {
  margin: 10px;
}

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

.video-container {
  position: relative;
  background-color: #000; /* 指定背景色，通常是黑色 */
}

.video-container video {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 100%;
  max-height: 100%;
}
</style>