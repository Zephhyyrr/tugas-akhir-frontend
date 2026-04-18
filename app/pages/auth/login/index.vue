<template>
  <div>
    <!-- Branding -->
    <div class="text-center mb-8">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 mb-4 backdrop-blur-sm logo-glow">
        <Icon icon="lucide:building-2" class="w-8 h-8 text-primary" />
      </div>
      <h1 class="text-2xl font-bold text-secondary mb-1">Surau Zam-Zam</h1>
      <p class="text-font-color text-sm">Sistem Peramalan Donasi Masjid</p>
    </div>

    <div class="auth-card rounded-2xl p-8">
      <div class="mb-6">
        <h2 class="text-secondary text-xl font-semibold mb-1">Selamat Datang</h2>
        <p class="text-font-color text-sm">Masuk ke akun Anda untuk melanjutkan</p>
      </div>

      <Transition name="shake">
        <div v-if="errorMessage"
          class="mb-5 flex items-start gap-3 p-4 rounded-xl bg-error text-white shadow-lg shadow-error/20">
          <Icon icon="lucide:circle-alert" class="w-5 h-5 text-white shrink-0 mt-0.5" />
          <p class="text-sm font-medium leading-relaxed">{{ errorMessage }}</p>
        </div>
      </Transition>

      <Transition name="fade">
        <div v-if="successMessage"
          class="mb-5 flex items-start gap-3 p-4 rounded-xl bg-success text-white shadow-lg shadow-success/20">
          <Icon icon="lucide:circle-check-big" class="w-5 h-5 text-white shrink-0 mt-0.5" />
          <p class="text-sm font-medium leading-relaxed">{{ successMessage }}</p>
        </div>
      </Transition>

      <form @submit.prevent="handleLogin" class="space-y-5">
        <BaseInput id="login-email" v-model="form.email" type="email" label="Email" icon="lucide:mail"
          placeholder="nama@email.com" autocomplete="email" :required="true" :disabled="isLoading" />

        <BaseInput id="login-password" v-model="form.password" type="password" label="Password" icon="lucide:lock"
          placeholder="Masukkan password" autocomplete="current-password" :required="true" :disabled="isLoading" />

        <div class="flex justify-end">
          <NuxtLink to="/auth/forgot-password"
            class="text-sm text-primary hover:text-secondary transition-colors duration-200 focus:outline-none focus:underline">
            Lupa password?
          </NuxtLink>
        </div>

        <BaseButton type="submit" :isLoading="isLoading" icon="lucide:log-in" text="Masuk" />
      </form>
    </div>

    <BaseModal v-model="showSuccessModal" title="Berhasil Masuk!" icon="lucide:check-circle-2" type="success"
      confirmText="Masuk ke Dashboard" @confirm="handleSuccessConfirm">
      Selamat datang kembali! Autentikasi Anda berhasil. Silakan lanjutkan untuk mengakses dashboard peramalan Anda.
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { definePageMeta, useHead, useRoute, useRouter } from '#imports';
import { useAuth } from '~/composables/useAuth';
import { reactive, ref } from 'vue';

const router = useRouter();
const route = useRoute();

definePageMeta({
  layout: 'auth',
});

useHead({
  title: 'Masuk — Surau Zam-Zam',
  meta: [
    { name: 'description', content: 'Halaman masuk Sistem Peramalan Donasi Masjid Surau Zam-Zam' },
  ],
});

const form = reactive({
  email: '',
  password: '',
});

const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const showSuccessModal = ref(false);

if (route.query.reset === 'success') {
  successMessage.value = 'Password berhasil direset. Silakan masuk dengan password baru Anda.';
}

const { login } = useAuth();

const handleLogin = async () => {
  errorMessage.value = '';
  successMessage.value = '';
  isLoading.value = true;

  try {
    const response = await login({ email: form.email, password: form.password });
    if (!response.success) {
      errorMessage.value = response.message || 'Email atau password salah. Silakan coba lagi.';
    } else {
      showSuccessModal.value = true;
    }
  } catch (err: any) {
    console.error('Login Error Detail:', err);
    errorMessage.value = err?.data?.message || err?.message || 'Terjadi kesalahan. Silakan coba lagi nanti.';
  } finally {
    isLoading.value = false;
  }
};

const handleSuccessConfirm = () => {
  router.push('/dashboard');
};
</script>