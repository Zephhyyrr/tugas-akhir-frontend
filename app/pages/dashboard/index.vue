<template>
  <div>
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-8">
      <h1 class="text-2xl font-bold text-gray-800">Dashboard Keuangan dan Peramalan</h1>
      <div class="mt-4 md:mt-0">
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
        <h3 class="text-lg font-semibold text-gray-800">Chart Uang Masuk dan Uang Keluar</h3>
        <div class="flex items-center gap-2">
          <label class="text-xs text-gray-500">Tahun</label>
          <select v-model.number="selectedChartYear"
            class="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500">
            <option v-for="year in availableChartYears" :key="year" :value="year">{{ year }}</option>
          </select>
        </div>
      </div>
      <div v-if="transactionPending" class="h-80 bg-gray-100 rounded-xl animate-pulse"></div>
      <div v-else class="h-80">
        <ClientOnly>
          <Bar :data="cashChartData" :options="cashChartOptions" />
          <template #fallback>
            <div class="h-80 bg-gray-100 rounded-xl animate-pulse"></div>
          </template>
        </ClientOnly>
      </div>
    </div>

    <!-- Controls -->
    <div class="mb-8">
      <ForecastingControls @update:duration="handleDurationChange" />
    </div>

    <!-- Charts Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <!-- Income Chart -->
      <div>
        <ClientOnly>
          <MainChart title="Peramalan Pemasukan" :duration="selectedDuration" type="income" :wmape="incomeMetrics.wmape"
            :rmse="incomeMetrics.rmse" />
          <template #fallback>
            <div class="h-96 bg-gray-100 rounded-xl animate-pulse"></div>
          </template>
        </ClientOnly>
      </div>

      <!-- Expense Chart -->
      <div>
        <ClientOnly>
          <MainChart title="Peramalan Pengeluaran" :duration="selectedDuration" type="expense"
            :wmape="expenseMetrics.wmape" :rmse="expenseMetrics.rmse" />
          <template #fallback>
            <div class="h-96 bg-gray-100 rounded-xl animate-pulse"></div>
          </template>
        </ClientOnly>
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
import ForecastingControls from '~/components/features/ForecastingControls.vue';
import MainChart from '~/components/features/MainChart.vue';
import { useTransaksi } from '~/composables/useTransaksi';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const selectedDuration = ref('year-1');
const incomeMetrics = ref({ wmape: 4.2, rmse: 125000 });
const expenseMetrics = ref({ wmape: 5.1, rmse: 85000 });
const selectedChartYear = ref(new Date().getFullYear());

const params = ref({ page: 1, limit: 1000 });
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

const cashChartData = computed(() => {
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
    labels: monthLabels,
    datasets: [
      {
        label: 'Uang Masuk',
        data: incomePerMonth,
        backgroundColor: '#10b981'
      },
      {
        label: 'Uang Keluar',
        data: expensePerMonth,
        backgroundColor: '#ef4444'
      }
    ]
  };
});

const cashChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top'
    },
    tooltip: {
      callbacks: {
        label: (ctx) => `${ctx.dataset.label}: ${formatCurrency(ctx.raw)}`
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
};

const currentDate = new Date().toLocaleDateString('id-ID', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

const handleDurationChange = (duration) => {
  selectedDuration.value = duration;
  updateMetrics(duration);
};

const updateMetrics = (duration) => {
  // Simulate metric changes based on duration
  let multiplier = 1;
  if (duration.startsWith('month-')) {
    multiplier = 0.8;
  } else if (duration === 'year-2') {
    multiplier = 1.2;
  } else if (duration === 'year-3') {
    multiplier = 1.5;
  }

  incomeMetrics.value = {
    wmape: parseFloat((4.2 * multiplier).toFixed(1)),
    rmse: Math.round(125000 * multiplier)
  };

  expenseMetrics.value = {
    wmape: parseFloat((5.1 * multiplier).toFixed(1)),
    rmse: Math.round(85000 * multiplier)
  };
}

</script>
