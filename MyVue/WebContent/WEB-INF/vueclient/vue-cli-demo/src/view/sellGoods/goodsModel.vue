<template>
  <div>
    <el-container>
      <el-aside style="margin-top: 10px">
        <img :src="photos" alt="" height="200px" width="300px">
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
            photos: []
        };
    },
    mounted() {
        console.info(this.data);
        this.photos = this.data.sellGoodsPhotos.filter(o => o.isShow === 1)[0].goodsPhoto;
    },
  methods:{

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
  /*.active{*/
    /*border: 1px solid #dc22b5;*/
  /*}*/
</style>
