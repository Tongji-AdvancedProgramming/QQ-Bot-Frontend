<script setup lang="ts">
import { ReadOutlined, TeamOutlined } from "@ant-design/icons-vue"
import router from "@/helpers/router.ts"
import { onMounted, ref } from "vue"
import moment from "moment"
import axios from "axios"

interface Status {
    status: string
    type: string
    lost: number
    losePackage: number
    groups: number
    lastMessage: number
}

const status = ref<Status>({ lastMessage: Date.now(), losePackage: 0, lost: 0, groups: 0, status: "正常", type: "ok" })

onMounted(() => {
    axios
        .get("/bot/status")
        .then((res) => {
            if (res.data.code && res.data.code === "10000") {
                status.value = res.data.data
            } else {
                status.value = { groups: 0, lastMessage: 0, losePackage: 0, lost: 0, status: "后端异常", type: "warn" }
            }
        })
        .catch(() => {
            status.value = { groups: 0, lastMessage: 0, losePackage: 0, lost: 0, status: "后端崩溃", type: "fail" }
        })
})
</script>

<template>
    <a-card style="position: relative; min-height: 600px">
        <h1 class="my-10 text-4xl font-bold">Bot管理系统</h1>
        <p>本系统具有强大、便捷、现代的管理能力，使用者无需理解和编辑代码即可完成对Bot的丰富控制。</p>
        <br />
        <br />

        <div>
            <h2 class="text-xl font-bold">Bot运行信息</h2>
            <a-space size="large">
                <a-statistic title="运行状态" :value="status.status" style="margin-right: 50px">
                    <template #prefix>
                        <div class="mx-1">
                            <div v-if="status.type === 'ok'" class="ok_dot" />
                            <div v-else-if="status.type === 'warn'" class="warn_dot" />
                            <div v-else-if="status.type === 'fail'" class="fail_dot" />
                        </div>
                    </template>
                </a-statistic>
                <a-statistic
                    title="收到最后一条消息"
                    :value="status.lastMessage > 0 ? moment(status.lastMessage * 1000).fromNow() : `从未`"
                />
                <a-statistic title="已经加入" :value="status.groups" suffix="个群" />
                <a-statistic title="网络丢包率" :value="(status.losePackage * 100).toFixed(2)" suffix="%" />
                <a-statistic title="掉线" :value="status.lost" suffix="次" />
            </a-space>
        </div>

        <br />

        <div>
            <h2 class="text-xl font-bold">功能快捷入口</h2>
            <ul class="my-3">
                <li>
                    <a-button type="link" @click="router.push('/course')"><ReadOutlined /> 管理课程</a-button>
                    <span class="text-gray-500">您可在此处管理bot参与管理的课程。</span>
                </li>
                <li>
                    <a-button type="link" @click="router.push('/student')"><TeamOutlined /> 学生管理</a-button>
                    <span class="text-gray-500">您可在此处管理班级中的学生信息。</span>
                </li>
            </ul>
        </div>

        <div class="image-card" />
    </a-card>
</template>

<style scoped>
.image-card {
    position: absolute;
    bottom: 0;
    left: calc(100% - 400px);
    z-index: 1;

    width: 400px;
    height: 400px;
    opacity: 0.5;

    background: url("/img/at.png") no-repeat;
    background-size: contain;
}

.ok_dot {
    background-color: springgreen;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    display: block;
}

.warn_dot {
    background-color: orange;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    display: block;
}

.fail_dot {
    background-color: red;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    display: block;
}
</style>
