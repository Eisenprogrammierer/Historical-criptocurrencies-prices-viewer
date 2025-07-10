export default function({ $axios, error }) {
  $axios.onRequest(config => {
    console.log('Making request to:', config.url)
  })

  $axios.onError(err => {
    const code = err.response?.status || 500
    error({ statusCode: code, message: 'API request failed' })
    return Promise.reject(err)
  })
}
