<template>
  <BaseModal
    :modelValue="modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
    title="Edit Data Keuangan"
    icon="lucide:pencil"
    type="info"
    confirmText="Simpan Perubahan"
    @confirm="submitForm"
  >
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Tanggal</label>
        <input v-model="form.tanggal" type="date" class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Uraian</label>
        <input v-model="form.uraian" type="text" class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Pilih Sumber Keterangan</label>
        <select v-model="form.id_keterangan_transaksi" class="mt-1 block w-full border border-gray-300 bg-white rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm">
          <option value="">-- Pilih --</option>
          <option v-for="ket in keteranganList" :key="ket.id" :value="ket.id">{{ ket.nama }}</option>
        </select>
      </div>
      <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Nilai Kredit (Masuk)</label>
            <input v-model="form.kredit" type="number" class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Nilai Debet (Keluar)</label>
            <input v-model="form.debet" type="number" class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" />
          </div>
      </div>
    </div>
  </BaseModal>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useTransaksi } from '~/composables/useTransaksi';
import { useKeteranganTransaksi } from '~/composables/useKeteranganTransaksi';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  editData: { type: Object, default: () => ({}) }
});

const emit = defineEmits(['update:modelValue', 'saved']);

const { updateTransaction } = useTransaksi();
const { fetchKeteranganList } = useKeteranganTransaksi();
const params = ref({ page: 1, limit: 10 });
const { data: ketData } = fetchKeteranganList(params);
const keteranganList = computed(() => ketData.value?.data || ketData.value || []);

const form = ref({
    tanggal: '',
    uraian: '',
    id_keterangan_transaksi: '',
    kredit: 0,
    debet: 0
});

watch(() => props.modelValue, (val) => {
    if (val && props.editData.id) {
        form.value = {
            tanggal: props.editData.tanggal ? new Date(props.editData.tanggal).toISOString().split('T')[0] : '',
            uraian: props.editData.uraian || '',
            id_keterangan_transaksi: props.editData.id_keterangan_transaksi || props.editData.keteranganTransaksi?.id || '',
            kredit: props.editData.kredit || 0,
            debet: props.editData.debet || 0
        };
    }
});

const submitForm = async () => {
    try {
        await updateTransaction(props.editData.id, {
            tanggal: new Date(form.value.tanggal).toISOString(),
            uraian: form.value.uraian,
            id_keterangan_transaksi: parseInt(form.value.id_keterangan_transaksi),
            kredit: Number(form.value.kredit),
            debet: Number(form.value.debet)
        });
        emit('update:modelValue', false);
        emit('saved', 'Berhasil', 'Data keuangan berhasil diperbarui');
    } catch(e) {
        console.error('Error updating:', e);
        alert('Gagal mengupdate rutinitas keuangan.');
    }
};
</script>
