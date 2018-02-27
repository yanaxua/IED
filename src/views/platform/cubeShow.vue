<template>
  <div id="cubeShow">
    <cube :gap="15" :long="50" :data="cubeData"></cube>
  </div>
</template>
  
<script>
import cube from '@base/cube'
export default {
  components: {
    cube
  },
  data() {
    return {
      cubeData:[]
    }
  },
  props: {},
  methods: {
  },
  created() {
    this.$axios.get('/static/cube.json').then((response) => {/*获取cube数据*/
      this.cubeData = response.data;
    })
  },
  mounted() {

  },
  watch: {}
}
</script>
  
<!-- Add 'scoped' attribute to limit CSS to this component only  -->
<style>
#cubeShow {
  width: 100%;
  height: 100%;
}
</style>