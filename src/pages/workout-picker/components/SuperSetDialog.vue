<template>
  <AppDialog
    :visible="visible"
    title="临时取名"
    confirm-text="保存"
    cancel-text="取消"
    keyboard-aware
    @update:visible="emit('update:visible', $event)"
    @confirm="onSave"
    @cancel="emit('update:visible', false)"
  >
    <input
      v-model="name"
      class="ssd__input"
      :placeholder="defaultValue"
      placeholder-class="ssd__ph"
      :maxlength="40"
    >
  </AppDialog>
</template>

<script setup lang="ts">
/**
 * 临时超级组 · 命名弹层（设计稿 ⑭ 屏）
 * 默认名 = 选中动作名用「+」拼接；留空则回落默认名。
 */
import { ref, watch } from 'vue';
import AppDialog from '@/components/overlays/AppDialog.vue';

const props = defineProps<{ visible: boolean; defaultValue: string }>();

const emit = defineEmits<{
  (e: 'update:visible', visible: boolean): void;
  (e: 'save', name: string): void;
}>();

const name = ref('');

watch(
  () => props.visible,
  (open) => {
    // 打开时把默认名预填进输入框（参考稿也是预填、不是 placeholder），可直接改
    if (open) name.value = props.defaultValue;
  },
);

function onSave() {
  emit('save', name.value.trim() || props.defaultValue);
  emit('update:visible', false);
}
</script>

<style lang="scss" scoped>
.ssd__input {
  box-sizing: border-box;
  width: 100%;
  height: 44px;
  padding: 0 var(--sp-3);
  font-size: var(--fs-base);
  color: var(--text-1);
  background-color: var(--fill);
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-sm);
}

.ssd__ph {
  color: var(--text-4);
}
</style>
