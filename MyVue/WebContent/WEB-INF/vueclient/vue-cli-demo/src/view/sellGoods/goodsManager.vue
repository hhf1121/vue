<template>
    <div>
        <el-form :inline="true" class="demo-form-inline" style="text-align: left;margin-bottom: 10px">
              <el-button style="float: right;border: none;" @click="queryGoods();" class="el-icon-refresh" :loading="isLoading"></el-button>
                <el-button :disabled="isStatus!=2||isStatus==1" type="primary" plain round @click="soldupSell">
                  上架
                </el-button>
                <el-button :disabled="isStatus==2||isStatus==1"  type="warning" plain round @click="soldoutSell">
                    下架
                </el-button>
                <el-button  :disabled="isStatus==1"  type="success" plain round @click="updateSell">
                    修改
                </el-button>
                <el-button :disabled="isStatus==1"  type="danger" plain round @click="deleteSell">
                    删除
                </el-button>
                <el-button :disabled="isStatus==2||isStatus==1"  type="info" class="el-icon-s-goods" plain round @click="finishedSell">
                    交易完成
                </el-button>
        </el-form>
        <div v-for="(item,index) in dataList"  @click="changeValue(item,index)" >
          <goods-model  :data="item" :key="index" :class="{ active:index==isActive }"  />
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
// import goodsModel from './goodsModel';
export default {
    name: 'GoodsManager',
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
          isChecked:{},
          isLoading:false,
          isStatus:''
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
        changeValue(data,index){
          this.isActive=index;
          this.isChecked=data;
          this.isStatus=data.sellStatus;
        },
        load(){
          this.pagination.pageSize+=1;
          this.queryGoods();
        },
        soldoutSell() {//下架
          if(!this.isChecked.idStr){
            this.$message.error({ message: '请选中一个再操作', center: true });
            return;
          }
          var data={
            sellStatus:2,
            idStr:this.isChecked.idStr
          }
          this.$api.updateStatusGoods(data).then((response) => {
            if (response != null) {
              if (response.success) {
                // this.$message.success({ message: '删除成功', center: true });
                this.queryGoods();
              } else {
                this.$message.error({ message: response.errorMessages, center: true });
              }
            } else {
              this.$message.error({ message: '系统异常，请联系开发者', center: true });
            }
          });
        },
        finishedSell() {//完成
          if(!this.isChecked.idStr){
            this.$message.error({ message: '请选中一个再操作', center: true });
            return;
          }
          var data={
            sellStatus:1,
            idStr:this.isChecked.idStr
          }
          this.$api.updateStatusGoods(data).then((response) => {
            if (response != null) {
              if (response.success) {
                // this.$message.success({ message: '删除成功', center: true });
                this.queryGoods();
              } else {
                this.$message.error({ message: response.errorMessages, center: true });
              }
            } else {
              this.$message.error({ message: '系统异常，请联系开发者', center: true });
            }
          });
        },
        soldupSell() {//上架
          if(!this.isChecked.idStr){
            this.$message.error({ message: '请选中一个再操作', center: true });
            return;
          }
          var data={
            sellStatus:3,
            idStr:this.isChecked.idStr
          }
          this.$api.updateStatusGoods(data).then((response) => {
            if (response != null) {
              if (response.success) {
                // this.$message.success({ message: '删除成功', center: true });
                this.queryGoods();
              } else {
                this.$message.error({ message: response.errorMessages, center: true });
              }
            } else {
              this.$message.error({ message: '系统异常，请联系开发者', center: true });
            }
          });
        },
        updateSell() {
          if(!this.isChecked.idStr){
            this.$message.error({ message: '请选中一个再操作', center: true });
            return;
          }
          this.$emit('editGoods',this.isChecked); // 调用父组件，的editGoods事件
        },
        deleteSell() {//删除
          if(!this.isChecked.idStr){
            this.$message.error({ message: '请选中一个再操作', center: true });
            return;
          }
          var data={
            isDelete:1,
            idStr:this.isChecked.idStr
          }
          this.$api.updateStatusGoods(data).then((response) => {
            if (response != null) {
              if (response.success) {
                // this.$message.success({ message: '删除成功', center: true });
                this.queryGoods();
              } else {
                this.$message.error({ message: response.errorMessages, center: true });
              }
            } else {
              this.$message.error({ message: '系统异常，请联系开发者', center: true });
            }
          });
        },
        queryGoods() {
          this.isActive='-1';
          this.isLoading=true;
            setTimeout(()=>{
              this.$api.managerGoods({ userCode: this.currentUser.userName, pageSize: this.pagination.pageSize, pageIndex: this.pagination.currentPage }).then((response) => {
                if (response != null) {
                  if (response.success) {
                    this.dataList = response.data.records;
                    this.pagination.total = response.data.total;
                    this.$message.success({ message: '操作成功', center: true });
                    this.isLoading=false;
                  } else {
                    this.$message.error({ message: response.errorMessages, center: true });
                    this.isLoading=false;
                  }
                } else {
                  this.$message.error({ message: '系统异常，请联系开发者', center: true });
                  this.isLoading=false;
                }
              });
            },1000)
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
  border: 1px solid #a91b3c;
  box-shadow: -10px -10px 10px #a9a9a9 ;
  background: #a0c1f2;
  /*box-shadow: 0 0 7px #b53;*/
  /*background: #95a;*/
  border-radius: 5px;
}
</style>
