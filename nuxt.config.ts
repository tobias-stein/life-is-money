// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    ssr: false,
    app: 
    {
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
})
