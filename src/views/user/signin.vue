<template>
  <mmCard title="登录">
    <el-form :model="formData" ref="signinForm" label-position="top">
      <el-form-item
      label="邮箱"
      prop="email"
      :rules="[{
          required: true,
          message: '邮箱为必填项。'
        }]"
      >
        <el-input v-model="formData.email" placeholder="请输入您的邮箱..." prefix-icon="User" clearable type="email"/>
      </el-form-item>
      <el-form-item
      label="密码"
      prop="password"
      :rules="[{
          required: true,
          message: '密码为必填项且至少输入6个字符。'
          }]"
        >
        <el-input v-model="formData.password" placeholder="请输入您的密码..." show-password prefix-icon="Lock"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(signinForm)">登录</el-button>
        <el-button @click="goToSignup">注册</el-button>
      </el-form-item>
    </el-form>
  </mmCard>
</template>

<script setup>
import { reactive, computed, ref } from 'vue'
import { useStore } from 'vuex';
import { useRouter } from 'vue-router'
import axios from 'axios'
import mmCard from '@/components/rzm/mmCard.vue';

const store = useStore();
const apiUrl = computed(() => store.state.apiUrl);

const urouter = useRouter();
const goToSignup = () => {
  urouter.replace('/user/signup')
}

const formData = reactive({
  email: '',
  password: ''
})

const signinForm = ref(null)
const submitForm = (formEl) => {
  if (!formEl) return;

  formEl.validate((valid) => {
    if (valid) {
      let RegEmail = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
      if (!RegEmail.test(formData.email)) {
        ElMessage({
          message: '错误：请输入一个有效的电子邮件地址。',
          type: 'warning',
        });
        return;
      }

      if (formData.password.length < 6) {
        ElMessage({
          message: '错误：密码至少需要6个字符。',
          type: 'warning',
        });
        return;
      }

      axios.post(`${apiUrl.value}/api/user/signin`, { email: formData.email, password: formData.password })
      .then(response => {
        let res = response.data;
        if (res['state'] === 'succeed') {
          ElNotification({
            title: '登录成功！',
            message: '欢迎回来！',
            type: 'success',
          });

          location.reload(true);
        } else if (res['state'] === 'password_error') {
          ElMessage({
            message: '错误：您输入的密码不正确。',
            type: 'warning',
          });
        } else if (res['state'] === 'user_none') {
          ElMessage({
            message: '错误：账号不存在。',
            type: 'warning',
          });
        }
      }).catch(error => {
        ElMessage({
          message: '服务器错误，请稍后再试。',
          type: 'error',
        });
      });

    } else {
      ElMessage({
        message: '错误：请确保填写所有必要的信息。',
        type: 'warning',
      });
    }
  });
}
</script>