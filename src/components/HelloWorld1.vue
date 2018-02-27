<template>
  <div id="earthContent">
    <div id="earth">
    </div>
    <div id="legend" v-show="legendShow">
      <div v-for="(item,key) in legendPath" :key="key">
        <img :src="item.path" alt="key" draggable="false">
        <span v-text="item.name" :class="item.type"></span>
      </div>
    </div>
    <div class="legend_industry" v-show="legendShow">
      <el-table :data="data" style="width: 100%">
        <el-table-column prop="errEquipment" label="设备名称" width="140">
        </el-table-column>
        <el-table-column prop="name" label="企业名称" width="100">
        </el-table-column>
        <el-table-column prop="describe" label="故障描述" width="140">
        </el-table-column>
        <el-table-column prop="time" label="时间" width="112">
        </el-table-column>
      </el-table>
    </div>
    <div class="legend_input" v-show="legendShow">
      <el-select v-model="industryName" filterable placeholder="搜索企业" @change="industryChange">
        <el-option v-for="(item,index) in data" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
    </div>
    <el-dialog title="提示" :visible.sync="chinaVisible" width="70%" height="100%" style="margin-top: 10px;">
      <div id="china"> </div>
    </el-dialog>
  </div>
</template>
<script>
import echartsGl from 'echarts-gl'
/**导入世界地图 */
import world from 'echarts/map/js/world'
import china from 'echarts/map/js/china'
// import world from 'static/map/js/world'
// import china from 'static/map/js/china'
export default {
  components: {
  },
  data() {
    return {
      option: {
        title: {
          text: '迪奥云-工业能效大数据平台',
          subtext: '欢迎登录大数据平台',
          sublink: 'http://www.dyiaw.com',
          x: 'center',
          textStyle: {
            color: 'white',
            fontSize: "30"
          }
        },
        tooltip: {
          formatter: '{b}'
        },
        globe: {
          show: true,
          globeRadius: 130,
          environment: 'static/image/starfield.jpg',
          baseTexture: 'static/image/earth.jpg',
          heightTexture: 'static/image/earth.jpg',
          displacementQuality: 'high',
          shading: 'color',/*lambert , color,realistic*/
          light: {
            main: {
              shadow: true
            }
          },
          viewControl: {
            autoRotate: false,
            zoomSensitivity: 3,
            autoRotateSpeed: 1,
            distance: 500,
            alpha: 0,
            beta: 90,
            animation: false,/*开启过渡动画*/
            // targetCoord: [108.56, 34.15]/*定位坐标,开启忽略alpha,beta*/
          }
        }
      },
      nation: {
        backgroundColor: {
          color: "#fff"
        },
        graphic: {
          type: 'image',
          id: 'logo',
          left: 0,
          top: 0,
          z: -10,
          bounding: 'raw',
          origin: [65, 65],
          style: {
            image: 'static/image/earth.jpg',
            width: 2048,
            height: 1024,
            opacity: 1
          }
        },
        geo: {
          type: 'map',
          map: 'world',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          boundingCoords: [[-180, 90], [180, -90]],
          itemStyle: {
            normal: {
              areaColor: "transparent",
              color: "yellow"
            }
          }
        },
        // tooltip: { /**提示框组件 */
        //   trigger: 'item',
        //   backgroundColor: 'rgba(245, 245, 245, 0.8)',
        //   borderWidth: 1,
        //   borderColor: '#ccc',
        //   padding: 10,
        //   textStyle: {
        //     color: '#000'
        //   },
        //   extraCssText: 'width: 170px',
        //   // formatter: "{a}",
        //   formatter: function(params, ticket, callback) {
        //     // console.log(params.data);
        //     return params.name;
        //   }
        // },
        series: []
      },
      china: {
        backgroundColor: {
          color: "#fff"
        },
        // tooltip: {
        //   trigger: 'item'
        // },
        geo: {
          type: 'map',
          map: 'china',
          zoom: 1.2,
          itemStyle: {
            normal: {
              // areaColor: "transparent",
              color: "yellow"
            }
          }
        },
        series: [{
          name: '业务分布',
          type: 'scatter',
          coordinateSystem: 'geo',
          data: [],
          symbolSize: function(val) {
            return val[2] / 20;
          },
          label: {
            normal: {
              formatter: '{b}:{c}',
              position: 'right',
              show: false
            },
            emphasis: {
              show: true
            }
          },
          itemStyle: {
            normal: {
              color: 'red'
            }
          }
        }]
      },
      earthIns: null,
      nationIns: null,
      chinaIns: null,
      startLocation: [0, 0],/**相对于起始位置[90,0]的矫正*/
      endLocation: [108.56, 34.15],/**西安*/
      data: [],
      industryName: "",/*用于搜索框*/
      chinaVisible: false,
      timerId: null,
      legendPath: {
        normal: { name: "正常", path: "static/image/legend_normal.png" },
        warning: { name: "警告", path: "static/image/legend_warning.png" },
        danger: { name: "故障", path: "static/image/legend_danger.png" }
      },
      legendShow: false
    }
  },
  created() {
    /*创建时获取数据*/
    this.data = [
      {
        name: '广州曼瑶',
        value: [113.31, 23.14, 500],
        id: 3,
        type: "normal",
        equipment: ["中央空调#450", "中央空调#551", "能管设备#071", "能管设备#071"],
        errEquipment: ["中央空调#450"],
        describe: "能耗过高",
        time: "2018-02-01/11:02:45"
      },
      {
        name: '青岛大夏',
        value: [120.33, 36.07, 180],
        id: 2,
        type: "warning",
        equipment: ["中央空调#856", "能管设备#789", "能管设备#071"],
        errEquipment: ["能管设备#789"],
        describe: "数据异常",
        time: "2018-01-22/16:33:32"
      },
      {
        name: '海门洪旺',
        value: [121.15, 31.89, 90],
        id: 1,
        type: "danger",
        equipment: ["中央空调#410", "中央空调#645", "能管设备#566"],
        errEquipment: ["能管设备#566"],
        describe: "CPU达到60%",
        time: "2018-01-29/08:02:36"
      },
    ];
    for (let i = 0; i < this.data.length; i++) {
      var temp = this.data[i];
      var tempObj = {
        type: 'scatter',
        coordinateSystem: 'geo',
        geoIndex: 0,
        data: [temp],
        symbol: "image://" + this.legendPath[temp.type].path,
        symbolOffset: [0, '-50%'],
        symbolSize: 27,
        label: {
          normal: {
            formatter: function(params, ticket, callback) {
              var arr = [
                '{name|' + params.name + '}',
                '{hr|}'
              ];
              params.data.equipment.forEach(function(element, index) {
                arr.push('{equipment|' + (index + 1) + '.' + element + '}');
              });
              return arr.join("\n");
            },
            rich: {
              name: {
                fontSize: 16,
                color: "#000"
              },
              hr: {
                width: "100%",
                borderColor: "rgba(0,0,0,0.6)",
                borderWidth: 1,
                height: 0,
                lineHeight: 12
              },
              equipment: {
                fontSize: 16,
                color: "#000",
                lineHeight: 20
              }
            },
            position: "top",
            backgroundColor: '#eee',
            borderColor: '#555',
            borderWidth: 2,
            borderRadius: 5,
            padding: 10,
            show: false
          },
          emphasis: {
            show: true
          }
        },
        itemStyle: {
          normal: {
            color: 'red'
          }
        }
      }
      this.nation.series[i] = tempObj;
    }
  },
  mounted() {
    let me = this;
    var canvas = document.createElement('canvas');
    this.nationIns = this.$echarts.init(canvas, null, {
      width: 2048, height: 1024
    });
    this.nationIns.setOption(this.nation);
    this.nationIns.on("click", this.showChina);
    this.earthIns = this.$echarts.init(document.getElementById("earth"));
    this.earthIns.showLoading({
      text: '读取数据中...'
    });
    this.option.globe.baseTexture = this.nationIns;
    setTimeout(() => {
      this.earthIns.hideLoading()
    }, 200);
    this.earthIns.setOption(this.option);
    /**转动到指定位置 */

    this.toPosition(this.earthIns);

    /**窗口重置的监听 */
    // window.addEventListener("resize", () => {
    //   this.earthIns.resize()
    //   if (this.chinaVisible && this.chinaIns) {
    //     this.chinaIns.resize()
    //   }
    // })
    // var throttle = function(fn, delay) {
    //   var timer = null;
    //   return function() {
    //     clearTimeout(timer);
    //     timer = setTimeout(function() {
    //       fn();
    //     }, delay);
    //   }
    // };
    window.addEventListener("resize", me.echartsResize());
  },
  computed: {

  },
  beforeRouteLeave(to, from, next) {
    /*摧毁echarts实例*/
    /**取消resize监听 */
    window.removeEventListener("resize", this.echartsResize());
    next();
  },
  methods: {
    toPosition(instance, endLocation, time) {
      /*西安 [108.56,34.15]
      * 巴拿马运河[-79.59,8.99]
      * 北京 [116.46, 39.92]
      */
      endLocation = endLocation || this.endLocation;
      time = time || 3000;
      var option = instance.getOption();
      let xDis = endLocation[0] - this.startLocation[0];/**经度差 */
      let yDis = endLocation[1] - this.startLocation[1];/**纬度差 */
      console.log(xDis, yDis);
      let zDis = option.globe[0].viewControl.distance - 220/**高度差,停留在220的高度*/
      let xStep = xDis / (time / 15);
      let yStep = yDis / (time / 15);
      let zStep = zDis / (time / 15);
      let tempOption = {
        globe: {
          viewControl: {
            distance: option.globe[0].viewControl.distance,
            alpha: option.globe[0].viewControl.alpha,
            beta: option.globe[0].viewControl.beta
          }
        }
      }
      var innerTo = () => {
        xDis -= xStep;
        if (Math.abs(xDis) <= 1) {
          /**绝对值<=0,情况很难出现,+1*/
          tempOption.globe.viewControl.autoRotate = true;
          tempOption.globe.viewControl.animation = false;
          instance.setOption(tempOption);
          this.legendShow = true;
        } else {
          tempOption.globe.viewControl.distance -= zStep;
          tempOption.globe.viewControl.alpha += yStep;
          tempOption.globe.viewControl.beta += xStep;
          instance.setOption(tempOption);
          requestAnimationFrame(innerTo);
        }
      }
      requestAnimationFrame(innerTo);
      // let timerId = setInterval(() => {
      //   if (tempOption.globe.viewControl.distance <= endDistance) {
      //     clearInterval(timerId);
      //     tempOption.globe.viewControl.autoRotate = true;
      //     tempOption.globe.viewControl.animation = false;
      //     this.legendShow = true;
      //   }
      //   tempOption.globe.viewControl.distance -= zStep;
      //   tempOption.globe.viewControl.alpha += yStep;
      //   tempOption.globe.viewControl.beta += xStep;
      //   instance.setOption(tempOption);
      // }, 30);
      // requestAnimationFrame();
      window.addEventListener("mousedown", () => {
        // clearInterval(timerId);
        xDis = 0;
        this.legendShow = true;
      })
    },
    showChina(parm) {
      if (parm.name && parm.name == "China") {
        this.chinaVisible = true;
        /**打开平面中国地图,适用于公司业务范围广,散点密集的示例*/
        this.$nextTick(() => {
          if (document.getElementById("china") && !this.chinaIns) {
            let chinaWidth = document.getElementById("china").offsetWidth;
            let chinaHeight = document.getElementById("china").offsetHeight;
            this.chinaIns = this.$echarts.init(document.getElementById("china"), null, {
              width: chinaWidth, height: chinaHeight
            });
            this.china.series = this.nation.series;
            this.chinaIns.setOption(this.china);
            /*放大之后的地图注册点击事件*/
            this.chinaIns.on("click", this.showChina);
          }
        })
      } else if (this.data.some(item => item.name == parm.name)) {
        // this.$router.push({ name: 'layout', params: { username: parm.name } });
        
        this.$router.push({ name: 'layout' });
      }
    },
    echartsResize() {
      return () => {
        this.throttle(this.earthIns.resize(), 100);
        if (this.chinaVisible && this.chinaIns) {
          this.throttle(this.chinaIns.resize(), 100);
        }
      }
    },
    throttle(fn, delay) {
      let me = this;
      me.timerId = null;
      return function() {
        clearTimeout(me.timerId);
        me.timerId = setTimeout(function() {
          fn();
        }, delay);
      }
    },
    industryChange(val) {
      for (let i = 0; i < this.data.length; i++) {
        var item = this.data[i];
        if (val == item.id) {
          var option = this.earthIns.getOption();
          this.startLocation = [option.globe[0].viewControl.alpha, option.globe[0].viewControl.beta];
          /**TODO: */
          /**FIXEME */
          // this.toPosition(this.earthIns, [item.value[0], item.value[1]], 1020);
          break;
        }
      }
    }
  },
  watch: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
#earthContent {
  position: relative;
  width: 100%;
  height: 100%;
}

#legend {
  position: absolute;
  right: 20px;
  bottom: 20px;
  user-select: none;
}

#earthContent .legend_industry {
  position: absolute;
  left: 20px;
  bottom: 20px;
}

#earthContent .legend_input {
  position: absolute;
  right: 20px;
  top: 20px;
}

#legend img {
  width: 30px;
  vertical-align: middle;
  /*height: 100px;*/
}

#legend span {
  color: #fff;
  font-size: 16px;
  display: inline-block;
}

#legend .normal {
  color: #cdcdcd;
}

#legend .warning {
  color: #f97207;
}

#legend .danger {
  color: #d81e06;
}

#earthContent .el-dialog__wrapper {
  overflow: hidden;
}

#earthContent .el-dialog__body {
  padding-top: 0;
  height: 90%;
}

#earthContent .el-dialog {
  height: 70%;
}

#earth {
  width: 100%;
  height: 100%;
}

#china {
  width: 100%;
  height: 100%;
}
</style>