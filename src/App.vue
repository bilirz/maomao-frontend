<template>
  <div>
    <navBar>
      <v-container>
        <v-row justify="center">
          <v-col :cols="columnWidth">
            <div class="mt-9"></div>
            <router-view v-slot="{ Component }">
              <transition name="slide-x-transition" mode="out-in">
                <component :is="Component" />
              </transition>
            </router-view>
          </v-col>
        </v-row>
      </v-container>
    </navBar>
    <v-dialog v-model="showUpdateLog" max-width="600px">
      <v-card>
        <v-card-title style="color: #61aefb; font-size: bold">
          最新更新 - {{ latestUpdate.stage }}{{ latestUpdate.version }}
        </v-card-title>
        <v-card-text>
          <template #default>
            <div
              v-for="(contents, category) in latestUpdate.changes"
              :key="category"
            >
              <div
                class="mt-1 mb-1 ml-[-7px]"
                style="color: #555; font-size: 13px"
              >
                <v-icon :left="true" class="mr-1">{{
                  categoryIconMap[category]
                }}</v-icon>
                <strong>{{ categoryMap[category] }}</strong>
              </div>
              <ul class="mt-1">
                <li
                  v-for="content in contents"
                  :key="content"
                  style="color: #777"
                >
                  {{ content }}
                </li>
              </ul>
            </div>
          </template>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="closeUpdateLog">关闭</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import axios from 'axios'
import { useRoute } from 'vue-router'
import { useUrlStore } from '@/store/urlStore'
import { ref, onMounted, computed } from 'vue'
import navBar from '@/components/navBar.vue'
import logs from '@/assets/docs/log.json'

const route = useRoute()

const urlStore = useUrlStore()
const apiUrl = computed(() => urlStore.apiUrl)

axios.defaults.withCredentials = true

const showUpdateLog = ref(false)
const latestUpdate = logs[logs.length - 1]

const columnWidth = computed(() => {
  return route.meta.layout === 'form' ? 8 : 20
})

const categoryMap = {
  milestone: '里程碑',
  feature: '特性',
  fix: '修复',
  beautify: '美化',
  architecture: '架构',
  other: '其他',
}

const categoryIconMap = {
  milestone: 'mdi-trophy',
  feature: 'mdi-star',
  fix: 'mdi-wrench',
  beautify: 'mdi-brush',
  architecture: 'mdi-cube-outline',
  other: 'mdi-dots-horizontal',
}

const closeUpdateLog = () => {
  showUpdateLog.value = false
  localStorage.setItem('lastSeenUpdate', latestUpdate.version)
}

onMounted(() => {
  const lastSeenUpdate = localStorage.getItem('lastSeenUpdate')
  if (!lastSeenUpdate || lastSeenUpdate !== latestUpdate.version) {
    showUpdateLog.value = true
  }

  axios
    .post(`${apiUrl.value}/api/online/visited`)
    .then((response) => {
      console.log(response.data.message)
    })
    .catch((error) => {
      console.error('统计访问错误:', error)
    })
})
</script>
