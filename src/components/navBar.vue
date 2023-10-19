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
import { computed, ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';

const store = useStore();
const apiUrl = computed(() => store.state.apiUrl);
const sessionData = computed(() => store.state.sessionData);
const hasCheckedIn = ref(false);

const signOut = () => {
  axios.post(`${apiUrl.value}/api/user/signout`)
  location.reload()
}

const fetchCheckInStatus = async () => {
  try {
    const response = await axios.get(`${apiUrl.value}/api/user/session/get`);
    if (response.data && response.data.checkin.can_checkin !== undefined) {
      hasCheckedIn.value = !response.data.checkin.can_checkin;  // 注意这里我们使用"!"，因为如果"can_checkin"是true，那么用户还没有签到
    }
  } catch (error) {
    console.error('Error fetching check-in status:', error);
  }
}

const checkIn = async () => {
  try {
    const response = await axios.post(`${apiUrl.value}/api/user/checkin`);
    if (response.data.state == 'success') {
      hasCheckedIn.value = true;
      const userDataResponse = await axios.get(`${apiUrl.value}/api/user/session/get`);
      if (userDataResponse.data) {
        store.commit('SET_SESSION_DATA', userDataResponse.data)
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

onMounted(fetchCheckInStatus);
</script>