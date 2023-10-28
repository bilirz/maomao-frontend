<template>
  <mmCard title="隐藏一个视频">
    <v-form ref="form" v-model="validForm">
      <v-text-field label="AID:" v-model="formData.aid" :rules="[rules.required]" required></v-text-field>
      <v-text-field label="封禁原因:" v-model="formData.reason" :rules="[rules.required]" required></v-text-field>
      <v-btn color="primary" @click="hideVideo" :disabled="!validForm">隐藏视频</v-btn>
    </v-form>
  </mmCard>
</template>

<script setup>
import axios from 'axios';
import { ref, computed } from 'vue';
import { useUrlStore } from '@/store/urlStore';
import mmCard from '@/components/rzm/mmCard.vue';

// 初始化URL存储
const urlStore = useUrlStore();

// 计算API的URL
const apiUrl = computed(() => urlStore.apiUrl);

// 初始化隐藏表单数据
const formData = ref({
  aid: '',
  reason: '',
  // grade: ''
});

// 隐藏视频的函数。
const hideVideo = async () => {
  try {
    const response = await axios.post(`${apiUrl.value}/api/admin/hide_video/${formData.value.aid}`, {
      reason: formData.value.reason,
      // grade: formData.value.grade
    });

    if (response.status === 200) {
      ElMessage.success('视频已隐藏');
    } else {
      ElMessage.error('隐藏视频失败');
    }
  } catch (error) {
    ElMessage.error('隐藏视频失败: ' + error.message);
  }
};

</script>