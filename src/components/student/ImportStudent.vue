<script setup lang="ts">
import { h, ref } from "vue"
import { MenuProps, message } from "ant-design-vue"
import { OhVueIcon } from "oh-vue-icons"
import DropInUploader from "@/components/utility/DropInUploader.vue"
import axios from "axios"
import ImportResultView from "@/components/student/ImportResultView.vue"

const current = ref<string[]>(["txt"])

const items = ref<MenuProps["items"]>([
    {
        key: "roster",
        icon: () => h(OhVueIcon, { name: "bi-filetype-xls" }),
        label: "上传点名册",
    },
    {
        key: "csv",
        icon: () => h(OhVueIcon, { name: "bi-filetype-csv" }),
        label: "CSV文件",
    },
    // {
    //   key: "txt",
    //   icon: () => h(OhVueIcon, { name: "bi-filetype-txt" }),
    //   label: "文本文件",
    // },
    // {
    //   key: "manual",
    //   icon: () => h(OhVueIcon, { name: "co-pencil" }),
    //   label: "手动输入",
    // },
])

const courseId = ref("")
const classId = ref("")

const uploadFile = (file: File) => {
    let form = new FormData()
    form.append("file", file)

    if (current.value[0] === "txt") {
        if (courseId.value.length == 0 || classId.value.length == 0) {
            message.warning("课号或班号未填")
            return
        }
        form.append("course_id", courseId.value)
        form.append("class_id", classId.value)
    }

    axios
        .post("/student/import", form)
        .then((res) => {
            if (res.data.code && res.data.code === "10000") {
                message.success(`上传成功`)
            } else {
                message.warning(`上传失败：${res.data.msg}`)
            }
        })
        .catch(() => {
            message.warning(`上传失败：网络连接错误`)
        })
}

const showResult = ref(true)
</script>

<template>
    <p class="text-gray-500">您可以上传文件或者手动输入信息来导入学生。</p>
    <a-menu mode="horizontal" :items="items" v-model:selected-keys="current" />
    <div v-if="current[0] === 'txt'" class="px-4">
        <p class="font-bold">文件格式说明：</p>
        <p>请以【学号】 【姓名】的格式组织TXT中的内容，如下图所示：</p>
        <img src="/img/txt-sample.png" style="height: 130px" alt="" class="object-contain" />
        <p>您需要手动填写本次上传的课号和班号：</p>
        <a-form name="classCourse" layout="inline" class="mb-6">
            <a-form-item label="课号">
                <a-input style="width: 150px" v-model:value="courseId" placeholder="例 100717" />
            </a-form-item>
            <a-form-item label="班号">
                <a-input style="width: 150px" v-model:value="classId" placeholder="例 01" />
            </a-form-item>
        </a-form>
        <drop-in-uploader class="my-4" file-type="text/plain" @upload="uploadFile" />
    </div>
    <div v-else-if="current[0] === 'csv'" class="px-4">
        <p class="font-bold">文件格式说明：</p>
        <p>请使用<strong>UTF8</strong>格式保存CSV，并使用<strong>英文半角逗号</strong>分割数据</p>
        <p>
            CSV文件必须携带表头，且表头为以下五者：【姓名】【学号】【课号】【班号】【专业】，班号和专业可不传入，表头顺序可打乱。下图为一个可行的CSV示例：
        </p>
        <img src="/img/csv-sample.png" style="height: 200px" alt="" class="object-contain mb-4" />
        <drop-in-uploader class="my-4" file-type="text/csv" @upload="uploadFile" />
    </div>
    <div v-else-if="current[0] === 'roster'" class="px-4">
        <p class="font-bold">导入说明：</p>
        <p>请导入由1系统导出的点名册，样例如下所示：</p>
        <img src="/img/roster-sample.png" style="height: 300px" alt="" class="object-contain mb-4" />
        <p class="text-gray-500 mb-6">程序原生支持xlsx，兼容xls，若xls格式不能正常导入，在我们修复程序前可以尝试转换为xlsx后重试。</p>
        <drop-in-uploader
            file-type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            @upload="uploadFile"
        />
    </div>
    <import-result-view v-model:show="showResult"></import-result-view>
</template>

<style scoped></style>
