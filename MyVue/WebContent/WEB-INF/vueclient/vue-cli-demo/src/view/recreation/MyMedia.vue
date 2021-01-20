<template>
  <div class="app">
    <div class="dm" >
    <!-- d_screen start -->
    <div class="d_screen">
      <a class="d_del" @click="$router.push({name: 'menu', params: {}})" style="cursor:pointer;color: #8cc5ff;z-index: 100;font-size: 8px">返回首页</a>
     <!-- <div class="d_mask">
      </div>-->
      <danmu-wrapper :isText="dmMsg" :isMe="isMe" ref="danmu" style="position: absolute;z-index: 99"></danmu-wrapper>
      <div class="d_show">
        <d-player id="audio" ref="player"  :options="options"></d-player>
      </div>
    </div>
    <!-- end d_screen -->


    <!-- send start -->
    <div class="send">
      <div class="s_filter"></div>
      <div class="s_con" style="z-index: 999">
        <el-input v-model="dmMsg" placeholder="请输入内容"  class="s_text" ></el-input>
        <el-button type="primary" class="s_submit" id="btn" @click="sendAll">发表评论</el-button>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
  import danmuWrapper from '../../components/danmu/danmuwrapper';
  export default {
    name: 'MyMedia',
    components:{danmuWrapper},
    data() {
      return {
        options: {
          video: {
            // url: 'http://learn.hhf.com/resources/static/video/test.mp4'
            url: 'http://learn.hhf.com/resources/static/voice/music.mp3',
            type: 'auto'
          },
          autoplay: true,//自动播放
          contextmenu: [
            {}
          ]
        },
        userid: '',
        dmMsg: '',
        isMe:null
      }
    },
    beforeDestroy () {
      this.onbeforeunload()
    },
    mounted() {
      const USER=JSON.parse(sessionStorage.getItem('user'));
      if(USER){
        this.$root.USER =USER;
      }
      if (this.$root.USER.id) {
        this.userid=this.$root.USER.id+'';
        //开启webSocket
        this.openWebSocket();
      }else {
        this.$message.error({message: '获取不到用户信息，请重新登录', center: true})
        this.$router.push(
          {
            name: 'Login', params: {}
          })
        return;
      }
    },
    methods:{
      sendAll(){
        const data = {
          userId: this.$root.USER.id+'',
          type: 'dmMsg',
          msg: this.dmMsg
        };
        // this.websocket.send(JSON.stringify(data));
        this.$api.sendDM(data).then(re=>{
          if(re.success){
            // this.$message.success({message: '消息发送成功', center: true});
            this.dmMsg='';
          }
        }).catch(er=>{
          this.$message.error({message: '发送失败、请重试', center: true});
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
        this.heartTimer = setInterval(() => {
          this.heartbeat();
        }, 5000);
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
        var parse = JSON.parse(data);
        if(parse.type==='dmMsg'){
          this.$message.success('服务端返回：' + parse.msg)
          this.dmMsg=parse.msg;
          this.isMe=parse.isMe;
          this.$nextTick(() => {
            this.$refs.danmu.addList();
          })
        }
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
    }
  }
</script>
<style scoped>
  body {
    background: url(http://learn.hhf.com/resources/static/file/1589006596024@dorado.jpg); no-repeat:top center;
    font-size: 12px;
    font-family: "微软雅黑";
  }
  * {
    margin: 0;
    padding: 0;
  }
  /* screen start*/
  .screen {
    width: 300px;
    height: 100px;
    background: #669900;
  }


  .dm {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    display: block;
  }


  .dm .d_screen .d_del {
    width: 38px;
    height: 38px;
    background: #600;
    display: block;
    text-align: center;
    line-height: 38px;
    text-decoration: none;
    font-size: 20px;
    color: #fff;
    border-radius: 19px;
    border: 1px solid #fff;
    z-index: 2;
    position: absolute;
    right: 20px;
    top: 20px;
    outline: none;
  }


  .dm .d_screen .d_del:hover {
    background: #F00;
  }


  .dm .d_screen .d_mask {
    background: #000;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0.6;
    filter: alpha(opacity = 60);
    z-index: 1;
  }


  .dm .d_screen .d_show {
    position: relative;
    z-index: 2;
  }


  .dm .d_screen .d_show div {
    font-size: 26px;
    line-height: 36px;
    font-weight: 500;
    position: absolute;
    width: 100%;
    text-align: center;
    color: #fff;
  }
  /*end screen*/


  /*send start*/
  .send {
    width: 100%;
    height: 76px;
    position: absolute;
    bottom: 0;
    left: 0;
    border: 1px solid red;
  }


  .send .s_filter {
    width: 100%;
    height: 76px;
    background: #000;
    position: absolute;
    bottom: 0;
    left: 0;
    opacity: 0.6;
    filter: alpha(opacity = 60);
  }


  .send  .s_con {
    width: 100%;
    height: 76px;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    text-align: center;
    line-height: 76px;
  }


  .send .s_con .s_text {
    width: 800px;
    height: 36px;
    border: 0;
    border-radius: 6px 0 0 6px;
    outline: none;
  }


  .send .s_con .s_submit {
    width: 100px;
    height: 36px;
    border-radius: 0 6px 6px 0;
    outline: none;
    font-size: 14px;
    position: relative;
    float: top;
    z-index: 100;
    color: #fff;
    background: #65c33d;
    font-family: "微软雅黑";
    cursor: pointer;
    border: 1px solid #5bba32;
  }


  .send .s_con .s_submit:hover {
    background: #3eaf0e;
  }
</style>
