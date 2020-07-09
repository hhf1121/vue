<template>
  <el-tree
    :data="addressOptions"
    node-key="id"
    lazy
    :load="loadNode"
    @node-drag-start="handleDragStart"
    @node-drag-enter="handleDragEnter"
    @node-drag-leave="handleDragLeave"
    @node-drag-over="handleDragOver"
    @node-drag-end="handleDragEnd"
    @node-drop="handleDrop"
    draggable
    :allow-drop="allowDrop"
    :allow-drag="allowDrag">
  </el-tree>
</template>

<script>
  const flag=false;
  export default {
      name: "districtMap",
      data() {
        return {
          addressOptions: [],
          defaultProps: {
            children: 'children',
            label: 'label'
          },
          districtParams:'1'//行政等级
        };
      },
      methods: {
        getDataDistrict(){
          this.$api.getSelectDistrictByLevel({"level":this.districtParams}).then(re=>{
            if(!re.success){
              this.$message.error({message: re.error, center: true});
              return;
            }
            this.addressOptions=re.data;
          }).catch(err=>{
            this.$message.error({message: '获取地址信息失败', center: true});
          })
        },
        handleDragStart(node, ev) {},
        handleDragEnter(draggingNode, dropNode, ev) {},
        handleDragLeave(draggingNode, dropNode, ev) {},
        handleDragOver(draggingNode, dropNode, ev) {},
        handleDragEnd(draggingNode, dropNode, dropType, ev) {//拖拽结束时（可能未成功）触发的事件
          debugger
          if('inner'===dropType){
            this.$message.error({message: '不允许操作', center: true});
            return;
          }
          draggingNode
          dropNode
          dropType
          ev
        },
        handleDrop(draggingNode, dropNode, dropType, ev) {},
        allowDrop(draggingNode, dropNode, type) {
          debugger
          if(draggingNode.data.level!=dropNode.data.level){
            this.$message.error({message: '不允许操作', center: true});
            return true;
          }
        },
        allowDrag(draggingNode) {
          return draggingNode.data.label.indexOf('三级 3-2-2') === -1;
        },
        loadNode(node, resolve) {
          if(this.addressOptions.length!=0){
            if(node.data.level!=4){

            }
            this.$api.getDistrictByCode({"code":node.data.value}).then(re=>{
              if(!re.success){
                this.$message.error({message: re.error, center: true});
                resolve();
                return;
              }
              resolve(re.data);
            }).catch(err=>{
              this.$message.error({message: '获取地址信息失败', center: true});
            })
          }
        }
      },
      mounted(){
        this.getDataDistrict();
      }
    }
</script>

<style scoped>

</style>
