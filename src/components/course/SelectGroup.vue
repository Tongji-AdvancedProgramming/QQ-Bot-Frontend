<script setup lang="ts">
import EditCourse from "@/components/course/EditCourse.vue";
import {Course} from "@/models/quicktype/Course.ts";
import {reactive, ref} from "vue";
import QQGroup from "@/models/qqGroup.ts";
import {Key} from "ant-design-vue/lib/table/interface";

interface Props {
  open: boolean
  course: Course
}

const props = defineProps<Props>()
const emits = defineEmits<{
  "update:open": []
}>()

const groups = ref<QQGroup[]>([])
const columns = reactive([
  {title: '群号', dataIndex: 'id'},
  {title: '备注', dataIndex: 'note'},
])

const state = reactive<{
  selectedRowKeys: Key[],
  loading: boolean
}>({selectedRowKeys: [], loading: false})

const onSelectChange = (selectedRowKeys: Key[]) => {
}


</script>

<template>
  <a-modal :open="open" @update:open="v => emits('update:open', v)" title="关联课程和QQ群" @ok="" destroyOnClose>
    <p>课程：{{ course.id }} - {{ course.name }}</p>
    <p class="text-gray-500">关联后，您可以在该群内使用该课程的学生名单进行群名片检查、入群验证等功能。</p>
    <br/>
    <a-table :columns="columns" :data-source="groups" size="small" :loading="state.loading"
             :row-selection="{selectedRowKeys:state.selectedRowKeys,onChange:onSelectChange}"/>
  </a-modal>
</template>

<style scoped>

</style>
