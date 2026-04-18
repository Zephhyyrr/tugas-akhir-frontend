<template>
    <BaseModal :modelValue="modelValue" @update:modelValue="$emit('update:modelValue', $event)" :title="modalTitle"
        icon="lucide:shield-alert" type="warning" :confirmText="confirmText" @confirm="submitToggleStatus">
        <p class="text-sm text-gray-700">
            {{ modalMessage }}
        </p>
    </BaseModal>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useUser } from '~/composables/useUsers';
import type { IUser } from '~/domain/models/IUser';

const props = defineProps<{
    modelValue: boolean;
    user: IUser | null;
}>();

const emit = defineEmits(['update:modelValue', 'success']);
const { activateUser } = useUser();

const targetStatus = computed(() => !props.user?.isActive);

const modalTitle = computed(() =>
    targetStatus.value ? 'Aktifkan Pengguna' : 'Nonaktifkan Pengguna'
);

const confirmText = computed(() =>
    targetStatus.value ? 'Aktifkan' : 'Nonaktifkan'
);

const modalMessage = computed(() => {
    if (!props.user) return '';
    const nama = props.user.nama || props.user.email;
    return targetStatus.value
        ? `Apakah Anda yakin ingin mengaktifkan pengguna ${nama}?`
        : `Apakah Anda yakin ingin menonaktifkan pengguna ${nama}?`;
});

const submitToggleStatus = async () => {
    if (!props.user) return;

    try {
        await activateUser(props.user.id, { isActive: targetStatus.value });
        emit('update:modelValue', false);
        if (targetStatus.value) {
            emit('success', 'User Diaktifkan', 'User berhasil diaktifkan dan dapat mengakses sistem.');
        } else {
            emit('success', 'User Dinonaktifkan', 'User berhasil dinonaktifkan.');
        }
    } catch (error) {
        console.error('Gagal mengubah status user:', error);
    }
};
</script>