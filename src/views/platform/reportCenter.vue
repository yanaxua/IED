<template>
  <div id="reportCenter">
    <!--模板编辑-->
    <div id="modelEdit">
      <ul class="canvasLis clearfix">
        <li class="instance clearfix" v-for="(item,index) in reportList" :key="index" :data-index="index">
          <!--<my-echarts class="echarts" :option="item.option">
          </my-echarts>-->
        </li>
      </ul>
    </div>
    <!--操作属性-->
    <div class="modelOption">
      <div class="model_div_title">已有报表</div>
      <ul>
        <li v-for="(item,index) in reportList" :key="index">
          <p v-text="'报表'+(index+1)"></p>
        </li>
        <li v-if="reportList.length == 0">请选择报表</li>
      </ul>
      <el-button-group class="modelOption">
        <el-button @click="addTip" type="primary" class="el-icon-plus">添加备注</el-button>
        <el-button @click="savePDF" type="primary" class="el-icon-document">输出PDF</el-button>
        <el-button @click="post" type="primary" class="el-icon-message">一键发布</el-button>
      </el-button-group>
    </div>
  </div>
</template>
  
<script>
import jsPDF from 'jspdf';
import wedit from 'wangeditor';
import html2canvas from 'html2canvas';
import myEcharts from '@base/myEcharts/myEcharts';
export default {
  components: {
    jsPDF,
    wedit,
    html2canvas,
    myEcharts
  },
  data() {
    return {
      tipFlag: false,
      localData: []
    }
  },
  computed: {
    reportList() {
      return this.$store.state.reportList
    },
  },
  props: {},
  methods: {
    addTip() {/*在页面指定位置,指定元素内部,添加备注*/
      /*编辑时显富文本编辑菜单,确认后隐藏,创建之后可拖拽,可删除*/
      this.tipFlag = true;
      var tempDiv = document.createElement("div");
    },
    savePDF() {/*将编辑区保存为PDF文件,分页功能,像素*/
      var baobiao = document.getElementById("modelEdit");
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
    // this.$store.commit("reportListDel",obj)
  },
  mounted() {

  },
  watch: {
    reportList(val) {
      console.log(val);
      this.localData = val;
    }
  }
}
</script>
  
<!-- Add 'scoped' attribute to limit CSS to this component only  -->
<style>
#reportCenter {
  width: 100%;
  height: 100%;
  display: flex;
}

#reportCenter #modelEdit {
  flex: 1;
}
#modelEdit .canvasLis{
  width: 100%;
  height: 200%;
  position: relative;
}
#reportCenter .modelOption {
  width: 150px;
  background-color: #DCDFE6;
}

#reportCenter .modelOption>ul {
  min-height: 200px;
}

#reportCenter .canvasLis li {
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

#reportCenter .canvasLis li p {
  background-image: none;
}

#reportCenter .canvasLis .sortable-ghost {
  font-size: 30px;
  cursor: move;
}

#reportCenter .instance h3 {
  height: 20px;
  line-height: 20px;
}

#reportCenter .model_div_title {
  font-size: 16px;
  font-weight: 700;
  line-height: 40px;
  box-sizing: border-box;
  background-color: #017dd4;
  color: #fff;
  text-align: center;
}
</style>