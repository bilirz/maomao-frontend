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
          accept="video/mp4,video/avi,video/mov"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">上传</div>
          <template #tip>
            <div class="el-upload__tip">
                目前支持上传mp4、avi和mov视频，文件大小不能超过100M。
            </div>
          </template>
        </el-upload>
        <el-progress :percentage="uploadProgress" v-if="isIndeterminateLoading" />
        <div v-if="uploadProgress === 100 && isIndeterminateLoading">正在转码...</div>
      </mmCard>
    </div>

    <!-- 视频信息填写 -->
    <div v-else>
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
          <el-form-item>
            <el-button type="primary" @click="submitVideo">提交</el-button>
          </el-form-item>
        </el-form>
      </mmCard>
    </div>
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

const formData = reactive({
    title: '',
    filename: '',
    coverFile: null,
    category: '',
    description: ''
  });

const onFileChange = async (fileChangeEvent) => {
  const file = fileChangeEvent.raw;
  if (file && file.type !== 'video/mp4' && file.type !== 'video/avi' && file.type !== 'video/mov') {
    ElMessage.error('只支持上传mp4格式的视频！');
    return;
  }

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
  const data = new FormData();
  const rawFormData = toRaw(formData);

  data.append('title', rawFormData.title);
  data.append('video', rawFormData.filename);
  data.append('category', rawFormData.category);
  data.append('description', rawFormData.description);
  data.append('cover', rawFormData.coverFile);

  try {
    const response = await axios.post(`${apiUrl.value}/api/upload/submit`, data);
    if (response.data.state === 'success') {
      ElMessage.success('上传成功！');
    } else {
      ElMessage.error(response.data.message);
    }
  } catch (error) {
    ElMessage.error('提交失败！');
  }
};
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 100px;
  height: 100px;
  display: block;
  object-fit: cover; /* 保持图片的纵横比 */
  border-radius: 6px; /* 圆角效果 */
}

</style>

/* Global Style */
<style>
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
</style>