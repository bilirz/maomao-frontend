/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineStore } from 'pinia'
import axios from 'axios'
import { useUrlStore } from './urlStore'

export const useUserStore = defineStore({
  id: 'userStore',

  state: () => ({
    sessionData: {
      signin: null,
      status: null,
      isload: false,
    },
  }),

  actions: {
    async fetchSessionData() {
      const urlStore = useUrlStore()

      try {
        const response = await axios.get(
          `${urlStore.apiUrl}/api/user/session/get`
        )

        this.setSessionData(response.data)
      } catch (error) {
        console.error('获取session数据出错：', error)
      }
    },

    setSessionData(data: any) {
      this.sessionData = data
    },
  },
})
