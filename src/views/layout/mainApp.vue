<template>
  <div id="mainApp_div_echarts">
    <transition>
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </transition>
  </div>
</template>
  
<script>
export default { 
  components: {
  },
  data() {
    return {
    }
  },
  props: {
  },
  computed:{
  },
  methods: {
  },
  created() {
  },
  mounted() {
    /**创建富文本编辑区域*/
    // var edit = new wedit("#mainApp_div_echarts");
    // edit.create();
  },
  watch: {}
}
</script>
  
<!-- Add 'scoped' attribute to limit CSS to this component only  -->
<style>
/*主*/
#mainApp_div_echarts{
  width: 100%;
  height: 100%;
  position: relative;
  /*overflow: hidden;*/
  /*overflow-x: hidden;*/
  /*overflow-y: scroll;*/
}
</style>