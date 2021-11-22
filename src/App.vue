<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<style lang="less">
#app {
  height: 100%;
  width: 100%;
}

@media screen and (max-width: 1024PX) {
  html {
    font-size: 42PX !important;
  }
}
@media screen and (min-width: 1920PX) {
  html {
    font-size: 80PX !important;
  }
}
</style>
