
<template>
  <div v-if="!this.$store.state.docNowOpen.id">
    <el-empty>
      <el-button type="primary"
                 @click="chooseDoc">添加预览文件</el-button>
    </el-empty>
  </div>
  <div v-else>
    <el-container>
      <el-header style="height:25px">
        <el-row>
          <el-col :span="24">
            <el-button type="primary"
                       @click="openToEdit">
              编辑该文件</el-button>

            <el-button type="primary"
                       @click="downloadOpenDoc">
              下载该文件</el-button>
          </el-col>
        </el-row>
      </el-header>
      <el-divider></el-divider>
      <el-main>
        查看文件： {{this.$store.state.docNowOpen.title}}
      </el-main>
    </el-container>

  </div>
</template>

<script>
import { docDownLoadByID } from '@/request/api'
import * as mammoth from 'mammoth'

export default {
  name: "Content",
  data () {
    return {
      fileUrl: ""
    }
  },
  mounted () {
    this.checkOpen()
  },
  methods: {

    docOpen (doc) {
      //console.log("OpenID:" + doc.id);
      this.fileUrl = doc.textPath;
      //console.log(this.fileUrl)
    },

    chooseDoc () {
      this.$router.push({ path: '/main' });
    },

    openToEdit () {
      //优先查看是否有文件正在编辑
      if (this.$store.state.docNowEdit.id) {
        //有文件则先确定文件是否是正在观看的文件 
        if (this.$store.state.docNowOpen.id == this.$store.state.docNowEdit.id) {
          this.$router.push({ path: '/edit' });
        }//如果正好在编辑，直接打开
        else {
          this.$message("有其他文件处于编辑中");
        }//让操作者知道由文件在编辑中，是否顶替
      } else {
        //没文件就直接打开编辑界面
        this.$store.commit("updateDocEdit", this.$store.state.docNowOpen);
        this.$router.push({ path: '/edit' });
      }
    },

    checkOpen () {
      if (this.$store.state.docNowOpen.id) {
        window.showSpecificInfo(this.$store.state.docNowOpen)
        this.docOpen(this.$store.state.docNowOpen);
      }
    },

    downloadOpenDoc () {
      docDownLoadByID({ id: this.$store.state.docNowOpen.id }).then((res) => {
        console.log("Doc Download");
        console.log(res)

        var a = document.createElement('a');
        a.href = "http://localhost:8080/externalRegulation//downloadFile?id=" + this.$store.state.docNowOpen.id;

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }).catch((err) => {
        console.log("err==>", err);
      });
    }
  },
  components: {

  },
}
</script>

<style scoped>
</style>

