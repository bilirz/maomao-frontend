<template>
  <div>
    <mmCard v-if="videoInfo" :title="videoInfo.title" style="margin-bottom: 10px;">
      <div class="video-container">
        <video ref="videoElement" class="video-js vjs-default-skin" controls width="600"></video>
      </div>
      <el-button @click="toggleLike">点赞 ({{ videoInfo.data.like }})</el-button>
    </mmCard>
    <mmCard title="评论">
      <el-input type="textarea" v-model="newComment" placeholder="添加评论..." maxlength="200" show-word-limit></el-input>
      <el-button @click="postComment">提交</el-button>
      <div class="padding-div"></div>
      <div v-for="comment in comments" :key="comment._id" class="single-comment">
        <div>
          <!-- 显示评论楼层 -->
          <el-card shadow="hover">
            <strong class="user-name">{{ comment.username }}</strong>
            <small class="floor-number">&nbsp;{{ comment.floor }}楼</small>
            <p>{{ comment.content }}</p>
            <small class="floor-number">发布于{{ formatTimestamp(comment.time) }}</small>
          </el-card>
          <div class="padding-div"></div>
          <el-button @click="showReplyBox(comment._id)">回复</el-button>
        </div>

        <el-card v-if="comment.replies.length > 0" class="replies" shadow="hover">
          <div v-for="reply in comment.replies" :key="reply._id">
            <!-- 显示回复楼层 -->
            <strong class="user-name">{{ reply.username }}</strong>
            <small class="floor-number">&nbsp;{{ reply.floor }}楼</small>
            <small class="floor-number">发布于{{ formatTimestamp(reply.time) }}</small>
            <p>{{ reply.content }}</p>
          </div>
        </el-card>
        
        <div v-if="commentStates[comment._id]?.showReply" class="reply-box">
          <el-input type="textarea" v-model="commentStates[comment._id].replyContent" placeholder="回复..." maxlength="100" show-word-limit></el-input>
          <div class="padding-div"></div>
          <el-button @click="postReply(comment._id)">提交回复</el-button>
        </div>
      </div>
    </mmCard>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import 'videojs-contrib-hls';
import axios from 'axios';
import useFormat from "@/composables/useFormat";
import mmCard from '@/components/rzm/mmCard.vue';

const route = useRoute();
const aid = route.params.aid;
const store = useStore();
const apiUrl = computed(() => store.state.apiUrl);
const videoUrl = `${apiUrl.value}/api/video/${aid}/index.m3u8`;
// const posterUrl = `${apiUrl.value}/api/video/cover/${aid}`;
const { formatTimestamp } = useFormat();

const videoElement = ref(null);
const videoInfo = ref(null);
let player;

const incrementViewCount = async () => {
  await axios.post(`${apiUrl.value}/api/video/add/view/${aid}`);
}

const handlePlay = () => {
  incrementViewCount();
}

axios.get(`${apiUrl.value}/api/video/get/${aid}`)
  .then(response => {
    videoInfo.value = response.data;
  });

const loadVideoAndCover = async () => {
  try {
    await axios.get(videoUrl);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      ElNotification({
        title: '视频不存在！',
        message: '即将为您跳转到首页...',
        type: 'warning',
      });
      route.push('/');
    }
  }
};

const toggleLike = async () => {
  try {
    const response = await axios.post(`${apiUrl.value}/api/video/toggle/like/${aid}`);
    videoInfo.value.data.like += response.data.likes;
    ElMessage({
      message: '操作成功',
      type: 'success',
    });
  } catch (error) {
    const errorMessage = error.response?.data?.message || '操作失败，请稍后再试';
    ElMessage({
      message: errorMessage,
      type: 'error',
    });
  }
};


const newComment = ref("");  // 用于保存新评论的内容
const comments = ref([]);    // 用于保存从服务器获取的评论列表

const loadComments = async () => {
  const response = await axios.get(`${apiUrl.value}/api/video/comments/${aid}`);
  comments.value = response.data;
};

const lastCommentContent = ref("");  // 上一次成功提交的评论内容
const lastReplyContent = ref({});    // 键是commentId，值是上一次成功提交的回复内容


const postComment = async () => {
  const content = newComment.value;

  if (content === lastCommentContent.value) {
    ElMessage({
      message: '两次评论内容不能相同！',
      type: 'warning',
    });
    return;
  }

  newComment.value = "";
  try {
    await axios.post(`${apiUrl.value}/api/video/comment/${aid}`, { content });
    lastCommentContent.value = content;
    loadComments();
    ElMessage({
      message: '评论发布成功',
      type: 'success',
    });
  } catch (error) {
    const errorMessage = error.response?.data?.message || '评论发布失败，请稍后再试';
    ElMessage({
      message: errorMessage,
      type: 'error',
    });
  }
};


const commentStates = ref({});

const showReplyBox = (commentId) => {
  if (!commentStates.value[commentId]) {
    commentStates.value = { ...commentStates.value, [commentId]: { showReply: true, replyContent: "" } };
  } else {
    commentStates.value[commentId].showReply = true;
  }
};

const postReply = async (commentId) => {
  const content = commentStates.value[commentId].replyContent;

  if (content === lastReplyContent.value[commentId]) {
    ElMessage({
      message: '两次回复内容不能相同！',
      type: 'warning',
    });
    return;
  }

  commentStates.value[commentId].replyContent = "";
  commentStates.value[commentId].showReply = false;
  try {
    await axios.post(`${apiUrl.value}/api/video/reply/${commentId}`, { content });
    if (!lastReplyContent.value[commentId]) {
      lastReplyContent.value[commentId] = "";  // 如果不存在就初始化
    }
    lastReplyContent.value[commentId] = content; // 更新为当前成功提交的回复内容
    loadComments();
    ElMessage({
      message: '回复发布成功',
      type: 'success',
    });
  } catch (error) {
    const errorMessage = error.response?.data?.message || '回复发布失败，请稍后再试';
    ElMessage({
      message: errorMessage,
      type: 'error',
    });
  }
};

onMounted(async () => {
  await nextTick();
  
  loadVideoAndCover();
  loadComments();  // 页面加载时获取评论
  // 延迟初始化 video.js
  setTimeout(() => {
    player = videojs(videoElement.value, {
    controls: true,
    autoplay: false,
    preload: 'auto',
    playbackRates: [0.25, 0.5, 1, 1.5, 2, 3],
    fluid: true,
    controlBar: {
      volumePanel: false,
      pictureInPictureToggle: false,
      playbackRateMenuButton: false
    },
    sources: [{
      src: videoUrl,
      type: 'application/x-mpegURL'
    }]
  });

    player.on('play', handlePlay);
  }, 1000);
});

</script>

<style>
.user-name {
  color: #555;
}

.padding-div {
  padding: 10px;
}


.video-container video {
  width: 100%;
  height: 100%;
}

.comment-section {
  margin-top: 20px;
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.replies {
  margin-left: 30px;
  margin-top: 10px;
  border-left: 1px solid #eee;
  padding-left: 10px;
}
.single-comment {
  margin-bottom: 20px;
}

.reply-box {
  margin-top: 10px;
}

.floor-number {
  font-size: 0.8em;
  color: #888;
  margin-right: 5px;
}
</style>