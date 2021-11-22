<template>
  <div id="app-main"  :class="$route.path==='/model'?'':'h'">
    <div :class="['map1', $store.state.global.mapVisual?'map-visual':'']"></div>
    <div :class="['map2', $store.state.global.mapVisual?'map-visual':'']"></div>
    <div :class="['map3', $store.state.global.mapVisual?'map-visual':'']"></div>
    <keep-alive include="Home,Model">
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'AppMain'
}
</script>

<style scoped>
.h {
  overflow: hidden;
}
</style>
