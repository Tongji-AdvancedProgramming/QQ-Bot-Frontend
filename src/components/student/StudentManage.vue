<script setup lang="ts">
import { onMounted, ref } from "vue"
import { message, Modal, SelectOption, TableColumnProps, TableProps } from "ant-design-vue"
import { Student } from "@/models/quicktype/Student.ts"
import axios from "axios"
import { Course } from "@/models/quicktype/Course.ts"
import ImportStudent from "@/components/student/ImportStudent.vue"
import { Key } from "ant-design-vue/es/table/interface"

const dataSource = ref<Student[]>([])

const columns = ref<TableColumnProps[]>([
    {
        title: "学号",
        dataIndex: "stuNo",
        key: "stuNo",
    },
    {
        title: "姓名",
        dataIndex: "name",
        key: "name",
    },
    {
        title: "专业",
        dataIndex: "major",
        key: "major",
    },
    {
        title: "课号",
        dataIndex: "courseId",
        key: "courseId",
    },
    {
        title: "班号",
        dataIndex: "classId",
        key: "classId",
    },
])

interface Filter {
    courseId: string | null
    classId: string | null
    startStuNo: string | null
    endStuNo: string | null
}

const filter = ref<Filter>({ classId: null, courseId: null, endStuNo: null, startStuNo: null })

const classes = ref<(typeof SelectOption)[]>([])
const fetchClasses = () => {
    axios
        .get("/course")
        .then((res) => {
            if (res.data.code && res.data.code === "10000") {
                let result: Course[] = res.data.data
                classes.value = result.map((c) => {
                    return {
                        value: c.id,
                        label: `${c.id} - ${c.name}`,
                    }
                })
            } else {
                message.warning(`获取课程失败：${res.data.msg}`)
            }
        })
        .catch(() => {
            message.warning(`获取课程失败：网络连接错误`)
        })
}

let totalSize = ref(0)
let pageSize = 20
let pageNum = 1

let tableLoading = ref(false)

const fetchData = () => {
    tableLoading.value = true
    axios
        .get("/student", {
            params: {
                page_size: pageSize,
                page_num: pageNum,
                courseId: filter.value.courseId,
                classId: filter.value.classId,
                startStuNo: filter.value.startStuNo,
                endStuNo: filter.value.endStuNo,
            },
        })
        .then((res) => {
            tableLoading.value = false
            if (res.data.code && res.data.code === "10000") {
                totalSize.value = res.data.data.totalNum
                dataSource.value = res.data.data.students
            } else {
                message.warning(`获取学生信息失败：${res.data.msg}`)
            }
        })
        .catch(() => {
            tableLoading.value = false
            message.warning(`获取学生信息失败：网络连接错误`)
        })
}

let selection = ref<Key[]>([])

const rowSelection: TableProps["rowSelection"] = {
    onChange: (selectedRowKeys) => (selection.value = selectedRowKeys),
}

const deleteSelection = () => {
    Modal.confirm({
        title: "确认删除吗",
        content: `您即将删除${selection.value.length}位同学，请谨慎操作`,
        onOk: () => {
            let params = new URLSearchParams()
            selection.value.forEach((k: Key) => {
                let s = (k.valueOf() as string).split("-")
                params.append("id", s[0])
                params.append("cid", s[1])
            })
            tableLoading.value = true

            axios
                .delete("/student", {
                    params: params,
                })
                .then((res) => {
                    tableLoading.value = false
                    if (res.data.code && res.data.code === "10000") {
                        message.success(`删除学生成功`)
                        fetchData()
                    } else {
                        message.warning(`删除学生失败：${res.data.msg}`)
                    }
                })
                .catch(() => {
                    tableLoading.value = false
                    message.warning(`删除学生失败：网络连接错误`)
                })
        },
    })
}

const importOpen = ref(false)
const importFinish = () => {
    fetchData()
    importOpen.value = false
}

onMounted(() => {
    fetchData()
    fetchClasses()
})
</script>

<template>
    <a-card>
        <h1 class="text-2xl font-bold">学生管理</h1>
        <p class="text-gray-500 mt-2">管理课程中的学生名单</p>
        <a-divider />
        <div class="text-gray-500 mb-4">
            <p>设计说明：</p>
            <p>Bot将学生的名单放于此处，便于进行名片检查、自动入群验证等功能。</p>
            <p>
                Bot当前的设计方案是：名片检查中检查到非本课程学生，会予以提示（因为可能存在格式正确但信息填错的情况）；而同学申请入群时，只要信息填写正确，就能自动通过（若不正确则会留给人工审核）。
            </p>
            <p>
                我们当前参照上一届的bot提供了两种方式导入同学的信息，若您需要导入其他格式（如Excel、SQL等），也可以向我们提出新的需求，我们尽量满足。
            </p>
        </div>
        <a-divider />
        <p class="font-bold">筛选器</p>
        <div class="flex items-center">
            <a-form layout="inline" name="filter">
                <a-form-item label="课程"><a-select style="width: 220px" :options="classes" v-model:value="filter.courseId" /></a-form-item>
                <a-form-item label="班号"><a-input style="width: 120px" v-model:value="filter.classId" /></a-form-item>
                <a-form-item label="学号范围">
                    <a-input style="width: 120px" v-model:value="filter.startStuNo" /> -
                    <a-input style="width: 120px" v-model:value="filter.endStuNo" />
                </a-form-item>
                <a-form-item><a-button @click="fetchData">筛选</a-button></a-form-item>
            </a-form>
            <div class="grow" />
            <a-space>
                <a-button type="primary" @click="importOpen = true">导入学生</a-button>
                <a-button type="primary" danger :disabled="selection.length == 0" @click="deleteSelection">删除选中</a-button>
            </a-space>
        </div>
        <a-table
            :row-key="(r) => `${r.stuNo}-${r.courseId}`"
            :columns="columns"
            :row-selection="rowSelection"
            :data-source="dataSource"
            :loading="tableLoading"
            class="my-5"
            :pagination="{
                total: totalSize,
                current: pageNum,
                pageSize: pageSize,
                'onUpdate:current': (current: number) => (pageNum = current),
                'onUpdate:pageSize': (size: number) => (pageSize = size),
                onChange: fetchData,
            }"
        />
    </a-card>
    <a-modal v-model:open="importOpen" style="width: 750px" title="导入学生" @ok="importFinish" destroyOnClose>
        <import-student />
    </a-modal>
</template>

<style scoped></style>
