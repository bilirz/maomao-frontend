<template>
  <v-row style="margin-top: 10px; margin-bottom: 10px;" class="video-container">
    <v-col v-for="video in videos" :key="video.aid" cols="6" md="4" lg="4" class="no-spacing-small-screens">
      <v-card @click="handleCardClick($event, video)" style="padding: 10px;">
        <div v-if="!video.hidden || !video.hidden.is_hidden" class="image-wrapper">
          <v-img :src="getVideoCover(video.aid)" class="image" />
          <v-badge color="grey" content-class="play-count-content" overlap left bottom>
            <template v-slot:badge>
              &nbsp;&nbsp;&nbsp;<v-icon icon="mdi-thumb-up" style="margin-right: 10px;" />{{ video.data.like || '0' }}
            </template>
          </v-badge>
        </div>
        <div v-else class="banned-info">
          <p>很抱歉，{{ video.hidden.reason }}</p>
          <p>操作人：{{ video.hidden.operator_name }}</p>
        </div>
        <v-card-title class="multiline-title">
          {{ video.title }}
        </v-card-title>
        <v-card-subtitle>
          <v-row class="no-gutters">
            <v-col>
              <v-icon icon="mdi-account-box" style="margin-right: 10px;" />{{ video.uploader_name }}
            </v-col>
            <v-col>
              <v-icon icon="mdi-play-box" style="margin-right: 10px;" />{{ video.data.view || '0' }}
            </v-col>
          </v-row>
        </v-card-subtitle>
      </v-card>
    </v-col>
    <v-col v-if="hasMore" cols="12" class="text-center">
      <v-btn @click="emitLoadMore">加载更多</v-btn>
    </v-col>
  </v-row>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUrlStore } from '@/store/urlStore';

// 定义组件属性
const props = defineProps({
  videos: {
    type: Array,
    required: true
  },
  hasMore: {
    type: Boolean,
    default: true
  }
});

const router = useRouter();
const urlStore = useUrlStore();
const cosUrl = computed(() => urlStore.cosUrl);

// 根据aid获取视频封面
const getVideoCover = aid => `${cosUrl.value}/covers/${aid}.jpg`;

// 处理视频卡片的点击事件
function handleCardClick(event, video) {
  if (!video.hidden || !video.hidden.is_hidden) {
    router.push(`/video/${video.aid}`);
  }
}

// 定义发射的事件
const emits = defineEmits(['load-more']);

function emitLoadMore() {
  if (props.hasMore) {
    emits('load-more');
  }
}
</script>

<style scoped>
.image-wrapper {
  width: 100%;
  padding-bottom: 56.25%;
  position: relative;
  overflow: hidden;
}

.image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
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
  .no-spacing-small-screens{
    padding: 4px  !important;
  }
  .video-container * { /* 选择video-container类下的所有子元素 */
      font-size: 14px; /* 例如，设置字体大小为14px */
  }
}

.multiline-title {
  white-space: normal !important;
  overflow: visible !important;
}
</style>