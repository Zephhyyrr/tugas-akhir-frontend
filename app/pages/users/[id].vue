<template>
  <div class="max-w-2xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Edit Pengguna</h1>
      <p class="text-gray-600">Perbarui informasi pengguna</p>
    </div>

    <div v-if="user" class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <form @submit.prevent="submitForm">
        <div class="space-y-6">
          <!-- Name -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Nama Lengkap</label>
            <input 
              id="name" 
              v-model="form.name" 
              type="text" 
              required 
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
            >
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Alamat Email</label>
            <input 
              id="email" 
              v-model="form.email" 
              type="email" 
              required 
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
            >
          </div>

          <!-- Role -->
          <div>
            <label for="role" class="block text-sm font-medium text-gray-700">Peran (Role)</label>
            <select 
              id="role" 
              v-model="form.role" 
              required 
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
            >
              <option value="Administrator">Administrator</option>
              <option value="Staff">Staff</option>
            </select>
          </div>

          <!-- Status -->
          <div>
            <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
            <select 
              id="status" 
              v-model="form.status" 
              required 
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div class="mt-8 flex justify-end space-x-3">
          <NuxtLink to="/users" class="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors">
            Batal
          </NuxtLink>
          <button 
            type="submit" 
            class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium transition-colors"
          >
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
    <div v-else class="text-center py-12">
        <p class="text-gray-500">Pengguna tidak ditemukan.</p>
        <NuxtLink to="/users" class="text-emerald-600 hover:underline mt-2 inline-block">Kembali ke Daftar</NuxtLink>
    </div>
  </div>
</template>

<script setup>
const { getUserById, updateUser } = useUsers();
const route = useRoute();
const router = useRouter();
const userId = parseInt(route.params.id);

const user = ref(null);
const form = ref({
    name: '',
    email: '',
    role: '',
    status: ''
});

onMounted(() => {
    const foundUser = getUserById(userId);
    if (foundUser) {
        user.value = foundUser;
        form.value = { ...foundUser };
    }
});

const submitForm = () => {
    if (user.value) {
        updateUser(userId, form.value);
        router.push('/users');
    }
};
</script>
