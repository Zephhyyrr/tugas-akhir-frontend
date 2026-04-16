<template>
    <div>
        <h1 class="text-2xl font-bold text-gray-800 mb-6">Edit Transaksi</h1>

        <div class="max-w-2xl bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <form @submit.prevent="submitForm">
                <!-- Transaction Type Selection (Disabled in Edit Mode usually, or enabled) -->
                <div class="mb-6">
                    <label class="block mb-2 text-sm font-medium text-gray-900">Jenis Transaksi</label>
                    <div class="flex items-center space-x-4">
                        <div class="flex items-center">
                            <input id="income" type="radio" value="income" v-model="transactionType"
                                name="transaction-type"
                                class="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 focus:ring-emerald-500">
                            <label for="income" class="ml-2 text-sm font-medium text-gray-900">Pemasukan
                                (Donasi)</label>
                        </div>
                        <div class="flex items-center">
                            <input id="expense" type="radio" value="expense" v-model="transactionType"
                                name="transaction-type"
                                class="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500">
                            <label for="expense" class="ml-2 text-sm font-medium text-gray-900">Pengeluaran</label>
                        </div>
                    </div>
                </div>

                <div class="mb-6">
                    <label for="date" class="block mb-2 text-sm font-medium text-gray-900">Tanggal</label>
                    <input type="date" id="date" v-model="formData.date"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5"
                        required>
                </div>

                <div class="mb-6">
                    <label for="amount" class="block mb-2 text-sm font-medium text-gray-900">Jumlah (Rp)</label>
                    <input type="number" id="amount" v-model="formData.amount"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5"
                        placeholder="Contoh: 500000" required>
                </div>

                <div class="mb-6">
                    <label for="description" class="block mb-2 text-sm font-medium text-gray-900">
                        Keterangan
                    </label>
                    <textarea id="description" rows="3" v-model="formData.description"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5"
                        placeholder="Deskripsi detail transaksi..." required></textarea>
                </div>

                <div class="flex items-center space-x-4">
                    <button type="submit" :class="[
                        'text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center transition-colors',
                        transactionType === 'income' ? 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-300' : 'bg-red-600 hover:bg-red-700 focus:ring-red-300'
                    ]">
                        Update Transaksi
                    </button>
                    <NuxtLink to="/dashboard/reports"
                        class="text-gray-700 bg-white border border-gray-300 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 hover:bg-gray-50 hover:text-gray-900 focus:z-10">
                        Batal
                    </NuxtLink>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const transactionId = route.params.id;

const transactionType = ref('income');
const formData = ref({
    date: '',
    amount: '',
    description: ''
});

onMounted(() => {
    // Simulate fetching data based on ID
    // In a real app, you'd call an API here
    const isIncome = parseInt(transactionId) < 100; // Simplified logic based on my dummy data IDs

    transactionType.value = isIncome ? 'income' : 'expense';

    // Dummy pre-fill
    formData.value = {
        date: '2025-01-02',
        amount: isIncome ? 200000 : 25000,
        description: isIncome ? 'Infak Drs. Lahmuddin Mutiara IV' : 'Uang Sampah'
    };
});

const submitForm = () => {
    // Simulate update
    alert(`Transaksi berhasil diupdate!\nID: ${transactionId}\nJumlah: Rp ${formData.value.amount}`);
    router.push('/dashboard/reports');
}
</script>
