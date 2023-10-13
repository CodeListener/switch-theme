export function setLightDarkClass(isDark: boolean = false, target: HTMLElement = document.documentElement) {
  if (isDark) {
    target.classList.add("dark");
    target.classList.remove("light");
  } else {
    target.classList.add("light");
    target.classList.remove("dark");
  }
}
