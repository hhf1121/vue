<template >
  <el-row class="tac">
    <el-col :span="10" style="position: relative;z-index: 9;width:200px">
      <el-menu default-active="1"
               unique-opened
               class="el-menu-vertical-demo"
               @open="handleOpen"
               @close="handleClose">
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span slot="title">行政配置</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="1-1" @click="addTab('省市区配置')"><div style="margin-right: -80px">省市区配置</div></el-menu-item>
          </el-menu-item-group>
        <!--  <el-menu-item-group title="分组2">
            <el-menu-item index="1-3">选项3</el-menu-item>
          </el-menu-item-group>
          <el-submenu index="1-4">
            <span slot="title">选项4</span>
            <el-menu-item index="1-4-1">选项1</el-menu-item>
          </el-submenu>-->
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-setting"></i>
            <span slot="title">字典配置</span>
          </template>
            <el-menu-item index="2-1" @click="addTab('花销类型配置')"><div style="margin-right: -80px">花销类型</div></el-menu-item>
        </el-submenu>
        <!--<el-submenu>-->
          <el-menu-item index="4" disabled>
            <i class="el-icon-document"></i>
            <span slot="title">待添加...</span>
          </el-menu-item>
        <!--</el-submenu>-->
      </el-menu>
    </el-col>
    <el-tabs style="position: relative;z-index: 1" v-model="editableTabsValue" type="card" closable @tab-remove="removeTab">
      <el-tab-pane
        v-for="(item, index) in editableTabs"
        :key="item.name"
        :label="item.title"
        :name="item.name">
        <component :is="item.content" style="margin-left: 50px"></component><!--根据入参，自动选择是哪个组件-->
       <!-- <district-map v-if="item.content=='省市区配置'"></district-map>
        <d2-table v-if="item.content=='花销类型配置'"></d2-table>-->
      </el-tab-pane>
    </el-tabs>
  </el-row>
</template>

<script>
import districtMap from '@/view/myComponents/districtMap'
import ConfigEdit from "@/view/ConfigEdit";
    export default {
        name: "BaseConfig",
        components:{ConfigEdit, districtMap},
        data() {
          return {
            editableTabsValue: '',
            editableTabs: [],
            tabIndex: 0
          }
        },
        methods: {
          handleOpen(key, keyPath) {
            // if(key=='1-1'){
            //   this.addTab("省市区配置");
            // }else{
            //
            // }
            // if(key=='2-1'){
            //   this.addTab("花销类型配置")
            // }else{
            //
            // }
            // console.log(key, keyPath);
          },
          handleClose(key, keyPath) {
            // console.log(key, keyPath);
          },
          addTab(targetName) {
            var tabs = this.editableTabs;
            var filter = tabs.filter(o=>o.title==targetName);
            if(filter.length!=0){//存在此标签
              this.editableTabsValue = filter[0].name;
              return;
            }
            let newTabName = ++this.tabIndex + '';
            let componentName='';
            if(targetName=="省市区配置"){//设置组件的名称
              componentName="districtMap";
            }
            if(targetName=="花销类型配置"){
              componentName="ConfigEdit";
            }
            this.editableTabs.push({
              title: targetName,
              name: newTabName,
              content: componentName,
              // component:districtMap,
            });
            this.editableTabsValue = newTabName;
          },
          removeTab(targetName) {
            let tabs = this.editableTabs;
            let activeName = this.editableTabsValue;
            if (activeName === targetName) {
              tabs.forEach((tab, index) => {
                if (tab.name === targetName) {
                  let nextTab = tabs[index + 1] || tabs[index - 1];
                  if (nextTab) {
                    activeName = nextTab.name;
                  }
                }
              });
            }
            this.editableTabsValue = activeName;
            this.editableTabs = tabs.filter(tab => tab.name !== targetName);
          }
        }
    }
</script>

<style scoped>
.el-menu-vertical-demo{
  top:0;
  bottom:10px;
  margin-left:0px;
  position: relative;
  width: 200px;
  min-height:600px;
  max-height:800px;
}
</style>
