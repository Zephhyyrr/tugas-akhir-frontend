<template>
    <BaseModal :modelValue="modelValue" @update:modelValue="$emit('update:modelValue', $event)" title="Edit Pengguna"
        icon="lucide:user" type="info" confirmText="Simpan Perubahan" @confirm="submitEditUser">
        <div v-if="editData" class="space-y-4 text-left mt-2">
            <div>
                <label class="block mb-1 text-sm font-medium text-gray-700">Nama Lengkap</label>
                <input v-model="editData.nama" type="text"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" />
            </div>
            <div>
                <label class="block mb-1 text-sm font-medium text-gray-700">Alamat Email</label>
                <input v-model="editData.email" type="email"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" />
            </div>
            <div>
                <label class="block mb-1 text-sm font-medium text-gray-700">Role</label>
                <select v-model="editData.role"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm">
                    <option value="superadmin">Super Admin</option>
                    <option value="admin">Admin</option>
                </select>
            </div>
            <div>
                <label class="block mb-1 text-sm font-medium text-gray-700">Status</label>
                <select v-model="editData.isActive"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm">
                    <option :value="true">Active</option>
                    <option :value="false">Inactive</option>
                </select>
            </div>
        </div>
    </BaseModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useUser } from '~/composables/useUsers';
import type { IUser, IUpdateUserPayload } from '~/domain/models/IUser';

const props = defineProps<{
    modelValue: boolean;
    user: IUser | null;
}>();

const emit = defineEmits(['update:modelValue', 'success']);
const { updateUser } = useUser();

type EditUserForm = IUpdateUserPayload & { id: number };
const editData = ref<EditUserForm | null>(null);

watch(() => props.user, (newVal) => {
    if (newVal) {
        editData.value = {
            id: newVal.id,
            nama: newVal.nama || '',
            email: newVal.email || '',
            role: newVal.role,
            isActive: newVal.isActive ?? true
        };
    }
}, { immediate: true });

const submitEditUser = async () => {
    if (!editData.value) return;
    try {
        await updateUser(editData.value.id, editData.value);
        emit('update:modelValue', false)
        emit('success', 'Pengguna Diperbarui', `Data pengguna ${editData.value.nama} berhasil diupdate.`);
    } catch (error) {
        console.error('Gagal mengupdate user:', error);
    }
};
</script>