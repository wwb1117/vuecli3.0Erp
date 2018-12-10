<template>
    <div id="purchaseDetail_wrap">
        <div class="model_topcol">
            <span style="color: #409EFF">发票管理</span>
            <span> - 详情</span>
        </div>
        <div class="model_content">
            <div class="tab_content">
                <div class="tab_title fontWe_600">
                    <span v-if="dataInfo.invoiceStatus == 0" class="title_states">待收</span>
                    <span v-if="dataInfo.invoiceStatus == 1" class="title_states">已收</span>
                    <span v-if="dataInfo.invoiceStatus == 2" class="title_states">已作废</span>
                    <span style="margin-left: 30px" class="title_title">收到发票时间 : </span>
                    <span class="title_data">{{dataInfo.receiveTime | time_m}}</span>
                    <span class="title_title">制单人 : </span>
                    <span class="title_data" v-text="dataInfo.creator"></span>
                </div>
                <div class="banner">
                    发票信息
                </div>
                <div class="table_wrap" :style="{height: $store.state.home.modelContentHeight - 125 + 'px'}">
                    <el-table
                        :data="goodsInfoData"
                        border
                    style="width: 100%">
                        <el-table-column
                        prop="orderNo"
                        label="采购单号"
                        width="180">
                        </el-table-column>
                        <el-table-column
                        prop="sellerName"
                        label="供应商名称">
                        </el-table-column>
                        <el-table-column
                        prop="orderMoney"
                        label="采购单金额">
                        </el-table-column>
                        <el-table-column
                        prop="invoiceMoney"
                        label="发票金额">
                        </el-table-column>
                        <el-table-column
                        prop="receiveTime"
                        label="发票创建时间">
                            <template slot-scope="scope">
                                {{scope.row.receiveTime | time_m}}
                            </template>
                        </el-table-column>
                        <el-table-column
                        prop="confirmTime"
                        label="发票确认时间">
                            <template slot-scope="scope">
                                {{scope.row.confirmTime  | time_m}}
                            </template>
                        </el-table-column>
                    </el-table>
                    <div style="margin-top: 20px; padding-left: 10px">
                        <div v-if="dataInfo.img" style="margin-bottom: 10px">
                            <span class="table_bottom_title">附件信息 : </span>
                            <img v-if="dataInfo.img" @click="imgClick" style="width: 80px; height: 88px; vertical-align: text-top" :src="dataInfo.img" alt="附件信息">
                        </div>
                        <div v-if="dataInfo.invalidReason" class="table_bottom_item">
                            <span class="table_bottom_title">作废原因 : </span>
                            <span v-text="dataInfo.invalidReason"></span>
                        </div>
                        <div v-if="dataInfo.invalidTime" class="table_bottom_item">
                            <span class="table_bottom_title">作废时间 : </span>
                            <span>{{dataInfo.invalidTime | time_m }}</span>
                        </div>
                        <div v-if="dataInfo.invalider" class="table_bottom_item">
                            <span class="table_bottom_title">作废操作人 : </span>
                            <span v-text="dataInfo.invalider"></span>
                        </div>
                    </div>

                </div>
            </div>

        </div>
        <div class="wrap_footer">
            <el-button v-RouterBack style="width: 90px" size="small">返回</el-button>
        </div>

        <!-- 附件弹窗 -->
        <el-dialog
            title="附件信息"
            :visible.sync="imgDialogVisible"
            width="40%"
           >
            <div>
                <img style="width: 100%" :src="dataInfo.img" alt="附件信息">
            </div>
        </el-dialog>
    </div>
</template>

<script>
import api from 'api/finance'
export default {
    data(){
        return {
            dataInfo: {},
            imgDialogVisible: false,
            goodsInfoData: []
        }
    },
    computed:{},
    methods:{
        imgClick(){
            this.imgDialogVisible = true
        },
        getDataInfo(id){
            api.getInvoiceDetail(id).then((responce) => {
                this.dataInfo = responce.data
                this.goodsInfoData = []
                this.goodsInfoData.push(this.dataInfo)
                console.log(this.dataInfo)
            })
        }

    },
    activated(){
        var id = this.$store.state.home.currentModelId

        this.getDataInfo(id)
    },

    mounted(){}
}
</script>
<style scoped>
.tab_title{
    height: 65px;
    line-height: 65px;
    padding-left: 20px;
    font-size: 15px;
}
.tab_ruku_title{
    background: #fff2ef
}
.tab_title span{
    display: inline-block;
}
.title_states{
    color: #ec706b;
    font-size: 18px;
}
.tab_content{
    background: #ffffff;
    height: 100%;
}
.title_title{
    color: #929597;
}
.title_data{
    color: #5f6264;
    margin-right: 40px;
}
.banner{
    height: 40px;
    background: #f5f5f5;
    line-height: 40px;
    color: #606266;
    font-weight: 600;
    padding-left: 10px;
}
.table_wrap{
    padding: 10px;
    overflow: auto;
}
.table_bottom{
    border: 1px solid #ebeef5;
    height: 120px;
    border-top: none;
    color: #333;
}
.table_bottom .table_bottom_title{
    color: #606365;
}
.table_bottom_right .table_bottom_title{
    width: 200px;
}
.table_bottom_right{
    float: right;
    height: 50px;
    padding-right: 30px;
    padding-top: 10px;
}
.table_bottom_item{
    height: 35px;
    line-height: 35px;
}
.table_bottom_title{
    display: inline-block;
    width: 80px;
    text-align: right;
}
.wrap_footer{
    height: 49px;
    line-height: 49px;
    padding-left: 25px;
}
.ruku_content{
    overflow: auto;
    padding: 10px;
}
</style>
