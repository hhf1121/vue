<template>
    <div>
        <el-form :inline="true" class="demo-form-inline" style="text-align: left;margin-bottom: 10px">
              <el-button type="primary" style="float: right" @click="$router.push({name: 'menu', params: {}})">返回</el-button>
                <el-button type="warning" round @click="soldoutSell">
                    下架
                </el-button>
                <el-button type="success" round @click="updateSell">
                    修改
                </el-button>
                <el-button type="danger" round @click="deleteSell">
                    删除
                </el-button>
        </el-form>
        <!--<div class="infinite-list" v-infinite-scroll="load">-->
          <goods-model  :data="item" v-for="(item,index) in dataList" :key="index" :class="{ active:index==isActive }" @click="changeValue(index)" />
        <!--</div>-->
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
          isActive:0
        };
    },
    mounted() {
        this.currentUser= JSON.parse(sessionStorage.getItem('user'));
        this.queryGoods();
    },
    methods: {
        changeValue(index){
          debugger
          this.isActive=index;
        },
        load(){
          debugger
          this.pagination.pageSize+=1;
          this.queryGoods();
        },
        soldoutSell() {

        },
        updateSell() {

        },
        deleteSell() {

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
  border: 1px solid #dc22b5;
}
</style>
