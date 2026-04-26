<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Laporan Keuangan</h1>
        <p class="text-sm text-gray-500">Tab mengikuti data keterangan keuangan, lengkap dengan filter dan pencarian.</p>
      </div>
      <BaseButton
        text="Export Excel"
        variant="primary"
        :fullWidth="false"
        icon="lucide:download"
        @click="openExportModal"
        :disabled="!transactions.length"
      />
    </div>

    <div class="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <div class="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-7">
        <div class="xl:col-span-2">
          <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Cari</label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari uraian atau keterangan..."
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          >
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Jenis</label>
          <select
            v-model="transactionType"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">Semua</option>
            <option value="income">Uang Masuk</option>
            <option value="expense">Uang Keluar</option>
          </select>
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Tanggal Mulai</label>
          <input
            v-model="startDate"
            type="date"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          >
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Tanggal Akhir</label>
          <input
            v-model="endDate"
            type="date"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          >
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Bulan</label>
          <select
            v-model="selectedMonth"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">Semua Bulan</option>
            <option v-for="month in monthOptions" :key="month.value" :value="month.value">{{ month.label }}</option>
          </select>
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Tahun</label>
          <select
            v-model="selectedYear"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">Semua Tahun</option>
            <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
          </select>
        </div>
      </div>

      <div class="mt-3 flex justify-end">
        <button
          type="button"
          class="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          @click="resetFilters"
        >
          Reset Filter
        </button>
      </div>
    </div>

    <div class="rounded-xl border border-gray-100 bg-white p-2 shadow-sm">
      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          @click="selectKeteranganTab('all')"
          :class="[
            'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
            activeKeteranganId === 'all' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
        >
          Semua Keterangan
          <span class="ml-2 rounded-full bg-black/10 px-2 py-0.5 text-xs">{{ transactions.length }}</span>
        </button>

        <button
          v-for="tab in keteranganTabs"
          :key="tab.id"
          type="button"
          @click="selectKeteranganTab(tab.id)"
          :class="[
            'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
            activeKeteranganId === tab.id ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
        >
          {{ tab.nama }}
          <span class="ml-2 rounded-full bg-black/10 px-2 py-0.5 text-xs">{{ tab.count }}</span>
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
      <div class="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
        <p class="text-xs font-semibold uppercase tracking-wide text-emerald-700">Total Masuk</p>
        <p class="mt-1 text-xl font-bold text-emerald-700">{{ formatCurrency(summary.totalIncome) }}</p>
      </div>
      <div class="rounded-xl border border-red-200 bg-red-50 p-4">
        <p class="text-xs font-semibold uppercase tracking-wide text-red-700">Total Keluar</p>
        <p class="mt-1 text-xl font-bold text-red-700">{{ formatCurrency(summary.totalExpense) }}</p>
      </div>
      <div class="rounded-xl border border-blue-200 bg-blue-50 p-4">
        <p class="text-xs font-semibold uppercase tracking-wide text-blue-700">Saldo Bersih</p>
        <p class="mt-1 text-xl font-bold text-blue-700">{{ formatCurrency(summary.netBalance) }}</p>
      </div>
    </div>

    <div class="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <div class="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <h2 class="text-lg font-semibold text-gray-800">Data Transaksi</h2>
        <div class="flex items-center gap-3">
          <span class="text-xs text-gray-500">{{ filteredRows.length }} data ditemukan</span>
          <select
            v-model.number="pageSize"
            class="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          >
            <option :value="10">10 / halaman</option>
            <option :value="25">25 / halaman</option>
            <option :value="50">50 / halaman</option>
          </select>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 text-sm">
          <thead class="bg-gray-50 text-xs uppercase tracking-wide text-gray-600">
            <tr>
              <th class="px-6 py-3 text-left">No</th>
              <th class="px-6 py-3 text-left">Tanggal</th>
              <th class="px-6 py-3 text-left">Keterangan</th>
              <th class="px-6 py-3 text-left">Uraian</th>
              <th class="px-6 py-3 text-right">Kredit</th>
              <th class="px-6 py-3 text-right">Debet</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-if="pending" class="hover:bg-gray-50">
              <td colspan="6" class="px-6 py-8 text-center">
                <Icon icon="lucide:loader-circle" class="mx-auto h-8 w-8 animate-spin text-emerald-600" />
              </td>
            </tr>
            <tr v-else-if="filteredRows.length === 0">
              <td colspan="6" class="px-6 py-8 text-center text-sm text-gray-500">Tidak ada data yang cocok dengan filter.</td>
            </tr>
            <tr v-else v-for="(row, index) in paginatedRows" :key="row.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 text-gray-500">{{ (currentPage - 1) * pageSize + index + 1 }}</td>
              <td class="px-6 py-4 text-gray-900">{{ formatDate(row.tanggal) }}</td>
              <td class="px-6 py-4">
                <span
                  :class="[
                    'rounded-md px-2 py-1 text-xs font-medium',
                    Number(row.kredit || 0) > 0 ? 'bg-emerald-100 text-emerald-700' : Number(row.debet || 0) > 0 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                  ]"
                >
                  {{ row.keteranganTransaksi?.nama || '-' }}
                </span>
              </td>
              <td class="px-6 py-4 text-gray-800">{{ row.uraian }}</td>
              <td class="px-6 py-4 text-right font-semibold" :class="Number(row.kredit || 0) > 0 ? 'text-emerald-600' : 'text-gray-400'">
                {{ formatCurrency(row.kredit) }}
              </td>
              <td class="px-6 py-4 text-right font-semibold" :class="Number(row.debet || 0) > 0 ? 'text-red-600' : 'text-gray-400'">
                {{ formatCurrency(row.debet) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <BasePagination
        v-if="filteredRows.length > 0"
        v-model="currentPage"
        :meta="paginationMeta"
      />
    </div>

    <BaseModal
      v-model="showExportModal"
      title="Pilih Format Export"
      icon="lucide:file-spreadsheet"
      type="info"
      confirmText="Export Sekarang"
      @confirm="handleExportConfirm"
    >
      <div class="space-y-4">
        <div>
          <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Mode Export</label>
          <select
            v-model="exportMode"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          >
            <option value="monthly">Per Bulan (1 Sheet)</option>
            <option value="yearly">Per Tahun (12 Sheet)</option>
          </select>
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Tahun</label>
          <select
            v-model="exportYear"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          >
            <option v-for="year in exportYears" :key="year" :value="year">{{ year }}</option>
          </select>
        </div>

        <div v-if="exportMode === 'monthly'">
          <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Bulan</label>
          <select
            v-model="exportMonth"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          >
            <option v-for="month in monthOptions" :key="month.value" :value="month.value">{{ month.label }}</option>
          </select>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { definePageMeta } from '#imports';
import { DownloadIcon } from 'lucide-vue-next';
import { Icon } from '@iconify/vue';
import * as XLSX from 'xlsx';
import { useTransaksi } from '~/composables/useTransaksi';
import type { ITransaksi } from '~/domain/models/ITransaksi';
import type { IPaginationMeta } from '~/domain/types/IApiResponse';

definePageMeta({
  layout: 'dashboard'
});

const params = ref({ page: 1, limit: 10 });
const { fetchTransactions } = useTransaksi();
const { data, pending } = fetchTransactions(params as any);

const searchQuery = ref('');
const transactionType = ref<'all' | 'income' | 'expense'>('all');
const startDate = ref('');
const endDate = ref('');
const selectedMonth = ref<number | 'all'>('all');
const selectedYear = ref<number | 'all'>('all');
const activeKeteranganId = ref<number | 'all'>('all');
const currentPage = ref(1);
const pageSize = ref(10);
const showExportModal = ref(false);
const exportMode = ref<'monthly' | 'yearly'>('monthly');
const exportMonth = ref(1);
const exportYear = ref(new Date().getFullYear());

const monthOptions = [
  { value: 1, label: 'Januari' },
  { value: 2, label: 'Februari' },
  { value: 3, label: 'Maret' },
  { value: 4, label: 'April' },
  { value: 5, label: 'Mei' },
  { value: 6, label: 'Juni' },
  { value: 7, label: 'Juli' },
  { value: 8, label: 'Agustus' },
  { value: 9, label: 'September' },
  { value: 10, label: 'Oktober' },
  { value: 11, label: 'November' },
  { value: 12, label: 'Desember' }
];

const extractItems = (resRef: any): ITransaksi[] => {
  const root = resRef?.value;
  if (!root) return [];
  if (Array.isArray(root)) return root;
  if (Array.isArray(root.data)) return root.data;
  if (root.data && Array.isArray(root.data.data)) return root.data.data;
  return [];
};

const transactions = computed<ITransaksi[]>(() => extractItems(data));

const availableYears = computed(() => {
  const years = new Set<number>();
  transactions.value.forEach((tx) => {
    if (!tx.tanggal) return;
    const year = new Date(tx.tanggal).getFullYear();
    if (!Number.isNaN(year)) {
      years.add(year);
    }
  });
  return [...years].sort((a, b) => b - a);
});

const exportYears = computed(() => {
  if (availableYears.value.length) return availableYears.value;
  return [new Date().getFullYear()];
});

const keteranganTabs = computed(() => {
  const map = new Map<number, { id: number; nama: string; count: number }>();
  transactions.value.forEach((tx) => {
    const id = tx.keteranganTransaksi?.id || tx.keteranganTransaksiId;
    const nama = tx.keteranganTransaksi?.nama || `Keterangan #${id}`;
    if (!id) return;
    if (!map.has(id)) {
      map.set(id, { id, nama, count: 0 });
    }
    map.get(id)!.count += 1;
  });
  return [...map.values()].sort((a, b) => a.nama.localeCompare(b.nama));
});

const filteredRows = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  const from = startDate.value ? new Date(`${startDate.value}T00:00:00`) : null;
  const to = endDate.value ? new Date(`${endDate.value}T23:59:59`) : null;

  return transactions.value.filter((tx) => {
    if (activeKeteranganId.value !== 'all') {
      const txKeteranganId = tx.keteranganTransaksi?.id || tx.keteranganTransaksiId;
      if (txKeteranganId !== activeKeteranganId.value) return false;
    }

    if (transactionType.value === 'income' && Number(tx.kredit || 0) <= 0) return false;
    if (transactionType.value === 'expense' && Number(tx.debet || 0) <= 0) return false;

    const txDate = new Date(tx.tanggal);
    if (selectedMonth.value !== 'all' && txDate.getMonth() + 1 !== Number(selectedMonth.value)) return false;
    if (selectedYear.value !== 'all' && txDate.getFullYear() !== Number(selectedYear.value)) return false;
    if (from && txDate < from) return false;
    if (to && txDate > to) return false;

    if (!q) return true;
    const keteranganName = tx.keteranganTransaksi?.nama?.toLowerCase() || '';
    const uraian = tx.uraian?.toLowerCase() || '';
    return uraian.includes(q) || keteranganName.includes(q);
  });
});

const totalPages = computed(() => {
  if (!filteredRows.value.length) return 1;
  return Math.ceil(filteredRows.value.length / pageSize.value);
});

const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredRows.value.slice(start, end);
});

const paginationMeta = computed<IPaginationMeta>(() => ({
  totalItems: filteredRows.value.length,
  totalPages: totalPages.value,
  currentPage: currentPage.value,
  perPage: pageSize.value,
  hasNextPage: currentPage.value < totalPages.value,
  hasPreviousPage: currentPage.value > 1
}));

const selectKeteranganTab = (id: number | 'all') => {
  activeKeteranganId.value = id;
  currentPage.value = 1;
};

watch([searchQuery, transactionType, startDate, endDate, selectedMonth, selectedYear, activeKeteranganId, pageSize], () => {
  currentPage.value = 1;
});

watch(totalPages, (value) => {
  if (currentPage.value > value) {
    currentPage.value = value;
  }
});

const summary = computed(() => {
  const totalIncome = filteredRows.value.reduce((sum, tx) => sum + Number(tx.kredit || 0), 0);
  const totalExpense = filteredRows.value.reduce((sum, tx) => sum + Number(tx.debet || 0), 0);
  return {
    totalIncome,
    totalExpense,
    netBalance: totalIncome - totalExpense
  };
});

const formatCurrency = (value: number | string | null | undefined) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(Number(value || 0));
};

const formatDate = (value: string) => {
  if (!value) return '-';
  return new Date(value).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

const formatMonthName = (month: number) => {
  return monthOptions.find((m) => m.value === month)?.label || `Bulan-${month}`;
};

const exportBaseRows = computed<ITransaksi[]>(() => {
  const q = searchQuery.value.trim().toLowerCase();
  const from = startDate.value ? new Date(`${startDate.value}T00:00:00`) : null;
  const to = endDate.value ? new Date(`${endDate.value}T23:59:59`) : null;

  return transactions.value.filter((tx) => {
    if (activeKeteranganId.value !== 'all') {
      const txKeteranganId = tx.keteranganTransaksi?.id || tx.keteranganTransaksiId;
      if (txKeteranganId !== activeKeteranganId.value) return false;
    }

    if (transactionType.value === 'income' && Number(tx.kredit || 0) <= 0) return false;
    if (transactionType.value === 'expense' && Number(tx.debet || 0) <= 0) return false;

    const txDate = new Date(tx.tanggal);
    if (from && txDate < from) return false;
    if (to && txDate > to) return false;

    if (!q) return true;
    const keteranganName = tx.keteranganTransaksi?.nama?.toLowerCase() || '';
    const uraian = tx.uraian?.toLowerCase() || '';
    return uraian.includes(q) || keteranganName.includes(q);
  });
});

const sortRows = (rows: ITransaksi[]) => {
  return [...rows].sort((a, b) => {
    const aTime = new Date(a.tanggal).getTime();
    const bTime = new Date(b.tanggal).getTime();
    if (aTime !== bTime) return aTime - bTime;
    return a.id - b.id;
  });
};

const buildSheet = (workbook: XLSX.WorkBook, year: number, month: number, rows: ITransaksi[]) => {
  const sortedRows = sortRows(rows);
  let runningSaldo = 0;

  const detailRows = sortedRows.map((item, index) => {
    runningSaldo += Number(item.kredit || 0) - Number(item.debet || 0);
    return [
      index + 1,
      formatDate(item.tanggal),
      item.uraian || '-',
      item.keteranganTransaksi?.nama || '-',
      Number(item.kredit || 0),
      Number(item.debet || 0),
      runningSaldo
    ];
  });

  const totalIncome = sortedRows.reduce((sum, tx) => sum + Number(tx.kredit || 0), 0);
  const totalExpense = sortedRows.reduce((sum, tx) => sum + Number(tx.debet || 0), 0);
  const finalAmount = totalIncome - totalExpense;

  const sheetData: (string | number)[][] = [
    ['LAPORAN KAS SURAU Zam - Zam'],
    [`Periode: ${formatMonthName(month)} ${year}`],
    [''],
    ['No', 'Tanggal', 'Uraian', 'Keterangan', 'Pemasukan', 'Pengeluaran', 'Saldo']
  ];

  sheetData.push(...detailRows);
  sheetData.push(['']);
  sheetData.push(['', '', '', 'TOTAL BULAN', totalIncome, totalExpense, finalAmount]);

  const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
  worksheet['!merges'] = [
    XLSX.utils.decode_range('A1:G1'),
    XLSX.utils.decode_range('A2:G2')
  ];
  worksheet['!cols'] = [
    { wch: 6 },
    { wch: 14 },
    { wch: 44 },
    { wch: 24 },
    { wch: 16 },
    { wch: 16 },
    { wch: 16 }
  ];

  XLSX.utils.book_append_sheet(workbook, worksheet, formatMonthName(month).slice(0, 3));
};

const openExportModal = () => {
  exportYear.value = exportYears.value[0] ?? new Date().getFullYear();
  if (selectedMonth.value !== 'all') {
    exportMonth.value = Number(selectedMonth.value);
  }
  if (selectedYear.value !== 'all') {
    exportYear.value = Number(selectedYear.value);
  }
  showExportModal.value = true;
};

const handleExportConfirm = () => {
  const workbook = XLSX.utils.book_new();

  if (exportMode.value === 'monthly') {
    const monthRows = exportBaseRows.value.filter((tx) => {
      const txDate = new Date(tx.tanggal);
      return txDate.getFullYear() === exportYear.value && txDate.getMonth() + 1 === exportMonth.value;
    });

    buildSheet(workbook, exportYear.value, exportMonth.value, monthRows);
    XLSX.writeFile(workbook, `Laporan_Kas_${formatMonthName(exportMonth.value)}_${exportYear.value}.xlsx`);
    return;
  }

  for (let month = 1; month <= 12; month += 1) {
    const monthRows = exportBaseRows.value.filter((tx) => {
      const txDate = new Date(tx.tanggal);
      return txDate.getFullYear() === exportYear.value && txDate.getMonth() + 1 === month;
    });
    buildSheet(workbook, exportYear.value, month, monthRows);
  }

  XLSX.writeFile(workbook, `Laporan_Kas_Tahunan_${exportYear.value}.xlsx`);
};

const resetFilters = () => {
  searchQuery.value = '';
  transactionType.value = 'all';
  startDate.value = '';
  endDate.value = '';
  selectedMonth.value = 'all';
  selectedYear.value = 'all';
  activeKeteranganId.value = 'all';
  currentPage.value = 1;
};
</script>
