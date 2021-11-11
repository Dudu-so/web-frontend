<template>
  <div v-if="!this.$store.state.docNowEdit.id">
    <el-empty>
      <el-button type="primary"
                 @click="createNewDoc">新建编辑文件</el-button>
      <el-button type="primary"
                 @click="chooseDoc">添加编辑文件</el-button>
    </el-empty>
  </div>
  <div v-else>
    <el-container>
      <el-header style="height:30px">
        <el-row :gutter="20">
          <el-col :span="4">
            <el-button @click="remove"
                       type="danger"
                       style="width:100%">终止编辑</el-button>
          </el-col>
          <el-col :span="4">
            <el-button @click="editInfo"
                       style="width:100%"
                       :type="editType">编辑属性</el-button>
          </el-col>
          <el-col :span="4">
            <el-upload ref="docUpload"
                       class="upload-demo"
                       :auto-upload="false"
                       action=""
                       accept=".doc"
                       :on-change="updateChange"
                       :file-list="fileList"
                       :show-file-list="false"
                       :limit="1">
              <el-button @click="clearDocForNew"
                         :type="uploadType"
                         style="width:100%">上传文件
              </el-button>
            </el-upload>
          </el-col>

          <el-col :span="4"
                  :offset="8">
            <el-button @click="specialEdit"
                       type="danger">{{specialOption}}</el-button>
          </el-col>
        </el-row>
      </el-header>
      <el-divider style="font-size:5px">{{this.$store.state.docNowEdit.state}}内容</el-divider>
      <el-main>
        //TODO
        <br>
        {{this.$store.state.docNowEdit.title}}
        <br>
        {{fileUrl}}
      </el-main>
      <el-divider>{{this.$store.state.docNowEdit.state}}内容</el-divider>
      <el-footer>
        <el-button type="primary"
                   :disabled="submitFlag"
                   @click="submitDoc">{{submitOption}}</el-button>
        <el-button v-if="issueFlag"
                   @click="issueDocDirectly">快速发布</el-button>
      </el-footer>
    </el-container>

    <el-dialog :visible.sync="dialogFormVisible">
      <el-form ref="editFileInfoForm"
               :model="fileInfo"
               label-width="100px">

        <el-form-item label="文件名称">
          <el-input v-model="fileInfo.title"
                    :placeholder="this.$store.state.docNowEdit.title"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="发文部门">
              <el-input v-model="fileInfo.publishingDepartment"
                        :placeholder="this.$store.state.docNowEdit.publishingDepartment"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="解释部门">
              <el-input v-model="fileInfo.interpretationDepartment"
                        :placeholder="this.$store.state.docNowEdit.interpretationDepartment"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="文件编号">
              <el-input v-model="fileInfo.number"
                        :placeholder="this.$store.state.docNowEdit.number"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="文件类别">
              <el-input v-model="fileInfo.type"
                        :placeholder="this.$store.state.docNowEdit.type"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="发布时间">
              <el-date-picker v-model="fileInfo.releaseDate"
                              :disabled="timeLimit"
                              :placeholder="this.$store.state.docNowEdit.releaseDate"
                              type="datetime"
                              style="width:100%">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实施时间">
              <el-date-picker v-model="fileInfo.implementationDate"
                              :disabled="timeLimit"
                              :placeholder="this.$store.state.docNowEdit.implementationDate"
                              type="datetime"
                              style="width:100%">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="效力等级">
              <el-input v-model="fileInfo.effectivenessLevel"
                        :placeholder="this.$store.state.docNowEdit.effectivenessLevel"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item>
          <el-button type="primary"
                     @click="onSubmit">确认</el-button>
          <el-button @click="cancelSubmit">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import { abolishDocPUBLISHED, deleteDocUNPUBLISHED, issueDocUNPUBLISHED, editDocUNPUBLISHED, createNewDoc } from "../request/api"
import * as mammoth from 'mammoth'

export default {
  name: "Edit",
  data () {
    return {
      fileUrl: "",//文件具体位置
      dialogFormVisible: false,
      specialOption: "弃除草稿",
      submitOption: "提交草稿",
      issueFlag: false,
      submitFlag: false,
      timeLimit: false,//是否可以修改时间

      fileList: [],
      file: null,
      uploadType: "",
      editType: "",
      uploadSuccess: false,

      fileInfo: {
        title: null,
        number: null,
        effectivenessLevel: null,
        interpretationDepartment: null,
        publishingDepartment: null,
        releaseDate: null,
        implementationDate: null,
        type: null,
      }

    }
  },
  mounted () {
    this.checkEdit()
  },
  methods: {
    setNull () {
      this.fileInfo.title = null,
        this.fileInfo.number = null,
        this.fileInfo.type = null,
        this.fileInfo.effectivenessLevel = null,
        this.fileInfo.implementationDate = null,
        this.fileInfo.interpretationDepartment = null,
        this.fileInfo.publishingDepartment = null,
        this.fileInfo.releaseDate = null,

        console.log(this.fileInfo)
    },

    createNewDoc () {
      window.onlineCheck();
      this.$store.commit("updateDocEdit", {
        effectivenessLevel: null,
        id: -1,//-1代表新文件，文件具体编号由后端确认或者操作者重新填写
        implementationDate: null,
        inputDate: null,
        interpretationDepartment: null,
        number: null,
        publishingDepartment: null,
        releaseDate: null,
        state: "草稿",
        textPath: null,
        title: null,
        type: null,
      })
    },

    chooseDoc () {
      this.$router.push({ path: '/main' });
    },

    checkEdit () {//已发布的文件废止处理，废止文件删除处理，草稿直接删除
      this.issueFlag = false
      this.submitFlag = false

      if (this.$store.state.docNowEdit.id == -1) {
        this.specialOption = "弃除草稿"
        this.submitOption = "提交草稿"
      } else {
        if (this.$store.state.docNowEdit.id) {
          this.fileInfo.id = this.$store.state.docNowEdit.id
          this.fileUrl = this.$store.state.docNowEdit.textPath;
          window.showSpecificInfo(this.$store.state.docNowEdit)
          if (this.$store.state.docNowEdit.state == "已发布") {
            this.specialOption = "废止文件"
            this.submitOption = "文件实施   禁止修改"
            this.submitFlag = true
          } else if (this.$store.state.docNowEdit.state == "未发布") {
            this.specialOption = "删除文件"
            this.submitOption = "提交修改"
            this.issueFlag = true
          }
        }
      }

    },

    submitDoc () {
      //创建以及修改文件
      let fm = new FormData();
      if (this.file) {
        fm.append("file", this.file.raw)
      } else {
        fm.append("file", null);
      };

      if (this.fileInfo.releaseDate) this.fileInfo.releaseDate = this.changeTimeSet(this.fileInfo.releaseDate)
      if (this.fileInfo.implementationDate) this.fileInfo.implementationDate = this.changeTimeSet(this.fileInfo.implementationDate)
      fm.append("info", JSON.stringify(this.fileInfo));

      console.log(JSON.stringify(this.fileInfo))

      if (this.submitOption == "提交草稿") {
        this.toCreateNewDoc(fm);
      } else if (this.submitOption == "提交修改") {
        this.toEditDoc(fm);
      }
    },

    toCreateNewDoc (fm) {
      createNewDoc(fm).then((res) => {
        this.$store.commit("updateDocEdit", {});
        this.$router.push({ path: '/main' });
      }).catch((err) => console.log(err))
    },

    toEditDoc (fm) {
      editDocUNPUBLISHED(fm).then((res) => {
        this.$store.commit("updateDocEdit", {});
        this.$router.push({ path: '/main' });
      }).catch((err) => console.log(err))
    },

    issueDocDirectly () {
      let fm = new FormData();
      fm.append("id", this.$store.state.docNowEdit.id);

      issueDocUNPUBLISHED(fm).then((res) => {
        console.log("文件已发布")

        this.$store.commit("updateDocEdit", {});
        this.$router.push({ path: '/main' });
      }).catch((err) => console.log(err))
    },

    remove () {
      this.$store.commit("updateDocEdit", {});
      this.file = null
      this.fileList = []
      this.fileUrl = ""
      this.setNull();
    },

    clearDocForNew () {
      this.$refs['docUpload'].clearFiles();
    },

    updateChange (file, fileList) {
      this.file = file
      this.fileList = fileList;
      this.uploadType = "success";
      this.uploadSuccess = true;
    },

    editInfo () {
      this.dialogFormVisible = true;
    },

    onSubmit () {
      console.log(this.fileInfo);
      this.dialogFormVisible = false;
      this.editType = "success"
    },

    cancelSubmit () {
      this.dialogFormVisible = false;
    },

    specialEdit () {
      let fm = new FormData();
      fm.append("id", this.$store.state.docNowEdit.id);

      if (this.specialOption == "弃除草稿") {
        console.log("草稿已弃除")
        this.$store.commit("updateDocEdit", {});
      } else if (this.specialOption == "删除文件") {
        deleteDocUNPUBLISHED(fm).then((res) => {
          console.log("文件已删除")
          console.log(fm)

          this.$store.commit("updateDocEdit", {});
          this.$router.push({ path: '/main' });
        }).catch((err) => { console.log(err) })
      } else if (this.specialOption == "废止文件") {
        abolishDocPUBLISHED(fm).then((res) => {
          console.log("文件已废止")

          this.$store.commit("updateDocEdit", {});
          this.$router.push({ path: '/main' });
        }).catch((err) => { console.log(err) })
      }
    },

    readFile (file) {
      const reader = new FileReader()
      reader.readAsArrayBuffer(file)

      reader.onload = e => {
        const data = reader.result
        mammoth.extractRawText({ arrayBuffer: data }).then(r => {
          console.log(r.value)

        })
      }
    },

    changeTimeSet (dateStr) {
      let d = new Date(dateStr);
      var year = d.getFullYear();
      var month = d.getMonth() <= 9 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1);
      var day = d.getDate() <= 9 ? "0" + d.getDate() : '' + d.getDate();
      var h = d.getHours() <= 9 ? "0" + d.getHours() : '' + d.getHours();
      var min = d.getMinutes() <= 9 ? "0" + d.getMinutes() : '' + d.getMinutes();
      var sec = d.getSeconds() <= 9 ? "0" + d.getSeconds() : '' + d.getSeconds();
      return year + '-' + month + '-' + day + ' ' + h + ':' + min + ':' + sec;
    },
  }
}
</script>

<style scoped>
</style>