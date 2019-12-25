<template>
  <div>
  <el-row style="padding-top: 15px;text-align: left;padding-left: 10px">
    <el-button size="medium" type="success" icon="el-icon-circle-plus-outline" @click="add()">新增</el-button>
    <el-button size="medium" type="primary" icon="el-icon-edit" @click="edit()">编辑</el-button>
    <el-button size="medium" type="warning" icon="el-icon-delete" @click="remove()">删除</el-button>
  </el-row>
    <query style="text-align: right;padding-right: 10px" :queryData="formModel"/>
    <d2-crud
      ref="d2Crud"
      :columns="columns"
      :data="resultData"
      :loading="loading"
      selection-row
      @selection-change="handleSelectionChange"
    />
    <create-or-update  :dialogShow="dialogShow"  @freshData="isFresh()" />
  </div>
</template>

<script>
import Query from '@/view/note/Query'
import CreateOrUpdate from '@/view/note/CreateOrUpdateNote'
export default {
    name: 'index',
    components:{
         Query,CreateOrUpdate
      },
  data(){
      return {
        formModel:{

        },
        loading:false,
        dialogShow:false,
        columns: [
          {
            title: '花销类型',
            key: 'noteType',
            component: {
              name: 'el-input-number',
              size: 'small'
            }
          },
          {
            title: '金额(元)',
            key: 'noteMoney',
            width:'100',
            component: {
              name: 'el-input-number',
              size: 'small'
            }
          },
          {
            title: '备注',
            key: 'noteRemark',
            width:'500'
          },
          {
            title: '创建人',
            key: 'creater',
            width: '100'
          },
          {
            title: '创建时间',
            key: 'createrTime',
            width: '200',
            formatter:function (row, column, cellValue, index) {
              return null!=cellValue?dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss'):null;}
          },
          {
            title: '修改人',
            key: 'modifier',
            width: '100'
          },
          {
            title: '修改时间',
            key: 'modifierTime',
            width: '200',
            formatter:function (row, column, cellValue, index) {
              return null!=cellValue?dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss'):null;}
          }
        ],
        resultData: []
      }
  },
  methods:{
    add(){
      this.dialogShow=true;
    },
    edit(){

    },
    remove(){

    },
    isFresh(){
      this.dialogShow=false;
      this.$message.success({message: '刷新', center: true})
    },
    handleSelectionChange(selection) {//多选框事件
      const ids= selection.map(re=>{
        return {
          id : re.idStr,
          sourceCode:re.sourceCode,
          destCode:re.destCode,
          enableTime:re.enableTime,
          disableTime:re.disableTime,
          status:re.isLive
        };
      });
      this.selectionData=Object.freeze(ids);//保存选择的id
    }
  },
  filters: {// 过滤器
    formatDate: function (cellValue) {
      return null != cellValue ? dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss') : null
    }
  }
}
</script>

<style scoped>

</style>
