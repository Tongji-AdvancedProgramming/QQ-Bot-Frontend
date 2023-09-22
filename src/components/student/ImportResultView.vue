<script setup lang="ts">
import { computed } from "vue"

interface Props {
    show: boolean
}

const props = defineProps<Props>()

const emits = defineEmits<{
    (e: "update:show", value: boolean): void
}>()

const showModal = computed({
    get: () => props.show,
    set: (value: boolean) => emits("update:show", value),
})
</script>

<template>
    <a-modal v-model:open="showModal" @ok="showModal = false" :width="900">
        <h1 class="text-xl font-bold">确认导入结果</h1>
        <a-divider />
    </a-modal>
</template>
