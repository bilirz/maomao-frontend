import { defineStore } from 'pinia'

export const useUrlStore = defineStore({
  id: 'urlStore',

  state: () => ({
    // apiUrl: 'http://localhost:5000',
    // cosUrl: 'https://cos.bilirz.com',
    apiUrl: `${window.location.protocol}//${window.location.host}`,
    // apiUrl: 'https://v.bilirz.com',
    cosUrl: `${window.location.protocol}//${window.location.host}/api/public/cos`,
    faceUrl: `https://cos.bilirz.com`,
  }),
})
