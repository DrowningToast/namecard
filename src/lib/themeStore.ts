import { atom } from "nanostores";

const getInitialTheme = (): "light" | "dark" => {
	//@ts-ignore
	if (localStorage.getItem === undefined) {
		return "dark";
	}
	return (localStorage.getItem("theme") as "light" | "dark") ?? "dark";
};

export const themeStore = atom<"light" | "dark">(getInitialTheme());

export const setTheme = (theme: "light" | "dark") => {
	themeStore.set(theme);
	localStorage.setItem("theme", theme);
	const bodyElement = document.body;
	bodyElement.classList.toggle("dark", theme === "dark");
};
