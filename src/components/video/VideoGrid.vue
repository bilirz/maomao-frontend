<template>
  <v-row class="video-container d-flex mt-2 mb-2">
    <v-col
      v-for="video in videos"
      :key="video.aid"
      cols="6"
      md="3"
      lg="3"
      class="video-col"
    >
      <v-card class="video-card" @click="handleCardClick($event, video)">
        <div
          v-if="!video.hidden || !video.hidden.is_hidden"
          class="image-wrapper"
        >
          <v-img :src="getVideoCover(video.aid)" class="image" />
          <div class="video-overlay">
            <div class="video-info">
              <span class="white-text pr-5"
                ><v-icon icon="mdi-play-box" class="icon" />{{
                  video.data.view || '0'
                }}</span
              >
              <span class="white-text pr-5"
                ><v-icon icon="mdi-thumb-up" class="icon" />{{
                  video.data.like || '0'
                }}</span
              >
              <span class="white-text"
                ><v-icon icon="mdi-account-box" class="icon" />{{
                  video.uploader_name
                }}</span
              >
            </div>
          </div>
        </div>
        <div v-else class="banned-info">
          <p>很抱歉，{{ video.hidden.reason }}</p>
          <p>操作人：{{ video.hidden.operator_name }}</p>
        </div>
        <v-card-title class="multiline-title truncate-title">{{
          video.title
        }}</v-card-title>
      </v-card>
    </v-col>
    <v-col v-if="hasMore" cols="12" class="text-center">
      <v-btn @click="emitLoadMore">加载更多</v-btn>
    </v-col>
  </v-row>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUrlStore } from '@/store/urlStore'

// 定义组件属性
const props = defineProps({
  videos: {
    type: Array,
    required: true,
  },
  hasMore: {
    type: Boolean,
    default: true,
  },
})

const router = useRouter()
const urlStore = useUrlStore()
const cosUrl = computed(() => urlStore.cosUrl)

// 根据aid获取视频封面
const getVideoCover = (aid) => `${cosUrl.value}/covers/${aid}.jpg`

// 处理视频卡片的点击事件
function handleCardClick(event, video) {
  if (!video.hidden || !video.hidden.is_hidden) {
    router.push(`/video/${video.aid}`)
  }
}

// 定义发射的事件
const emits = defineEmits(['load-more'])

function emitLoadMore() {
  if (props.hasMore) {
    emits('load-more')
  }
}
</script>

<style scoped>
.video-col {
  padding: 5px;
}

.video-card {
  position: relative;
  cursor: pointer;
  height: 300px;
  display: flex;
  flex-direction: column;
}

.video-card > div {
  flex: 1;
}

.truncate-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  font-size: 15px;
  color: #555;
}

.image-wrapper {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 */
  overflow: hidden;
}

.image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: all 0.3s ease;
}

.video-card:hover .image {
  transform: scale(1.05);
}

.video-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
}

.white-text {
  color: white;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.6);
}

.icon {
  margin-right: 5px;
}

.video-info {
  font-size: 12px;
}

.banned-info {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(176, 225, 255, 0.7);
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  text-align: center;
}

@media (max-width: 600px) {
  .no-spacing-small-screens {
    padding: 4px !important;
  }
  .video-container * {
    font-size: 14px;
  }
}

.multiline-title {
  white-space: normal !important;
  overflow: visible !important;
}

.video-container {
  display: flex;
  flex-wrap: wrap;
}
</style>
