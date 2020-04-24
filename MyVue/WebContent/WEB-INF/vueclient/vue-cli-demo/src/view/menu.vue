<template>
  <div>
    <h3>菜单首页</h3>
<el-menu
  :default-active="activeIndex"
  class="el-menu-demo"
  mode="horizontal"
  @select="handleSelect"
  background-color="#409EFF"
  text-color="#fff"
  active-text-color="#ffd04b">
  <el-menu-item index="1">用户列表</el-menu-item>
  <el-submenu index="2">
    <template slot="title">我的家园</template>
    <el-menu-item index="2-1"  :span="12">MyHome</el-menu-item>
    <el-menu-item index="2-2"  :span="12">个人中心</el-menu-item>
    <el-submenu index="2-3">
      <template slot="title">敬请期待...</template>
      <el-menu-item index="2-3-1">期待1.</el-menu-item>
      <el-menu-item index="2-3-2">期待2.</el-menu-item>
    </el-submenu>
  </el-submenu>
  <el-submenu  index="3">
    <template slot="title">账单管理</template>
    <el-menu-item index="3-1"  :span="12">账单主页</el-menu-item>
    <el-menu-item index="3-2"  :span="12">账单流图</el-menu-item>
  </el-submenu >
  <el-menu-item index="4">账单趋势</el-menu-item>
  <el-menu-item index="5" disabled>暂不开放</el-menu-item>
  <el-submenu index="6">
    <template slot="title">帮助中心</template>
      <el-menu-item index="6-1"><a href="https://element.eleme.cn/#/zh-CN/component/installation" target="_blank">element文档</a></el-menu-item>
      <el-menu-item index="6-2"><a href="http://10.10.4.175/#/demo/d2-crud/index" target="_blank">D2-crud文档</a></el-menu-item>
  </el-submenu>
  <el-submenu index="7" style="float: right">
    <template slot="title">你好：{{userName}}</template>
   <!-- <el-menu-item index="7-1" class="myUser">注销用户</el-menu-item>-->
    <el-menu-item index="7-2" class="myUser" v-on:click="reset">切换用户</el-menu-item>
  </el-submenu>
</el-menu>
    <table-date v-show="isData"></table-date>
    <china-map v-if="isMap"></china-map>
   <!-- <my-home v-if="isHome"></my-home>-->
    <note-index v-show="isNote" :userName="userName"></note-index>
    <user-info :userId="userid" v-if="isInfo"></user-info>
    <photo-info v-if="isPhoto"></photo-info>
  </div>

</template>
<script>
import TableDate from '@/view/TableData'
import MyHome from '@/components/MyHome'
import NoteIndex from '@/view/note/index'
import UserInfo from '@/view/note/userInfo'
import PhotoInfo from '@/view/note/photoInfo'
// import ChinaMap from '@/view/ChinaMap/map'
export default {
  name: 'myMenu',
  components: {
    TableDate,
    MyHome,
    NoteIndex,
    // ChinaMap,
    UserInfo,
    PhotoInfo
  },
  data() {
    return {
      isData:false,
      isHome:false,
      isNote:false,
      isMap:false,
      isInfo:false,
      isPhoto:false,
      userid:'',
      userName:'',
      activeIndex: '1',
      user:this.$root.USER
    };
  },
  methods: {
    handleSelect(key, keyPath) {
     if(key=="1"){
       this.isData=true;
     }else{
       this.isData=false;
     }
      if(key=='2-1'){
        this.isMap=true;
      }else{
        this.isMap=false;
      }
      if(key=='2-2'){
        this.isInfo=true;
      }else{
        this.isInfo=false;
      }
      if(key=='3-1'){
        this.isNote=true;
      }else{
        this.isNote=false;
      }
      if(key=='3-2'){
        this.isPhoto=true;
      }else{
        this.isPhoto=false;
      }
    },
    reset(){
      const USER=JSON.parse(sessionStorage.getItem('user'));
      if(USER){
        this.$root.USER =USER;
        sessionStorage.removeItem("user");
        this.$router.push(
          {
            name: 'Login', params: {}
          })
      }else{
        this.$message.error({message: '未登录', center: true})
      }
    }
  },
  mounted(){
    this.handleSelect(1,1);
    const USER=JSON.parse(sessionStorage.getItem('user'));
    if(USER){
      this.$root.USER =USER;
    }
    if (this.$root.USER.id) {
      this.user = this.$root.USER;
      this.userid=this.$root.USER.id+'';
      this.userName=this.$root.USER.name;
    }else{
      this.$message.error({message: '获取不到用户信息，请重新登录', center: true})
      this.$router.push(
        {
          name: 'Login', params: {}
        })
    }
  }
}
</script>

<style scoped>

  .el-menu-demo{

  }
  .myUser{
    /*display: inline-block;*/
    font-size: 12px;
    width: 5em;
  }
</style>
