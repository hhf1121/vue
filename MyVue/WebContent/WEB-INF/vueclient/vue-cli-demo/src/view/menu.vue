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
    <el-menu-item index="2-1" >MyHome</el-menu-item>
    <el-menu-item index="2-2">个人中心</el-menu-item>
    <el-submenu index="2-3">
      <template slot="title">敬请期待...</template>
      <el-menu-item index="2-3-1">期待1.</el-menu-item>
      <el-menu-item index="2-3-2">期待2.</el-menu-item>
    </el-submenu>
  </el-submenu>
  <el-menu-item index="3">账单管理</el-menu-item>
  <el-menu-item index="4">账单趋势</el-menu-item>
  <el-menu-item index="5" disabled>暂不开放</el-menu-item>
  <el-menu-item index="6"><a href="https://element.eleme.cn/#/zh-CN/component/installation" target="_blank">帮助中心</a></el-menu-item>
  <el-submenu index="7" style="float: right">
    <template slot="title">当前登录人</template>
    <el-menu-item index="7-1" class="myUser">注销用户</el-menu-item>
    <el-menu-item index="7-2" class="myUser">切换用户</el-menu-item>
  </el-submenu>
</el-menu>
    <table-date v-if="isData"></table-date>
    <my-home v-if="isHome"></my-home>
    <note-index v-if="isNote"></note-index>
  </div>

</template>
<script>
import TableDate from '@/view/TableData'
import MyHome from '@/components/MyHome'
import NoteIndex from '@/view/note/index'
export default {
  name: 'myMenu',
  components: {
    TableDate,
    MyHome,
    NoteIndex
  },
  data() {
    return {
      isData:false,
      isHome:false,
      isNote:false,
      activeIndex: '1'
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
        this.isHome=true;
      }else{
        this.isHome=false;
      }
      if(key=='3'){
        this.isNote=true;
      }else{
        this.isNote=false;
      }
    }
  },
  mounted(){
    this.handleSelect(1,1);
  }
}
</script>

<style scoped>
.el-menu-demo{

}
  .myUser{
    display: inline-block;
    font-size: 12px;
    width: 5em;
  }
</style>
