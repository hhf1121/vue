<template>
  <div>
    <el-row style="padding-top: 15px;text-align: left;padding-left: 10px">
      <el-button size="medium" type="success" icon="el-icon-circle-plus-outline" @click="add()">新增</el-button>
      <el-button size="medium" type="warning" icon="el-icon-delete" @click="remove()">删除</el-button>
      <el-button size="medium" type="primary" icon="el-icon-star-off" @click="view()">查看</el-button>
    </el-row>
    <query style="text-align: right;padding-right: 10px" :queryData.sync="formModel" @queryFresh="query"/>
    <d2-crud
      ref="d2Crud"
      :columns="columns"
      :data="resultData"
      :loading="loading"
      :options="options"
      selection-row
      @selection-change="handleSelectionChange"
      :rowHandle="rowHandle"
      @cell-data-change="handleCellDataChange"
      @edit-emit="edit"
      @update-emit="update"
    />

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
    <create-or-update :dialogShow="dialogShow" :userName="userName" :title="isView" :ruleForm="dataForm" :isView="isViewFlag" v-if="dialogShow" @freshData="isFresh()"/>
  </div>
</template>
<script>
import Query from '@/view/note/Query'
import CreateOrUpdate from '@/view/note/CreateOrUpdateNote'
import dayjs from 'dayjs'

let isSearch
const styleWidth = { width: '90%' };
const exportColumns = [
  { label: '标题', prop: 'noteTitle', width: styleWidth },
  { label: '花销类型', prop: 'noteType', width: styleWidth },
  { label: '地址', prop: 'noteAddress', width: styleWidth },
  { label: '金额(元)', prop: 'noteMoney', width: styleWidth },
  { label: '备注', prop: 'noteRemark', width: styleWidth },
  { label: '用户', prop: 'noteName', width: styleWidth, sortable: true },
  { label: '创建时间', prop: 'createrTime', width: styleWidth }
];
export default {
  name: 'index',
  props:{
    userName:{
      type:String
    }
  },
  components: {
    Query, CreateOrUpdate
  },
  data() {
    return {
      formModel: {},
      pagination: {currentPage: 1, pageSize: 5},
      loading: false,
      dialogShow: false,
      columns: [
        {
          title: '标题',
          position:'center',
          key: 'noteTitle',
          minWidth: '8%',
        },
        {
          title: '花销类型',
          key: 'noteType',
          minWidth: '7%',
          size: 'small',
          sortable: true,//排序
          component: {
            name: 'el-select',
            options: this.NoteType,
            disabled: true
          },
        },
        {
          title: '地址',
          key: 'noteAddress',
          showOverflowTooltip:true,//内容过长,鼠标显示
          minWidth: '6%',
        },
        {
          title: '金额(元)',
          key: 'noteMoney',
          minWidth: '8%',
          component: {
            name: 'el-input-number',
            size: 'small',
            disabled: true
          }
        },
        {
          title: '备注',
          key: 'noteRemark',
          minWidth: '22%',
          component: {
            name: 'el-input',
            size: 'small',
            disabled: true
          }
        },
        {
          title: '用户',
          key: 'noteName',
          minWidth: '6%',
        },
        {
          title: '创建时间',
          key: 'createrTime',
          minWidth: '12%',
          formatter: function (row, column, cellValue, index) {
            return null != cellValue ? dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss') : null
          }
        },
        {
          title: '修改人',
          key: 'modifier',
          minWidth: '6%',
          disabled: true,
        },
        {
          title: '修改时间',
          key: 'modifierTime',
          minWidth: '15%',
          component: {
            name: 'el-date-picker',
            size: 'small',
            type:"datetime",
            disabled: true
          },
          formatter: function (row, column, cellValue, index) {
            return null != cellValue ? dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss') : null
          }
        }
      ],
      rowHandle: {
        custom: [
          {
            text: '编辑',
            type: 'warning',
            size: 'small',
            emit: 'edit-emit'
          },
          {
            text: '保存',
            type: 'success',
            size: 'small',
            emit: 'update-emit'
          },
        ],
        minWidth: '8%',
      },
      options: {
        maxHeight: '500',
        height: '500px'
        // style:'center'
      },
      resultData: [],
      updateData: {},
      selectionDataId:[],
      selectionData:{},
      isView:"",
      isViewFlag:true,
      dataForm:{}
    }
  },
  methods: {
    add() {
      this.dialogShow = true;
      this.dataForm={};
      this.isView="";
      this.isViewFlag=true;
      // this.userName=this.userName;
    },
    //查看，回显
    view(){
      let length = this.selectionData.length;
      if(length!=1){
        this.$message.error({message: '请选择一条数据，进行操作', center: true})
      }else{
        this.dialogShow = true;
        this.isView="查看";
        this.isViewFlag=false;
        this.dataForm=this.selectionData[0];
      }
    },
    edit({index,row}) {
      row;
      // this.$refs.d2Crud[index].custom.component.disabled=false;
      let columns = this.columns
      columns[1].component.disabled = false
      columns[3].component.disabled = false
      columns[4].component.disabled = false
      let button = this.rowHandle.custom
      button[0].show = false
      button[1].show = true
    },
    handleEdit(row){
      row;
    },
    update(row) {
      // let button = this.rowHandle.custom
      // button[1].disabled = true;
      if(this.updateData.id){
          this.$api.updateNote(this.updateData).then(re=>{
            if(re.success){
              this.$message.success({message: '更新成功', center: true})
              this.updateData.id=undefined;
              this.resetDisable();
              this.query();
            }else{
              this.$message.error({message: '更新失败', center: true})
            }
          }).catch(err=>{
            this.$message.error({message: '请求出错', center: true})
          })
      }else{

        this.resetDisable();
      }
      // button[1].disabled = false;
    },
    resetDisable(){
      let button = this.rowHandle.custom
      button[0].show = true
      button[1].show = false
      let row = this.columns
      row[1].component.disabled = true
      row[3].component.disabled = true
      row[4].component.disabled = true
    },
    remove() {
        let length = this.selectionDataId.length;
        if(length>0){
          this.$confirm('删除此数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            var deleteEntity={
              ids:[]
            };
            deleteEntity.ids=this.selectionDataId;
            this.$api.deleteNote(deleteEntity).then(re=>{
                if(re.success){
                  this.$message.success({message: '删除成功', center: true})
                  this.query();
                }else{
                  this.$message.error({message: '删除失败', center: true})
                }
            }).catch(err=>{
              this.$message.error({message: '请求失败', center: true})
            })
          }).catch(()=>{})
        }else{
          this.$message({type: 'info', message: '已取消删除',center:true})
        }
    },
    isFresh() {
      this.dialogShow = false
      this.query()
    },
    query() {
      this.resetDisable();
      this.params = {}
      this.params = this.formModel
      this.params.pageIndex = this.pagination.currentPage
      this.params.pageSize = this.pagination.pageSize
      // 后端请求数据
      this.$api.queryPageNotes(this.params).then(res => {

        this.resultData = res.records
        this.pagination.total = res.total
        isSearch = true
        // this.$export.excel({
        //   title: '花销明细',
        //   columns: exportColumns,
        //   data: res.records
        // }).then(() => {
        //   this.$message.success({ message: '导出成功', center: true });
        // });
      }).catch(err => {
        this.$message.error({message: '请求失败', center: true})
        // console.log(err)
      })

    },
    handleSelectionChange(selection) {//多选框事件
      const ids = selection.map(re => {
        return re.idStr
      })
      this.selectionDataId = Object.freeze(ids)//保存选择的id
      this.selectionData = Object.freeze(selection)//保存对象
    },
    handleSizeChange(sizes) {
      if (!isSearch) {
        return this.$message.error({message: '请先点击查询', center: true})
      }
      this.pagination.pageSize = sizes
      this.query()
    },
    paginationCurrentChange(currentPage) {
      if (!isSearch) {
        return this.$message.error({message: '请先点击查询', center: true})
      }
      this.pagination.currentPage = currentPage
      this.query()
    },
    handleCellDataChange({rowIndex, key, value, row}) {//行内数据变化时
      this.updateData = row
    }
  },
  filters: {// 过滤器
    formatDate: function (cellValue) {
      return null != cellValue ? dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss') : null
    }
  },
  mounted() {
    //默认编辑显示、保存不显示
    let button = this.rowHandle.custom
    button[0].show = true
    button[1].show = false
  }
}
</script>

<style scoped>

</style>
