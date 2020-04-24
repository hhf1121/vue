<template>
    <div>
      <div class="" v-for="(d,i) in lists" :key="i">
        <div v-show="n==i">{{d.noteTitle}}</div>
        <img :src="d.imgCode" style="text-align: center;margin: 0 auto;" :alt="d.createrTime"  :width="d.width" :height="d.height" v-if="n==i" @click="showImage(d)">
      </div>
      <div class="banner-circle">
        <ul style="display: inline">
          <li  v-for="(v,i) in lists" :key="i" :class='n==i?"selected":""' style="" >未实现</li>
        </ul>
      </div>
      <el-dialog :visible.sync="imgVisible" style="width: 100%;height: 100%">
        <img :src="dialogImageUrl" :alt="dialogImageAlt">
      </el-dialog>
    </div>
</template>

<script>
export default {
  name: 'photoInfo',
  // props:{
  //   show:{
  //     type:Boolean,
  //     default(){
  //       return false
  //     }
  //   }
  // },
  data() {
    return {
      n:0,
      lists:[],
      task:null,
      imgVisible:false,
      dialogImageUrl:'',
      dialogImageAlt:''
    }
  },
  methods: {
    turnsPhoto(){//开始轮播
     this.task= setInterval(this.timer,2000);
    },
    timer(){//轮播方法
      this.n++;
      if(this.n==this.lists.length){
        this.n=0;
      }
    },
    showImage(data){
      this.imgVisible=true;
      this.dialogImageUrl=data.imgCode;
      this.dialogImageAlt=data.noteTitle;
    }
  },
  mounted() {
    this.$api.queryNotesWithPhoto().then(re=>{
      const newList=re.map(data => {
            data.width='500'
            data.height='520'
        return data;
      })
      this.lists=newList;
      this.turnsPhoto();
    }).catch(err => {
      this.$message.error({message: '请求错误', center: true})
    })
  },
  destroyed(){
    clearInterval(this.task);
  }
}
</script>

<style scoped>

</style>
