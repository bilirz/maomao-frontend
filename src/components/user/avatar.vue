<template>
  <v-avatar :size="size">
    <img :src="imageSrc" alt="个人头像" class="avatar-image" @error="onImageError">
  </v-avatar>
</template>

<script setup>
import { ref, toRefs, onMounted } from 'vue';
import axios from 'axios';

// 定义接收的 props
const props = defineProps({
  size: {
    type: [String, Number],
    default: '60'
  },
  src: {
    type: String,
    required: true
  }
});

const { size, src } = toRefs(props);

const imageSrc = ref('');

onMounted(async () => {
  try {
    // 使用HEAD请求方法仅检查资源是否存在，不实际下载整个资源
    await axios.head(src.value);
    imageSrc.value = src.value;
  } catch (error) {
    imageSrc.value = '/default_avatar.png';
  }
});

// 当图像加载失败时更改图像源为默认图像
const onImageError = () => {
  imageSrc.value = '/default_avatar.png';
};
</script>

<style scoped>
.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
