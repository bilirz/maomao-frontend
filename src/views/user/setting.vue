<!-- TODO: 用户头像 -->
<template>
  <div>
    <mmCard title="修改个人信息" v-if="!showSuccessResult">
      <el-form :model="formData" ref="VideoForm" label-position="top">
        <el-form-item
          label="头像"
          prop="face"
        >
          <el-upload
            class="face-uploader"
            :show-file-list="false"
            :before-upload="handlefaceSelection"
            accept="image/*"
          >
            <img v-if="finalfaceImage" class="face" :src="finalfaceImage" @error="event => event.target.src='/default_face.png'"/>
            <el-icon v-else class="face-uploader-icon"><Plus /></el-icon>
          </el-upload>
          <el-dialog :model-value="cropperVisible" @update:model-value="val => handleDialogClose(val)" width="30%">
            <vue-cropper
              ref="cropperRef"
              :key="cropperKey"
              :src="faceImagePreview"
              :aspect-ratio="1"
              :guides="true"
              :view-mode="1"
            />
            <span slot="footer" class="dialog-footer">
              <el-button @click="cropperVisible = false">取消</el-button>
              <el-button type="primary" @click="cropImage">裁剪</el-button>
            </span>
        </el-dialog>
        </el-form-item>
        <el-form-item
          label="昵称"
          prop="name"
          :rules="[{
            required: true,
            message: '昵称为必填项。'
          }]"
        >
          <el-input v-model="formData.name" placeholder="这里可以修改昵称哦！" prefix-icon="User"/>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="updateProfile"
            :loading="isSubmitting"
            :disabled="isSubmitting"
          >
            修改
          </el-button>
        </el-form-item>
      </el-form>
    </mmCard>
    <el-result
      v-if="showSuccessResult"
      icon="success"
      title="修改成功！"
      sub-title="头像将在压缩后显示"
    >
      <template #extra>
        <el-button type="primary" @click="goBack">返回到主页</el-button>
      </template>
    </el-result>
  </div>
</template>


<script setup>
import { ref, reactive, computed } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';
import 'cropperjs/dist/cropper.css';
import VueCropper from 'vue-cropperjs';

const cropperVisible = ref(false);
const finalfaceImage = ref(null);

const store = useStore();
const apiUrl = ref(store.state.apiUrl);
const cosUrl = computed(() => store.state.cosUrl);
const sessionData = computed(() => store.state.sessionData);
const cropperRef = ref();
const isSubmitting = ref(false);
const showSuccessResult = ref(false);


const formData = reactive({
  name: sessionData.value.name,
  faceFile: null,
});

const defaultfaceUrl = computed(() => `${cosUrl.value}/face/${sessionData.value.uid}.jpg`);
if (!finalfaceImage.value) {
  finalfaceImage.value = defaultfaceUrl.value;
}
const faceImagePreview = ref(null);
const handlefaceSelection = (file) => {
  if (file.size / 1024 / 1024 > 5) {
    ElMessage.error('图片大小不能超过5MB！');
    return false;
  }

  // 使用 FileReader 将选中的文件转为 dataURL 供 vue-cropper 使用
  const reader = new FileReader();
  reader.onload = (e) => {
    faceImagePreview.value = e.target.result;
    cropperVisible.value = true;
  };
  reader.readAsDataURL(file);

  return false; // 阻止自动上传
};

const cropImage = () => {
  const cropper = cropperRef.value.cropper;
  const canvas = cropper.getCroppedCanvas();

  canvas.toBlob((blob) => {
    formData.faceFile = new File([blob], "cropped-image.jpg", {
      type: "image/jpeg",
      lastModified: new Date().getTime()
    });
  }, "image/jpeg");

  finalfaceImage.value = canvas.toDataURL();
  cropperVisible.value = false;
  faceImagePreview.value = null;
};

// 防止裁剪器缓存
const cropperKey = ref(0);

const handleDialogClose = (val) => {
  cropperVisible.value = val;
  if (!val) {  
    faceImagePreview.value = null;
    cropperKey.value++;
  }
};

const updateProfile = async () => {
  isSubmitting.value = true;
  const formDataToSend = new FormData();

  formDataToSend.append('name', formData.name);
  
  if (formData.faceFile) {
    formDataToSend.append('face', formData.faceFile);
  }

  try {
    const response = await axios.post(`${apiUrl.value}/api/user/update`, formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (response.data && response.data.state == 'succeed') {
      ElNotification({
      title: '修改成功！',
      message: response.data.message,
      type: 'success',
    });
      showSuccessResult.value = true;
    } else {
      ElNotification({
      title: '修改失败！',
      message: response.data.message,
      type: 'warning',
    });
    }
  } catch (error) {
    // ElNotification({
    //   title: '修改失败！',
    //   message: error,
    //   type: 'error',
    // });
  }
};

const goBack = () => {
  location.reload(true);
  window.location.href = '/';
};
</script>

<style>
.face-uploader .face {
  width: 100px;
  height: 100px;
  display: block;
  object-fit: face; /* 保持图片的纵横比 */
  border-radius: 6px; /* 圆角效果 */
}

.face-uploader .el-upload {
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

.face-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
  background-color: #f5f5f5; /* 当悬停时深一点的背景颜色 */
}

.el-icon.face-uploader-icon {
  font-size: 32px; /* 稍大的图标 */
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
  transition: color 0.3s; /* 颜色过渡效果 */
}

.face-uploader .el-upload:hover .face-uploader-icon {
  color: var(--el-color-primary); /* 当悬停时，使用主题颜色 */
}
</style>