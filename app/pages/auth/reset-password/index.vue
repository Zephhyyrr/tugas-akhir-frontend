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

    <!-- Reset Password Card -->
    <div class="auth-card rounded-2xl p-8">
      <div class="mb-6">
        <h2 class="text-secondary text-xl font-semibold mb-1">Pembaruan Password</h2>
        <p class="text-font-color text-sm">Masukkan password baru untuk mengamankan akun Anda.</p>
      </div>

      <!-- Error Alert -->
      <Transition name="shake">
        <div v-if="errorMessage" class="mb-5 flex items-start gap-3 p-4 rounded-xl bg-error text-white shadow-lg shadow-error/20">
          <Icon icon="lucide:circle-alert" class="w-5 h-5 text-white shrink-0 mt-0.5" />
          <p class="text-sm font-medium leading-relaxed">{{ errorMessage }}</p>
        </div>
      </Transition>

      <form @submit.prevent="handleResetPassword" class="space-y-5">
        <!-- Current Email Field (Disabled) -->
        <div v-if="email" class="space-y-2">
          <label for="reset-email" class="block text-sm font-medium text-font-color">
            Alamat Email
          </label>
          <div class="relative group">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Icon icon="lucide:mail" class="w-[18px] h-[18px] text-font-color/40" />
            </div>
            <input
              id="reset-email"
              v-model="email"
              type="email"
              disabled
              class="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-font-color/70 bg-gray-50/80 border border-gray-200 border-dashed cursor-not-allowed focus:outline-none"
            />
          </div>
        </div>

        <!-- New Password Field -->
        <div class="space-y-2">
          <label for="new-password" class="block text-sm font-medium text-font-color">
            Password Baru
          </label>
          <div class="relative group">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Icon icon="lucide:lock" class="w-[18px] h-[18px] text-font-color/60 group-focus-within:text-primary transition-colors duration-200" />
            </div>
            <input
              id="new-password"
              v-model="form.newPassword"
              :type="showPassword ? 'text' : 'password'"
              required
              autocomplete="new-password"
              placeholder="Masukkan password baru"
              :disabled="isLoading || !token"
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

        <!-- Confirm Password Field -->
        <div class="space-y-2">
          <label for="confirm-password" class="block text-sm font-medium text-font-color">
            Konfirmasi Password Validasi
          </label>
          <div class="relative group">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Icon icon="lucide:shield-check" class="w-[18px] h-[18px] text-font-color/60 group-focus-within:text-primary transition-colors duration-200" />
            </div>
            <input
              id="confirm-password"
              v-model="form.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              required
              autocomplete="new-password"
              placeholder="Ulangi password baru Anda"
              :disabled="isLoading || !token"
              class="auth-input w-full pl-10 pr-12 py-3 rounded-xl text-sm text-font-color placeholder-font-color/55 transition-all duration-200 focus:outline-none"
            />
            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-font-color/60 hover:text-font-color transition-colors duration-200"
              tabindex="-1"
            >
              <Icon v-if="!showConfirmPassword" icon="lucide:eye" class="w-[18px] h-[18px]" />
              <Icon v-else icon="lucide:eye-off" class="w-[18px] h-[18px]" />
            </button>
          </div>
        </div>

        <!-- Submit Button -->
        <button
          id="reset-submit"
          type="submit"
          :disabled="isLoading || !token"
          class="auth-btn w-full py-3 px-4 rounded-xl text-sm font-semibold text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          <span v-if="isLoading" class="flex items-center justify-center gap-2">
            <Icon icon="lucide:loader-circle" class="w-4 h-4 animate-spin" />
            Menyimpan...
          </span>
          <span v-else class="flex items-center justify-center gap-2">
            <Icon icon="lucide:key-round" class="w-4 h-4" />
            Ubah & Masuk
          </span>
        </button>
      </form>
    </div>

    <!-- Success Reset Modal -->
    <BaseModal
      v-model="showSuccessModal"
      title="Aman!"
      icon="lucide:shield-check"
      type="success"
      confirmText="Lanjut Log In"
      @confirm="handleSuccessConfirm"
    >
      Password Anda <strong>sukses</strong> diperbarui! Anda dapat langsung login menggunakan password baru ini. Jaga baik-baik informasi login Anda.
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { definePageMeta, useHead, useRoute, useRouter } from '#imports';
import { useAuth } from '~/composables/useAuth';
import { reactive, ref, onMounted } from 'vue';

const router = useRouter();
const route = useRoute();

definePageMeta({
  layout: 'auth',
});

useHead({
  title: 'Reset Password — Surau Zam-Zam',
  meta: [
    { name: 'description', content: 'Halaman atur ulang password Sistem Peramalan Donasi Masjid Surau Zam-Zam' },
  ],
});

const form = reactive({
  newPassword: '',
  confirmPassword: '',
});

const showPassword = ref(false);
const showConfirmPassword = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');
const showSuccessModal = ref(false);

const token = ref('');
const email = ref('');

onMounted(() => {
    // Menangkap query "token" dari URL ketika user membuka email
    if (route.query.token) {
        token.value = route.query.token as string;

        // Coba ekstrak informasi email dari Payload JWT Token
        try {
            const base64Url = token.value.split('.')[1];
            if (base64Url) {
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
                
                const payload = JSON.parse(jsonPayload);
                if (payload && payload.email) {
                    email.value = payload.email;
                }
            }
        } catch (e) {
            console.error('Tidak dapat mengurai informasi email dari token:', e);
        }

    } else {
        errorMessage.value = 'Halaman ini tidak dapat digunakan. Token reset password tidak ditemukan pada URL (link kadaluwarsa atau terpotong).';
    }
});

const handleResetPassword = async () => {
  errorMessage.value = '';

  if (!token.value) {
      errorMessage.value = 'Silakan klik tautan resmi dari email yang anda dapatkan.';
      return;
  }

  // Verifikasi 2x bahwa input sama sebelum merepotkan server
  if (form.newPassword !== form.confirmPassword) {
      errorMessage.value = 'Password Baru dan Konfirmasi Password tidak sama! Mohon cek tanda baca dan huruf kapitalnya.';
      return;
  }

  if (form.newPassword.length < 5) {
      errorMessage.value = 'Mohon masukkan sandi minimal 5 karakter untuk keamanan.';
      return;
  }

  isLoading.value = true;

  try {
    const { resetPassword } = useAuth();
    // Mengirim token asli yang dicomot dari URL dan password yang baru saja divalidasi ke backend
    const response = await resetPassword({ 
        token: token.value, 
        newPassword: form.newPassword 
    });
    
    // Asumsi balasan API meresapkan kode HTTP error jika JSON bermasalah
    // Maka eksekusi lanjut tanpa pesan error akan membuka modal sukses
    showSuccessModal.value = true;

  } catch (err: any) {
    console.error('Reset Password Error Detail:', err);
    errorMessage.value = err?.data?.message || err?.message || 'Gagal tersambung ke server untuk memperbarui password Anda.';
  } finally {
    isLoading.value = false;
  }
};

const handleSuccessConfirm = () => {
    router.push('/auth/login?reset=success');
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
  0%, 100% { box-shadow: 0 0 30px -5px rgba(16, 185, 129, 0.3); }
  50% { box-shadow: 0 0 40px -5px rgba(16, 185, 129, 0.5); }
}

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
