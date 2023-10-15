<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="首页" name="home">
        <VideoGrid :videos="videos" :hasMore="hasMoreVideos" v-if="activeName === 'home'" @load-more="() => loadMore('home')"/>
      </el-tab-pane>
      <el-tab-pane label="热门" name="hot">
        <VideoGrid :videos="videos" :hasMore="hasMoreVideos" v-if="activeName === 'hot'" @load-more="() => loadMore('hot')"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios'
import VideoGrid from './VideoGrid.vue';

const store = useStore();
const apiUrl = computed(() => store.state.apiUrl);

const hasMoreVideos = ref(true);

const activeName = ref('home');
const videos = ref([]);
const currentAid = ref(1);
let isLoading = false;
const isAllDataLoaded = ref(false);

function handleClick(tab) {
  const tabName = tab.props.name;
  resetVideosData();
  loadMore(tabName);
}

function resetVideosData() {
  videos.value = [];
  currentAid.value = 1;
  isAllDataLoaded.value = false;
  hasMoreVideos.value = true
}

async function loadMore(type = 'home') {
  if (isLoading || isAllDataLoaded.value) return;

  isLoading = true;
  const endpoint = type === 'home' ? '/api/video/list' : '/api/video/hot-list';

  try {
    const response = await axios.get(`${apiUrl.value}${endpoint}`, {
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
    console.error("获取视频错误:", error);
  } finally {
    isLoading = false;
  }
}

loadMore();

</script>