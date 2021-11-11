<template>
  <div id="app">
    <el-container>
      <el-header style="text-align:center;font-size:30px;height:30px">
        外部规章管理系统
      </el-header>
      <el-divider></el-divider>
      <el-row>
        <el-col :span="8"
                :offset="1">
          <div>
            <i class="el-icon-user"
               style="padding-left=20px"></i>
            <el-button @click="toLogin"
                       style="text-align:left;font-size:15px"
                       type="text">{{userLoginMessage}}</el-button>
          </div>
        </el-col>
        <el-col :span="6"
                :offset="6">
          <div>
            <el-input placeholder="检索"
                      v-model="input"
                      size="small"
                      clearable
                      @keyup.enter.native="search"> </el-input>
          </div>
        </el-col>
      </el-row>

      <el-container style="border:4px solid #eee">
        <el-menu default-active="1"
                 class="el-menu-vertical-demo">
          <router-link to='/main'>
            <el-menu-item index="1">
              <span slot="title">
                <i class="el-icon-document"></i>
                文件目录
              </span>
            </el-menu-item>
          </router-link>
          <router-link to='/content'>
            <el-menu-item index="2">
              <span slot="title">
                <i class="el-icon-menu"></i>
                内容查看
              </span>
            </el-menu-item>
          </router-link>
          <router-link to='/edit'>
            <el-menu-item index="3">
              <span slot="title">
                <i class="el-icon-edit"></i>
                信息编辑
              </span>
            </el-menu-item>
          </router-link>
          <router-link to='/statistics'>
            <el-menu-item index="4">
              <span slot="title">
                <i class="el-icon-s-data"></i>
                统计与可视化
              </span>
            </el-menu-item>
          </router-link>
        </el-menu>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
      <el-footer>
        <div v-if="specificInfoFlag"
             style="font-weight:700;font-size:10px;margin-top:10px">
          文件名称：{{this.specificInfo.title}}&emsp;&emsp;
          文件编号：{{this.specificInfo.number}}&emsp;&emsp;
          文件类别：{{this.specificInfo.type}}&emsp;&emsp;
          发文部门：{{this.specificInfo.publishingDepartment}}&emsp;&emsp;
          解释部门：{{this.specificInfo.interpretationDepartment}}
          <br>
          效力等级：{{this.specificInfo.effectivenessLevel}}&emsp;&emsp;
          发布日期：{{this.specificInfo.releaseDate}}&emsp;&emsp;
          实施日期：{{this.specificInfo.implementationDate}}&emsp;&emsp;
          文件状态：{{this.specificInfo.state}}
        </div>
      </el-footer>
    </el-container>

    <el-drawer title="请登录"
               :visible.sync="loginDrawer"
               size="80%"
               direction="btt"
               @keyup.enter.native="loginConfirm"
               @close="loginConfirm"
               ref="loginDrawer">
      <div>
        <el-row>
          <el-col :span="8"
                  :offset="2"
                  style="font-size:20px">
            账号
            <el-input size="small"
                      v-model="userName"></el-input>
          </el-col>
          <el-col :span="8"
                  :offset="4"
                  style="font-size:20px">
            密码
            <el-input size="small"
                      v-model="userPassword"
                      show-password></el-input>
          </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row>
          <el-col :span="8"
                  :offset="2">
            <el-button @click="innerDrawer = true"
                       type="text">没有账号，进行注册</el-button>
          </el-col>

        </el-row>

        <el-drawer title="注册"
                   :append-to-body="true"
                   :visible.sync="innerDrawer"
                   size="70%"
                   direction="btt"
                   ref="registerDrawer">
          <el-row>
            <el-col :span="8"
                    :offset="2"
                    style="font-size:15px">
              设置账号
              <el-input v-model="setUserName"
                        maxlength="10"
                        show-word-limit></el-input>
            </el-col>
          </el-row>
          <br>
          <el-row>
            <el-col :span="8"
                    :offset="2"
                    style="font-size:15px">
              设置密码
              <el-input v-model="setUserPassword"
                        show-password></el-input>
            </el-col>
          </el-row>
          <br>
          <el-row>
            <el-col :span="8"
                    :offset="2"
                    style="font-size:15px">
              确认密码
              <el-input v-model="confirmPassword"
                        show-password></el-input>
            </el-col>
          </el-row>
          <br>
          <el-row>
            <el-col :span="8"
                    :offset="2"
                    style="font-size:15px">
              您的姓名
              <el-input v-model="name"
                        onkeyup="this.value=this.value.replace(/[, ]/g,'')">
              </el-input>
            </el-col>
          </el-row>
          <br>
          <el-row>
            <el-col :span="8"
                    :offset="2"
                    style="font-size:15px">
              <el-button @click="registerSubmit">创建账号</el-button>
            </el-col>
          </el-row>
        </el-drawer>
      </div>
    </el-drawer>

    <el-drawer title="个人信息"
               :append-to-body="true"
               :visible.sync="infoDrawer"
               size="40%"
               direction="ltr">
      <el-row>
        <el-col :span="8"
                :offset="2"
                style="font-size:15px">
          userInformation
          <br>
          {{userLoginMessage}}
          <br>
          <el-button @click="toLogout">登出</el-button>
        </el-col>
      </el-row>
    </el-drawer>

  </div>

</template>

<script>
import Content from './components/Content';
import { login, register, logout } from '@/request/api';

export default {
  name: 'App',
  data () {
    return {
      userLoginMessage: this.okFlag ? this.userName : '您未登录，点击登录',
      input: '',//search

      userName: '',
      userPassword: '',//登录

      name: '',
      setUserName: '',
      setUserPassword: '',
      confirmPassword: '',

      //注册信息

      infoDrawer: false,//信息页面
      loginDrawer: false,//登录页面
      innerDrawer: false,//注册页面

      closeFlag: false,//Drawer关闭时是否触发
      okFlag: false,//用户放行标签
      specificInfoFlag: false,

      specificInfo: {//此处需要修改根据内容改变消息
        id: 0,
        title: null,
        number: null,
        type: null,
        publishingDepartment: null,
        effectivenessLevel: null,
        releaseDate: null,
        implementationDate: null,
        interpretationDepartment: null,
        inputDate: null,
        state: null
      }
    }
  },
  mounted () {
    window.loginReset = this.loginReset;
    window.onlineCheck = this.onlineCheck;
    window.showSpecificInfo = this.showSpecificInfo;
  },
  destroyed () {
    window.removeEventListener('beforeunload', e => this.beforeunloadHandler(e))
  },
  methods: {
    beforeunloadHandler (e) {
      e = e || window.event
      if (e) {
        e.returnValue = '关闭提示'
      }
      return '关闭提示'
    },

    checkSpecificInfo () {
      if (this.specificInfo.id == 0 || this.specificInfo.id == null) {
        this.specificInfoFlag = false
      }
      this.specificInfoFlag = true
    },

    onlineCheck () {
      if (localStorage.getItem("userOnline") != null) {
        this.userName = localStorage.getItem("userOnline");
        //console.log("OnlineCheck:" + localStorage.getItem("userOnline"));
        this.userLoginMessage = this.userName
        this.okFlag = true;//检查用户是否在localStorage中依然有记录，有就放行，否则删除记录
      }
      else {
        localStorage.removeItem("userOnline");
        this.userLoginMessage = "您未登录，点击登录"
        this.okFlag = false;
      }
    },

    warning () {
      this.$notify({
        title: '警告',
        message: '创建的用户名、密码与您的姓名都不能为空',
        type: 'warning'
      });
    },

    toLogin () {
      console.log("user login");
      if (!this.okFlag) {
        this.loginDrawer = true;
        this.userPassword = "";

        if (localStorage.getItem("userOnline") != null) {
          console.log("还在" + localStorage.getItem("userOnline"))
          this.closeFlag = true;
          this.$refs.loginDrawer.closeDrawer();
          this.closeFlag = false;

          this.userLoginMessage = localStorage.getItem("userOnline");
          this.okFlag = true;
          this.infoDrawer = true;
          return
        }
      }
      else {
        this.infoDrawer = true;
      }
    },

    loginConfirm () {
      if (this.closeFlag) return;//为真就是其他条件触发关闭，不是登录直接返回

      if (this.userName == '' || this.userPassword == '') return;//为空直接返回
      console.log(this.userName + ";" + this.userPassword);



      login({
        username: this.userName,
        password: this.userPassword
      })
        .then((res) => {
          console.log(res.data);

          this.closeFlag = true;
          this.$refs.loginDrawer.closeDrawer();
          this.closeFlag = false;

          this.dataSet();
          console.log(this.userLoginMessage);
        })
        .catch((err) => {
          console.log("登录失败");
          this.userName = ""
          this.userPassword = ""
        })
    },

    registerSubmit () {
      if (this.setUserName == "" || this.setUserPassword == "" || this.name == "") {
        this.warning();
        return;
      }
      if (this.setUserPassword == this.confirmPassword) {
        console.log(this.setUserName + ";" + this.setUserPassword + ";" + this.name);

        register({
          username: this.setUserName,
          password: this.setUserPassword,
          name: this.name,
        })
          .then((res) => {
            this.$message(res.data.content);
            this.userName = this.setUserName;
            this.dataSet();


            this.$refs.registerDrawer.closeDrawer();
            this.closeFlag = true;
            this.$refs.loginDrawer.closeDrawer();
            this.closeFlag = false;


            console.log(this.userLoginMessage);
          })
          .catch((err) => { console.log(err + " register err") });
      };
    },

    toLogout () {
      this.infoDrawer = false
      localStorage.removeItem("userOnline");
      this.userName = ""
      this.userLoginMessage = "您未登录，点击登录"
      this.okFlag = false
      logout()
        .then((res) => {
          console.log(res.data);
          console.log("用户登出")
        })
        .catch((err) => {
          console.log(err)
        })
    },

    //登录后将数据更新
    dataSet () {
      this.setUserName = ""
      this.setUserPassword = ""
      this.confirmPassword = ""
      this.userLoginMessage = this.userName;
      this.userPassword = ""
      localStorage.setItem("userOnline", this.userName);
      console.log("localStorage存储：" + localStorage.getItem("userOnline"));
    },

    //清除用户在线信息
    loginReset () {
      localStorage.removeItem("userOnline");
      this.okFlag = false;
      this.userLoginMessage = '您未登录，点击登录';
      this.userName = "";
      this.toLogin();
    },

    showSpecificInfo (val) {
      this.checkSpecificInfo();
      //console.log(val)
      this.specificInfo.id = val.id;
      this.specificInfo.title = val.title;
      this.specificInfo.number = val.number;
      this.specificInfo.type = val.type;
      this.specificInfo.publishingDepartment = val.publishingDepartment;
      this.specificInfo.effectivenessLevel = val.effectivenessLevel;
      this.specificInfo.releaseDate = val.releaseDate;
      this.specificInfo.implementationDate = val.implementationDate;
      this.specificInfo.interpretationDepartment = val.interpretationDepartment;
      this.specificInfo.inputDate = val.inputDate;
      this.specificInfo.state = val.state
    },

    handleOpen (key) {
      console.log(key);
    },
    search () {
      console.log(this.input);
    },
  },
  components: {
    Content,
  }
}
</script>

<style scoped>
.router-link-active {
  text-decoration: none;
  color: #000;
}
a {
  text-decoration: none;
  color: rgb(37, 34, 34);
}

.el-footer {
  margin: 0%;
  padding: 0%;
  background-color: #f2f6fc;
  color: rgb(0, 204, 255);
  text-align: center;
  line-height: 15px;
  font-size: 5px;
}
</style>

