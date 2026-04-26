<template>
  <div>
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-8">
      <h1 class="text-2xl font-bold text-gray-800">Dashboard Keuangan</h1>
      <div class="mt-4 md:mt-0 flex items-center gap-3">
        <span class="text-sm text-gray-500 bg-white px-3 py-1.5 rounded-md border border-gray-200 shadow-sm">
          {{ currentDate }}
        </span>
      </div>
    </div>



    <!-- Cash Summary -->
    <div class="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <p class="text-xs font-semibold uppercase tracking-wide text-emerald-700">Total Uang Masuk</p>
        <p class="mt-2 text-2xl font-bold text-emerald-700">{{ formatCurrency(totalIncome) }}</p>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <p class="text-xs font-semibold uppercase tracking-wide text-red-700">Total Uang Keluar</p>
        <p class="mt-2 text-2xl font-bold text-red-700">{{ formatCurrency(totalExpense) }}</p>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <p class="text-xs font-semibold uppercase tracking-wide text-blue-700">Saldo Kas Saat Ini</p>
        <p class="mt-2 text-2xl font-bold text-blue-700">{{ formatCurrency(currentBalance) }}</p>
      </div>
    </div>

    <!-- Actual Cash Chart -->
    <div class="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-800">Tren Uang Masuk dan Uang Keluar</h3>
        <div class="flex items-center gap-2">
          <label class="text-xs text-gray-500">Tahun</label>
          <select v-model.number="selectedChartYear"
            class="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500">
            <option v-for="year in availableChartYears" :key="year" :value="year">{{ year }}</option>
          </select>
        </div>
      </div>
      <div v-if="transactionPending" class="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div class="h-80 bg-gray-100 rounded-xl animate-pulse"></div>
        <div class="h-80 bg-gray-100 rounded-xl animate-pulse"></div>
      </div>
      <div v-else class="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div class="rounded-xl border border-emerald-100 p-3">
          <p class="mb-2 text-sm font-semibold text-emerald-700">Chart Uang Masuk</p>
          <div class="h-72">
            <ClientOnly>
              <Bar :data="incomeChartData" :options="incomeChartOptions" />
              <template #fallback>
                <div class="h-72 bg-gray-100 rounded-xl animate-pulse"></div>
              </template>
            </ClientOnly>
          </div>
        </div>

        <div class="rounded-xl border border-red-100 p-3">
          <p class="mb-2 text-sm font-semibold text-red-700">Chart Uang Keluar</p>
          <div class="h-72">
            <ClientOnly>
              <Bar :data="expenseChartData" :options="expenseChartOptions" />
              <template #fallback>
                <div class="h-72 bg-gray-100 rounded-xl animate-pulse"></div>
              </template>
            </ClientOnly>
          </div>
        </div>
      </div>
    </div>

    <div class="rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-teal-50 p-5 shadow-sm">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="text-xs font-semibold uppercase tracking-wide text-emerald-700">Prediksi Keuangan</p>
          <h3 class="mt-1 text-lg font-bold text-gray-800">Lanjutkan Analisis ke Halaman Prediksi</h3>
          <p class="mt-1 text-sm text-gray-600">Lakukan Prediksi untuk Merencanakan Kegiatan Mendatang.</p>
        </div>

        <NuxtLink
          to="/dashboard/prediksi"
          class="group inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-400/30 transition-all duration-200 hover:-translate-y-0.5 hover:from-emerald-700 hover:to-teal-700 hover:shadow-lg hover:shadow-emerald-500/35"
        >
          Buka Halaman Prediksi
          <span class="ml-2 transition-transform duration-200 group-hover:translate-x-1">-&gt;</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard'
});

import { ref, computed, watch } from 'vue';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'vue-chartjs';
import { useTransaksi } from '~/composables/useTransaksi';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const selectedChartYear = ref(new Date().getFullYear());

const params = ref({ page: 1, limit: 10 });
const { fetchTransactions } = useTransaksi();
const { data: transactionResponse, pending: transactionPending } = fetchTransactions(params);

const extractItems = (resRef) => {
  const root = resRef?.value;
  if (!root) return [];
  if (Array.isArray(root)) return root;
  if (Array.isArray(root.data)) return root.data;
  if (root.data && Array.isArray(root.data.data)) return root.data.data;
  return [];
};

const transactions = computed(() => extractItems(transactionResponse));

const availableChartYears = computed(() => {
  const years = new Set();
  transactions.value.forEach((item) => {
    if (!item.tanggal) return;
    const y = new Date(item.tanggal).getFullYear();
    if (!Number.isNaN(y)) years.add(y);
  });

  if (!years.size) years.add(new Date().getFullYear());
  return Array.from(years).sort((a, b) => b - a);
});

watch(availableChartYears, (years) => {
  if (!years.includes(selectedChartYear.value)) {
    selectedChartYear.value = years[0];
  }
}, { immediate: true });

const totalIncome = computed(() => transactions.value.reduce((sum, item) => sum + Number(item.kredit || 0), 0));
const totalExpense = computed(() => transactions.value.reduce((sum, item) => sum + Number(item.debet || 0), 0));
const currentBalance = computed(() => totalIncome.value - totalExpense.value);

const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(Number(value || 0));
};

const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

const monthlyCash = computed(() => {
  const incomePerMonth = Array(12).fill(0);
  const expensePerMonth = Array(12).fill(0);

  transactions.value.forEach((item) => {
    if (!item.tanggal) return;
    const d = new Date(item.tanggal);
    if (Number.isNaN(d.getTime()) || d.getFullYear() !== selectedChartYear.value) return;
    const monthIndex = d.getMonth();
    incomePerMonth[monthIndex] += Number(item.kredit || 0);
    expensePerMonth[monthIndex] += Number(item.debet || 0);
  });

  return {
    incomePerMonth,
    expensePerMonth
  };
});

const incomeChartData = computed(() => {
  return {
    labels: monthLabels,
    datasets: [
      {
        label: 'Uang Masuk',
        data: monthlyCash.value.incomePerMonth,
        backgroundColor: '#10b981'
      }
    ]
  };
});

const expenseChartData = computed(() => {
  return {
    labels: monthLabels,
    datasets: [
      {
        label: 'Uang Keluar',
        data: monthlyCash.value.expensePerMonth,
        backgroundColor: '#ef4444'
      }
    ]
  };
});

const buildChartOptions = (datasetLabel) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top'
    },
    tooltip: {
      callbacks: {
        label: (ctx) => `${datasetLabel}: ${formatCurrency(ctx.raw)}`
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value) => `Rp ${(Number(value) / 1000).toFixed(0)}k`
      }
    }
  }
});

const incomeChartOptions = buildChartOptions('Uang Masuk');
const expenseChartOptions = buildChartOptions('Uang Keluar');

const currentDate = new Date().toLocaleDateString('id-ID', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

</script>
