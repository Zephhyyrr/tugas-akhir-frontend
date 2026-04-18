<template>
  <aside
    :class="[
      'fixed inset-y-0 left-0 z-40 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out md:relative md:translate-x-0',
      isOpen ? 'translate-x-0' : '-translate-x-full',
      isCollapsed ? 'w-20' : 'w-64'
    ]"
  >
    <div class="p-6 flex items-center" :class="isCollapsed ? 'justify-center px-4' : 'justify-between'">
      <div v-show="!isCollapsed" class="whitespace-nowrap overflow-hidden transition-opacity duration-300">
        <h1 class="text-xl font-bold text-emerald-600 dark:text-emerald-400">Surau Zam-Zam</h1>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Sistem Peramalan Donasi</p>
      </div>
      <div v-show="isCollapsed" class="whitespace-nowrap overflow-hidden transition-opacity duration-300">
        <h1 class="text-xl font-bold text-emerald-600 dark:text-emerald-400">SZ</h1>
      </div>
      <button @click="$emit('close')" class="md:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
        <XIcon class="w-5 h-5" />
      </button>
    </div>

    <nav class="mt-4 space-y-1" :class="isCollapsed ? 'px-2' : 'px-4'">
      <NuxtLink to="/dashboard"
        :class="[
          'flex items-center py-3 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors',
          isCollapsed ? 'justify-center px-0' : 'px-4'
        ]"
        active-class="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-medium"
        @click="$emit('close')"
        exact>
        <LayoutDashboardIcon class="w-5 h-5 flex-shrink-0" :class="!isCollapsed && 'mr-3'" />
        <span v-show="!isCollapsed" class="whitespace-nowrap transition-opacity duration-300">Dashboard</span>
      </NuxtLink>
      <NuxtLink to="/dashboard/reports"
        :class="[
          'flex items-center py-3 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors',
          isCollapsed ? 'justify-center px-0 mt-2' : 'px-4'
        ]"
        active-class="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-medium"
        @click="$emit('close')">
        <FileTextIcon class="w-5 h-5 flex-shrink-0" :class="!isCollapsed && 'mr-3'" />
        <span v-show="!isCollapsed" class="whitespace-nowrap transition-opacity duration-300">Laporan</span>
      </NuxtLink>
      <NuxtLink to="/dashboard/input"
        :class="[
          'flex items-center py-3 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors',
          isCollapsed ? 'justify-center px-0 mt-2' : 'px-4'
        ]"
        active-class="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-medium"
        @click="$emit('close')">
        <NotebookPen class="w-5 h-5 flex-shrink-0" :class="!isCollapsed && 'mr-3'" />
        <span v-show="!isCollapsed" class="whitespace-nowrap transition-opacity duration-300">Input Donasi</span>
      </NuxtLink>
      <NuxtLink to="/dashboard/input-keterangan"
        :class="[
          'flex items-center py-3 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors',
          isCollapsed ? 'justify-center px-0 mt-2' : 'px-4'
        ]"
        active-class="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-medium"
        @click="$emit('close')">
        <PenBox class="w-5 h-5 flex-shrink-0" :class="!isCollapsed && 'mr-3'" />
        <span v-show="!isCollapsed" class="whitespace-nowrap transition-opacity duration-300">Input Keterangan Donasi</span>
      </NuxtLink>
      <NuxtLink to="/dashboard/users"
        :class="[
          'flex items-center py-3 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors',
          isCollapsed ? 'justify-center px-0 mt-2' : 'px-4'
        ]"
        active-class="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-medium"
        @click="$emit('close')">
        <UsersIcon class="w-5 h-5 flex-shrink-0" :class="!isCollapsed && 'mr-3'" />
        <span v-show="!isCollapsed" class="whitespace-nowrap transition-opacity duration-300">Manajemen User</span>
      </NuxtLink>
      <NuxtLink to="/dashboard/settings"
        :class="[
          'flex items-center py-3 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors',
          isCollapsed ? 'justify-center px-0 mt-2' : 'px-4'
        ]"
        active-class="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-medium"
        @click="$emit('close')">
        <SettingsIcon class="w-5 h-5 flex-shrink-0" :class="!isCollapsed && 'mr-3'" />
        <span v-show="!isCollapsed" class="whitespace-nowrap transition-opacity duration-300">Pengaturan</span>
      </NuxtLink>
    </nav>
  </aside>
</template>

<script setup>
import { LayoutDashboardIcon, FileTextIcon, PenLineIcon, SettingsIcon, UsersIcon, XIcon, PenBox, NotebookPen } from 'lucide-vue-next';

defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  isCollapsed: {
    type: Boolean,
    default: false
  }
});

defineEmits(['close']);
</script>
