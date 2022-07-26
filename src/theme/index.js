export function changeTheme(theme) {
    document.documentElement.setAttribute('theme', theme);
}
window.onload = () => {
    changeTheme('light');
    // if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    //   changeTheme('dark');
    // } else {
    //   changeTheme('light');
    // }
};
