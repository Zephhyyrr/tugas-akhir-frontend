<template>
    <div class="space-y-2">
        <label :for="id" class="block text-sm font-medium text-font-color">
            {{ label }}
        </label>
        <div class="relative group">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Icon :icon="icon"
                    class="w-[18px] h-[18px] text-font-color/60 group-focus-within:text-primary transition-colors duration-200" />
            </div>

            <input :id="id" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"
                :type="inputType" :required="required" :autocomplete="autocomplete" :placeholder="placeholder"
                :disabled="disabled"
                class="auth-input w-full pl-10 pr-12 py-3 rounded-xl text-sm text-font-color placeholder-font-color/55 transition-all duration-200 focus:outline-none" />

            <button v-if="isPasswordType" type="button" @click="togglePassword"
                class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-font-color/60 hover:text-font-color transition-colors duration-200"
                tabindex="-1">
                <Icon :icon="showPassword ? 'lucide:eye-off' : 'lucide:eye'" class="w-[18px] h-[18px]" />
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Icon } from '@iconify/vue';

const props = defineProps({
    modelValue: [String, Number],
    id: { type: String, required: true },
    label: { type: String, required: true },
    type: { type: String, default: 'text' },
    icon: { type: String, required: true },
    placeholder: { type: String, default: '' },
    required: { type: Boolean, default: false },
    autocomplete: { type: String, default: 'off' },
    disabled: { type: Boolean, default: false }
});

defineEmits(['update:modelValue']);

const showPassword = ref(false);

const isPasswordType = computed(() => props.type === 'password');

const inputType = computed(() => {
    if (isPasswordType.value) {
        return showPassword.value ? 'text' : 'password';
    }
    return props.type;
});

const togglePassword = () => {
    showPassword.value = !showPassword.value;
};
</script>