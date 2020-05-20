<template>
    <div>
      <el-tabs v-model="activeName" @tab-click="handleClick" style="width: 800px;text-align: center;margin: 0 auto">
        <el-tab-pane label="收件箱" name="first">
          <comm-table :columsArray="columsSendList" :title="sendTitle" ref="comm" v-if="isShoujian"/>
        </el-tab-pane>
        <el-tab-pane label="发件箱" name="second">
          <comm-table :columsArray="columsToList" :title="toTitle" ref="comm"v-if="isFajian" />
        </el-tab-pane>
        <el-tab-pane label="未读消息" name="third">
          <comm-table :columsArray="columsUnReadList" :title="unReadTitle" ref="comm" v-if="isWeidu"/>
        </el-tab-pane>
        <el-tab-pane label="请点击标签页、进行切换..."  disabled></el-tab-pane>
      </el-tabs>
    </div>
</template>

<script>
  const columsSendList=[{prop:"fromName",label:"发件方",width:"180",sortable:true},{prop:"msg",label:"消息",className:"el-link-blue",width:"180"},{prop:"lastTime",label:"时间",width:"180",sortable:true}];
  const columsToList=[{prop:"toName",label:"收件方",width:"180",sortable:true},{prop:"msg",label:"消息",className:"el-link-blue",width:"180"},{prop:"lastTime",label:"时间",width:"180",sortable:true}];
  const columsUnReadList=[{prop:"fromName",label:"发件方",width:"180",sortable:true},{prop:"msg",label:"消息",className:"el-link-blue",width:"180"},{prop:"lastTime",label:"时间",width:"180",sortable:true}];
  import commTable from './myComponents/commTable'
    export default {
        name: "UserMsg",
      props:{
        initCount:{
          type:Number
        }
      },
      components:{
        commTable
      },
        data(){
          return {
            activeName: 'third',
            columsSendList:columsSendList,
            columsToList:columsToList,
            columsUnReadList:columsUnReadList,
            sendTitle:'shoujian',
            toTitle:'fajian',
            unReadTitle:'weidu',
            reset:true,
            isShoujian:false,
            isFajian:false,
            isWeidu:false
          }
        },
        methods:{
          handleClick(tab, event) {
            let param={};
            if(tab.label=='收件箱'){
              param.type=this.sendTitle;
              this.isShoujian=true;
              this.isFajian=false;
              this.isWeidu=false;
            }
            if(tab.label=='发件箱'){
              param.type=this.toTitle;
              this.isShoujian=false;
              this.isFajian=true;
              this.isWeidu=false;
            }
            if(tab.label=='未读消息'){
              param.type=this.unReadTitle;
              this.isShoujian=false;
              this.isFajian=false;
              this.isWeidu=true;
            }
            this.$refs.comm.getData();
          }
        },
        mounted(){
          if(this.initCount==0){
            this.activeName='first'
            this.isShoujian=true;
          }else{
            this.activeName='third'
            this.isWeidu=true;
          }
        }
    }
</script>

<style scoped>

</style>
