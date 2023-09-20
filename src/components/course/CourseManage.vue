<script setup lang="ts">
import { h, onMounted, ref } from "vue"
import { message, Modal, TableColumnsType } from "ant-design-vue"
import axios from "axios"
import { Course } from "@/models/quicktype/Course.js"
import EditGroup from "@/components/course/EditGroup.vue"
import EditCourse from "@/components/course/EditCourse.vue"

const columns = ref<TableColumnsType>([
  {
    title: "课号",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "课名",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "课程群",
    dataIndex: "groups",
    key: "groups",
  },
  {
    title: "操作",
    key: "actions",
  },
])
const datasource = ref<Course[]>([])

const editGroupOpen = ref(false)
const editGroupId = ref("")
const editCourseOpen = ref(false)
const editCourseId = ref("")

const editCourseRecord = ref<Course | null>(null)

const editGroup = (groupId: string, courseId: string) => {
  editGroupId.value = groupId
  editCourseId.value = courseId
  editGroupOpen.value = true
}

const addGroup = (courseId: string) => {
  editGroupId.value = ""
  editCourseId.value = courseId
  editGroupOpen.value = true
}

const editCourse = (record: Course) => {
  editCourseId.value = record.id
  editCourseRecord.value = record
  editCourseOpen.value = true
}

const addCourse = () => {
  editCourseId.value = ""
  editCourseOpen.value = true
}

const refresh = () => {
  axios
    .get("/course")
    .then((res) => {
      if (res.data.code && res.data.code === "10000") {
        datasource.value = res.data.data
      } else {
        message.warning(`获取课程失败：${res.data.msg}`)
      }
    })
    .catch(() => {
      message.warning(`获取课程失败：网络连接错误`)
    })
}

const editGroupDialog = ref<InstanceType<typeof EditGroup> | null>(null)
const editCourseDialog = ref<InstanceType<typeof EditCourse> | null>(null)

const submitEditGroup = () => {
  if (editGroupDialog.value) {
    editGroupDialog.value.submit()
  }
}

const editGroupFinish = () => {
  editGroupOpen.value = false
  refresh()
}

const submitEditCourse = () => {
  if (editCourseDialog.value) {
    editCourseDialog.value.submit()
  }
}

const editCourseFinish = () => {
  editCourseOpen.value = false
  refresh()
}

const deleteCourse = (record: Course) => {
  Modal.confirm({
    title: "警告",
    content: h("div", {}, [
      h("p", `您确定要删除课程【${record.id}】吗？该操作不可逆。`),
      h("p", "提示：删除课程后，绑定的课程群和学生也会一起被全部删除。请谨慎使用本功能！"),
    ]),
    autoFocusButton: "cancel",
    okButtonProps: {
      danger: true,
    },
    onOk: () => {
      axios
        .delete(`/course/${record.id}`)
        .then((res) => {
          if (res.data.code && res.data.code === "10000") {
            message.success(`删除成功`)
            refresh()
          } else {
            message.warning(`删除课程失败：${res.data.msg}`)
          }
        })
        .catch(() => {
          message.warning(`删除课程失败：网络连接错误`)
        })
    },
  })
}

onMounted(() => {
  refresh()
})
</script>

<template>
  <a-card>
    <h1 class="text-2xl font-bold">课程管理</h1>
    <p class="text-gray-500 mt-2">管理系统中的课程并绑定群号</p>
    <a-divider />
    <div class="text-gray-500 mb-4">
      <p>设计说明：</p>
      <p>Bot按照【课程】来管理学生和群的数据，每个学生可以参与多门课程，每门课程也可以拥有多个课程QQ群。</p>
      <p>这里的“课程”指的是诸如“100717 高级语言程序设计”这样的课程。</p>
      <br />
      <p>您可以在这里管理需要使用Bot进行管理的课程；点击群标签可以编辑群的相关信息。</p>
    </div>
    <div class="mt-5">
      <div class="flex my-3">
        <div class="grow" />
        <a-button @click="addCourse">添加课程</a-button>
      </div>
      <a-table :data-source="datasource" :columns="columns">
        <template #emptyText
          ><a-empty><template #description>当前没有课程，快添加一个吧！</template></a-empty></template
        >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'groups'">
            <a-tag v-for="g in record.groups" @click="editGroup(g, record.id)" style="cursor: pointer">{{ g }}</a-tag>
            <a-tag @click="addGroup(record.id)" style="cursor: pointer">添加</a-tag>
          </template>
          <template v-else-if="column.key === 'actions'">
            <a-space>
              <a-button size="small" @click="editCourse(record)">编辑</a-button>
              <a-button danger size="small" @click="deleteCourse(record)">删除</a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </div>
  </a-card>
  <a-modal v-model:open="editGroupOpen" title="编辑或新建QQ群" @ok="submitEditGroup" destroyOnClose>
    <EditGroup ref="editGroupDialog" :course-id="editCourseId" :group-id="editGroupId" @ok="editGroupFinish" />
  </a-modal>
  <a-modal v-model:open="editCourseOpen" title="编辑或新建课程" @ok="submitEditCourse" destroyOnClose>
    <EditCourse ref="editCourseDialog" :course-id="editCourseId" :course-record="editCourseRecord!" @ok="editCourseFinish" />
  </a-modal>
</template>

<style scoped></style>
