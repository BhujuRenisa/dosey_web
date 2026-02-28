import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        // 1. Switch to the modern compiler to stop the deprecation warnings
        api: 'modern-compiler',
        // 2. Remove "mixed-decls" as it is no longer needed in the modern API
        silenceDeprecations: ["import", "global-builtin", "color-functions", "if-function"],
      },
    },
  },
})
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import path from 'path'

// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       '@': path.resolve(__dirname, 'src'),
//     },
//   },
// })
