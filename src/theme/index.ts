export function changeTheme(theme: 'dark' | 'light') {
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
