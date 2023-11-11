<template>
  <div>
    <v-timeline side="end" align="start">
      <!-- 代表一个版本的更新 -->
      <v-timeline-item
        v-for="update in updates"
        :key="update.version"
        :dot-color="update.dotColor"
        :size="update.size"
        min-width="100%"
      >
        <div>
          <strong class="text-gray-700"
            >Ver.{{ update.stage }}.{{
              update.version
            }}&nbsp;&nbsp;&nbsp;&nbsp;{{ update.date }}</strong
          >

          <mmvCard class="w-full max-w-full">
            <template #default>
              <div
                v-for="(contents, category) in update.changes"
                :key="category"
              >
                <div
                  class="mt-4 mb-4 ml-0 text-gray-500 text-sm flex items-center"
                >
                  <v-icon :left="true" class="mr-2">{{
                    categoryIconMap[category]
                  }}</v-icon>
                  <strong>{{ categoryMap[category] }}</strong>
                </div>
                <ul class="ml-8">
                  <li
                    v-for="content in contents"
                    :key="content"
                    class="text-gray-600"
                  >
                    {{ content }}
                  </li>
                </ul>
              </div>
            </template>
          </mmvCard>
        </div>
      </v-timeline-item>
    </v-timeline>
    <comment type="log" class="mt-5"></comment>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import mmvCard from '@/components/rzm/mmvCard.vue'
import logs from '@/assets/docs/log.json'

const rawUpdates = ref(logs)
const updates = computed(() => [...rawUpdates.value].reverse())

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
</script>
