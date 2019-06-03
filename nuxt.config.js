const pkg = require('./package')


const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')

module.exports = {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
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
        ]
    },
  /*
  ** Customize the progress-bar color
  */
  loading: false,

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
  googleAnalytics: {
    id: 'UA-127466651-3',
    dev: false,
  },

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
