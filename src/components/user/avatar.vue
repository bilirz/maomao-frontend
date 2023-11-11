<template>
  <v-avatar :size="props.size">
    <img
      :src="imageSrc"
      alt="个人头像"
      class="avatar-image"
      @error="onImageError"
    />
  </v-avatar>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useUrlStore } from '@/store/urlStore'

const urlStore = useUrlStore()
const faceUrl = computed(() => urlStore.faceUrl)

// 定义接收的 props
const props = defineProps({
  size: {
    type: [String, Number],
    default: '60',
  },
  uid: {
    type: [String, Number],
    required: true,
  },
})

const imageSrc = ref('')
let avatarURL = `${faceUrl.value}/face/${props.uid}.jpg`
let defaultAvatarURL = `${faceUrl.value}/public/default_avatar.png`

onMounted(async () => {
  try {
    // 使用HEAD请求方法仅检查资源是否存在，不实际下载整个资源
    await axios.head(avatarURL)
    imageSrc.value = avatarURL
  } catch (error) {
    imageSrc.value = defaultAvatarURL
  }
})

// 当图像加载失败时更改图像源为默认图像
const onImageError = () => {
  imageSrc.value = defaultAvatarURL
}
</script>

<style scoped>
.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
