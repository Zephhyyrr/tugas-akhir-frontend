import { AuthService } from '~/application/services/AuthService';
import { useAuthStore } from '~/application/stores/useAuthStore';
import type { ILoginPayload } from '~/domain/models/IAuth';

export const useAuth = () => {
    const authStore = useAuthStore();
    const router = useRouter();

    const login = async (payload: ILoginPayload) => {
        const response = await AuthService.login(payload);
        if (response.success && response.data) {
            authStore.setAuth(response.data.user, response.data.token);
            router.push('/dashboard');
        }
        return response;
    };

    const logout = async () => {
        await AuthService.logout();
        authStore.clearAuth();
        router.push('/login');
    };

    return {
        login,
        logout,
        forgotPassword: AuthService.forgotPassword,
        resetPassword: AuthService.resetPassword,
        verifyEmail: AuthService.verifyEmail,
        isAuthenticated: computed(() => authStore.isAuthenticated),
        user: computed(() => authStore.user)
    };
};