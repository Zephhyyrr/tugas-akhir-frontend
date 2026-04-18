export const endpoints = {
    AUTH: {
        LOGIN: 'auth/login',
        LOGOUT: 'auth/logout',
        FORGOT_PASSWORD: 'auth/forgot-password',
        RESET_PASSWORD: 'auth/reset-password',
        VERIFY_EMAIL: 'auth/verify-email',
    },

    USER: {
        GET_ALL: 'users/',
        GET_BY_ID: (id: number) => `users/${id}`,
        CREATE: 'users/',
        UPDATE: (id: number) => `users/${id}`,
        DELETE: (id: number) => `users/${id}`,
        FOTO_PROFIL: (id: number) => `users/${id}/photo`,
        ACTIVE: (id: number) => `users/${id}/activate`,
    },

    CONTENT: {
        GET_ALL: 'contents/',
        GET_BY_ID: (id: number) => `contents/${id}`,
        CREATE: 'contents/',
        UPDATE: (id: number) => `contents/${id}`,
        DELETE: (id: number) => `contents/${id}`,
        PUBLISHED: (id: number) => `contents/${id}/published`,
    },

    KETERANGAN_TRANSAKSI: {
        GET_ALL: 'keterangan-transaksi/',
        GET_BY_ID: (id: number) => `keterangan-transaksi/${id}`,
        CREATE: 'keterangan-transaksi/',
        UPDATE: (id: number) => `keterangan-transaksi/${id}`,
        DELETE: (id: number) => `keterangan-transaksi/${id}`,
    },

    TRANSAKSI: {
        GET_ALL: 'transaksi/',
        GET_BY_ID: (id: number) => `transaksi/${id}`,
        CREATE: 'transaksi/',
        UPDATE: (id: number) => `transaksi/${id}`,
        DELETE: (id: number) => `transaksi/${id}`,
    }
} as const;