<template>
    <el-dialog
        :title="isTitle"
        :visible="dialogShow"
        width="630px"
        :close-on-click-modal="false"
        @close="cancelForm">
        <div style="height: 660px;position: relative">
            <div style="position: absolute;left: 5px;border: 1px solid dodgerblue">
                <img
                    :src="fileList[imgIndex]"
                    alt="商品预览图"
                    width="300px">
            </div>
            <div style="position: absolute;left: 5px;top:300px">
                <el-carousel
                    :interval="-1"
                    type="card"
                    height="100px"
                    style="width: 300px"
                    @change="isChanged">
                    <el-carousel-item
                        v-for="(item,index) in fileList"
                        :key="index">
                        <h3 class="medium">
                            <img
                                :src="item"
                                width="100px">
                        </h3>
                    </el-carousel-item>
                </el-carousel>
            </div>
            <div style="position: absolute;left: 315px;text-align: left">
                <b style="font-size: 20px">{{ data.sellTitle }}</b>
                <br>
                <br>
                <el-button disabled plain style="color: #1890ff">
                  {{data.sellType | sellTypeStr(dictSellGoodsType) }}
                </el-button>
                <el-button disabled plain style="color: #1890ff">
                  {{data.sellCategory | sellCategoryStr(dictGoodsCategory)}}
                </el-button>
                <p>
                    金额:
                    <b style="text-align: center;font-size: 20px;" :style="data.sellStatus==1?'color:gray':'color:red'">{{ data.goodsFee }}<span v-if="data.goodsFee!=='面议'">元</span></b>
                </p>
                <br>
                <div style="position: relative;bottom: 5px">
                  <p>发布人:{{ data.userName }}</p>
                  <p> 联系方式:{{ data.userPhone }}</p>
                  <p>发布时间:{{ data.updateTime | myFormatDate }}</p>
                </div>
            </div>
            <div style="position: absolute;left: 5px;top:430px;width: 100%;height:180px;text-align: left">
                <b>详情介绍</b>
                <el-input :autosize="{ minRows: 2, maxRows: 8}"  v-model="data.sellContent" type="textarea" style="height:180px" :disabled="true" />
                <!--<p>{{ data.sellContent }}</p>-->
            </div>
        </div>
    </el-dialog>
</template>
<script>
import dayjs from 'dayjs';
export default {
    name: 'GoodsDetail',
    filters: {
        myFormatDate(data) {
            return data != null ? dayjs(data).format('YYYY-MM-DD HH:mm:ss') : null;
        }
    },
    props: {
        data: {
            type: Object,
            default() {
                return {};
            }
        },
        dialogShow: {
            type: Boolean,
            default() {
                return false;
            }
        }
    },
    data() {
        return {
            isTitle: '商品详情',
            fileList: [],
            imgIndex: 0,
            dictGoodsCategory:JSON.parse(sessionStorage.getItem('dictGoodsCategory')),
            dictSellGoodsType:JSON.parse(sessionStorage.getItem('dictSellGoodsType')),
            // dialogShow: false
        };
    },
    mounted() {
        const data = this.data;
        this.fileList = data.sellGoodsPhotos.map((o) => {
            return o.goodsPhoto;
        });
    },
    methods: {
        cancelForm() {
            this.$emit('flushGoods'); // 调用父组件，的freshData事件，实现数据刷新
        },
        isChanged(e, v) {
            this.imgIndex = e;
        }
    },
  filters: {// 过滤器
  sellTypeStr: function (cellValue,dict) {
    // var ts = this.dictSellGoodsType.filter(o=>o.value==cellValue);
    var ts = dict.filter(o=>o.value==cellValue);
    // console.info(ts)
    return ts[0].label;
  },
  sellCategoryStr: function (cellValue,dict) {
    // var ts = this.dictGoodsCategory.filter(o=>o.value==cellValue);
    var ts = dict.filter(o=>o.value==cellValue);
    // console.info(ts)
    return ts[0].label;
  },
}
};
</script>

<style scoped>
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 100px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
  /deep/ .el-dialog__header {
    background: #F2F2F2;
  }
</style>
