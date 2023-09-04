import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// https://vitejs.dev/config/
export default defineConfig({

  server: {    // <-- this object is added
    port: 3001,
    proxy: 'https://mainsite.com/'
  },
  plugins: [vue()]
})

