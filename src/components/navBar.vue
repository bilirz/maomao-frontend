<template>
  <v-app>
    <!-- 顶部工具栏 -->
    <v-app-bar image="https://picsum.photos/1920/1080?random">
      <template v-slot:image>
        <v-img gradient="to bottom, rgba(255,255,255,0.7), rgba(255,255,255,0.7)"></v-img>
      </template>
      <v-app-bar-nav-icon @click="drawer = !drawer" color="#333"></v-app-bar-nav-icon>
      <v-btn color="#333" min-width="100" to="/"><v-toolbar-title>猫猫站</v-toolbar-title></v-btn>

      <v-spacer></v-spacer> <!-- 将按钮推到工具栏的右侧 -->

      <v-btn color="#333" min-width="70" @click="checkIn" v-if="sessionData.signin">{{ hasCheckedIn ? '已签到' : '签到' }}</v-btn>
      <v-btn color="#333" min-width="70" to="/member/upload"><v-icon>mdi-upload</v-icon>投稿</v-btn>
    </v-app-bar>

    <!-- 导航栏 -->
    <v-navigation-drawer v-model="drawer" width="300">
      <mmvCard v-if="sessionData.signin" v-ripple @click="goToProfile">
        <v-row align="center">
          <v-col cols="auto">
            <avatar :src="upFaceUrl"></avatar>
          </v-col>
          
          <v-col>
            <div class="user-name">{{ sessionData.name }}</div>
            <div class="user-uid">UID：{{ sessionData.uid }}</div>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <div>经验：{{ (sessionData.checkin.experience || 0).toFixed(2) }}</div>
            <div>积分：{{ (sessionData.checkin.points || 0).toFixed(2) }}</div>
          </v-col>
        </v-row>
      </mmvCard>
      <v-list @click="closeDrawer">
      
      <v-list-item v-for="(item, i) in items" :key="i" :value="item" rounded="xl" :to="item.to">
        <template v-slot:prepend>
          <v-icon :icon="item.icon"></v-icon>
        </template>

        <v-list-item-title v-text="item.text"></v-list-item-title>
      </v-list-item>
    </v-list>
    </v-navigation-drawer>

    <v-main>
      <slot></slot>
    </v-main>
  </v-app>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, computed, watch, onMounted } from 'vue';
import { useUserStore } from '@/store/userStore';
import { useUrlStore } from '@/store/urlStore';
import axios from 'axios';
import avatar from '@/components/user/avatar.vue';
import mmvCard from '@/components/rzm/mmvCard.vue';

const urlStore = useUrlStore();
const userStore = useUserStore();
const router = useRouter();

const apiUrl = computed(() => urlStore.apiUrl);
const cosUrl = computed(() => urlStore.cosUrl);
const sessionData = computed(() => userStore.sessionData);

// const dataLoaded = ref(false);
// const userInfo = ref(null);
const hasCheckedIn = ref(false);
const upFaceUrl = computed(() => `${cosUrl.value}/face/${sessionData.value.uid}.jpg`);


// watch(sessionData, async (newValue) => {
//   if (newValue && newValue.uid) {
//     try {
//       const userResponse = await axios.get(`${apiUrl.value}/api/space/${newValue.uid}`);
//       userInfo.value = userResponse.data;
//       dataLoaded.value = true;
//     } catch (error) {
//       console.error("Failed to fetch user info:", error);
//     }
//   }
// }, { immediate: true });


const drawer = ref(false);

const goToProfile = () => {
  router.push(`/space/${sessionData.value.uid}`);
  drawer.value = false;
};

const closeDrawer = () => {
  drawer.value = false;
};

const items = computed(() => {
  const baseItems = [
    { text: '主页', icon: 'mdi-inbox', to: '/' },
    { text: '关于本网站', icon: 'mdi-information', to: '/about' },
    { text: 'FAQ', icon: 'mdi-frequently-asked-questions', to: '/faq' },
    { text: '开发日志', icon: 'mdi-timeline', to: '/log' },
  ];
  
  if (!sessionData.value.signin) {
    baseItems.unshift({ text: '登录', icon: 'mdi-account', to: '/user/signin' });
    baseItems.unshift({ text: '注册', icon: 'mdi-account', to: '/user/signup' });
  }

  return baseItems;
});


const fetchCheckInStatus = async () => {
  try {
    const response = await axios.get(`${apiUrl.value}/api/user/session/get`);
    if (response.data && response.data.checkin.can_checkin !== undefined) {
      hasCheckedIn.value = !response.data.checkin.can_checkin;  // 注意这里使用"!"，因为如果"can_checkin"是true，那么用户还没有签到
    }
  } catch (error) {
    console.error('获取签到状态错误:', error);
  }
}

const checkIn = async () => {
  try {
    const response = await axios.post(`${apiUrl.value}/api/user/checkin`);
    if (response.data.state == 'success') {
      hasCheckedIn.value = true;
      const userDataResponse = await axios.get(`${apiUrl.value}/api/user/session/get`);
      if (userDataResponse.data) {
        userStore.setSessionData(userDataResponse.data);
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
    console.log(error);
  }
}

onMounted(fetchCheckInStatus);

</script>

<style scoped>
.user-name {
  font-size: 18px;
  font-weight: bold;
}

.user-uid {
  color: grey;
  font-size: 14px;
}
</style>