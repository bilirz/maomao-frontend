<template>
  <mmCard v-if="userInfo" title="个人空间" style="margin-bottom: 10px;">
    <div>
      <img 
      :src="`${cosUrl}/face/${route.params.uid}.jpg`" 
      alt="头像" 
      class="circle-face"
      @error="event => event.target.src='../../assets/default_face.png'" />
    </div>
    <div class="user-details">
      <h2>{{ userInfo.name }}</h2>
      <p class="timestamp"><el-icon><Clock /></el-icon> {{ formatTimestamp(userInfo.registration_time) }}</p>
      <div class="follower-stats">
        <span>关注: {{ userInfo.following_count || '0' }}</span>
        <span>粉丝: {{ userInfo.followers_count || '0' }}</span>
        <span>经验: {{ userInfo.experience || '0' }}</span>
      </div>
      <el-button @click="toggleFollow" class="follow-btn">{{ isFollowing ? '取消关注' : '关注' }}</el-button>
    </div>
  </mmCard>
  <VideoGrid :videos="videos" :hasMore="hasMoreVideos" @load-more="loadMore"/>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import axios from 'axios';
import mmCard from '@/components/rzm/mmCard.vue';
import useFormat from "@/composables/useFormat";
import VideoGrid from '@/components/video/VideoGrid.vue';

const store = useStore();
const route = useRoute();
const apiUrl = ref(store.state.apiUrl);
const cosUrl = ref(store.state.cosUrl);
const { formatTimestamp } = useFormat();

const userInfo = ref(null);
const hasMoreVideos = ref(true);
const videos = ref([]);
const currentAid = ref(1);
let isLoading = false;
const isAllDataLoaded = ref(false);
const isFollowing = ref(false);

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

onMounted(async () => {
  try {
    // 获取用户信息
    const userResponse = await axios.get(`${apiUrl.value}/api/space/${route.params.uid}`);
    userInfo.value = userResponse.data;

  } catch (error) {
    ElMessage({
      message: error,
      type: 'error',
    });
  }
  try {
    const response = await axios.get(`${apiUrl.value}/api/space/is_following/${route.params.uid}`);
    isFollowing.value = response.data.isFollowing;
  } catch (error) {
    ElMessage({
      message: error,
      type: 'error',
    });
  }
});

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

.circle-face {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  display: inline-block;
}
</style>