<template>
  <div>
    <v-tabs v-model="tab" class="custom-tabs">
      <v-tab value="new">新发布</v-tab>
      <v-tab value="random">随机</v-tab>
      <v-tab value="hot">热门</v-tab>
      <v-tab value="must">入站必刷</v-tab>
    </v-tabs>
    <v-window v-model="tab">
      <v-window-item value="new">
        <VideoGrid
          :videos="videos"
          :has-more="hasMoreVideos"
          @load-more="() => loadMore('new')"
        />
      </v-window-item>
      <v-window-item value="random">
        <VideoGrid
          :videos="videos"
          :has-more="hasMoreVideos"
          @load-more="() => loadMore('random')"
        />
      </v-window-item>
      <v-window-item value="hot">
        <VideoGrid
          :videos="videos"
          :has-more="hasMoreVideos"
          @load-more="() => loadMore('hot')"
        />
      </v-window-item>
      <v-window-item value="must">
        <VideoGrid
          :videos="videos"
          :has-more="hasMoreVideos"
          @load-more="() => loadMore('must')"
        />
      </v-window-item>
    </v-window>
  </div>
</template>

<script setup>
import axios from 'axios'
import { ref, computed, watch } from 'vue'
import { useUrlStore } from '@/store/urlStore'
import VideoGrid from './VideoGrid.vue'

const urlStore = useUrlStore()
const apiUrl = computed(() => urlStore.apiUrl)

const hasMoreVideos = ref(true)
const videos = ref([])
const currentAid = ref(1)
const tab = ref('home')
let isLoading = false
const isAllDataLoaded = ref(false)

watch(tab, (newVal) => {
  resetVideosData()
  loadMore(newVal)
})

function resetVideosData() {
  videos.value = []
  currentAid.value = 1
  isAllDataLoaded.value = false
  hasMoreVideos.value = true
}

async function loadMore(type = 'new') {
  if (isLoading || isAllDataLoaded.value) return

  isLoading = true

  let endpoint = ''
  const params = { start: currentAid.value, count: 8 }

  switch (type) {
    case 'new':
      endpoint = '/api/video/list'
      params.sort_by = 'time'
      break
    case 'random':
      endpoint = '/api/video/list'
      params.sort_by = 'random'
      break
    case 'hot':
      endpoint = '/api/video/hot-list'
      params.within_two_weeks = true
      break
    case 'must':
      endpoint = '/api/video/hot-list'
      params.within_two_weeks = false
      break
    default:
      console.error(`Unknown type: ${type}`)
      isLoading = false
      return
  }

  try {
    const response = await axios.get(`${apiUrl.value}${endpoint}`, {
      params: params,
    })
    if (response.data.hasMore === false) {
      hasMoreVideos.value = false
    }
    videos.value.push(...response.data.data)
    if (response.data.length < 8) {
      isAllDataLoaded.value = true
    } else {
      currentAid.value += 8
    }
  } catch (error) {
    console.error('获取视频错误:', error)
  } finally {
    isLoading = false
  }
}

loadMore()
</script>

<style scoped>
.custom-tabs {
  background-color: #ffffff;
  border-radius: 5px;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);
}
</style>
