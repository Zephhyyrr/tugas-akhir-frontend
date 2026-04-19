import { defineStore } from 'pinia';
import type { IUser } from '~/domain/models/IUser';

export const useAuthStore = defineStore('auth', () => {
    const user = ref<IUser | null>(null);
    const token = useCookie('token');

    const isAuthenticated = computed(() => !!token.value);

    function setAuth(newUser: IUser, newToken: string) {
        user.value = newUser;
        token.value = newToken;
    }

    function setUser(newUser: IUser) {
        user.value = newUser;
    }

    function clearAuth() {
        user.value = null;
        token.value = null;
    }

    return { user, isAuthenticated, setAuth, setUser, clearAuth };
});