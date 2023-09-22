import { createRouter, createWebHistory } from "vue-router"
import CourseManage from "@/components/course/CourseManage.vue"
import Login from "@/components/Login.vue"
import HomePage from "@/components/HomePage.vue"
import StudentManage from "@/components/student/StudentManage.vue"

const routes = [
    { path: "/", component: HomePage },
    { path: "/login", component: Login },
    { path: "/course", component: CourseManage },
    { path: "/student", component: StudentManage },
]

export default createRouter({
    history: createWebHistory(),
    routes,
})
