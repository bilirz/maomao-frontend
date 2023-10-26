import { defineStore } from 'pinia';

export const useUrlStore = defineStore({
  id: 'urlStore',

  state: () => ({
    apiUrl: 'http://localhost:5000',
    // cosUrl: 'https://cos-test.bilirz.com',
    // apiUrl: 'https://v.bilirz.com',
    cosUrl: 'https://cos.bilirz.com',
  })
});