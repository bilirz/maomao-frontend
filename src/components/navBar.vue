<template>
  <v-app>
    <!-- 顶部工具栏 -->
    <v-app-bar>
      <template #image>
        <v-img
          :style="{
            background: 'url(' + randomNavImage + ') no-repeat right center',
            opacity: '0.7',
          }"
        ></v-img>
      </template>
      <v-app-bar-nav-icon
        color="#333"
        @click="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <v-btn color="#333" min-width="100" to="/"
        ><v-toolbar-title>猫猫站</v-toolbar-title></v-btn
      >

      <v-spacer></v-spacer>
      <!-- 将按钮推到工具栏的右侧 -->

      <v-btn
        v-if="sessionData.signin"
        color="#333"
        min-width="70"
        @click="checkIn"
        >{{ hasCheckedIn ? '已签到' : '签到' }}</v-btn
      >
      <v-btn color="#333" min-width="70" to="/member/upload"
        ><v-icon>mdi-upload</v-icon>投稿</v-btn
      >
    </v-app-bar>

    <!-- 导航栏 -->
    <v-navigation-drawer v-model="drawer" width="300">
      <mmvCard
        v-if="sessionData.signin"
        :show-ripple="true"
        class="mt-3"
        @click="goToProfile"
      >
        <v-row align="center">
          <v-col cols="auto">
            <avatar :uid="sessionData.uid"></avatar>
          </v-col>

          <v-col>
            <div class="user-name">{{ sessionData.name }}</div>
            <div class="user-uid">UID：{{ sessionData.uid }}</div>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <div>
              经验：{{ (sessionData.checkin.experience || 0).toFixed(1) }} (#{{
                sessionData.checkin.exp_rank
              }})
            </div>
            <div>积分：{{ (sessionData.checkin.points || 0).toFixed(1) }}</div>
          </v-col>
        </v-row>
      </mmvCard>
      <v-list @click="closeDrawer">
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :value="item"
          :to="item.to"
        >
          <template #prepend>
            <v-icon :icon="item.icon"></v-icon>
          </template>

          <v-list-item-title>{{ item.text }}</v-list-item-title>
        </v-list-item>
      </v-list>
      <div class="footer-section">
        <div class="footer-content">
          技术交流群: 542174643<br />
          粉丝与网站讨论群: 883422705<br />
          <el-link
            type="primary"
            href="https://curl.qcloud.com/mzc5gXg0"
            target="_blank"
            >腾讯云轻量应用服务器真的非常好用</el-link
          ><br />
        </div>
      </div>
      <img :src="randomDrawerImage" alt="侧边栏图片" class="sidebar-image" />
    </v-navigation-drawer>
    <v-main>
      <slot></slot>
    </v-main>
  </v-app>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, computed, onMounted } from 'vue'
import { useUrlStore } from '@/store/urlStore'
import { useUserStore } from '@/store/userStore'
import axios from 'axios'
import avatar from '@/components/user/avatar.vue'
import mmvCard from '@/components/rzm/mmvCard.vue'

const urlStore = useUrlStore()
const userStore = useUserStore()
const router = useRouter()

const apiUrl = computed(() => urlStore.apiUrl)
const cosUrl = computed(() => urlStore.cosUrl)
const sessionData = computed(() => userStore.sessionData)

const hasCheckedIn = ref(false)

const randomNavImage = computed(() => {
  const randomNumber = Math.floor(Math.random() * 1) //随机0~1 png
  return `${cosUrl.value}/nav/${randomNumber}.png`
})

const randomDrawerImage = computed(() => {
  const randomNumber = Math.floor(Math.random() * 2) + 5 // 随机5或6
  return `${cosUrl.value}/nav/${randomNumber}.png`
})

const drawer = ref(false)

const goToProfile = () => {
  router.push(`/space/${sessionData.value.uid}`)
  drawer.value = false
}

const closeDrawer = () => {
  drawer.value = false
}

const items = computed(() => {
  const baseItems = [
    { text: '主页', icon: 'mdi-inbox', to: '/' },
    { text: '喵绘者排行', icon: 'mdi-airplane', to: '/user/rank' },
    { text: '关于本网站', icon: 'mdi-information', to: '/about' },
    { text: 'FAQ', icon: 'mdi-frequently-asked-questions', to: '/faq' },
    { text: '可公开数据', icon: 'mdi-chart-donut', to: '/data' },
    { text: '开发日志', icon: 'mdi-timeline', to: '/log' },
  ]

  if (!sessionData.value.signin) {
    baseItems.unshift({ text: '登录', icon: 'mdi-account', to: '/user/signin' })
    baseItems.unshift({ text: '注册', icon: 'mdi-account', to: '/user/signup' })
  }

  return baseItems
})

const fetchCheckInStatus = async () => {
  try {
    const response = await axios.get(`${apiUrl.value}/api/user/session/get`)
    if (response.data && response.data.checkin.can_checkin !== undefined) {
      hasCheckedIn.value = !response.data.checkin.can_checkin // 注意这里使用"!"，因为如果"can_checkin"是true，那么用户还没有签到
    }
  } catch (error) {
    console.error('获取签到状态错误:', error)
  }
}

const checkIn = async () => {
  try {
    const response = await axios.post(`${apiUrl.value}/api/user/checkin`)
    if (response.data.state == 'success') {
      hasCheckedIn.value = true
      const userDataResponse = await axios.get(
        `${apiUrl.value}/api/user/session/get`
      )
      if (userDataResponse.data) {
        userStore.setSessionData(userDataResponse.data)
      }
      ElNotification({
        title: '签到成功',
        message: response.data.message,
        type: 'success',
      })
    } else {
      ElNotification({
        title: '签到失败',
        message: response.data.message,
        type: 'warning',
      })
    }
  } catch (error) {
    ElNotification({
      title: '签到失败！',
      message: error,
      type: 'error',
    })
  }
}

onMounted(fetchCheckInStatus)
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

.footer-section {
  position: absolute;
  bottom: 0;
  width: 100%;
  z-index: 10;
  color: #555;
  font-size: 14px;
}

.footer-content {
  text-align: center;
}

.sidebar-image {
  position: absolute;
  bottom: 10px;
  left: 10px;
  width: 200px;
  height: auto;
  z-index: -1;
  opacity: 0.5;
}
</style>
