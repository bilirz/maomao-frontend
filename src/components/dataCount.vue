<template>
  <div>
    <mmCard title="网站数据" style="margin-bottom: 20px;">
      <h4 style="color: #555;">每小时访问量统计</h4>
      <div ref="chart" style="width: 100%; height: 400px;"></div>
      <!-- <h4 style="color: #555;">网站同时在线人数</h4>
      <p style="color: #333;">{{ onlineCount }}</p> -->
    </mmCard>
  </div>
</template>

<script setup>
import mmCard from '@/components/rzm/mmCard.vue';
import { onMounted, ref, nextTick, computed } from 'vue';
import * as echarts from 'echarts';
import axios from 'axios';
import { useUrlStore } from '@/store/urlStore';
import useFormat from "@/composables/useFormat";
const { formatTimestamp } = useFormat();

const urlStore = useUrlStore();
const apiUrl = computed(() => urlStore.apiUrl);

const onlineCount = ref(0);
const chart = ref(null);
let chartInstance = null;

onMounted(async () => {
  await nextTick();
  chartInstance = echarts.init(chart.value);
  const response = await axios.get(`${apiUrl.value}/api/online/get_last_24h_visits`);
  const data = response.data;
  console.log(data);

  const hours = Object.keys(data).map(timestamp => {
    return formatTimestamp(parseFloat(timestamp)).slice(0, 16); // 截取到小时
  });

  const counts = Object.values(data);

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      },
      formatter: function(params) {
        let item = params[0];
        return `${hours[item.dataIndex]}<br/>访问量：${counts[item.dataIndex]}`;
      }
    },
    xAxis: {
      type: 'category',
      data: hours
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: counts,
      type: 'line',
      lineStyle: {
          color: '#ff6060'
      },
      itemStyle: {
          color: '#ff6060'
      },
      symbol: 'none',
      smooth: true,
      areaStyle: {}
    }]
  };
  
  chartInstance.setOption(option);
});
</script>
