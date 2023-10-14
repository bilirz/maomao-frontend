<template>
  <navBar></navBar>
  <div style="margin-top: 15px;"></div>

  <el-row>
    <el-col v-bind="lrLayout"></el-col>
    <el-col v-bind="contentLayout">
      <router-view v-slot="{ Component }">
        <el-collapse-transition name="el-fade-in-linear">
          <component :is="Component" />
        </el-collapse-transition>
      </router-view>
    </el-col>
    <el-col v-bind="lrLayout"></el-col>
  </el-row>
</template>

<script>
import axios from 'axios';
import navBar from '@/components/navBar.vue';

axios.defaults.withCredentials = true;

export default {
  components: {
    navBar
  },
  computed: {
    currentLayout() {
      return this.$route?.meta?.layout || 'normal';
    },
    lrLayout() {
      const layouts = {
        form: { xs: {span:2}, sm: {span:3}, md: {span:7}, lg: {span:7}, xl: {span:7} },
        normal: { xs: {span:3}, sm: {span:4}, md: {span:2}, lg: {span:4}, xl: {span:5} }
      };
      return layouts[this.currentLayout];
    },
    contentLayout() {
      const layouts = {
        form: { xs: {span:20}, sm: {span:18}, md: {span:10}, lg: {span:10}, xl: {span:10} },
        normal: { xs: {span:18}, sm: {span:16}, md: {span:20}, lg: {span:16}, xl: {span:14} }
      };
      return layouts[this.currentLayout];
    },
  }
}
</script>