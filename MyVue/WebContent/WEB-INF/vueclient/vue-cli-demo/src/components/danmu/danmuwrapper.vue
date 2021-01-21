<template>
  <div style="">
    <div class="danmu-wrapper" ref="wrap">
      <item v-for="(danmu,index) in lists" :ref="`All${index}`" :danmu="danmu" :key="index" @remove="remove" @enter="enter"></item>
    </div>
    <input class="add" type="text" placeholder="input" autofocus="autofocus" v-model="inputText" hidden
           @keyup.enter="addList">
  </div>
</template>

<script type="text/ecmascript-6">
  import item from './item.vue'
  export default{
    name:'danmuwrapper',
    components: {
      item
    },
    props:{
      isText: {
        type: String
      },
      isMe: {
        type: Boolean
      },
      userName:{
        type: String
      }
    },
    data() {
      return {
        lists: [],
        inputText: '',
//      弹道,弹道宽度40px
        tracks: [],
        itemHeight: 40,
        track_max: 0,
        inputisMe:false,
        isRandomColor:''
      }
    },
    computed: {
      top: function () {
        return 100;
      }
    },
    methods: {
      /***********
       *  弹道相关函数
       ***********/
      initWrap: function () {
//      初始化弹道
        let wrap = this.$refs.wrap;
        let height = wrap.offsetHeight;
        let num = Math.floor(height / 40);
        this.track_max = num + 1;
//      获取弹道
        for (let i = 0; i <= num; i++) {
          this.tracks[i] = i;
        }
      },
      getRandomTrack: function () {
        if (this.tracks.length < 1) {
          return;
        }
        let rand = 0;
        let i = 0;
        do {
          rand = Math.round(Math.random() * (this.track_max));
          if (i++ >= 200) {
            break;
          }
        } while (this.tracks.indexOf(rand) === -1)
        this.popTracks(rand);
        return rand;
      },
      popTracks: function (rand) {
        let i = this.tracks.indexOf(rand);
        if (i === -1) {
          return;
        }
        this.tracks.splice(i, 1);
        this.tracks.sort((a, b) => a - b);
      },
      pushTracks: function (i) {
        this.tracks.push(i);
        this.tracks.sort((a, b) => a - b);
      },
      /***********
       *  事件处理
       ***********/
      addList: function () {
        let item = this.createItem();
        if (!item) {
          return;
        }
        this.lists.push(item);
        //动态ref
        // for (let j = 0; j < this.lists.length - 1; j++) {
        //   console.info(this.$refs[`All${j}`][0]);
        // }
        this.inputText = '';
      },
      randomStyle(){
        //随机颜色
        const color=Math.floor(Math.random()*16777215).toString(16);
        // console.info(color);
        if(this.inputisMe==true){
          return 'border: 1px solid #f547dd;color:#' +color;
        }else {
          return 'color:#' + color;
        }

      },
      remove: function (item) {
        this.lists = this.lists.filter((i) => {
          return !(item === i)
        })
      },
      enter: function (top) {
        let rand = top / this.itemHeight;
        this.pushTracks(rand);
      },
      /***********
       *  弹幕相关
       ***********/
      createItem: function (text) {
        this.inputText=this.isText;
        this.inputisMe=this.isMe;
        let track = this.getRandomTrack();
        if (this.inputText === '' || isNaN(track)) {
          return;
        }
        let wrap = this.$refs.wrap;
        let item = {
          text: this.inputText,
          type: 1,
          isMe:this.inputisMe,
          userName:this.userName,
          speed: 2,
          opacity: 1,
          color: this.randomStyle(),
          top: track * this.itemHeight,
          begin: wrap.offsetLeft + wrap.offsetWidth,
          end: wrap.offsetLeft
        };
        return item;
      }
    },
    mounted: function () {
      this.$nextTick(() => {
        this.initWrap();
      })
    }
  }
</script>

<style scoped>
  .danmu-wrapper{
    text-align: center;
    /*margin-left: 10px;*/
    /*position: relative;*/
    border: 1px solid rgba(180, 71, 255, 0.6);
    overflow: hidden;
    width: 1800px;
    height: 500px;
    display: block;
    position: absolute;
    top: 10px;
    bottom:10px;
  }
  .add{
    margin-left: 200px;
    margin-top: 10px;
  }
</style>
