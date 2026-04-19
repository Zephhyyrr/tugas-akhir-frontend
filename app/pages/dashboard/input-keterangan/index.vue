<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from '#imports';

const router = useRouter();

onMounted(() => {
  router.replace('/dashboard/keterangan-keuangan');
});
</script>

<template>
  <div class="px-6 py-4 text-sm text-gray-500">Mengalihkan ke halaman keterangan keuangan...</div>
</template>
