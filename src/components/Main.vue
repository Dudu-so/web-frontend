 <template>
  <div>
    <el-container style="magin:0px;padding:0px">
      <el-table :data="tableData"
                ref="docTable"
                highlight-current-row
                style="width: 100%"
                @row-click="docSelected">
        <el-table-column prop="number"
                         label="文件编号"
                         width="110">
        </el-table-column>
        <el-table-column prop="releaseDate"
                         label="发布日期"
                         width="110">
        </el-table-column>
        <el-table-column prop="implementationDate"
                         label="实施日期"
                         width="110">
        </el-table-column>
        <el-table-column :prop="userNameSet"
                         label="发布人员"
                         width="110">
        </el-table-column>
        <el-table-column prop="title"
                         label="文件名称"
                         width="110">
        </el-table-column>
        <el-table-column prop="state"
                         label="文件状态"
                         width="110">
        </el-table-column>
        <el-table-column prop="publishingDepartment"
                         label="发文部门"
                         width="110">
        </el-table-column>
        <el-table-column prop="interpretationDepartment"
                         label="解释部门"
                         width="110">
        </el-table-column>
        <el-table-column prop="type"
                         label="文件类别"
                         width="110">
        </el-table-column>
        <el-table-column fixed="right"
                         align="right"
                         width="110">
          <template slot="header">
            <div>
              <el-button @click="docSearch">文件查询</el-button>
            </div>
          </template>
          <template slot-scope="scope">
            <el-button @click="handleDownLoad(scope.row)"
                       type="text">下载</el-button>
            <el-button @click="handleEdit(scope.row)"
                       type="text">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-container>

    <el-row type="flex"
            class="row-bg"
            justify="center"
            style="margin-top:10px">
      <el-col :span="2">
        <el-button @click="getDocTable"
                   style="text-align:left;font-size:15px"
                   type="text">更新文件</el-button>
      </el-col>
      <el-col :span="14">
        <el-pagination layout="prev, pager, next, jumper"
                       :total="total"
                       style="text-align:center"
                       @current-change="currentChange"
                       :current-page.sync="page"
                       :page-size="size">
        </el-pagination>
      </el-col>
      <el-col :span="6"
              style="font-size:10px">
        <el-input-number v-model="size"
                         controls-position="right"
                         @change="sizeChange"
                         style="width:75px;"
                         size="mini"
                         :min="1"></el-input-number>
        条/每页
      </el-col>
    </el-row>

    <el-dialog :visible.sync="dialogFormVisible">
      <el-form ref="searchForm"
               :model="form"
               label-width="100px">

        <el-form-item label="文件名称">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="发文部门">
          <el-input v-model="form.publishingDepartment"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="11">
            <el-form-item label="文件编号">
              <el-input v-model="form.number"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="效力等级">
              <el-input v-model="form.effectivenessLevel"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="发布时间">
          <el-col :span="10">
            <el-date-picker v-model="form.fromReleaseDate"
                            type="datetime"
                            placeholder="起始"
                            style="width:100%">
            </el-date-picker>
          </el-col>
          <el-col :span="10"
                  :offset="1">
            <el-date-picker v-model="form.toReleaseDate"
                            type="datetime"
                            placeholder="截止"
                            style="width:100%">
            </el-date-picker>
          </el-col>
        </el-form-item>

        <el-form-item label="实施时间">
          <el-col :span="10">
            <el-date-picker v-model="form.fromImplementationDate"
                            type="datetime"
                            placeholder="起始"
                            style="width:100%">
            </el-date-picker>
          </el-col>
          <el-col :span="10"
                  :offset="1">
            <el-date-picker v-model="form.toImplementationDate"
                            type="datetime"
                            placeholder="截止"
                            style="width:100%">
            </el-date-picker>
          </el-col>
        </el-form-item>

        <el-form-item label="文件状态">
          <el-input v-model="form.state"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click="onSubmitSearch">查找</el-button>
          <el-button @click="cancelSubmit">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>



<script>
import { getDocTable, searchRequest, docDownLoadByID } from "@/request/api"

export default {
  name: "Main",
  data () {
    return {
      dialogFormVisible: false,
      userNameSet: "user.name",

      form: {
        title: null,

        number: null,

        publishingDepartment: null,

        effectivenessLevel: null,

        fromReleaseDate: null,

        toReleaseDate: null,

        fromImplementationDate: null,

        toImplementationDate: null,

        state: null,

        // begin: "",

        // len: "",

      },
      loading: true,
      //axios请求至allData
      tableData: null,
      allData: null,
      total: 0,//总条目数量

      page: 1,
      size: 8,

      currentRowID: -1,
    }
  },
  mounted () {
    this.getDocTable();
  },
  methods: {
    docSearch () {
      this.dialogFormVisible = true;
    },

    cancelSubmit () {
      this.dialogFormVisible = false;
    },

    onSubmitSearch () {
      //文件查询
      const params = this.form;
      if (params.fromReleaseDate) params.fromReleaseDate = this.changeTimeSet(params.fromReleaseDate)
      if (params.toReleaseDate) params.toReleaseDate = this.changeTimeSet(params.toReleaseDate)
      if (params.fromImplementationDate) params.fromImplementationDate = this.changeTimeSet(params.fromImplementationDate)
      if (params.toImplementationDate) params.toImplementationDate = this.changeTimeSet(params.toImplementationDate)
      console.log(params)
      searchRequest(params)
        .then((res) => {
          console.log(res)
          this.allData = res.data.content;
          this.total = res.data.content.length;
          this.userNameSet = "inputPersonName";
          if (this.allData) {
            for (let i = 0; i < this.total; i++) {
              this.allData[i].releaseDate = this.fun(res.data.content[i].releaseDate);
              this.allData[i].implementationDate = this.fun(res.data.content[i].implementationDate);

              if (this.allData[i].state == "PUBLISHED") {
                this.allData[i].state = "已发布"
              } else {
                this.allData[i].state = "未发布"
              }
            }
          }
          this.getTableData()
        })
        .catch((err) => { console.log("err==>", err); })

      this.dialogFormVisible = false;
    },

    changeTimeSet (dateStr) {
      let d = new Date(dateStr);
      var year = d.getFullYear();
      var month = d.getMonth() < 9 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1);
      var day = d.getDate() < 9 ? "0" + d.getDate() : '' + d.getDate();
      var h = d.getHours() < 9 ? "0" + d.getHours() : '' + d.getHours();
      var min = d.getMinutes() < 9 ? "0" + d.getMinutes() : '' + d.getMinutes();
      var sec = d.getSeconds() < 9 ? "0" + d.getSeconds() : '' + d.getSeconds();
      return year + '-' + month + '-' + day + ' ' + h + ':' + min + ':' + sec;
    },


    fun (dateStr) {
      let date = new Date(dateStr.replace(/-/g, '/'));
      let str = "";
      str += date.getFullYear() + "-";
      str += (date.getMonth() + 1) + "-";
      str += date.getDate();
      return str;
    },


    getTableData () {
      this.tableData = this.allData.slice(
        (this.page - 1) * this.size,
        this.page * this.size
      );
      this.total = this.allData.length
    },

    currentChange (val) {
      //console.log("当前页数变更", val);
      this.page = val;
      this.getTableData();
    },

    sizeChange (val) {
      //console.log("页条目数变更", val);
      this.size = val;
      this.page = 1;
      this.getTableData();
    },

    getDocTable () {
      getDocTable({ begin: null, len: null }).then((res) => {
        //文件获取
        console.log(res)
        this.allData = res.data.content;
        this.total = res.data.content.length;
        this.userNameSet = "user.name";
        for (let i = 0; i < this.total; i++) {
          this.allData[i].releaseDate = this.fun(res.data.content[i].releaseDate);//时间统一化
          this.allData[i].implementationDate = this.fun(res.data.content[i].implementationDate);

          if (this.allData[i].state == "PUBLISHED") {
            this.allData[i].state = "已发布"
          } else {
            this.allData[i].state = "未发布"
          }
        }
        this.getTableData()
      }).catch((err) => {
        console.log("err==>", err);
      });
    },

    docSelected (row, event, column) {
      window.showSpecificInfo({});
      if (row.id == this.currentRowID) {
        this.currentRowID = row.id;
        this.docOpenCommand(row);
      } else {
        this.currentRowID = row.id;
        //console.log("Highlight:" + row.id);
        window.showSpecificInfo(row);
      }
    },

    docOpenCommand (val) {
      this.$store.commit("updateDocOpen", val);
      //console.log("Open：" + this.$store.state.docNowOpen.id);
      this.$router.push({ path: '/content' });
    },

    handleEdit (val) {
      this.$store.commit("updateDocEdit", val);
      //console.log("Edit：" + this.$store.state.docNowEdit.id);
      this.$router.push({ path: '/edit' });
    },

    handleDownLoad (val) {
      docDownLoadByID({ id: val.id }).then((res) => {
        console.log("Doc Download");
        console.log(res)

        var a = document.createElement('a');
        a.href = "http://localhost:8080/externalRegulation//downloadFile?id=" + val.id;

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        this.getDoc();
      }).catch((err) => {
        console.log("err==>", err);
      });
    }
  }
}
</script>

<style scoped>
</style>