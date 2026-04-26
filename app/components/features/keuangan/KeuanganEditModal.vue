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
        <select v-model.number="form.keteranganTransaksiId" class="mt-1 block w-full border border-gray-300 bg-white rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm">
          <option :value="0">-- Pilih --</option>
          <option v-for="ket in keteranganList" :key="ket.id" :value="ket.id">{{ ket.nama }}</option>
        </select>
      </div>
      <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Nilai Kredit (Masuk)</label>
            <input :value="form.kredit" @input="handleCurrencyInput('kredit', $event)" type="text" inputmode="numeric" class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" placeholder="Rp. 0" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Nilai Debet (Keluar)</label>
            <input :value="form.debet" @input="handleCurrencyInput('debet', $event)" type="text" inputmode="numeric" class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" placeholder="Rp. 0" />
          </div>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useTransaksi } from '~/composables/useTransaksi';
import { useKeteranganTransaksi } from '~/composables/useKeteranganTransaksi';
import type { IKeteranganTransaksi } from '~/domain/models/IKeteranganTransaksi';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  editData: { type: Object, default: () => ({}) }
});

const emit = defineEmits(['update:modelValue', 'saved']);

const { updateTransaction } = useTransaksi();
const { fetchKeteranganList } = useKeteranganTransaksi();
const params = ref({ page: 1, limit: 10 });
const { data: ketData } = fetchKeteranganList(params);
const keteranganList = computed<IKeteranganTransaksi[]>(() => {
  let list = ketData.value;
  if (list && (list as any).data !== undefined && !Array.isArray(list)) list = (list as any).data;
  if (list && (list as any).data !== undefined && !Array.isArray(list)) list = (list as any).data;
  return Array.isArray(list) ? list : [];
});

const form = ref({
    tanggal: '',
    uraian: '',
  keteranganTransaksiId: 0,
  kredit: '',
  debet: ''
});

const formatRupiah = (value: string) => {
  const digitsOnly = value.replace(/\D/g, '');
  if (!digitsOnly) return '';
  return `Rp. ${Number(digitsOnly).toLocaleString('id-ID')}`;
};

const parseRupiah = (value: string) => {
  const digitsOnly = value.replace(/\D/g, '');
  return digitsOnly ? Number(digitsOnly) : NaN;
};

const handleCurrencyInput = (field: 'kredit' | 'debet', event: Event) => {
  const target = event.target as HTMLInputElement;
  const formatted = formatRupiah(target.value);
  form.value[field] = formatted;
  target.value = formatted;
};

watch(() => props.modelValue, (val) => {
    if (val && props.editData.id) {
        form.value = {
          tanggal: props.editData.tanggal ? (new Date(props.editData.tanggal).toISOString().split('T')[0] ?? '') : '',
            uraian: props.editData.uraian || '',
          keteranganTransaksiId: props.editData.keteranganTransaksiId || props.editData.id_keterangan_transaksi || props.editData.keteranganTransaksi?.id || 0,
          kredit: props.editData.kredit ? formatRupiah(String(props.editData.kredit)) : '',
          debet: props.editData.debet ? formatRupiah(String(props.editData.debet)) : ''
        };
    }
});

const submitForm = async () => {
    try {
        const parsedKredit = parseRupiah(form.value.kredit);
        const parsedDebet = parseRupiah(form.value.debet);
        const kredit = Number.isNaN(parsedKredit) ? 0 : parsedKredit;
        const debet = Number.isNaN(parsedDebet) ? 0 : parsedDebet;

        if (kredit < 0 || debet < 0) {
          throw new Error('Nilai kredit/debet tidak valid.');
        }

        if (kredit <= 0 && debet <= 0) {
          throw new Error('Isi salah satu: kredit atau debet.');
        }

        if (kredit > 0 && debet > 0) {
          throw new Error('Pilih salah satu saja: kredit atau debet.');
        }

        await updateTransaction(props.editData.id, {
            tanggal: new Date(form.value.tanggal).toISOString(),
            uraian: form.value.uraian,
          keteranganTransaksiId: Number(form.value.keteranganTransaksiId),
          kredit,
          debet
        });
        emit('update:modelValue', false);
        emit('saved', 'Berhasil', 'Data keuangan berhasil diperbarui');
    } catch(e) {
        console.error('Error updating:', e);
        alert('Gagal mengupdate rutinitas keuangan.');
    }
};
</script>
