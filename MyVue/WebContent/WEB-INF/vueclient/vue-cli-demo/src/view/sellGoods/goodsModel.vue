<template>
  <div>
    <el-container >
      <el-aside style="margin-top: 10px">
          <div class="center">
            <img :src="photos[index]?photos[index]:''" alt="" height="200px" width="300px">
            <span class="sum">{{index+1}}/{{photos.length}}</span>
            <button class="el-icon-arrow-left left" @click="prev"></button>
            <button @click="next" class="el-icon-arrow-right right"></button>
          </div>
      </el-aside>
      <el-main style="text-align: left">
        <b style="position:relative;top: -15px">标题：{{data.sellTitle}}  <el-button style="float: right"  type="danger" plain disabled >{{data.sellType | sellTypeStr }}&nbsp;|&nbsp;{{data.sellCategory | sellCategoryStr}}</el-button> </b>
        <p style="height: 70px">内容：{{data.sellContent}}</p>
        <p>联系人:{{data.userName}}&nbsp;&nbsp;&nbsp;联系电话:{{data.userPhone}}</p>
        <p>发布日期:{{data.createTime}}</p>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  var dictGoodsCategory=JSON.parse(sessionStorage.getItem('dictGoodsCategory'));
  var dictSellGoodsType=JSON.parse(sessionStorage.getItem('dictSellGoodsType'));
export default {
    name: 'GoodsModel',
    props: {
        data: Object
    },
    data() {
        return {
            photos: [],
            index:0
        };
    },
    mounted() {
        // console.info(this.data);
        // this.photos = this.data.sellGoodsPhotos.filter(o => o.isShow === 1)[0].goodsPhoto;
        this.photos = this.data.sellGoodsPhotos.map(o=>{
          return o.goodsPhoto;
        });
        console.info(this.photos)
    },
  methods:{
      prev(){
        if(this.index<=0){
          this.index=this.photos.length-1;
        }else {
          this.index--;
        }
      },
      next(){
          if(this.index>=this.photos.length-2){
            this.index=0;
          }else{
            this.index++;
          }
       }
  },
  filters: {// 过滤器
    sellTypeStr: function (cellValue) {
      return dictSellGoodsType.filter(o=>o.value==cellValue)[0].label;
    },
    sellCategoryStr: function (cellValue) {
      return dictGoodsCategory.filter(o=>o.value==cellValue)[0].label;
    },
  },
};
</script>

<style scoped>
  /*.title{*/
    /*background-color: wheat;*/
    /*text-align: center;*/
    /*width: 260px;*/
  /*}*/
  /*.icoImg{*/
    /*margin-left: 10px;*/
    /*height: 35px;*/
    /*width: 85px;*/
  /*}*/
  /*.boImg{*/
    /*margin-top: -20px;*/
    /*border: 2px solid wheat;*/
    /*height: 200px;*/
    /*width: 300px;*/
  /*}*/
  .center{
    position: relative
  }
  .left{
    position: absolute;
    top:80px;
    left: 10px;
    cursor:pointer;
    background-color: rgb(206,197,180);
  }
  .right{
    position: absolute;
    right: 10px;
    top:80px;
    cursor:pointer;
    background-color: rgba(206, 197, 180, 0.99);
    opacity: 0.5;
  }
  .sum{
    position: absolute;
    right: 145px;
    top:178px;
    /*opacity: 0.5;*/
    color: black;
    border-radius: 5px;
    border: 1px solid #f2dfde;
  }
</style>
