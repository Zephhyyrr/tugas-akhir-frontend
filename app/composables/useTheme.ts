export const useTheme = () => {
    const isDark = useState('theme-dark', () => false);

    const initTheme = () => {
        if (import.meta.client) {
            // Strictly enforce light mode default
            // Ignore system preferences (matchMedia)
            // Only respect explicit user choice if it exists in localStorage
            const storedTheme = localStorage.getItem('theme');

            if (storedTheme === 'dark') {
                isDark.value = true;
            } else {
                // Default to light for everyone else
                isDark.value = false;
                // Optional: Ensure localStorage is explicit or just leave it null
                if (storedTheme !== 'light') {
                    localStorage.setItem('theme', 'light');
                }
            }
            updateDom();
        }
    };

    const toggleTheme = () => {
        isDark.value = !isDark.value;
        updateDom();
        if (import.meta.client) {
            localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
        }
    };

    const updateDom = () => {
        if (import.meta.client) {
            if (isDark.value) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
    };

    return {
        isDark,
        initTheme,
        toggleTheme
    };
};
