<template>
    <div>
      <el-button  type="warning" style="float: right" round v-show="title=='weidu'" @click="isRead()">标记已读</el-button>
      <el-button  type="danger" style="float: left" round @click="deleteData(1)">批量删除</el-button>
      <el-table
        :data="fromData"
        height="500"
        @cell-click="isView"
        @selection-change="handleSelectionChange"
        style="width: 100%;text-align: center;border-radius: 10px; box-shadow:5px 5px  #8cc5ff">
        <el-table-column
          type="selection"
          width="35">
        </el-table-column>
        <el-table-column v-for="(co,i) in columsArray" :key="i"
          :sortable="co.sortable"
          :prop="co.prop"
          :label="co.label"
          :class="co.className"
          :width="co.width">
        </el-table-column>
        <el-table-column
          label="操作"
          width="150">
          <template slot-scope="scope">
            <el-button type="text" v-if="title!='fajian'" @click="sendMsg(scope.row)" size="small">回复</el-button>
            <el-button type="text" @click="deleteData(scope.row)" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
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
      <el-dialog
        title="消息内容"
        :visible.sync="centerDialogVisible"
        width="30%"
        center>
        <span>{{showMsg}}</span>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
      <add-or-update v-if="isUpdate" :addformVisable="isUpdate" :userId="userId" :currentId="currentId" ref="addOrUpdate" @freshData="getListData"></add-or-update>
    </div>
</template>

<script>
  import addOrUpdate from '../addOrUpdate'
  import dayjs from 'dayjs'
    export default {
      name: "commTable",
      components:{
        addOrUpdate
      },
      props:{
          columsArray: {
            type: Array
          },
          title:{
            type:String
          }
        },
      data(){
          return{
            fromData:[],
            baseMsg:{},
            pagination: {currentPage: 1, pageSize: 5},
            centerDialogVisible:false,
            showMsg:'',
            multipleSelection:[],
            titleType:'',
            isUpdate:false,
            currentId:0,
            userId:0
          }
      },
      methods:{
      getData(){
        this.baseMsg.pageIndex=this.pagination.currentPage;
        this.baseMsg.pageSize=this.pagination.pageSize;
        if(this.title=='weidu'){//未读
          this.baseMsg.type="1";
          this.baseMsg.status=0;
        }
        if(this.title=='shoujian'){//收件
          this.baseMsg.type="1";
          // this.baseMsg.status=1;
        }else if(this.title=='fajian'){//发件
          this.baseMsg.type="2";
        }
        this.$api.getMsg(this.baseMsg).then(re=>{
          this.fromData=re.records;
          this.fromData.forEach(o=>{
            o.lastTime= this.formatDate(o);
          })
          this.pagination.total = re.total;
          // this.$message.success({message: '请求成功', center: true})
        }).catch(er=>{
          this.$message.error({message: '请求失败', center: true})
        })
      },
      handleSizeChange(sizes) {
        this.pagination.pageSize = sizes;
        this.getData();
      },
      paginationCurrentChange(currentPage) {
        this.pagination.currentPage = currentPage;
        this.getData();
      },
      formatDate: function (cellValue) {
        var value = cellValue.lastTime
        return null != value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : null
      },
      isRead(){
        if(this.multipleSelection.length==0){
          this.$message.error({message: '至少选中一条数据', center: true})
          return
        }else{
          this.$confirm('标记选择的信息为已读？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(res => {
            this.baseMsg=this.multipleSelection;
            this.$api.signRead(this.baseMsg).then(res => {
              this.$message.success({message: '操作成功', center: true})
              this.getData()
            }).catch(err => {
              this.$message.error({message: '操作失败', center: true})
            })
          }).catch(err=>{
            this.$message({type: 'info', message: '已取消操作'})
          })
        }
      },
      isView(row, column, cell, event){
        if(column.property=='msg'){
          this.centerDialogVisible=true;
          this.showMsg=row.msg;
        }
        if(column.property=='fromName'||column.property=='toName'){
          this.isUpdate=true;
          if(column.property=='fromName'){
            this.userId=row.fromId;
          }
          if(column.property=='toName'){
            this.userId=row.toId;
          }
        }
      },
      getListData(){
        this.isUpdate=false;
      },
      deleteData(data){
        if(data==1){//批量删除
          if(this.multipleSelection.length==0){
            this.$message.error({message: '至少选中一条数据', center: true})
            return
          }else{
            this.$confirm('删除选择的信息？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              debugger;
              this.baseMsg=this.multipleSelection;
              this.$api.deleteMsgs(this.baseMsg).then(res => {
                this.$message.success({message: '删除成功', center: true})
                this.getData()
              }).catch(err => {
                this.$message.error({message: '删除失败', center: true})
              })
            }).catch(() => {
              this.$message({type: 'info', message: '已取消删除'})
            })
          }
        }else{
          this.$confirm('删除此消息, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            debugger
            this.baseMsg=data;
            this.$api.deleteMsgs(this.baseMsg).then(res => {
              this.$message.success({message: '删除成功', center: true})
              this.getData()
            }).catch(err => {
              this.$message.error({message: '删除失败', center: true})
            })
          }).catch(() => {
            this.$message({type: 'info', message: '已取消删除'})
          })
        }
      },
      sendMsg(data){
        const USER=JSON.parse(sessionStorage.getItem('user'));
        this.$prompt('请输入信息', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValidator:function (e) {
            if(!e)return false
            if(e&&e.length>0){
              return true;
            }
            return false
          },
          inputErrorMessage: '请输入回复信息'
        }).then(({ value }) => {
          //1.用户互发信息(通过mq，转储到mysql，定时轮询db)
          let param={};
          param.fromId= data.toId;
          param.toId = data.fromId;
          param.msg = value;
          param.userName=USER.userName;
          this.$api.sendMsg(param).then(re=>{
            if(re.success){
              this.$message.success({message: '消息发送成功', center: true});
            }
          }).catch(er=>{
            this.$message.error({message: '发送失败、请重试', center: true});
          })
          //2.用户互发信息(通过websocket,不保存数据)
        //   this.$api.sendMsgByWebSocket(param).then(re=>{
        //       if(re.success){
        //         this.$message.success({message: '消息发送成功', center: true});
        //       }
        //     }).catch(er=>{
        //       this.$message.error({message: '发送失败、请重试', center: true});
        //     })
        // }).catch(() => {
        //   this.$message({
        //     type: 'info',
        //     message: '取消回复'
        //   });
        });
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      }
      },
      mounted(){
        this.getData();
      }
    }
</script>

<style scoped>
  .el-link-blue{
    color: #409EFF;
    cursor: pointer;
    text-decoration: underline;
  }
</style>
