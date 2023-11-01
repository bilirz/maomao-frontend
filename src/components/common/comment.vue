<template>
  <mmCard title="留言板">
    <v-text-field v-model="newComment" label="添加评论..." maxlength="200" counter></v-text-field>
    <v-btn @click="postComment">提交</v-btn>
    <div style="margin-top: 10px;"></div>
    <v-list>
      <div v-for="comment in comments" :key="comment._id">
        <mmvCard>
          <v-list-item>
            <v-list-item-title>
              <strong>#{{ comment.exp_rank }} / {{ comment.username }}</strong>
              <span class="floor-number">{{ comment.floor }}楼</span>
            </v-list-item-title>
            <v-list-item-subtitle>{{ formatTimestamp(comment.time) }}</v-list-item-subtitle>
            <p>{{ comment.content }}</p>
            <v-list-item-action>
              <v-btn size="small" @click="showReplyBox(comment._id)">回复</v-btn>
            </v-list-item-action>
          </v-list-item>
        </mmvCard>
        <mmvCard v-if="comment.replies.length > 0 || commentStates[comment._id]?.showReply" style="margin-left: 15px;">
          <v-list-item v-if="commentStates[comment._id]?.showReply">
            <v-text-field v-model="commentStates[comment._id].replyContent" label="回复..." maxlength="100" counter></v-text-field>
            <v-btn @click="postReply(comment._id)">提交回复</v-btn>
          </v-list-item>
          <v-list-item v-if="comment.replies.length > 0" v-for="reply in comment.replies" :key="reply._id">
            <v-list-item-title>
              <strong>#{{ reply.exp_rank }} / {{ reply.username }}</strong>
              <span class="floor-number">{{ reply.floor }}楼</span>
            </v-list-item-title>
            <v-list-item-subtitle>{{ formatTimestamp(reply.time) }}</v-list-item-subtitle>
            <p>{{ reply.content }}</p>
          </v-list-item>
        </mmvCard>
      </div>
    </v-list>
  </mmCard>
</template>

<script setup>
import axios from 'axios';
import { useUrlStore } from '@/store/urlStore';
import { ref, onMounted, computed } from 'vue';
import mmCard from '@/components/rzm/mmCard.vue';
import mmvCard from '@/components/rzm/mmvCard.vue';
import useFormat from "@/composables/useFormat";

const urlStore = useUrlStore();
const apiUrl = computed(() => urlStore.apiUrl);
const { formatTimestamp } = useFormat();

const props = defineProps({
  aid: {
    type: Number,
    default: null
  },
  type: {
    type: String,
    default: 'video'
  }
});

const newComment = ref("");  // 用于保存新评论的内容
const comments = ref([]);    // 用于保存从服务器获取的评论列表

const loadComments = async () => {
  const url = props.type === 'video' 
    ? `${apiUrl.value}/api/comment/${props.type}/${props.aid}`
    : `${apiUrl.value}/api/comment/${props.type}`;
  const response = await axios.get(url);
  comments.value = response.data;
};

const lastCommentContent = ref("");  // 上一次成功提交的评论内容
const lastReplyContent = ref({});    // 键是commentId，值是上一次成功提交的回复内容

// 评论逻辑
const postComment = async () => {
  const content = newComment.value;

  if (content === lastCommentContent.value) {
    ElMessage({
      message: '两次评论内容不能相同！',
      type: 'warning',
    });
    return;
  }

  try {
    const content = newComment.value;
    const url = props.type === 'video' 
      ? `${apiUrl.value}/api/comment/${props.type}/${props.aid}`
      : `${apiUrl.value}/api/comment/${props.type}`;
    await axios.post(url, { content });
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

  newComment.value = "";
};


// 显示/隐藏回复框的逻辑
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
  const url = `${apiUrl.value}/api/comment/${props.type}/reply/${commentId}`;
  try {
    await axios.post(url, { content });
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

onMounted(() => {
  loadComments();
});
</script>

<style scoped>
.floor-number {
  font-size: 0.8em;
  color: #888;
  margin-left: 7px;
}
</style>