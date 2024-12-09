import { boot } from 'quasar/wrappers'
import axios from 'axios'

// Cria a instância do Axios com a URL base da API
const api = axios.create({ baseURL: 'https://livraria-api.altislabtech.com.br' })

// Adiciona o token no cabeçalho Authorization em cada requisição
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token') // Assumindo que o token está salvo no LocalStorage
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

export default boot(({ app }) => {
  // Permite o uso de this.$axios e this.$api nos arquivos Vue (Options API)
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }