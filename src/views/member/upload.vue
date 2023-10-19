<template>
  <div>
    <!-- 视频上传器 -->
    <div v-if="showUploader">
      <mmCard title="投稿一个视频">
        <el-upload
          class="upload-demo"
          drag
          :action="apiUrl + '/api/upload/video'"
          @change="onFileChange"
          :auto-upload="false"
          :show-file-list="false"
          accept="video/*"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">上传</div>
          <template #tip>
            <div class="el-upload__tip">
                文件大小不能超过100M。
            </div>
          </template>
        </el-upload>
        <el-progress :percentage="uploadProgress" v-if="isIndeterminateLoading" />
        <div v-if="uploadProgress === 100 && isIndeterminateLoading">正在加载...</div>
      </mmCard>
    </div>

    <!-- 视频信息填写 -->
    <div v-else  v-if="!showSuccessResult">
      <mmCard title="填写视频信息">

        <!-- 视频信息表单 -->
        <el-form :model="formData" ref="VideoForm" label-position="top">
          <el-form-item
            label="封面"
            prop="cover"
            :rules="[{
              required: true,
              message: '封面为必填项。'
            }]"
          >
            <el-upload
              class="avatar-uploader"
              :show-file-list="false"
              :before-upload="handleCoverSelection"
              accept="image/jpeg,image/png"
            >
              <!-- 图片预览 -->
              <img v-if="coverImagePreview" class="avatar" :src="coverImagePreview" />
              <!-- 上传图标 -->
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
          </el-form-item>
          <el-form-item
            label="标题"
            prop="title"
            :rules="[{
              required: true,
              message: '标题为必填项。'
            }]"
          >
            <el-input v-model="formData.title" placeholder="有趣的标题更容易被用户点击哦！" prefix-icon="User"/>
          </el-form-item>
          <el-form-item
            label="分区"
            prop="category"
            :rules="[{
              required: true,
              message: '分区为必填项。'
            }]"
          >
            <el-select v-model="formData.category" placeholder="选择一个分区">
              <el-option label="游戏" value="100"></el-option>
              <el-option label="生活" value="200"></el-option>
              <el-option label="知识" value="300"></el-option>
              <el-option label="科技" value="400"></el-option>
              <el-option label="音乐" value="500"></el-option>
              <el-option label="鬼畜" value="600"></el-option>
              <el-option label="动画" value="700"></el-option>
              <el-option label="时尚" value="800"></el-option>
              <el-option label="舞蹈" value="900"></el-option>
              <el-option label="娱乐" value="1000"></el-option>
              <el-option label="美食" value="1100"></el-option>
              <el-option label="动物" value="1200"></el-option>
            </el-select>
          </el-form-item>

          <!-- 简介 -->
          <el-form-item
            label="简介"
            prop="description"
          >
            <el-input type="textarea" v-model="formData.description" placeholder="为你的视频添加简介"></el-input>
          </el-form-item>
          <!-- 自制和转载的单选框 -->
          <el-form-item label="视频来源" prop="source" :rules="[{
            required: true,
            message: '视频来源为必填项。'
          }]">
            <el-radio-group v-model="formData.source" @change="handleSourceChange">
              <el-radio label="自制">自制</el-radio>
              <el-radio label="转载">转载</el-radio>
            </el-radio-group>
          </el-form-item>

          <!-- 如果选择了"转载"，则显示此文本框 -->
          <el-form-item v-if="formData.source === '转载'" label="出处" prop="origin" :rules="[{
            required: true,
            message: '转载必须填写出处。'
          }]">
            <el-input v-model="formData.origin" placeholder="请填写出处..."></el-input>
          </el-form-item>

          <!-- 标签输入 -->
          <el-form-item :label="`视频标签 (${formData.tags.length}/12)`" prop="tags" :rules="[tagsRule]">
            <div v-for="(tag, index) in formData.tags" :key="index" class="tag-item">
              <el-tag closable @close="handleTagClose(index)">{{ tag }}</el-tag>
            </div>
            <el-input
              v-model="currentTag"
              placeholder="输入标签后按回车确认"
              @keyup.enter="handleTagEnter"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitVideo" :disabled="isSubmitting">提交</el-button>
          </el-form-item>
          <p v-if="isSubmitting">正在上传，请不要关闭此页面...</p>
        </el-form>
      </mmCard>
    </div>
    <el-result v-if="showSuccessResult"
        icon="success"
        title="上传成功！"
        sub-title="视频将在转码后显示"
    >
        <template #extra>
          <el-button type="primary" @click="goBack">返回到主页</el-button>
        </template>
    </el-result>
  </div>
</template>

<script setup>
import { ref, watchEffect, reactive, toRaw } from 'vue';
import { useStore } from 'vuex';

import axios from 'axios';

const store = useStore();
const apiUrl = ref(store.state.apiUrl);

const showUploader = ref(true);
const uploadProgress = ref(0);
const isIndeterminateLoading = ref(false);
const isSubmitting = ref(false);
const showSuccessResult = ref(false);

const formData = reactive({
    title: '',
    filename: '',
    coverFile: null,
    category: '',
    description: '',
    source: '自制',
    origin: '',
    tags: []
  });


const handleSourceChange = () => {
  // 当选择"自制"时，清除出处字段
  if (formData.source === '自制') {
    formData.origin = '';
  }
};

const currentTag = ref(''); // 用于存储当前正在输入的标签

const tagsRule = {
  validator(_, value, callback) {
    if (value.length < 3) {
      callback(new Error('至少需要3个标签'));
    } else {
      callback();
    }
  },
  trigger: 'blur'
};

const handleTagEnter = () => {
    // 1. 检查currentTag是否为空
    if (!currentTag.value) {
        return;
    }

    // 2. 检查标签的长度
    if (currentTag.value.length > 12) {
        ElMessage.warning('每个标签的长度不能超过12个字符！');
        currentTag.value = '';
        return;
    }

    // 3. 检查重复的标签
    if (formData.tags.includes(currentTag.value)) {
        ElMessage.warning('该标签已经存在！');
        currentTag.value = '';
        return;
    }

    // 4. 检查标签总数是否已经是12
    if (formData.tags.length >= 12) {
        ElMessage.warning('只允许输入最多12个标签！');
        return;
    }

    formData.tags.push(currentTag.value);
    currentTag.value = '';
};

const handleTagClose = (index) => {
  formData.tags.splice(index, 1); // 删除指定索引的标签
};

const onFileChange = async (fileChangeEvent) => {
  const file = fileChangeEvent.raw;

  if (file.size / 1024 / 1024 > 100) {
    ElMessage.error('只支持100M以下的文件');
    return;
  }

  isIndeterminateLoading.value = true;

  const videoData = new FormData();
  videoData.append('file', file);

  try {
    const response = await axios.post(`${apiUrl.value}/api/upload/video`, videoData, {
      onUploadProgress: progressEvent => {
        uploadProgress.value = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      }
    });

    if (response.data.state === 'success') {
      formData.filename = response.data.filename;
      showUploader.value = false;
    } else {
      ElMessage.error(response.data.message);
    }
  } catch (error) {
    ElMessage.error('上传失败！请检查文件大小与后缀名');
    isIndeterminateLoading.value = false;
  }
};

const coverImagePreview = ref(null);
const handleCoverSelection = (file) => {
  if (file.size / 1024 / 1024 > 5) { // 限制封面大小为5MB
    ElMessage.error('图片大小不能超过5MB！');
    return false;
  }
  if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
    ElMessage.error('只支持上传JPEG和PNG格式的图片！');
    return false;
  }

  // 显示图片预览
  const reader = new FileReader();
  reader.onload = (e) => {
    coverImagePreview.value = e.target.result;
  };
  reader.readAsDataURL(file);
  formData.coverFile = file;

  return false; // 阻止自动上传
};

watchEffect(() => {
  if (!showUploader.value) {
    isIndeterminateLoading.value = false;
  }
});

const submitVideo = async () => {
  // 在提交前检查标签数量
  if (formData.tags.length < 3) {
    ElMessage.warning('标签至少需要3个！');
    isSubmitting.value = false; // 这里停止提交进程
    return; // 这里退出函数
  }

  isSubmitting.value = true;
  const data = new FormData();
  const rawFormData = toRaw(formData);

  // 这里添加每一个标签到FormData对象中
  formData.tags.forEach((tag, idx) => {
    data.append(`tag${idx}`, tag);
  });

  data.append('title', rawFormData.title);
  data.append('video', rawFormData.filename);
  data.append('category', rawFormData.category);
  data.append('description', rawFormData.description);
  data.append('cover', rawFormData.coverFile);
  data.append('source', rawFormData.source);
  data.append('origin', rawFormData.origin);
  data.append('tags', rawFormData.tags);

  try {
    const response = await axios.post(`${apiUrl.value}/api/upload/submit`, data);
    if (response.data.state === 'success') {
      ElMessage.success('上传成功！');
      showSuccessResult.value = true;
    } else {
      ElMessage.error(response.data.message);
    }
  } catch (error) {
    ElMessage.error('提交失败！');
  }
  isSubmitting.value = false; // 提交结束，无论成功或失败
};

const goBack = () => {
  location.reload(true);
  window.location.href = '/';
};
</script>

<style>
.avatar-uploader .avatar {
  width: 100px;
  height: 100px;
  display: block;
  object-fit: cover; /* 保持图片的纵横比 */
  border-radius: 6px; /* 圆角效果 */
}

.avatar-uploader .el-upload {
  border: 2px dashed var(--el-border-color);
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
  padding: 10px; /* 内部留白，让整个区域更易点击 */
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1); /* 阴影效果 */
  background-color: #fafafa; /* 背景颜色 */
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
  background-color: #f5f5f5; /* 当悬停时深一点的背景颜色 */
}

.el-icon.avatar-uploader-icon {
  font-size: 32px; /* 稍大的图标 */
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
  transition: color 0.3s; /* 颜色过渡效果 */
}

.avatar-uploader .el-upload:hover .avatar-uploader-icon {
  color: var(--el-color-primary); /* 当悬停时，使用主题颜色 */
}

.tag-item {
  display: inline-block;
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>