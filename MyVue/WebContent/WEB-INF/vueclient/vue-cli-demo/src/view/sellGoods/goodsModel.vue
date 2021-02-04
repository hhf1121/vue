<template>
  <div>
    <el-container>
      <el-aside>
        <img :src="photos" alt="" height="200px" width="300px">
      </el-aside>
      <el-main >
        <b>{{data.sellTitle}}</b>
        <p>{{data.sellContent}}</p>
      </el-main>
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
        };
    },
    mounted() {
        console.info(this.data);
        this.photos = this.data.sellGoodsPhotos.filter(o => o.isShow === 1)[0].goodsPhoto;
    },
  methods:{

  }
};
</script>

<style scoped>
  /*.active{*/
    /*border: 1px solid #dc22b5;*/
  /*}*/
</style>
