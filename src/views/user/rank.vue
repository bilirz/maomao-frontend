<template>
  <div>
    <v-row>
      <v-col v-for="user in users" :key="user.uid" xs="12" sm="6" md="4" lg="3">
        <div class="card-wrapper">
          <span class="user-rank">#{{ user.rank }}</span>
          <mmvCard>
            <div class="user-info">
              <h3 class="user-name">{{ user.name }}</h3>
              <p class="user-uid">ID: {{ user.uid }}</p>
              <p class="user-experience">{{ (user.experience).toFixed(1) }}点</p>
              <p class="user-time">{{ formatTimestamp(user.time) }}</p>
            </div>
          </mmvCard>
        </div>
      </v-col>
    </v-row>
    <comment type="rank"></comment>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useUrlStore } from '@/store/urlStore';
import mmvCard from '@/components/rzm/mmvCard.vue';
import useFormat from '@/composables/useFormat';

const urlStore = useUrlStore();
const apiUrl = computed(() => urlStore.apiUrl);
const { formatTimestamp } = useFormat();
const users = ref([]); // 用于存储API返回的用户数据

// 当组件加载时调用API
onMounted(async () => {
  try {
    const response = await axios.get(`${apiUrl.value}/api/user/rank`);
    if (response.data) {
      users.value = response.data;
    }
  } catch (error) {
    console.error("获取用户列表错误:", error);
  }
});
</script>

<style scoped>
.user-col {
  padding: 0 !important;
}

.card-wrapper {
  position: relative;
}

.user-rank {
  position: absolute;
  top: -10px;
  left: 15%; 
  background-color: #61aefb; 
  color: white;
  padding: 5px 10px;
  border-radius: 15px;
  font-weight: bold;
  z-index: 2;
}

/* 媒体查询，针对小屏幕调整排名的样式 */
@media (max-width: 600px) {
  .user-rank {
    padding: 4px 8px;
  }
}

/* 媒体查询，针对更小的屏幕调整排名的样式 */
@media (max-width: 400px) {
  .user-rank {
    padding: 3px 6px;
  }
}

.user-info {
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: bold;
  font-size: 1.5rem;
  color: #333;
}

.user-uid {
  font-size: 1rem;
  color: #666;
  margin-bottom: 2px;
}

.user-experience {
  color: #61aefb; 
  font-weight: bold;
  margin-bottom: 10px;
}

.user-time {
  font-size: 0.9rem;
  color: #777;
  margin-bottom: 10px;
}
</style>