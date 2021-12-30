<template>
  <div id="app">
    <DrawingBoard />
  </div>
</template>

<script>
// import DrawingBoard from './packages/index.vue'
import DrawingBoard from '../lib/vue-drawing-board.umd.min'

export default {
  components: { DrawingBoard }
}
</script>

<style lang="css">
*{
  margin: 0;
  padding: 0;
  /* overflow: hidden; */
}
</style>

