<template>
  <v-lazy
    :min-height="200"
    :options="{'threshold':0.5}"
    transition="fade-transition"
  >
    <navBar>
      <v-container>
        <v-row justify="center">
          <v-col :cols="columnWidth">
            <div style="margin-top: 15px;"></div>
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
        <v-card-title style="color: #61aefb;">
          最新更新 - {{ latestUpdate.stage }}{{ latestUpdate.version }}
        </v-card-title>
        <v-card-text>
          <template v-slot:default>
            <div v-for="(contents, category) in latestUpdate.changes" :key="category">
              <div style="margin-top: 10px; margin-bottom: 10px; margin-left: -7px; color: #555; font-size: 13px;">
                <v-icon :left="true" style="margin-right: 10px;">{{ categoryIconMap[category] }}</v-icon>
                <strong>{{ categoryMap[category] }}</strong>
              </div>
              <ul style="margin-left: 20px;">
                <li style="color: #777;" v-for="content in contents" :key="content">{{ content }}</li>
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
  </v-lazy>
</template>

<script setup>
import axios from 'axios';
import { useRoute } from 'vue-router';
import { ref, onMounted, computed } from 'vue';
import navBar from '@/components/navBar.vue';
import logs from '@/assets/docs/log.json';

const route = useRoute();
axios.defaults.withCredentials = true;

const showUpdateLog = ref(false);
const latestUpdate = logs[logs.length - 1];

const columnWidth = computed(() => {
  return route.meta.layout === 'form' ? 8 : 20;
});

const categoryMap = {
  milestone: '里程碑',
  feature: '特性',
  fix: '修复',
  beautify: '美化',
  architecture: '架构',
  other: '其他'
};

const categoryIconMap = {
  milestone: 'mdi-trophy',
  feature: 'mdi-star',
  fix: 'mdi-wrench',
  beautify: 'mdi-brush',
  architecture: 'mdi-cube-outline',
  other: 'mdi-dots-horizontal'
};

onMounted(() => {
  const lastSeenUpdate = localStorage.getItem('lastSeenUpdate');

  if (!lastSeenUpdate || lastSeenUpdate !== latestUpdate.version) {
    showUpdateLog.value = true;
  }
});

const closeUpdateLog = () => {
  showUpdateLog.value = false;
  localStorage.setItem('lastSeenUpdate', latestUpdate.version);
};
</script>