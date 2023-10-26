<template>
  <mmCard title="隐藏一个视频">
    <el-form ref="form" :model="formData" label-width="100px">
      <el-form-item label="AID:" :rules="[{required: true, message: 'AID为必填项。'}]">
        <el-input v-model="formData.aid"></el-input>
      </el-form-item>
      <el-form-item label="封禁原因:" :rules="[{required: true, message: '原因为必填项。'}]">
        <el-input v-model="formData.reason"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="hideVideo">隐藏视频</el-button>
      </el-form-item>
    </el-form>
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