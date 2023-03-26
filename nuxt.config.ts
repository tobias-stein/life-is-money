// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

	target: 'static',
	ssr: false,

	app: 
	{
		baseURL: '/life-is-money/',
		buildAssetsDir: 'nuxt',
		rootId: 'nuxt',
		head: {
			title: "Life is Money",
		},
	},
	css: [
		'vuetify/lib/styles/main.sass',
		'@mdi/font/css/materialdesignicons.min.css',
	],
	build: {
		transpile: ["vuetify"],
	},
	modules: [
		'@pinia/nuxt',
	],
	vuetify: {
		icons: {
			iconfont: 'mdiSvg',
		}
	}
});
