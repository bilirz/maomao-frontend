<template>
  <div>
    <mmCard v-if="videoInfo" :title="`${videoInfo.aid}: ${videoInfo.title}`" style="margin-bottom: 10px;">
      <div class="video-container">
        <video ref="videoElement" class="video-js vjs-default-skin" controls width="600"></video>
      </div>
    </mmCard>
    <mmCard v-if="videoInfo" title="详情" style="margin-bottom: 10px;">
      <div class="video-info">
        <div><el-button @click="toggleLike">点赞 ({{ videoInfo.data.like || '0' }})</el-button></div>
        <div v-if="videoInfo.description">{{ videoInfo.description || '0' }}</div>
        <div v-if="videoInfo.origin"><strong>搬运于:</strong> {{ videoInfo.origin }}</div>
        <div><strong>发布时间:</strong> {{ formatTimestamp(videoInfo.time) }}</div>
        <div v-if="formattedTags.length">
          <strong>标签:</strong> 
          <el-tag v-for="tag in formattedTags" :key="tag" style="margin-left: 10px">{{ tag }}</el-tag>
        </div>
      </div>
    </mmCard>
    <mmCard v-if="videoInfo && upInfo" title="UP主详情" style="margin-bottom: 10px;">
      <div class="video-info up-details">
        <avatar :src="upFaceUrl" style="margin-right: 20px;"></avatar>
        <div class="up-info-details">
          <strong class="up-name"><el-icon><User /></el-icon>{{ upInfo.name }}</strong>
          <p><svg t="1697734215269" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5547" width="15" height="15"><path d="M95.55512889 807.27608889A66.48263111 66.48263111 0 0 1 75.09333333 758.63381333c0-18.78698667 6.84487111-34.95253333 20.46179556-48.64227555L710.06435555 95.48231111A66.48263111 66.48263111 0 0 1 758.63381333 75.09333333c18.78698667 0 34.95253333 6.84487111 48.64227556 20.46179556l121.16878222 121.16878222c13.61692445 13.68974222 20.46179555 29.85528889 20.46179556 48.64227556 0 18.78698667-6.84487111 34.95253333-20.46179556 48.64227555L313.93564445 928.51768889a66.48263111 66.48263111 0 0 1-48.64227556 20.46179556 66.48263111 66.48263111 0 0 1-48.64227556-20.46179556l-121.16878222-121.16878222zM568.28814222 353.25724445l-406.17756444 406.17756444 102.45461333 102.45461333 406.17756444-406.17756444L568.28814222 353.25724445z m191.14666667-191.14666667L626.32391111 295.22147555l102.45461334 102.45461334 133.11089777-133.11089778-102.45461333-102.45461333z m-447.10115556-20.38897778c1.09226667-3.49525333 3.93216-5.17006222 8.51968-5.17006222 4.51470222 0 7.42741333 1.67480889 8.51968 5.09724444l20.46179556 40.99640889 44.41884444 6.77205334c4.51470222 0 7.35459555 2.03889778 8.51968 5.97105777 1.16508445 4.00497778 0 7.71868445-3.42243555 11.14112l-32.40391111 30.72910223 8.51968 44.34602666c0 4.51470222-1.45635555 8.00995555-4.29624889 10.19448889-2.83989333 2.33016889-6.5536 2.33016889-11.06830223 0l-39.24878222-20.38897778-39.3216 20.38897778c-4.51470222 2.33016889-8.15559111 2.33016889-10.99548444 0-2.91271111-2.18453333-4.29624889-5.67978667-4.29624889-10.19448889l8.51968-44.41884444-32.40391111-30.65628445c-3.42243555-3.42243555-4.58752-7.13614222-3.42243556-11.14112 1.16508445-3.93216 4.00497778-5.97105778 8.51968-5.97105777l44.41884445-6.77205334 20.38897777-40.99640889z m167.26243556-34.22435555c1.09226667-3.42243555 2.83989333-5.09724445 5.09724444-5.09724445 2.25735111 0 4.00497778 1.67480889 5.09724445 5.09724445l13.68974222 25.63185777 30.72910222 5.09724445c2.18453333 0 3.93216 1.45635555 5.09724445 4.29624888 1.16508445 2.83989333 0.58254222 4.80597333-1.67480889 5.97105778l-22.20942223 22.13660445 5.09724445 29.05429333c1.16508445 3.42243555 0.58254222 5.67978667-1.67480889 6.84487111a7.28177778 7.28177778 0 0 1-6.84487111 0l-27.30666667-13.68974222-27.30666666 13.68974222a7.28177778 7.28177778 0 0 1-6.84487112 0c-2.25735111-1.16508445-2.83989333-3.42243555-1.67480888-6.84487111l5.09724444-28.98147556-22.20942222-22.20942222c-2.18453333-1.16508445-2.83989333-3.13116445-1.67480889-5.97105778 1.16508445-2.91271111 2.91271111-4.29624889 5.09724445-4.29624888l30.72910222-5.09724445 13.68974222-25.63185777z m-327.68 0c1.09226667-3.42243555 2.83989333-5.09724445 5.09724444-5.09724445 2.25735111 0 4.00497778 1.67480889 5.09724445 5.09724445l13.68974222 25.63185777 30.72910222 5.09724445c2.18453333 0 3.93216 1.45635555 5.09724445 4.29624888 1.16508445 2.83989333 0.58254222 4.80597333-1.67480889 5.97105778l-22.20942223 22.13660445 5.09724445 29.05429333c1.16508445 3.42243555 0.58254222 5.67978667-1.67480889 6.84487111a7.28177778 7.28177778 0 0 1-6.84487111 0l-27.30666667-13.68974222-27.30666666 13.68974222a7.28177778 7.28177778 0 0 1-6.84487112 0c-2.25735111-1.16508445-2.83989333-3.42243555-1.67480888-6.84487111l5.09724444-28.98147556-22.20942222-22.20942222c-2.18453333-1.16508445-2.83989333-3.13116445-1.67480889-5.97105778 1.16508445-2.91271111 2.91271111-4.29624889 5.09724445-4.29624888l30.72910222-5.09724445 13.68974222-25.63185777z m709.97333333 380.61852444c1.09226667-2.25735111 2.83989333-3.42243555 5.09724445-3.42243556 2.25735111 0 4.00497778 1.16508445 5.09724444 3.42243556l13.68974222 27.30666666 30.72910222 3.42243556c2.18453333 1.09226667 3.93216 2.83989333 5.09724445 5.09724444 1.16508445 2.25735111 0.58254222 4.58752-1.67480889 6.84487112l-22.20942222 20.46179555 5.09724444 30.72910223c1.16508445 2.25735111 0.58254222 4.29624889-1.67480888 5.97105777-2.33016889 1.67480889-4.58752 1.96608-6.84487112 0.87381333l-27.30666666-15.3645511-27.30666667 15.29173333c-2.25735111 1.16508445-4.58752 0.87381333-6.84487111-0.80099556s-2.83989333-3.64088889-1.67480889-5.97105777l5.09724445-30.72910223-22.20942223-20.46179555c-2.18453333-2.25735111-2.83989333-4.58752-1.67480889-6.84487112a11.14112 11.14112 0 0 1 5.09724445-5.09724444l30.72910222-3.42243556 13.68974222-27.30666666z" p-id="5548" fill="#303133"></path></svg> {{ upInfo.experience || '0' }} 点经验</p>
          <el-button @click="$router.push(`/space/${videoInfo.uid}`)">前往TA的空间</el-button>
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
}
</style>