<template>
    <button :type="type" :disabled="disabled || isLoading" :class="[
        'rounded-xl text-sm font-semibold text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-[1px] active:translate-y-0',
        fullWidth ? 'w-full py-3 mt-2' : 'py-2 px-4',
        variantClasses
    ]">
        <span v-if="isLoading" class="flex items-center justify-center gap-2">
            <Icon icon="lucide:loader-circle" class="w-4 h-4 animate-spin" />
            {{ loadingText }}
        </span>
        <span v-else class="flex items-center justify-center gap-2">
            <Icon v-if="typeof icon === 'string' && icon" :icon="icon" class="w-4 h-4" />
            <component v-else-if="icon" :is="icon" class="w-4 h-4" />
            <slot>{{ text }}</slot>
        </span>
    </button>
</template>

<script setup>
import { computed } from 'vue';
import { Icon } from '@iconify/vue';

const props = defineProps({
    type: { type: String, default: 'button' },
    variant: { type: String, default: 'primary' },
    fullWidth: { type: Boolean, default: true },
    disabled: { type: Boolean, default: false },
    isLoading: { type: Boolean, default: false },
    loadingText: { type: String, default: 'Memproses...' },
    icon: { type: [String, Object, Function], default: '' },
    text: { type: String, default: 'Submit' }
});

const variantClasses = computed(() => {
    switch (props.variant) {
        case 'danger':
            return 'bg-gradient-to-br from-error to-[#d32f2f] shadow-[0_4px_15px_-3px_rgba(255,86,86,0.4)] hover:to-[#b71c1c] focus:ring-error/50';
        case 'warning':
            return 'bg-gradient-to-br from-warning to-[#d49900] shadow-[0_4px_15px_-3px_rgba(255,184,0,0.4)] hover:to-[#b38000] focus:ring-warning/50';
        case 'success':
            return 'bg-gradient-to-br from-primary to-secondary shadow-[0_4px_15px_-3px_rgba(16,185,129,0.4),0_0_0_1px_rgba(16,185,129,0.2)] hover:to-[#0b5f47] hover:shadow-[0_8px_25px_-5px_rgba(16,185,129,0.45),0_0_0_1px_rgba(16,185,129,0.3)] focus:ring-primary/50';
        default:
            return 'bg-gradient-to-br from-primary to-secondary shadow-[0_4px_15px_-3px_rgba(16,185,129,0.4),0_0_0_1px_rgba(16,185,129,0.2)] hover:to-[#0b5f47] hover:shadow-[0_8px_25px_-5px_rgba(16,185,129,0.45),0_0_0_1px_rgba(16,185,129,0.3)] focus:ring-primary/50';
    }
});
</script>