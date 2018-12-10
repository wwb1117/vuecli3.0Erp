<template>
    <div>
        <div class="model_topcol">
            <span style="color: #409EFF">付款单</span>
            <span> - 新增</span>
        </div>
        <div class="model_content" :style="{height: $store.state.home.modelContentHeight + 'px'}">
            <div class="model_content_inner form_wrap">
                <el-form id="supplier_form" class="myForm" :inline="true" ref="addpayNoForm" :rules="rules" :model="formData" label-position="right" size="small" label-width="120px">
                    <div class="banner">
                        付款信息
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
                        <el-form-item prop="financeNo" label="付款单号">
                            <el-input style="width: 194px" disabled="disabled" v-model="formData.financeNo" placeholder="请输入付款单号"></el-input>
                        </el-form-item>

                    </div>
                    <div>
                        <el-form-item prop="financeMoney" label="付款金额">
                            <el-input style="width: 194px" @change.native="inputNumFormat(formData.financeMoney)" @keyup.native="inputNumFormat(formData.financeMoney)" v-model="formData.financeMoney" placeholder="请输入付款金额"></el-input>
                        </el-form-item>
                        <el-form-item prop="dealTime" label="付款时间">
                            <el-date-picker
                            v-model="formData.dealTime"
                            value-format="timestamp"
                            type="datetime"
                            placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                    </div>
                    <!-- <div>
                        <el-form-item prop="payMoney" label="制单人">
                            <el-input style="width: 194px" v-model="formData.creator" placeholder="请输入制单人"></el-input>
                        </el-form-item>
                    </div> -->
                    <div class="banner">
                        供应商信息
                    </div>
                    <div style="margin-top: 20px">
                        <el-form-item prop="sellerId" label="供应商">
                            <el-input disabled="disabled" v-model="formData.sellerName" placeholder="请选择供应商"></el-input>
                        </el-form-item>
                    </div>
                    <div>
                        <el-form-item prop="dealType" label="付款方式">
                            <el-radio-group v-model="formData.dealType">
                                <el-radio :label="0">现金</el-radio>
                                <el-radio :label="1">银行转账</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </div>
                    <div>
                        <el-form-item required label="上传附件">
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
                    <div v-if="formData.dealType == 1">
                        <el-form-item prop="accountName" label="开户名称">
                            <el-input disabled="disabled" style="width: 194px" v-model="formData.accountName" placeholder="请输入开户名称"></el-input>
                        </el-form-item>
                        <el-form-item prop="bankName" label="开户银行">
                            <el-input disabled="disabled" style="width: 194px" v-model="formData.bankName" placeholder="请输入开户银行"></el-input>
                        </el-form-item>
                    </div>
                    <div v-if="formData.dealType == 1">
                        <el-form-item prop="accountNumber" label="银行账户">
                            <el-input disabled="disabled" style="width: 194px" v-model="formData.accountNumber" placeholder="请输入银行账户"></el-input>
                        </el-form-item>
                    </div>
                    <div class="banner">
                        其他信息
                    </div>
                    <div style="margin-top: 20px">
                        <el-form-item label="备注">
                            <el-input type="textarea" :rows="4" style="width: 524px" v-model="formData.financeRemark" placeholder="请输入备注"></el-input>
                        </el-form-item>
                    </div>

                </el-form>

            </div>
        </div>
        <div class="model_footer">
            <el-button size="small" @click="saveBtnEvent" type="primary" style="width: 90px; margin-left: 25px;">保存</el-button>
            <el-button @click="pageCansoleEvent" size="small" style="width: 90px; margin-left: 25px;">取消</el-button>
        </div>
    </div>
</template>

<script>
// import api from 'api/purchase'
import api from 'api/finance'
import papi from 'api/purchase'
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
                financeType: 1,
                dealName: '',
                dealType: 0,
                dealTime: Date.parse(new Date()),
                financeMoney: '',
                orderNo: '',
                financeNo: this.myBase.MathRand('FK'),
                img: '',
                financeRemark: '',
                sellerId: '',
                sellerName: '',
                operator: '',
                accountName: '',
                bankName: '',
                accountNumber: ''

            },
            rules: {
                orderNo: [
                    { required: true, message: '请选择关联采购单', trigger: 'blur' }
                ],
                sellerId: [
                    { required: true, message: '请选择供应商', trigger: 'blur' }
                ],
                dealTime: [
                    { required: true, message: '请选择支付时间', trigger: 'blur' }
                ],
                financeMoney: [
                    { required: true, message: '请输入付款金额', trigger: 'blur' }
                ],
                receiveCom: [
                    { required: true, message: '请输入供应商名称', trigger: 'blur' }
                ]
            },
            dialogImageUrl: '',
            dialogVisible: false
        }
    },
    computed:{},
    methods:{
        pageCansoleEvent(){
            this.$router.push({
                path: '/fk'
            })
        },
        inputNumFormat(num){
            this.formData.financeMoney = this.myBase.formatNum2(num)
        },
        setSelectName(fid, Arr){
            var itemobj = {}

            Arr.forEach((item, index) => {
                if (fid == item.id) {
                    itemobj = item
                }
            })

            return itemobj
        },
        setSupplierData(id){ //根据供应商ID再拿到供应商详情

            papi.getItemSupplierData(id).then((response) => {
                var supplierData = response.data

                this.formData.accountName = supplierData.accountName
                this.formData.bankName = supplierData.bankName
                this.formData.accountNumber = supplierData.accountNumber
            })
        },
        relePurchaseListIconEvent(){
            this.$router.push({
                name: '财务选择采购单',
                params: {type: 1} //type 1 表示由付款单新增进入
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
            this.$refs['addpayNoForm'].validate((valid) => {
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

                    if (this.formData.dealType == 0) {
                        this.formData.dealName = '现金'
                    } else {
                        this.formData.dealName = this.formData.accountName + ',' + this.formData.bankName + ',' + this.formData.accountNumber
                    }

                    this.formData.dealTime = this.formData.dealTime / 1000
                    this.formData.operator = this.$store.state.home.userInfo.user.userName

                    api.addPayNo(this.formData).then((response) => {
                        this.$message({
                            type: 'success',
                            duration: 1500,
                            showClose: true,
                            message: '付款单新增成功!'
                        })
                        this.$router.push({
                            path: '/fk'
                        })
                    }).catch(() => {
                        this.formData.dealTime = this.formData.dealTime * 1000
                    })

                }
            })
        },
        formRestEvent(){
            for (var kk in this.formData) {
                if (kk != 'dealType' && kk != 'financeType') {
                    this.formData[kk] = ""
                }
            }
            this.imageUrl3 = ''
            this.formData.img = ''
            this.formData.dealTime = Date.parse(new Date())
        }


    },
    activated(){

        if (this.$route.params.ischoose) {
            this.$refs['addpayNoForm'].clearValidate();
            var purchaseObj = this.$store.state.home.currentModelId

            this.formData.orderNo = purchaseObj.purchaseOrderNo
            this.formData.sellerId = purchaseObj.sellerId
            this.formData.sellerName = purchaseObj.sellerName
            this.formData.financeMoney = purchaseObj.receivedPrice

            this.setSupplierData(this.formData.sellerId)

        } else {
            this.$refs['addpayNoForm'].resetFields();
            this.formRestEvent()
            this.formData.financeNo = this.myBase.MathRand('FK')
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
