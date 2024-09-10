<template>
  <MenuBar />
  <RouterView />
</template>

<script setup>
import { RouterView, useRoute } from 'vue-router'
import MenuBar from './components/MenuBar.vue'
const route = useRoute()
</script>

<style scoped>

</style>
