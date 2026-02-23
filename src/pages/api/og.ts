import type { APIRoute } from "astro";
import { ImageResponse } from "@vercel/og";
import { createElement as h } from "react";
import { readFileSync } from "node:fs";

export const prerender = false;

// @vercel/nft traces this pattern and bundles the file into the function
const fontData = readFileSync(
	new URL("../../../public/fonts/GeistPixel-Line.otf", import.meta.url),
).buffer as ArrayBuffer;

export const GET: APIRoute = async () => {
	return new ImageResponse(
		h(
			"div",
			{
				style: {
					display: "flex",
					flexDirection: "column",
					width: "100%",
					height: "100%",
					backgroundColor: "#171717",
					padding: "80px",
					justifyContent: "center",
					fontFamily: "GeistPixelLine",
				},
			},
			// Name block
			h(
				"div",
				{
					style: {
						display: "flex",
						flexDirection: "column",
						gap: "8px",
						marginBottom: "24px",
					},
				},
				h(
					"span",
					{
						style: {
							fontSize: 96,
							fontWeight: 500,
							color: "#6b9ef5",
							lineHeight: 1,
						},
					},
					"Gus",
				),
				h(
					"span",
					{
						style: {
							fontSize: 48,
							fontWeight: 500,
							color: "#f5f5f5",
							lineHeight: 1.2,
						},
					},
					"Supratouch Suwatno",
				),
			),
			// Titles block
			h(
				"div",
				{
					style: {
						display: "flex",
						flexDirection: "column",
						gap: "10px",
					},
				},
				h(
					"div",
					{ style: { display: "flex", gap: "12px" } },
					h(
						"span",
						{ style: { fontSize: 28, fontWeight: 500, color: "#f5f5f5" } },
						"Fulltime",
					),
					h(
						"span",
						{
							style: {
								fontSize: 28,
								fontWeight: 500,
								color: "rgba(245,245,245,0.5)",
							},
						},
						"Software Engineer",
					),
				),
				h(
					"div",
					{ style: { display: "flex", gap: "12px" } },
					h(
						"span",
						{ style: { fontSize: 28, fontWeight: 500, color: "#f5f5f5" } },
						"Parttime",
					),
					h(
						"span",
						{
							style: {
								fontSize: 28,
								fontWeight: 500,
								color: "rgba(245,245,245,0.5)",
							},
						},
						"Random stuff coder",
					),
				),
			),
			// Footer
			h(
				"span",
				{
					style: {
						marginTop: "auto",
						fontSize: 22,
						fontWeight: 500,
						color: "rgba(245,245,245,1)",
					},
				},
				"supratouch.dev",
			),
		),
		{
			width: 1200,
			height: 630,
			fonts: [
				{
					name: "GeistPixelLine",
					data: fontData,
					weight: 500,
					style: "normal",
				},
			],
		},
	);
};
