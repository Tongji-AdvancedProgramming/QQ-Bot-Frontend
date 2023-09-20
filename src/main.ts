import { createApp } from "vue"
import "./assets/base.css"
import "./helpers/axios.ts"
import "./helpers/icons.ts"
import { OhVueIcon } from "oh-vue-icons"
import App from "./App.vue"

import router from "./helpers/router.ts"

import moment from "moment"
import "moment/dist/locale/zh-cn.js"

moment.locale("zh-cn")

createApp(App).component("v-icon", OhVueIcon).use(router).mount("#app")
