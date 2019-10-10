<template>
  <div>
    <el-dialog :title="title" :visible.sync="addformVisable">
      <el-form :model="addForm" label-width="40px" :rules="addFormRules" ref="addForm">
        <el-form-item label="账号" prop="userName">
          <el-input v-model="addForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="passWord">
          <el-input v-model="addForm.passWord" type="password"></el-input>
        </el-form-item>
        <el-form-item label="名字" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="addForm.address"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="save('addForm')" style="text-align: center" v-if="isview">保存</el-button>
          <el-button type="success" @click="cancel" style="text-align: center">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'addOrUpdate',
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    var validateUserName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入账号'))
      } else {
        callback()
      }
    }
    var validateName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入名称'))
      } else {
        callback()
      }
    }
    var validateAddress = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入地址'))
      } else {
        callback()
      }
    }
    return {
      addForm: {
        userName: '',
        passWord: '',
        pass: '',
        address: '',
        name: ''
      },
      isview: true,
      addformVisable: false,
      title: '',
      addFormRules: {
        passWord: [
          {validator: validatePass, trigger: 'blur'}
        ],
        userName: [
          {validator: validateUserName, trigger: 'blur'}
        ],
        name: [
          {validator: validateName, trigger: 'blur'}
        ],
        address: [
          {validator: validateAddress, trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    save (addForm) {
      this.$refs[addForm].validate((valid) => {
        if (valid) {
          var entity = this.addForm
          if (entity.id) {
            // 后端请求数据post
            axios.post('/api/user/updateDataByVue', entity)
              .then(res => {
                if (res.data.data != null) {
                  this.$message.success({message: '更新成功', center: true})
                  this.addformVisable = false
                  this.$emit('freshData') // 调用父组件，的freshData事件，实现数据刷新
                } else {
                  this.$message.error({message: '更新失败', center: true})
                }
                // console.log(res)
              }).catch(err => {
                this.$message.error({message: '请求服务器失败', center: true})
                console.log(err)
              })

          } else {
            // 后端请求数据post
            axios.post('/api/user/insertDataByVue', entity)
              .then(res => {
                if (res.data.data != null) {
                  this.$message.success({message: '新增成功', center: true})
                  this.addformVisable = false
                  this.$emit('freshData') // 调用父组件，的freshData事件，实现数据刷新
                } else {
                  this.$message.error({message: '新增失败', center: true})
                }
                // console.log(res)
              }).catch(err => {
                this.$message.error({message: '请求服务器失败', center: true})
                console.log(err)
              })
          }
        } else {
          this.$message.error({message: '请正确填写内容', center: true})
          return false
        }
      })
    },
    init: function (data) {
      if (data === undefined || data === '') {
        this.title = '新增'
        this.addForm = {}
      } else {
        this.title = '修改'
        this.addForm = data
      }
      this.addformVisable = true
      this.isview = true
    },
    initView: function (data) {
      this.title = '查看'
      this.addForm = data
      this.addformVisable = true
      this.isview = false
    },
    cancel: function () {
      this.addformVisable = false
      this.$emit('freshData') // 调用父组件，的freshData事件，实现数据刷新
    }
  }
}
</script>

<style scoped>

</style>
