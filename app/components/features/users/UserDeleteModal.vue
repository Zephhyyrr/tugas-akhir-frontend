<template>
    <BaseModal :modelValue="modelValue" @update:modelValue="$emit('update:modelValue', $event)" title="Hapus Pengguna"
        icon="lucide:trash-2" type="danger" confirmText="Ya, Hapus" @confirm="submitDeleteUser">
        <p class="text-sm text-gray-700">
            Apakah Anda yakin ingin menghapus pengguna <strong>{{ user?.nama || user?.email }}</strong> secara permanen?
        </p>
    </BaseModal>
</template>

<script setup lang="ts">
import { useUser } from '~/composables/useUsers';
import type { IUser } from '~/domain/models/IUser';

const props = defineProps<{
    modelValue: boolean;
    user: IUser | null;
}>();

const emit = defineEmits(['update:modelValue', 'success']);
const { deleteUser } = useUser();

const submitDeleteUser = async () => {
    if (!props.user) return;
    try {
        await deleteUser(props.user.id);
        emit('update:modelValue', false);
        emit('success', 'Pengguna Dihapus', 'Data pengguna berhasil dihapus secara permanen dari sistem.');
    } catch (error) {
        console.error('Gagal menghapus user:', error);
    }
};
</script>