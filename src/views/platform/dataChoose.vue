<template>
  <div id="datachoose">
    <el-tabs v-model="activeName">
      <el-tab-pane label="数据库链接" name="first">
        <!--已有数据库连接展示-->
        <!--<el-button class="el-icon-arrow-left dataBack" @click="dataBack">返 回</el-button>-->
        <el-button class="el-icon-plus dataBaseAdd" @click="dataBaseAdd">新 增</el-button>
        <el-table :data="dataBase" style="width: 60%">
          <el-table-column prop="dataBase" label="数据库" width="180">
          </el-table-column>
          <el-table-column prop="ip" label="ip" width="180">
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <el-button @click="dataBaseLook(scope.row)" type="text" size="small">查看</el-button>
              <el-button @click="dataBaseEdit(scope.row)" type="text" size="small">编辑</el-button>
              <el-button @click="dataBaseDel(scope.row)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <!--<el-tab-pane label="连接管理" name="second">
                      </el-tab-pane>-->
    </el-tabs>

    <!--编辑数据库数据-->
    <el-dialog class="dataBar_dialog" title="新增数据库连接" :visible.sync="dataBarShow" :before-close="handleClose">
      <el-form label-width="200px" :model="formLabelAlign" class="dataSetoption">
        <el-form-item label="数据库名称">
          <el-input v-model="formLabelAlign.dataBase"></el-input>
        </el-form-item>
        <el-form-item label="IP">
          <el-input v-model="formLabelAlign.ip"></el-input>
        </el-form-item>
        <el-form-item label="端口">
          <el-input v-model="formLabelAlign.port"></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="formLabelAlign.username"></el-input>
        </el-form-item>
        <el-form-item label="用户密码">
          <el-input v-model="formLabelAlign.pass"></el-input>
        </el-form-item>
        <el-form-item label="Persist Security Info">
          <!--<el-input v-model="formLabelAlign.date"></el-input>-->
          <el-switch v-model="formLabelAlign.date" active-color="#13ce66" inactive-color="#ff4949" active-value="100" inactive-value="0">
          </el-switch>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="connectTest">连接测试</el-button>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dataBarSure">确 定</el-button>
        <el-button @click="dataBarShow = false">取 消</el-button>
      </span>
    </el-dialog>

    <!--数据库查看表-->
    <el-dialog class="word_dialog" :title="tempDataBar.name" :visible.sync="tableShow" :before-close="handleClose">
      <ul>
        <li class="wordTitle">
          <p>表名</p>
          <!--<p>id</p>-->
          <p>操作</p>
        </li>
        <li v-for="(item,index) in tempDataBar.data" :key="item.id">
          <p v-text="item.alias||item.tableName"></p>
          <!--<p v-text="item.dataid"></p>-->
          <p>
            <el-button @click="tableEdit(item)" type="text" size="small">编辑</el-button>
            <el-button @click="tableDel(item)" type="text" size="small">删除</el-button>
          </p>
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="tableSure">确 定</el-button>
        <el-button @click="tableShow = false">取 消</el-button>
      </span>
    </el-dialog>

    <!--表编辑-->
    <el-dialog class="word_dialog" :title="tempDataBar.name+' -- '+tempTable.name" :visible.sync="tableEditShow" :before-close="handleClose">
      <ul>
        <li class="wordTitle">
          <p>属性</p>
          <p>属性值</p>
        </li>
        <li v-for="(item,key) in tempTable.data" :key="key">
          <div v-if="key == 'alias'">
            <p v-text="'表别名'"></p>
            <p>
              <el-input v-model="tempTable.data[key]" placeholder="请输入别名"></el-input>
            </p>
          </div>
          <div v-else-if="key == 'tableData'">
            <p v-text="key"></p>
            <p>
              <el-button @click="dataEdit(item)" type="text" size="small">编辑</el-button>
            </p>
            <!--<el-input type="textarea" v-text="item" :rows="1">
                          </el-input>-->
          </div>
          <div v-else>
            <p v-text="key"></p>
            <p v-text="item"></p>
          </div>
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="tableEditSure">确 定</el-button>
        <el-button @click="tableEditShow = false">取 消</el-button>
      </span>
    </el-dialog>
    <!--字段-->
    <el-dialog class="word_dialog" :title="tempDataBar.name+' -- '+tempTable.name" :visible.sync="dataShow" :before-close="handleClose">
      <ul>
        <li class="wordTitle">
          <p>字段</p>
          <p>字段别名</p>
          <p>数据</p>
        </li>
        <li v-for="(item,key) in tempWord.data" :key="key">
          <p v-text="item.title"></p>
          <p>
            <el-input v-model="item.alias" placeholder="请输入别名"></el-input>
          </p>
          <p>
            <el-input type="textarea" v-text="item.data" :rows="1"></el-input>
          </p>
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dataSure">确 定</el-button>
        <el-button @click="dataShow = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
  
<script>
export default {
  components: {
  },
  data() {
    return {
      formLabelAlign: {/*数据库*/
        name: "",
        date: "",
        port: "",
        ip: "",
        username: "",
        pass: ""
      },
      activeName: "first",
      chooseList: [],
      tempDataBar: {
        name: "",
        data: []
      },
      tempTable: {
        name: "",
        data: []
      },
      tempWord: {
        name: "",
        data: []
      },
      dataBarShow: false,/*数据库表展示*/
      tableShow: false,/**表展示*/
      tableEditShow: false,/*字段展示*/
      dataShow: false,/*字段编辑展示*/
    }
  },
  props: {},
  computed: {
    dataBase() {
      return this.$store.state.dataBase;
    }
  },
  methods: {
    /*
    *table:数据库表
    *word:字段列表
    *data:字段数据
    */
    dataBaseLook(row) {/*查看数据库下的字段*/
      // this.$axios.get('/static/dataBase_' + row.id + '.json').then((response) => {
      // this.tempDataBar.data = response.data.series;
      this.tempDataBar.data = row.tableList;
      this.tempDataBar.name = row.alias || row.dataBase;
      this.tableShow = true;
      // })
    },
    dataBaseAdd() {/*数据库新增连接*/
      this.dataBarShow = true;/*显示*/
      this.formLabelAlign = {
        name: "",
        date: "",
        port: "",
        ip: "",
        username: "",
        pass: ""
      };
    },
    dataBarSure() {/*数据库新增与编辑保存时公用事件*/
      if (this.formLabelAlign.id) {

      } else {
        /*审核通过保存*/
        this.formLabelAlign.id = this.randomNumber(4);
        this.dataBase.push(this.formLabelAlign);
      }
      this.dataBarShow = false;/*隐藏*/
    },
    dataBaseEdit(row) {/*数据库属性编辑*/
      this.dataBarShow = true;/*显示*/
      for (let i = 0; i < this.dataBase.length; i++) {
        if (this.dataBase[i].id == row.id) {
          this.$nextTick(() => {
            this.formLabelAlign = this.dataBase[i];
            // this.formLabelAlign.name = this.dataBase[i].name;
            // this.formLabelAlign.date = this.dataBase[i].date;
            // this.formLabelAlign.port = this.randomNumber(4);
            // this.formLabelAlign.ip = "1" + this.randomNumber(2) + "." + this.randomNumber(3) + "." + this.randomNumber(3) + "." + this.randomNumber(3);
            // this.formLabelAlign.id = this.dataBase[i].id;
            // this.formLabelAlign.pass = this.dataBase[i].pass;
          })
          break;
        }
      }
    },
    dataBaseDel(row) {/**数据库删除 */
      for (let i = 0; i < this.dataBase.length; i++) {
        if (this.dataBase[i].id == row.id) {
          this.$confirm('此操作将永久删除 " ' + row.dataBase + ' " 连接, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.dataBase.splice(i, 1);
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
          break;
        }
      }
    },
    tableEdit(item) {/**表编辑 */
      this.tableEditShow = true;
      this.tempTable.data = item;
      this.tempTable.name = item.alias || item.tableName;
    },
    tableSure() {
      this.tableShow = false;
    },
    tableDel(item) {/**表删除*/
      for (let i = 0; i < this.tempDataBar.data.length; i++) {
        var element = this.tempDataBar.data[i];
        if (item.tableName == element.tableName) {
          this.$confirm('此操作将永久删除 " ' + (item.alias || item.tableName) + ' " 连接, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.tempDataBar.data.splice(i, 1);
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
          break;
        }
      }
    },
    tableEditSure() {/**表编辑保存 */
      this.tableEditShow = false;
    },
    dataSure() {/**字段编辑保存 */
      this.dataShow = false
    },
    dataEdit(item) {
      this.dataShow = true;
      console.log(item);
      this.tempWord.data = item;
    },
    handleClose() {
      /**由小到大*/
      if (this.dataShow) {
        this.dataShow = false;
      } else if (this.tableEditShow) {
        this.tableEditShow = false;
      } else if (this.tableShow) {
        this.tableShow = false;
      } else if (this.dataBarShow) {
        this.dataBarShow = false;
      }
    },
    randomNumber(n) {
      var str = "";
      for (var i = 0; i < n; i++) {
        str += "0123456789".substr(Math.floor(Math.random() * 10), 1);
      }
      return str
    },
    // dataBack() {
    //   this.$router.push({ path: '/layout' });
    // },
    connectTest() {
      if (this.formLabelAlign.username == "Dyiaw" && this.formLabelAlign.pass == 123) {
        this.$message.success("连接成功");
      } else {
        this.$message.error("连接失败");
      }
    }
  },
  created() {
  },
  mounted() {
  },
  watch: {
    dataBase(val) {
      console.log(val);
      // this.$store.commit("dataBaseChange",val);
    }
  }
}
</script>
  
<style>
#datachoose {
  width: 100%;
  height: 100%;
}

#datachoose .dataBack {
  margin-left: 5%;
  margin-top: 20px;
}

#datachoose .dataSetoption {
  width: 50%;
  margin-left: 5%;
}

.dataBaseAdd {
  margin: 0 20px 10px;
}

.word_dialog ul,
.word_dialog li,
.word_dialog p {
  list-style: none;
  margin: 0;
  padding: 0;
}

.word_dialog ul {
  border: 1px solid #999;
}

.word_dialog li {
  display: flex;
}

.word_dialog li div {
  width: 100%;
  height: 100%;
  display: flex;
}

.word_dialog .el-textarea {
  flex: 1;
}

.word_dialog .el-input__inner {
  text-align: center;
}

.word_dialog p {
  flex: 1;
  text-align: center;
  line-height: 35px;
  height: 35px;
  border-bottom: 1px solid #ccc;
  border-right: 1px solid #ccc;
  overflow: hidden;
}

.word_dialog .wordTitle p {
  font-size: 16px;
  font-weight: 700;
  border-bottom: 1px solid #999;
  border-right: 1px solid #999;
}

.el-tabs__content {}

.el-tab-pane {}
</style>