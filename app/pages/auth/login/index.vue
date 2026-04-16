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

    <!-- Login Card -->
    <div class="auth-card rounded-2xl p-8">
      <div class="mb-6">
        <h2 class="text-secondary text-xl font-semibold mb-1">Selamat Datang</h2>
        <p class="text-font-color text-sm">Masuk ke akun Anda untuk melanjutkan</p>
      </div>

      <!-- Error Alert -->
      <Transition name="shake">
        <div v-if="errorMessage" class="mb-5 flex items-start gap-3 p-4 rounded-xl bg-error text-white shadow-lg shadow-error/20">
          <Icon icon="lucide:circle-alert" class="w-5 h-5 text-white shrink-0 mt-0.5" />
          <p class="text-sm font-medium leading-relaxed">{{ errorMessage }}</p>
        </div>
      </Transition>

      <!-- Success Alert -->
      <Transition name="fade">
        <div v-if="successMessage" class="mb-5 flex items-start gap-3 p-4 rounded-xl bg-success text-white shadow-lg shadow-success/20">
          <Icon icon="lucide:circle-check-big" class="w-5 h-5 text-white shrink-0 mt-0.5" />
          <p class="text-sm font-medium leading-relaxed">{{ successMessage }}</p>
        </div>
      </Transition>

      <form @submit.prevent="handleLogin" class="space-y-5">
        <!-- Email Field -->
        <div class="space-y-2">
          <label for="login-email" class="block text-sm font-medium text-font-color">
            Email
          </label>
          <div class="relative group">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Icon icon="lucide:mail" class="w-[18px] h-[18px] text-font-color/60 group-focus-within:text-primary transition-colors duration-200" />
            </div>
            <input
              id="login-email"
              v-model="form.email"
              type="email"
              required
              autocomplete="email"
              placeholder="nama@email.com"
              :disabled="isLoading"
              class="auth-input w-full pl-10 pr-4 py-3 rounded-xl text-sm text-font-color placeholder-font-color/55 transition-all duration-200 focus:outline-none"
            />
          </div>
        </div>

        <!-- Password Field -->
        <div class="space-y-2">
          <label for="login-password" class="block text-sm font-medium text-font-color">
            Password
          </label>
          <div class="relative group">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Icon icon="lucide:lock" class="w-[18px] h-[18px] text-font-color/60 group-focus-within:text-primary transition-colors duration-200" />
            </div>
            <input
              id="login-password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              required
              autocomplete="current-password"
              placeholder="Masukkan password"
              :disabled="isLoading"
              class="auth-input w-full pl-10 pr-12 py-3 rounded-xl text-sm text-font-color placeholder-font-color/55 transition-all duration-200 focus:outline-none"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-font-color/60 hover:text-font-color transition-colors duration-200"
              tabindex="-1"
            >
              <Icon v-if="!showPassword" icon="lucide:eye" class="w-[18px] h-[18px]" />
              <Icon v-else icon="lucide:eye-off" class="w-[18px] h-[18px]" />
            </button>
          </div>
        </div>

        <!-- Forgot Password Link -->
        <div class="flex justify-end">
          <NuxtLink
            to="/auth/forgot-password"
            class="text-sm text-primary hover:text-secondary transition-colors duration-200 focus:outline-none focus:underline"
          >
            Lupa password?
          </NuxtLink>
        </div>

        <!-- Submit Button -->
        <button
          id="login-submit"
          type="submit"
          :disabled="isLoading"
          class="auth-btn w-full py-3 px-4 rounded-xl text-sm font-semibold text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="isLoading" class="flex items-center justify-center gap-2">
            <Icon icon="lucide:loader-circle" class="w-4 h-4 animate-spin" />
            Memproses...
          </span>
          <span v-else class="flex items-center justify-center gap-2">
            <Icon icon="lucide:log-in" class="w-4 h-4" />
            Masuk
          </span>
        </button>
      </form>
    </div>

    <!-- Login Success Modal -->
    <BaseModal
      v-model="showSuccessModal"
      title="Berhasil Masuk!"
      icon="lucide:check-circle-2"
      type="success"
      confirmText="Masuk ke Dashboard"
      @confirm="handleSuccessConfirm"
    >
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

const showPassword = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const showSuccessModal = ref(false);

// Check for query params (e.g., from forgot-password redirect)
const route = useRoute();
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

<style scoped>
.auth-card {
  background: #ffffff;
  border: 1px solid rgba(16, 185, 129, 0.18);
  backdrop-filter: blur(24px);
  box-shadow:
    0 0 0 1px rgba(16, 185, 129, 0.08),
    0 16px 40px -18px rgba(22, 22, 22, 0.25);
}

.auth-input {
  background: rgba(16, 185, 129, 0.04);
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.auth-input:focus {
  background: #ffffff;
  border-color: rgba(16, 185, 129, 0.6);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.14);
}

.auth-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.auth-btn {
  background: linear-gradient(135deg, #10b981 0%, #064e3b 100%);
  box-shadow: 0 4px 15px -3px rgba(16, 185, 129, 0.4), 0 0 0 1px rgba(16, 185, 129, 0.2);
}

.auth-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #10b981 0%, #0b5f47 100%);
  box-shadow: 0 8px 25px -5px rgba(16, 185, 129, 0.45), 0 0 0 1px rgba(16, 185, 129, 0.3);
  transform: translateY(-1px);
}

.auth-btn:active:not(:disabled) {
  transform: translateY(0);
}

.logo-glow {
  box-shadow: 0 0 30px -5px rgba(16, 185, 129, 0.3);
  animation: pulse-glow 3s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 30px -5px rgba(16, 185, 129, 0.3);
  }
  50% {
    box-shadow: 0 0 40px -5px rgba(16, 185, 129, 0.5);
  }
}

/* Transitions */
.shake-enter-active {
  animation: shake 0.5s ease-out;
}
.shake-leave-active {
  transition: opacity 0.3s ease;
}
.shake-leave-to {
  opacity: 0;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 50%, 90% { transform: translateX(-4px); }
  30%, 70% { transform: translateX(4px); }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>