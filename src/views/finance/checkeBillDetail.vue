<template>
    <div id="checkBillWrap">
        <div class="model_topcol">
            <span style="color: #409EFF">对账单</span>
            <!-- <span v-if="$route.params.type == 1"> - 本期账单</span> -->
            <span> - 详情</span>
        </div>
        <div class="model_content" :style="{height: $store.state.home.modelContentHeight + 'px'}">
            <div class="model_content_inner" style="overflow: auto;">
                <div style="position: relative">
                    <el-form id="checkBillDetail" :inline="true" :model="infoData" label-position="right" size="small" label-width="100px">
                        <el-form-item prop="sellerName" label="供应商名称: ">
                            <span v-text="infoData.customer.customerName"></span>
                        </el-form-item>
                        <!-- <el-form-item prop="sellerName" label="账单收款: ">
                            <span v-text="infoData.receivedMoney"></span>
                        </el-form-item>
                        <el-form-item prop="sellerName" label="账单付款: ">
                            <span v-text="infoData.paidMoney"></span>
                        </el-form-item>
                        <el-form-item prop="sellerName" label="应收金额: ">
                            <span v-text="infoData.receivableMoney"></span>
                        </el-form-item>
                        <br> -->

                        <el-form-item v-if="$route.params.type == 2" prop="sellerName" label="对账人: ">
                            <span v-text="infoData.customer.creator"></span>
                        </el-form-item>
                        <el-form-item v-if="$route.params.type == 2" prop="sellerName" label="对账时间: ">
                            <span>{{infoData.customer.created | time_m}}</span>
                        </el-form-item>
                        <el-form-item prop="sellerName" label="对账周期: ">
                            <span>{{infoData.customer.checkStartTime | time_m}}</span>
                            <span> ~ </span>
                            <span>{{infoData.customer.checkEndTime | time_m}}</span>
                        </el-form-item>
                    </el-form>
                    <div style="position: absolute; right: 20px; top: 0">
                        <el-button v-perss="'账单生成'" v-if="$route.params.type == 1" @click="insertBill" :style="{width: '90px'}" type="primary" size="small">生成账单</el-button>
                        <!-- <el-button :style="{width: '90px'}" type="default" size="small">导出</el-button> -->
                    </div>
                </div>
                <!-- <div class="checkBillBanner">
                    期初余额:
                    <span>0</span>
                </div> -->
                <div style="margin: 10px 0" class="checkBillBanner">
                    本期
                </div>
                <div style="overflow: hidden;">
                    <div style="width: 50%; float: left; padding-right: 5px">
                        <el-collapse accordion>
                            <el-collapse-item>
                                <template slot="title">
                                    <span>应收金额:</span>
                                    <span v-text="infoData.receivableMoney"></span>
                                </template>
                                <div>
                                    <el-table
                                    :data="infoData.receivableList"
                                    style="width: 100%">
                                    <el-table-column
                                        prop="dealTime"
                                        label="收款单时间"
                                        width="180">
                                        <template slot-scope="scope">
                                            <span>{{scope.row.dealTime | time_m}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        prop="financeNo"
                                        label="收款单号"
                                        width="180">
                                    </el-table-column>
                                    <el-table-column
                                        prop="orderNo"
                                        label="关联单号"
                                        width="180">
                                    </el-table-column>
                                    <el-table-column
                                        prop="financeMoney"
                                        label="金额">
                                    </el-table-column>
                                    </el-table>
                                </div>
                            </el-collapse-item>
                        </el-collapse>
                        <el-collapse style="margin-top: 10px" accordion>
                            <el-collapse-item>
                                <template slot="title">
                                    <span>应付金额:</span>
                                    <span v-text="infoData.payableMoney"></span>
                                </template>
                                <div>
                                    <el-table
                                    :data="infoData.payableList"
                                    style="width: 100%">
                                    <el-table-column
                                        prop="dealTime"
                                        label="付款单时间"
                                        width="180">
                                        <template slot-scope="scope">
                                            <span>{{scope.row.dealTime | time_m}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        prop="financeNo"
                                        label="付款单号"
                                        width="180">
                                    </el-table-column>
                                    <el-table-column
                                        prop="orderNo"
                                        label="关联单号"
                                        width="180">
                                    </el-table-column>
                                    <el-table-column
                                        prop="financeMoney"
                                        label="金额">
                                    </el-table-column>
                                    </el-table>
                                </div>
                            </el-collapse-item>
                        </el-collapse>
                    </div>
                    <div style="width: 50%; float: left; padding-left: 5px">
                        <el-collapse accordion>
                            <el-collapse-item>
                                <template slot="title">
                                    <span>已收金额:</span>
                                    <span v-text="infoData.receivedMoney"></span>
                                </template>
                                <div>
                                    <el-table
                                    :data="infoData.receivedList"
                                    style="width: 100%">
                                    <el-table-column
                                        prop="dealTime"
                                        label="收款确认时间"
                                        width="180">
                                        <template slot-scope="scope">
                                            <span>{{scope.row.dealTime | time_m}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        prop="financeNo"
                                        label="收款单号"
                                        width="180">
                                    </el-table-column>
                                    <el-table-column
                                        prop="orderNo"
                                        label="关联单号"
                                        width="180">
                                    </el-table-column>
                                    <el-table-column
                                        prop="financeMoney"
                                        label="金额">
                                    </el-table-column>
                                    </el-table>
                                </div>
                            </el-collapse-item>
                        </el-collapse>
                        <el-collapse style="margin-top: 10px" accordion>
                            <el-collapse-item>
                                <template slot="title">
                                    <span>已付金额:</span>
                                    <span v-text="infoData.paidMoney"></span>
                                </template>
                                <div>
                                    <el-table
                                    :data="infoData.paidList"
                                    style="width: 100%">
                                    <el-table-column
                                        prop="dealTime"
                                        label="付款时间"
                                        width="180">
                                        <template slot-scope="scope">
                                            <span>{{scope.row.dealTime | time_m}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        prop="financeNo"
                                        label="收款单号"
                                        width="180">
                                    </el-table-column>
                                    <el-table-column
                                        prop="orderNo"
                                        label="关联单号"
                                        width="180">
                                    </el-table-column>
                                    <el-table-column
                                        prop="financeMoney"
                                        label="金额">
                                    </el-table-column>
                                    </el-table>
                                </div>
                            </el-collapse-item>
                        </el-collapse>
                    </div>
                </div>
                <!-- <div style="margin: 10px 0" class="checkBillBanner">
                    期末余额:
                    <span>111,000.00</span>
                </div> -->

            </div>
        </div>
        <div class="model_footer">
            <el-button size="small" v-RouterBack style="width: 90px; margin-left: 25px;">返 回</el-button>
        </div>

    </div>
</template>

<script>
import api from 'api/finance'
export default {
    data(){
        return {
            infoData: {
                customer: {
                    customerName: ''
                }
            }
        }
    },
    computed:{},
    methods:{
        insertBill(){
            var paramObj = {
                customerId: this.infoData.customer.customerId,
                customerName: this.infoData.customer.customerName,
                customerType: 0,
                checkStartTime: this.infoData.customer.checkStartTime,
                checkEndTime: this.infoData.customer.checkEndTime
            }

            api.insertBill(paramObj).then((response) => {
                this.$message({
                    type: 'success',
                    duration: 1500,
                    showClose: true,
                    message: '账单生成成功!'
                })
                this.$router.push({
                    path: '/invoice'
                })
            })
        },
        getCurrentBillInfo(id, data){ //本期账单详情
            api.getCurrentBillInfo(id, data).then((response) => {
                this.infoData = response.data
            })
        },
        getBillInfo(){  //账单详情
            api.getBillInfo(this.$route.params.id).then((response) => {
                this.infoData = response.data
            })
        }

    },
    created(){},
    activated(){
        if (this.$route.params.type == 1) { //本期账单详情
            var paramObj = this.$store.state.home.currentModelId

            this.getCurrentBillInfo(paramObj.customerId, paramObj)
        }
        if (this.$route.params.type == 2) { //历史账单详情
            this.getBillInfo()
        }
    },
    mounted(){}
}
</script>
<style scoped>
.model_content_inner{
    position: relative;
}

.model_footer{
    text-align: left;
    padding-top: 10px;
}
#checkBillDetail{
    margin-top: 20px;
}
#checkBillDetail>div{
    width: 350px;
}
.checkBillBanner{
    height: 40px;
    background: #f5f5f5;
    line-height: 40px;
    color: #606266;
    font-weight: 600;
    padding-left: 15px;
}

</style>
