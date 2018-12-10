<template>
    <div>
        <div class="model_topcol">
            <span style="color: #409EFF">商品列表</span>
            <span> - 新增赠品</span>
        </div>
        <div class="model_content">
            <div class="model_content_inner" :style="{height: $store.state.home.modelContentHeight - 20 + 'px', overflow: 'auto', paddingBottom: '50px'}">
                <el-form :inline="true" class="myForm" :rules="rules" ref="addGoodForm" :model="addFormData" label-position="right" size="small" label-width="140px">
                    <div class="banner">
                        选择要仅作为赠品的商品模板
                    </div>
                    <el-form-item :required="true" label="商品分类">
                        <el-cascader
                            placeholder="请选择商品分类"
                            @change="goodModelCateChangeEvent"
                            v-model="categoryIdArr"
                            :options="categoryListArr"
                            :props='categoryProps'
                            size='small'
                            style="width:200px">
                        </el-cascader>
                    </el-form-item>
                    <el-form-item prop="itemTemplateId" label="商品模板">
                        <el-select filterable v-model="addFormData.itemTemplateId" @change="goodTemplateChangeEvent" placeholder="请选择商品模板">
                            <el-option
                                v-for="item in itemTemplateList"
                                :key="item.id"
                                :label="item.title"
                                :value="item.id">
                            </el-option>
                        </el-select>
                        <p v-if="itemTemplateList.length == 0 && categoryIdArr.length != 0" style="float: right; margin: 0 0 0 20px;"><span class="color_red">暂无对应商品,请联系公司客服 : </span><span class="col_cyan" v-text="telphone"></span></p>
                    </el-form-item>
                    <div v-if="addFormData.itemTemplateId" style="margin-left: 90px;">
                        <div style="line-height: 25px; overflow: hidden;">
                            <img style="width: 120px; float: left" :src="itemTemInfo.mainImg">
                            <span v-text="itemTemInfo.title"></span><br>
                            <span>商品分类 : </span>
                            <span v-text="itemTemInfo.cateText"></span><br>
                            <span>品牌 : </span>
                            <span v-text="itemTemInfo.brandName"></span>
                        </div>
                    </div>

                    <div class="banner">
                        商品规格
                    </div>
                    <div>
                        <el-form-item :required="true" label="库存最小单位" >
                            <el-select filterable v-model="addFormData.unitId" placeholder="请选择库存最小单位">
                                <el-option
                                    v-for="item in unitList"
                                    :key="item.id"
                                    :label="item.unit"
                                    :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-row>
                            <el-col :span="2" class="paddinglr20" style="text-align: right">
                                <label>商品规格</label>
                            </el-col>
                            <el-col class="boxBorder padding10" :span="22">
                                <div :key="index" v-for="(item, index) in skuPropertyList">
                                    <div class="goodSkuBackGround paddingtb10">
                                        <label style="margin: 0 10px">规格名</label>
                                        <div class="relative inline">
                                            <i @click="removeGoodSkuItem(index)" class="el-icon-error icon_position"></i>
                                            <el-select filterable v-model="item.id" @change="goodSkuNameChangeEvent(index)" size="small" placeholder="请选择规格名">
                                                <el-option
                                                    v-for="item in skuNameList"
                                                    :key="item.id"
                                                    :disabled="item.disabled"
                                                    :label="item.skuPropertyName"
                                                    :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </div>
                                    </div>
                                    <div>
                                        <label style="margin-left: 10px">规格值</label>
                                        <div v-for="(item2, index2) in item.itemSkuPropertyValueDTOS" :key="index2" class="padding10 relative inline">
                                            <i @click="removeGoodSkuValueItem(index, index2)" class="el-icon-error icon_position"></i>
                                            <el-select size="small" v-model="item2.id" @change="goodSkuValueChangeEvent(index, index2)" placeholder="请选择规格值">
                                                <el-option
                                                    v-for="(item3, index3) in item.skuValueList"
                                                    :key="index3"
                                                    :disabled="item3.disabled"
                                                    :label="item3.skuPropertyValueName"
                                                    :value="item3.id">
                                                    <div v-if="item3.producedDate">
                                                        <span style="float: left">{{ item3.skuPropertyValueName }}</span>
                                                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item3.producedDate | time}}</span>
                                                    </div>
                                                </el-option>
                                            </el-select>
                                        </div>

                                        <div class="padding10 relative inline">
                                            <el-button @click="addGoodSkuItemValueEvent(index)" type="text" size="small" style="width: 90px;">添加规格值</el-button>
                                        </div>

                                    </div>
                                </div>
                                <div class="goodSkuBackGround padding10">
                                    <el-button @click="addGoodSkuItemEvent" type="primary" size="small" style="width: 90px;">添加规格项</el-button>
                                </div>
                            </el-col>
                            <div style="margin-left: 9%; float: left; padding: 20px 0">如有颜色、尺码等多种规格，请添加商品规格</div>
                        </el-row>
                        <el-row>
                            <el-col :span="2" class="paddinglr20" style="text-align: right">
                                <label>规格明细</label>
                            </el-col>
                            <el-col class="boxBorder padding10" :span="22">
                                <el-table
                                    border
                                    @selection-change="handleSelectionChange"
                                    :data="skuDetailInfo.skuList"
                                    style="width: 100%">
                                        <el-table-column type="selection" width="35"></el-table-column>
                                        <el-table-column prop="skuPropertyValueName" label="规格"></el-table-column>
                                        <el-table-column prop="inventory" label="库存">
                                            <template slot="header" slot-scope="slot">
                                                <label class="myRequired">库存(包/罐/装)</label>
                                            </template>
                                            <template slot-scope="scope" >
                                                <el-input @change.native="numInputEvent(scope.row, 'inventory')" @keyup.native="numInputEvent(scope.row, 'inventory')" v-model="scope.row.inventory" size="small" placeholder="库存数量"></el-input>
                                            </template>
                                        </el-table-column>
                                </el-table>
                            </el-col>
                        </el-row>
                    </div>
                </el-form>

            </div>
        </div>
        <div class="model_footer">
            <el-button type="primary" @click="addGiveSaveEvent" size="small" style="width: 90px; margin-left: 25px;">保 存</el-button>
            <el-button size="small" @click="addGiveCansoleEvent" style="width: 90px; margin-left: 25px;">取 消</el-button>
        </div>
    </div>
</template>

<script>
import api from 'api/goods'
import capi from 'api/common'
export default {
    data(){
        return {
            telphone: '',
            selectTableData: [], //够选的规格明细数据
            categoryIdArr: [],
            categoryListArr: [],
            skuPropertyList: [],
            itemTemplateList: [],
            unitList: [],
            skuNameList: [],  //sku规格名列表
            categoryProps: {
                label:'categoryName',
                value:'id',
                children: 'itemCategoryVOList'
            },
            itemTemInfo: {},
            skuDetailInfo: {
                skuList: []
            },
            rules: {
                itemTemplateId: [
                    { required: true, message: '请选择商品模板', trigger: 'change' }
                ]
            },
            addFormData: {
                unitId: '',
                categoryIdArr: [],
                categoryId: '',
                itemTemplateId: '',
                title: ''
            }
        }
    },
    computed:{},
    methods:{
        getCustomPhone(){
            capi.getCustomPhone().then((response) => {
                this.telphone = response.data.telephone
            })
        },
        numInputEvent(target, filed){ //只限整数 库存
            target[filed] = this.myBase.formatIntNum(target[filed])
        },
        addGiveSaveEvent(){
            if (this.addFormData.itemTemplateId == "") {
                this.$message({
                    type: 'warning',
                    duration: 1500,
                    showClose: true,
                    message: '请选择商品模板!'
                });
                return
            }
            if (this.addFormData.unitId == "") {
                this.$message({
                    type: 'warning',
                    duration: 1500,
                    showClose: true,
                    message: '请选择库存最小单位!'
                });
                return
            }
            if (this.selectTableData.length <= 0) {
                this.$message({
                    type: 'warning',
                    duration: 1500,
                    showClose: true,
                    message: '请选择规格明细数据!'
                });
                return
            }

            for (let item of this.selectTableData) {
                if (!item.inventory || item.inventory == '0') {
                    this.$message({
                        type: 'warning',
                        duration: 1500,
                        showClose: true,
                        message: '请填写规格明细库存且不能为零!'
                    });
                    return
                }
            }

            let skuPropertyList = JSON.parse(JSON.stringify(this.skuPropertyList))

            skuPropertyList.forEach((item, index) => {
                delete item.skuValueList
            })

            this.addFormData.skuProperty = JSON.stringify(skuPropertyList) //skuList
            this.addFormData.skuList = JSON.stringify(this.selectTableData) //skuList

            api.addGive(this.addFormData).then((response) => {
                this.$message({
                    type: 'success',
                    duration: 1500,
                    showClose: true,
                    message: '新增赠品成功!'
                })
                this.$router.push({
                    path: '/goodsList'
                })
            })

        },
        addGiveCansoleEvent(){
            this.$router.push({
                path: '/goodsList'
            })
        },
        handleSelectionChange(val){
            this.selectTableData = val
        },
        goodSkuNameChangeEvent(index){
            this.getItemskuPropertylist(index)
            this.setGoodSkuNameDisabled()
            this.skuPropertyList[index].itemSkuPropertyValueDTOS = [ //规格值初始化
                {id: '', skuPropertyValueName: ''}
            ]

            this.setSkuDetailsTableData() //设置规格明细
        },
        goodSkuValueChangeEvent(index, index2){
            let skuvalueid = this.skuPropertyList[index].itemSkuPropertyValueDTOS[index2].id

            this.skuPropertyList[index].skuValueList.forEach((item) => {
                if (item.id == skuvalueid) {
                    this.skuPropertyList[index].itemSkuPropertyValueDTOS[index2].skuPropertyValueName = item.skuPropertyValueName
                }
            })

            this.setGoodSkuValueDisabled(index)
            this.setSkuDetailsTableData() //设置规格明细
        },
        removeGoodSkuValueItem(index, index2){ //移除规格值
            if (this.skuPropertyList[index].itemSkuPropertyValueDTOS.length <= 1) {
                this.$message({
                    type: 'warning',
                    duration: 1500,
                    showClose: true,
                    message: '至少添加一个规格值!'
                });
                return
            }
            this.skuPropertyList[index].itemSkuPropertyValueDTOS.splice(index2, 1)
            this.setGoodSkuValueDisabled(index)
            this.setSkuDetailsTableData() //设置规格明细
        },
        setGoodSkuValueDisabled(index){ //设置规格值得禁用选项
            for (let item of this.skuPropertyList[index].skuValueList) {
                item.disabled = false
                for (let item2 of this.skuPropertyList[index].itemSkuPropertyValueDTOS) {
                    if (item.id == item2.id) {
                        item.disabled = true
                    }
                }
            }
        },
        getItemskuPropertylist(index){ //获取对应规格的规格值列表
            let param = {id: this.skuPropertyList[index].id, mark: 1}

            api.getitemskuPropertylist(param).then((res) => {
                this.skuPropertyList[index].skuValueList = res.data.list[0].itemSkuPropertyValueVOList
                //初始化禁用选项
                this.skuPropertyList[index].skuValueList.forEach((item) => {
                    this.$set(item, 'disabled', false)
                })
            })
        },
        addGoodSkuItemEvent(){ //添加规格项
            if (this.skuPropertyList.length >= 3) {
                this.$message({
                    type: 'warning',
                    duration: 1500,
                    showClose: true,
                    message: '最多可添加三条商品规格!'
                });
                return
            }
            let initobj = { //传给后台的数据结构
                id: '',
                skuPropertyName: '',
                skuValueList: [],
                itemSkuPropertyValueDTOS: [
                    {
                        id: '',
                        skuPropertyValueName: ''
                    }
                ]
            }

            this.skuPropertyList.push(initobj)
        },
        addGoodSkuItemValueEvent(index){ //添加规格值
            let initobj = {
                id: '',
                skuPropertyValueName: ''
            }

            this.skuPropertyList[index].itemSkuPropertyValueDTOS.push(initobj)
        },
        getUnitList() { // 获取单位选项
            api.getitemunitlist().then((response)=>{
                this.unitList = response.data.list
            })
        },
        getSkuNameList() { // 获取规格列表
            let obj = { post:'post' }

            api.getitemskuPropertylist(obj).then((res) => {
                this.skuNameList = res.data.list
                this.skuNameList.forEach((item, index) => {
                    this.$set(item, 'disabled', false)
                })
            })
        },
        setGoodSkuNameDisabled(){ //设置规格名的禁用选项
            for (let item2 of this.skuNameList){
                item2.disabled = false
                for (let item of this.skuPropertyList) {
                    if (item.id == item2.id) {
                        item2.disabled = true
                    }
                }
            }
        },
        removeGoodSkuItem(index){  //移除规格项
            this.skuPropertyList.splice(index, 1)
            this.setGoodSkuNameDisabled()
            this.setSkuDetailsTableData() //设置规格明细
        },
        setSkuDetailsTableData(){
            //去除规格组合,数组空值bug待修改
            let skuArr1 = []
            let skuArr2 = []
            let skuArr3 = []

            this.skuDetailInfo = {skuList: []}

            if (this.skuPropertyList.length == 3) {
                skuArr3 = this.skuPropertyList[2].itemSkuPropertyValueDTOS
                skuArr2 = this.skuPropertyList[1].itemSkuPropertyValueDTOS
                skuArr1 = this.skuPropertyList[0].itemSkuPropertyValueDTOS
            } else if (this.skuPropertyList.length == 2){
                skuArr2 = this.skuPropertyList[1].itemSkuPropertyValueDTOS
                skuArr1 = this.skuPropertyList[0].itemSkuPropertyValueDTOS
            } else if (this.skuPropertyList.length == 1) {
                skuArr1 = this.skuPropertyList[0].itemSkuPropertyValueDTOS
            }
            for (let item1 of skuArr1) {
                if (item1.id != '') { //去除空值
                    if (skuArr2.length > 0) {
                        for (let item2 of skuArr2) {
                            if (item2.id != '') {
                                if (skuArr3.length > 0) {
                                    for (let item3 of skuArr3) {
                                        let obj = this.setSkuTableSetItem([item1, item2, item3])

                                        this.skuDetailInfo.skuList.push(obj)
                                    }
                                } else {
                                    let obj = this.setSkuTableSetItem([item1, item2])

                                    this.skuDetailInfo.skuList.push(obj)
                                }
                            }
                        }
                    } else {
                        let obj = this.setSkuTableSetItem([item1])

                        this.skuDetailInfo.skuList.push(obj)
                    }

                }
            }
        },
        setSkuTableSetItem(arr){
            let obj = {}

            if (arr.length == 3){
                obj.skuGroup = [arr[0].id, arr[1].id, arr[2].id]
                obj.skuPropertyValueName = '(' + arr[0].skuPropertyValueName + ')+' + '(' + arr[1].skuPropertyValueName + ')+' + arr[2].skuPropertyValueName //规格值
            } else if (arr.length == 2){
                obj.skuGroup = [arr[0].id, arr[1].id]
                obj.skuPropertyValueName = '(' + arr[0].skuPropertyValueName + ')+' + '(' + arr[1].skuPropertyValueName + ')' //规格值
            } else {
                obj.skuGroup = [arr[0].id]
                obj.skuPropertyValueName = arr[0].skuPropertyValueName //规格值
            }
            obj.barCode = '' //条码
            obj.inventory = '' //库存
            obj.singleSkuCostPrice = '' //成本价

            return obj
        },
        getGoodTemDetail(){
            api.getGoodTemDetail(this.addFormData.itemTemplateId).then((response) => {
                this.itemTemInfo = response.data
                var cateText = ''
                var resItemArr = []
                var resArr = Object.values(this.itemTemInfo.itemCategoryVOMap)

                for (let item of resArr){
                    resItemArr.push(item.categoryName)
                    this.addFormData.categoryIdArr.push(item.id)
                }

                this.addFormData.categoryId = this.addFormData.categoryIdArr[this.addFormData.categoryIdArr.length - 1]

                cateText = resItemArr.join(' < ')
                this.$set(this.itemTemInfo, 'cateText', cateText)

            })
        },
        goodTemplateChangeEvent(){
            this.getGoodTemDetail()
        },
        getGoodTemList(){ //获取商品模板
            var param = {categoryId: this.categoryIdArr[this.categoryIdArr.length - 1]}

            api.getGoodTemList(param).then((response) => {
                this.itemTemplateList = response.data.list
            })
        },
        goodModelCateChangeEvent(){
            this.addFormData.itemTemplateId = ''
            this.getGoodTemList()
        },
        getCategoryList() { // 获取商品分类选项
            api.getcategorylist().then((response)=>{
                this.categoryListArr = response.data
            })
        },
        reset(){
            this.addFormData = {
                categoryIdArr: [],
                categoryId: '',
                itemTemplateId: '',
                title: ''
            }
            this.categoryIdArr = []
            this.itemTemplateList = []
            this.skuPropertyList = []
            this.skuDetailInfo = {
                skuList: []
            }
            this.$nextTick(() => {
                this.$refs['addGoodForm'].clearValidate()
            })
        }
    },
    created(){},
    activated(){
        this.reset()
        this.getCategoryList()
        this.getSkuNameList()
        this.getUnitList()
        this.getCustomPhone()
    },
    mounted(){

    }
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
.banner{
    height: 40px;
    background: #f5f5f5;
    line-height: 40px;
    color: #606266;
    font-weight: 600;
    padding-left: 10px;
    margin-bottom: 18px;
}
.goodSkuBackGround{
    background: #f5f5f5;
}
.padding20{
    padding: 20px;
}
.padding10{
    padding: 10px;
}
.paddingtb10{
    padding: 10px 0;
}
.paddinglr20{
    padding: 0 20px;
}
.boxBorder{
    border: 1px solid #e4e8eb;
}
.relative{
    position: relative;
}
.icon_position{
    position: absolute;
    left: 220px;
    top: 5px;
    z-index: 999;
    cursor: pointer;
}
.icon_position:hover{
    font-size: 28px;
    left: 215px;
    top: 0px;
}
.icon_position2{
    position: absolute;
    top: 5px;
    z-index: 999;
    cursor: pointer;
}
.icon_position2:hover{
    font-size: 28px;
    top: 0px;
}
.inline{
    display: inline-block;
}
</style>
