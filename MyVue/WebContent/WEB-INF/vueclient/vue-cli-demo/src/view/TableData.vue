<template>
  <div class="mystyle">
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
    <el-table
      :data="tableData"
      style="width: 100%">
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
        label="地址">
      </el-table-column>
    </el-table>
  </div>

</template>

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

<script>
import axios from 'axios'
import dayjs from 'dayjs'

export default {
  data() {
    return {
      tableData: [],
      params: {},
      dropdown: [],
      options: [{key: 1, value: '普通用户'}, {key: 2, value: 'VIP'}, {key: 3, value: '管理员'}],
      defaultDate: new Date()
    }
  },
  methods: {
    getData: function () {
      // 校验
      if (this.params.yes == null || this.params.yes === '') {
        this.$message.error({message: '请选择查询条件', center: true})
      } else {
        this.$message.success({message: '请求成功', center: true})
      }
      // 后端请求数据
      axios.get('/api/user/queryVIP?yes=' + this.params.yes)
        .then(res => {
          this.tableData = res.data.data
          // console.log(res)
        }).catch(err => {
          console.log(err)
        })
    },
    formatDate: function (cellValue) {
      var value = cellValue.createDate
      console.log('-------------------formatDate')
      return null != value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : null
    }
  },
  filters: {// 过滤器
    formatDate: function (cellValue) {
      console.log('-------------------filters')
      return null != cellValue ? dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss') : null
    }
  }
}
</script>
