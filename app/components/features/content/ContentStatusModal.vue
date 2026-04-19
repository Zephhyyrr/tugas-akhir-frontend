<template>
    <BaseModal :modelValue="modelValue" @update:modelValue="$emit('update:modelValue', $event)" :title="modalTitle"
        icon="lucide:arrow-right-left" type="info" :confirmText="confirmText" @confirm="submitToggleStatus">
        <p class="text-sm text-gray-700">
            {{ modalMessage }}
        </p>
    </BaseModal>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useContent } from '~/composables/useContents';

const props = defineProps<{
    modelValue: boolean;
    item: any | null;
}>();

const emit = defineEmits(['update:modelValue', 'success']);
const { toggleStatus } = useContent();

const targetStatus = computed(() => props.item?.status === 'published' ? 'draft' : 'published');

const modalTitle = computed(() =>
    targetStatus.value === 'published' ? 'Terbitkan Konten' : 'Ubah ke Draft'
);

const confirmText = computed(() =>
    targetStatus.value === 'published' ? 'Terbitkan Sekarang' : 'Simpan ke Draft'
);

const modalMessage = computed(() => {
    if (!props.item) return '';
    return targetStatus.value === 'published'
        ? `Apakah Anda yakin ingin menerbitkan (publish) artikel "${props.item.judul}" agar dapat dilihat publik?`
        : `Apakah Anda yakin ingin menyembunyikan artikel "${props.item.judul}" ke dalam draft?`;
});

const submitToggleStatus = async () => {
    if (!props.item) return;

    try {
        await toggleStatus(props.item.id, { status: targetStatus.value });
        emit('update:modelValue', false);
        if (targetStatus.value === 'published') {
            emit('success', 'Konten Diterbitkan', 'Konten berhasil diubah menjadi published.');
        } else {
            emit('success', 'Konten Diarsipkan', 'Konten berhasil dikembalikan ke status draft.');
        }
    } catch (error) {
        console.error('Gagal mengubah status konten:', error);
    }
};
</script>
