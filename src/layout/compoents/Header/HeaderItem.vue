<template>
  <div class="header-func-icon" @click="itemClick">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'HeaderItem',
  props: {
    path: {
      type: String,
      default: '/home',
      required: true
    }
  },
  methods: {
    itemClick () {
      if (this.$route.path !== this.path) {
        this.$router.push(this.path)
      }
    }
  }
}
</script>

<style scoped>

</style>
