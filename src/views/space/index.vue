<template>
  <div>
    <mmCard v-if="userInfo" title="个人空间">
      <avatar :uid="route.params.uid" size="80"></avatar>
      <div class="user-details">
        <h2>#{{ userInfo.exp_rank }} / {{ userInfo.name }}</h2>
        <p class="timestamp">
          <v-icon>mdi-clock-outline</v-icon>
          {{ formatTimestamp(userInfo.registration_time) }}
        </p>
        <div class="follower-stats">
          <span>关注: {{ userInfo.following_count || '0' }}</span>
          <span>粉丝: {{ userInfo.followers_count || '0' }}</span>
          <span>经验: {{ (userInfo.experience || '0').toFixed(1) }}</span>
        </div>
        <v-btn
          v-if="route.params.uid != sessionData.uid"
          class="user-btn"
          @click="toggleFollow"
          >{{ isFollowing ? '取消关注' : '关注' }}</v-btn
        >
        <v-btn v-else class="user-btn" @click="goToSetting">编辑资料</v-btn>
      </div>
    </mmCard>
    <VideoGrid
      :videos="videos"
      :has-more="hasMoreVideos"
      @load-more="loadMore"
    />
  </div>
</template>

<script setup>
import axios from 'axios'
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUrlStore } from '@/store/urlStore'
import { useUserStore } from '@/store/userStore'
import useFormat from '@/composables/useFormat'
import mmCard from '@/components/rzm/mmCard.vue'
import VideoGrid from '@/components/video/VideoGrid.vue'
import avatar from '@/components/user/avatar.vue'

// 初始化URL存储和路由
const urlStore = useUrlStore()
const userStore = useUserStore()
const route = useRoute()
const router = useRouter()
const apiUrl = computed(() => urlStore.apiUrl)
const sessionData = computed(() => userStore.sessionData)
const { formatTimestamp } = useFormat()

// 定义相关的引用和变量
const userInfo = ref(null)
const hasMoreVideos = ref(true)
const videos = ref([])
const currentAid = ref(1)
let isLoading = false
const isAllDataLoaded = ref(false)
const isFollowing = ref(false)

// 前往编辑资料页面
const goToSetting = () => {
  router.replace('/user/setting')
}

// 前往编辑资料页面
const goToSetting = () => {
  router.replace('/user/setting')
}

// 切换关注状态的函数
async function toggleFollow() {
  try {
    const response = await axios.post(
      `${apiUrl.value}/api/space/follow/${route.params.uid}`
    )

    if (response.data) {
      if (response.data.state == 'succeed') {
        ElMessage({
          message: '关注成功',
          type: 'succeed',
        })
        isFollowing.value = !isFollowing.value
      } else {
        ElMessage({
          message: response.data.message,
          type: 'warning',
        })
      }
    }
  } catch (error) {
    ElMessage({
      message: error,
      type: 'error',
    })
  }
}

// 组件挂载后的操作
onMounted(async () => {
  const userResponse = await axios.get(
    `${apiUrl.value}/api/space/${route.params.uid}`
  )
  userInfo.value = userResponse.data

  const response = await axios.get(
    `${apiUrl.value}/api/space/is_following/${route.params.uid}`
  )
  isFollowing.value = response.data.isFollowing
})

// 加载更多视频的函数
async function loadMore() {
  if (isLoading || isAllDataLoaded.value) return

  isLoading = true

  try {
    const response = await axios.get(
      `${apiUrl.value}/api/space/videos/${route.params.uid}`,
      {
        params: { start: currentAid.value, count: 8 },
      }
    )
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
    ElMessage({
      message: error,
      type: 'error',
    })
  } finally {
    isLoading = false
  }
}

// 默认加载一次视频数据
loadMore()
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

.user-btn {
  margin-top: 10px;
}
</style>
