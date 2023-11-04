<template>
  <div>
    <mmCard v-if="props.videoInfo" :title="`${props.videoInfo.aid}: ${props.videoInfo.title}`" style="margin-bottom: 10px;">
      <div class="video-wrapper">
        <div class="danmaku-layer">
          <div 
              v-for="danmaku in activeDanmakus"
              :key="danmaku.danmaku_id"
              :data-danmaku-id="danmaku.danmaku_id"
              class="danmaku-item"
              :class="danmaku.type"
              :style="{ 
                color: danmaku.color, 
                top: danmaku.type === 'scroll' ? `${danmaku.position}px` : (danmaku.type === 'top' ? `${danmaku.position * 25}px` : 'auto'), 
                bottom: danmaku.type === 'bottom' ? `${danmaku.position * 25}px` : 'auto' 
              }"
          >
              {{ danmaku.content }}
          </div>
        </div>
        <video ref="videoElement" class="video-js vjs-default-skin" controls width="600"></video>
      </div>
      <div class="danmaku-bar">
        <v-row>
          <v-col cols="4" class="hidden-sm-and-down">
            <span class="danmaku-info">弹幕BETA版测试</span>
          </v-col>
          <v-col cols="12" md="8">
            <div class="danmaku-controls" :class="{ 'input-focused': isInputFocused }">
              <div class="input-wrapper">
                <el-popover class="blur-popover" placement="top-start" :width="popoverWidth" trigger="hover">
                  <template #reference>
                    <div v-bind="props" class="danmaku-style-btn">A</div>
                  </template>
                  <v-row>
                    <v-col  xs="12" md="6">
                      <div>样式</div>
                      <v-radio-group :inline="isInline" v-model="selecteddanmakuType">
                        <v-radio label="顶部" value="top"></v-radio>
                        <v-radio label="滚动" value="scroll"></v-radio>
                        <v-radio label="底部" value="bottom"></v-radio>
                      </v-radio-group>
                    </v-col>
                    <v-col xs="12" md="6">
                      <div>颜色</div>
                      <div class="color-selection">
                        <div 
                          v-for="color in colors"
                          :key="color" 
                          class="color-box" 
                          :style="{ backgroundColor: color }"
                          :class="{ 'selected': selectedColor === color }"
                          @click="selectColor(color)"
                        ></div>
                      </div>
                    </v-col>
                  </v-row>
                </el-popover>
                <input v-model="danmakuContent" class="danmaku-input" placeholder="输入弹幕内容..." @focus="isInputFocused = true" @blur="isInputFocused = false">
              </div>
              <div class="send-btn" @click="sendDanmaku">发送</div>
            </div>
          </v-col>
        </v-row>
      </div>
    </mmCard>
  </div>
</template>

<script setup>
import axios from 'axios';
import 'video.js/dist/video-js.css';
import videojs from 'video.js';
import { useUrlStore } from '@/store/urlStore';
import { ref, onMounted, nextTick, computed, onUnmounted } from 'vue';
import mmCard from '@/components/rzm/mmCard.vue';

const urlStore = useUrlStore();
const apiUrl = computed(() => urlStore.apiUrl);

const props = defineProps({
  videoUrl: String,
  videoInfo: Object,
});

const videoElement = ref(null);
let player;

const incrementViewCount = async () => {
  await axios.post(`${apiUrl.value}/api/video/add/view/${props.videoInfo.aid}`);
}

const loadVideoAndCover = async () => {
  try {
    await axios.get(props.videoUrl);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      ElNotification({
        title: '视频不存在！',
        message: '即将为您跳转到首页...',
        type: 'warning',
      });
      window.location.href = "/";
    }
  }
};

onMounted(async () => {
  await nextTick();
  await fetchDanmakus();
  loadVideoAndCover();
    player = videojs(videoElement.value, {
      controls: true,
      autoplay: false,
      preload: 'auto',
      playbackRates: [0.25, 0.5, 1, 1.5, 2, 3],
      fluid: true,
      // 这里设置16:9
      aspectRatio: '16:9',
      controlBar: {
        volumePanel: false,
        pictureInPictureToggle: false,
        playbackRateMenuButton: false
      },
      sources: [{
        src: props.videoUrl,
        type: 'application/x-mpegURL'
      }]
    });
    player.on('play', incrementViewCount);


    // !!!下面是弹幕功能实现


    player.on('timeupdate', () => {
      const currentTime = player.currentTime();

      // 获取与当前时间匹配的弹幕
      const matchedDanmakus = danmakus.value.filter(danmaku => Math.abs(currentTime - danmaku.video_time) < 0.5);

      matchedDanmakus.forEach(danmaku => {
        if (!shownDanmakuIds.value.includes(danmaku.danmaku_id)) {
          danmaku.displayStartTime = currentTime;
          danmaku.position = getPositionForDanmaku(danmaku.type);
          activeDanmakus.value.push(danmaku);
          shownDanmakuIds.value.push(danmaku.danmaku_id);
        }
      });

      // 删除已经过期的弹幕
      activeDanmakus.value = activeDanmakus.value.filter(danmaku => {
        const displayTime = getDisplayTimeForType(danmaku.type);
        const isExpired = currentTime - (danmaku.displayStartTime || 0) > displayTime;
        if (isExpired && danmaku.type === 'scroll') {
          occupiedRows.value = occupiedRows.value.filter(row => row !== danmaku.position / 25);
        }
        return !isExpired;
      });

    });

    // 获取弹幕的显示时间
    function getDisplayTimeForType(type) {
      switch (type) {
        case 'top':
        case 'bottom':
          return 5;
        case 'scroll':
          return 15;
        default:
          return 5;
      }
    }
    
    // 获取弹幕的位置
    player.on('play', () => {
      const danmakuElements = document.querySelectorAll('.danmaku-item');
      danmakuElements.forEach(element => {
        element.style.animationPlayState = 'running';
      });
    });

    player.on('pause', () => {
      const danmakuElements = document.querySelectorAll('.danmaku-item');
      danmakuElements.forEach(element => {
        element.style.animationPlayState = 'paused';
      });
    });
    const playerElement = player.el();
    const danmakuLayer = document.querySelector('.danmaku-layer');
    
    player.on('seeking', () => {
      shownDanmakuIds.value = [];
      activeDanmakus.value = [];
    });
    // 将danmakuLayer移动到vjs_video_3元素内，vjs_video_3是video.js全屏实际渲染的根元素
    playerElement.appendChild(danmakuLayer);
});


const danmakuContent = ref('');
const isInputFocused = ref(false);
const colors = ['#fa4b4b', '#ff8b3d', '#eddd2b', '#13d74e', '#61aefb', '#97aaff', '#ff5dd9', '#ffffff']
const selecteddanmakuType = ref('scroll');
const selectedColor = ref('#ffffff')
const selectColor = color => {
  selectedColor.value = color;
}

const popoverWidth = computed(() => {
  return window.innerWidth <= 768 ? 300 : 500;
});
const isInline = computed(() => {
  return window.innerWidth <= 768;
});

const occupiedRows = ref([]);

function getRightEdge(el) {
  const rect = el.getBoundingClientRect();
  return rect.right;
}

function getPositionForDanmaku(type) {
  if (type !== 'scroll') {
    const activeOfType = activeDanmakus.value.filter(d => d.type === type);
    let position = 0;
    while (activeOfType.some(d => d.position === position)) {
      position++;
    }
    return position;
  } else {
    // 获取所有活动的滚动弹幕元素
    const danmakuElements = document.querySelectorAll('.danmaku-item.scroll');

    for (let i = 0; ; i++) {
      let hasOverlap = false;
      for (let el of danmakuElements) {
        // 仅仅对于相同行的弹幕进行检查
        if (parseInt(el.style.top, 10) === i * 25) { 
          if (getRightEdge(el) > window.innerWidth * 0.8) { 
            // 如果弹幕的右边界还没有离开屏幕的80%位置，则认为与新弹幕有重叠
            // TODO: 计算弹幕的宽度，而不是使用80%的屏幕宽度
            hasOverlap = true;
            break;
          }
        }
      }
      if (!hasOverlap) {
        // 没有重叠的话，使用这一行
        return i * 25;
      }
    }
  }
}


const sendDanmaku = async () => {
  if (!danmakuContent.value.trim()) return;  // 检查弹幕内容是否为空

  const currentdanmaku = {
    content: danmakuContent.value,
    type: selecteddanmakuType.value,
    color: selectedColor.value,
    video_time: player.currentTime(),
    aid: props.videoInfo.aid,
    position: getPositionForDanmaku(selecteddanmakuType.value)
  };

  try {
    const response = await axios.post(`${apiUrl.value}/api/danmaku/send`, currentdanmaku);

    if (response.data && response.data.state == 'succeed') {
      ElNotification({
        title: '发送成功',
        message: '弹幕发送成功!',
        type: 'success',
      });
      currentdanmaku.displayStartTime = player.currentTime();
      activeDanmakus.value.push(currentdanmaku);

      if (response.data.danmaku_id) {
        shownDanmakuIds.value.push(response.data.danmaku_id);
      }
    } else {
      ElNotification({
        title: '发送失败',
        message: response.data.message || '弹幕发送失败',
        type: 'error',
      });
    }
  } catch (error) {
    ElNotification({
      title: '错误',
      message: error.message || '弹幕发送失败',
      type: 'error',
    });
  }

  danmakuContent.value = '';  // 清空输入框
};


const danmakus = ref([]);
const activeDanmakus = ref([]);
const shownDanmakuIds = ref([]);

const fetchDanmakus = async () => {
  try {
    const response = await axios.get(`${apiUrl.value}/api/danmaku/${props.videoInfo.aid}`);
    danmakus.value = response.data.danmakus;
  } catch (error) {
    console.error("Error fetching danmakus:", error);
  }
};

// 用于存储弹幕消失的定时器
const danmakuTimeouts = ref([]);


onUnmounted(() => {
  // 当组件卸载时，清除所有的定时器
  danmakuTimeouts.value.forEach(clearTimeout);
});

// 加入模糊效果
const style = document.createElement('style');
style.innerHTML = `
  .el-popper.is-light.el-popover {
    backdrop-filter: blur(6px) !important;
    background-color: rgba(255, 255, 255, 0.8) !important;
  }
`;
document.head.appendChild(style);

</script>

<style scoped>
.danmaku-bar {
  background-color: #ffffff;
  width: auto;
  height: 50px;
  border-radius: 8px;
  padding: 5px 15px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.205);
}

.danmaku-info {
  line-height: 40px;
  display: block;
  color: #555;
  font-size: 18px;
}

.danmaku-controls {
  display: flex;
  align-items: center;
  background-color: #F1F2F3;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* 添加轻微的阴影效果 */
  border-radius: 8px;
}

.danmaku-controls.input-focused {
  border-color: #888;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.input-wrapper {
  display: flex;
  align-items: center;
  flex: 1;
}

.danmaku-style-btn {
  background-color: transparent;
  border: none;
  color: #333;
  cursor: pointer;
  margin-right: 5px;
  margin-left: 15px
}

.danmaku-input {
  width: 100%;
  height: 30px;
  background-color: #F1F2F3;
  padding: 0 10px;
  line-height: 30px;
  transition: all 0.3s ease;

  &:focus {
    outline: none; /* 去除默认的浏览器描边 */
  }
}

.send-btn {
  background-color: #2d93ff;
  color: #fff;
  padding: 5px 10px;
  margin-left: 10px;
  border-radius: 0 8px 8px 0; /* 使左侧没有圆角 */
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.send-btn:hover {
  background-color: #007ce9; /* 加深的颜色 */
}

.color-selection {
  display: flex;
  gap: 10px;
}

.color-box {
  width: 25px;
  height: 25px;
  border-radius: 5px;
  transition: border 0.3s;
}

.color-box.selected {
  border: 3px solid #000;
}

@media only screen and (max-width: 600px) {
  .blur-popover {
    width: 300px !important;
  }

  .el-popover, 
  .el-popover * {
    transform: scale(0.98);
  }
}

.video-wrapper {
  position: relative;
  width: auto;
  overflow: hidden;
}

.danmaku-layer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.danmaku-item {
  position: absolute;
  white-space: nowrap;
  font-size: 20px;
  opacity: 0.8;
  animation-fill-mode: forwards;
  text-shadow: 0px 0px 1px black, 0px 0px 2px black, 0px 0px 3px black
}


.danmaku-item.scroll {
  animation: scrollDanmaku 9s linear 1;
  left: 100%;
}

/* 顶部弹幕动画 */
.danmaku-item.top {
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}

/* 底部弹幕动画 */
.danmaku-item.bottom {
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}


@keyframes scrollDanmaku {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(calc(-100% - 100vw));
  }
}
</style>