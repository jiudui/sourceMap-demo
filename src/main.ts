import './assets/main.css'
import ErrorStackParser from 'error-stack-parser'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { findCodeBySourceMap } from '../src/utils/index'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.config.errorHandler = (err) => {
  const errorStack = ErrorStackParser.parse(err as Error)
  findCodeBySourceMap(errorStack[0])
  console.log('Parsed error stack:', errorStack)

  // console.error('Global error handler:', err, info)
}

app.mount('#app')
