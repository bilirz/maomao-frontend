<template>
  <el-menu mode="horizontal" router>
    <el-menu-item index="/">
      <img src="../assets/logo.png" alt="MaoMaoLogo" width="20" height="20" style="padding-right: 6px;">
      <span>猫猫站</span>
    </el-menu-item>
    <el-menu-item index="/member/upload">投稿</el-menu-item>
    <el-sub-menu index="/user" v-if="!sessionData?.signin">
      <template #title>用户</template>
      <el-menu-item index="/user/signin">登录</el-menu-item>
      <el-menu-item index="/user/signup">注册</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="/user" v-if="sessionData?.signin">
      <template #title>用户</template>
      <el-menu-item @click="checkIn" v-if="sessionData?.signin">{{ hasCheckedIn ? '已签到' : '签到' }}</el-menu-item>
      <el-menu-item index="/user/setting">修改信息</el-menu-item>
      <el-menu-item>UID：{{ sessionData?.uid }}</el-menu-item>
      <el-menu-item>经验：{{ sessionData?.checkin.experience || 0 }}</el-menu-item>
      <el-menu-item>积分：{{ sessionData?.checkin.points || 0 }}</el-menu-item>
      <el-menu-item @click="signOut">退出登录</el-menu-item>
    </el-sub-menu>
    <el-menu-item v-if="sessionData?.status === 1" index="/admin/hidevideo">审核</el-menu-item>
  </el-menu>
</template>

<script setup>
import axios from 'axios';
import { computed, ref, onMounted } from 'vue';
import { useUserStore } from '@/store/userStore';
import { useUrlStore } from '@/store/urlStore';

// 初始化用户和URL存储
const userStore = useUserStore();
const urlStore = useUrlStore();

// 计算API的URL以及用户会话数据
const apiUrl = computed(() => urlStore.apiUrl);
const sessionData = computed(() => userStore.sessionData);

// 定义签到状态的引用
const hasCheckedIn = ref(false);

// 用户注销函数
const signOut = () => {
  axios.post(`${apiUrl.value}/api/user/signout`);
  location.reload();
}

// 获取签到状态
const fetchCheckInStatus = async () => {
  try {
    const response = await axios.get(`${apiUrl.value}/api/user/session/get`);
    if (response.data && response.data.checkin.can_checkin !== undefined) {
      // 注意这里使用"!"，因为如果"can_checkin"是true，那么用户还没有签到
      hasCheckedIn.value = !response.data.checkin.can_checkin;
    }
  } catch (error) {
    console.error('获取签到状态错误:', error);
  }
}

// 用户签到函数
const checkIn = async () => {
  try {
    const response = await axios.post(`${apiUrl.value}/api/user/checkin`);
    if (response.data.state == 'success') {
      hasCheckedIn.value = true;
      const userDataResponse = await axios.get(`${apiUrl.value}/api/user/session/get`);
      if (userDataResponse.data) {
        userStore.commit('SET_SESSION_DATA', userDataResponse.data);
      }
      ElNotification({
        title: '签到成功',
        message: response.data.message,
        type: 'success',
      });
    } else {
      ElNotification({
        title: '签到失败',
        message: response.data.message,
        type: 'warning',
      });
    }
  } catch (error) {
    ElNotification({
      title: '签到失败！',
      message: error,
      type: 'error',
    });
  }
}

// 在组件挂载后，获取签到状态
onMounted(fetchCheckInStatus);

</script>