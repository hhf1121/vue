<template>
  <div>
    <el-input
      style="width: 200px"
      placeholder="输入关键字进行过滤"
      v-model="filterText">
    </el-input>
    <el-tree
      draggable
      :data="addressOptions"
      node-key="id"
      ref="tree"
      lazy
      :load="loadNode"
      :filter-node-method="filterNode"
      @node-drag-start="handleDragStart"
      @node-drag-enter="handleDragEnter"
      @node-drag-leave="handleDragLeave"
      @node-drag-over="handleDragOver"
      @node-drag-end="handleDragEnd"
      @node-drop="handleDrop"
      :allow-drop="allowDrop"
      :allow-drag="allowDrag">
    </el-tree>
  </div>
</template>

<script>
  let thiscode='';
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
          districtParams:'1',//行政等级
          filterText:''
        };
      },
      methods: {
        filterNode(value, data) {
          if (!value)
            return true;
          if(data.label.indexOf(value)!=-1){
            thiscode=data.value;
          }
          return data.label.indexOf(value) !== -1||
            (thiscode&&data.parentCode==thiscode);
        },
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
        },
        handleDrop(draggingNode, dropNode, dropType, ev) {},
        allowDrop(draggingNode, dropNode, type) {},
        allowDrag(draggingNode) {},
        loadNode(node, resolve) {
          if(this.addressOptions.length!=0){
            if(node.data.level!=4){}
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
      watch: {
        filterText(val) {
          this.$refs.tree.filter(val);
        }
      },
      mounted(){
        this.getDataDistrict();
      }
    }
</script>

<style scoped>

</style>
