<template>
  <div>
    <mmCard v-if="userInfo" title="个人空间">
      <avatar :src="`${cosUrl}/face/${route.params.uid}.jpg`" size="80"></avatar>
      <div class="user-details">
        <h2>{{ userInfo.name }}</h2>
        <p class="timestamp"><v-icon>mdi-clock-outline</v-icon> {{ formatTimestamp(userInfo.registration_time) }}</p>
        <div class="follower-stats">
          <span>关注: {{ userInfo.following_count || '0' }}</span>
          <span>粉丝: {{ userInfo.followers_count || '0' }}</span>
          <span>经验: {{ userInfo.experience || '0' }}</span>
        </div>
        <v-btn @click="toggleFollow" class="follow-btn">{{ isFollowing ? '取消关注' : '关注' }}</v-btn>
      </div>
    </mmCard>
    <VideoGrid :videos="videos" :hasMore="hasMoreVideos" @load-more="loadMore"/>
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useUrlStore } from '@/store/urlStore';
import useFormat from "@/composables/useFormat";
import mmCard from '@/components/rzm/mmCard.vue';
import VideoGrid from '@/components/video/VideoGrid.vue';
import avatar from '@/components/user/avatar.vue';

// 初始化URL存储和路由
const urlStore = useUrlStore();
const route = useRoute();
const apiUrl = computed(() => urlStore.apiUrl);
const cosUrl = computed(() => urlStore.cosUrl);
const { formatTimestamp } = useFormat();

// 定义相关的引用和变量
const userInfo = ref(null);
const hasMoreVideos = ref(true);
const videos = ref([]);
const currentAid = ref(1);
let isLoading = false;
const isAllDataLoaded = ref(false);
const isFollowing = ref(false);

// 切换关注状态的函数
async function toggleFollow() {
  try {
    const response = await axios.post(`${apiUrl.value}/api/space/follow/${route.params.uid}`);
    
    if (response.data) {
      if (response.data.state == "succeed") {
        ElMessage({
          message: '关注成功',
          type: 'succeed',
        });
        isFollowing.value = !isFollowing.value;
      } else {
        ElMessage({
          message: response.data.message,
          type: 'warning',
        });
      }
    }
  } catch (error) {
    ElMessage({
      message: error,
      type: 'error',
    });
  }
}

// 组件挂载后的操作
onMounted(async () => {
  try {
    const userResponse = await axios.get(`${apiUrl.value}/api/space/${route.params.uid}`);
    userInfo.value = userResponse.data;

  } catch (error) {}
  
  try {
    const response = await axios.get(`${apiUrl.value}/api/space/is_following/${route.params.uid}`);
    isFollowing.value = response.data.isFollowing;
  } catch (error) {}
});

// 加载更多视频的函数
async function loadMore() {
  if (isLoading || isAllDataLoaded.value) return;

  isLoading = true;

  try {
    const response = await axios.get(`${apiUrl.value}/api/space/videos/${route.params.uid}`, {
      params: { start: currentAid.value, count: 10 }
    });
    if (response.data.hasMore === false) {
      hasMoreVideos.value = false;
    }
    videos.value.push(...response.data.data);
    if (response.data.length < 10) {
      isAllDataLoaded.value = true;
    } else {
      currentAid.value += 10;
    }
  } catch (error) {
    ElMessage({
      message: error,
      type: 'error',
    });
  } finally {
    isLoading = false;
  }
}

// 默认加载一次视频数据
loadMore();
</script>

<style scoped>

.user-details {
  flex: 1;
}

.user-details h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 10px;
}

.timestamp {
  color: #999;
  font-size: 0.9rem;
}

.follower-stats {
  margin: 10px 0;
  color: #555;
}

.follower-stats span {
  margin-right: 15px;
}

.follow-btn {
  margin-top: 10px;
}
</style>