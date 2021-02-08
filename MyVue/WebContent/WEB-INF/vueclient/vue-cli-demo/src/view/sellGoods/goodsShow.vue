<template>
  <div>
    <a @click="$router.push({name: 'menu', params: {}})" style="cursor:pointer;color: #8cc5ff">返回首页</a>
    <div v-for="(item,index) in dataList" @click="changeValue(index)" >
      <goods-model  :data="item" :key="index" :class="{ active:index==isActive }" style="margin-bottom: 5px"  />
    </div>
    <el-pagination
      style="padding: 16px 10px"
      :pager-count="5"
      :current-page="pagination.currentPage"
      :background="true"
      :pagination="pagination"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="10"
      layout="total,-> ,prev,pager,next,sizes,jumper"
      :total="pagination.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />
  </div>
</template>
<script>
  import goodsModel from './goodsModel';
  export default {
    name: 'GoodsShow',
    components: { goodsModel },
    data() {
      return {
        dataList: [],
        pagination: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        },
        currentUser:{},
        isActive:'-1',
        isChecked:{}
      };
    },
    mounted() {
      this.currentUser= JSON.parse(sessionStorage.getItem('user'));
      if(this.currentUser){
        this.queryGoods();
      }else {
        this.$router.push(
          {
            name: 'Login', params: {}
          })
      }

    },
    methods: {
      changeValue(index){
        this.isActive=index;
        this.isChecked=this.dataList[index];
      },
      load(){
        this.pagination.pageSize+=1;
        this.queryGoods();
      },
      soldoutSell() {
        if(!this.isChecked.idStr){
          this.$message.error({ message: '请选中一个再操作', center: true });
          return;
        }
      },
      updateSell() {
        if(!this.isChecked.idStr){
          this.$message.error({ message: '请选中一个再操作', center: true });
          return;
        }

      },
      deleteSell() {
        if(!this.isChecked.idStr){
          this.$message.error({ message: '请选中一个再操作', center: true });
          return;
        }
      },
      queryGoods() {
        this.$api.managerGoods({ userCode: this.currentUser.userName, pageSize: this.pagination.pageSize, pageIndex: this.pagination.currentPage }).then((response) => {
          if (response != null) {
            if (response.success) {
              this.dataList = response.data.records;
              this.pagination.total = response.data.total;
              this.$message.success({ message: '操作成功', center: true });
            } else {
              this.$message.error({ message: response.errorMessages, center: true });
            }
          } else {
            this.$message.error({ message: '系统异常，请联系开发者', center: true });
          }
        });
      },
      handleSizeChange(sizes) {
        this.pagination.pageSize = sizes;
        this.queryGoods();
      },
      handleCurrentChange(currentPage) {
        this.pagination.currentPage = currentPage;
        this.queryGoods();
      }
    }
  };
</script>

<style scoped>
  .active{
    border: 1px solid darkgrey;
    box-shadow: 10px 10px 16px #bbeff2;
    /*background: #6d92a9;*/
    border-radius: 5px;
  }
</style>
