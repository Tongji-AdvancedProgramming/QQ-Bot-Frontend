<script setup lang="ts">
import { onMounted, ref } from "vue"
import QQGroup from "@/models/qqGroup.js"
import axios from "axios"
import { message } from "ant-design-vue"
import { ValidateGroup } from "@/models/quicktype/ValidateGroup.js"

interface Props {
  groupId: string
  courseId: string
}

const group = ref<QQGroup>({
  courseId: "",
  id: "",
  note: "",
})

const props = defineProps<Props>()

onMounted(async () => {
  if (props.groupId && props.groupId.length > 0) {
    try {
      let res = await axios.get(`/group/${props.groupId}`)
      if (res.data.code && res.data.code === "10000") {
        group.value = res.data.data
      } else {
        message.warning(`获取课程失败：${res.data.msg}`)
        return
      }
    } catch {
      message.warning(`获取课程失败：网络连接错误`)
      return
    }
  }
  group.value.courseId = props.courseId
})

const checkValidateShow = ref(false)
const checkingValidate = ref(false)
const checkValidateResult = ref<ValidateGroup>({ botId: 0, message: "", nickname: "" })

const validate = () => {
  let groupId = group.value.id
  if (groupId.length === 0) {
    message.warning("未填入群号")
  } else if (!/\d+/.test(groupId)) {
    message.warning("群号不合法")
  }
  checkingValidate.value = true

  axios
    .post(`/group/validate?group_id=${groupId}`)
    .then((res) => {
      checkingValidate.value = false
      if (res.data.code && res.data.code === "10000") {
        checkValidateResult.value = res.data.data
        checkValidateShow.value = true
      } else {
        message.warning(`查询失败：${res.data.msg}`)
      }
    })
    .catch(() => {
      checkingValidate.value = false
    })
}

const emits = defineEmits(["ok"])

const submit = () => {
  axios
    .post(`/group/`, group.value)
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
  <a-form :model="group" name="group" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" class="my-10">
    <a-form-item label="群号">
      <a-input v-model:value="group.id" />
    </a-form-item>
    <a-form-item label="关联课程">
      <a-input v-model:value="group.courseId" disabled />
    </a-form-item>
    <a-form-item label="备注">
      <a-input v-model:value="group.note" />
    </a-form-item>
    <a-form-item label="操作">
      <a-space>
        <a-button @click="validate" :loading="checkingValidate">检查Bot群内权限</a-button>
        <a-button v-if="props.groupId.length > 0" danger type="primary">删除</a-button>
      </a-space>
    </a-form-item>
  </a-form>
  <a-modal v-model:open="checkValidateShow" @ok="checkValidateShow = false">
    <a-form name="validate" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" class="my-10">
      <a-form-item label="Bot QQ号">
        <span>{{ checkValidateResult.botId }}</span>
      </a-form-item>
      <a-form-item label="Bot 昵称">
        <span>{{ checkValidateResult.nickname }}</span>
      </a-form-item>
      <a-form-item label="检查结果">
        <span>{{ checkValidateResult.message }}</span>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<style scoped></style>
