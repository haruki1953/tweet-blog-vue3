import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(persist)

export default pinia
export * from './setting'
export * from './layout'
export * from './auth'
export * from './post'
export * from './image'
