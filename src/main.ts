import './assets/main.css'
import ErrorStackParser from 'error-stack-parser'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'

import App from './App.vue'
import router from './router'
// import { findCodeBySourceMap } from '../src/utils/index'

const app = createApp(App)

app.use(ElementPlus)
app.use(createPinia())
app.use(router)

app.config.errorHandler = (err: any, vm: any) => {
  const errorStack = ErrorStackParser.parse(err as Error)

  const jsError = {
    stack_frames: errorStack,
    message: err.message,
    stack: err.stack || '',
    error_name: err.name,
  }

  vm!.$message.error('捕获到全局异常，点击控制台查看详情')

  localStorage.setItem('jsErrorList', JSON.stringify(jsError))

  // findCodeBySourceMap(errorStack[0])
  // console.log('Parsed error stack:', errorStack)

  // console.error('Global error handler:', err, info)
}

app.mount('#app')
