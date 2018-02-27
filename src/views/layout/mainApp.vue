<template>
  <div id="mainApp_div_echarts" @mousemove="mousemove">
    <transition>
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </transition>
  </div>
</template>
  
<script>
import draggable from 'vuedraggable'
import wedit from 'wangeditor'
import myEcharts from '@base/myEcharts/myEcharts'
import cube from '@base/cube'
export default { 
  components: {
    draggable,
    wedit,
    myEcharts,
    cube,
  },
  data() {
    return {
      canvasLisOption:{/**图表展示框设置 */
        group: {
          name: "canvasLis"
        },
        draggable:".dragTitle"
      },
      canvasLis:[],
      currentX:null,
      currentY:null,
      cubeData:[]
    }
  },
  props: {
  },
  computed:{
  },
  methods: {
    canvasLisStart(){/**显示垃圾箱 */
    },
    canvasLisEnd(item){/**隐藏垃圾箱 */
      /**这里canvasLis中的数据已经更新,但是dom结构没有,需要更新界面,*/
      // console.log(item);
      // console.log(this.canvasLis);
    },
    canvasLisInput(item){
      console.log(item);
    },
    creatCanvas(temp){/**echarts创造事件 */
      let index = temp.instance._dom.parentElement.parentElement.dataset.index;
      /*将创造的实例添加到对应的数组序列中*/
      this.canvasLis[index].instance = temp.instance;
      this.$store.commit("instanceChange",temp.instance);
      // temp.instance.showLoading();
    },
    selectCanvas(index){/**实例的点击事件,点击传参多了一个图标类型的name参数*/
      this.$store.commit("instanceChange",this.canvasLis[index].instance);
    },
    cubeClick(coord){/*魔方点击事件,参数是魔方坐标层/行/列/面*/
      // console.log(coord);
    },
    areaChoose(e){/*图形区域选择*/
      e = e || window.event;
    },
    mousemove(){

    },
    sortCanvas(){

    },
    dragMove(){
      /*取消拖拽插件的拖拽*/
      return false;
    },
    canvasLisChange(e){
      if (e.added) {
        // console.log("canvasLisChange");
      }
    },
    resize(e){
      let tempDom = document.querySelector("#canvasLis");
      if (tempDom) {
        tempDom.style.height = tempDom.offsetWidth*2 + "px";
      }
    }
  },
  created() {
    this.$axios.get('static/cube.json').then((response) => {/*获取cube数据*/
      this.cubeData = response.data;
    })
  },
  mounted() {
    /**创建富文本编辑区域*/
    // var edit = new wedit("#mainApp_div_echarts");
    // edit.create();
    this.resize();
    window.addEventListener("resize",this.resize);
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