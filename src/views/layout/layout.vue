<template>
  <main id="views_div_layout">
    <div class="main-top">
      <div class="title fl">工业能效大数据平台(IED)</div>
    </div>
    <div class="main-bottom" @mousedown="mousedown" @mousemove="mousemove" @mouseup="mouseup">
      <data-bar class="dataBar"></data-bar>
      <main-app class="mainApp views_mainApp_resize"></main-app>
      <type-bar v-show="echartsShow" ref="typeBar" class="typeBar" style="width:300px;"></type-bar>
    </div>
    <div class="main-footer">
      <div class="fl">
        技术支持：
        <a href="http://www.dyiaw.com" target="_blank">广东迪奥技术有限公司</a> 版本号：
        <a href="javascript:void(0);">1.0.0</a>
      </div>
      <div class="fr" id="plat_dateTime" v-html="dateTime">
        {{dateTime}}
      </div>
    </div>
  </main>
</template>
  
<script>
import draggable from 'vuedraggable'

import dataBar from "./dataBar"
import mainApp from "./mainApp"
import typeBar from "./typeBar"
export default {
  components: {
    dataBar,
    mainApp,
    typeBar,
    draggable
  },
  data() {
    return {
      dateTime: "",
    }
  },
  computed:{
    echartsShow(){
      return this.$route.name=="echartsShow";
    }
  },
  props: {},
  methods: {
    mainAppCursor(e) {
      let me = this;
      e = e || window.event;
      let tempDom = document.querySelector(".main-bottom .typeBar");
      let tempStyle = tempDom.getBoundingClientRect();
      if (e.x > (tempStyle.x - 4) && e.x < (tempStyle.x + 4)) {
        document.querySelector("#views_div_layout .main-bottom").classList.add("resize");
      } else {
        document.querySelector("#views_div_layout .main-bottom").classList.remove("resize");
      }
    },
    mousedown(e) {
      let me = this;
      e = e || window.event;
      let tempDom = document.querySelector("#views_div_layout .main-bottom");
      if (tempDom.classList.contains("resize")) {
        document.body.addEventListener("mousemove", this.onResize);
      }
    },
    mouseup(e) {
      document.body.removeEventListener("mousemove", this.onResize);
    },
    mousemove(e) {
      this.mainAppCursor();
    },
    onResize(e) {
      e = e || window.event;
      let tempWidth = parseInt(this.$refs.typeBar.$el.style.width);
      let tempX = this.$refs.typeBar.$el.getBoundingClientRect().x;
      if ((tempWidth - e.x + tempX) < 220 || (tempWidth - e.x + tempX) > 600) {
        return;
      }
      this.$refs.typeBar.$el.style.width = tempWidth - (e.x - tempX) + "px";
      /*主动派发resize事件*/
      var evt = document.createEvent("MouseEvents");
      evt.initMouseEvent("resize", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      window.dispatchEvent(evt);
    }
  },
  created() {

  },
  mounted() {

  },
  watch: {}
}
</script>
<!-- Add 'scoped' attribute to limit CSS to this component only  -->
<style >
#views_div_layout {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

#views_div_layout .main-top {
  background-color: #13589e;
  height: 70px;
  padding: 0 30px;
}

#views_div_layout .title {
  line-height: 70px;
  font-size: 36px;
  font-weight: 700;
  color: #fff;
}

#views_div_layout .main-bottom {
  flex: 1;
  display: flex;
}

#views_div_layout .main-bottom.resize {
  cursor: e-resize;
  user-select: none;
}

#views_div_layout .mainApp {
  flex: 1;
}

#views_div_layout .main-footer {
  position: relative;
  z-index: 99;
  height: 20px;
  background-color: #e5eaf4;
  border-top: #cccccc solid 1px;
  color: #393939;
  font-size: 12px;
  line-height: 18px;
  padding-left: 15px;
  padding-right: 15px;
}

#views_div_layout .main-footer a {
  color: #045598;
}
.el-form-item__content{
  text-align: left;
}
.el-input{
  width: 60%;
}
</style>