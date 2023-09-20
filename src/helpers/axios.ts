import axios, { AxiosError } from "axios"
import { message } from "ant-design-vue"
import router from "./router.ts"

if (import.meta.env.MODE === "development") axios.defaults.baseURL = "http://localhost:9905/"
else axios.defaults.baseURL = "https://bot.cinea.cc/api/"

axios.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    if (window.localStorage.getItem("token")) {
      config.headers["X-Token"] = window.localStorage.getItem("token")
    }
    return config
  },
  function (error) {
    // 对请求错误做些什么
    message.error("网络连接失败，请检查网络连接或询管理员！").then()
    return Promise.reject(error)
  },
)

axios.interceptors.response.use(
  function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response
  },
  function (error: AxiosError) {
    console.log("ERROR", error.message)
    // 对请求错误做些什么
    if (error.response && error.response.status && error.response.status == 401) {
      message.warning("您还未登录").then()
      router.push("/login").then()
    } else if (error.response && error.response.status && error.response.status == 403) {
      message.error("您不能使用此接口，如有疑问请询管理员。").then()
    }
    return Promise.reject(error)
  },
)
