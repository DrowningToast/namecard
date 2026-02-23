import type { Config } from "tailwindcss";
import { geistPixelLine } from "./src/lib/fonts";

export default {
	theme: {
		extend: {
			fontFamily: {
				sans: [geistPixelLine.family, "monospace"],
			},
		},
	},
} satisfies Config;
