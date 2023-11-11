<template>
  <div>
    <div v-if="videoInfo" class="mb-3">
      <h2 style="color: #555">{{ videoInfo.title }}</h2>
      <div class="video-info">
        <div style="font-size: 13px; color: #888">
          <span class="mr-4"
            ><v-icon icon="mdi-play-box" class="mr-1" />{{
              videoInfo.data.view
            }}</span
          >
          <span class="mr-4"
            ><v-icon icon="mdi-message-reply-text" class="mr-1" />{{
              videoInfo.data.danmaku
            }}</span
          >
          <span
            ><v-icon icon="mdi-timer-outline" class="mr-1" />
            {{ formatTimestamp(videoInfo.time) }}</span
          >
        </div>
      </div>
    </div>
    <player
      v-if="videoInfo"
      :video-url="videoUrl"
      :aid="videoInfo.aid"
      :video-info="videoInfo"
      class="mb-3"
    />
    <mmvCard v-if="videoInfo" class="mb-3">
      <div class="video-info">
        <div>
          <div
            :style="
              videoInfo.is_liked ? { color: '#65A5EF' } : { color: '#555' }
            "
          >
            <v-icon
              :icon="
                videoInfo.is_liked ? 'mdi-thumb-up' : 'mdi-thumb-up-outline'
              "
              class="mr-1"
              @click="toggleLike"
            ></v-icon>
            <span @click="toggleLike">{{ videoInfo.data.like || '0' }}</span>
          </div>
        </div>
        <div class="mt-3" style="color: #555">
          {{ videoInfo.description || '-' }}
        </div>
        <div v-if="videoInfo.origin" style="color: #555">
          <strong>搬运于:</strong> {{ videoInfo.origin }}
        </div>
        <div v-if="formattedTags.length" class="mt-3 -ml-2">
          <el-tag v-for="tag in formattedTags" :key="tag" class="ml-3">{{
            tag
          }}</el-tag>
        </div>
      </div>
    </mmvCard>
    <mmvCard v-if="videoInfo && upInfo" class="mb-3">
      <div class="video-info up-details">
        <avatar :uid="videoInfo.uid" class="mr-5"></avatar>
        <div class="up-info-details">
          <v-icon icon="mdi-account-circle" class="mr-3 mb-3" /><strong
            class="up-name"
            >#{{ upInfo.exp_rank }} / {{ upInfo.name }}</strong
          >
          <p>
            <v-icon icon="mdi-battery-plus-variant" class="mr-1.25 mb-3" />
            {{ (upInfo.experience || '0').toFixed(1) }} 点经验
          </p>
          <v-btn @click="$router.push(`/space/${videoInfo.uid}`)"
            >前往TA的空间</v-btn
          >
        </div>
      </div>
    </mmvCard>
    <comment :aid="+aid"></comment>
  </div>
</template>

<script setup>
import axios from 'axios'
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useUrlStore } from '@/store/urlStore'
import mmvCard from '@/components/rzm/mmvCard.vue'
import avatar from '@/components/user/avatar.vue'
import comment from '@/components/common/comment.vue'
import player from '@/components/video/player.vue'
import useFormat from '@/composables/useFormat'

const route = useRoute()
const aid = route.params.aid
const urlStore = useUrlStore()
const apiUrl = computed(() => urlStore.apiUrl)
const cosUrl = computed(() => urlStore.cosUrl)

let videoUrl
if (parseInt(aid) > 116) {
  videoUrl = `${cosUrl.value}/videos/${aid}/${aid}.m3u8`
} else {
  videoUrl = `${cosUrl.value}/videos/${aid}/index.m3u8`
}

const { formatTimestamp, getCategoryByValue } = useFormat()

const videoInfo = ref(null)
const lastLikeClickTime = ref(0)

// 格式化视频标签
const formattedTags = computed(() => {
  if (videoInfo.value && videoInfo.value.tags) {
    let newTags = []

    if (videoInfo.value.source) {
      newTags.push(videoInfo.value.source)
    }
    if (getCategoryByValue(videoInfo.value.category)) {
      newTags.push(getCategoryByValue(videoInfo.value.category))
    }

    return [...newTags, ...videoInfo.value.tags]
  }
  return []
})

// 获取视频信息
axios.get(`${apiUrl.value}/api/video/get/${aid}`).then((response) => {
  videoInfo.value = response.data
})

const upInfo = ref(null)

// 当有videoInfo时，获取UP主信息
watch(videoInfo, async () => {
  if (videoInfo.value) {
    const response = await axios.get(
      `${apiUrl.value}/api/space/${videoInfo.value.uid}`
    )
    upInfo.value = response.data
  }
})

// 点赞功能，防止用户连续点击
const toggleLike = async () => {
  const currentTime = Date.now()
  if (currentTime - lastLikeClickTime.value < 1000) {
    ElMessage({
      message: '请稍等一秒再点击！',
      type: 'warning',
    })
    return
  }
  lastLikeClickTime.value = currentTime
  try {
    const response = await axios.post(
      `${apiUrl.value}/api/video/toggle/like/${aid}`
    )
    // 切换点赞状态
    videoInfo.value.data.like += response.data.likes
    videoInfo.value.is_liked = !videoInfo.value.is_liked
    ElMessage({
      message: '操作成功',
      type: 'success',
    })
  } catch (error) {
    const errorMessage = error.response?.data?.message || '操作失败，请稍后再试'
    ElMessage({
      message: errorMessage,
      type: 'error',
    })
  }
}
</script>

<style scoped>
.video-info {
  margin-bottom: 15px;
}

.video-info h3 {
  font-size: 1.4em;
  font-weight: bold;
  margin-bottom: 10px;
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
