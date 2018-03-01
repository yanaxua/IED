<template>
  <div id="mainAppContainer">
    <happy-scroll hide-horizontal color="rgba(51,51,51,0.4)">
      <!--滚动条容器-->
      <div class="scrollBox">
        <!--每一页-->
        <div class="canvasLisBox" v-for="(item1,index1) in canvasLis" :key="item1.page">
          <div class="canvasLisContainer">
            <draggable class="canvasLis clearfix" :options="canvasLisOption" :list="item1.canvasLis" element="ul" @change="canvasLisChange">
              <!--change先于add事件-->
              <!--@add="canvasLisAdd"-->
              <!--@change="canvasLisChange"-->
              <li class="instance clearfix" v-for="(item,index) in item1.canvasLis" :key="item.id" :data-index="index">
                <my-echarts class="echarts" :type="item.type" :data="item.data" @creatCanvas="creatCanvas" @delEcharts="delEcharts">
                </my-echarts>
              </li>
            </draggable>
          </div>
          <div class="pageFooter">第 {{index1+1}} / 1 页</div>
        </div>
      </div>
    </happy-scroll>
  </div>
</template>

<script>
import { HappyScroll } from 'vue-happy-scroll'
/*引入css，推荐将css放入main入口中引入一次即可。*/
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
      canvasLis: [{
        page: 0,/*当前所在页面*/
        canvasLis: []
      }],
      saveState: false,/**是否保存了当前报表的状态*/
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
  },
  methods: {
    setHeight() {/*用于设置box宽度保持A4大小*/
      var tempDom = document.querySelectorAll("#mainAppContainer .canvasLis");
      for (let i = 0; i < this.canvasLis.length; i++) {
        tempDom[i].style.height = tempDom[i].offsetWidth * (297 / 210) + "px";
      }
    },
    canvasLisChange(e) {
      if (e.added) {/*当新增元素时,计算是否有足够的位置摆放,否则添加*/
        console.log(e);
      }
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
      var tempFlag = false;
      for (let i = 0; i < this.canvasLis.length; i++) {
        for (let j = 0; j < this.canvasLis[i].canvasLis.length; j++) {
          var temp = this.canvasLis[i].canvasLis[j];
          if (ins.id == temp.instance.id) {
            this.canvasLis[i].canvasLis.splice(j, 1);
            tempFlag = true;
            break;
          }
        }
        if (tempFlag) { break; }
      }
    },
  },
  created() {

  },
  mounted() {
    this.setHeight();
    window.addEventListener("resize", this.setHeight);
  },
  beforeRouteLeave(to, from, next) {
    if (this.saveState || this.canvasLis[0].canvasLis.length ==0) {
      next();
    } else {
      this.$confirm('是否不保存报表并离开页面?', '提示', {
        confirmButtonText: '确定离开(不保存)',
        cancelButtonText: '取消(继续编辑)',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'warning',
          message: '报表未保存!'
        });
        next();
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消'
        // });
        next(false);
      });
    }
  },
  watch: {
  }
}
</script>
  
<!-- Add 'scoped' attribute to limit CSS to this component only  -->
<style>
#mainAppContainer {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #b3ccec;
}

#mainAppContainer .happy-scroll-content {
  border-right: 6px solid transparent !important;
  border-bottom: 6px solid transparent !important;
}

#mainAppContainer .happy-scroll-container {
  width: 100% !important;
}

#mainAppContainer .scrollBox {
  width: 100%;
  padding: 20px;
}

#mainAppContainer .scrollBox .canvasLisBox {
  position: relative;
  padding: 20px 20px 30px 20px;
  background-color: #fff;
  margin-bottom: 16px;
  box-shadow: 3px 3px 16px rgba(0, 0, 0, .3);
}

#mainAppContainer .scrollBox .canvasLisContainer {
  width: 100%;
  height: 100%;
}

.pageFooter {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, -75%);
  color: #666;
}

#mainAppContainer .canvasLis {
  position: relative;
  width: 100%;
  background-color: #fff;
  box-sizing: border-box;
}

#mainAppContainer .canvasLis li {
  list-style: none;
  float: left;
  width: 33.3333%;
  height: 25%;
  box-sizing: border-box;
  padding: 3px;
  background-color: #fff;
  box-shadow: 3px 3px 16px rgba(0, 0, 0, .3);
}

#mainAppContainer .canvasLis li p {
  background-image: none;
}

#mainAppContainer .canvasLis .sortable-ghost {
  font-size: 30px;
  cursor: move;
}

#mainAppContainer .instance h3 {
  height: 20px;
  line-height: 20px;
}
</style>