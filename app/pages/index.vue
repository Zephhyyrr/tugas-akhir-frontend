<template>
  <div>
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-8">
      <h1 class="text-2xl font-bold text-gray-800">Dashboard Peramalan</h1>
      <div class="mt-4 md:mt-0">
        <span class="text-sm text-gray-500 bg-white px-3 py-1.5 rounded-md border border-gray-200 shadow-sm">
          {{ currentDate }}
        </span>
      </div>
    </div>

    <!-- Controls -->
    <div class="mb-8">
      <ForecastingControls @update:duration="handleDurationChange" />
    </div>

    <!-- Summary Cards -->
    <div class="mb-8">
      <SummaryCards :balance="currentBalance" />
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
import { ref } from 'vue';

const selectedDuration = ref('year-1');
const currentBalance = ref(25450000);
const incomeMetrics = ref({ wmape: 4.2, rmse: 125000 });
const expenseMetrics = ref({ wmape: 5.1, rmse: 85000 });

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
