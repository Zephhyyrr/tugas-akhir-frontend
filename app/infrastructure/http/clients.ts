import { useRuntimeConfig, useCookie } from '#app'

export const createHttpClient = () => {
    const config = useRuntimeConfig()
    const cookie = useCookie('token')

    return $fetch.create({
        baseURL: config.public.apiBaseUrl,
        onRequest({ options }) {
            const token = cookie.value
            if (token) {
                const headers = new Headers(options.headers)
                headers.set('Authorization', `Bearer ${token}`)
                options.headers = headers
            }
        },
        onResponseError({ response }) {
            if (response?.status === 401) {
                const authToken = useCookie('token')
                authToken.value = null
                window.location.href = '/auth/login'
            }
        }
    })
}