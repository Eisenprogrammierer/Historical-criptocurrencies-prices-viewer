export default {
  modules: ['@nuxtjs/axios'],
  components: true,
  plugins: ['~/plugins/chart']
  css: ['~/assets/css/main.css'],
  axios: {
    baseURL: process.env.API_BASE_URL || 'http://localhost:3000'
  },
  build: {
    transpile: ['vue-chartjs']
  }
}
