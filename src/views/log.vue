<template>
  <div>
    <v-timeline side="end" align="start" >
      <!-- 代表一个版本的更新 -->
      <v-timeline-item :dot-color="update.dotColor" :size="update.size" v-for="update in updates"  :key="update.version" min-width="100%">
        <div>
          <strong style="color: #333;">Ver.{{ update.stage }}.{{ update.version }}&nbsp;&nbsp;&nbsp;&nbsp;{{ update.date }}</strong>
          
          <mmvCard style="width: 100%; max-width: 100%;">
            <template v-slot:default>
              <div v-for="(contents, category) in update.changes" :key="category">
                <div style="margin-top: 10px; margin-bottom: 10px; margin-left: -7px; color: #555; font-size: 13px;">
                    <v-icon :left="true" style="margin-right: 10px;">{{ categoryIconMap[category] }}</v-icon>
                    <strong>{{ categoryMap[category] }}</strong>
                </div>
                <ul style="margin-left: 20px;">
                  <li style="color: #777;" v-for="content in contents" :key="content">{{ content }}</li>
                </ul>
              </div>
            </template>
          </mmvCard>
        </div>
      </v-timeline-item>
    </v-timeline>
    <comment type="log" style="margin-top: 20px;"></comment>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import mmvCard from '@/components/rzm/mmvCard.vue';
import logs from '@/assets/docs/log.json';

const rawUpdates = ref(logs);
const updates = computed(() => [...rawUpdates.value].reverse());

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
</script>