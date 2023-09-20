<script setup lang="ts">
import { reactive } from "vue"
import axios from "axios"
import { message } from "ant-design-vue"
import { useRouter } from "vue-router"

const router = useRouter()

const loginForm = reactive({
  username: "",
  password: "",
})

const handleLogin = () => {
  console.log(loginForm)

  let form = new FormData()
  form.append("username", loginForm.username)
  form.append("password", loginForm.password)

  axios
    .post("/user/login", form)
    .then((res) => {
      if (res.data.code && res.data.code === "10000") {
        message.success(`登录成功`)
        window.localStorage.setItem("token", res.data.data)
        router.push("/")
      } else {
        message.warning(`登录失败：${res.data.msg}`)
      }
    })
    .catch(() => {
      message.warning(`登录失败：用户名或密码错误，或网络连接错误`)
    })
}
</script>

<template>
  <a-card>
    <h1 class="text-2xl font-bold">身份验证</h1>
    <p class="text-gray-500 mt-2">要想管理bot，您必须先完成身份验证</p>
    <a-divider />
    <p class="text-gray-500 mb-4">身份验证单次有效期：7天。您如果忘记密码，可登录服务器，查看环境变量Bot_AdminPass。</p>
    <div class="mb-5 mt-9">
      <div style="width: 350px">
        <a-form :model="loginForm" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" @finish="handleLogin">
          <a-form-item label="用户名" name="username">
            <a-input v-model:value="loginForm.username" />
          </a-form-item>
          <a-form-item label="密码" name="password">
            <a-input-password v-model:value="loginForm.password" />
          </a-form-item>
          <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
            <a-button html-type="submit">登录</a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </a-card>
</template>

<style scoped></style>
