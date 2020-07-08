<template>
  <el-tree
    :data="addressOptions"
    node-key="id"
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
  export default {
      name: "districtMap",
      data() {
        return {
          addressOptions: [],
          defaultProps: {
            children: 'children',
            label: 'label'
          },
          districtParams:'1,2'//行政等级
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
        handleDragStart(node, ev) {
          console.log('drag start', node);
        },
        handleDragEnter(draggingNode, dropNode, ev) {
          console.log('tree drag enter: ', dropNode.label);
        },
        handleDragLeave(draggingNode, dropNode, ev) {
          console.log('tree drag leave: ', dropNode.label);
        },
        handleDragOver(draggingNode, dropNode, ev) {
          console.log('tree drag over: ', dropNode.label);
        },
        handleDragEnd(draggingNode, dropNode, dropType, ev) {
          console.log('tree drag end: ', dropNode && dropNode.label, dropType);
        },
        handleDrop(draggingNode, dropNode, dropType, ev) {
          console.log('tree drop: ', dropNode.label, dropType);
        },
        allowDrop(draggingNode, dropNode, type) {
          if (dropNode.data.label === '二级 3-1') {
            return type !== 'inner';
          } else {
            return true;
          }
        },
        allowDrag(draggingNode) {
          return draggingNode.data.label.indexOf('三级 3-2-2') === -1;
        }
      },
      mounted(){
        this.getDataDistrict();
      }
    }
</script>

<style scoped>

</style>
