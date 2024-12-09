import { boot } from 'quasar/wrappers'
import PasswordInput from 'src/components/PasswordInput.vue'

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ( { app }) => {
  app.component('PasswordInput', PasswordInput)
})
