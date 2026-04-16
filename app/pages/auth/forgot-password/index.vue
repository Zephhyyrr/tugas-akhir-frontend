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

    <!-- Forgot Password Card -->
    <div class="auth-card rounded-2xl p-8">
      <!-- Default State: Form -->
      <template v-if="!isSubmitted">
        <div class="mb-6">
          <h2 class="text-secondary text-xl font-semibold mb-1">Lupa Password</h2>
          <p class="text-font-color text-sm leading-relaxed">
            Masukkan alamat email yang terdaftar. Kami akan mengirimkan tautan untuk mengatur ulang password Anda.
          </p>
        </div>

        <!-- Error Alert -->
        <Transition name="shake">
          <div v-if="errorMessage" class="mb-5 flex items-start gap-3 p-4 rounded-xl bg-error text-white shadow-lg shadow-error/20">
            <Icon icon="lucide:circle-alert" class="w-5 h-5 text-white shrink-0 mt-0.5" />
            <p class="text-sm font-medium leading-relaxed">{{ errorMessage }}</p>
          </div>
        </Transition>

        <form @submit.prevent="handleForgotPassword" class="space-y-5">
          <!-- Email Field -->
          <div class="space-y-2">
            <label for="forgot-email" class="block text-sm font-medium text-font-color">
              Alamat Email
            </label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Icon icon="lucide:mail" class="w-[18px] h-[18px] text-font-color/60 group-focus-within:text-primary transition-colors duration-200" />
              </div>
              <input
                id="forgot-email"
                v-model="email"
                type="email"
                required
                autocomplete="email"
                placeholder="nama@email.com"
                :disabled="isLoading"
                class="auth-input w-full pl-10 pr-4 py-3 rounded-xl text-sm text-font-color placeholder-font-color/55 transition-all duration-200 focus:outline-none"
              />
            </div>
          </div>

          <!-- Submit Button -->
          <button
            id="forgot-submit"
            type="submit"
            :disabled="isLoading"
            class="auth-btn w-full py-3 px-4 rounded-xl text-sm font-semibold text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading" class="flex items-center justify-center gap-2">
              <Icon icon="lucide:loader-circle" class="w-4 h-4 animate-spin" />
              Mengirim...
            </span>
            <span v-else class="flex items-center justify-center gap-2">
              <Icon icon="lucide:send" class="w-4 h-4" />
              Kirim Tautan Reset
            </span>
          </button>
        </form>

        <!-- Back to Login -->
        <div class="mt-6 text-center">
          <NuxtLink
            to="/auth/login"
            class="inline-flex items-center gap-1.5 text-sm text-primary hover:text-secondary transition-colors duration-200"
          >
            <Icon icon="lucide:arrow-left" class="w-4 h-4" />
            Kembali ke halaman masuk
          </NuxtLink>
        </div>
      </template>

      <!-- Success State -->
      <template v-else>
        <div class="text-center py-4">
          <!-- Animated Checkmark -->
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 mb-5 success-ring">
            <Icon icon="lucide:circle-check-big" class="w-8 h-8 text-emerald-400 success-icon" />
          </div>

          <h2 class="text-secondary text-xl font-semibold mb-2">Email Terkirim!</h2>
          <p class="text-font-color text-sm leading-relaxed mb-2">
            Kami telah mengirimkan tautan reset password ke:
          </p>
          <p class="text-success font-medium text-sm mb-6 break-all">
            {{ email }}
          </p>
          <p class="text-font-color/70 text-xs leading-relaxed mb-6">
            Periksa folder inbox dan spam email Anda. Tautan akan kedaluwarsa dalam 60 menit.
          </p>

          <!-- Actions -->
          <div class="space-y-3">
            <button
              @click="handleResend"
              :disabled="resendCooldown > 0"
              class="w-full py-3 px-4 rounded-xl text-sm font-medium text-primary border border-primary/30 hover:bg-primary/10 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span v-if="resendCooldown > 0">
                Kirim ulang dalam {{ resendCooldown }} detik
              </span>
              <span v-else class="flex items-center justify-center gap-2">
                <Icon icon="lucide:refresh-cw" class="w-4 h-4" />
                Kirim Ulang Email
              </span>
            </button>

            <NuxtLink
              to="/auth/login"
              class="block w-full py-3 px-4 rounded-xl text-sm font-medium text-font-color hover:text-secondary hover:bg-font-color/5 transition-all duration-200 text-center"
            >
              <span class="inline-flex items-center gap-1.5">
                <Icon icon="lucide:arrow-left" class="w-4 h-4" />
                Kembali ke halaman masuk
              </span>
            </NuxtLink>
          </div>
        </div>
      </template>
    </div>

    <!-- Confirm Forgot Password Modal -->
    <BaseModal
      v-model="showConfirmModal"
      title="Konfirmasi Email"
      icon="lucide:mail-question"
      type="success"
      confirmText="Ya, Kirim Tautan"
      @confirm="executeForgotPassword"
    >
      Apakah Anda yakin email <strong>{{ email }}</strong> sudah benar? Kami akan mengirimkan tautan reset password ke alamat ini.
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { definePageMeta, useHead } from '#imports';
import { useAuth } from '~/composables/useAuth';
import { onUnmounted, ref } from 'vue';

definePageMeta({
  layout: 'auth',
});

useHead({
  title: 'Lupa Password — Surau Zam-Zam',
  meta: [
    { name: 'description', content: 'Reset password akun Sistem Peramalan Donasi Masjid Surau Zam-Zam' },
  ],
});

const email = ref('');
const isLoading = ref(false);
const isSubmitted = ref(false);
const errorMessage = ref('');
const resendCooldown = ref(0);
const showConfirmModal = ref(false);

let cooldownInterval: ReturnType<typeof setInterval> | null = null;

const startCooldown = () => {
  resendCooldown.value = 60;
  if (cooldownInterval) clearInterval(cooldownInterval);
  cooldownInterval = setInterval(() => {
    resendCooldown.value--;
    if (resendCooldown.value <= 0) {
      clearInterval(cooldownInterval!);
      cooldownInterval = null;
    }
  }, 1000);
};

const { forgotPassword } = useAuth();

const handleForgotPassword = () => {
  if (email.value) {
      showConfirmModal.value = true;
  }
};

const executeForgotPassword = async () => {
  errorMessage.value = '';
  isLoading.value = true;

  try {
    const response = await forgotPassword({ email: email.value });
    if (response.success) {
      isSubmitted.value = true;
      startCooldown();
    } else {
      errorMessage.value = response.message || 'Gagal mengirim email reset. Silakan coba lagi.';
    }
  } catch (err: any) {
    console.error('Forgot Password Error Detail:', err);
    errorMessage.value = err?.data?.message || err?.message || 'Terjadi kesalahan. Silakan coba lagi nanti.';
  } finally {
    isLoading.value = false;
  }
};

const handleResend = async () => {
  if (resendCooldown.value > 0) return;

  isLoading.value = true;
  try {
    await forgotPassword({ email: email.value });
    startCooldown();
  } catch {
    // Silently handle resend errors
  } finally {
    isLoading.value = false;
  }
};

onUnmounted(() => {
  if (cooldownInterval) clearInterval(cooldownInterval);
});
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

.success-ring {
  animation: ring-pulse 2s ease-in-out infinite;
}

@keyframes ring-pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.2);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(16, 185, 129, 0);
  }
}

.success-icon {
  animation: scale-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes scale-in {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
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
</style>
