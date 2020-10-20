<template>
  <div>
    <el-form style="padding-top: 10px;padding-left:10px">
      <el-button  type="primary" icon="el-icon-circle-plus-outline" style="float: left;" round  @click="insertDate">新增</el-button>
      <el-button  v-if="isAdmin==1" type="info" icon="el-icon-message" style="float: right;" round  @click="sendAll">发布系统消息</el-button>
    <!--  <el-row style="float: right;color: dodgerblue">
        {{ defaultDate|formatDate}}
      </el-row>-->
    </el-form>
    <el-form :inline="true" ref="myForm" :model="params" label-width="80px" style="float: right;padding-top: 50px">
    <el-form-item label="创建日期" prop="createDate">
    <el-date-picker style="float:left;width: 200px;"
                    v-model="params.createDate"
                    type="date"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期">
      <!--value-format="yyyy-MM-dd"-->
    </el-date-picker>
    </el-form-item>
    <el-form-item label="用户类型" prop="yes">
    <el-select filterable v-model="params.yes" placeholder="请选择类型" style="float:left;width: 200px;">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.value"
        :value="item.key">
      </el-option>
    </el-select>
    </el-form-item>
      <el-form-item>
        <el-button type="success" @click="getData" style="float:left;">查询</el-button>
        <el-button type="warning" @click="getReset('myForm')" style="float:left;">重置</el-button>
      </el-form-item>
    </el-form>
    <div style="display: inline-block;padding-top: 100px;position: relative">
      <el-table
        :data="tableData"
        height="340"
        style="width: 100%;text-align: center;border: lightgrey 1px dashed">
        <el-table-column
          prop="userName"
          label="账号"
          width="150">
        </el-table-column>
        <el-table-column
          prop="createDate"
          label="创建日期"
          :formatter="formatDate"
          width="180">
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="address"
          label="地址"
          width="180">
        </el-table-column>
        <el-table-column
          label="操作"
          width="150">
          <template slot-scope="scope">
            <el-button @click="viewData(scope.row)" type="text" size="small">查看</el-button>
            <el-button type="text" @click="editData(scope.row)" size="small">编辑</el-button>
            <el-button type="text" @click="deleteData(scope.row)" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
      <add-or-update v-if="addOrUpdateVisible" :addformVisable="addOrUpdateVisible" ref="addOrUpdate" @freshData="getListData"></add-or-update>
  <el-pagination
                 @size-change="handleSizeChange"
                 @current-change="paginationCurrentChange"
                 :pagination="pagination"
                 :current-page="pagination.currentPage"
                 :page-sizes="[5, 10, 20]"
                 :page-size="5"
                 :background="true"
                 style="margin-right: 300px"
                 layout="total,-> ,prev, pager, next, sizes,jumper"
                 :total="pagination.total">
  </el-pagination>
  </div>
</template>

<script>
import axios from 'axios'
import dayjs from 'dayjs'
import addOrUpdate from '@/view/addOrUpdate'
let isSearch;
export default {
  name:"TableDate",
  components: {
    addOrUpdate
  },
  data() {
    return {
      tableData: [],
      params: {
        createDate:null,
        yes:''
      },
      dropdown: [],
      options: [{key: 1, value: '普通用户'}, {key: 2, value: 'VIP'}, {key: 3, value: '管理员'}],
      addOrUpdateVisible: false,
      pagination: {currentPage: 1, pageSize: 5},
      queryData:{},
      isAdmin:0
    }
  },
  methods: {
    getData: function () {
      // 校验
      if (!this.params.yes&&!this.params.createDate) {
        this.$message.error({message: '请选择查询条件', center: true})
        return
      } else {
        this.params.pageIndex=this.pagination.currentPage;
        this.params.pageSize=this.pagination.pageSize;
        this.queryData=this.params;
        // 后端请求数据
        this.$api.queryPage(this.queryData).then(res => {
            this.tableData = res.data.data.records;
            this.pagination.total = res.data.data.total;
            isSearch=true;
            // this.$message.success({message: '请求成功', center: true})
            // console.log(res)
          }).catch(err => {
          this.$message.error({message: '请求失败', center: true})
          console.log(err)
        })
      }
    },
    getReset(myForm){
      this.$refs[myForm].resetFields();
    },
    getListData () { // 刷新
      this.addOrUpdateVisible=false;
      this.getData()
    },
    insertDate () { // 新增
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init('')
      })
    },
    sendAll(){
      this.$prompt('请输入信息', "【系统公告】", {
        confirmButtonText: '发送',
        cancelButtonText: '取消',
        inputValidator:function (e) {
          if(!e)return false
          if(e&&e.length>0){
            return true;
          }
          return false
        },
        inputErrorMessage: '请输入公告'
      }).then(({ value }) => {
        debugger
        this.$api.sendAllWebSocket({"msg":'【系统公告】'+value}).then(re=>{
          if(re.success){
            this.$message.success({message: '公告发送成功', center: true});
          }
        }).catch(er=>{
          this.$message.error({message: '发送失败、请重试', center: true});
        })
      });

    },
    viewData: function (data) { // 查看
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.initView(data)
      })
    },
    editData: function (data) { // 编辑
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(data)
      })
    },
    deleteData: function (data) { // 删除
      this.$confirm('删除此数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.deleteById({'id':data.id}).then(res => {
          this.$message.success({message: '删除成功', center: true})
          this.getData()
        }).catch(err => {
          this.$message.error({message: '删除失败', center: true})
        })
      }).catch(() => {
        this.$message({type: 'info', message: '已取消删除'})
      })
    },
    formatDate: function (cellValue) {
      var value = cellValue.createDate
      // console.log('-------------------formatDate')
      return null != value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : null
    },
    paginationCurrentChange(currentPage) {
      if (!isSearch) {
        return this.$message.error({ message: '请先点击查询', center: true });
      }
      this.pagination.currentPage = currentPage;
      this.getData();
    },
    handleSizeChange(sizes) {
      if (!isSearch) {
        return this.$message.error({ message: '请先点击查询', center: true });
      }
      this.pagination.pageSize = sizes;
      this.getData();
    },
  },
  filters: {// 过滤器
    formatDate: function (cellValue) {
      return null != cellValue ? dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss') : null
    }
  },
  mounted () {
    setInterval(() => {
      this.defaultDate = new Date() // 动态时间
    }, 1000)

    if (this.$route.params.id !== '' && this.$route.params.id !== undefined) {
      this.params.yes = parseInt(this.$route.params.id)
      this.options.key = this.params.yes
      this.getData()
    }
    const USER=JSON.parse(sessionStorage.getItem('user'));
    if(USER){
      this.isAdmin=USER.id;
    }

  }
}
</script>

<style scoped>
  .mystyle {
    border: blueviolet 1px solid;
  }

  .el-dropdown {
    vertical-align: top;
  }

  .el-dropdown + .el-dropdown {
    margin-left: 15px;
  }

  .el-icon-arrow-down {
    font-size: 12px;
  }

</style>
