<template>
  <mmCard title="注册">
    <el-form ref="signupForm" :model="formData" label-position="top">
      <el-form-item
        label="邮箱"
        prop="email"
        :rules="[
          {
            required: true,
            message: '邮箱为必填项。',
          },
        ]"
      >
        <el-col :xs="24" :lg="18">
          <el-input
            v-model="formData.email"
            placeholder="请输入您的一个邮箱..."
          >
            <template #prefix>
              <svg
                t="1681639108728"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="2657"
                width="15"
                height="15"
              >
                <path
                  d="M838.954667 234.666667H170.666667c-3.626667 0-7.168 0.448-10.56 1.322666l323.690666 323.669334a21.333333 21.333333 0 0 0 30.165334 0L838.954667 234.666667z m46.144 14.186666l-260.693334 260.693334 262.933334 262.912c5.44-7.168 8.661333-16.106667 8.661333-25.792V277.333333c0-10.944-4.117333-20.906667-10.88-28.48zM843.861333 789.333333l-249.6-249.621333-50.133333 50.133333a64 64 0 0 1-90.517333 0l-50.112-50.133333L156.373333 786.88c4.48 1.578667 9.28 2.453333 14.314667 2.453333h673.194667zM128.661333 754.218667L373.333333 509.525333 129.578667 265.813333A42.709333 42.709333 0 0 0 128 277.333333v469.333334c0 2.56 0.213333 5.098667 0.661333 7.552zM170.666667 192h682.666666a85.333333 85.333333 0 0 1 85.333334 85.333333v469.333334a85.333333 85.333333 0 0 1-85.333334 85.333333H170.666667a85.333333 85.333333 0 0 1-85.333334-85.333333V277.333333a85.333333 85.333333 0 0 1 85.333334-85.333333z"
                  fill="#A8ABB2"
                  p-id="2658"
                ></path>
              </svg>
            </template>
          </el-input>
        </el-col>

        <el-col :lg="5" :offset="1" class="hidden-md-and-down">
          <el-button
            style="width: 100%"
            type="primary"
            :disabled="formData.btn.isDisabled"
            @click="getAuth"
          >
            {{ formData.btn.text }}
          </el-button>
        </el-col>

        <el-col :xs="24" class="hidden-lg-and-up">
          <el-button
            style="width: 100%"
            type="primary"
            :disabled="formData.btn.isDisabled"
            @click="getAuth"
          >
            {{ formData.btn.text }}
          </el-button>
        </el-col>
      </el-form-item>
      <el-form-item
        label="验证码"
        prop="auth"
        :rules="[
          {
            required: true,
            message: '验证码为必填项。',
          },
        ]"
      >
        <el-input
          v-model="formData.auth"
          placeholder="请输入您获取的验证码..."
          prefix-icon="ChatLineRound"
          :disabled="formData.btn.isInputDisabled"
          maxlength="6"
        />
      </el-form-item>
      <el-form-item
        label="昵称"
        prop="name"
        :rules="[
          {
            required: true,
            message: '昵称为必填项。',
          },
        ]"
      >
        <el-input
          v-model="formData.name"
          placeholder="请输入您的账号..."
          prefix-icon="User"
        />
      </el-form-item>
      <el-form-item
        label="密码"
        prop="password"
        :rules="[
          {
            required: true,
            message: '密码为必填项。',
          },
        ]"
      >
        <el-input
          v-model="formData.password"
          placeholder="请输入您的密码..."
          show-password
          prefix-icon="Lock"
        />
      </el-form-item>
      <el-form-item
        label="重复密码"
        prop="again_password"
        :rules="[
          {
            required: true,
            message: '重复密码为必填。',
          },
        ]"
      >
        <el-input
          v-model="formData.again_password"
          placeholder="请再次输入密码..."
          show-password
          prefix-icon="Lock"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(signupForm)"
          >注册</el-button
        >
        <el-button @click="goToSignin">登录</el-button>
      </el-form-item>
    </el-form>
  </mmCard>
</template>

<script setup>
import { reactive, computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUrlStore } from '@/store/urlStore'
import router from '@/router'
import axios from 'axios'
import mmCard from '@/components/rzm/mmCard.vue'

const urlStore = useUrlStore()
const apiUrl = computed(() => urlStore.apiUrl)

const urouter = useRouter()
const goToSignin = () => {
  urouter.replace('/user/signin')
}

const formData = reactive({
  email: '',
  btn: {
    isDisabled: true,
    isInputDisabled: true,
    value: 60,
    text: '获取验证代码',
  },
  auth: '',
  name: '',
  password: '',
  again_password: '',
})
let RegEmail = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
watch(
  () => formData.email,
  () => {
    if (RegEmail.test(formData.email)) {
      formData.btn.isDisabled = false
      formData.btn.isInputDisabled = false
    }
  }
)
const signupForm = ref(null)

const getAuth = () => {
  formData.btn.isDisabled = true
  formData.btn.text = `重新发送：${formData.btn.value}秒`
  axios.post(`${apiUrl.value}/api/user/signup/auth`, { email: formData.email })
  const auth_timer = setInterval(() => {
    formData.btn.value--
    formData.btn.text = `重新发送：${formData.btn.value}秒`
    if (formData.btn.value === 0) {
      formData.btn.isDisabled = false
      clearInterval(auth_timer)
      formData.btn.value = 60
      formData.btn.text = '获取验证代码'
    }
  }, 1000)
}

const submitForm = (formEl) => {
  if (!formEl) return

  const validatePasswordLength = (password) => {
    return password.length >= 6
  }

  const validatePasswordsMatch = (password, again_password) => {
    return password === again_password
  }

  const validateNameLength = (name) => {
    return name.length >= 3 && name.length <= 10
  }

  formEl.validate((valid) => {
    if (!valid) {
      ElMessage({
        message: '错误：未填必填项',
        type: 'warning',
      })
      return
    }

    if (!validatePasswordLength(formData.password)) {
      ElMessage({
        message: '错误：密码不能小于6个字符。',
        type: 'warning',
      })
      return
    }

    if (!validatePasswordsMatch(formData.password, formData.again_password)) {
      ElMessage({
        message: '错误：两次密码输入不一致。',
        type: 'warning',
      })
      return
    }

    if (!validateNameLength(formData.name)) {
      ElMessage({
        message: '错误：昵称长度需要在3-10之间。',
        type: 'warning',
      })
      return
    }

    axios
      .post(`${apiUrl.value}/api/user/signup`, {
        email: formData.email,
        name: formData.name,
        auth: formData.auth,
        password: formData.password,
      })
      .then((response) => {
        let res = response.data
        if (res['state'] === 'succeed') {
          ElNotification({
            // TODO: 发送验证链接而不是验证码
            title: '注册成功',
            message: '即将为您跳转到登录页面...',
            type: 'success',
          })
          router.push('/user/signin')
        } else if (res['state'] === 'error') {
          ElMessage({
            message: res['message'],
            type: 'error',
          })
        }
      })
      .catch((error) => {
        ElMessage({
          message: error,
          type: 'error',
        })
      })
  })
}
</script>
