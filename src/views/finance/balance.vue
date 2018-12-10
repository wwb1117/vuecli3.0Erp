<template>
    <div>
        <div class="model_topcol" style="position: relative;">
            <span style="color: #409EFF">收支明细</span>
            <div style="position: absolute; right: 10px; z-index: 999; top: 0">
                <!-- <el-button @click="addEvent" :style="{width: '90px'}" type="primary" size="small">导出</el-button> -->
            </div>
        </div>
        <div class="model_content" :style="{height: $store.state.home.modelContentHeight + 'px'}">
            <div class="model_content_inner">
                <el-card v-show="isSupperBoxShow" class="box_card">
                    <div slot="header" class="clearfix">
                        <span :style="{fontSize: '16px'}">高级搜索</span>
                        <i @click="supperBoxShow" class="el-icon-close" style="float: right; padding: 3px 0; cursor: pointer"></i>
                    </div>
                    <el-form :inline="true" :model="tableParam" label-position="right" size="small" label-width="100px">
                        <el-form-item label="收付款单号">
                            <el-input v-model="tableParam.financeNo" placeholder="请输入收付款单号" style="width: 250px"></el-input>
                        </el-form-item>
                        <el-form-item label="类型">
                            <el-select v-model="tableParam.ftype" placeholder="请选择类型">
                                <el-option label="全部" value=""></el-option>
                                <el-option label="收款" value="0"></el-option>
                                <el-option label="付款" value="1"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="收付款时间">
                            <el-date-picker
                                v-model="payTime"
                                value-format="timestamp"
                                @change="datePickerChangeEvent"
                                type="datetimerange"
                                :editable="false"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                        <br>
                        <el-form-item id="balanceElFormItem" label="采购单号采购退货单号">
                            <span slot="label">采购单号<br>采购退货单号</span>
                            <el-input v-model="tableParam.orderNo" placeholder="请输入采购单号/采购退货单号" style="width: 250px"></el-input>
                        </el-form-item>
                        <el-form-item label="状态">
                            <el-select v-model="tableParam.financeStatus" placeholder="请选择状态">
                                <el-option label="全部" value=""></el-option>
                                <el-option label="已付款" value="0"></el-option>
                                <el-option label="已收款" value="1"></el-option>
                                <el-option label="已作废" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="供应商名称">
                            <el-select v-model="tableParam.sellerName" placeholder="请选择供应商名称">
                                <el-option v-for="item in supplierSelectData" :key="item.id" :label="item.sellerCompanyName" :value="item.sellerCompanyName"></el-option>
                            </el-select>
                        </el-form-item>
                        <br>
                        <el-form-item>
                            <el-button @click="supperSureBoxShow" style="width: 90px" type="primary">确定</el-button>
                            <el-button @click="supperCansleBoxShow" style="width: 90px">取消</el-button>
                            <el-button class="color_hover" @click="resetBtnEvent" type="text" style="width: 40px; color: #636365">清空</el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
                <div v-show="!isExportShow&&!isFreSupBoxShow" class="purchaseList_title">
                    <div>
                        <el-input
                            size="small"
                            placeholder="请输入采购单/采购退货单号"
                            prefix-icon="el-icon-search"
                            @clear="searchInputClear"
                            clearable
                            :style="{width: '378px'}"
                            @keyup.enter.native="searchInputEnter"
                            v-model="tableParam.searchStr">
                        </el-input>
                        <el-button :style="{margin: '0 10px'}" @click="searchInputEnter" type="primary" size="small">搜索</el-button>
                        <span @click="supperBoxShow">高级搜索</span>
                    </div>
                </div>
                <div v-show="!isExportShow&&isFreSupBoxShow" class="purchaseList_title">
                    <span class="resspan">搜索结果</span>
                    <el-button @click="resetSeraBtnEvent" icon="fa fa-eraser" type="text">清除搜索</el-button>
                    <el-button @click="goSeraBtnEvent" icon="el-icon-search" type="text">继续搜索</el-button>
                    <!-- <el-button @click="exportOrder" icon="fa fa-upload" type="text">导出</el-button> -->
                </div>
                <!-- <div v-show="isExportShow" class="purchaseList_exportWrap">
                    <ul>
                        <li :style="{borderRight: '1px solid #E4E7ED', fontSize: '12px', color: '#757577'}">
                            <span :style="{fontSize: '18px',verticalAlign: 'middle'}" class="el-icon-close" @click="closeExportWrap"></span>
                            <span>已选择</span>
                            <span v-text="selectTableData.length"> 2 </span>
                            <span>项</span>
                        </li>
                        <li :style="{paddingLeft: '20px'}">
                            <el-button :style="{width: '100px'}" size="small">导出</el-button>
                        </li>
                    </ul>
                </div> -->
                <el-table
                    :data="tableData"
                    :height="$store.state.home.modelContentHeight - 73"
                    :row-class-name="tableRowClassName"
                    style="width: 100%">
                    <el-table-column
                        prop="financeNo"
                        label="收付款单号"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="orderNo"
                        label="采购单/采购退货单号"
                       >
                    </el-table-column>
                    <el-table-column
                        prop="dealTime"
                        label="收付款时间"
                       >
                        <template slot-scope="scope">
                           {{scope.row.dealTime | time_m}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="sellerName"
                        label="供应商名称"
                       >
                    </el-table-column>
                    <el-table-column
                        prop="financeMoney"
                        label="金额"
                       >
                    </el-table-column>
                    <el-table-column
                        prop="financeStatus"
                        label="状态"
                       >
                       <template slot-scope="scope">
                            <span v-if="scope.row.financeStatus == 1 && scope.row.financeType == 1">已付款</span>
                            <span class="color_red" v-if="scope.row.financeStatus == 0 && scope.row.financeType == 0">待收款</span>
                            <span v-if="scope.row.financeStatus == 1 && scope.row.financeType == 0">已收款</span>
                            <span v-if="scope.row.financeStatus == 2">已作废</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="dealName"
                        label="收款账户"
                       >
                    </el-table-column>
                    <el-table-column
                        prop="financeType"
                        label="类型"
                       >
                       <template slot-scope="scope">
                            <span v-if="scope.row.financeType == 1">付款</span>
                            <span v-if="scope.row.financeType == 0">收款</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="prop"
                        label="操作"
                       >
                       <template slot-scope="scope">

                            <el-button
                                @click.native.prevent="tablePropEvent(scope.row, 2)"
                                type="text"
                                size="small">
                                详情
                            </el-button>

                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div class="model_footer">
            <!-- <el-button size="small" style="width: 90px; margin-left: 25px;">返 回</el-button> -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="tableParam.pageNo"
                :page-sizes="[15, 30, 50, 100]"
                :page-size="15"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalPage">
            </el-pagination>
        </div>

    </div>
</template>

<script>
import papi from 'api/purchase'
import api from 'api/finance'
export default {
    data(){
        return {
            exportOrderOut: process.env.API_ROOT + '/order/exportExcel?',
            isSupperBoxShow: false,
            isExportShow: false,
            isFreSupBoxShow: false,
            totalPage: 0,
            createArr: [],  //储存时间控件数据
            payTime: [], //储存时间控件数据
            tableParam: {
                searchStr: '',
                financeNo : '',
                orderNo: '',
                sellerName: '',
                financeStatus: '',
                startTime: '',
                endTime: '',
                confirmStartTime: '',
                confirmEndTime: '',
                ftype: '',
                pageNo: 1,
                pageSize: 15
            },
            supplierSelectData: [],
            tableData: []
        }
    },
    computed:{},
    methods:{
        getTableData(){
            api.getPayAndReceList(this.tableParam).then((response) => {
                this.tableData = response.data.list
                this.totalPage = response.data.total
            })
        },
        getSupplierSelectData(){
            papi.getSupplierSelectData().then((response) => {
                this.supplierSelectData = response.data.list
            })
        },
        addEvent(){
            this.$router.push({
                path: '/addpayNo'
            })
        },
        tablePropEvent(data, type) {
            if (type == 2) { // 详情
                this.$store.commit('setCurrentModelId', data.id)

                //分级跳转,稍事修改
                if (data.financeType == 0) { //收款
                    this.$router.push({
                        path: '/receiptDetail'
                    })
                }
                if (data.financeType == 1) { //付款
                    this.$router.push({
                        path: '/payNoDetail'
                    })
                }
            }
        },
        tableRowClassName(data, rowindex) {
            if (data.row.status == 2) {
                return 'disableRow'
            } else {
                return ''
            }
        },
        handleSizeChange(val){
            this.tableParam.pageSize = val
            this.getTableData()
        },
        handleCurrentChange(val){
            this.tableParam.pageNo = val
            this.getTableData()
        },

        resetSeraBtnEvent(){
            this.resetBtnEvent()
            this.getTableData()
            this.isFreSupBoxShow = false
        },
        goSeraBtnEvent(){
            this.isSupperBoxShow = true
        },
        closeExportWrap(){
            this.isExportShow = false
            // this.$refs.purchaseListTable.clearSelection()
        },
        supperBoxShow(){
            this.isSupperBoxShow = !this.isSupperBoxShow
        },
        supperCansleBoxShow () {
            this.isSupperBoxShow = !this.isSupperBoxShow
        },
        // 高级搜索
        supperSureBoxShow () {
            this.isSupperBoxShow = !this.isSupperBoxShow
            this.isFreSupBoxShow = true
            this.tableParam.pageNo = 1
            this.getTableData()
        },
        searchInputClear(){
            this.getTableData()
        },
        searchInputEnter(){
            this.tableParam.pageNo = 1
            this.getTableData()
        },

        resetBtnEvent () {
            for (var key in this.tableParam) {
                this.tableParam[key] = ""
            }
            this.payTime = [] //储存时间控件数据
        },
        datePickerChangeEvent () {
            this.setDatePicker()
        },
        setDatePicker(){
            if (this.payTime.length > 0) {
                this.tableParam.startTime = Math.round(this.payTime[0] / 1000)
                this.tableParam.endTime = Math.round(this.payTime[1] / 1000)
            } else {
                this.tableParam.startTime = null
                this.tableParam.endTime = null
            }
        }

    },
    created(){},
    activated(){
        this.getTableData()
        this.getSupplierSelectData()
    },
    mounted(){}
}
</script>
<style scoped>
.model_topcol2{
    height: 46px;
    line-height: 46px;
    padding-left: 20px;
}
.model_content_inner{
    position: relative;
    overflow: hidden;
}
.purchaseList_title{
    height: 52px;
    line-height: 52px;
    padding-left: 17px;
}
.purchaseList_title span{
    cursor: pointer;
}
.box_card{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 250px;
    z-index: 9;
}

</style>
