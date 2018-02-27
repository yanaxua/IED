<template>
  <div id="mainAppContainer">
    <draggable id="canvasLis" class="canvasLis clearfix" :options="canvasLisOption" :list="canvasLis" @start="canvasLisStart" @end="canvasLisEnd" element="ul" @mousedown="areaChoose" @change="canvasLisChange">
      <!--change先于add事件-->
      <!--@add="canvasLisAdd"-->
      <!--@change="canvasLisChange"-->
      <li class="instance clearfix" v-for="(item,index) in canvasLis" :key="item.id" :data-index="index" @click="selectCanvas(index)">
        <my-echarts class="echarts" :type="item.type" :data="item.data" @creatCanvas="creatCanvas" @delEcharts="delEcharts">
        </my-echarts>
      </li>
    </draggable>
  </div>
</template>
  
<script>
import draggable from 'vuedraggable'
import wedit from 'wangeditor'
import myEcharts from '@base/myEcharts/myEcharts'
export default {
  name: "echartsShow",
  components: {
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
    outCanvasLis: {
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
        tempDom.style.height = tempDom.offsetWidth * 2 + "px";
      }
    }
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
  overflow: scroll;
}

#mainAppContainer #canvasLis {
  width: calc(100% + 20px);
  width: 100%;
  min-height: 100%;
  box-sizing: padding-box;
  background-color: #fff;
  position: relative;
}



/*每个实例容器*/

#mainAppContainer #canvasLis li {
  list-style: none;
  float: left;
  width: 33.3333%;
  height: 10%;
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