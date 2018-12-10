<template>
    <div>
        <div class="model_topcol" style="position: relative;">
            <span style="color: #409EFF">采购退货收款单</span>
            <div style="position: absolute; right: 50px; z-index: 999; top: 0">
                <span>待确认收款合计 : </span>
                <span class="color_red">{{tableMoney | numFormat}}</span>
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
                        <el-form-item label="收款单号">
                            <el-input v-model="tableParam.financeNo" placeholder="请输入收款单号" style="width: 250px"></el-input>
                        </el-form-item>
                        <el-form-item label="收款单时间">
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
                        <el-form-item label="供应商名称">
                            <el-select v-model="tableParam.sellerName" placeholder="请选择供应商名称">
                                <el-option v-for="item in supplierSelectData" :key="item.id" :label="item.sellerCompanyName" :value="item.sellerCompanyName"></el-option>
                            </el-select>
                        </el-form-item>
                        <br>
                        <el-form-item label="采购退货单号">
                            <el-input v-model="tableParam.orderNo" placeholder="请输入采购退货单号" style="width: 250px"></el-input>
                        </el-form-item>
                        <el-form-item label="收款确认时间">
                            <el-date-picker
                                v-model="comfirmArr"
                                value-format="timestamp"
                                @change="datePickerChangeEvent"
                                type="datetimerange"
                                :editable="false"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="收款单状态">
                            <el-select v-model="tableParam.financeStatus" placeholder="请选择收款单状态">
                                <el-option label="全部" value=""></el-option>
                                <el-option label="待收款" value="0"></el-option>
                                <el-option label="已收款" value="1"></el-option>
                                <el-option label="已作废" value="2"></el-option>
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
                            placeholder="请输入供应商名称/采购退货单号"
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
                    <!-- <el-button v-perss="'导出订单'" @click="exportOrder" icon="fa fa-upload" type="text">导出</el-button> -->
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
                        label="收款单号"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="orderNo"
                        label="采购退货单号"
                       >
                    </el-table-column>
                    <el-table-column
                        prop="dealTime"
                        label="收款单时间"
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
                        label="收款金额"
                       >
                    </el-table-column>
                    <el-table-column
                        prop="financeStatus"
                        label="状态"
                       >
                       <template slot-scope="scope">
                            <span class="color_red" v-if="scope.row.financeStatus == 0">待收款</span>
                            <span v-if="scope.row.financeStatus == 1">已收款</span>
                            <span v-if="scope.row.financeStatus == 2">已作废</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="prop"
                        label="操作"
                       >
                       <template slot-scope="scope">
                            <el-button
                                v-if="scope.row.financeStatus == 0"
                                v-perss="'收付款确认'"
                                @click.native.prevent="tablePropEvent(scope.row, 1)"
                                type="text"
                                size="small">
                                收款确认
                            </el-button>
                            <el-button
                                v-perss="'收付款详情'"
                                @click.native.prevent="tablePropEvent(scope.row, 2)"
                                type="text"
                                size="small">
                                详情
                            </el-button>
                            <el-button
                                v-perss="'收付款作废'"
                                v-if="scope.row.financeStatus == 0"
                                @click.native.prevent="tablePropEvent(scope.row, 3)"
                                type="text"
                                size="small">
                                作废
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
        <!-- 收款单作废确认 -->
        <el-dialog
            title="收款单作废确认"
            :visible.sync="invalidatedialogVisible"
            :close-on-click-modal="false"
            @close="invalidatedialogCloseEvent"
            width="30%"
           >
                <div>
                    <span style="color: #e6a23c; font-size: 24px; margin-right: 5px" class="el-icon-warning"></span>
                    <span style="vertical-align: text-bottom;">确定将收款单号 <span v-text="currentTableData.financeNo"></span> (收款金额:<span v-text="currentTableData.financeMoney"></span>) 作废？</span><br>
                    <span style="margin-left: 32px">收款单作废后状态不可退回。如确定作废，请填写作废原因：</span>
                </div>

                <el-input
                type="textarea"
                style="margin-left: 32px; width: 90%"
                :rows="2"
                placeholder="请输入作废原因"
                v-model="invalidateinfo">
                </el-input>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="invalidatedialogVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="invalidateEvent">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 收款确认 -->
        <el-dialog
            title="收款确认"
            :visible.sync="gatherVisible"
            :close-on-click-modal="false"
            @close="gatherdialogCloseEvent"
            width="30%"
           >
            <div>
                <p>上传完收款图片，默认已收款。请上传小于2M的图片。</p>
                <el-form id="supplier_form" :inline="true" ref="gather_form" label-position="right" size="small" label-width="70px">
                    <el-form-item label="上传附件">
                        <div style="display: inline-block">
                            <el-upload
                            ref="faceIdcardUpload"
                            :action="uploadURL"
                            :data="sendData"
                            list-type="picture-card"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess1"
                            :before-upload="beforeAvatarUpload"
                            >
                            <img style="width: 80px; height: 80px;" v-if="imageUrl1" :src="imageUrl1" class="avatar">
                            <i v-if="!imageUrl1" class="el-icon-plus"></i>
                            </el-upload>
                            <!-- <span class="card_tip">经营者身份证<br>正面照</span> -->
                        </div>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="gatherVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="gatherEvent">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import api from 'api/finance'
import papi from 'api/purchase'
export default {
    data(){
        return {
            exportOrderOut: process.env.API_ROOT + '/order/exportExcel?',
            uploadURL: process.env.API_ROOT + '/f/upload',
            isSupperBoxShow: false,
            isExportShow: false,
            isFreSupBoxShow: false,
            invalidatedialogVisible: false,
            gatherVisible: false,
            invalidateinfo: '',
            totalPage: 0,
            supplierSelectData: [],
            comfirmArr: [],  //储存时间控件数据
            payTime: [], //储存时间控件数据
            sendData: {
                file: "",
                uploadType: 'erp'
            },
            imageUrl1: '',
            suerGatherImgData: '',
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
                ftype: '0',
                pageNo: 1,
                pageSize: 15
            },
            currentTableId: '',
            currentTableData: {},
            tableMoney: 0.00,
            tableData: []
        }
    },
    computed:{},
    methods:{
        getSupplierSelectData(){
            papi.getSupplierSelectData().then((response) => {
                this.supplierSelectData = response.data.list
            })
        },
        handleAvatarSuccess1(res, file) {
            this.suerGatherImgData = res.data.url
            this.imageUrl1 = URL.createObjectURL(file.raw);
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
        invalidateEvent() {
            var paramobj = {
                id: this.currentTableId,
                invalidReason: this.invalidateinfo
            }

            api.invalidFinaNo(paramobj).then((response) => {
                this.invalidatedialogVisible = false
                this.getTableData()
                this.$message({
                    type: 'success',
                    duration: 1500,
                    showClose: true,
                    message: '此收款单已作废!'
                })
            })
        },
        gatherEvent() {
            var paramobj = {
                id: this.currentTableId,
                img: this.suerGatherImgData
            }

            api.confirmReceFinaNo(paramobj).then((response) => {
                this.gatherVisible = false
                this.getTableData()
                this.$message({
                    type: 'success',
                    duration: 1500,
                    showClose: true,
                    message: '此收款单已确认收款!'
                })
            })
        },
        invalidatedialogCloseEvent() {
            this.invalidateinfo = ""
        },
        gatherdialogCloseEvent(){
            this.imageUrl1 = ''
            this.suerGatherImgData = ''
        },
        tablePropEvent(data, type) {
            this.currentTableId = data.id
            this.currentTableData = data
            if (type == 3) { // 作废
                this.invalidatedialogVisible = true
            }
            if (type == 1) { // 收款确认
                this.gatherVisible = true
            }
            if (type == 2) { // 详情
                this.$store.commit('setCurrentModelId', data.id)
                this.$router.push({
                    path: '/receiptDetail'
                })
            }
        },
        tableRowClassName(data, rowindex) {
            if (data.row.financeStatus == 2) {
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
            // this.tableParam.comfirmArr = ''
            // this.tableParam.payTime = ''
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
        getTableData(){
            api.getPayAndReceList(this.tableParam).then((response) => {
                this.tableData = response.data.list
                this.totalPage = response.data.total
                this.tableMoney = response.data.nonPayment
            })
        },
        resetBtnEvent () {
            for (var key in this.tableParam) {
                if (key != 'ftype') {
                    this.tableParam[key] = ""
                }
            }
            this.comfirmArr = []  //储存时间控件数据
            this.payTime = [] //储存时间控件数据
        },
        datePickerChangeEvent () {
            this.setDatePicker()
        },
        setDatePicker(){
            if (this.comfirmArr.length > 0) {
                this.tableParam.confirmStartTime = Math.round(this.comfirmArr[0] / 1000)
                this.tableParam.confirmEndTime = Math.round(this.comfirmArr[1] / 1000)
            } else {
                this.tableParam.confirmStartTime = null
                this.tableParam.confirmEndTime = null
            }
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
