<template>
    <div>
        <div class="model_topcol" v-if="inbound">
            <span style="color: #409EFF" >入库单</span>
            <span> - 新增入库单</span>
        </div>
        <div class="model_topcol" v-if="outbound">
            <span style="color: #409EFF">出库单</span>
            <span> - 新增出库单</span>
        </div>
        <div class="model_content" >
            <add-good v-if="isShowAddGoods" @saveAddgoodsFn="fromAddGoods"></add-good>
            <add-purchase v-if="isShowPurchase" @saveAddpurchaseFn="fromeAddPurchase" v-bind:boundType="boundType"></add-purchase>
            <div v-if="!isShowAddGoods && !isShowPurchase" class="content" :style="{height: $store.state.home.modelContentHeight - 20 + 'px'}">
                <el-form class="myForm" ref="myForm" :inline="true" :model="addFormData" :rules="rules" label-position="right" size="small" label-width="110px">
                    <div class="banner">
                        基本信息
                    </div>
                    <div class="baseInfoBox">
                        <el-form-item prop="storeType" label= "入库类型" v-if = "inbound">
                            <el-select v-model="addFormData.storeType" placeholder="请选择入库类型" @change="chooseCG">
                                <el-option label="采购" value="1"></el-option>
                                <el-option label="销售退货" value="2"></el-option>
                                <el-option label="其他" value="3"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item prop="storeType" label= "出库类型" v-if = "outbound" >
                            <el-select v-model="addFormData.storeType" placeholder="请选择出库类型" @change="chooseCG">
                                <el-option label="商城订单" value="0"></el-option>
                                <el-option label="线下订单" value="1"></el-option>
                                <el-option label="采购退货" value="2"></el-option>
                                <el-option label="批发" value="3"></el-option>
                                <el-option label="其他" value="4"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item prop="purchaseOrderNo" label="关联采购单号" v-if="showCG && inbound">
                            <el-input v-model="addFormData.purchaseOrderNo" placeholder="请选择采购单号">
                            </el-input>
                            <span @click="choosePurchaseEvent" class="el-icon-more" style="position: absolute; right: 5px;top: 9px;"></span>
                        </el-form-item>
                        <el-form-item prop="purchaseOrderNo" label="采购退货单号" v-if="showCG && outbound && addFormData.storeType == 2">
                            <el-input v-model="addFormData.purchaseOrderNo" placeholder="请选择采购单号">
                            </el-input>
                            <span @click="choosePurchaseEvent" class="el-icon-more" style="position: absolute; right: 5px;top: 9px;"></span>
                        </el-form-item>
                        <el-form-item prop="orderNos" label="关联订单号" v-if="addFormData.storeType == 0 && outbound">
                            <el-input v-model="addFormData.orderNos" placeholder="请选择订单号">
                            </el-input>
                            <span @click="chooseOrderListEvent" class="el-icon-more" style="position: absolute; right: 5px;top: 9px;"></span>
                        </el-form-item>
                        <el-form-item prop="storeHouseId" label="入库仓库" v-if = "inbound">
                            <el-select
                                v-model="addFormData.storeHouseId"
                                filterable
                                :disabled="showCG"
                                placeholder="请输入关键词">
                                <el-option
                                    v-for="item in houseId_option"
                                    :key="item.id"
                                    :label="item.warehouseName"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item prop="storeHouseId" label="出库仓库" v-if = "outbound">
                            <el-select
                                v-model="addFormData.storeHouseId"
                                :disabled="showCG && addFormData.storeType == 2"
                                filterable>
                                <el-option
                                    v-for="item in houseId_option"
                                    :key="item.id"
                                    :label="item.warehouseName"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <!-- <el-form-item prop="buyerId" label="采购单位">
                            <el-select :disabled="showCG" v-model="addFormData.buyerId" placeholder="请选择">
                                <el-option
                                    v-for="item in buyerId_option"
                                    :key="item.id"
                                    :label="item.buyerCompanyName"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item> -->
                    </div>
                    <div class="banner">
                        商品信息
                    </div>
                    <div style="padding: 10px;">
                        <el-table
                            :data="goodsInfoData"
                            show-summary
                            :span-method="arraySpanMethod"
                            border
                            :summary-method="getSummaries"
                            style="width: 100%">
                            <el-table-column
                                label=" "
                                type="index"
                                width="50">
                            </el-table-column>
                            <el-table-column
                                prop="oper"
                                label="操作"
                                width="60">
                                <template slot-scope="scope">
                                    <i v-if="!showCG" @click="goodTableAddEvent(scope)" style="font-size: 16px; color: #666666; cursor: pointer; margin-right: 10px;" class="fa fa-plus"></i>
                                    <i v-if="!showCG" @click="goodTableReduceEvent(scope)" style="font-size: 16px; color: #666666; cursor: pointer" class="fa fa-minus"></i>
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="编号"
                                width="180">
                                <template slot-scope="scope">
                                    <div v-if="scope.row.itemId === ''">
                                        <el-autocomplete
                                            disabled
                                            v-model="querySearchText"
                                            :style="{width: '270px'}"
                                            :fetch-suggestions="querySearchAsync"
                                            placeholder="输入商品名称/编号"
                                            @select="querySearchAsynSelect"
                                        >
                                        </el-autocomplete>

                                        <span @click="chooseGoodEvent" class="el-icon-more"></span>
                                    </div>
                                    <div v-if="scope.row.itemId !== ''">
                                        <span v-text="scope.row.itemCode"></span>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="itemMac"
                                label="条码">
                            </el-table-column>
                            <el-table-column
                                prop="itemName"
                                label="商品">
                            </el-table-column>
                            <el-table-column
                                prop="itemSpec"
                                label="商品规格">
                            </el-table-column>
                            <el-table-column
                                prop="itemExp"
                                label="保质期">
                            </el-table-column>
                            <el-table-column
                                prop="currentStoreNumber"
                                label="入库数"
                                v-if="inbound">
                                <template slot-scope="scope">
                                    <div v-if="scope.row.itemId === ''">
                                        <span></span>
                                    </div>
                                    <div v-if="scope.row.itemId !== ''">
                                        <el-input @change.native="unitTatalEvent(scope)" @keyup.native="unitTatalEvent(scope)" v-model="scope.row.currentStoreNumber"></el-input>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="currentStoreNumber"
                                label="出库数"
                                v-if="outbound"
                                width="197">
                                <template slot-scope="scope">
                                    <div v-if="scope.row.itemId === ''">
                                        <span></span>
                                    </div>
                                    <div v-if="scope.row.itemId !== '' && !$route.params.ischoose">
                                        <el-input-number
                                            :disabled='showCG' :min="0" :max="scope.row.maxInventory" @change.native="unitTatalEvent(scope)" @keyup.native="unitTatalEvent(scope)" v-model="scope.row.currentStoreNumber" label="描述文字">
                                        </el-input-number>
                                    </div>
                                    <div v-if="scope.row.itemId !== '' && $route.params.ischoose">
                                        <span v-text="scope.row.currentStoreNumber"></span>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="itemQuantifierUnit"
                                label="单位">
                            </el-table-column>
                            <el-table-column
                                label="备注">
                                <template slot-scope="scope">
                                    <div class="addRemark" @click="addRemark(scope.$index, scope.row)" v-if="scope.row.remark === ''">
                                        <i class="el-icon-plus" style="font-weight: 900;font-size: 16px"></i>
                                    </div>
                                    <div class="addRemark" @click="addRemark(scope.$index, scope.row)" v-else style="line-height: 20px;max-height: 40px;overflow: hidden;text-overflow: ellipsis">
                                        <i class="el-icon-edit" style="font-weight: 900;font-size: 16px"></i>
                                        <span>{{scope.row.remark}}</span>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <el-dialog
                        title="备注说明"
                        :visible.sync="dialogVisible"
                        width="30%">
                        <el-input
                            type="textarea"
                            :rows="4"
                            placeholder="请输入备注信息，不得超过200字"
                            v-model="remarkTextarea">
                        </el-input>
                        <span slot="footer" class="dialog-footer">
                            <el-button size="small" @click="remarkCancle">取 消</el-button>
                            <el-button size="small" type="primary" @click="remarkSure">确 定</el-button>
                        </span>
                    </el-dialog>
                    <div class="goodInfoBox">
                        <el-form-item prop="storeNo" label="入库单号" v-if="inbound">
                            <el-input v-model="addFormData.storeNo" placeholder="请输入入库单号" disabled></el-input>
                        </el-form-item>
                        <el-form-item prop="storeNo" label="出库单号" v-if="outbound">
                            <el-input v-model="addFormData.storeNo" placeholder="请输入出库单号" disabled></el-input>
                        </el-form-item>
                        <el-form-item prop="operator" label="经办人">
                            <el-input v-model="addFormData.operator" placeholder="请输入经办人"></el-input>
                        </el-form-item>
                        <br>
                        <el-form-item prop="creator" label="制单人">
                            <el-input v-model="addFormData.creator" placeholder="请输入制单人" disabled></el-input>
                        </el-form-item>
                        <el-form-item prop="storeTime" label="入库时间" v-if="inbound">
                            <el-date-picker
                                v-model="addFormData.storeTime"
                                type="datetime"
                                placeholder="请选择入库时间">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item prop="storeTime" label="出库时间" v-if="outbound">
                            <el-date-picker
                                v-model="addFormData.storeTime"
                                type="datetime"
                                placeholder="请选择出库时间">
                            </el-date-picker>
                        </el-form-item>
                        <br>
                        <el-form-item class="marker" :style="{width: '700px'}" prop="storeRemark" label="备注">
                            <el-input type="textarea" :style="{width: '530px'}" :rows="4" v-model="addFormData.storeRemark" placeholder="请输入备注信息，最多不超过100字"></el-input>
                        </el-form-item>
                    </div>
                </el-form>
            </div>
        </div>
        <div class="model_footer" v-if="!isShowAddGoods && !isShowPurchase">
            <el-button style="width: 90px" type="primary" size="small" @click="save">保存</el-button>
            <el-button style="width: 90px" size="small" v-RouterBack>取消</el-button>
        </div>
    </div>
</template>

<script>
import 'utils/allEnumeration'
import addGood from './forms/addGoods'
import addPurchase from './forms/addPurchaseNo'
import ME from 'utils/base'
import API from 'api/depot'
export default {
    components: {
        addGood,
        addPurchase
    },
    data(){
        return {
            dialogVisible: false,
            showCG: false,
            remarkTextarea: '',
            remarkIndex: 0,
            choose: false,
            querySearchText: '',
            houseId_option: [],
            buyerId_option: [],
            loading: false,
            inbound: false,
            outbound: false,
            boundType: 0,
            goodsInfoData: [{
                itemCode: '',
                currentStoreNumber: 0,
                itemId: ''
            }],
            addFormData: {
                storeType: null,
                storeTime: null,
                orderNos: null,
                storeHouseId: null,
                storeHouseName: null,
                buyerId: this.$store.state.home.userInfo.user.buyerId,
                buyerName: this.$store.state.home.userInfo.user.buyerCompanyName,
                operator: null,
                creator: null,
                purchaseOrderNo: null,
                purchaseOrderId: null,
                totalStoreNumber: 0,
                storeRemark: null,
                list: [],
                creatorId: null
            },
            rules: {
                storeHouseId: [
                    { required: true, message: '请选择仓库', trigger: 'change' }
                ],
                storeType: [
                    { required: true, message: '请选择类型', trigger: 'change' }
                ],
                // buyerId: [
                //     { required: true, message: '请选择采购单位', trigger: 'change' }
                // ],
                storeTime: [
                    { required: true, message: '请选择时间', trigger: 'change' }
                ],
                creator: [
                    { required: true, message: '请输入制单人', trigger: 'blur' }
                ],
                operator: [
                    { required: true, message: '请输入经办人', trigger: 'blur' }
                ],
                storeNo: [
                    { required: true, message: '请输入入库单号', trigger: 'blur' }
                ],
                purchaseOrderNo: [
                    { required: true, message: '请选择采购单', trigger: 'change' }
                ],
                orderNos: [
                    { required: true, message: '请选择订单', trigger: 'change' }
                ]
            },
            postData: {},
            validFlag: false
        }
    },
    computed:{
        isShowAddGoods() {
            return this.$store.state.depot.showAddGoods.id > 0
        },
        isShowPurchase() {
            return this.$store.state.depot.showPurchase.id > 0
        }
    },
    methods:{
        //选择订单
        chooseOrderListEvent(){
            this.$router.push({ path: "/chooseOrderList" })
        },
        // 添加商品备注
        addRemark(index, data) {
            this.dialogVisible = true
            this.remarkTextarea = data.remark
            this.remarkIndex = index
        },
        remarkCancle() {
            this.dialogVisible = false
        },
        remarkSure() {
            this.dialogVisible = false
            this.goodsInfoData[this.remarkIndex].remark = this.remarkTextarea
        },
        clearAll() {
            this.goodsInfoData = [{
                itemCode: '',
                currentStoreNumber: '',
                itemId: ''
            }]
            this.showCG = false
            this.addFormData.list = []
            if (this.$refs['myForm']) {
                this.$refs['myForm'].resetFields();
            }
            for (let key in this.addFormData) {
                if (key != 'buyerId' && key != 'buyerName') {
                    this.addFormData[key] = ''
                }
            }
        },
        // 关联采购单显示
        chooseCG(data) {
            if (this.inbound) {
                if (data == 1) {
                    this.showCG = true
                } else {
                    this.showCG = false
                }
            }
            if (this.outbound) {
                if (data == 2 || data == 0) {
                    this.showCG = true
                } else {
                    this.showCG = false
                }
            }
            this.goodsInfoData = [{
                itemCode: '',
                currentStoreNumber: '',
                itemId: ''
            }]
            for (let key in this.addFormData) {
                if (key == 'storeHouseId' || key == 'purchaseOrderNo' || key == 'orderNos') {
                    this.addFormData[key] = null
                }
            }
        },
        // 添加采购单
        fromeAddPurchase(data) {
            // 判断是否是已入库单
            if (data[0].storeStatus == 2) {
                this.$message({
                    type: 'warning',
                    message: '该采购单已入库，请重新选择'
                })
                return
            }
            this.addFormData.purchaseOrderNo = data[0].purchaseOrderNo
            this.addFormData.purchaseOrderId = data[0].id
            // 添加出入库仓库
            API.getWarehouseListActive().then(res => {
                this.houseId_option = res.data
                this.houseId_option.forEach(obj => {
                    if (obj.warehouseName == data[0].purchaseHouseName) {
                        this.addFormData.storeHouseId = obj.id
                    }
                })
            })

            this.addFormData.storeHouseName = data[0].purchaseHouseName
            this.addFormData.buyerName = data[0].buyerName
            // 根据采购单id获取详情
            this.goodsInfoData = []
            // 判断是入库还是出库，调不同接口
            if (this.inbound) {
                API.getPurchaseDetail(data[0].id).then((res) => {
                    res.data.list.forEach(response => {
                        let obj = {
                            itemMac: response.itemMac,
                            itemCode: response.itemSku, // 编号
                            itemName: response.itemName,
                            itemSpec: response.itemSpec,
                            itemExp: response.itemExp,
                            productionDate: response.productionDate * 1000,
                            itemId: response.baseItemId,
                            skuId: '',
                            currentStoreNumber: response.purchasingNumber,
                            itemQuantifierUnit: response.itemQuantifierUnit,
                            remark: ''
                        }

                        // 获取skuID
                        API.searchSkuList({itemId: response.baseItemId}).then((skuList) => {
                            skuList.data.list.forEach((sku) => {
                                if (obj.itemSpec.indexOf(sku.skuPropertyNames) > -1) {
                                    obj.skuId = sku.id
                                }
                            })
                            this.goodsInfoData.push(obj)
                        })
                    })

                })
            } else {
                this.addFormData.returnOrderNo = data[0].purchaseOrderNo
                this.addFormData.returnOrderId = data[0].id
                API.getReturnOrderDetail(data[0].id).then((res) => {
                    res.data.list.forEach(response => {
                        let obj = {
                            itemMac: response.itemMac,
                            itemCode: response.itemSku, // 编号
                            itemName: response.itemName,
                            itemSpec: response.itemSpec,
                            itemExp: response.itemExp,
                            productionDate: response.productionDate * 1000,
                            itemId: response.baseItemId,
                            skuId: '',
                            currentStoreNumber: response.returnNumber,
                            itemQuantifierUnit: response.itemQuantifierUnit,
                            remark: ''
                        }

                        // 获取skuID
                        API.searchSkuList({itemId: response.baseItemId}).then((skuList) => {
                            skuList.data.list.forEach((sku) => {
                                if (sku.skuPropertyNames == obj.itemSpec) {
                                    obj.skuId = sku.id
                                }
                            })
                            this.goodsInfoData.push(obj)
                        })
                    })

                })
            }

        },
        // 添加商品
        fromAddGoods(data) {
            let that = this
            let skuArr = []

            // 将接收的规格拆分
            data.forEach(res => {
                // 将规格拆分
                res.skuGroups.forEach((newSpec) => {
                    let obj = {
                        itemMac: res.barCode,
                        itemCode: res.itemCode,
                        itemName: res.title,
                        itemSpec: newSpec,
                        itemExp: res.expirationDateName,
                        productionDate: '',
                        itemId: res.id,
                        skuId: '',
                        currentStoreNumber: res.mount || 1,
                        itemQuantifierUnit: res.unit,
                        remark: ''
                    }
                    // 规格生产日期赋值给productionDate
                    let specArr = newSpec.split(':')
                    let dateStr = ''
                    let year = ''
                    let mounth = ''
                    let day = ''
                    let date = ''

                    specArr.forEach((key, index) => {
                        if (key.indexOf('生产日期') > 0) {
                            let a = index + 1

                            dateStr = specArr[a]
                            year = dateStr.split('年')[0]
                            mounth = dateStr.split('年')[1].split('月')[0]
                            day = dateStr.split('年')[1].split('月')[1].split('日')[0]
                            mounth = mounth > 10 ? mounth : '0' + mounth
                            if (day) {
                                day = day > 10 ? day : '0' + day
                            } else {
                                day = '01'
                            }
                            date = year + '-' + mounth + '-' + day
                            obj.productionDate = Date.parse(date)
                        }
                    })

                    // 获取skuID
                    API.searchSkuList({itemId: res.id}).then((skuList) => {
                        skuList.data.list.forEach((sku) => {
                            if (sku.skuPropertyNames == newSpec) {
                                obj.skuId = sku.id
                                if (this.outbound) { // 出库
                                    let obj2 = {
                                        itemId: sku.id,
                                        houseId: this.addFormData.storeHouseId,
                                        buyerId: this.addFormData.buyerId
                                    }

                                    API.getInventoryOutbound(obj2).then((re) => {
                                        obj.maxInventory = re.data.availableInventory
                                        if (re.data.availableInventory == 0) {
                                            obj.currentStoreNumber = 0
                                        }
                                    })
                                }
                            }
                        })
                    })
                    skuArr.push(obj)
                })
            })
            let addArr = []

            setTimeout(function () {
                skuArr.forEach((newObj) => {
                    let flag = false

                    that.goodsInfoData.forEach((oldObj) => {
                        if (newObj.skuId == oldObj.skuId) {
                            flag = true
                        }
                    })

                    if (!flag) {
                        addArr.push(newObj)
                    }
                })
                that.goodsInfoData = that.goodsInfoData.concat(addArr)
            }, 200)

            // 对数据去重和去空
            this.goodsInfoData.forEach((good, index) => {
                if (!good.itemId) {
                    this.goodsInfoData.splice(index, 1)
                }
            })
        },
        goodTableAddEvent(){
            let itemobj = {
                oper: '',
                itemId: '',
                itemSpec: '',
                barCode: '',
                goodName: '',
                SKU: '',
                qualityDate: '',
                productData: '',
                currentStoreNumber: '',
                unit: '',
                unitPrice: '',
                unitTotal: ''
            }

            this.goodsInfoData.push(itemobj)
        },
        goodTableReduceEvent(data) {
            this.goodsInfoData.splice(data.$index, 1)
            if (this.goodsInfoData.length < 1){
                let obj = {
                    itemId: ''
                }

                this.goodsInfoData.push(obj)
            }
        },
        arraySpanMethod({row, column, rowIndex, columnIndex}) {
            if (columnIndex === 2) {
                if (row.itemId == ""){
                    return [1, 3];
                } else {
                    return [1, 1];
                }
            } else {
                return [1, 1];
            }
        },
        // 获取采购列表
        getPurchaseList() {
            API.getPurchaseAll().then(res => {
                this.buyerId_option = res.data
            })
        },
        // 入库仓库模糊搜索
        remoteMethod(query) {
            if (query !== '') {
                this.loading = true;
                setTimeout(() => {
                    this.loading = false;
                    API.getWarehouseListActive().then(res => {
                        this.houseId_option = res.data.filter(item => {
                            return item.warehouseName.toLowerCase().indexOf(query.toLowerCase()) > -1;
                        });
                    })
                }, 200);
            } else {
                this.houseId_option = [];
            }
        },
        // 仓库列表获取
        getWareHouseList() {
            API.getWarehouseListActive().then(res => {
                this.houseId_option = res.data
            })
        },
        querySearchAsync(){

        },
        querySearchAsynSelect(){

        },
        unitTatalEvent(data){
            data.row.currentStoreNumber = data.row.currentStoreNumber.replace(/[^\d\.]/g, '')
            if (data.row.unitPrice == '' || data.row.currentStoreNumber == ''){
                data.row.unitTotal = ''
                return
            }

        },
        getSummaries(param){
            var columns = param.columns
            var data = param.data
            var sums = []

            columns.forEach((column, index) => {
                if (index === 0) {
                    sums[index] = '合计';
                    return;
                }
                if (column.property == 'currentStoreNumber' || column.property == 'unitTotal'){
                    const values = data.map(item => Number(item[column.property]));

                    if (!values.every(value => isNaN(value))) {
                        sums[index] = values.reduce((prev, curr) => {
                            const value = Number(curr);

                            if (!isNaN(value)) {
                                return prev + curr;
                            } else {
                                return prev;
                            }
                        }, 0);

                    }

                    if (column.property == 'unitTotal'){
                        this.tableTotalUnit = sums[index]
                    }
                } else {
                    sums[index] = ''
                }
            })

            return sums

        },
        chooseGoodEvent(){
            if (this.outbound) {
                // 出库加限制
                if (!this.addFormData.storeHouseId) {
                    this.$message({
                        type: 'warning',
                        message: '请先选择出库仓库'
                    })
                    return
                }
            }
            this.$store.commit('showAddGoods')
        },
        choosePurchaseEvent() {
            this.$store.commit('showPurchase')
        },
        // 产生随机数并加到编码
        MathRand(data, type) {
            let sixNum = ''
            let myDate = new Date()
            let monthArr = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
            let day = myDate.getDate().toString() > 9 ? myDate.getDate() : '0' + myDate.getDate()

            for (let i = 0; i < data; i++) {
                sixNum += Math.floor(Math.random() * 10);
            }
            this.addFormData.storeNo = type + '-' + myDate.getFullYear() + monthArr[myDate.getMonth()] + day + '-' + sixNum
        },
        // 保存结果
        save() {
            this.addFormData.totalStoreNumber = 0
            this.addFormData.list = []
            // 表单验证
            this.$refs.myForm.validate((valid) => {
                this.validFlag = valid
            })
            if (!this.validFlag) {
                return
            }
            if (this.$route.params.ischoose) { //选择订单的情况 wwb
                // 将表中商品信息添加到addFormData
                this.goodsInfoData.forEach(res => {
                    let obj = {
                        itemId: '',
                        baseItemId: '',
                        currentStoreNumber: '',
                        purchasingNumber: null,
                        remark: '',
                        itemSpec: null,
                        productionDate: ''
                    }

                    obj.itemId = res.itemSkuId //  与其他情况字段不一致 wwb sku id
                    obj.baseItemId = res.itemId
                    obj.remark = res.remark
                    obj.itemSpec = res.itemSpec
                    obj.productionDate = res.productionDate / 1000
                    obj.currentStoreNumber = res.currentStoreNumber

                    this.addFormData.totalStoreNumber += parseInt(obj.currentStoreNumber, 10)
                    this.addFormData.list.push(obj)
                })
            } else {
                // 将表中商品信息添加到addFormData
                this.goodsInfoData.forEach(res => {
                    let obj = {
                        itemId: '',
                        baseItemId: '',
                        currentStoreNumber: '',
                        purchasingNumber: null,
                        remark: '',
                        itemSpec: null,
                        productionDate: ''
                    }

                    obj.itemId = res.skuId // sku id
                    obj.baseItemId = res.itemId
                    obj.remark = res.remark
                    obj.itemSpec = res.itemSpec
                    obj.productionDate = res.productionDate / 1000
                    obj.currentStoreNumber = res.currentStoreNumber

                    this.addFormData.totalStoreNumber += parseInt(obj.currentStoreNumber, 10)
                    this.addFormData.list.push(obj)
                })
            }

            let userInfo = JSON.parse(localStorage.getItem('userInfo'))

            this.addFormData.creatorId = userInfo.user.id
            // 通过仓库ID和采购单ID赋值给addFormData的name
            this.houseId_option.forEach(res => {
                if (res.id === this.addFormData.storeHouseId) {
                    this.addFormData.storeHouseName = res.warehouseName
                }
            })

            this.postData = ME.deepCopy(this.addFormData)
            if (isNaN(this.postData.storeTime)) {
                this.postData.storeTime = Date.parse(this.postData.storeTime) / 1000
            } else {
                this.postData.storeTime = this.postData.storeTime / 1000
            }
            // 出入库操作
            if (this.$route.params.type === '入库') {
                // 数据判空
                for (let key in this.postData) {
                    if (!this.postData[key]) {
                        if (key == 'storeType') {
                            this.$message({
                                type: 'warning',
                                message: '请选择入库类型'
                            })
                            return
                        }
                        if (key == 'storeHouseId') {
                            this.$message({
                                type: 'warning',
                                message: '请选择入库仓库'
                            })
                            return
                        }

                        if (key == 'storeTime') {
                            this.$message({
                                type: 'warning',
                                message: '请选择入库时间'
                            })
                            return
                        }
                        if (key == 'storeNo') {
                            this.$message({
                                type: 'warning',
                                message: '请选择入库单号'
                            })
                            return
                        }
                        if (key == 'operator') {
                            this.$message({
                                type: 'warning',
                                message: '请选择经办人'
                            })
                            return
                        }
                    }
                }
                if (!this.postData.list[0].itemId) {
                    this.$message({
                        type: 'warning',
                        message: '请重新选择商品'
                    })
                    return
                }
                // 调取新增入库单的接口
                API.addInboundOrder(this.postData).then(res => {
                    this.$message({
                        type:'success',
                        message:'入库单添加成功'
                    })
                    this.$router.push({ name: "入库列表" })
                }).catch(error => {

                })
            } else if (this.$route.params.type === '出库') {
                this.$set(this.postData, 'deliverHouseId', this.postData.storeHouseId)
                this.$set(this.postData, 'deliverHouseName', this.postData.storeHouseName)
                this.$set(this.postData, 'deliverNo', this.postData.storeNo)
                this.$set(this.postData, 'deliverTime', this.postData.storeTime)
                this.$set(this.postData, 'deliverType', this.postData.storeType)
                this.$set(this.postData, 'totalDeliverNumber', this.postData.totalStoreNumber)
                this.$set(this.postData, 'remark', this.postData.storeRemark)
                this.postData.list.forEach(res => {
                    this.$set(res, 'deliverNumber', res.currentStoreNumber)
                    this.$delete(res, 'currentStoreNumber')
                })
                this.$delete(this.postData, 'storeHouseId')
                this.$delete(this.postData, 'storeHouseName')
                this.$delete(this.postData, 'storeNo')
                this.$delete(this.postData, 'storeTime')
                this.$delete(this.postData, 'storeType')
                this.$delete(this.postData, 'totalStoreNumber')
                this.$delete(this.postData, 'storeRemark')
                // 数据判空
                for (let key in this.postData) {
                    if (!this.postData[key]) {
                        if (key == 'deliverType') {
                            this.$message({
                                type: 'warning',
                                message: '请选择出库类型'
                            })
                            return
                        }
                        if (key == 'deliverHouseId') {
                            this.$message({
                                type: 'warning',
                                message: '请选择出库仓库'
                            })
                            return
                        }

                        if (key == 'deliverTime') {
                            this.$message({
                                type: 'warning',
                                message: '请选择出库时间'
                            })
                            return
                        }
                        if (key == 'deliverNo') {
                            this.$message({
                                type: 'warning',
                                message: '请选择出库单号'
                            })
                            return
                        }
                        if (key == 'creator') {
                            this.$message({
                                type: 'warning',
                                message: '请选择制单人'
                            })
                            return
                        }
                    }
                }
                if (!this.postData.list[0].itemId) {
                    this.$message({
                        type: 'warning',
                        message: '请重新选择商品'
                    })
                    return
                }
                // 调取新增出库单的接口
                API.addOutboundOrder(this.postData).then(res => {
                    this.$message({
                        type:'success',
                        message:'出库单添加成功'
                    })
                    this.$router.push({ name: "出库列表" })
                }).catch(error => {

                })
            }
        },
        chooseOrderDataInit(){
            if (this.$route.params.ischoose) {
                if (this.$store.state.home.currentModelId.item) {
                    this.goodsInfoData = this.$store.state.home.currentModelId.item
                    this.addFormData.orderNos = this.$store.state.home.currentModelId.secondaryOrderNo
                    this.goodsInfoData.forEach((item) => {
                        var outnum = parseInt(item.quantity, 10) * parseInt(item.specsQuantity, 10)

                        this.$set(item, 'itemSpec', item.specsMsg)
                        this.$set(item, 'currentStoreNumber', outnum)
                        this.$set(item, 'remark', '')


                    })
                }
            }
        }
    },
    created(){},
    mounted(){
        // 获取采购单位
        this.getPurchaseList()
        this.getWareHouseList()
    },
    activated () {
        if (!this.$route.params.ischoose) {
            this.clearAll()
            console.log('12222', this.addFormData)
        }
        this.$store.commit('hideChooseGoods')
        this.$store.commit('hidePurchase')
        // 初始化时间
        this.addFormData.storeTime = Date.parse(new Date())

        if (this.$route.params.type === '入库') {
            this.inbound = true
            this.outbound = false
            this.boundType = 0
        } else {
            this.outbound = true
            this.inbound = false
            this.boundType = 1
        }
        if (this.outbound) {
            this.MathRand(6, 'OUT')
        }
        if (this.inbound) {
            this.MathRand(6, 'IN')
        }
        // 更新制单人
        const USER = sessionStorage.getItem('user')

        this.addFormData.creator = JSON.parse(USER).loginCode

        this.chooseOrderDataInit()


    }
}
</script>
<style scoped>
    .banner{
        height: 40px;
        background: #f5f5f5;
        line-height: 40px;
        color: #606266;
        font-weight: 600;
        padding-left: 10px;
    }
    .baseInfoBox{
        padding-top: 10px;
    }
    .el-icon-more{
        cursor: pointer;
    }
    .el-date-editor{
        width: 194px;
    }
    .model_footer{
        line-height: 50px;
        text-align: left;
        padding-left: 40px;
    }
    .content{
        overflow: auto;
        background: #FFFFFF;
    }
    .goodInfoBox{
        width: 100%;
        margin-top: 20px;
    }
    .goodInfoBox .el-form-item{
        width: 400px;
    }
    .addRemark{
        cursor: pointer;
    }
</style>
