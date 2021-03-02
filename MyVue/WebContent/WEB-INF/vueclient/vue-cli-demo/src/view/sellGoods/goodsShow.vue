<template>
  <div>
    <el-button @click="$router.push({name: 'menu', params: {}})" circle style="cursor:pointer;color: #8cc5ff;position: absolute;right: 0px;top:0px ">首页</el-button>
    <el-button style="float: right;border: none;" @click="queryGoods(0)" class="el-icon-refresh"></el-button>
    <el-form style="float: left;">
      <b style="color: #66b1ff">商品类别：</b>
        <el-radio-group v-model="sellCategory" type="success" plain @change="queryGoods(1)">
          <el-radio-button
            v-for="(item,index) in dictGoodsCategory"
            :key="index"
            :label="item.value">
            {{ item.label }}
          </el-radio-button>
        </el-radio-group>
      <br/>
      <b style="color: #66b1ff">商品类型：</b>
      <el-button
        ref="isType0"
        plain
        style="border: none;color: #ff1824"
        value=""
        @click="queryGoodsType(undefined,'isType0',dictSellGoodsType.length)">
        全部
      </el-button>
      <span style="margin-right: 0px;display: inline-block">|</span>
      <div
        v-for="(item,index) in dictSellGoodsType"
        :key="index"
        style="display: inline-block">
        <el-button
          :ref="`dictType${(index+1)}`"
          style="border: none"
          plain
          :label="item.label"
          :value="item.value"
          @click="queryGoodsType(item.value,(index+1),dictSellGoodsType.length)">
          {{ item.label }}
        </el-button>
        <span v-if="dictSellGoodsType.length-1!==index" style="margin-right: 0px;display: inline-block">|</span>
      </div>
        <!--<el-radio-group v-model="sellType" type="primary" plain @change="queryGoods(2)" >
          <el-radio-button  v-for="(item,index) in dictSellGoodsType" :key="index" :label="item.value">
            {{ item.label }}
          </el-radio-button>
        </el-radio-group>-->
    </el-form>
    <br/>
    <br/>
    <br/>
    <br/>
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
        isChecked:{},
        sellCategory:'',
        sellType:'',
        dictGoodsCategory: JSON.parse(sessionStorage.getItem('dictGoodsCategory')),
        dictSellGoodsType: JSON.parse(sessionStorage.getItem('dictSellGoodsType'))
      };
    },
    mounted() {
      this.currentUser= JSON.parse(sessionStorage.getItem('user'));
      if(this.currentUser){
        this.queryGoods(0);
      }else {
        this.$router.push(
          {
            name: 'Login', params: {}
          })
      }

    },
    methods: {
      queryGoodsType(data, index, length) {
        if (data === undefined) {
          this.$refs.isType0.$el.style.color = '#ff1824';
          for (let i = 1; i < length + 1; i++) {
            this.$refs[`dictType${i}`][0].$el.style.color = '';
          }
        } else {
          for (let j = 1; j < length + 1; j++) {
            if (index !== j) { this.$refs[`dictType${j}`][0].$el.style.color = ''; }
            if (index === j) { this.$refs[`dictType${j}`][0].$el.style.color = '#ff1824'; }
          }
          this.$refs.isType0.$el.style.color = '';
        }
        this.sellType = data;
        this.queryGoods(1);
      },
      changeValue(index){
        this.isActive=index;
        this.isChecked=this.dataList[index];
      },
      load(){
        this.pagination.pageSize+=1;
        this.queryGoods(0);
      },
      queryGoods(type) {
        if(type===0){
          this.sellCategory='';
          this.sellType='';
        }
        var param={
          sellCategory:this.sellCategory,
          sellType:this.sellType,
          pageSize: this.pagination.pageSize,
          pageIndex: this.pagination.currentPage,
        };
        // console.info(param)
        this.$api.showGoods(param).then((response) => {
          if (response != null) {
            if (response.success) {
              this.dataList = response.data.records;
              this.pagination.total = response.data.total;
              // this.$message.success({ message: '操作成功', center: true });
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
        this.queryGoods(1);
      },
      handleCurrentChange(currentPage) {
        this.pagination.currentPage = currentPage;
        this.queryGoods(1);
      }
    }
  };
</script>

<style scoped>
  .active{
    border: 1px solid #a9298d;
    box-shadow: 10px 10px 16px #a3b6f2;
    /*background: #6d92a9;*/
    border-radius: 5px;
    background: #86a7f2;
    /*box-shadow: 0 0 7px #b53;*/
    /*background: #95a;*/
    border-radius: 5px;
  }
</style>
