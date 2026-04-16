<template>
  <div>
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Manajemen Pengguna</h1>
        <p class="text-gray-600">Kelola akun pengguna sistem</p>
      </div>
      <NuxtLink to="/dashboard/users/create" class="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
        <PlusIcon class="w-5 h-5 mr-2" />
        Tambah Pengguna
      </NuxtLink>
    </div>

    <!-- Search / Filter -->
    <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex items-center">
        <div class="relative w-full max-w-md">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon class="h-5 w-5 text-gray-400" />
            </div>
            <input 
                v-model="searchQuery" 
                type="text" 
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" 
                placeholder="Cari pengguna..."
            >
        </div>
    </div>

    <!-- Users Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold">
                    {{ user.name.charAt(0) }}
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ user.email }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ user.role }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                    :class="user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                  {{ user.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <NuxtLink :to="`/users/${user.id}`" class="text-indigo-600 hover:text-indigo-900 mr-4">Edit</NuxtLink>
                <button @click="confirmDelete(user.id)" class="text-red-600 hover:text-red-900">Hapus</button>
              </td>
            </tr>
             <tr v-if="filteredUsers.length === 0">
                <td colspan="5" class="px-6 py-4 text-center text-gray-500 text-sm">
                    Tidak ada data pengguna ditemukan.
                </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { PlusIcon, SearchIcon } from 'lucide-vue-next';

const { users, deleteUser } = useUsers();
const searchQuery = ref('');

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value;
  const lowerQuery = searchQuery.value.toLowerCase();
  return users.value.filter(user => 
    user.name.toLowerCase().includes(lowerQuery) || 
    user.email.toLowerCase().includes(lowerQuery) ||
    user.role.toLowerCase().includes(lowerQuery)
  );
});

const confirmDelete = (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
        deleteUser(id);
    }
};
</script>
