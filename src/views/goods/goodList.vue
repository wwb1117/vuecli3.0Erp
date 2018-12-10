<template>
    <div>
        <div class="model_topcol2" style="position: relative;">
            <div style="position: absolute; right: 20px; z-index: 999">
                <el-button v-perss="'新增赠品'"  @click="addGiveEvent" style="width: 90px" size="small">新增赠品</el-button>
                <el-button v-perss="'添加商品'" type="primary" @click="addGoodEvent" style="width: 90px" size="small">新增商品</el-button>
            </div>
            <el-tabs v-model="tableParam.itemType" @tab-click="handleClick">
                <el-tab-pane label="商品" name="0"></el-tab-pane>
                <el-tab-pane label="赠品" name="2"></el-tab-pane>
            </el-tabs>
        </div>
        <div class="model_content" :style="{height: $store.state.home.modelContentHeight + 'px'}">
            <div class="model_content_inner">
                <el-card v-show="isSupperBoxShow" class="box_card">
                    <div slot="header" class="clearfix">
                        <span :style="{fontSize: '16px'}">高级搜索</span>
                        <i @click="supperBoxShow" class="el-icon-close" style="float: right; padding: 3px 0; cursor: pointer"></i>
                    </div>
                    <el-form class="myForm" :inline="true" :model="tableParam" label-position="right" size="small" label-width="80px">
                        <el-form-item label="商品名称">
                            <el-input v-model="tableParam.title" placeholder="请输入商品名称"></el-input>
                        </el-form-item>
                        <el-form-item label="商品编码">
                            <el-input v-model="tableParam.itemCode" placeholder="请输入商品编码"></el-input>
                        </el-form-item>
                        <el-form-item label="商品条码">
                            <el-input v-model="tableParam.barCode" placeholder="请输入商品条码"></el-input>
                        </el-form-item>
                        <br>
                        <el-form-item label="商品品牌">
                            <el-select filterable v-model="tableParam.brandId" placeholder="请选择商品品牌">
                                <el-option v-for="item in brandList" :key="item.id" :label="item.brandName" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="商品分类">
                            <el-cascader
                                placeholder="请选择商品分类"
                                @change="cateSelectChange"
                                v-model="tableParam.categoryIdArr"
                                :options="categorylist"
                                change-on-select
                                :props='categoryOptionProps'
                                size='small'>
                            </el-cascader>
                        </el-form-item>
                        <el-form-item label="贸易类型">
                            <el-select v-model="tableParam.sendWay" placeholder="请选择贸易类型">
                                <el-option label="国内贸易" value="1"></el-option>
                                <el-option label="保税区直供" value="2"></el-option>
                                <el-option label="海外直邮" value="3"></el-option>
                            </el-select>
                        </el-form-item>
                        <br>
                        <el-form-item label="创建时间">
                            <el-date-picker
                                v-model="tableParam.timeDate"
                                value-format="timestamp"
                                @change="datePickerChangeEvent"
                                type="daterange"
                                :editable="false"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                        <br>
                        <el-form-item>
                            <el-button @click="supperSureBoxShow" style="width: 90px" type="primary" >确定</el-button>
                            <el-button @click="supperCansleBoxShow" style="width: 90px">取消</el-button>
                            <el-button class="color_hover" @click="resetBtnEvent" type="text" style="width: 40px; color: #636365">清空</el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
                <div v-show="!isExportShow&&!isFreSupBoxShow" class="purchaseList_title">
                    <el-input
                        size="small"
                        placeholder="请输入商品名称/商品ID"
                        prefix-icon="el-icon-search"
                        @clear="searchInputClear"
                        clearable
                        :style="{width: '378px'}"
                        @keyup.enter.native="searchInputClear"
                        v-model="tableParam.searchWord">
                    </el-input>
                    <el-button :style="{margin: '0 10px'}" @click="searchInputClear" type="primary" size="small">搜索</el-button>
                    <span @click="supperBoxShow">高级搜索</span>
                </div>
                <div v-show="!isExportShow&&isFreSupBoxShow" class="purchaseList_title">
                    <span class="resspan">搜索结果</span>
                    <el-button @click="resetSeraBtnEvent" icon="fa fa-eraser" type="text">清除搜索</el-button>
                    <el-button @click="goSeraBtnEvent" icon="el-icon-search" type="text">继续搜索</el-button>
                </div>
                <div v-show="isExportShow" class="purchaseList_exportWrap">
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
                </div>

                <el-table
                    :data="tableData"
                    :height="$store.state.home.modelContentHeight - 83"
                    ref="purchaseListTable"
                    @selection-change="handleSelectionChange"
                    :row-key="getRowKeys"
                    style="width: 100%">
                    <el-table-column
                        type="selection"
                        :reserve-selection="true"
                        width="30">
                    </el-table-column>
                    <el-table-column
                        prop="mainImg"
                        label="商品名称"
                        width="280">
                        <template slot-scope="scope" >
                            <img v-if="scope.row.mainImg" :src="scope.row.mainImg" style="float: left;width: 50px; height: 50px; margin-right: 10px">
                            <span @click="goodTitleClick(scope.row.id)" class="color_blue goodmore myCur" v-text="scope.row.title"></span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="id"
                        label="商品ID">
                    </el-table-column>
                    <el-table-column
                        prop="itemCode"
                        label="编号">
                    </el-table-column>
                    <el-table-column
                        label="商品规格">
                        <template slot-scope="scope">
                            <el-button type="text" @click="lookGoodSku(scope)" v-perss="'sku+包装规格'"><span style="font-size:12px">查看</span></el-button>
                            <el-dialog title="规格明细" :visible.sync="dialogTableVisible">
                                <el-table :data="gridData" class='tablebody' >
                                    <el-table-column property="skuPropertyNames" label="规格" align='center'></el-table-column>
                                    <el-table-column property="id" label="SKU编码"  align='center'></el-table-column>
                                </el-table>
                            </el-dialog>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="categoryName"
                        label="分类">
                    </el-table-column>
                    <el-table-column
                        prop="brandName"
                        label="品牌">
                    </el-table-column>
                    <el-table-column
                        prop="sendWay"
                        label="贸易类型">
                        <template slot-scope="scope">
                            <span v-if="scope.row.sendWay == 1">国内贸易</span>
                            <span v-if="scope.row.sendWay == 2">保税区直供</span>
                            <span v-if="scope.row.sendWay == 3">海外直邮</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="rate"
                        label="商品费率‰">
                    </el-table-column>
                    <el-table-column
                        v-if="tableParam.itemType == 0"
                        prop="status"
                        label="出售状态">
                        <template slot-scope="scope">
                            <span v-if="scope.row.status == 0">供应商待审核</span>
                            <span v-if="scope.row.status == 1">供应商已驳回</span>
                            <span v-if="scope.row.status == 2">平台待审核</span>
                            <span v-if="scope.row.status == 3">平台已驳回</span>
                            <span v-if="scope.row.status == 4">待售中</span>
                            <span v-if="scope.row.status == 5">出售中</span>
                            <span v-if="scope.row.status == 6">停售中</span>
                            <span v-if="scope.row.status == 7">其他</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="created"
                        label="创建时间">
                        <template slot-scope="scope">
                            <span>{{scope.row.created | time_m}}</span>
                        </template>
                    </el-table-column>

                    <el-table-column
                        prop="prop"
                        width="150"
                        label="操作">
                         <template slot-scope="scope">
                            <div>
                                <el-button
                                    @click.native.prevent="tablePropEvent(scope.row.id, 1)"
                                    v-perss="'修改商品'"
                                    type="text"
                                    size="small">
                                    修改
                                </el-button>
                                <el-button
                                    v-perss="'修改详情'"
                                    @click.native.prevent="tablePropEvent(scope.row.id, 2)"
                                    type="text"
                                    size="small">
                                    详情
                                </el-button>
                            </div>
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
import gapi from 'api/goods'
export default {
    data(){
        return {
            dialogTableVisible: false,
            brandList: [],
            gridData: [],
            categorylist: [],
            categoryOptionProps: {
                label:'categoryName',
                value:'id',
                children: 'itemCategoryVOList'
            },

            totalPage: 1,
            selectTableData: [],
            supplierSelectData: [],
            repositorySelectData: [],
            buyerNameSelectData: [],
            isSupperBoxShow: false,
            isFreSupBoxShow: false,
            tableParam: {
                itemCode: '',
                barCode: '',
                itemType: '0',
                timeDate: '',
                searchWord: '', //模糊搜索
                title: '', //商品名称
                categoryIdArr: [],
                categoryId: '', //商品类目
                brandId: '', //商品品牌
                sendWay: '',
                screenWay: '7',
                startTime: '',
                endTime: '',
                pageNo: 1,
                pageSize: 15
            },
            isExportShow: false,
            tableData: []
        }
    },
    computed:{},
    methods:{
        // 查看规格
        lookGoodSku(scope) {
            this.dialogTableVisible = true
            // console.log(scope.row.id)
            let obj = {
                itemId: scope.row.id
            }

            gapi.getitemskuProperty(obj).then((response)=>{
                this.gridData = []

                this.gridData = response.data.list
            })
        },
        cateSelectChange(){
            if (this.tableParam.categoryIdArr.length > 0) {
                this.tableParam.categoryId = this.tableParam.categoryIdArr[this.tableParam.categoryIdArr.length - 1]
            }
        },
        addGoodEvent(){
            this.$router.push({
                path: '/addGood'
            })
        },
        addGiveEvent(){
            this.$router.push({
                path: '/addGive'
            })
        },
        getRowKeys(row){
            return row.id
        },
        resetSeraBtnEvent(){
            this.resetBtnEvent()
            this.getTableData()
            this.isFreSupBoxShow = false
        },
        goSeraBtnEvent(){
            this.isSupperBoxShow = true
        },
        searchInputClear(){
            this.tableParam.pageNo = 1
            this.getTableData()
        },
        supperBoxShow(){
            this.isSupperBoxShow = !this.isSupperBoxShow
        },
        supperCansleBoxShow () {
            this.isSupperBoxShow = !this.isSupperBoxShow
        },
        supperSureBoxShow () {
            this.isSupperBoxShow = !this.isSupperBoxShow
            this.isFreSupBoxShow = true
            this.tableParam.pageNo = 1
            this.getTableData()
        },
        resetBtnEvent () {
            for (var key in this.tableParam) {
                if (key != 'pageNo' && key != 'pageSize' && key != 'screenWay' && key != 'itemType') {
                    this.tableParam[key] = ""
                }
            }
            this.tableParam.categoryIdArr = []
        },
        handleSizeChange(val){
            this.tableParam.pageSize = val
            this.getTableData()
        },
        handleCurrentChange(val){
            this.tableParam.pageNo = val
            this.getTableData()
        },
        closeExportWrap(){
            this.isExportShow = false
            this.$refs.purchaseListTable.clearSelection()
        },
        handleSelectionChange(val){
            this.selectTableData = val
            if (this.selectTableData.length > 0){
                this.isExportShow = true
            } else {
                this.isExportShow = false
            }
        },
        handleClick(tab){
            this.getTableData()
        },
        datePickerChangeEvent (val) {
            this.tableParam.startTime = Math.round(val[0] / 1000)
            this.tableParam.endTime = Math.round(val[1] / 1000)
        },
        getTableData(){
            return gapi.getGoodList(this.tableParam).then((response) => {
                this.totalPage = response.data.total
                this.tableData = response.data.list

            })
        },
        getitemBrandlist(){
            let obj = {pageNo: 1, pageSize: 999999}

            gapi.getitemBrandlist(obj).then((response) => {
                this.brandList = response.data.list
            })

        },
        getCategorylist(){
            gapi.getcategorylist().then((response) => {
                this.categorylist = response.data
            })
        },
        goodTitleClick(rowid){
            this.$store.commit('setCurrentModelId', rowid)

            this.$router.push('goodsDetails')
        },
        tablePropEvent(rowid, type){
            this.$store.commit('setCurrentModelId', rowid)
            if (type == 2) { //详情
                if (this.tableParam.itemType == 0) {  //商品
                    this.$router.push({
                        path: '/goodsDetails'
                    })
                } else {
                    this.$router.push({      //赠品
                        path: '/giveDetails'
                    })
                }
            }
            if (type == 1) { //修改
                if (this.tableParam.itemType == 0) {  //商品
                    this.$router.push({
                        path: '/editGood'
                    })
                } else {
                    this.$router.push({      //赠品
                        path: '/editGive'
                    })
                }
            }
        }

    },
    activated(){
        this.getitemBrandlist()
        this.getCategorylist()
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
.model_topcol2{
    height: 46px;
    line-height: 46px;
    padding-left: 20px;
}

</style>
