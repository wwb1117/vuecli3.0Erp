<template>
    <div>
        <div class="model_topcol">
            <span>历史对账单</span>
        </div>
        <div class="model_content" :style="{height: $store.state.home.modelContentHeight + 'px'}">
            <div class="model_content_inner">
                <!-- <div class="purchaseList_title">
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
                </div> -->
                <el-table
                    :data="tableData"
                    :height="$store.state.home.modelContentHeight - 20"
                    ref="purchaseListTable"
                    @selection-change="handleSelectionChange"
                    style="width: 100%">
                    <!-- <el-table-column
                    type="index"
                    label=" "
                    width="50">
                    </el-table-column> -->
                    <el-table-column
                        prop="billNo"
                        label="账单编号"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="customerName"
                        label="供应商名称">
                    </el-table-column>
                    <el-table-column
                        width="280"
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
                        prop="receivableMoney"
                        label="应收金额">
                    </el-table-column>
                    <el-table-column
                        prop="receivedMoney"
                        label="已收金额">
                    </el-table-column>
                    <el-table-column
                        prop="payableMoney"
                        label="应付金额">
                    </el-table-column>
                    <el-table-column
                        prop="paidMoney"
                        label="已付金额">
                    </el-table-column>
                    <el-table-column
                        prop="prop"
                        width="150"
                        label="操作">
                         <template slot-scope="scope">
                            <el-button
                            @click.native="tablePropEvent(scope.row.id, 1)"
                            type="text"
                            size="small">
                            详情
                            </el-button>
                            <!-- <el-button
                            @click.native="tablePropEvent(scope.row.id, 3)"
                            type="text"
                            size="small">
                            删除
                            </el-button> -->
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div class="model_footer">
            <el-button size="small" v-RouterBack style="width: 90px; margin-left: 25px; float: left; margin-top: 10px;">返 回</el-button>
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
            totalPage: 1,
            tableParam: {
                id: null,
                pageNo: 1,
                pageSize: 15
            },
            tableData: []
        }
    },
    computed:{},
    methods:{
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
            api.getHisBillList(this.tableParam).then((response) => {
                this.totalPage = response.data.total
                this.tableData = response.data.list

            })
        },
        tablePropEvent(rowid, type){
            if (type == 1){
                // this.$store.commit('setCurrentModelId', rowid) //历史账单详情返回之后,列表没数据,暂时隐藏
                this.$router.push({
                    name: '对账单详情',
                    params: {type: 2, id: rowid} //历史账单详情
                })
            }

        },

        handleSelectionChange(val){
        }

    },
    activated(){
        this.tableParam.id = this.$store.state.home.currentModelId
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
