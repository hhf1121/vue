<template>
  <div style="">
    <div style="">
      <Weather style="position:absolute;top: 0px;right: 10px"></Weather>
      <el-row style="color: dodgerblue;position:absolute;top:10px;right:150px;">
        {{ defaultDate|formatDate}}
      </el-row>
      <Clock style="position:absolute;top: 0px;left: 10px;height: 126px;width: 126px;"></Clock>
      <br>
      <h3 style="position:absolute;width:100%;top:0px;color: #8cc5ff;font-family: '宋体';font-size: 26px">系统首页</h3>
      <el-row >
        <el-col >
          <el-autocomplete
            clearable
            style="position:absolute;right:36%;width: 188px"
            class="inline-input"
            v-model="siteUser"
            :fetch-suggestions="querySearch"
            placeholder="搜索网站会员"
            :trigger-on-focus="false"
            @select="selectSiteUser"
            @input="isChange"
          ></el-autocomplete>
          <el-button type="success" class="el-icon-chat-dot-square" @click="sendMsg" style="position:absolute;right:32%;width:68px;font-size: 12px" v-if="addOrUpdateVisible">聊天</el-button>
        </el-col>
      </el-row>
    </div>
    <div style="margin-top: 60px;">
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
          <el-menu-item index="2-1"  :span="12">实时疫情</el-menu-item>
          <el-submenu index="2-3">
            <template slot="title">敬请期待...</template>
            <el-menu-item index="2-3-1">期待1.</el-menu-item>
            <el-menu-item index="2-3-2">期待2.</el-menu-item>
          </el-submenu>
        </el-submenu>
        <el-submenu  index="3">
          <template slot="title">账单管理</template>
          <el-menu-item index="3-1"  :span="12">账单主页</el-menu-item>
          <el-menu-item index="3-2"  :span="12">账图浏览</el-menu-item>
          <el-menu-item index="3-3"  :span="12">账单统计</el-menu-item>
        </el-submenu >
        <el-menu-item index="4">基础配置</el-menu-item>
        <el-menu-item index="5" disabled>暂不开放</el-menu-item>
        <el-submenu index="6">
          <template slot="title">帮助中心</template>
          <el-menu-item index="6-1"><a href="https://element.eleme.cn/#/zh-CN/component/installation" target="_blank">element文档</a></el-menu-item>
          <el-menu-item index="6-2"><a href="http://10.10.4.175/#/demo/d2-crud/index" target="_blank">D2-crud文档</a></el-menu-item>
          <el-menu-item index="6-3"><a href="https://echarts.apache.org/zh/tutorial.html#5%20%E5%88%86%E9%92%9F%E4%B8%8A%E6%89%8B%20ECharts" target="_blank">echarts文档</a></el-menu-item>
        </el-submenu>
        <el-submenu index="7" style="float: right;width: 200px">
          <template slot="title" >你好：{{userName}}
            <img :src="lmgurl" alt="头像" title="头像" style="border: 1px #5b5b5b dashed;border-radius: 2px" width="20px" height="20px" v-if="lmgurl.length>0">
          </template>
          <!-- <el-menu-item index="7-1" class="myUser">注销用户</el-menu-item>-->
          <el-menu-item index="7-1"  :span="12">个人中心</el-menu-item>
          <el-menu-item index="7-2"  :span="12">消息中心（<span :style="msgCount==0?'':'color: red'">{{msgCount}}</span>）</el-menu-item>
          <el-menu-item index="7-3"   v-on:click="reset">退出</el-menu-item>
        </el-submenu>
      </el-menu>
      <table-date v-show="isData&&user.yes!=1"></table-date>
      <china-map v-if="isMap&&user.yes!=1"></china-map>
      <!-- <my-home v-if="isHome"></my-home>-->
      <note-index ref="noteIndex" v-show="isNote&&user.yes!=1" :userName="userName"></note-index>
      <user-info :userId="userid" v-if="isInfo"></user-info>
      <photo-info v-if="isPhoto&&user.yes!=1"></photo-info>
      <tendency-map v-if="isTendency&&user.yes!=1"></tendency-map>
      <user-msg v-show="isMsg" :initCount="msgCount" ref="refUserMsg"></user-msg>
      <msg-active :msgUrl="msgInfo" ref="msgVoice"></msg-active>
      <base-config v-if="isConfig"></base-config>
      <!--<add-or-update v-if="addOrUpdateVisible" :addformVisable="addOrUpdateVisible" ref="addOrUpdate" @freshData="closeInfo"></add-or-update>-->
      <!-- <el-drawer
         title="消息提醒"
         :visible.sync="drawer"
         :direction="direction"
         :close-on-press-escape="true"
         :modal="false">
       </el-drawer>-->
    </div>
  </div>
</template>
<script>
import TableDate from '@/view/TableData'
import UserMsg from '@/view/UserMsg'
import MyHome from '@/components/MyHome'
import NoteIndex from '@/view/note/index'
import UserInfo from '@/view/note/userInfo'
import PhotoInfo from '@/view/note/photoInfo'
import tendencyMap from '@/view/note/tendencyMap'
import ChinaMap from '@/view/ChinaMap/map'
import MsgActive from '@/view/myComponents/MsgActive'
import BaseConfig from '@/view/baseConfig/BaseConfig'
import Weather from '@/components/Weather'
import dayjs from 'dayjs'
import Clock from 'vue-clock2'
import addOrUpdate from '@/view/addOrUpdate'
export default {
  name: 'myMenu',
  components: {
    addOrUpdate,
    Clock,
    TableDate,
    MyHome,
    NoteIndex,
    ChinaMap,
    UserInfo,
    PhotoInfo,
    tendencyMap,
    UserMsg,
    MsgActive,
    BaseConfig,
    Weather
  },
  data() {
    return {
      drawer: false,
      direction: 'rtl',
      isData:false,
      isHome:false,
      isNote:false,
      isMap:false,
      isInfo:false,
      isPhoto:false,
      isTendency:false,
      isConfig:false,
      isMsg:false,
      userid:'',
      userName:'',
      activeIndex: '1',
      user:this.$root.USER,
      lmgurl:'',
      timetask:null,
      infoCount:0,
      websocket:null,
      msgInfo:'http://learn.hhf.com/resources/static/voice/msg0.mp3',
      defaultDate: new Date(),
      siteUser:null,
      vipUser:null,
      addOrUpdateVisible: false,
      restaurants:[],
      heartTimer:null
    };
  },
  methods: {
    closeInfo(){
      this.addOrUpdateVisible=false;
    },
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
      if(key=='7-1'){
        this.isInfo=true;
      }else{
        this.isInfo=false;
      }
      if(key=='7-2'){
        this.isMsg=true;
        this.$refs.refUserMsg.initData();
      }else{
        this.isMsg=false;
      }
      if(key=='3-1'){
        //初始数据
        this.$refs.noteIndex.isQueryInit();
        this.isNote=true;
      }else{
        this.isNote=false;
      }
      if(key=='3-2'){
        this.isPhoto=true;
      }else{
        this.isPhoto=false;
      }
      if(key=='3-3'){
        this.isTendency=true;
      }else{
        this.isTendency=false;
      }
      if(key=='4'){
        this.isConfig=true;
      }else{
        this.isConfig=false;
      }
    },
    isChange(){
      if(this.siteUser.length===0){
        this.addOrUpdateVisible=false;
      }
    },
    selectSiteUser(item){//选中的时候
      this.addOrUpdateVisible = true
      this.vipUser=item;
      // this.$nextTick(() => {
      //   this.$refs.addOrUpdate.initView(item)
      // })
    },
    querySearch(queryString, cb){//搜索查询
      if(!queryString||queryString.trim().length===0){
        this.addOrUpdateVisible = false
        return;
      }
      //查询系统里的用户
      this.$api.queryVip().then(res=>{
        if(res.success){
          this.restaurants=res.data;
          var restaurants = this.restaurants;
          var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
          // 调用 callback 返回建议列表的数据
          cb(results);
        }else{
          this.$message.error({message: '获取网站vip用户失败', center: true})
        }
      }).catch(err=>{
        this.$message.error({message: '请求服务器异常', center: true})
      });
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    sendMsg(){
      const USER=JSON.parse(sessionStorage.getItem('user'));
      this.$prompt('请输入信息', "对话【"+this.siteUser+this.vipUser.isOnLine+"】", {
        confirmButtonText: '发送',
        cancelButtonText: '取消',
        inputValidator:function (e) {
          if(!e)return false
          if(e&&e.length>0){
            return true;
          }
          return false
        },
        inputErrorMessage: '请输入回复信息'
      }).then(({ value }) => {
        //1.用户互发信息(通过mq，转储到mysql，定时轮询db)
        let param={};
        param.fromId= USER.id;
        param.toId = this.vipUser.id;
        param.msg = value;
        param.userName=USER.userName;
        this.$api.sendMsg(param).then(re=>{
          if(re.success){
            this.$message.success({message: '消息发送成功', center: true});
          }
        }).catch(er=>{
          this.$message.error({message: '发送失败、请重试', center: true});
        })
      });
    },
    reset(){
      const USER=JSON.parse(sessionStorage.getItem('user'));
      if(USER){
        this.$api.downUser().then(re=>{
          this.$root.USER =USER;
          sessionStorage.removeItem("user");
          this.$router.push(
            {
              name: 'Login', params: {}
            })
        });
      }else{
        this.$message.error({message: '未登录', center: true})
      }
    },
    getMsgCount(){
      // let _that=this;
      this.$api.getMsgCount().then(res => {
        if(res.success){
          this.infoCount=res.data;
        }
      }).catch(er=>{
        this.$message.error({message: '获取信息失败', center: true})
      })
    },
    openWebSocket(){
        // WebSocket
      if ('WebSocket' in window) {
        this.websocket = new WebSocket('ws://learn.hhf.com/msgWebSocket/' + this.userid)
        this.initWebSocket()
      } else {
        this.$message.error('当前浏览器 Not support websocket')
      }
    },
    initWebSocket () {
      // 连接错误
      this.websocket.onerror = this.setErrorMessage

      // 连接成功
      this.websocket.onopen = this.setOnopenMessage

      // 收到消息的回调
      this.websocket.onmessage = this.setOnmessageMessage

      // 连接关闭的回调
      this.websocket.onclose = this.setOncloseMessage

      // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
      window.onbeforeunload = this.onbeforeunload
    },
    setErrorMessage (data) {
      // this.$message.error('WebSocket连接发生错误   状态码：' + this.websocket.readyState)
        this.$notify({
          title: '系统提示',
          message: '连接错误',
          position: 'bottom-right',
          duration: 0
        });
    },
    setOnopenMessage () {
      // this.$message.success('WebSocket连接成功    状态码：' + this.websocket.readyState)
      // 连接成功之后，开启心跳检测
      // 定时发送心跳
      // this.heartTimer = setInterval(() => {
      //   this.heartbeat();
      // }, 5000);
    },
    // 心跳包
    heartbeat() {
      const data = {
        userId: this.$root.USER.id+'',
        type: 'wsHeart'
      };
      this.websocket.send(JSON.stringify(data));
    },
    setOnmessageMessage (event) {
      // 根据服务器推送的消息做自己的业务处理
      let data=event.data;
      if(!isNaN(data)){//是数字
        this.infoCount=parseInt(data==undefined?"0":data);
      }else if(data==='noticeMsgUser'){
        this.$message.success('通知：当前聊天列表里,有用户信息被改');
      }else if (data === 'downOrUp') {
        this.$message.success({message: '通知全体：有用户下线', center: true})
        //查询系统里的用户
        this.$api.queryVip().then(res=>{
          if(res.success){
            this.restaurants=res.data;
          }else{
            this.$message.error({message: '获取网站vip用户失败', center: true})
          }
        }).catch(err=>{
          this.$message.error({message: '请求服务器异常', center: true})
        })
      }else {
        this.$notify({
          title: '系统提示',
          message: data,
          position: 'bottom-right',
          duration: 0
        });
        this.$nextTick(()=> {//提示音
          this.$refs.msgVoice.sing();
        })
      }
      // this.$message.success('服务端返回：' + event.data)
    },
    setOncloseMessage () {
      this.$notify({
        title: '系统提示',
        message: 'WebSocket连接关闭 状态码：' + this.websocket.readyState,
        position: 'bottom-right',
        duration: 0
      });
      // this.$message.error('WebSocket连接关闭 状态码：' + this.websocket.readyState)
    },
    onbeforeunload () {
      //清掉心跳定时器
      clearInterval(this.heartTimer);
      this.websocket.close()
    }
  },
  filters: {// 过滤器
    formatDate: function (cellValue) {
      return null != cellValue ? dayjs(cellValue).format('YYYY-MM-DD') : null
    }
  },
  mounted(){
    // setInterval(() => {
    //   this.defaultDate = new Date() // 动态时间
    // }, 1000)
    this.handleSelect(1,1);
    const USER=JSON.parse(sessionStorage.getItem('user'));
    if(USER){
      this.$root.USER =USER;
    }
    if (this.$root.USER.id) {
      this.user = this.$root.USER;
      this.userid=this.$root.USER.id+'';
      console.log("当前登录人的类型："+this.user.yes);
      this.userName=this.$root.USER.name;
      // this.lmgurl="data:image/png;base64,"+this.$root.USER.picPath;
      this.lmgurl=this.$root.USER.picPath?this.$root.USER.picPath:"";
      //开启webSocket
      this.openWebSocket();
    }else{
      //请求后端，验证cookie：将user信息写回sessionStorage中
      this.$api.currentIsLogin().then(res=>{
        if(res.success){
          // 保存：session
          sessionStorage.setItem('user', JSON.stringify(res.data));
          this.$root.USER = res.data;
          this.userName=this.$root.USER.name;
          this.lmgurl=this.$root.USER.picPath?this.$root.USER.picPath:"";
        }else{
          this.$router.push(
            {
              name: 'Login', params: {}
            })
        }
      }).catch(err=>{
        this.$message.error({message: '获取不到用户信息，请重新登录', center: true})
        this.$router.push(
          {
            name: 'Login', params: {}
          })
        return;
      })
    }
    //查询系统里的用户
    this.$api.queryVip().then(res=>{
      if(res.success){
        this.restaurants=res.data;
      }else{
        this.$message.error({message: '获取网站vip用户失败', center: true})
      }
    }).catch(err=>{
      this.$message.error({message: '请求服务器异常', center: true})
    })
    if(this.$route.params.sign=='map'){
      this.handleSelect('2-1',1);
    }
    //开启定时任务
    // this.timetask=setInterval(()=>this.getMsgCount(),6000);
  },
  destroyed(){
    //退出的时候，删除cookie信息
    // var cookies = document.cookie.split(";");
    // for (var i = 0; i < cookies.length; i++) {
    //   var cookie = cookies[i];
    //   var eqPos = cookie.indexOf("myToken");
    //   if(eqPos!=-1){
    //     document.cookie.
    //   }
    // }
    // window.addEventListener('beforeunload', e => this.beforeunloadFn(e));
  },
  beforeDestroy () {
    this.onbeforeunload()
  },
  computed:{//计算属性
    msgCount:function () {
      if(this.infoCount>0){
        this.$notify.success({
          title: '提示',
          message: '您有未读消息'+this.infoCount+'条，请注意查看',
          duration: 5000,
          type: 'success',
          showClose: false
        });
        this.$nextTick(()=> {//提示音
          this.$refs.msgVoice.sing();
        })
      }
      return this.infoCount;
    }
  },
}
</script>

<style scoped>

  .mybody{
    background:url(../../static/background-xj.jpg);
    width:100%;
    height:100%;
    position:fixed;
    background-size:100% 100%;
  }

</style>
