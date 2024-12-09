<template>
  <q-input v-model="value" :type=" isPsw ? 'password' : 'text'" label="Senha" borderlass class="Pass" :rules="rules">
    <!--<template v-slot:prepend>
      <slot name="icon"></slot>
    </template>-->
    <template v-slot:append>
          <q-icon :name="isPsw ? 'visibility' : 'visibility_off'" @click="isPsw = !isPsw">

          </q-icon>
        </template>
  </q-input>
</template>

<script>
import { computed, ref } from 'vue';
export default {
  name: 'PasswordInput',
  props: {
    modelValue:{
      type: String,
      Required: true
    },
      rules: Array
  },
  setup (props, {emit}) {
    const value = computed({
      get: () => props.modelValue,
      set: value => emit('update:modelValue', value)
    })

    const isPsw = ref(true)
    return {
      value,
      isPsw
    }
  }
}
</script>

<style>
  .Pass{
    padding-right: 10px;
  }
</style>
