<template>
  <div class="max-w-2xl mx-auto">
    <div class="mb-6 flex items-center gap-4">
      <NuxtLink to="/dashboard/keuangan" class="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
        <Icon icon="lucide:arrow-left" class="w-5 h-5 text-gray-600" />
      </NuxtLink>
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Tambah Data Keuangan</h1>
        <p class="text-gray-600">Isi formulir untuk mencatat data keuangan baru</p>
      </div>
    </div>

    <BaseAlert v-if="errorMessage" :message="errorMessage" type="error" class="mb-6" />

    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <form @submit.prevent="submitForm">
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">Tanggal</label>
            <input v-model="form.tanggal" type="date" required :disabled="isSubmitting" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm disabled:opacity-50" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Uraian</label>
            <input v-model="form.uraian" type="text" required :disabled="isSubmitting" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm disabled:opacity-50" placeholder="Contoh: Pembelian alat tulis" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Pilih Sumber Keterangan</label>
            <select v-model="form.id_keterangan_transaksi" required :disabled="isSubmitting" class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm disabled:opacity-50">
              <option value="">-- Pilih --</option>
              <option v-for="ket in keteranganList" :key="ket.id" :value="ket.id">{{ ket.nama }}</option>
            </select>
          </div>
          <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Nilai Kredit (Masuk)</label>
                <input v-model="form.kredit" type="number" required min="0" :disabled="isSubmitting" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm disabled:opacity-50" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Nilai Debet (Keluar)</label>
                <input v-model="form.debet" type="number" required min="0" :disabled="isSubmitting" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm disabled:opacity-50" />
              </div>
          </div>
        </div>

        <div class="mt-8 flex justify-end items-center gap-3">
          <NuxtLink to="/dashboard/keuangan" class="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 font-medium transition-colors outline-none focus:ring-2 focus:ring-emerald-500/50">
            Batal
          </NuxtLink>
          
          <BaseButton 
            type="submit" 
            :isLoading="isSubmitting" 
            text="Simpan Data" 
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
      confirmText="Kembali ke daftar keuangan"
      @confirm="handleSuccessConfirm"
    >
      <p class="text-sm text-gray-700">Data keuangan baru berhasil dicatat.</p>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { definePageMeta, useRouter } from '#imports';
import { Icon } from '@iconify/vue';
import { useTransaksi } from '~/composables/useTransaksi';
import { useKeteranganTransaksi } from '~/composables/useKeteranganTransaksi';

definePageMeta({ layout: 'dashboard' as any });

const router = useRouter();
const { createTransaction } = useTransaksi();
const { fetchKeteranganList } = useKeteranganTransaksi();
const params = ref({ page: 1, limit: 1000 });
const { data: ketData, refresh } = fetchKeteranganList(params);
onMounted(() => { refresh(); });

const keteranganList = computed(() => {
    let list = ketData.value;
    if (list && (list as any).data !== undefined && !Array.isArray(list)) list = (list as any).data;
    if (list && (list as any).data !== undefined && !Array.isArray(list)) list = (list as any).data;
    return Array.isArray(list) ? list : [];
});

const form = ref({
    tanggal: new Date().toISOString().split('T')[0],
    uraian: '',
    id_keterangan_transaksi: '',
    kredit: 0,
    debet: 0
});

const isSubmitting = ref(false);
const errorMessage = ref('');
const showSuccessModal = ref(false);

const handleSuccessConfirm = () => {
  showSuccessModal.value = false;
  router.push('/dashboard/keuangan');
};

const submitForm = async () => {
    isSubmitting.value = true;
    errorMessage.value = '';

    try {
        await createTransaction({
            tanggal: new Date(form.value.tanggal).toISOString(),
            uraian: form.value.uraian,
            id_keterangan_transaksi: parseInt(form.value.id_keterangan_transaksi),
            kredit: Number(form.value.kredit),
            debet: Number(form.value.debet),
            isActive: true,
            isDeleted: false
        } as any);
        showSuccessModal.value = true;
    } catch(error: any) {
        console.error('Error creating:', error);
        errorMessage.value = error?.data?.message || error?.message || 'Gagal menyimpan catatan keuangan.';
    } finally {
        isSubmitting.value = false;
    }
};
</script>
