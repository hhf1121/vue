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
        <b style="position:relative;top: -15px">标题：{{data.sellTitle}}  <span style="font-size: 6px;margin-left: 300px">浏览次数:</span><span style="color:red;font-size: 6px;">{{ data.goodsViews }}</span></b>

        <p style="height: 70px">内容：{{data.sellContent}}</p>
        <p><b>联系人:</b>{{data.userName}}&nbsp;&nbsp;&nbsp;<b>联系电话</b>:{{data.userPhone}}</p>
        <p><b>发布日期:</b>{{data.createTime}}</p>
      </el-main>
      <el-aside width="200px" style="position: relative">
        <el-button style="position: absolute;right: 5px;bottom: 5px" class="el-icon-finished" v-if="data.sellStatus==1">已完成</el-button>
        <el-button style="position: absolute;right: 5px"  type="danger" plain disabled >{{data.sellType | sellTypeStr(dictSellGoodsType) }}&nbsp;|&nbsp;{{data.sellCategory | sellCategoryStr(dictGoodsCategory)}}</el-button>
        <img :src="isxiajiaImg" alt="已下架" height="70px" width="85px" style="position: absolute;right: 5px;bottom: 5px" v-if="data.sellStatus==2">
        <b style="color: red;text-align: center;font-size: 30px;position: absolute;top:36%;right: 15px">{{ data.goodsFee }}元</b>
      </el-aside>
    </el-container>
  </div>
</template>

<script>
export default {
    name: 'GoodsModel',
    props: {
        data: Object
    },
    data() {
        return {
            photos: [],
            index:0,
            dictGoodsCategory:JSON.parse(sessionStorage.getItem('dictGoodsCategory')),
            dictSellGoodsType:JSON.parse(sessionStorage.getItem('dictSellGoodsType')),
            isxiajiaImg:'http://learn.hhf.com/resources/static/img/xiajia.png'
        };
    },
    // beforeCreate() {
    //     // console.info(this.data);
    //     // this.photos = this.data.sellGoodsPhotos.filter(o => o.isShow === 1)[0].goodsPhoto;
    //   this.dictGoodsCategory=JSON.parse(sessionStorage.getItem('dictGoodsCategory'));
    //   this.dictSellGoodsType=JSON.parse(sessionStorage.getItem('dictSellGoodsType'));
    //   console.info(this.dictGoodsCategory);
    //   console.info(this.dictSellGoodsType);
    // },
  mounted(){
    this.photos = this.data.sellGoodsPhotos.map(o=>{
      return o.goodsPhoto;
    });
    // console.info(this.photos)
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
          if(this.index>=this.photos.length-1){
            this.index=0;
          }else{
            this.index++;
          }
       }
  },
  filters: {// 过滤器
    sellTypeStr: function (cellValue,dict) {
      // var ts = this.dictSellGoodsType.filter(o=>o.value==cellValue);
      var ts = dict.filter(o=>o.value==cellValue);
      // console.info(ts)
      return ts[0].label;
    },
    sellCategoryStr: function (cellValue,dict) {
      // var ts = this.dictGoodsCategory.filter(o=>o.value==cellValue);
      var ts = dict.filter(o=>o.value==cellValue);
      // console.info(ts)
      return ts[0].label;
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
    opacity: 0.5;
  }
  .right{
    position: absolute;
    right: 10px;
    top:80px;
    cursor:pointer;
    background-color: rgb(206,197,180);
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
