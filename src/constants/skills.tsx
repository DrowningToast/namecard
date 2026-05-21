import type { LogoDef } from "@/components/ui/logo-carousel";
import { SiReact, SiNestjs, SiNextdotjs, SiSvelte, SiAstro, SiTypescript, SiJavascript, SiHtml5, SiCss, SiExpress, SiMongodb, SiNodedotjs, SiPrisma, SiTrpc, SiSwagger, SiOpenapiinitiative, SiGraphql, SiDotnet, SiPython, SiApachecassandra, SiWagmi, SiVercel, SiNetlify, SiTailwindcss, SiCloudflare } from "@icons-pack/react-simple-icons";
import { SiDjango, SiPostgresql, SiMysql, SiDocker, SiGit, SiLinux, SiBitcoin, SiEthereum, SiGo, SiApachekafka } from "@icons-pack/react-simple-icons";

export const Skills: LogoDef[] = [
	{
		name: "React", element: <SiReact />
	},
	{
		name: "Next.js", element: <SiNextdotjs />,
	},
	{
		name: "Nest.js", element: <SiNestjs />,
	},
	{
		name: "Svelte", element: <SiSvelte />,
	},
	{
		name: "Astro", element: <SiAstro />,
	},
	{
		name: "TypeScript", element: <SiTypescript />,
	},
	{
		name: "Node.js", element: <SiNodedotjs />,
	},
	{
		name: "Express.js", element: <SiExpress />,
	},
	{
		name: "MongoDB", element: <SiMongodb />,
	},
	{
		name: "PrismaORM", element: <SiPrisma />,
	},
	{
		name: "tRPC", element: <SiTrpc />,
	},
	{
		name: "OpenAPI", element: <SiOpenapiinitiative />,
	},
	{
		name: "Swagger", element: <SiSwagger />,
	},
	{
		name: "GraphQL", element: <SiGraphql />,
	},
	{
		name: "C#.NET", element: <SiDotnet />,
	},
	{
		name: "Go", element: <SiGo />,
	},
	{
		name: "Apache Kafka", element: <SiApachekafka />,
	},
	{
		name: "Python", element: <SiPython />,
	},
	{
		name: "Django", element: <SiDjango />,
	},
	{
		name: "PostgreSQL", element: <SiPostgresql />,
	},
	{
		name: "MySQL", element: <SiMysql />,
	},
	// MsSQL
	{
		name: "MsSQL", element: <SiMysql />,
	},
	// Cassandra
	{
		name: "Cassandra", element: <SiApachecassandra />,
	},
	// Docker
	{
		name: "Docker", element: <SiDocker />,
	},
	// Git
	{
		name: "Git", element: <SiGit />,
	},
	// Linux
	{
		name: "Linux", element: <SiLinux />,
	},
	// Bitcoin
	{
		name: "Bitcoin", element: <SiBitcoin />,
	},
	// Ethereum
	{
		name: "Ethereum", element: <SiEthereum />,
	},
	// Web3
	{
		name: "Web3", element: <SiWagmi />,
	},
	// Vercel
	{
		name: "Vercel", element: <SiVercel />,
	},
	// Netlify
	{
		name: "Netlify", element: <SiNetlify />,
	},
	// Cloudflare
	{
		name: "Cloudflare", element: <SiCloudflare />,
	},
	// TailwindCSS
	{
		name: "TailwindCSS", element: <SiTailwindcss />,
	},
]
