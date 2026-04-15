<template>
  <div>
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-8">
      <h1 class="text-2xl font-bold text-gray-800">Laporan Keuangan</h1>
      <div class="mt-4 md:mt-0">
        <button @click="exportToExcel"
          class="flex items-center text-white bg-emerald-600 hover:bg-emerald-700 font-medium rounded-lg text-sm px-5 py-2.5 transition-colors">
          <DownloadIcon class="w-4 h-4 mr-2" />
          Export Excel
        </button>
      </div>
    </div>

    <!-- Tab Controls -->
    <div class="mb-6 border-b border-gray-200">
      <ul class="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500">
        <li class="mr-2">
          <button @click="activeTab = 'income'"
            :class="['inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg group transition-colors', activeTab === 'income' ? 'text-emerald-600 border-emerald-600 active' : 'border-transparent hover:text-gray-600 hover:border-gray-300']">
            <ArrowDownLeftIcon class="w-4 h-4 mr-2" />
            Uang Masuk (Pemasukan)
          </button>
        </li>
        <li class="mr-2">
          <button @click="activeTab = 'expense'"
            :class="['inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg group transition-colors', activeTab === 'expense' ? 'text-red-600 border-red-600 active' : 'border-transparent hover:text-gray-600 hover:border-gray-300']">
            <ArrowUpRightIcon class="w-4 h-4 mr-2" />
            Uang Keluar (Pengeluaran)
          </button>
        </li>
      </ul>
    </div>

    <!-- Table Container -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 class="text-lg font-semibold text-gray-800">
          {{ activeTab === 'income' ? 'Data Pemasukan' : 'Data Pengeluaran' }}
        </h2>
        <span class="text-xs text-gray-500">Periode: Januari 2025</span>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left text-gray-500">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 w-16">No</th>
              <th scope="col" class="px-6 py-3">Tanggal</th>
              <th scope="col" class="px-6 py-3">Uraian / Sumber</th>
              <th scope="col" class="px-6 py-3">Jumlah</th>
              <th scope="col" class="px-6 py-3">Keterangan</th>
              <th scope="col" class="px-6 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="currentData.length === 0" class="bg-white border-b">
              <td colspan="6" class="px-6 py-4 text-center text-gray-400">Belum ada data transaksi.</td>
            </tr>
            <tr v-for="(item, index) in currentData" :key="index" class="bg-white border-b hover:bg-gray-50">
              <td class="px-6 py-4">{{ index + 1 }}</td>
              <td class="px-6 py-4 font-medium text-gray-900">{{ formatDate(item.date) }}</td>
              <td class="px-6 py-4">{{ item.category }}</td>
              <td :class="['px-6 py-4 font-semibold', activeTab === 'income' ? 'text-emerald-600' : 'text-red-600']">
                {{ formatCurrency(item.amount) }}
              </td>
              <td class="px-6 py-4 text-gray-600">{{ item.description }}</td>
              <td class="px-6 py-4">
                <div class="flex items-center space-x-2">
                  <button @click="handleEdit(item)"
                    class="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded" title="Edit">
                    <PencilIcon class="w-4 h-4" />
                  </button>
                  <button @click="handleDelete(item)"
                    class="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded" title="Delete">
                    <TrashIcon class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { DownloadIcon, ArrowDownLeftIcon, ArrowUpRightIcon, PencilIcon, TrashIcon } from 'lucide-vue-next';
import * as XLSX from 'xlsx';

const router = useRouter();
const activeTab = ref('income');

// Dummy Data
const incomeData = ref([
  { id: 1, date: '2025-01-02', category: 'Infak Drs. Lahmuddin Mutiara IV', amount: 200000, description: 'Uang Masuk' },
  { id: 2, date: '2025-01-02', category: 'Infak Jum,at Subuh', amount: 97000, description: 'Uang Masuk' },
  { id: 3, date: '2025-01-02', category: 'Infak bu kos dan Alm Bachazaril', amount: 400000, description: 'Uang Masuk' },
  { id: 4, date: '2025-01-02', category: 'Infak Muhammad hasnul', amount: 100000, description: 'Uang Masuk' },
  { id: 5, date: '2025-01-02', category: 'Hamba Allah Jl. Mutiara II', amount: 100000, description: 'Uang Masuk' },
  { id: 6, date: '2025-01-02', category: 'Infak Anggi novandra', amount: 400000, description: 'Uang Masuk' },
  { id: 7, date: '2025-01-07', category: 'Infak Wirid', amount: 83000, description: 'Uang Masuk' },
]);

const expenseData = ref([
  { id: 101, date: '2025-01-01', category: 'Uang Sampah', amount: 25000, description: 'Uang Keluar' },
  { id: 102, date: '2025-01-01', category: 'Beli Alat Pembersih Kaca', amount: 30000, description: 'Uang Keluar' },
  { id: 103, date: '2025-01-02', category: 'Imam Baca Ayat Sajadah', amount: 25000, description: 'Uang Keluar' },
  { id: 104, date: '2025-01-07', category: 'Honor Ustadz', amount: 150000, description: 'Uang Keluar' },
  { id: 105, date: '2025-01-07', category: 'Air Mineral 1 Dus', amount: 18000, description: 'Uang Keluar' },
]);

const currentData = computed(() => {
  return activeTab.value === 'income' ? incomeData.value : expenseData.value;
});

const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value);
};

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
}

const handleEdit = (item) => {
  router.push(`/edit/${item.id}`);
}

const handleDelete = (item) => {
  if (confirm(`Apakah anda yakin ingin menghapus data: ${item.category}?`)) {
    alert('Data dihapus (Simulasi)');
  }
}

const exportToExcel = () => {
  // Determine which data to export
  const dataToExport = currentData.value.map((item, index) => ({
    'No': index + 1,
    'Tanggal': formatDate(item.date),
    'Uraian': item.category,
    'Jumlah': item.amount,
    'Keterangan': item.description
  }));

  const worksheet = XLSX.utils.json_to_sheet(dataToExport);
  const workbook = XLSX.utils.book_new();

  // Name sheet based on tab
  const sheetName = activeTab.value === 'income' ? 'Laporan_Pemasukan' : 'Laporan_Pengeluaran';

  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Filename
  const fileName = `${sheetName}_SurauZamZam.xlsx`;
  XLSX.writeFile(workbook, fileName);
};
</script>
