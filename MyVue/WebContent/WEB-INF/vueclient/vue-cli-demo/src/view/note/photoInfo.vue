<template>
  <div >
      <el-dialog :visible.sync="imgVisible">
        <img width="100%" :src="dialogImageUrl" :title="dialogImageTitie">
      </el-dialog>
      <carousel-3d  :autoplay="true">
        　　<slide v-for="(item, i) in bannerList" :key="i" :index="i" >
        　　　　<template slot-scope="{ index, isCurrent, leftIndex, rightIndex}" class="cursor:pointer;">
        　　　　　　<img :data-index="index"  @mouseover='dialogVisible=true' @mouseout="dialogVisible=false"
                   :class="{ current: isCurrent, onLeft: (leftIndex >= 0), onRight: (rightIndex >=0)}"
                   :src="item.imgCode" @dblclick="showImage(item)" :title="item.noteTitle">
        　　　</template>
        　　</slide>
      </carousel-3d>
      <p style="margin-top: 100px;" v-show="dialogVisible">
        <span style="color: #66b1ff">双击图片,查看详情</span><br>
        <span style="color: #fa733c">单击左键不放,可左右拖动图片</span>
      </p>
  </div>
</template>

<script>
  //3D轮播组件
  import { Carousel3d, Slide } from 'vue-carousel-3d'
export default {
  name: 'photoInfo',
  components: {
    Carousel3d,
    Slide
  },
  data() {
    return {
      bannerList:[],
      imgVisible:false,
      dialogImageUrl:'',
      dialogImageTitie:'',
      isAutoplay:false,
      dialogVisible:false
    }
  },
  methods: {
    // turnsPhoto(){//开始轮播
    //  this.task= setInterval(this.timer,2000);
    // },
    // timer(){//轮播方法
    //   this.mark++;
    //   if(this.mark==this.lists.length){
    //     this.mark=0;
    //   }
    // },
    showImage(data){
      this.imgVisible=true;
      this.dialogImageUrl=data.imgCode;
      this.dialogImageTitie=data.noteRemark;
    },
    autoLoadImg(){
      this.loadingImg();
    },
    loadingImg(){
      this.$api.queryNotesWithPhoto().then(re=>{
        this.bannerList=re;
        this.isAutoplay=true;
      }).catch(err => {
        this.$message.error({message: '请求错误', center: true})
      })
    }
  },
  created() {
   this.loadingImg();
  }
}
</script>

<style scoped>
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
</style>
