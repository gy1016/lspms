<template>
  <div class="app-wrapper">
    <Header></Header>
    <app-main></app-main>
  </div>
</template>

<script>
import Header from './compoents/Header/index'
import AppMain from './compoents/AppMain/index'

export default {
  name: 'Layout',
  components: {
    Header,
    AppMain
  }
}
</script>

<style scoped>
.app-wrapper {
  width: 100%;
}
</style>
