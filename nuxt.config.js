const webpack = require("webpack");
require("dotenv").config();

export default {
  server: {
    host: process.env.APP_URL,
    port: process.env.PORT
  },
  mode: "spa",
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: "Nuxt PDF",
    title: "Nuxt PDF",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || ""
      }
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      {
        href:
          "https://cdn.materialdesignicons.com/5.3.45/css/materialdesignicons.min.css",
        rel: "stylesheet"
      }
    ],
    script: [{ src: "//mozilla.github.io/pdf.js/build/pdf.js" }]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#C62828" },
  /*
   ** Global CSS
   */
  css: ["@/assets/main.css"],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    "@/plugins/axios.js",
    "@/plugins/globalMixin.js",
    "@/plugins/mobile-device-detect.js",
    "@/plugins/vue-signature.js",
    "@/plugins/vue-draggable-resizable.js"
  ],
  /*
   ** Nuxt.js dev-modules
   */
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    "@nuxtjs/axios",
    "@nuxtjs/pwa",
    // Doc: https://github.com/nuxt-community/dotenv-module
    "@nuxtjs/dotenv",
    "@nuxtjs/toast",
    "@nuxtjs/proxy",
    "nuxt-buefy"
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    baseURL: process.env.API_BASE_URL,
    https: false,
    progress: true,
    retry: {
      retries: 5
    },
    credentials: true
  },
  toast: {
    position: "top-center",
    duration: 2000
  },
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */

  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    plugins: [
      new webpack.ProvidePlugin({
        moment: "moment"
      })
    ],
    extend(config, ctx) {}
  },
  render: {
    dist: {
      maxAge: 0
    },
    static: {
      etag: false
    }
  }
};
