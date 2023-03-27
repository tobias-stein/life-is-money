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
			meta: [
				{ hid: 'og-type', property: 'og:type', content: 'website' },
				{ hid: 'og-title', property: 'og:title', content: 'Life is Money' },
				{ hid: 'og-desc', property: 'og:description', content: 'Have you ever wondered how much money you need to live you life?' },
				{ hid: 'og-url', property: 'og:url', content: 'https://tobias-stein.github.io/life-is-money/' },
				
				{ hid: 't-type', name: 'twitter:card', content: 'summary_large_image' },
			]
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
