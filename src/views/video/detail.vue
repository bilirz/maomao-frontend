<template>
  <div>
    <mmCard v-if="videoInfo" :title="`${videoInfo.aid}: ${videoInfo.title}`" style="margin-bottom: 10px;">
      <div class="video-container">
        <div id="dplayer"></div>
      </div>
    </mmCard>
    <mmCard v-if="videoInfo" title="详情" style="margin-bottom: 10px;">
      <div class="video-info">
        <div><el-button @click="toggleLike">点赞 ({{ videoInfo.data.like || '0' }})</el-button></div>
        <div v-if="videoInfo.description">{{ videoInfo.description || '0' }}</div>
        <div v-if="videoInfo.origin"><strong>搬运于:</strong> {{ videoInfo.origin }}</div>
        <div><strong>发布时间:</strong> {{ formatTimestamp(videoInfo.time) }}</div>
        <div v-if="formattedTags.length">
          <strong>标签:</strong> 
          <el-tag v-for="tag in formattedTags" :key="tag" style="margin-left: 10px">{{ tag }}</el-tag>
        </div>
      </div>
    </mmCard>
    <mmCard v-if="videoInfo && upInfo" title="UP主详情" style="margin-bottom: 10px;">
      <div class="video-info up-details">
        <div class="up-face">
          <img :src="upFaceUrl" alt="UP主头像" @error="event => event.target.src='/default_face.png'"  />
        </div>
        <div class="up-info-details">
          <strong class="up-name"><el-icon><User /></el-icon>{{ upInfo.name }}</strong>
          <p><svg t="1697734215269" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5547" width="15" height="15"><path d="M95.55512889 807.27608889A66.48263111 66.48263111 0 0 1 75.09333333 758.63381333c0-18.78698667 6.84487111-34.95253333 20.46179556-48.64227555L710.06435555 95.48231111A66.48263111 66.48263111 0 0 1 758.63381333 75.09333333c18.78698667 0 34.95253333 6.84487111 48.64227556 20.46179556l121.16878222 121.16878222c13.61692445 13.68974222 20.46179555 29.85528889 20.46179556 48.64227556 0 18.78698667-6.84487111 34.95253333-20.46179556 48.64227555L313.93564445 928.51768889a66.48263111 66.48263111 0 0 1-48.64227556 20.46179556 66.48263111 66.48263111 0 0 1-48.64227556-20.46179556l-121.16878222-121.16878222zM568.28814222 353.25724445l-406.17756444 406.17756444 102.45461333 102.45461333 406.17756444-406.17756444L568.28814222 353.25724445z m191.14666667-191.14666667L626.32391111 295.22147555l102.45461334 102.45461334 133.11089777-133.11089778-102.45461333-102.45461333z m-447.10115556-20.38897778c1.09226667-3.49525333 3.93216-5.17006222 8.51968-5.17006222 4.51470222 0 7.42741333 1.67480889 8.51968 5.09724444l20.46179556 40.99640889 44.41884444 6.77205334c4.51470222 0 7.35459555 2.03889778 8.51968 5.97105777 1.16508445 4.00497778 0 7.71868445-3.42243555 11.14112l-32.40391111 30.72910223 8.51968 44.34602666c0 4.51470222-1.45635555 8.00995555-4.29624889 10.19448889-2.83989333 2.33016889-6.5536 2.33016889-11.06830223 0l-39.24878222-20.38897778-39.3216 20.38897778c-4.51470222 2.33016889-8.15559111 2.33016889-10.99548444 0-2.91271111-2.18453333-4.29624889-5.67978667-4.29624889-10.19448889l8.51968-44.41884444-32.40391111-30.65628445c-3.42243555-3.42243555-4.58752-7.13614222-3.42243556-11.14112 1.16508445-3.93216 4.00497778-5.97105778 8.51968-5.97105777l44.41884445-6.77205334 20.38897777-40.99640889z m167.26243556-34.22435555c1.09226667-3.42243555 2.83989333-5.09724445 5.09724444-5.09724445 2.25735111 0 4.00497778 1.67480889 5.09724445 5.09724445l13.68974222 25.63185777 30.72910222 5.09724445c2.18453333 0 3.93216 1.45635555 5.09724445 4.29624888 1.16508445 2.83989333 0.58254222 4.80597333-1.67480889 5.97105778l-22.20942223 22.13660445 5.09724445 29.05429333c1.16508445 3.42243555 0.58254222 5.67978667-1.67480889 6.84487111a7.28177778 7.28177778 0 0 1-6.84487111 0l-27.30666667-13.68974222-27.30666666 13.68974222a7.28177778 7.28177778 0 0 1-6.84487112 0c-2.25735111-1.16508445-2.83989333-3.42243555-1.67480888-6.84487111l5.09724444-28.98147556-22.20942222-22.20942222c-2.18453333-1.16508445-2.83989333-3.13116445-1.67480889-5.97105778 1.16508445-2.91271111 2.91271111-4.29624889 5.09724445-4.29624888l30.72910222-5.09724445 13.68974222-25.63185777z m-327.68 0c1.09226667-3.42243555 2.83989333-5.09724445 5.09724444-5.09724445 2.25735111 0 4.00497778 1.67480889 5.09724445 5.09724445l13.68974222 25.63185777 30.72910222 5.09724445c2.18453333 0 3.93216 1.45635555 5.09724445 4.29624888 1.16508445 2.83989333 0.58254222 4.80597333-1.67480889 5.97105778l-22.20942223 22.13660445 5.09724445 29.05429333c1.16508445 3.42243555 0.58254222 5.67978667-1.67480889 6.84487111a7.28177778 7.28177778 0 0 1-6.84487111 0l-27.30666667-13.68974222-27.30666666 13.68974222a7.28177778 7.28177778 0 0 1-6.84487112 0c-2.25735111-1.16508445-2.83989333-3.42243555-1.67480888-6.84487111l5.09724444-28.98147556-22.20942222-22.20942222c-2.18453333-1.16508445-2.83989333-3.13116445-1.67480889-5.97105778 1.16508445-2.91271111 2.91271111-4.29624889 5.09724445-4.29624888l30.72910222-5.09724445 13.68974222-25.63185777z m709.97333333 380.61852444c1.09226667-2.25735111 2.83989333-3.42243555 5.09724445-3.42243556 2.25735111 0 4.00497778 1.16508445 5.09724444 3.42243556l13.68974222 27.30666666 30.72910222 3.42243556c2.18453333 1.09226667 3.93216 2.83989333 5.09724445 5.09724444 1.16508445 2.25735111 0.58254222 4.58752-1.67480889 6.84487112l-22.20942222 20.46179555 5.09724444 30.72910223c1.16508445 2.25735111 0.58254222 4.29624889-1.67480888 5.97105777-2.33016889 1.67480889-4.58752 1.96608-6.84487112 0.87381333l-27.30666666-15.3645511-27.30666667 15.29173333c-2.25735111 1.16508445-4.58752 0.87381333-6.84487111-0.80099556s-2.83989333-3.64088889-1.67480889-5.97105777l5.09724445-30.72910223-22.20942223-20.46179555c-2.18453333-2.25735111-2.83989333-4.58752-1.67480889-6.84487112a11.14112 11.14112 0 0 1 5.09724445-5.09724444l30.72910222-3.42243556 13.68974222-27.30666666z" p-id="5548" fill="#303133"></path></svg> {{ upInfo.experience || '0' }} 点经验</p>
          <el-button @click="$router.push(`/space/${videoInfo.uid}`)">前往TA的空间</el-button>
        </div>
      </div>
    </mmCard>
    <mmCard title="评论">
      <el-input type="textarea" v-model="newComment" placeholder="添加评论..." maxlength="200" show-word-limit></el-input>
      <div class="margin-div"></div>
      <el-button @click="postComment">提交</el-button>
      <div v-for="comment in comments" :key="comment._id" class="single-comment">
        <div>
          <!-- 显示评论楼层 -->
          <el-card shadow="hover">
            <strong class="user-name">{{ comment.username }}</strong>
            <small class="floor-number">&nbsp;{{ comment.floor }}楼</small>
            <p>{{ comment.content }}</p>
            <small class="floor-number">发布于{{ formatTimestamp(comment.time) }}</small>
          </el-card>
          <div class="margin-div"></div>
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
          <div class="margin-div"></div>
          <el-button @click="postReply(comment._id)">提交回复</el-button>
        </div>
      </div>
    </mmCard>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import axios from 'axios';
import useFormat from "@/composables/useFormat";
import mmCard from '@/components/rzm/mmCard.vue';
import DPlayer from 'dplayer';
import Hls from 'hls.js';
import { io } from 'socket.io-client';

const route = useRoute();
const aid = route.params.aid;
const store = useStore();
const apiUrl = computed(() => store.state.apiUrl);
const cosUrl = computed(() => store.state.cosUrl);
const sessionData = computed(() => store.state.sessionData);
const socket = io(apiUrl.value);

const oldOpen = XMLHttpRequest.prototype.open;

XMLHttpRequest.prototype.open = function() {
    oldOpen.apply(this, arguments);
    this.withCredentials = true;
};


let videoUrl;
if (parseInt(aid) > 116) {
    videoUrl = `${cosUrl.value}/videos/${aid}/${aid}.m3u8`;
} else {
    videoUrl = `${cosUrl.value}/videos/${aid}/index.m3u8`;
}

const posterUrl = `${cosUrl.value}/covers/${aid}.jpg`;
const { formatTimestamp, getCategoryByValue } = useFormat();

const videoInfo = ref(null);
const lastLikeClickTime = ref(0);

const formattedTags = computed(() => {
  if (videoInfo.value && videoInfo.value.tags) {
    let newTags = [];

    if (videoInfo.value.source) {
      newTags.push(videoInfo.value.source);
    }
    if (getCategoryByValue(videoInfo.category)) {
      newTags.push(getCategoryByValue(videoInfo.value.category));
    }

    return [...newTags, ...videoInfo.value.tags];
  }
  return [];
});


const incrementViewCount = async () => {
  await axios.post(`${apiUrl.value}/api/video/add/view/${aid}`);
}

axios.get(`${apiUrl.value}/api/video/get/${aid}`)
  .then(response => {
    videoInfo.value = response.data;
  });


const upInfo = ref(null); // 用于保存UP主的信息
const upFaceUrl = computed(() => `${cosUrl.value}/face/${videoInfo.value.uid}.jpg`);

// 当获取到videoInfo后，再去请求UP主的信息
watch(videoInfo, async () => {
  if (videoInfo.value) {
    const response = await axios.get(`${apiUrl.value}/api/space/${videoInfo.value.uid}`);
    upInfo.value = response.data;
  }
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
      window.location.href = "/";
    }
  }
};

const toggleLike = async () => {
  const currentTime = Date.now();
  if (currentTime - lastLikeClickTime.value < 1000) {
    ElMessage({
      message: '请稍等一秒再点击！',
      type: 'warning',
    });
    return;
  }
  lastLikeClickTime.value = currentTime;
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
    const dp = new DPlayer({
      container: document.getElementById('dplayer'),
      video: {
        url: videoUrl,
        type: 'hls',
        autoplay: false,
        customType: {
          'hls': function (video, player) {
            const hls = new Hls();
            hls.loadSource(video.src);
            hls.attachMedia(video);
          }
        },
      },
      // danmaku: {
      //   id: aid,
      //   api: `${apiUrl.value}/api/danmaku/`,
      //   user: sessionData.value['uid'],
      //   unlimited: true,
      // },
   });

    dp.on('play', function () {
      incrementViewCount();
    });

    // // 当收到新的弹幕时，向DPlayer添加弹幕
    // socket.on('danmaku', function (data) {
    //   console.log(1);
    //   dp.danmaku.draw(data);
    // });

    // // 当DPlayer的send()方法被调用时（即用户发送弹幕时），通过WebSocket发送弹幕数据
    // dp.on('danmaku_send', function (data) {
    //   console.log(data);
    //   socket.emit('send danmaku', data);
    // });
    
  }, 1000);
});



</script>

<style>
.user-name {
  color: #555;
}

.margin-div {
  margin: 10px;
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

.video-info div {
  margin-bottom: 15px;
}

.video-in strong {
  color: #333;
  margin-right: 8px;
}

.el-tag {
  background-color: #81cdff;
  color: white;
  border: none;
  border-radius: 15px;
  padding: 5px 15px;
}

.up-details {
  display: flex;
  align-items: center;
}

.up-face img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 15px;
}

.up-name {
  font-size: 1.2em;
  margin-bottom: 10px;
}

.up-info-details {
  flex-grow: 1;
}
</style>