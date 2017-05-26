<template>
  <div id="app" class="container has-text-centered">
    <img src="https://image.ibb.co/drQGJF/eugene.png" alt="" style="height: 40px; padding-bottom:1em;">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
}
</script>

<style>

div.container {
  padding: 8px;
}

</style>
