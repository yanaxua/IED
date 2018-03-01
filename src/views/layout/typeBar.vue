<template>
  <div id="views_div_typeBar">
    <!--左边-->
    <!--图表类型-->
    <div class="typeBar_div_type">
      <el-tabs v-model="activeName" @tab-click="typeLisTitleClick">
        <el-tab-pane v-for="(item1,index1) in typeLis" :key="index1" :label="item1.alia" :name="index1+''">
          <div class="typeChooseBox">
            <draggable class="typeChoose clearfix" element="ul" :options="typeLisOption" v-model="item1.data" :clone="typeLisStart" :move="typeLisMove" @end="typeLisEnd">
              <li @click="clickCreate(item2)" v-for="(item2,index2) in item1.data" :key="index2">
                <p v-text="item2.name" class="tc_title" :style="'backgroundImage:url(static/image/'+item2.type+'.png)'" :title="item2.name"></p>
                <!--<img :src="'/static/image/'+item2.type+'.png'" :title="item2.name" :alt="item2.name">-->
              </li>
            </draggable>
          </div>
        </el-tab-pane>

      </el-tabs>
      <!--图表设置-->
      <div class="typeBar_div_title">图表属性</div>
      <ul class="typeOption clearfix">
        <li v-for="(item,index) in optionLis" :key="index">
          <!--{{item.name+":"+item.data}}-->
          <div v-if="item.name=='标题'">
            <p class="optionLisTitle" v-text="item.name"></p>
            <el-input v-model="item.data[0]" @change="titleChange(item.data)" placeholder="请输入标题"></el-input>
          </div>
          <div v-else-if="item.name=='地图'">
            <p class="optionLisTitle" v-text="item.name"></p>
            <el-select v-model="item.data[0]" filterable @change="mapChange" placeholder="请选择">
              <el-option v-for="map in mapLis" :key="map.value" :label="map.label" :value="map.value">
              </el-option>
            </el-select>
          </div>
          <div v-else>
            <p class="optionLisTitle" v-text="item.name"></p>
            <draggable v-model="item.data[1]" class="optionLisDrag" :options="optionLisOption" @add="addData" :data-index="index">
              <p v-text="item.data[0]"></p>
            </draggable>
          </div>
        </li>
        <li v-if="optionLis.length == 0"> 请生成模板 </li>
      </ul>
    </div>
    <!--右边-->
    <!--字段选择-->
    <div class="typeBar_div_word">
      <div class="typeBar_div_title">业务字段</div>
      <div class="wordChooseBox">
        <draggable class="wordChoose clearfix" element="ul" @start="wordInputShow = true" @end="wordInputShow = false" :options="wordLisOption" v-model="wordLis">
          <li v-for="(item,index) in wordLis" :key="item.title" @contextmenu="contextmenu">
            <p>
              <span v-text="item.alias||item.title" class="sys_mtext_subst"></span>
            </p>
          </li>
          <li v-if="wordLis.length == 0"> 请选择字段 </li>
        </draggable>
      </div>
      <!--<div class="typeBar_div_title">功能操作</div>-->
      <div class="controllOption">
        <!--<el-button-group>-->
        <!--<el-button @click="addTip" type="primary" class="el-icon-plus">添加备注</el-button>
                    <el-button @click="saveData" type="primary" class="el-icon-upload2">临时保存</el-button>
                    <el-button @click="savePDF" type="primary" class="el-icon-document">输出PDF</el-button>
                    <el-button @click="post" type="primary" class="el-icon-message">一键发布</el-button>-->
        <div class="layoutType">
          <span>图表布局</span>
          <el-select v-model="layoutType" placeholder="布局方式">
            <el-option v-for="item in layoutLis" :key="item.name" :label="item.name" :value="item.name">
            </el-option>
          </el-select>
        </div>
        <el-button @click="savaReport" class="el-icon-d-arrow-right" type="primary" title="保存当前模板"> 保存模板 </el-button>
        <el-button @click="goReportCenter" class="el-icon-d-arrow-right" type="primary" title="进入报表中心"> 报表中心 </el-button>
        <!--</el-button-group>-->
      </div>
    </div>
  </div>
</template>
  
<script>
import draggable from 'vuedraggable'
import jsPDF from 'jspdf'
import wedit from 'wangeditor'
import html2canvas from 'html2canvas'
export default {
  components: {
    draggable,
    html2canvas,
    wedit,
    jsPDF
  },
  props: {
  },
  data() {
    return {
      typeLisOption: {/**图表类型设置*/
        group: {
          name: "canvasLis",
          pull: "clone",
          put: false
        },
        sort: false
      },
      optionLisOption: {/*图表详细设置*/
        group: {
          name: "data",
          pull: false
        },
        sort: false
      },
      wordLisOption: {/**字段选择 */
        group: {
          name: "data",
          pull: "clone",
          put: false
        },
        sort: false
      },
      activeName: "0",/**2D,3D切换变量 */
      layoutLis: [
        { name: "竖向单列", value: 1 },
        { name: "四宫格", value: 4 },
        { name: "六宫格", value: 6 },
        { name: "九宫格", value: 9 }
      ],/*布局选项*/
      layoutType: "自定义",/**实际布局变量*/
      typeLis: [],/**后台请求获得图表类型数据*/
      optionLis: [],/*实例具体设置项*/
      wordInputShow: false,/*字段拖动目标元素的显隐*/
      optionChoose: [[], [], []],/*当前设置项中所保存的属性*/
      optionChooseLis: [[], []],/*x,y当前设置项中所保存属性对应某一项的集合*/
      mapLis: [],/**后台请求获得地图列表数据*/
      axis1: ["tree"],/*一列数据,树状图,(组织结构树)*/
      axis2: ["scatter", "line", "bar", "area"],/*两列数据,散点,折线,柱状图,(x,y)*/
      axis3: ["pie", "gauge"],/*两列数据,饼图,仪表,(name,value)*/
      axis4: ["radar", "heatmap", "map"],/*两列数据,雷达图,热力图,地图(坐标,value)*/
      axis5: ["parallel", "candlestick", "calendar"],/*未分类,K线图,平行坐标,日历图*/
      axis6: ["table"],/*表格图*/
      screenX: null,
      screenY: null,
    }
  },
  computed: {
    tempInstanceId() {
      /**状态管理中的不能被子组件直接检测,computed属性中新建属性,watch这个属性的变化执行对应操作*/
      return this.$store.state.instance;
    },
    wordLis() {
      return this.$store.state.wordLis;
    }
  },
  methods: {
    showOption(type, index) {/**展示实例设置*/
      this.tempType = type;
      let option = this.$store.state.instance.getOption();
      this.optionLis = [{ name: "标题", data: [option.title[0].text], path: ["title", 0, "text"] }];
      // if (option.title[0].subtext) {
      //   this.optionLis.push({ name: "副标题", data: [option.title[0].subtext] });
      //   if (option.title[0].subtext) {
      //     this.optionLis.push({ name: "副标题链接", data: [option.title[0].sublink] });
      //   }
      // }
      let tempOption = [];
      if (this.axis1.some(item => item == type)) {/*树状图*/
        tempOption = [{ name: "树状结构", data: this.getArray(option.series, (ele) => ele.name), path: ["series", 0] }];
      } else if (this.axis2.some(item => item == type)) {/*散点,折线,柱状图*/
        tempOption = [
          { name: "x轴", data: [option.xAxis[0].name], path: ["xAxis", 0] },
          { name: "y轴", data: this.getArray(option.series, (ele) => ele.name), path: ["series", 0] }
        ];
      } else if (this.axis3.some(item => item == type)) {/*饼图,仪表*/
        tempOption = [{ name: "项目名", data: this.getArray(option.series, (ele) => ele.name), path: ["series", 0] }];
      } else if (this.axis4.some(item => item == type)) {/*雷达图,热力图,地图*/
        tempOption = [{ name: "系列值", data: this.getArray(option.series, (ele) => ele.name), path: ["series", 0] }];
        switch (type) {
          case "radar":
            break;
          case "heatmap":
            break;
          case "map":
            tempOption.push({ name: "地图", data: [option.geo[0].map] });
            break;
          default:
            break;
        }
      } else if (this.axis5.some(item => item == type)) {/*平行坐标,K线图,日历图*/
        tempOption = [{ name: "系列值", data: this.getArray(option.series, (ele) => ele.name) }];
        switch (type) {
          case "parallel":
            tempOption.push({ name: "参考系", data: this.getArray(option.parallelAxis, (ele) => ele.name) });
            break;
          case "candlestick":
            tempOption.push({ name: "参考系", data: this.getArray(option.series, (ele) => ele.type) });
            break;
          case "calendar":
            break;
          default:
            break;
        }
      } else if (this.axis6.some(item => item == type)) {
        for (let i = 0; i < option.series.length; i++) {
          var ele = option.series[i];
          tempOption.push({
            name: String.fromCharCode(i + 65) + "系列",
            data: [ele.data[0][2]],
            path: ["series", i, "data"]
          })
        }
      }
      this.optionLis = this.optionLis.concat(tempOption);
    },
    typeLisStart(item) {/*类型选择字段拖动开始*/
      item.id = "type" + Number(Math.random().toString().substr(3, 12) + Date.now()).toString(36);
      return JSON.parse(JSON.stringify(item));
    },
    typeLisMove(evt, originalEvent) {/*类型选择字段拖动时*/
      if (true) {
        if (!window.getComputedStyle(evt.dragged.parentElement).position) {
          evt.dragged.parentElement.style.position = "relitive";
        }
        let parentStyle = evt.to.getBoundingClientRect();
        // console.log(evt.dragged);/**拖动生成的幽灵元素*/
        if (evt.dragged) {
          //FIXME : 当设置位置使鼠标位于拖拽元素上时,将使拖拽消失,事件不存在
          // let top = originalEvent.y - parentStyle.y - evt.dragged.offsetHeight - 10;
          // let left = originalEvent.x - parentStyle.x - evt.dragged.offsetWidth - 10;
          // evt.dragged.style.position="absolute"
          // evt.dragged.style.top = top + "px";
          // evt.dragged.style.left = left + "px";
          // evt.dragged.style.zIndex = 666;
        }
      }
    },
    typeLisEnd(evt) {/*类型选择字段拖动结束*/
      evt.item.style.position = "static";
    },
    contextmenu(event) {/*右键事件转换*/
      console.log(event.x, event.y);
      event.cancelBubble = true
      event.returnValue = false;
      return false;
    },
    clickCreate(obj) {/*点击图标,创建实例*/
      obj = this.typeLisStart(obj);
      /*告诉状态管理点击产生了echarts*/
      this.$store.commit("echartsCreatChange", obj);
    },
    titleChange(val) {/*图表标题改变*/
      this.$store.state.instance.setOption({ title: [{ text: val }] });
    },
    addData(item) {/**添加数据*/
      let index = item.to.dataset.index;/*判断XY轴:0标题,1,2,3..对应之后的属性*/
      let data = item.item._underlying_vm_;/*传入数据*/
      let type = this.tempType;/*图表类型*/
      console.log(item);
      console.log(data);
      let option = this.$store.state.instance.getOption();/*图表实时数据*/
      var tempPath = this.optionLis[index].path;
      // console.log(item);
      // console.log(data);
      // console.log(tempPath);
      var tempObj = option[tempPath[0]];
      for (let i = 1; i < tempPath.length; i++) {
        tempObj = tempObj[tempPath[i]];
      }
      tempObj.name = data.alias || data.title;
      tempObj.data = data.data;
      this.optionLis[index].data = [data.alias || data.title];
      // this.optionChooseLis[index][0] = {};
      // this.optionChooseLis[index][0].label = data.title;
      // this.optionChooseLis[index][0].value = data.title;
      // if (this.axis1.some(item => item == type)) {/*树状图*/
      //   // option = this.genOption1(option, type, index, data);
      // } else if (this.axis2.some(item => item == type)) {/*散点,折线,柱状图*/
      //   // option = this.genOption2(option, type, index, data);
      // } else if (this.axis3.some(item => item == type)) {/*饼图,仪表*/
      //   // option = this.genOption3(option, type, index, data);
      // } else if (this.axis4.some(item => item == type)) {/*雷达图,热力图,地图*/
      if (type == "radar") {
        option.radar[0].indicator = data.indicator;
      }
      // option = this.genOption4(option, type, index, data);
      // } else if (this.axis5.some(item => item == type)) {/*K线图,平行坐标,日历图*/
      //   // option = this.genOption5(option, type, index, data);
      // }
      this.$store.state.instance.setOption(option);
      // console.log(this.$store.state.wordLis);
      // console.log(this.wordLis);
    },
    mapChange(val) {/*地图选择变化,动态注册地图*/
      /*动态注册地图*/
      /*根据传入的值判定中引文的注册*/
      var val = val.split(",");
      var str = "";
      if (val.length == 1) {
        str = val[0];
      } else if (val.length == 2) {
        str = "province/" + val[0];
      }
      //TODO 动态注册地图
      this.$axios.get('static/map/json/' + str + '.json').then((response) => {/*动态注册地图*/
        this.$echarts.registerMap(val[0], response.data);
        let option = this.$store.state.instance.getOption();

        // option.geo[0].map = val[val.length - 1]/*val的最后一个值,省份的使用中文名,用于使用数据*/
        option.geo = {
          type: 'map',
          map: val[val.length - 1],
          // roam: true,
          zoom: 1.2,
          // boundingCoords: [[-180, 90], [180, -90]],
          itemStyle: {
            normal: {
              areaColor: '#E6A23C',
              borderColor: '#fff'
            },
            emphasis: {
              areaColor: '#67C23A'
            }
          }
        }
        this.$store.state.instance.setOption(option, { notMerge: true });
        console.log(option);
      })
    },
    genOption1(option, type, index, data) {/*树状图*/
      /*option当前实例设置
      ,type实例类型
      ,index实例所在索引
      ,data传入数据
      */
      option.series[0].data = data;
      return option;
    },
    genOption2(option, type, index, data) {/*散点,折线,柱状图*/
      if (index == 0) {
        option.xAxis = {
          data: data.data,
          name: data.title,
          nameLocation: "center",
          nameGap: 30
        };
      } else if (index == 1) {
        option.legend = {
          data: [{
            name: data.title
          }]
        }
        option.series[0].name = data.title;
        option.series[0].data = data.data;
      }
      return option;
    },
    genOption3(option, type, index, data) {/*饼图,仪表*/
      if (index == 0) {
        for (let i = 0; i < data.data.length; i++) {
          option.series[0].data[i].name = data.data[i];
        }
      } else if (index == 1) {
        for (let i = 0; i < data.data.length; i++) {
          option.series[0].name = data.title;
          option.series[0].data[i].value = data.data[i];
        }
      }
      return option;
    },
    genOption4(option, type, index, data) {/*雷达图,热力图,地图*/
      if (index == 0) {
        // if (type == "map") {
        //   for (let i = 0; i < data.data.length; i++) {
        //     option.series[0].data[i] = {};
        //     option.series[0].data[i].value = data.data[i];
        //   }
        // }
      } else if (index == 1) {
        if (type == "map") {
          option.legend[0].data[0] = data.title;
          option.series[0].name = data.title;
          for (let i = 0; i < data.data.length; i++) {
            option.series[0].data[i].name = data.data[i].name;
            option.series[0].data[i].value[2] = data.data[i].value;
          }
        }
      }
      return option;
    },
    genOption5(option, type, index, data) {/*K线图,平行坐标,日历图*/
      return option;
    },
    getArray(arr, callback) {/**获取数组中自定义的内容,并组成新的数组返回*/
      let tempArr = [];
      /*callback中return数据项中想要的部分*/
      arr.forEach(function(element) {
        tempArr.push(callback(element));
      });
      return tempArr
    },
    typeLisTitleClick() {/*点击图标类型事件*/
      // this.$router.push({ path: '/layout/echartsShow' });
      // if (this.$router) {

      // }
    },
    getDom(dom) {/*获取页面信息*/
      let outDom = {
        dom: dom.nodeName,
        css: window.getComputedStyle(dom),
        children: []
      };
      var getSon = (obj, to) => {
        var instance = this.$echarts.getInstanceByDom(obj);
        if (instance) {
          to.echartsOption = instance.getOption();
        } else if (obj.hasChildNodes()) {
          getSon();
        }
        for (let i = 0; i < obj.childNodes.length; i++) {
          var temp = obj.childNodes[i];
          var tempDom = {
            dom: temp.nodeName,
            // css: window.getComputedStyle(temp),
            children: []
          };
          var instance = this.$echarts.getInstanceByDom(temp);
          if (instance) {
            /**获取到实例所在的元素,操作数据*/
            tempDom.echartsOption = instance.getOption();
          } else if (temp.hasChildNodes()) {
            getSon(temp, tempDom);
          } else {
            // console.log(temp);
          }
          to.children.push(tempDom);
        }
      }
      getSon(dom, outDom);
      console.log(outDom);
      // return outDom
    },
    savaReport() {
      /*将当前模板保存至报表中心*/
      /*保存页面信息*/
      // var dom = document.getElementById("canvasLis");
      // var style = window.getComputedStyle(dom);
      // var astyle = dom.style;
      // this.getDom(dom);
      // console.dir(dom);
      // console.log(style);
      // console.log(astyle);
      var tempArr = [];
      var domLis = document.getElementById("canvasLis").children;
      for (let i = 0; i < domLis.length; i++) {
        var temp = domLis[i];
        var style = {};
        var tempStyle = temp.style.cssText.split(";");
        tempStyle.splice(-1, 1);
        for (let j = 0; j < tempStyle.length; j++) {
          var temp = tempStyle[j];
          var temp2 = temp.split(":");
          // style[temp2[0]] = temp2[1];
        }
        tempArr[i] = {
          style: style,
          option: this.$echarts.getInstanceByDom(temp.children[0].lastChild).getOption(),
        }
      }
      // console.log(this.$root.$children[0].$children[0].$children[1].canvasLis);
      this.$store.commit("reportListAdd", tempArr);
      this.$message({
        showClose: true,
        message: '保存成功',
        type: 'success'
      });
    },
    goReportCenter() {
      /*进入报表中心*/
      this.$router.push({ path: '/layout/reportCenter' });
    },
    addTip() {/*在页面指定位置,指定元素内部,添加备注*/
      /*编辑时显富文本编辑菜单,确认后隐藏,创建之后可拖拽,可删除*/
      var pDom = document.getElementById("mainAppContainer");
      var tempDiv = document.createElement("div");
      var randomId = "line_" + Number(Math.random().toString().substr(3, 12) + Date.now()).toString(36)
      tempDiv.setAttribute("id", randomId);
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "0";
      tempDiv.style.right = "0";
      tempDiv.classList.add("crossLine");
      pDom.appendChild(tempDiv);
      var edit = new wedit("#" + randomId);
      edit.customConfig.uploadImgShowBase64 = true   // 使用 base64 保存图片
      edit.create();
    },
    savePDF() {/*将编辑区保存为PDF文件,分页功能,像素*/
      var baobiao = document.getElementById("canvasLis")
      if (baobiao) {
        html2canvas(baobiao).then(function(canvas) {
          /*canvas就是当前获得的画布,转成base64url图片信息*/
          let img = new Image();
          img.src = canvas.toDataURL('image/png');
          // document.getElementById("canvasLis").innerHTML="";
          // document.getElementById("canvasLis").appendChild(img);/*生成图片*/
          let pdf = new jsPDF('p', 'pt', 'a4');// 三个参数，第一个方向，第二个单位，第三个尺寸格式,a4[595.28,841.89]
          pdf.addImage(img.src, 'PNG', 10, 10, (595.28 - 20), ((595.28 - 20) / baobiao.offsetWidth) * baobiao.offsetHeight);
          pdf.save('大数据报表.pdf');
        });
      }
    },
    post() {/*一键发布*/

    },
  },
  created() {
    this.$axios.get("/static/typeLis.json").then((response1) => {
      this.typeLis = response1.data.series;
      // this.$axios.get("/static/dataBase.json").then((response2) => {
      // this.wordLis = response2.data.series;
      this.$axios.get("/static/mapLis.json").then((response3) => {
        this.mapLis = response3.data.series;
      });
      // });
    });
  },
  mounted() {
  },
  watch: {
    tempInstanceId: {
      handler: function(val) {
        if (val) {
          let index = this.$store.state.instance._dom.parentElement.parentElement.dataset.index;
          let type = this.$store.state.instance._dom.dataset.type;
          this.showOption(type, index);
        }
      }
    }
  }
}
</script>
  
<!-- Add 'scoped' attribute to limit CSS to this component only  -->
<style>
li,
ul {
  list-style: none;
  text-align: center;
}



/*总*/

#views_div_typeBar {
  width: 300px;
  background-color: #DCDFE6;
  display: flex;
}






/*各部分标题*/

#views_div_typeBar .typeBar_div_title {
  font-size: 16px;
  font-weight: 700;
  line-height: 40px;
  box-sizing: border-box;
  background-color: #017dd4;
  color: #fff;
  text-align: center;
}






/*图表类型选择*/

#views_div_typeBar .typeBar_div_type {
  border-right: 1px solid #ccc;
  /*width: 50%;*/
  width: 130px;
}

#views_div_typeBar .typeBar_div_type .el-tabs__item {
  color: #fff;
  background-color: #017dd4;
  /*font-size: 16px;*/
  font-weight: 700;
  line-height: 40px;
}

#views_div_typeBar .el-tabs__active-bar {
  background-color: #fff;
}

#views_div_typeBar .typeChooseBox {
  box-sizing: border-box;
  overflow: hidden;
  padding: 0 4px;
}

#views_div_typeBar .el-tabs__header {
  margin-bottom: 5px;
}

#views_div_typeBar .el-tabs__nav {
  background-color: #017dd4;
}

#views_div_typeBar .el-tabs__item.is-active {
  background-color: #20a0ff;
}

#views_div_typeBar .typeChoose {
  max-height: 250px;
  width: calc(100% + 20px);
  overflow-y: scroll;
}

#views_div_typeBar .typeChoose li {
  width: 50%;
  height: 70px;
  float: left;
  box-sizing: border-box;
  padding: 2px;
  user-select: none;
  overflow: hidden;
}

#views_div_typeBar .typeChoose li img {
  height: 100%;
}

#views_div_typeBar .el-dropdown-link.el-dropdown-selfdefine {
  color: #fff;
  font-size: 16px;
}

#views_div_typeBar .typeChoose p {
  /*border: 1px dashed #999;*/
  width: 100%;
  height: 100%;
  line-height: 60px;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  text-indent: 999px;
}





/*图表具体设置*/

#views_div_typeBar .typeOption li {
  width: 100%;
  height: 40px;
  line-height: 40px;
  /*padding: 5px;*/
  margin: 2px 0;
  box-sizing: border-box;
  position: relative;
}

#views_div_typeBar .optionLisTitle {
  display: inline-block;
  width: 44px;
  text-align: center
}

#views_div_typeBar .optionLisTitle+.el-input {
  flex: 1;
  margin-right: 2px;
}

#views_div_typeBar .optionLisInput {
  display: inline-block;
  height: 35px;
  width: 120px;
}

#views_div_typeBar .typeOption li>div {
  display: flex;
  width: 100%;
  height: 100%;
}

#views_div_typeBar .el-select {
  flex: 1;
  width: 120px;
  height: 100%;
  overflow: hidden;
  z-index: 99;
}

#views_div_typeBar .el-select>.el-input {
  width: 100%;
}

#views_div_typeBar .optionLisDrag {
  flex: 1;
  background-color: rgba(255, 255, 255, .2);
  box-shadow: 0px 0px 2px #333;
  width: 120px;
  height: 100%;
  overflow: hidden;
  z-index: 99;
}

#views_div_typeBar .optionLisInput .el-input__inner {
  width: 80px;
}




/*字段选择*/

#views_div_typeBar .typeBar_div_word {
  flex: 2;
  position: relative;
}

#views_div_typeBar .wordChooseBox {
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

#views_div_typeBar .typeBar_div_word .wordChoose {
  flex: 2;
  min-height: 200px;
  max-height: 350px;
  width: calc(100% + 16px);
  overflow-y: scroll;
}

#views_div_typeBar .wordChoose li {
  box-sizing: border-box;
  padding: 5px;
}

#views_div_typeBar .wordChoose p {
  border: 1px dashed #ccc;
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #EBEEF5;
}

#views_div_typeBar .wordChoose span {
  box-sizing: border-box;
  padding: 5px;
}

/*功能操作*/

.controllOption {
  box-sizing: border-box;
  position: absolute;
  left: 5px;
  bottom: 10px;
  font-size: 13px;
}
.controllOption .layoutType{
  display: flex;
  margin-bottom: 1px;
}
.controllOption .layoutType span{
  line-height: 36px;
  font-size: 14px;
  padding: 0 3px;
}
.controllOption .layoutType .el-select{
  display: inline-block;

}
.controllOption .el-button {
  margin-bottom: 1px;
  width: 100%;
  text-align: center;
  margin-left: 0;
}
</style>