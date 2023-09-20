<script setup lang="ts">
import { h, onMounted, reactive, ref, watch } from "vue"
import { ReadOutlined, TeamOutlined } from "@ant-design/icons-vue"
import ClassManage from "./components/course/CourseManage.vue"
import { useRoute, useRouter } from "vue-router"

const route = useRoute()
const router = useRouter()

const navMenuIndex = ref(["1"])
const sideMenuIndex = ref(["/course"])

watch(sideMenuIndex, () => {
  router.push(sideMenuIndex.value[0])
})

onMounted(() => {
  console.log(route.path)
  // if (route.path === "/") router.push("/course")
  sideMenuIndex.value[0] = route.path
})

const menuItems = reactive([
  {
    key: "/course",
    icon: () => h(ReadOutlined),
    label: "课程管理",
  },
  {
    key: "/student",
    icon: () => h(TeamOutlined),
    label: "学生管理",
  },
])
</script>

<template>
  <a-layout>
    <a-layout-header class="flex">
      <div class="font-bold mr-5"><router-link to="/" class="text-white">Bot后台管理</router-link></div>
      <a-menu v-model:selectedKeys="navMenuIndex" theme="dark" mode="horizontal" :style="{ lineHeight: '64px' }">
        <a-menu-item key="1">学生管理</a-menu-item>
        <a-menu-item key="2" disabled>敬请期待</a-menu-item>
      </a-menu>
    </a-layout-header>
    <a-layout>
      <a-layout-sider width="200" style="background: #fff">
        <a-menu v-model:selectedKeys="sideMenuIndex" mode="inline" :style="{ height: '100%', borderRight: 0 }" :items="menuItems" />
      </a-layout-sider>
      <a-layout class="p-5">
        <router-view />
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<style scoped></style>
