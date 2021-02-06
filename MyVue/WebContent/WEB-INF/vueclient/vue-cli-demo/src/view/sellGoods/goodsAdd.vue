<template>
    <el-form ref="goodsForm" :model="portalGoodsDto" :rules="goodsRules" label-width="100px" style="width: 50%">
        <el-form-item label="标题" prop="sellTitle">
            <el-input v-model="portalGoodsDto.sellTitle" :disabled="isEdit!==0" />
        </el-form-item>
        <el-form-item label="内容" prop="sellContent">
            <el-input v-model="portalGoodsDto.sellContent" type="textarea" :disabled="isEdit!==0" />
        </el-form-item>
        <el-dialog :visible.sync="imgVisible" :modal="false" :width="dialogWidth">
            <img :src="dialogImageUrl" :width="imgWidth" alt="" @load="onLoadImg">
        </el-dialog>
        <el-form-item label="附件" prop="sellGoodsPhotos">
            <el-upload
                v-model="portalGoodsDto.sellGoodsPhotos"
                auto-upload
                :disabled="isEdit!==0"
                style="width: 220px"
                :limit="filelimit"
                action="/api/springBoot/vue/loadingFile"
                accept="image/jpeg,image/png,image/jpg"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                :on-exceed="onExceed"
                :file-list="fileList"
                list-type="text">
                <el-button size="small" type="primary">
                    上传附件
                </el-button>
                <!--<span style="color: red; position: absolute; right: 0px;top:5px">只能上传jpg/png文件</span>-->
            </el-upload>
        </el-form-item>
        <el-form-item label="类型" prop="sellType">
            <el-radio-group v-model="portalGoodsDto.sellType">
                <el-radio-button v-for="(item,index) in dictSellGoodsType" :key="index" :label="item.value">
                    {{ item.label }}
                </el-radio-button>
            </el-radio-group>
            <!--<el-checkbox-group v-model="portalGoodsDto.sellType">
                <el-checkbox-button v-for="city in cities" :key="city" :label="city">
                    {{ city }}
                </el-checkbox-button>
            </el-checkbox-group>-->
        </el-form-item>
        <el-form-item label="类别" prop="sellCategory">
            <el-radio-group v-model="portalGoodsDto.sellCategory">
                <el-radio-button
                    v-for="(item,index) in dictGoodsCategory"
                    :key="index"
                    :label="item.value">
                    {{ item.label }}
                </el-radio-button>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="金额" prop="goodsFee">
            <el-input v-model="portalGoodsDto.goodsFee" type="number" :disabled="isEdit!==0" />
        </el-form-item>
        <el-form-item label="联系人" prop="userName">
            <el-input v-model="portalGoodsDto.userName" :disabled="isEdit!==0" />
        </el-form-item>
        <el-form-item label="联系电话" prop="userPhone">
            <el-input v-model="portalGoodsDto.userPhone" :disabled="isEdit!==0" />
        </el-form-item>
        <el-form-item label="地址" prop="userAddress">
            <el-input v-model="portalGoodsDto.userAddress" :disabled="isEdit!==0" />
        </el-form-item>
        <el-form-item style="margin: 0 auto;text-align: center">
            <el-button type="primary" :disabled="isEdit==='-1'" @click="onSubmit('goodsForm')">
                保存
            </el-button>
            <el-button @click="cancelForm">
                取消
            </el-button>
        </el-form-item>
    </el-form>
</template>

<script>
export default {
    name: 'GoodsAdd',
    data() {
        const checkPhone = (rule, value, callback) => {
            const phoneReg = /^1[3|4|5|7|8][0-9]{9}$/;
            if (!value) {
                return callback(new Error('电话号码不能为空'));
            }
            setTimeout(() => {
                if (!Number.isInteger(+value)) {
                    callback(new Error('请输入数字'));
                } else if (phoneReg.test(value)) {
                    callback();
                } else {
                    callback(new Error('电话号码格式不正确'));
                }
            }, 100);
        };
        return {
            goodsRules: {
                sellTitle: [
                    { required: true, message: '请输入标题', trigger: 'blur' },
                    { min: 1, max: 20, message: '最长20个字符', trigger: 'blur' }
                ],
                sellContent: [
                    { required: true, message: '请输入内容', trigger: 'blur' },
                    { min: 1, max: 100, message: '最长100个字符', trigger: 'blur' }
                ],
                sellGoodsPhotos: [
                    { required: true, message: '请上传附件', trigger: 'blur' }
                ],
                sellCategory: [
                    { required: true, message: '请选择类别', trigger: 'blur' }
                ],
                sellType: [
                    { required: true, message: '请选择类型', trigger: 'blur' }
                ],
                userAddress: [
                    { required: true, message: '请填写地址', trigger: 'blur' }
                ],
                goodsFee: [
                    { required: true, message: '金额不能为空', trigger: 'blur' }
                ],
                userName: [
                    { required: true, message: '联系人不能为空', trigger: 'blur' }
                ],
                userPhone: [
                    { required: true, message: '联系电话不能为空', trigger: 'blur' },
                    { validator: checkPhone, type: 'number', trigger: 'blur' }
                ]
            },
            currentUser: {},
            portalGoodsDto: {
                sellGoodsPhotos: [],
                sellType: []
            },
            isEdit: 0,
            fileList: [],
            filelimit: 10,
            imgVisible: false,
            dialogImageUrl: '',
            dialogWidth: '',
            imgWidth: '',
            dictGoodsCategory: JSON.parse(sessionStorage.getItem('dictGoodsCategory')),
            dictSellGoodsType: JSON.parse(sessionStorage.getItem('dictSellGoodsType'))
            // checkboxGroupValues: [''],
            // cities: ['上海', '北京', '广州', '深圳']
        };
    },
    mounted() {
        this.currentUser= JSON.parse(sessionStorage.getItem('user'));
        this.portalGoodsDto.userName=this.currentUser.name;
        this.portalGoodsDto.userCode=this.currentUser.userName;
    },
    methods: {
        onLoadImg(e) { // 由于dialog的高度是自适应的，只要获取图片宽度赋值给dialog就能实现
            const img = e.target;
            let width = 0;
            if (img.fileSize > 0 || (img.width > 1 && img.height > 1)) {
                width = img.width + 40;
            }
            if (width > 950) {
                this.dialogWidth = '50%';
                this.imgWidth = '80%';
            } else {
                this.imgWidth = '100%';
                this.dialogWidth = width + 'px';
            }
        },
        handleRemove(file, fileList) { // 点击删除的时候
            this.portalGoodsDto.sellGoodsPhotos = this.portalGoodsDto.sellGoodsPhotos.filter(o => o.goodsPhoto !== file.response.data);
        },
        handlePreview(file) { // 点击的时候
            this.imgVisible = true;
            if (!file.url) {
                this.dialogImageUrl = file.response.data;
            } else {
                this.dialogImageUrl = file.url;
            }
        },
        handleAvatarSuccess(res, file) { // 请求成功之后
            const obj = {
                id: null,
                goodsPhoto: res.data
            };
            this.portalGoodsDto.sellGoodsPhotos.push(obj);
        },
        beforeAvatarUpload(file) { // 请求操作之前
            const isImg = file.type === 'image/jpeg' || file.type === 'image/png';
            // const isLt2M = file.size / 1024 / 1024 < 6;

            if (!isImg) {
                this.$message.error('上传图片只能是 JPG/JPEG/PNG 格式!');
                return false;
            }
            return isImg;
        },
        onExceed(files, fileList) { // 文件超出个数限制时的钩子
            this.$message.error('只能上传一张图片，请手动删除之后再上传!');
        },
        cancelForm() {
            this.$refs.goodsForm.resetFields();
            // this.$emit('flushIndex'); // 调用父组件，的freshData事件，实现数据刷新

            this.$router.go(-1);
        },
        onSubmit(form) {
            console.info(this.portalGoodsDto);
            this.$refs[form].validate((valid) => {
                if (valid) {
                    console.info(this.portalGoodsDto);
                  this.$api.addGoods(this.portalGoodsDto).then((response) => {
                    debugger
                        if (response != null) {
                            if (response.success) {
                                this.$message.success({ message: '操作成功', center: true });
                                this.$router.push({
                                  name:'GoodsManager'
                                });//返回上一层
                            } else {
                                this.$message.error({ message: response.errorMessages, center: true });
                            }
                        } else {
                            this.$message.error({ message: '系统异常，请联系开发者', center: true });
                        }
                    });
                }
            });
        }
    }
};
</script>

<style scoped>
.el-radio-group{
  float:left;
}
</style>
