import { atom } from "nanostores";

const getInitialTheme = (): "light" | "dark" => {
	if (typeof window === "undefined") {
		return "dark";
	}
	return (localStorage.getItem("theme") as "light" | "dark") ?? "dark";
};

export const themeStore = atom<"light" | "dark">(getInitialTheme());

export const setTheme = (theme: "light" | "dark") => {
	themeStore.set(theme);
	localStorage.setItem("theme", theme);
	document.documentElement.classList.toggle("dark", theme === "dark");
};
