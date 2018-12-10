<template>
    <div>
        <div class="model_topcol">
            <span style="color: #409EFF">发票管理</span>
            <span> - 新增</span>
        </div>
        <div class="model_content" :style="{height: $store.state.home.modelContentHeight + 'px'}">
            <div class="model_content_inner form_wrap">
                <el-form id="supplier_form" class="myForm" :inline="true" ref="addInvoForm" :rules="rules" :model="formData" label-position="right" size="small" label-width="120px">
                    <div class="banner">
                        发票信息
                    </div>
                    <div style="margin-top: 20px">
                        <el-form-item prop="orderNo" label="关联采购单">
                            <el-input v-model="formData.orderNo" placeholder="请选择关联采购单">
                                <i
                                    class="el-icon-more myCur"
                                    slot="suffix"
                                    @click="relePurchaseListIconEvent"
                                >
                                </i>
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="sellerName" label="供应商名称">
                            <el-input style="width: 194px" disabled="disabled" v-model="formData.sellerName" placeholder="请输入供应商名称"></el-input>
                        </el-form-item>
                    </div>
                    <div>
                        <el-form-item prop="invoiceMoney" label="发票金额">
                            <el-input style="width: 194px" v-model="formData.invoiceMoney" placeholder="请输入发票金额"></el-input>
                        </el-form-item>
                        <el-form-item prop="receiveTime" label="收到发票时间">
                            <el-date-picker
                            v-model="formData.receiveTime"
                            value-format="timestamp"
                            type="datetime"
                            placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                    </div>

                    <div>
                        <el-form-item required label="经营许可类证书">
                            <span slot="label">
                                上传附件
                            </span>
                            <div style="display: inline-block">
                                <el-upload
                                :action="uploadURL"
                                ref="imgLicenseUpload"
                                :data="sendData"
                                :show-file-list="false"
                                list-type="picture-card"
                                :on-success="handleAvatarSuccess3"
                                :before-upload="beforeAvatarUpload"
                                >
                                <img style="width: 80px; height: 80px;" v-if="imageUrl3" :src="imageUrl3" class="avatar">
                                <i v-if="!imageUrl3" class="el-icon-plus"></i>
                                </el-upload>
                                <!-- <span class="card_tip">经营许可<br>证照片</span> -->
                            </div>
                        </el-form-item>
                    </div>

                </el-form>

            </div>
        </div>
        <div class="model_footer">
            <el-button size="small" @click="saveBtnEvent" type="primary" style="width: 90px; margin-left: 25px;">保存</el-button>
            <el-button @click="pageCansule" size="small" style="width: 90px; margin-left: 25px;">取消</el-button>
        </div>
    </div>
</template>

<script>
import api from 'api/finance'
export default {
    data(){
        return {
            imageUrl3: "",
            uploadURL: process.env.API_ROOT + '/f/upload',
            sendData: {
                file: "",
                uploadType: 'erp'
            },
            formData: {
                sellerId: '',
                sellerName: '',
                img: '',
                invoiceMoney: '',
                orderNo: '',
                receiveTime: '',
                confirmTime: '',
                remark: ''

            },
            rules: {
                orderNo: [
                    { required: true, message: '请选择关联采购单', trigger: 'blur' }
                ],
                receiveTime: [
                    { required: true, message: '请选择收到发票时间', trigger: 'blur' }
                ],
                invoiceMoney: [
                    { required: true, message: '请输入付款金额', trigger: 'blur' }
                ],
                sellerName: [
                    { required: true, message: '请输入供应商名称', trigger: 'blur' }
                ]
            },
            dialogImageUrl: '',
            dialogVisible: false
        }
    },
    computed:{},
    methods:{
        pageCansule(){
            this.$router.push({
                path: '/bill'
            })
        },
        relePurchaseListIconEvent(){
            this.$router.push({
                name: '财务选择采购单',
                params: {type: 2} //type 2 表示有发票新增进入
            });
        },
        handleAvatarSuccess3(res, file) {
            this.formData.img = res.data.url
            this.imageUrl3 = URL.createObjectURL(file.raw);
        },
        beforeAvatarUpload(file){
            var isJPG = false

            if (file.type === 'image/jpeg' || file.type === 'image/png') {
                isJPG = true
            }

            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message({
                    type: 'error',
                    duration: 1500,
                    showClose: true,
                    message: '上传头像图片只能是 JPG 或 PNG 格式!'
                })
            }
            if (!isLt2M) {
                this.$message({
                    type: 'error',
                    duration: 1500,
                    showClose: true,
                    message: '上传头像图片大小不能超过 2MB!'
                })
            }

            return isJPG && isLt2M;
        },
        saveBtnEvent(){
            this.$refs['addInvoForm'].validate((valid) => {
                if (valid) {
                    if (!this.formData.img) {
                        this.$message({
                            type: 'error',
                            duration: 1500,
                            showClose: true,
                            message: '请选择上传附件!'
                        })
                        return
                    }
                    this.formData.receiveTime = this.formData.receiveTime / 1000
                    this.formData.confirmTime = this.formData.receiveTime / 1000
                    api.addInvoice(this.formData).then((responce) => {
                        this.$message({
                            type: 'success',
                            duration: 1500,
                            showClose: true,
                            message: '发票新增成功!'
                        })
                        this.$router.push({
                            path: '/bill'
                        })
                    }).catch(() => {
                        this.formData.receiveTime = this.formData.receiveTime * 1000
                        this.formData.confirmTime = this.formData.confirmTime * 1000
                    })

                }
            })
        },
        formRestEvent(){
            for (var kk in this.formData) {
                this.formData[kk] = ""
            }
            this.imageUrl3 = ''
            this.formData.img = ''
        }


    },
    activated(){
        if (this.$route.params.ischoose) {
            this.$refs['addInvoForm'].clearValidate();
            var purchaseObj = this.$store.state.home.currentModelId

            this.formData.orderNo = purchaseObj.purchaseOrderNo
            this.formData.sellerId = purchaseObj.sellerId
            this.formData.sellerName = purchaseObj.sellerName
            this.formData.invoiceMoney = purchaseObj.receivedPrice

        } else {
            this.$refs['addInvoForm'].resetFields();
            this.formRestEvent()
        }
    }

}
</script>
<style scoped>
.model_content_inner{
    position: relative;
    overflow: auto;
}

.model_footer{
    text-align: left;
    padding-top: 10px;
}
.banner{
    height: 40px;
    background: #f5f5f5;
    line-height: 40px;
    color: #606266;
    font-weight: 600;
    padding-left: 10px;
}
.card_tip{
    display: inline-block;
    text-align: center;
    width: 88px;
}
</style>
