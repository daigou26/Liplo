const pkg = require('./package')
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')

const baseUrl = process.env.BASE_URL || 'https://liplo.jp'

module.exports = {
  mode: 'universal',

  generate: {
    fallback: true,
  },
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: '%s - Liplo',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'author', content: null },
      { hid: 'description', name: 'description', content: 'Liplo は長期インターンを通して、 求人者と求職者をマッチングする 採用プラットフォームです。' },
      { hid: 'og:site_name', property: 'og:site_name', content: 'Liplo' },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      { hid: 'og:url', property: 'og:url', content: baseUrl },
      { hid: 'og:title', property: 'og:title', content: 'Liplo' },
      { hid: 'og:description', property: 'og:description', content: 'Liplo は長期インターンを通して、 求人者と求職者をマッチングする 採用プラットフォームです。' },
      { hid: 'og:image', property: 'og:image', content: baseUrl + '/icon.png' },
      // pwa iOS
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      // twitter
      { hid: 'twitter:card', name: 'twitter:card', content: 'summary' },
      { hid: 'twitter:site', name: 'twitter:site', content: baseUrl },
      { hid: 'twitter:image', name: 'twitter:image', content: baseUrl + '/icon.png' },
      { hid: 'twitter:title', name: 'twitter:title', content: 'Liplo' },
      { hid: 'twitter:description', name: 'twitter:description', content: 'Liplo は長期インターンを通して、 求人者と求職者をマッチングする 採用プラットフォームです。' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'icon', sizes: '16x16', type: 'image/png', href: '/favicon-16x16' },
      { rel: 'icon', sizes: '32x32', type: 'image/png', href: '/favicon-32x32' },
      { rel: 'icon', sizes: '48x48', type: 'image/png', href: '/favicon-48x48' },
      { rel: 'icon', sizes: '96x96', type: 'image/png', href: '/favicon-96x96' },
      // apple touch icon
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'
      }
    ]
  },

  router: {
    middleware: [
      'toolbar',
      'auth'
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: false,
  manifest: {
    lang: 'ja',
    name: 'Liplo',
    short_name: 'Liplo',
    description: 'Liplo は長期インターンを通して、 求人者と求職者をマッチングする 採用プラットフォームです。',
    theme_color: '#ffffff',
  },
  icon: {
    iconFileName: '/icon.png'
  },

  /*
  ** Global CSS
  */
  css: [
    '~/assets/style/app.styl',
    '@fortawesome/fontawesome-free/css/all.css'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/vuetify',
    { src: '~plugins/vue-chartjs.js', ssr: false },
    { src: '~plugins/vue-infinite-loading.js', ssr: false },
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [,
    '@nuxtjs/pwa',
    '@nuxtjs/google-analytics',
  ],

  // googleAnalytics
  // dev
  googleAnalytics: {
    id: 'UA-127466651-3',
    dev: false,
  },
  // prod
  // googleAnalytics: {
  //   id: 'UA-127466651-4',
  //   dev: false,
  // },

  /*
  ** Build configuration
  */
  build: {
    transpile: ['vuetify/lib'],
    plugins: [new VuetifyLoaderPlugin()],
    loaders: {
      stylus: {
        import: ["~assets/style/variables.styl"]
      }
    },

    /*
    ** You can extend webpack config here
    */
    extend (config, { isDev, isClient }) {
      config.node = {
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
      }
    }
  }
}
