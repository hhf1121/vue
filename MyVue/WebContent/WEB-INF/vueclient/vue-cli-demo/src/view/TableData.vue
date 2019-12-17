<template>
  <div class="mystyle">
    <el-row  style="padding-left: 30px;">
      <el-button size="mini" type="primary" icon="el-icon-circle-plus-outline"  @click="insertDate">新增</el-button>
    </el-row>
    {{ defaultDate|formatDate}}
    <el-date-picker style="float:left;width: 200px;"
                    v-model="params.data"
                    type="date"
                    placeholder="选择日期">
    </el-date-picker>
    <el-select v-model="params.yes" placeholder="请选择类型" style="float:left;width: 200px;">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.value"
        :value="item.key">
      </el-option>
    </el-select>
    <el-button type="success" @click="getData" style="float:left;">查询</el-button>
    <el-button type="success" @click="getReset" style="float:left;">重置</el-button>
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="userName"
          label="账号"
          width="180">
        </el-table-column>
        <el-table-column
          prop="createDate"
          label="日期"
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
      <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @freshData="getListData"
                     style="width: 500px"></add-or-update>
  <el-pagination @size-change="handleSizeChange"
                 @current-change="paginationCurrentChange"
                 :pagination="pagination"
                 :current-page="pagination.currentPage"
                 :page-sizes="[5, 10, 20]"
                 :page-size="5"
                 :background="true"
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
  components: {
    addOrUpdate
  },
  data() {
    return {
      tableData: [],
      params: {},
      dropdown: [],
      options: [{key: 1, value: '普通用户'}, {key: 2, value: 'VIP'}, {key: 3, value: '管理员'}],
      defaultDate: new Date(),
      addOrUpdateVisible: false,
      pagination: {currentPage: 1, pageSize: 10},
      queryData:{}
    }
  },
  methods: {
    getData: function () {
      debugger;
      // 校验
      if (!this.params.yes&&!this.params.data) {
        this.$message.error({message: '请选择查询条件', center: true})
        return
      } else {
        this.params.pageIndex=this.pagination.currentPage;
        this.params.pageSize=this.pagination.pageSize;
        this.queryData=this.params;
        // 后端请求数据
        axios.post('/api/springBoot/user/queryVIP',this.queryData)
          .then(res => {
            this.tableData = res.data.data
            isSearch=true;
            this.$message.success({message: '请求成功', center: true})
            // console.log(res)
          }).catch(err => {
          this.$message.error({message: '请求失败', center: true})
          console.log(err)
        })
      }
    },
    getReset(){
      this.params.date="";
      this.params.yes="";
    },
    getListData () { // 刷新
      this.getData()
    },
    insertDate () { // 新增
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init('')
      })
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
        axios.get('api/springBoot/vue/deleteByVue?id=' + data.id).then(res => {
          this.$message.success({message: '删除成功', center: true})
          this.getData()
        }).catch(err => {
          this.$message.error({message: '删除失败', center: true})
        })
        this.$message({type: 'success', message: '删除成功!'})
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    formatDate: function (cellValue) {
      var value = cellValue.createDate
      console.log('-------------------formatDate')
      return null != value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : null
    },
    paginationCurrentChange(currentPage) {
      if (!isSearch) {
        return this.$message.error({ message: '请先点击查询', center: true });
      }
      this.pagination.currentPage = currentPage;
      this.refresh();
    },
    handleSizeChange(sizes) {
      if (!isSearch) {
        return this.$message.success({ message: '请先点击查询', center: true });
      }
      this.pagination.pageSize = sizes;
      this.refresh();
    },
  },
  filters: {// 过滤器
    formatDate: function (cellValue) {
      console.log('-------------------filters')
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
