import { useRuntimeConfig } from '#app'

export const createHttpClient = () => {
    const config = useRuntimeConfig()

    return $fetch.create({
        baseURL: config.public.apiBaseUrl,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'form-data': 'application/x-www-form-urlencoded'
        }
    })
}