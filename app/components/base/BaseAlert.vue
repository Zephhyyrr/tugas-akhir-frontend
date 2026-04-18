<template>
    <Transition :name="transitionName">
        <div v-if="message" :class="[
            'mb-5 flex items-start gap-3 p-4 rounded-xl text-white shadow-lg',
            type === 'error' ? 'bg-error shadow-error/20' : 'bg-success shadow-success/20'
        ]">
            <Icon :icon="iconName" class="w-5 h-5 text-white shrink-0 mt-0.5" />
            <p class="text-sm font-medium leading-relaxed">{{ message }}</p>
        </div>
    </Transition>
</template>

<script setup>
import { computed } from 'vue';
import { Icon } from '@iconify/vue';

const props = defineProps({
    message: { type: String, default: '' },
    type: { type: String, default: 'error' }
});

const iconName = computed(() => {
    return props.type === 'error' ? 'lucide:circle-alert' : 'lucide:circle-check-big';
});

const transitionName = computed(() => {
    return props.type === 'error' ? 'shake' : 'fade';
});
</script>