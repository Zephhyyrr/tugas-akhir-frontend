<template>
  <div>
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Manajemen Pengguna</h1>
        <p class="text-gray-600">Kelola akun pengguna sistem</p>
      </div>
      <BaseButton text="Tambah Pengguna" variant="primary" :fullWidth="false" icon="lucide:plus" @click="goToCreate" />
    </div>

    <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex items-center">
      <div class="relative w-full max-w-md">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon class="h-5 w-5 text-gray-400" />
        </div>
        <input v-model="searchQuery" type="text"
          class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
          placeholder="Cari pengguna...">
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="pending" class="hover:bg-gray-50">
              <td colspan="5" class="px-6 py-8 text-center">
                <Icon icon="lucide:loader-circle" class="w-8 h-8 animate-spin text-primary mx-auto" />
              </td>
            </tr>
            <tr v-else-if="filteredUsers.length === 0">
              <td colspan="5" class="px-6 py-8 text-center text-gray-500 text-sm">Tidak ada data pengguna ditemukan.</td>
            </tr>
            <tr v-else v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold">
                    {{ (user.nama || 'U').charAt(0) }}
                  </div>
                  <div class="ml-4 text-sm font-medium text-gray-900">{{ user.nama }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ user.email }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{{ user.role }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <button type="button"
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full transition-colors outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary/30"
                  :class="user.isActive ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-red-100 text-red-800 hover:bg-red-200'"
                  @click="openActionModal('status', user)">
                  {{ user.isActive ? 'Aktif' : 'Tidak Aktif' }}
                </button>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button @click="openActionModal('edit', user)" class="text-blue-600 hover:text-blue-800 p-1.5 hover:bg-blue-50 rounded-lg mr-2 transition-colors outline-none focus:ring-2 focus:ring-blue-500/50" title="Edit">
                  <PencilIcon class="w-4 h-4" />
                </button>
                <button @click="openActionModal('delete', user)" class="text-red-600 hover:text-red-800 p-1.5 hover:bg-red-50 rounded-lg transition-colors outline-none focus:ring-2 focus:ring-red-500/50" title="Hapus">
                  <TrashIcon class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <FeaturesUsersUserStatusModal v-model="showStatusModal" :user="selectedUser" @success="handleSuccess" />
    <FeaturesUsersUserEditModal v-model="showEditModal" :user="selectedUser" @success="handleSuccess" />
    <FeaturesUsersUserDeleteModal v-model="showDeleteModal" :user="selectedUser" @success="handleSuccess" />
    
    <BaseModal v-model="showResultModal" :title="resultTitle" icon="lucide:badge-check" type="success" confirmText="Tutup">
      <p class="text-sm text-gray-700">{{ resultMessage }}</p>
    </BaseModal>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { definePageMeta, useRouter } from '#imports';
import { SearchIcon, PencilIcon, TrashIcon } from 'lucide-vue-next';
import { Icon } from '@iconify/vue';
import { useUser } from '~/composables/useUsers';
import type { IUser } from '~/domain/models/IUser';
import type { IApiResponse } from '~/domain/types/IApiResponse';

definePageMeta({ layout: 'dashboard' as any });

const router = useRouter();
const { fetchUsers } = useUser();
const { data: apiResponse, pending, refresh } = fetchUsers(ref({ page: 1, limit: 10  }));

const users = computed<IUser[]>(() => (apiResponse.value as IApiResponse<IUser[]>)?.data ?? []);
const searchQuery = ref('');
const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value;
  const lowerQuery = searchQuery.value.toLowerCase();
  return users.value.filter(u => 
    u.nama?.toLowerCase().includes(lowerQuery) ||
    u.email?.toLowerCase().includes(lowerQuery) ||
    u.role?.toLowerCase().includes(lowerQuery)
  );
});

const goToCreate = () => router.push('/dashboard/users/create');
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const showStatusModal = ref(false);
const selectedUser = ref<IUser | null>(null);

const openActionModal = (action: 'edit' | 'delete' | 'status', user: IUser) => {
  selectedUser.value = user;
  if (action === 'edit') showEditModal.value = true;
  if (action === 'delete') showDeleteModal.value = true;
  if (action === 'status') showStatusModal.value = true;
};

const showResultModal = ref(false);
const resultTitle = ref('');
const resultMessage = ref('');

const handleSuccess = async (title: string, message: string) => {
  await refresh();
  resultTitle.value = title;
  resultMessage.value = message;
  showResultModal.value = true;
};
</script>