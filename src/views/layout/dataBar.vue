<template>
  <div id="views_div_dataBar">
    <div class="dataBar_div_title">数据来源选择</div>
    <!--类型选择-->
    <div class="dataMain">
      <el-menu default-active="1" class="el-menu-vertical-demo" @select="handlerSelect" @open="handleOpen" @close="handleClose">
        <!--:unique-opened="true"-->
        <el-submenu index="1">
          <span slot="title">
            <!--<el-button type="primary" size="mini" icon="edit"></el-button>-->
            <i class="el-icon-message"></i>
            数据库
          </span>
          <el-submenu v-for="(item1,index1) in tableBase" :key="item1.dataBase" :index="'1-'+(index1+1)">
            <template slot="title">{{item1.alias||item1.dataBase}}</template>
            <el-menu-item v-for="(table,index2) in item1.tableList" :key="table.tableName" v-text="table.alias||table.tableName" :index="'1-'+(index1+1)+'-'+(index2+1)">表</el-menu-item>
          </el-submenu>

        </el-submenu>
        <el-menu-item index="2">
          <i class="el-icon-upload2"></i>本地上传</el-menu-item>
        <el-menu-item index="3">
          <i class="el-icon-menu"></i>多维数据</el-menu-item>
      </el-menu>

      <!--<el-button-group>
        <el-button type="primary" class="dataWay database el-icon-menu" @click="dataBase">数据库数据</el-button>
        <el-button type="primary" class="dataWay datalocal el-icon-upload2" @click="dataLocal">本地上传</el-button>
        <el-button type="primary" class="dataWay dataindustry el-icon-more" @click="dataIndustry">多维数据</el-button>
      </el-button-group>-->
    </div>

    <!--手动添加-->
    <el-dialog title="手动添加" :visible.sync="dataHandShow" width="40%" :before-close="dialogClose">
      <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="100px" class="demo-dynamic">
        <el-form-item prop="title" label="字段名" :rules="{ required: true, message: '请输入字段名', trigger: 'blur' }">
          <el-input v-model="dynamicValidateForm.title"></el-input>
          <el-input-number label="字段名" v-model="dataHandCount" @change="dataHandCountChange" :min="0" :max="999"></el-input-number>
        </el-form-item>
        <el-form-item v-for="(domain, index) in dynamicValidateForm.domains" :label="'值' + (index+1)" :key="domain.key" :prop="'domains.' + index + '.value'" :rules="{ required: true, message: 'value值不能为空', trigger: 'blur' }">
          <el-input v-model="domain.value"></el-input>
          <el-button @click.prevent="removeDomain(domain)">删除</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('dynamicValidateForm')">提交</el-button>
          <el-button @click="addDomain">新增值</el-button>
          <el-button @click="resetForm('dynamicValidateForm')">重置</el-button>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dataHandShow = false">取 消</el-button>
        <el-button type="primary" @click="dataHandShow = false">确 定</el-button>
      </span>
    </el-dialog>
    <!--本地上传-->
    <el-dialog title="本地上传" :visible.sync="dataLocalShow" width="80%" :before-close="dialogClose">
      <el-upload class="upload-demo" id="upload-demo" ref="uploadDemo" drag action="https://jsonplaceholder.typicode.com/posts/" :on-change="fileChange" :auto-upload="false" accept=".xlsx,.xls,.json,.txt" :multiple="false">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">只能上传Excel,json文件，且不超过500kb</div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button class="el-icon-delete2" @click="dataLocalCancel">取 消</el-button>
        <el-button type="primary" class="el-icon-upload2" @click="dataLocalsure">确 定</el-button>
      </span>
    </el-dialog>
    <!--选择企业多维数据
            <el-dialog title="多维数据" :visible.sync="dataIndustryShow" width="80%" :before-close="dialogClose">
              <span>这是一段信息</span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="dataIndustryShow = false">取 消</el-button>
                <el-button type="primary" @click="dataIndustryShow = false">确 定</el-button>
              </span>
            </el-dialog>-->
  </div>
</template>
  
<script>
import draggable from 'vuedraggable'
import XLSX from 'xlsx'
export default {
  components: {
    draggable
  },
  data() {
    return {
      dataBaseShow: false,
      dataHandShow: false,
      dataLocalShow: false,
      dataIndustryShow: false,
      chooseList: [],
      dynamicValidateForm: {
        domains: [{
          value: ''
        }],
        title: ''
      },
    }
  },
  props: {},
  computed: {
    dataHandCount: {
      get: function() {
        return this.dynamicValidateForm.domains.length;
      },
      set: function(newValue) {
        return newValue;
      }
    },
    tableBase() {/*数据库数据*/
      return this.$store.state.dataBase;
    }
  },
  methods: {
    dataBase(str) {/**数据库*/
      // this.dataBaseShow = true;/*显示*/
      // this.$router.push({ path: '/layout/dataChoose'});
      /**当菜单层级到第三级,即长度到5,打开echarts界面,并且将字段提交到字段区域*/
      if (str.length >= 5) {
        /*展示编辑框*/
        var tempArr = JSON.parse(JSON.stringify(str)).split("-");
        var tempData = [];
        var tempLength = tempArr.length;
        tempData = this.tableBase[tempArr[1] - 1].tableList[tempArr[2] - 1].tableData;
        this.$store.commit('wordLisChange', tempData);
        this.$router.push({ path: '/layout/echartsShow' });
      } else if (str.length < 3) {
        this.$router.push({ path: '/layout/dataChoose' });
      }
    },
    dataHand() {/**手动添加 */
      this.dataHandShow = true;
    },
    dataHandCountChange(val) {/*手动添加数据改变*/
      var difference = Math.abs(this.dynamicValidateForm.domains.length - val);
      if (val <= this.dynamicValidateForm.domains.length) {
        this.dynamicValidateForm.domains.splice(-1 * difference, difference);
      } else {
        for (var i = 0; i < difference; i++) {
          this.addDomain();
        }
      }
    },
    submitForm(formName) {/**提交手动添加的数据*/
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$message({
            message: '添加成功',
            type: 'success'
          });
        } else {
          this.$message({
            message: '添加失败',
            type: 'error'
          });
          return false;
        }
      });
    },
    resetForm(formName) {/**重置手动添加数据*/
      this.$refs[formName].resetFields();
    },
    removeDomain(item) {/**移除某条手动数据 */
      var index = this.dynamicValidateForm.domains.indexOf(item)
      if (index !== -1) {
        this.dynamicValidateForm.domains.splice(index, 1)
      }
    },
    addDomain() {/**添加手动数据 */
      this.dynamicValidateForm.domains.push({
        value: '',
        key: Date.now()
      });
    },
    dataIndustry() {/**展示多维数据 */
      this.$router.push({ path: '/layout/cube' });
      // this.dataIndustryShow = true;
      // this.$axios.get('/static/dataBase.json').then((response) => {
      //   console.log(response.data.series)
      // })
    },
    dialogClose() {/*TODO:提醒保存*/
      this.dataBaseShow = this.dataHandShow = this.dataLocalShow = this.dataIndustryShow = false;
    },
    chooseDataLis(item) {/**数据库数据穿梭框 */
      console.log(item);
    },
    dataLocal() {/**展示本地数据 */
      this.dataLocalShow = true;
    },
    fileChange(file, fileList) {/**提交本地数据操作 */
      if (file.status == "ready") {
        console.log("文件已准备好");
      } else if (file.status == "fail") {
        this.$message.error("文件传输失败,请检查 文件类型 或者 网络状态");
      } else if (file.status == "success") {
        this.$message.success("文件传输成功");
        /**文件传输成功并且后台返回可用信息才在前端本地调用*/
        var fileInner = document.querySelector("#upload-demo .el-upload__input");/**取得输入框标签元素*/
        var files = fileInner.files;
        console.log(files);
        var fileReader = new FileReader();
        if (file.name.match(/.json$/)) {
          console.log("json文件");
          fileReader.onload = function(ev) {
            try {
              var data = ev.target.result,
                workbook = XLSX.read(data, {
                  type: 'binary'
                }), // 以二进制流方式读取得到整份excel表格对象
                persons = []; // 存储获取到的数据
            } catch (e) {
              console.log('文件类型不正确');
              return;
            }
            console.log(data)
            // 表格的表格范围，可用于判断表头是否数量是否正确
            // var fromTo = '';
            // // 遍历每张表读取
            // for (var sheet in workbook.Sheets) {
            //   if (workbook.Sheets.hasOwnProperty(sheet)) {
            //     fromTo = workbook.Sheets[sheet]['!ref'];
            //     console.log(fromTo);
            //     persons = persons.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
            //     // break; // 如果只取第一张表，就取消注释这行
            //   }
            // }
            // console.log(persons);
            console.log(fileReader.result);
          };
        } else if (file.name.match(/.xlsx$/) || file.name.match(/.xls$/)) {
          fileReader.onload = function(ev) {
            try {
              var data = ev.target.result,
                workbook = XLSX.read(data, {
                  type: 'binary'
                }), // 以二进制流方式读取得到整份excel表格对象
                persons = []; // 存储获取到的数据
            } catch (e) {
              console.log('文件类型不正确');
              return;
            }
            // 表格的表格范围，可用于判断表头是否数量是否正确
            var fromTo = '';
            // 遍历每张表读取
            for (var sheet in workbook.Sheets) {
              if (workbook.Sheets.hasOwnProperty(sheet)) {
                fromTo = workbook.Sheets[sheet]['!ref'];
                console.log(fromTo);
                persons = persons.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
                // break; // 如果只取第一张表，就取消注释这行
              }
            }
            // console.log(persons);
          };
          // 以二进制方式打开文件
          fileReader.readAsBinaryString(files[0]);
        }
      }
    },
    dataLocalCancel() {/**取消上传本地数据 */
      this.$refs.uploadDemo.abort();/**取消要以及正在上传的文件*/
      this.$refs.uploadDemo.clearFiles();/**清除文件列表*/
      this.dataLocalShow = false;
    },
    dataLocalsure() {/**确认上传本地数据 */
      this.$refs.uploadDemo.submit();/**上传文件*/
    },
    dataClick() {
      console.log(123);
    },
    handlerSelect(index, path) {
      if (path[0] == 1) {
        /**一按钮跳到数据库设置*/
        this.dataBase(path[path.length - 1]);
      } else if (path[0] == 2) {
        /**二按钮跳到本地上传*/
        this.dataLocal();
      } else if (path[0] == 3) {
        /**三按钮展示立方体*/
        this.dataIndustry();
      }
    },
    handleOpen(index, path) {
      if (path[0] == 1) {
        this.dataBase(path[path.length - 1]);
      }
    },
    handleClose(index, path) {
      if (path[0] == 1) {
        this.dataBase(path[path.length - 1]);
      }
    }
  },
  created() {
    this.$axios.get('/static/dataBase.json').then((response) => {
      // this.tableBase = response.data.series;
      /*这里将所有的数据库保存到state中*/
      this.$store.commit("dataBaseChange", response.data.series);
    });
  },
  mounted() {

  },
  watch: {}
}
</script>
  
<!-- Add 'scoped' attribute to limit CSS to this component only  -->
<style>
/*总*/

#views_div_dataBar {
  width: 150px;
  background-color: #DCDFE6;
}





/*组件头部*/

.dataBar_div_title {
  font-size: 16px;
  font-weight: 700;
  line-height: 40px;
  box-sizing: border-box;
  background-color: #017dd4;
  text-align: center;
}

.upload-demo {
  text-align: center;
}





/*几个按钮*/

#views_div_dataBar .dataMain {
  background-color: #eee;
}

#views_div_dataBar .dataWay {
  width: 100%;
}

#views_div_dataBar .el-input-number .el-input__inner {
  padding-right: 0px;
}

#views_div_dataBar .el-menu-item {
  min-width: 100%;
}
</style>