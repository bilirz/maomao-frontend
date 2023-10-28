<template>
  <div>
    <v-tabs v-model="tab">
      <v-tab value="home">首页</v-tab>
      <v-tab value="hot">热门</v-tab>
    </v-tabs>
    <v-window v-model="tab">
      <v-window-item value="home">
        <VideoGrid :videos="videos" :hasMore="hasMoreVideos" @load-more="() => loadMore('home')" />
      </v-window-item>
      <v-window-item value="hot">
        <VideoGrid :videos="videos" :hasMore="hasMoreVideos" @load-more="() => loadMore('hot')" />
      </v-window-item>
    </v-window>
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref, computed, watch } from 'vue';
import { useUrlStore } from '@/store/urlStore';
import VideoGrid from './VideoGrid.vue';

const urlStore = useUrlStore();
const apiUrl = computed(() => urlStore.apiUrl);

const hasMoreVideos = ref(true);
const videos = ref([]);
const currentAid = ref(1);
const tab = ref('home');
let isLoading = false;
const isAllDataLoaded = ref(false);

watch(tab, (newVal, oldVal) => {
  resetVideosData();
  loadMore(newVal);
});

function resetVideosData() {
  videos.value = [];
  currentAid.value = 1;
  isAllDataLoaded.value = false;
  hasMoreVideos.value = true;
}

async function loadMore(type = 'home') {
  if (isLoading || isAllDataLoaded.value) return;

  isLoading = true;
  const endpoint = type === 'home' ? '/api/video/list' : '/api/video/hot-list';

  try {
    const response = await axios.get(`${apiUrl.value}${endpoint}`, {
      params: { start: currentAid.value, count: 6 }
    });
    if (response.data.hasMore === false) {
      hasMoreVideos.value = false;
    }
    videos.value.push(...response.data.data);
    if (response.data.length < 6) {
      isAllDataLoaded.value = true;
    } else {
      currentAid.value += 6;
    }
  } catch (error) {
    console.error("获取视频错误:", error);
  } finally {
    isLoading = false;
  }
}

loadMore();
</script>