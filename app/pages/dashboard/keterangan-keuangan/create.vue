<template>
  <div class="max-w-2xl mx-auto">
    <div class="mb-6 flex items-center gap-4">
      <NuxtLink to="/dashboard/keterangan-keuangan" class="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
        <Icon icon="lucide:arrow-left" class="w-5 h-5 text-gray-600" />
      </NuxtLink>
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Tambah Sumber Keterangan</h1>
        <p class="text-gray-600">Isi formulir untuk mencatat tipe sumber baru</p>
      </div>
    </div>

    <BaseAlert v-if="errorMessage" :message="errorMessage" type="error" class="mb-6" />

    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <form @submit.prevent="submitForm">
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">Nama Sumber Keterangan</label>
            <input v-model="form.nama" type="text" required :disabled="isSubmitting" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm disabled:opacity-50" placeholder="Contoh: Infak Jumat, Listrik, Air" />
          </div>
        </div>

        <div class="mt-8 flex justify-end items-center gap-3">
          <NuxtLink to="/dashboard/keterangan-keuangan" class="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 font-medium transition-colors outline-none focus:ring-2 focus:ring-emerald-500/50">
            Batal
          </NuxtLink>
          
          <BaseButton 
            type="submit" 
            :isLoading="isSubmitting" 
            text="Simpan Keterangan" 
            icon="lucide:save"
            :fullWidth="false" 
          />
        </div>
      </form>
    </div>

    <BaseModal
      v-model="showSuccessModal"
      title="Berhasil"
      icon="lucide:badge-check"
      type="success"
      confirmText="Kembali ke daftar keterangan"
      @confirm="handleSuccessConfirm"
    >
      <p class="text-sm text-gray-700">Keterangan keuangan baru berhasil dibuat.</p>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { definePageMeta, useRouter } from '#imports';
import { Icon } from '@iconify/vue';
import { useKeteranganTransaksi } from '~/composables/useKeteranganTransaksi';

definePageMeta({ layout: 'dashboard' as any });

const router = useRouter();
const { createKeterangan } = useKeteranganTransaksi();

const form = ref({ nama: '' });

const isSubmitting = ref(false);
const errorMessage = ref('');
const showSuccessModal = ref(false);

const handleSuccessConfirm = () => {
  showSuccessModal.value = false;
  router.push('/dashboard/keterangan-keuangan');
};

const submitForm = async () => {
    isSubmitting.value = true;
    errorMessage.value = '';

    try {
        await createKeterangan({ nama: form.value.nama } as any);
        showSuccessModal.value = true;
    } catch(error: any) {
        console.error('Error creating:', error);
        errorMessage.value = error?.data?.message || error?.message || 'Gagal membuat keterangan baru.';
    } finally {
        isSubmitting.value = false;
    }
};
</script>
