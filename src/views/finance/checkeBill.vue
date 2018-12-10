<template>
    <div>
        <div class="model_topcol">
            <span>对账单</span>

        </div>
        <div class="model_content" :style="{height: $store.state.home.modelContentHeight + 'px'}">
            <div class="model_content_inner">
                <div class="purchaseList_title">
                    <el-select :style="{width: '128px', marginRight: '10px'}" size="small" @change="statusChange" v-model="tableParam.checkStatus" placeholder="请选择状态">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="未出账单" :value="0"></el-option>
                        <el-option label="已出账单" :value="1"></el-option>
                    </el-select>

                    <el-input
                        size="small"
                        placeholder="请输入供应商名称"
                        clearable
                        @clear="searchInputClear"
                        prefix-icon="el-icon-search"
                        :style="{width: '378px'}"
                        @keyup.enter.native="searchInputClear"
                        v-model="tableParam.sellerName">
                    </el-input>
                    <el-button @click="searchInputClear" :style="{margin: '0 10px'}" type="primary" size="small">搜索</el-button>
                </div>
                <el-table
                    :data="tableData"
                    :height="$store.state.home.modelContentHeight - 83"
                    ref="purchaseListTable"
                    @selection-change="handleSelectionChange"
                    style="width: 100%">

                    <el-table-column
                        prop="customerName"
                        label="供应商名称">
                    </el-table-column>
                    <el-table-column
                        prop="lastCheckTime"
                        label="上次对账时间">
                        <template slot-scope="scope">
                            <div v-if="scope.row.lastCheckTime">
                                {{scope.row.lastCheckTime | time_m}}
                            </div>
                            <div v-if="!scope.row.lastCheckTime">
                                <span>--</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="sellerCompanyAddress"
                        label="本次账单周期">
                        <template slot-scope="scope">
                            <div v-if="scope.row.checkStartTime">
                                {{scope.row.checkStartTime | time_m}}
                                <span>~</span>
                                {{scope.row.checkEndTime | time_m}}
                            </div>
                            <div v-if="!scope.row.checkStartTime">
                                <span>--</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="contactPerson"
                        label="账单状态">
                        <template slot-scope="scope">
                            <div>
                                <span v-if="scope.row.checkStatus == 0">未出账单</span>
                                <span v-if="scope.row.checkStatus == 1">已出账单</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="prop"
                        width="150"
                        label="操作">
                         <template slot-scope="scope">
                            <el-button
                            v-perss="'本期账单'"
                            v-if="scope.row.checkStatus == 0"
                            @click.native="tablePropEvent(scope.row.customerId, 1, scope.row)"
                            type="text"
                            size="small">
                            本期账单
                            </el-button>
                            <el-button
                            v-perss="'历史账单'"
                            @click.native="tablePropEvent(scope.row.customerId, 2)"
                            type="text"
                            size="small">
                            历史账单
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div class="model_footer">
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
import api from 'api/finance'
export default {
    data(){
        return {
            selectTableData: [],
            tableHeight: 500,
            totalPage: 1,
            tableParam: {
                pageNo: 1,
                pageSize: 15,
                checkStatus: '',
                sellerName: ''
            },
            tableData: []
        }
    },
    computed:{},
    methods:{
        statusChange(){
            this.tableParam.pageNo = 1
            this.getTableData()
        },
        searchInputClear(){
            this.tableParam.pageNo = 1
            this.getTableData()
        },
        handleSizeChange(val){
            this.tableParam.pageSize = val
            this.getTableData()
        },
        handleCurrentChange(val){
            this.tableParam.pageNo = val
            this.getTableData()
        },
        getTableData(){
            api.getBillList(this.tableParam).then((response) => {
                this.totalPage = response.data.total
                this.tableData = response.data.list
            })
        },
        tablePropEvent(rowid, type, rowData){
            if (type == 1){ //本期账单
                this.$store.commit('setCurrentModelId', rowData)
                this.$router.push({
                    name: '对账单详情',
                    params: {type: 1} //本期账单详情
                })
            }
            if (type == 2){ //历史账单
                this.$store.commit('setCurrentModelId', rowid)
                this.$router.push({
                    path: '/hisInvoice'
                })
            }

        },

        handleSelectionChange(val){
        }

    },
    activated(){
        this.getTableData()
    },
    created(){
        this.getTableData()
    },
    mounted(){}
}
</script>
<style scoped>
.purchaseList_title{
    height: 63px;
    line-height: 63px;
    padding-left: 17px;
}
.purchaseList_exportWrap{
    height: 63px;
    padding-top: 15px;
}
.purchaseList_title span{
    cursor: pointer;
}
.el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
    font-size: 12px;
}
.purchaseList_exportWrap>ul{
    overflow: hidden;
    padding-left: 0;
}
.purchaseList_exportWrap>ul>li{
    float: left;
    padding: 0 20px;
    height: 33px;
    line-height: 32px;
}
.box_card{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 300px;
    z-index: 9;
}
.model_content_inner{
    position: relative;
}
.el-date-editor--daterange.el-input, .el-date-editor--daterange.el-input__inner, .el-date-editor--timerange.el-input, .el-date-editor--timerange.el-input__inner{
    width: 390px;
}
.el-form{
    color: #636365;
}

</style>
