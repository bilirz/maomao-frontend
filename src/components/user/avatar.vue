<template>
  <v-avatar :size="size">
    <img :src="src" alt="个人头像" class="avatar-image" @error="onImageError">
  </v-avatar>
</template>

<script setup>
import { ref, toRefs } from 'vue';

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

// 当图像加载失败时更改图像源为默认图像
const onImageError = () => {
  src.value = '/default_avatar.png';
};
</script>

<style scoped>
.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>