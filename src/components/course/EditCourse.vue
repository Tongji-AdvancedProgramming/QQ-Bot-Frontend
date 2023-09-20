<script setup lang="ts">
import { Course } from "@/models/quicktype/Course.ts"
import { onMounted, ref } from "vue"
import axios from "axios"
import { message } from "ant-design-vue"

interface Props {
  courseId: string
  courseRecord: Course
}

const props = defineProps<Props>()

const course = ref<Course>({ groups: [], id: "", name: "" })

onMounted(() => {
  if (props.courseId.length > 0) {
    course.value = props.courseRecord
  }
})

const emits = defineEmits(["ok"])

const submit = () => {
  axios
    .post(`/course/`, course.value)
    .then((res) => {
      if (res.data.code && res.data.code === "10000") {
        message.success(`操作成功`)
        emits("ok")
      } else {
        message.warning(`操作失败：${res.data.msg}`)
      }
    })
    .catch(() => {
      message.warning(`操作失败：网络连接错误`)
    })
}

defineExpose({
  submit,
})
</script>

<template>
  <a-form name="course" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" class="my-10">
    <a-form-item label="课号">
      <a-input v-model:value="course.id" />
    </a-form-item>
    <a-form-item label="备注">
      <a-input v-model:value="course.name" />
    </a-form-item>
  </a-form>
</template>

<style scoped></style>
