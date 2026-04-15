<template>
  <div class="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <!-- Sidebar -->
    <aside class="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:block transition-colors duration-200">
      <div class="p-6">
        <h1 class="text-xl font-bold text-emerald-600 dark:text-emerald-400">Surau Zam-Zam</h1>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Sistem Peramalan Donasi</p>
      </div>
      
      <nav class="mt-4 px-4 space-y-1">
        <NuxtLink to="/" class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors" active-class="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-medium">
          <LayoutDashboardIcon class="w-5 h-5 mr-3" />
          Dashboard
        </NuxtLink>
        <NuxtLink to="/reports" class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors" active-class="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-medium">
          <FileTextIcon class="w-5 h-5 mr-3" />
          Laporan
        </NuxtLink>
        <NuxtLink to="/input" class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors" active-class="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-medium">
          <PenLineIcon class="w-5 h-5 mr-3" />
          Input Donasi
        </NuxtLink>
        <NuxtLink to="/users" class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors" active-class="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-medium">
          <UsersIcon class="w-5 h-5 mr-3" />
          Manajemen User
        </NuxtLink>
        <NuxtLink to="/settings" class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors" active-class="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-medium">
          <SettingsIcon class="w-5 h-5 mr-3" />
          Pengaturan
        </NuxtLink>
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <!-- Header -->
      <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-8 shadow-sm transition-colors duration-200">
        <div class="flex items-center">
             <!-- Mobile Menu Button (Visible only on small screens) -->
             <button class="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 mr-4">
                <MenuIcon class="w-6 h-6" />
             </button>
             <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
               {{ currentRouteName }}
             </h2>
        </div>
        <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2">
                <div class="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold">
                    A
                </div>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-200">Admin</span>
            </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-x-hidden overflow-y-auto p-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { LayoutDashboardIcon, FileTextIcon, PenLineIcon, SettingsIcon, MenuIcon, UsersIcon } from 'lucide-vue-next';

const { initTheme } = useTheme();
const route = useRoute();

onMounted(() => {
  initTheme();
});

const currentRouteName = computed(() => {
    switch (route.path) {
        case '/': return 'Dashboard';
        case '/reports': return 'Laporan';
        case '/input': return 'Input Donasi';
        case '/settings': return 'Pengaturan';
        case '/users': return 'Manajemen User';
        default: 
            if (route.path.startsWith('/users/')) return 'Manajemen User';
            return 'Dashboard';
    }
});
</script>

<style scoped>
/* Add any layout specific custom styles here if needed */
</style>
