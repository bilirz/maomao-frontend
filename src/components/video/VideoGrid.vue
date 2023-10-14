<template>
  <el-row :gutter="16">
    <el-col v-for="video in videos" :key="video.aid" :xs="24" :md="{ span: 10, offset: 2 }" :lg="{ span: 8, offset: 0 }">
      <el-card @click="handleCardClick($event, video)" :body-style="{ padding: '10px' }" style="margin-bottom: 10px;">
        <div class="image-wrapper">
          <img v-if="!video.hidden || !video.hidden.is_hidden" :src="getVideoCover(video.aid)" class="image" />
          <div v-else class="banned-info">很抱歉，{{ video.hidden.reason }}</div>
          <span class="play-count">{{ video.data.view || '0' }}播放</span>
        </div>
        <div style="padding: 14px">
          <span class="title">{{ video.title }}</span>
          <div class="bottom">
            <span class="detail">UP主:{{ video.uploader_name }}</span>
            <span class="detail">{{ video.data.like || '0' }}点赞</span>
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const props = defineProps({
  videos: {
    type: Array,
    required: true
  }
});

const router = useRouter();
const store = useStore();
const apiUrl = computed(() => store.state.apiUrl);

const getVideoCover = aid => `${apiUrl.value}/api/video/cover/${aid}`;


function handleCardClick(event, video) {
  const card = event.currentTarget;
  const ripple = document.createElement("span");
  ripple.classList.add("ripple");
  
  const rect = card.getBoundingClientRect();
  
  ripple.style.left = `${event.clientX - rect.left}px`;
  ripple.style.top = `${event.clientY - rect.top}px`;
  
  card.appendChild(ripple);

  ripple.addEventListener("animationend", () => {
    ripple.remove();
    if (!video.hidden || !video.hidden.is_hidden) {
        router.push(`/video/${video.aid}`);
    }
  });
}
</script>

<style>

.detail {
  font-size: 12px;
  color: #999;
}

.title {
  font-size: 16px;
  color: #666;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}


.ripple {
  position: absolute;
  border-radius: 50%;
  background: rgba(182, 182, 182, 0.6);
  transform: scale(0);
  animation: ripple-animation 0.3s linear;
  pointer-events: none;
  width: 100px;
  height: 100px;
}

@keyframes ripple-animation {
  to {
    transform: scale(4);
    opacity: 0;
  }
}

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

.play-count {
  position: absolute;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 5px 10px;
  font-size: 15px; 
  border-top-right-radius: 5px;
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
</style>