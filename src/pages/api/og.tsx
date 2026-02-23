import type { APIRoute } from "astro";
import { ImageResponse } from "@vercel/og";

export const prerender = false;

export const GET: APIRoute = async () => {
	return new ImageResponse(
		(
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					width: "100%",
					height: "100%",
					backgroundColor: "#171717",
					padding: "80px",
					justifyContent: "center",
					gap: "0px",
				}}
			>
				{/* Name */}
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						gap: "8px",
						marginBottom: "24px",
					}}
				>
					<span
						style={{
							fontSize: 96,
							fontWeight: 700,
							color: "#6b9ef5",
							lineHeight: 1,
						}}
					>
						Gus
					</span>
					<span
						style={{
							fontSize: 48,
							fontWeight: 500,
							color: "#f5f5f5",
							lineHeight: 1.2,
						}}
					>
						Supratouch Suwatno
					</span>
				</div>

				{/* Titles */}
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						gap: "10px",
					}}
				>
					<div style={{ display: "flex", gap: "12px", alignItems: "baseline" }}>
						<span
							style={{ fontSize: 28, color: "#f5f5f5", fontWeight: 600 }}
						>
							Fulltime
						</span>
						<span style={{ fontSize: 28, color: "rgba(245,245,245,0.5)" }}>
							Software Engineer
						</span>
					</div>
					<div style={{ display: "flex", gap: "12px", alignItems: "baseline" }}>
						<span
							style={{ fontSize: 28, color: "#f5f5f5", fontWeight: 600 }}
						>
							Parttime
						</span>
						<span style={{ fontSize: 28, color: "rgba(245,245,245,0.5)" }}>
							Random stuff coder
						</span>
					</div>
				</div>

				{/* Footer */}
				<span
					style={{
						marginTop: "auto",
						fontSize: 22,
						color: "rgba(245,245,245,0.25)",
					}}
				>
					supratouch.dev
				</span>
			</div>
		),
		{
			width: 1200,
			height: 630,
		}
	);
};
