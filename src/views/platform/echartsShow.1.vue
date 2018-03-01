<template>
  <div id="mainAppContainer">
    <!---->
    <happy-scroll color="rgba(51,51,51,0.4)">
      <draggable id="canvasLis" class="canvasLis clearfix" @contextmenu="contextmenu" :options="canvasLisOption" :list="canvasLis" @start="canvasLisStart" @end="canvasLisEnd" element="ul" @mousedown="areaChoose" @change="canvasLisChange">
        <!--change先于add事件-->
        <!--@add="canvasLisAdd"-->
        <!--@change="canvasLisChange"-->
        <li class="instance clearfix" v-for="(item,index) in canvasLis" :key="item.id" :data-index="index" @click="selectCanvas(index)">
          <my-echarts class="echarts" :type="item.type" :data="item.data" @creatCanvas="creatCanvas" @delEcharts="delEcharts">
          </my-echarts>
        </li>
      </draggable>
    </happy-scroll>
  </div>
</template>
  
<script>
import { HappyScroll } from 'vue-happy-scroll'
// 引入css，推荐将css放入main入口中引入一次即可。
import 'vue-happy-scroll/docs/happy-scroll.css'
import draggable from 'vuedraggable'
import wedit from 'wangeditor'

import myEcharts from '@base/myEcharts/myEcharts'
export default {
  name: "echartsShow",
  components: {
    HappyScroll,
    draggable,
    wedit,
    myEcharts
  },
  data() {
    return {
      canvasLisOption: {/**图表展示框设置 */
        group: {
          name: "canvasLis"
        },
        draggable: ".dragTitle"
      },
      canvasLis: [],
    }
  },
  props: {
    outCanvasLis: {/**用于保存之后的实例传入重新输入与渲染*/
      type: Array,
      default: () => {
        return []
      }
    }
  },
  computed: {
    tempEchartsData: {
      get() {
        return JSON.parse(JSON.stringify(this.$store.state.echartsCreat));
      }
    },
    canvasLisLength:{
      get(){
        return this.canvasLis.length;
      }
    }
  },
  methods: {
    canvasLisStart() {
    },
    canvasLisEnd() {
    },
    canvasLisInput(item) {
      console.log(item);
    },
    creatCanvas(temp) {/**echarts创造事件 */
      let index = temp.instance._dom.parentElement.parentElement.dataset.index;
      /*将创造的实例添加到对应的数组序列中*/
      this.canvasLis[index].instance = temp.instance;
      this.$store.commit("instanceChange", temp.instance);
      /**将变化后的数据更新,使可读*/
      // this.$root.$children[0].$children[0].$children[1].canvasLis = this.canvasLis;
      // temp.instance.showLoading();
    },
    delEcharts(ins) {/*删除实例*/
      for (let i = 0; i < this.canvasLis.length; i++) {
        var temp = this.canvasLis[i];
        if (ins.id == temp.instance.id) {
          this.canvasLis.splice(i, 1);
          break;
        }
      }
    },
    selectCanvas(index) {/**实例的点击事件,点击传参多了一个图标类型的name参数*/
      this.$store.commit("instanceChange", this.canvasLis[index].instance);
    },
    areaChoose(e) {/*图形区域选择*/
      e = e || window.event;
    },
    mousemove() {

    },
    sortCanvas() {

    },
    dragMove() {
      /*取消拖拽插件的拖拽*/
      return false;
    },
    canvasLisChange(e) {
      if (e.added) {
        // console.log("canvasLisChange");
      }
    },
    resize(e) {
      let tempDom = document.querySelector("#canvasLis");
      if (tempDom) {
        // tempDom.style.height = tempDom.offsetWidth * 2 + "px";
        /**保持A4比例210*297*/
        tempDom.style.height = tempDom.offsetWidth * (297 / 210) + "px";
      }
    },
    contextmenu(event) {/*禁止列表区域默认右键菜单,添加自定义菜单选项*/
      event.cancelBubble = true
      event.returnValue = false;
      return false;
    },
  },
  created() {

  },
  mounted() {
    /**创建富文本编辑区域*/
    // var edit = new wedit("#mainAppContainer");
    // edit.create();
    this.resize();
    window.addEventListener("resize", this.resize);
  },
  watch: {
    tempEchartsData(val) {
      /*将检测到的数据添加到canvasLis队列中*/
      this.canvasLis.push(val);
    },
    outCanvasLis(val) {
      if (val.length != 0) {
        this.canvasLis = val
      }
    },
    canvasLisLength(val){
      /*页面数量变化时,计算高度,以及位置*/
      this.setHeight();
    }
  }
}
</script>
  
<!-- Add 'scoped' attribute to limit CSS to this component only  -->
<style>
#mainAppContainer {
  position: relative;
  width: 100%;
  /*width: calc(100% + 20px);*/
  height: 100%;
  /*overflow: scroll;
  overflow-x: hidden;
  overflow-y: scroll;*/
}

#mainAppContainer #canvasLis {
  /*width: calc(100% + 20px);*/
  width: 100%;
  min-height: 100%;
  box-sizing: padding-box;
  background-color: #fff;
  position: relative;
}

#mainAppContainer .happy-scroll-content {
  border-right: 6px solid transparent !important;
  border-bottom: 6px solid transparent !important;
}
#mainAppContainer .happy-scroll-container{
  width: 100% !important;
}


/*每个实例容器*/

#mainAppContainer #canvasLis li {
  list-style: none;
  float: left;
  width: 33.3333%;
  /*height: 10%;*/
  box-sizing: border-box;
  padding: 3px;
  background-color: #fff;
  border: 1px dashed #ccc;
  /*position: absolute;*/
}

#mainAppContainer #canvasLis li p {
  background-image: none;
}

#mainAppContainer #canvasLis .sortable-ghost {
  font-size: 30px;
  cursor: move;
}

#mainAppContainer .instance h3 {
  height: 20px;
  line-height: 20px;
}
</style>