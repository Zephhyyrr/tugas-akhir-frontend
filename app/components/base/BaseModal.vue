<template>
    <Teleport to="body">
        <Transition name="fade">
            <div v-if="modelValue"
                class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">

                <div class="absolute inset-0" @click="close"></div>

                <Transition name="zoom" appear>
                    <div v-if="modelValue"
                        class="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden" role="dialog">

                        <div class="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                            <div class="flex items-center gap-3">
                                <div v-if="icon" :class="iconContainerClass">
                                    <Icon :icon="icon" class="w-5 h-5" />
                                </div>
                                <h3 class="text-lg font-semibold text-secondary">{{ title }}</h3>
                            </div>
                            <button @click="close"
                                class="text-font-color/50 hover:text-font-color hover:bg-gray-100 p-2 rounded-full transition-colors">
                                <Icon icon="lucide:x" class="w-5 h-5" />
                            </button>
                        </div>

                        <div class="px-6 py-6 text-font-color text-sm leading-relaxed">
                            <slot></slot>
                        </div>

                        <div class="px-6 py-4 bg-gray-50 flex items-center justify-end gap-3 rounded-b-2xl">
                            <slot name="footer">
                                <button @click="close"
                                    class="px-4 py-2 text-sm font-medium text-font-color hover:bg-gray-200 bg-gray-100 rounded-xl transition-colors outline-none">
                                    Batal
                                </button>
                                <button @click="confirm" :class="confirmButtonClass">
                                    {{ confirmText }}
                                </button>
                            </slot>
                        </div>

                    </div>
                </Transition>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { computed } from 'vue';
import { Icon } from '@iconify/vue';

const props = defineProps({
    modelValue: { type: Boolean, required: true },
    title: { type: String, default: 'Informasi' },
    icon: { type: String, default: '' },
    confirmText: { type: String, default: 'Lanjutkan' },
    type: { type: String, default: 'info' }
});

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel']);

const close = () => {
    emit('update:modelValue', false);
    emit('cancel');
};

const confirm = () => {
    emit('confirm');
    emit('update:modelValue', false); // Tutup otomatis jika tombol confirm ditekan
};

// Menyesuaikan warna icon sesuai tipe dan Tailwind config kustom
const iconContainerClass = computed(() => {
    switch (props.type) {
        case 'success': return 'w-10 h-10 rounded-full flex items-center justify-center bg-success/10 text-success';
        case 'danger': return 'w-10 h-10 rounded-full flex items-center justify-center bg-error/10 text-error';
        case 'warning': return 'w-10 h-10 rounded-full flex items-center justify-center bg-warning/10 text-warning';
        default: return 'w-10 h-10 rounded-full flex items-center justify-center bg-primary/10 text-primary';
    }
});

// Menyesuaikan warna tombol sesuai tipe dan Tailwind config kustom
const confirmButtonClass = computed(() => {
    const base = 'px-4 py-2 text-sm font-semibold text-white rounded-xl transition-all duration-200 outline-none';
    switch (props.type) {
        case 'success': return `${base} bg-success hover:bg-success/80`;
        case 'danger': return `${base} bg-error hover:bg-error/80`;
        case 'warning': return `${base} bg-warning hover:bg-warning/80`;
        default: return `${base} bg-primary hover:bg-secondary`;
    }
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.zoom-enter-active,
.zoom-leave-active {
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.zoom-enter-from,
.zoom-leave-to {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
}
</style>