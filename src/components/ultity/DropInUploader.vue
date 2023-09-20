<script setup lang="ts">
import { ref } from "vue"

interface Props {
  fileType: string
}
const props = defineProps<Props>()

interface Emits {
  (e: "upload", file: File): void
}
const emits = defineEmits<Emits>()

const fileDrop = ref<HTMLDivElement>()
const fileSelect = ref<HTMLInputElement>()

const currentFileName = ref("")
const currentFile = ref<File | null>(null)
const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  fileDrop.value?.classList.remove("file-area-enter")

  let files = event.dataTransfer.files
  if (files.length === 0) return

  let file = files[0]
  if (file.type !== props.fileType) return

  currentFileName.value = `${file.name} (${(file.size / 1024).toFixed(2)}KB)`
  currentFile.value = file
}

const handleClick = (event) => {
  event.preventDefault()
  fileSelect.value?.click()
}
const handleDragenter = (event) => {
  event.preventDefault()
  fileDrop.value?.classList.add("file-area-enter")
}
const handleDragover = (event) => {
  event.preventDefault()
}
const handleDragleave = (event) => {
  event.preventDefault()
  fileDrop.value?.classList.remove("file-area-enter")
}
const handleChange = (event: Event) => {
  const input = event.target as HTMLInputElement

  let files = input.files
  if (files.length === 0) return

  let file = files[0]
  if (file.type !== props.fileType) return

  currentFileName.value = `${file.name} (${(file.size / 1024).toFixed(2)}KB)`
  currentFile.value = file
}

const upload = () => {
  if (currentFile.value) emits("upload", currentFile.value!)
}
</script>

<template>
  <div class="flex">
    <div class="grow" />
    <div class="text-center">
      <div
        style="width: 350px; height: 200px; cursor: pointer"
        ref="fileDrop"
        class="bg-cyan-100 rounded-xl file-area flex justify-center items-center flex-col"
        id="file-drop"
        @click="handleClick"
        @drop="handleDrop"
        @dragenter="handleDragenter"
        @dragover="handleDragover"
        @dragleave="handleDragleave"
        draggable="true"
      >
        <v-icon name="bi-file-earmark-arrow-down" :scale="4" fill="#2968F1" style="pointer-events: none" />
        <span v-if="currentFileName.length === 0" style="pointer-events: none">拖入或点击选择文件</span>
        <span v-else style="pointer-events: none">{{ currentFileName }}</span>
      </div>
      <div class="my-5">
        <a-button type="primary" style="width: 200px" :disabled="currentFile === null" @click="upload">上传</a-button>
      </div>
    </div>
    <div class="grow" />
  </div>
  <input type="file" ref="fileSelect" style="display: none" :accept="fileType" @change="handleChange" />
</template>

<style scoped>
.file-area {
  border: 3px rgb(41, 104, 241) dashed;
  transition-duration: 200ms;
}

.file-area:hover {
  filter: brightness(115%);
  transition-duration: 200ms;
}

.file-area-enter {
  filter: brightness(90%);
  transition-duration: 200ms;
}
</style>
