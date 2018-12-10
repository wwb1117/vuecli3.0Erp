<template>
    <div>
        <div class="model_topcol">
            <span style="color: #409EFF">商品列表</span>
            <span> - 修改商品</span>
        </div>
        <div class="model_content">
            <div class="model_content_inner" :style="{height: $store.state.home.modelContentHeight - 20 + 'px', overflow: 'auto'}">
                <el-form :inline="true" class="myForm" ref="addGoodForm" :rules="rules" :model="addFormData" label-position="right" size="small" label-width="120px">
                    <div class="banner">
                        选择商品模板
                    </div>
                    <el-form-item :required="true" label="商品分类">
                        <el-cascader
                            :disabled="true"
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
                        <el-select :disabled="true" filterable v-model="addFormData.itemTemplateId" @change="goodTemplateChangeEvent" placeholder="请选择商品模板">
                            <el-option
                                v-for="item in itemTemplateList"
                                :key="item.id"
                                :label="item.title"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <div v-if="addFormData.itemTemplateId" style="margin-left: 120px;">
                        <!-- <p><span class="color_red">如暂无对应商品,请联系公司客服 : </span><span class="col_cyan">400-998-1059</span></p> -->
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
                        基本信息
                    </div>
                     <el-form-item class="goodWrapGoodName" label="商品名称" prop='title'>
                        <el-input v-model="addFormData.title" placeholder="请输入商品名称"></el-input>
                    </el-form-item>
                    <br>
                    <el-form-item label="商品卖点">
                        <el-input type="textarea" maxlength="100" style="width:563px" v-model="addFormData.sellingPoint" placeholder="请输入商品卖点，长度<100" rows='2'></el-input>
                    </el-form-item>
                    <br>
                    <el-form-item label="购买提醒">
                        <el-input type="textarea" maxlength="100" style="width:563px" v-model="addFormData.buyRemind" placeholder="请输入购买提醒，长度<100" rows='2'></el-input>
                    </el-form-item>
                    <br>
                    <el-form-item label="商品编码">
                        <el-input v-model="addFormData.itemCode" placeholder="请输入商品编码" ></el-input>
                    </el-form-item>
                    <el-form-item ref="addGoodsExpReset" :required="addFormData.expirationDateStatus == 1 ? true : false" class="goodWrapExpiration" label="有无保质期" style="position: relative;" prop='expirationDate'>
                        <el-checkbox style="position: absolute; left: -105px; top: 0" :false-label="0" :true-label="1" @change="checkboxChangeEvent" v-model="addFormData.expirationDateStatus" ></el-checkbox>
                        <el-input @change.native="formNuminput('expirationDate')" @keyup.native="formNuminput('expirationDate')" v-model="addFormData.expirationDate" placeholder="请输入保质期限" >
                            <template slot="append">月</template>
                        </el-input>
                    </el-form-item>
                    <br>
                    <el-form-item prop="brandId" label="商品品牌">
                        <el-select filterable :disabled="true" v-model="addFormData.brandId" placeholder="请选择商品模板">
                            <el-option
                                v-for="item in brandList"
                                :key="item.id"
                                :label="item.brandName"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="categoryId" label="商品分类">
                        <el-cascader
                            :disabled="true"
                            placeholder="请选择商品分类"
                            @change="categoryChangeEvent"
                            v-model="addFormData.categoryIdArr"
                            :options="categoryListArr"
                            :props='categoryProps'
                            size='small'
                            style="width:200px">
                        </el-cascader>
                    </el-form-item>
                    <br>
                    <el-form-item prop="sendWay" label="贸易类型">
                        <el-select v-model="addFormData.sendWay" placeholder="请选择贸易类型">
                            <el-option
                                v-for="(item, key) in $allEnumeration.sendWay"
                                :key="key"
                                :label="item"
                                :value="key">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="goodWrapExpiration" label="建议零售价" prop='suggestedPrice'>
                        <el-input @change.native="formNuminput('suggestedPrice')" @keyup.native="formNuminput('suggestedPrice')" v-model="addFormData.suggestedPrice" placeholder="请输入建议零售价" >
                            <template slot="append">元</template>
                        </el-input>
                    </el-form-item>
                    <br>
                    <el-form-item prop="unitId" label="库存最小单位" >
                        <el-select filterable v-model="addFormData.unitId" placeholder="请选择库存最小单位">
                            <el-option
                                v-for="item in unitList"
                                :key="item.id"
                                :label="item.unit"
                                :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="goodWrapExpiration" label="服务费率" prop='rate'>
                        <el-input :disabled="true" v-model="addFormData.rate" placeholder="请输入服务费率" >
                            <template slot="append">‰</template>
                        </el-input>
                    </el-form-item>
                    <br>
                    <el-form-item prop="shelfStartTime" label="上架时间">
                        <el-date-picker
                        v-model="addFormData.shelfStartTime"
                        value-format="timestamp"
                        type="datetime"
                        placeholder="选择上架时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item prop="shelfEndTime" label="下架时间">
                        <el-date-picker
                        v-model="addFormData.shelfEndTime"
                        value-format="timestamp"
                        type="datetime"
                        placeholder="选择下架时间">
                        </el-date-picker>
                    </el-form-item>
                    <br>
                    <el-form-item prop="transportTemplateId" label="运费模板" >
                        <el-select filterable v-model="addFormData.transportTemplateId" placeholder="请选择运费模板">
                            <el-option
                                v-for="item in transportList"
                                :key="item.id"
                                :label="item.templateName"
                                :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <div class="banner">
                        商品规格
                    </div>
                    <div>
                        <el-row v-if="skuPropertyList.length > 0">
                            <el-col :span="2" class="paddinglr20" style="text-align: right">
                                <label>商品规格</label>
                            </el-col>
                            <el-col class="boxBorder padding10" :span="22">
                                <div :key="index" v-for="(item, index) in skuPropertyList">
                                    <div class="goodSkuBackGround paddingtb10">
                                        <label style="margin: 0 10px">规格名</label>
                                        <div class="relative inline">
                                            <i v-show="item.editDisabled ? false : true" @click="removeGoodSkuItem(index)" class="el-icon-error icon_position"></i>
                                            <el-select :disabled="item.editDisabled ? true : false" v-model="item.id" @change="goodSkuNameChangeEvent(index)" size="small" placeholder="请选择规格名">
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
                                            <i v-show="item2.editDisabled ? false : true" @click="removeGoodSkuValueItem(index, index2)" class="el-icon-error icon_position"></i>
                                            <el-select :disabled="item2.editDisabled ? true : false" size="small" v-model="item2.id" @change="goodSkuValueChangeEvent(index, index2)" placeholder="请选择规格值">
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
                                <!-- <div class="goodSkuBackGround padding10">
                                    <el-button @click="addGoodSkuItemEvent" type="primary" size="small" style="width: 90px;">添加规格项</el-button>
                                </div> -->
                            </el-col>
                            <div style="margin-left: 9%; float: left; padding: 20px 0">如有颜色、尺码等多种规格，请添加商品规格</div>
                        </el-row>
                        <el-row style="margin-bottom: 20px">
                            <el-col :span="2" class="paddinglr20" style="text-align: right">
                                <label class="myRequired">包装规格</label>
                            </el-col>
                            <el-col class="boxBorder padding10" :span="22">
                                <div class="goodSkuBackGround padding10 relative">
                                    <label class="myRequired" style="margin-right: 10px">类型名</label>
                                    <el-select :disabled="true" size="small" @change="goodPackNameChangeEvent" v-model="supplyProperty.id" placeholder="请选择类型名">
                                        <el-option
                                            v-for="item in typeNameList"
                                            :key="item.id"
                                            :label="item.unitMsg"
                                            :value="item.id"
                                            >
                                        </el-option>
                                    </el-select>
                                </div>
                                <div>
                                    <label class="myRequired" style="margin-left: 10px">类型值</label>
                                    <div v-for="(item, index) in supplyProperty.itemSupplyPropertyDTOS" :key="index" class="padding10 relative inline">
                                        <i v-show="!item.editDisabled" @click="removeGoodPackValueItem(index)" class="el-icon-error icon_position"></i>
                                        <el-select :disabled="item.editDisabled" size="small" v-model="item.id" @change="goodPackValueChangeEvent(index)" placeholder="请选择规格值">
                                            <el-option
                                                v-for="(item1, index1) in typeValueList"
                                                :key="index1"
                                                :disabled="item1.disabled"
                                                :label="item1.supplyMsg"
                                                :value="item1.id">
                                            </el-option>

                                        </el-select>
                                    </div>

                                    <div class="padding10 relative inline">
                                        <el-button @click="addGoodPackItemEvent()" type="text" size="small" style="width: 90px;">添加类型值</el-button>
                                    </div>
                                </div>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="2" class="paddinglr20" style="text-align: right">
                                <label>规格明细</label>
                            </el-col>
                            <el-col class="boxBorder padding10" :span="22">
                                <el-table
                                    border
                                    ref="editGoodTable"
                                    @selection-change="handleSelectionChange"
                                    :span-method="tableMergeMethod"
                                    :data="skuDetailInfo.itemPriceDetails"
                                    style="width: 100%">
                                        <el-table-column type="selection" width="35"></el-table-column>
                                        <el-table-column prop="skuPropertyValueName" label="规格"></el-table-column>
                                        <el-table-column prop="supplyMsg" label="包装类型"></el-table-column>
                                        <el-table-column prop="inventory" label="库存(包)">
                                            <template slot="header" slot-scope="slot">
                                                <label class="myRequired">库存(包/罐/装)</label>
                                            </template>
                                            <template slot-scope="scope" >
                                                <el-input @change.native="numInputEvent(scope.row, 'inventory')" @keyup.native="numInputEvent(scope.row, 'inventory')" v-model="scope.row.inventory" size="small" placeholder="库存数量"></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="singleSkuCostPrice" label="单品成本价(元)">
                                            <template slot-scope="scope" >
                                                <el-input @change.native="singleSkuCostPriceTableEvent(scope.row, 'singleSkuCostPrice', 1)" @keyup.native="singleSkuCostPriceTableEvent(scope.row, 'singleSkuCostPrice', 1)" v-model="scope.row.singleSkuCostPrice" size="small" placeholder="单品成本价"></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="barCode" label="商品条形码">
                                            <template slot-scope="scope" >
                                                <el-input @change.native="barCodeTableEvent(scope.row)" @keyup.native="barCodeTableEvent(scope.row)" v-model="scope.row.barCode" size="small" placeholder="商品条形码"></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="roughWeight" label="规格重量(kg)">
                                            <template slot="header" slot-scope="slot">
                                                <label class="myRequired">规格重量(kg)</label>
                                            </template>
                                            <template slot-scope="scope" >
                                                <el-input @change.native="numInputEvent2(scope.row, 'roughWeight')" @keyup.native="numInputEvent2(scope.row, 'roughWeight')" v-model="scope.row.roughWeight" size="small" placeholder="规格重量"></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="singleSkuPrice" label="单品售价(元)">
                                            <template slot="header" slot-scope="slot">
                                                <label class="myRequired">单品售价(元)</label>
                                            </template>
                                            <template slot-scope="scope" >
                                                <el-input @change.native="numInputEvent3(scope.row)" @keyup.native="numInputEvent3(scope.row)" v-model="scope.row.singleSkuPrice" size="small" placeholder="单品售价"></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="packageMaterialPrice" label="包材费(元)">
                                            <template slot-scope="scope" >
                                                <el-input @change.native="numInputEvent3(scope.row)" @keyup.native="numInputEvent3(scope.row)" v-model="scope.row.packageMaterialPrice" size="small" placeholder="包材费"></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="sellPrice" label="规格总价(元)">
                                            <template slot-scope="scope" >
                                                <el-input :disabled="true" v-model="scope.row.totalPrice" size="small" placeholder="规格总价"></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="sellPrice" label="商品费率(‰)">
                                            <template slot-scope="scope" >
                                                <el-input :disabled="true" v-model="addFormData.rate" size="small" placeholder="商品费率"></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="sellPrice" label="用户购买价(元)">
                                            <template slot-scope="scope" >
                                                <el-input :disabled="true" @change.native="numInputEvent2(scope.row, 'sellPrice')" @keyup.native="numInputEvent2(scope.row, 'sellPrice')" v-model="scope.row.sellPrice" size="small" placeholder="用户购买价"></el-input>
                                            </template>
                                        </el-table-column>
                                </el-table>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="banner" style="text-align: center; margin-top: 20px">
                        <span style="float: left">商品属性</span>
                        <span style="font-size: 12px; font-weight: 400">商品属性是对商品的补充说明，如材质、产地、储存方法等，最多添加50条</span>
                    </div>
                    <div>
                        <el-row style="margin-bottom: 20px" class="relative" v-for="(item, index) in addFormData.property" :key="index">
                            <el-col :offset="2" :span="4">
                                <el-input size="small" v-model="item.propertyName" placeholder="请输入属性名"></el-input>
                            </el-col>
                            <el-col style="margin-left: 20px" :span="10">
                                <el-input size="small" v-model="item.propertyValue" placeholder="请输入属性值"></el-input>
                            </el-col>
                            <i @click="removeGoodPropertyValueItem(index)" class="el-icon-error icon_position2"></i>
                        </el-row>
                        <el-button @click="addGoodPropertyEvent" type="text" size="small" style="width: 90px; margin-left: 25px; margin-left: 8%">添加属性</el-button>
                    </div>
                    <div class="banner" style="text-align: center; margin-top: 20px">
                        <span class="myRequired" style="float: left">商品图片</span>
                        <span style="font-size: 12px; font-weight: 400">主图大小不能超过1MB;尺寸：700*700px;最多5张</span>
                    </div>
                    <div>
                        <el-form-item label="" class="pic_up">
                            <div class="updata_box">
                                <el-upload
                                    :action="upDateImgUrl"
                                    :data='sendData'
                                    :file-list='fileListAdd'
                                    multiple
                                    list-type="picture-card"
                                    :on-preview="handlePictureCardPreview"
                                    :on-remove="handleRemove"
                                    :on-success='handleAvatarSuccess'
                                    :limit= 5>
                                    <i class="el-icon-plus"></i>
                                </el-upload>
                                <el-dialog :visible.sync="dialogVisible">
                                    <img width="100%" :src="dialogImageUrl" alt="">
                                </el-dialog>
                            </div>
                        </el-form-item>
                    </div>
                    <div class="banner" style="text-align: center; margin-top: 20px">
                        <span class="myRequired" style="float: left">商品详情</span>
                    </div>
                    <div>
                        <div style="padding:10px; width:80%;" class="wangdiv">
                            <div id='editorE' style="max-height:1000px"></div>
                        </div>
                    </div>
                    <div class="banner">
                        资质文件
                    </div>
                    <div>
                        <el-form-item label="海关报关/通关单">
                            <span slot="label">
                                海关报关<br>通关单 :
                            </span>
                            <div style="display: inline-block">
                                <el-upload
                                :action="upDateImgUrl"
                                :data="sendData"
                                :show-file-list="false"
                                list-type="picture-card"
                                :on-success="handleAvatarSuccess1"
                                >
                                <img style="width: 100%; height: 100%;" v-if="imageUrl1" :src="imageUrl1" class="avatar">
                                <i v-if="!imageUrl1" class="el-icon-plus"></i>
                                </el-upload>
                            </div>
                        </el-form-item>
                        <el-form-item label="海关送检单 : ">
                            <div style="display: inline-block">
                                <el-upload
                                :action="upDateImgUrl"
                                :data="sendData"
                                :show-file-list="false"
                                list-type="picture-card"
                                :on-success="handleAvatarSuccess2"
                                >
                                <img style="width: 100%; height: 100%;" v-if="imageUrl2" :src="imageUrl2" class="avatar">
                                <i v-if="!imageUrl2" class="el-icon-plus"></i>
                                </el-upload>
                            </div>
                        </el-form-item>
                        <el-form-item label="检验检疫证书 : ">
                            <div style="display: inline-block">
                                <el-upload
                                :action="upDateImgUrl"
                                :data="sendData"
                                :show-file-list="false"
                                list-type="picture-card"
                                :on-success="handleAvatarSuccess3"
                                >
                                <img style="width: 100%; height: 100%;" v-if="imageUrl3" :src="imageUrl3" class="avatar">
                                <i v-if="!imageUrl3" class="el-icon-plus"></i>
                                </el-upload>
                            </div>
                        </el-form-item>
                        <el-form-item label="3C认证 : ">
                            <div style="display: inline-block">
                                <el-upload
                                :action="upDateImgUrl"
                                :data="sendData"
                                :show-file-list="false"
                                list-type="picture-card"
                                :on-success="handleAvatarSuccess4"
                                >
                                <img style="width: 100%; height: 100%;" v-if="imageUrl4" :src="imageUrl4" class="avatar">
                                <i v-if="!imageUrl4" class="el-icon-plus"></i>
                                </el-upload>
                            </div>
                        </el-form-item>
                        <el-form-item label="厂检报告 : ">
                            <div style="display: inline-block">
                                <el-upload
                                :action="upDateImgUrl"
                                :data="sendData"
                                :show-file-list="false"
                                list-type="picture-card"
                                :on-success="handleAvatarSuccess5"
                                >
                                <img style="width: 100%; height: 100%;" v-if="imageUrl5" :src="imageUrl5" class="avatar">
                                <i v-if="!imageUrl5" class="el-icon-plus"></i>
                                </el-upload>
                            </div>
                        </el-form-item>
                    </div>
                    <div class="banner">
                        其他设置
                    </div>
                    <div>
                        <el-form-item label="减库存设置">
                            <el-radio-group v-model="addFormData.stockWay">
                                <el-radio label = '0'>下单减库存</el-radio>
                                <el-radio label = '1'>支付减库存</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <br>
                        <el-form-item label="提成设置">
                            <el-select
                                @change="choosePromote" v-model="addFormData.promoteGroupId" placeholder="选择类型" size='small'>
                                <el-option
                                    v-for="item in deductoptions"
                                    :key="item.promoteGroupId"
                                    :label="item.promoteGroupName"
                                    :value="item.promoteGroupId">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </el-form>

            </div>
        </div>
        <div class="model_footer">
            <el-button type="primary" @click="addGoodSaveEvent" size="small" style="width: 90px; margin-left: 25px;">保 存</el-button>
            <el-button size="small" @click="addGoodCansoleEvent" style="width: 90px; margin-left: 25px;">取 消</el-button>
        </div>
    </div>
</template>

<script>
import Editor from 'wangeditor'
import axios from 'axios'
import api from 'api/goods'
export default {
    data(){
        return {
            imageUrl1: '',
            imageUrl2: '',
            imageUrl3: '',
            imageUrl4: '',
            imageUrl5: '',
            editor: null,
            dialogVisible: false,
            dialogImageUrl: '',
            fileListAdd: [],
            oldSkuDetailInfo: {}, //缓存旧的规格明细
            goodInfo: {},
            upDateImgUrl: process.env.API_ROOT + '/f/upload',
            sendData: {file: '', uploadType: 'erp'},
            expirationDateIndex: null,
            skuDetailInfo: {
                itemPriceDetails: [],
                skuList: []
            },
            skuTotalList: [],
            selectTableData: [], //够选的规格明细数据
            categoryIdArr: [],
            categoryListArr: [],
            itemTemplateList: [],
            deductoptions: [], //提成设置list
            skuNameList: [],  //sku规格名列表
            totalSkuNameList: [], //缓存sku规格名列表, 有无保质期切换
            typeNameList: [], //包装类型所有集合
            typeValueList: [], //包装类型值集合
            transportList: [], //运费模板列表
            unitList: [],
            brandList: [],
            itemTemInfo: {},
            skuPropertyList: [],
            supplyProperty: {
                id: '',
                itemSupplyPropertyDTOS: [
                    {id: '', supplyMsg: '', skuNumber: 0}
                ]
            },
            categoryProps: {
                label:'categoryName',
                value:'id',
                children: 'itemCategoryVOList'
            },
            rules: {
                title: [
                    { required: true, message: '请输入商品名称', trigger: 'blur' }
                ],
                itemTemplateId: [
                    { required: true, message: '请选择商品模板', trigger: 'change' }
                ],
                transportTemplateId: [
                    { required: true, message: '请选择运费模板', trigger: 'change' }
                ],
                unitId: [
                    { required: true, message: '请选择库存最小单位', trigger: 'change' }
                ],
                brandId: [
                    { required: true, message: '请选择商品品牌', trigger: 'change' }
                ],
                categoryId: [
                    { required: true, message: '请选择商品分类', trigger: 'change' }
                ],
                shelfStartTime: [
                    { required: true, message: '请选择上架时间', trigger: 'change' }
                ],
                shelfEndTime: [
                    { required: true, message: '请选择下架时间', trigger: 'change' }
                ],
                sendWay: [
                    { required: true, message: '请选择贸易类型', trigger: 'change' }
                ],
                rate: [
                    { required: true, message: '请输入商品费率( >= 0)', trigger: 'blur' },
                    {pattern: /^(\d|[1-9]\d+)(\.\d+)?$/, message:'请输入正确的商品费率'}
                ]
            },
            addFormData: {
                shelfStartTime: '',
                shelfEndTime: '',
                promoteGroupId: '',
                promoteGroupName: '',
                stockWay: '0',
                description: '',
                ItemAptitudeImgs: {customsDeclarationUrl: '', customsFormUrl: '', pratiqueUrl: '', approveUrl: '', factoryInspectionUrl: ''},
                property: [
                    { propertyName: '', propertyValue: '' }
                ],
                rate: '',
                unitId: '',
                transportTemplateId: '',
                suggestedPrice: '',
                sendWay: '',
                categoryIdArr: [],
                categoryId: '',
                itemTemplateId: '',
                brandId: '',
                sellingPoint: '',
                buyRemind: '',
                itemCode: '',
                expirationDateStatus: 0,
                expirationDate: '',
                title: ''
            }
        }
    },
    computed:{},
    methods:{
        handleSelectionChange(val){
            this.selectTableData = val
        },
        handleAvatarSuccess1(res, file){
            this.addFormData.ItemAptitudeImgs.customsDeclarationUrl = res.data.url
            this.imageUrl1 = URL.createObjectURL(file.raw);
        },
        handleAvatarSuccess2(res, file){
            this.addFormData.ItemAptitudeImgs.customsFormUrl = res.data.url
            this.imageUrl2 = URL.createObjectURL(file.raw);
        },
        handleAvatarSuccess3(res, file){
            this.addFormData.ItemAptitudeImgs.pratiqueUrl = res.data.url
            this.imageUrl3 = URL.createObjectURL(file.raw);
        },
        handleAvatarSuccess4(res, file){
            this.addFormData.ItemAptitudeImgs.approveUrl = res.data.url
            this.imageUrl4 = URL.createObjectURL(file.raw);
        },
        handleAvatarSuccess5(res, file){
            this.addFormData.ItemAptitudeImgs.factoryInspectionUrl = res.data.url
            this.imageUrl5 = URL.createObjectURL(file.raw);
        },
        handleAvatarSuccess(file, fileList) { // 商品成功回调
            this.fileListAdd.push(fileList.response.data)
            if (this.fileListAdd.length == 5){
                $('.goodImgWrap .el-upload--picture-card').css('display', 'none')
            }

        },
        handleRemove(file, fileList) {  // 移除
            this.fileListAdd = JSON.parse(JSON.stringify(fileList))
            if (this.fileListAdd.length < 5){
                $('.goodImgWrap .el-upload--picture-card').css('display', 'inline-block')
            }
        },
        handlePictureCardPreview(file) { // 变大查看
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        goodTemplateChangeEvent(){
            this.getGoodTemDetail()
        },
        goodModelCateChangeEvent(){
            this.addFormData.itemTemplateId = ''
            this.$refs['addGoodForm'].clearValidate()
            this.getGoodTemList()
        },
        categoryChangeEvent(){
            this.addFormData.categoryId = this.addFormData.categoryIdArr[this.addFormData.categoryIdArr.length - 1]
        },
        getGoodTemDetail(type){ //type 存在时,表明修改时详情用后台返回的数据,不是用模板数据
            api.getGoodTemDetail(this.addFormData.itemTemplateId).then((response) => {
                this.itemTemInfo = response.data
                this.addFormData.categoryIdArr = []
                var cateText = ''
                var resItemArr = []
                var resArr = Object.values(this.itemTemInfo.itemCategoryVOMap)

                for (let item of resArr){
                    resItemArr.push(item.categoryName)
                    this.addFormData.categoryIdArr.push(item.id)
                }

                this.addFormData.categoryId = this.addFormData.categoryIdArr[this.addFormData.categoryIdArr.length - 1]
                this.addFormData.rate = this.itemTemInfo.rate
                this.addFormData.brandId = this.itemTemInfo.brandId
                this.addFormData.title = this.itemTemInfo.title

                if (!type) {
                    this.addFormData.description = this.itemTemInfo.description
                    this.editor.txt.html(this.itemTemInfo.description)
                }

                cateText = resItemArr.join(' < ')
                this.$set(this.itemTemInfo, 'cateText', cateText)
                this.getTransportList(this.addFormData.brandId)

            })
        },
        getTransportList(id){
            api.getTransportList({brandId: id}).then((response) => {
                this.transportList = response.data.list
            })
        },
        formNuminput(flied){
            this.addFormData[flied] = this.myBase.formatNum(this.addFormData[flied])
        },
        singleSkuCostPriceTableEvent(target, filed){
            target[filed] = this.myBase.formatNum(target[filed])
            this.skuDetailInfo.skuList[target.$index][filed] = target[filed] //传回后端的数据结构
            this.skuDetailInfo.itemPriceDetails.forEach(item => { //成品单价同步到其他条数据
                if (item.$index == target.$index) {
                    item[filed] = target[filed]
                }
            })

        },
        barCodeTableEvent(target){ //条形码
            this.skuDetailInfo.skuList[target.$index].barCode = target.barCode //传回后端的数据结构
            this.skuDetailInfo.itemPriceDetails.forEach(item => { //条形码同步到其他条数据
                if (item.$index == target.$index) {
                    item.barCode = target.barCode
                }
            })
        },
        numInputEvent(target, filed){ //只限整数 库存
            target[filed] = this.myBase.formatIntNum(target[filed])
            this.skuDetailInfo.skuList[target.$index][filed] = target[filed] //传回后端的数据结构

            this.skuDetailInfo.itemPriceDetails.forEach(item => { //库存同步到其他条数据
                if (item.$index == target.$index) {
                    item[filed] = target[filed]
                }
            })
        },
        numInputEvent2(target, filed, type){ //小数
            target[filed] = this.myBase.formatNum(target[filed])
        },
        numInputEvent3(target){
            target.singleSkuPrice = this.myBase.formatNum(target.singleSkuPrice)
            target.packageMaterialPrice = this.myBase.formatNum(target.packageMaterialPrice)

            target.totalPrice = this.math.format(this.math.eval(`${target.singleSkuPrice} * ${target.skuNumber} + ${target.packageMaterialPrice}`), {precision: 14})

            target.sellPrice = this.math.format(this.math.eval(`${target.totalPrice} + ${target.totalPrice} * ${this.addFormData.rate} / 1000`), {precision: 14})

        },
        tableMergeMethod({ row, column, rowIndex, columnIndex }){
            if (columnIndex === 1 || columnIndex === 3 || columnIndex === 4 || columnIndex === 5) {
                if (rowIndex % this.supplyProperty.itemSupplyPropertyDTOS.length === 0) {
                    return [this.supplyProperty.itemSupplyPropertyDTOS.length, 1]
                } else {
                    return [0, 0]
                }
            } else {
                return [1, 1]
            }
        },
        setSkuDetailsTableData(){
            //去除规格组合,数组空值bug待修改
            let skuArr1 = []
            let skuArr2 = []
            let skuArr3 = []

            this.skuDetailInfo = {itemPriceDetails: [], skuList: []}

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

            //合并包装类型组合
            if (this.skuDetailInfo.skuList.length > 0) {
                this.skuDetailInfo.skuList.forEach((sku, index) => {
                    if (this.supplyProperty.itemSupplyPropertyDTOS.length > 0) {
                        for (let pack of this.supplyProperty.itemSupplyPropertyDTOS) { //遍历包装规格值
                            if (pack.id != '') { //不为空
                                let obj = JSON.parse(JSON.stringify(sku))

                                obj.$index = index //规格明细表格绑定值索引
                                obj.itemSupplyPropertyId = pack.id
                                obj.supplyMsg = pack.supplyMsg
                                obj.skuNumber = pack.skuNumber
                                obj.roughWeight = ''
                                obj.totalPrice = ''
                                obj.singleSkuCostPrice = ''
                                obj.singleSkuPrice = ''
                                obj.sellPrice = ''
                                obj.packageMaterialPrice = ''
                                obj.ItemPriceAddDTO = []

                                this.skuDetailInfo.itemPriceDetails.push(obj)
                            }
                        }
                    }
                })
            } else {
                for (let pack of this.supplyProperty.itemSupplyPropertyDTOS) { //遍历包装规格值
                    if (pack.id != '') { //不为空
                        let obj = {}

                        obj.$index = 0 //规格明细表格绑定值索引
                        this.skuDetailInfo.skuList[0] = {}
                        obj.itemSupplyPropertyId = pack.id
                        obj.supplyMsg = pack.supplyMsg
                        obj.skuNumber = pack.skuNumber
                        obj.roughWeight = ''
                        obj.totalPrice = ''
                        obj.singleSkuCostPrice = ''
                        obj.singleSkuPrice = ''
                        obj.sellPrice = ''
                        obj.packageMaterialPrice = ''
                        obj.ItemPriceAddDTO = []

                        this.skuDetailInfo.itemPriceDetails.push(obj)
                    }
                }
            }

            this.setOldSkuDetailsTableData()
        },
        setOldSkuDetailsTableData(){
            let indexArr = []

            this.skuDetailInfo.itemPriceDetails.forEach((item, index) => {
                if (this.oldSkuDetailInfo.itemPriceDetails) {
                    this.oldSkuDetailInfo.itemPriceDetails.forEach((item1, index1) => {
                        if (item.skuGroup && item.skuGroup.length > 0) {
                            if (String(item.skuGroup) == String(item1.skuGroup) && item.itemSupplyPropertyId == item1.itemSupplyPropertyId) {
                                let oindex = item.$index

                                Object.assign(item, item1)

                                item.$index = oindex

                                indexArr.push(index)
                            }
                        } else {
                            if (item.itemSupplyPropertyId == item1.itemSupplyPropertyId) {
                                let oindex = item.$index

                                Object.assign(item, item1)
                                item.$index = oindex
                                indexArr.push(index)
                            }
                        }
                    })
                }
            })
            setTimeout(() => { //必须延迟,否则勾选不上
                for (let int of indexArr){
                    this.$refs.editGoodTable.toggleRowSelection(this.skuDetailInfo.itemPriceDetails[int], true);
                }
            }, 0)
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
        checkboxChangeEvent(){
            if (this.addFormData.expirationDateStatus) {
                this.rules.expirationDate = [
                    { required: true, message: '请输入保质期限' }
                ]
                if (this.skuPropertyList.length >= 3) {
                    this.$message({
                        type: 'warning',
                        duration: 1500,
                        showClose: true,
                        message: '规格已满！请先删除一项规格！'
                    })
                    this.addFormData.expirationDateStatus = false
                    return
                } else {
                    this.setExpirationSkuNameList()

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
                    this.expirationDateIndex = this.skuPropertyList.length //记录index值,便于删除
                }
            } else {
                this.skuPropertyList.splice(this.expirationDateIndex - 1, 1)
                this.rules.expirationDate = []
            }
        },
        setExpirationSkuNameList(){
            var resArr = []

            this.skuNameList.forEach((item) => {
                if (item.skuPropertyName == '生产日期' || item.skuPropertyName == '效期') {
                    let obj = JSON.parse(JSON.stringify(item))

                    obj.disabled = false
                    resArr.push(obj)
                }
            })

            this.skuNameList = resArr
        },
        removeGoodPropertyValueItem(index){
            this.addFormData.property.splice(index, 1)
        },
        removeGoodSkuItem(index){  //移除规格项
            this.skuPropertyList.splice(index, 1)
            this.setGoodSkuNameDisabled()
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
        removeGoodPackValueItem(index){ //移除包装类型值
            if (this.supplyProperty.itemSupplyPropertyDTOS.length <= 1) {
                this.$message({
                    type: 'warning',
                    duration: 1500,
                    showClose: true,
                    message: '至少添加一个类型值!'
                });
                return
            }
            this.supplyProperty.itemSupplyPropertyDTOS.splice(index, 1)
            this.setPackValueDisabled()
            this.setSkuDetailsTableData() //设置规格明细
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
        goodPackNameChangeEvent(){
            this.supplyProperty.itemSupplyPropertyDTOS = [{ //类型值初始化
                id: '',
                skuNumber: 0,
                supplyMsg: ""
            }]
            api.getGoodPackList({unitId: this.supplyProperty.id}).then((response)=>{
                this.typeValueList = response.data.list[0].itemSupplyPropertyVOs
                this.typeValueList.forEach((item, index) => {
                    this.$set(item, 'disabled', false)
                })
            })
            this.setSkuDetailsTableData() //设置规格明细
        },
        goodPackValueChangeEvent(index){ //包装类型值change事件
            let packId = this.supplyProperty.itemSupplyPropertyDTOS[index].id

            this.typeValueList.forEach((item) => {
                if (item.id == packId) {
                    this.supplyProperty.itemSupplyPropertyDTOS[index].supplyMsg = item.supplyMsg
                    this.supplyProperty.itemSupplyPropertyDTOS[index].skuNumber = item.skuNumber
                }
            })
            this.setPackValueDisabled()
            this.setSkuDetailsTableData() //设置规格明细
        },
        setPackValueDisabled(){ //设置包装类型值禁用项
            for (let item2 of this.typeValueList){
                item2.disabled = false
                for (let item of this.supplyProperty.itemSupplyPropertyDTOS) {
                    if (item.id == item2.id) {
                        item2.disabled = true
                    }
                }
            }
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

            if (this.skuNameList.length > 2) {
                this.totalSkuNameList = this.skuNameList //非有效期的存入缓存
            }
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
        addGoodPropertyEvent(){
            let obj = { propertyName: '', propertyValue: '' }

            this.addFormData.property.push(obj)
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
            this.skuNameList = this.totalSkuNameList //每次新增从缓存里面拿
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
        addGoodPackItemEvent(){ //添加包装类型值
            let initobj = {
                id: '',
                skuPropertyValueName: ''
            }

            this.supplyProperty.itemSupplyPropertyDTOS.push(initobj)
        },
        getTypeNameList() { // 获取包装类型列表

            api.getGoodPackList().then((response)=>{
                this.typeNameList = response.data.list
            })
        },
        getSkuNameList() { // 获取规格列表
            let obj = { post:'post' }

            api.getitemskuPropertylist(obj).then((res) => {
                this.skuNameList = res.data.list
                this.skuNameList.forEach((item, index) => {
                    this.$set(item, 'disabled', false)
                })
                this.totalSkuNameList = this.skuNameList
            })
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
        getUnitList() { // 获取单位选项
            api.getitemunitlist().then((response)=>{
                this.unitList = response.data.list
            })
        },
        getGoodTemList(){ //获取商品模板
            var param = {categoryId: this.categoryIdArr[this.categoryIdArr.length - 1]}

            api.getGoodTemList(param).then((response) => {
                this.itemTemplateList = response.data.list
            })
        },
        getCategoryList() { // 获取商品分类选项
            api.getcategorylist().then((response)=>{
                this.categoryListArr = response.data

                this.getGoodInfo()
            })
        },
        getPromotesList() { // 获取提成设置
            api.getitempromotes().then(res => {
                this.deductoptions = res.data.list
            })
        },
        choosePromote() { // 选择提成设置
            this.deductoptions.forEach((res) => {
                if (res.promoteGroupId == this.addFormData.promoteGroupId) {
                    this.addFormData.promoteGroupName = res.promoteGroupName
                }
            })
        },
        getbrandList() { // 获取商品品牌选项
            let obj = { pageNo: 1, pageSize: 999999 }

            api.getitemBrandlist(obj).then((response)=>{
                this.brandList = response.data.list
            })
        },
        addGoodCansoleEvent(){
            this.$router.push({
                path: '/goodsList'
            })
        },
        addGoodSaveEvent(){
            this.$refs['addGoodForm'].validate((valid) => {
                if (valid) {
                    if (this.supplyProperty.id == "" || this.supplyProperty.itemSupplyPropertyDTOS[0].id == '') {
                        this.$message({
                            type: 'warning',
                            duration: 1500,
                            showClose: true,
                            message: '请选择包装规格!'
                        })
                        return
                    }
                    if (this.selectTableData.length <= 0) {
                        this.$message({
                            type: 'warning',
                            duration: 1500,
                            showClose: true,
                            message: '请勾选规格明细数据!'
                        })
                        return
                    }

                    let flg1 = false //库存
                    let flg2 = false //单品售价
                    let flg3 = false //规格重量

                    for (let item of this.selectTableData) {

                        if (!item.inventory || item.inventory == '0') {
                            flg1 = true
                        }
                        if (!item.singleSkuPrice || item.singleSkuPrice == '0') {
                            flg2 = true
                        }
                        if (!item.roughWeight) {
                            flg3 = true
                        }
                    }

                    if (flg1) {
                        this.$message({
                            type: 'warning',
                            duration: 1500,
                            showClose: true,
                            message: '请填写规格明细库存且不能为零!'
                        })
                        return
                    }
                    if (flg2) {
                        this.$message({
                            type: 'warning',
                            duration: 1500,
                            showClose: true,
                            message: '请填写规格明细单品售价且不能为零!'
                        })
                        return
                    }
                    if (flg3) {
                        this.$message({
                            type: 'warning',
                            duration: 1500,
                            showClose: true,
                            message: '请填写规格明细规格重量!'
                        })
                        return
                    }


                    if (this.fileListAdd.length <= 0) {
                        this.$message({
                            type: 'warning',
                            duration: 1500,
                            showClose: true,
                            message: '请上传商品图片!'
                        })
                        return
                    }
                    let imgArr = []

                    for (var s = 0 ; s < this.fileListAdd.length ; s ++){ //转化商品图片数据
                        let obj = {
                            imgUrl:this.fileListAdd[s].url
                        }

                        imgArr.push(obj)
                    }
                    if (this.addFormData.description == "" || this.addFormData.description == '<p><br></p>') {
                        this.$message({
                            type: 'warning',
                            duration: 1500,
                            showClose: true,
                            message: '请填写商品详情!'
                        })
                        return
                    }

                    let paramobj = JSON.parse(JSON.stringify(this.addFormData))

                    let skuPropertyList = JSON.parse(JSON.stringify(this.skuPropertyList))

                    skuPropertyList.forEach((item, index) => {
                        delete item.skuValueList
                        delete item.skuValueArr
                    })

                    delete paramobj.categoryIdArr

                    paramobj.ItemAptitudeImgs = JSON.stringify(this.addFormData.ItemAptitudeImgs) //商品资质文件
                    paramobj.skuProperty = JSON.stringify(skuPropertyList) //skuList
                    paramobj.supplyProperty = JSON.stringify([this.supplyProperty]) //商品包装类型,后台数据结构, 数组
                    paramobj.skuList = JSON.stringify(this.skuDetailInfo.skuList) //后台需要sku数据结构
                    paramobj.itemPriceDetails = JSON.stringify(this.selectTableData) //后台需要sku数据结构, 规格明细
                    paramobj.itemImgs = JSON.stringify(imgArr) //商品图片
                    paramobj.property = JSON.stringify(this.addFormData.property)
                    paramobj.shelfEndTime = Math.round(paramobj.shelfEndTime / 1000)
                    paramobj.shelfStartTime = Math.round(paramobj.shelfStartTime / 1000)


                    api.putitemupdate(paramobj).then((res) => {
                        this.$message({
                            type: 'success',
                            duration: 1500,
                            showClose: true,
                            message: '修改商品成功!'
                        })
                        this.$router.push({
                            path: '/goodsList'
                        })
                    })
                }
            })
        },
        getGoodInfo(){
            var id = this.$store.state.home.currentModelId

            api.getGoodDetail(id).then((response) => {
                this.goodInfo = response.data

                var cateArr = []

                for (let item1 of this.categoryListArr) {
                    if (item1.itemCategoryVOList) {
                        for (let item2 of item1.itemCategoryVOList) {
                            if (item2.id == this.goodInfo.categoryId) {
                                cateArr.push(item1.id)
                                cateArr.push(item2.id)
                            }
                        }
                    }
                }
                this.categoryIdArr = cateArr

                this.getGoodTemList()
                this.addFormData.itemTemplateId = this.goodInfo.itemTemplateId
                this.getGoodTemDetail(true)

                this.addFormData.title = this.goodInfo.title

                this.addFormData.description = this.goodInfo.description
                this.editor.txt.html(this.addFormData.description)

                this.addFormData.sellingPoint = this.goodInfo.sellingPoint
                this.addFormData.buyRemind = this.goodInfo.buyRemind
                this.addFormData.expirationDateStatus = this.goodInfo.expirationDateStatus
                this.addFormData.expirationDate = this.goodInfo.expirationDate
                this.addFormData.sendWay = String(this.goodInfo.sendWay)
                this.addFormData.suggestedPrice = this.goodInfo.suggestedPrice
                this.addFormData.itemCode = this.goodInfo.itemCode
                this.addFormData.unitId = this.goodInfo.unitId
                this.addFormData.shelfStartTime = this.goodInfo.shelfStartTime * 1000
                this.addFormData.shelfEndTime = this.goodInfo.shelfEndTime * 1000
                this.addFormData.id = this.$store.state.home.currentModelId

                this.editSetSupplyList()
                this.editSetSkuList()
                this.editSetSkuDetailTable()

                this.skuDetailInfo.skuList = this.goodInfo.itemSkuVOList //skulist

                this.addFormData.property = JSON.parse(this.goodInfo.property)
                this.addFormData.mainImg = this.goodInfo.mainImg

                this.editSetGoodImgList()
                this.editSetAptitudeImgs()

                this.addFormData.stockWay = String(this.goodInfo.stockWay)
                this.addFormData.promoteGroupId = this.goodInfo.promoteGroupId
                this.addFormData.transportTemplateId = this.goodInfo.transportTemplateId

                this.oldSkuDetailInfo = this.skuDetailInfo  //保存旧的规格明细

            })
        },
        editSetSkuDetailTable(){
            this.setSkuDetailsTableData() //设置规格明细
            let indexArr = []

            this.skuDetailInfo.itemPriceDetails.forEach((item, index) => {
                this.goodInfo.itemPriceDetailVOList.forEach((item1) => {

                    if (typeof item.skuGroup == "undefined") { //有没有规格值
                        if (item.itemSupplyPropertyId == item1.itemSupplyPropertyId) {
                            for (let kk in item1) {
                                item[kk] = item1[kk]
                            }
                            indexArr.push(index)
                        }
                    } else {
                        if (item.skuGroup.join("") == item1.skuGroup.join("")) {
                            item.inventory = item1.inventory
                            item.singleSkuCostPrice = item1.singleSkuCostPrice
                            item.barCode = item1.barCode
                            if (item.itemSupplyPropertyId == item1.itemSupplyPropertyId) {
                                for (let kk in item1) {
                                    item[kk] = item1[kk]
                                }
                                indexArr.push(index)
                            }

                        }
                    }
                })
            })

            setTimeout(() => { //必须延迟,否则勾选不上
                for (let int of indexArr){
                    this.$refs.editGoodTable.toggleRowSelection(this.skuDetailInfo.itemPriceDetails[int], true);
                }
            }, 1000)
        },
        editSetAptitudeImgs(){
            if (this.goodInfo.itemAptitudeImgVO) {
                this.addFormData.ItemAptitudeImgs = this.goodInfo.itemAptitudeImgVO
                this.imageUrl1 = this.goodInfo.itemAptitudeImgVO.customsDeclarationUrl
                this.imageUrl2 = this.goodInfo.itemAptitudeImgVO.customsFormUrl
                this.imageUrl3 = this.goodInfo.itemAptitudeImgVO.pratiqueUrl
                this.imageUrl4 = this.goodInfo.itemAptitudeImgVO.approveUrl
                this.imageUrl5 = this.goodInfo.itemAptitudeImgVO.factoryInspectionUrl
            } else {
                this.addFormData.ItemAptitudeImgs = {}
            }

        },
        editSetGoodImgList(){
            this.fileListAdd = []
            if (this.goodInfo.itemImgVOList && this.goodInfo.itemImgVOList.length > 0) {
                this.goodInfo.itemImgVOList.forEach((item) => {
                    let obj = {
                        status:'',
                        uid:'',
                        url: item.imgUrl
                    }

                    this.fileListAdd.push(obj)
                })
            }
        },
        editSetSupplyList(){
            this.supplyProperty = {
                id: this.goodInfo.itemSupplyPropertyVOList[0].unitId,
                itemSupplyPropertyDTOS: JSON.parse(JSON.stringify(this.goodInfo.itemSupplyPropertyVOList))
            }

            for (let packitem of this.typeNameList) {
                if (packitem.id == this.supplyProperty.id) {
                    this.typeValueList = packitem.itemSupplyPropertyVOs
                    break;
                }
            }

            this.typeValueList.forEach((item, index) => {
                if (this.supplyProperty.itemSupplyPropertyDTOS && this.supplyProperty.itemSupplyPropertyDTOS.length > 0) {
                    this.supplyProperty.itemSupplyPropertyDTOS.forEach((item2) => {
                        if (item.id == item2.id) {
                            this.$set(item, 'disabled', true)
                        } else {
                            this.$set(item, 'disabled', false)
                        }

                        this.$set(item2, 'editDisabled', true)
                    })
                } else {
                    this.$set(item, 'disabled', false)
                }
            })

        },
        editSetSkuList(){
            let skuNameList = JSON.parse(JSON.stringify(this.goodInfo.itemSkuPropertyVOList))
            let skuValueList = JSON.parse(JSON.stringify(this.goodInfo.itemSkuVOList))
            let resSkuList = []

            skuNameList.forEach((item1, index1) => {
                let initobj = { //传给后台的数据结构
                    id: item1.id,
                    editDisabled: true,
                    skuPropertyName: item1.skuPropertyName,
                    skuValueList: [],
                    skuValueArr: [], //存id
                    itemSkuPropertyValueDTOS: []
                }

                for (let skuitem of this.skuTotalList) {
                    if (skuitem.id == item1.id) {
                        initobj.skuValueList = skuitem.itemSkuPropertyValueVOList
                        break;
                    }
                }

                skuValueList.forEach((item2, index2) => {
                    let props = JSON.parse(JSON.stringify(item2.skuProperties)).replace(/{/g, '').replace(/}/g, '').replace(/\[/g, '').replace(/\]/g, '').split(',')

                    props.forEach((item3, index3) => {
                        if (item3.split(':')[0] == item1.id){
                            let str = parseInt(item3.split(':')[1], 10)

                            if (initobj.skuValueArr.indexOf(str) < 0) {
                                initobj.skuValueArr.push(str)
                            }
                        }
                    })
                })

                initobj.skuValueList.forEach((item4) => {
                    initobj.skuValueArr.forEach((item5) => {
                        if (item5 == item4.id) {
                            let obj = {
                                id: item5,
                                editDisabled: true,
                                skuPropertyValueName: item4.skuPropertyValueName
                            }

                            initobj.itemSkuPropertyValueDTOS.push(obj)
                            this.$set(item4, 'disabled', true)
                        }
                    })

                })

                resSkuList.push(initobj)
            })

            this.skuPropertyList = resSkuList

            this.setGoodSkuNameDisabled()

        },
        getSkuTotalList(){
            let param = {
                pageNo: 1,
                pageSize: 99999999
            }

            api.getItemTotalSkuList(param).then((response) => {
                this.skuTotalList = response.data.list
            })
        }

    },
    created(){},
    activated(){
        this.getSkuNameList()
        this.getSkuTotalList()
        this.getCategoryList()
        this.getbrandList()
        this.getUnitList()
        this.getTypeNameList()
        this.getPromotesList()
    },
    mounted(){
        this.editor = new Editor('#editorE')
        this.editor.customConfig.customUploadImg = function(files, insert) {
            let formData = new FormData()

            formData.append('uploadType', 'erp')

            for (var i = 0 ; i < files.length ; i++){
                formData.append('file', files[i])
            }

            axios.post(process.env.API_ROOT + '/f/batchupload', formData).then(res => {
                if (res.data.data.url.length){
                    for (let j = 0 ; j < res.data.data.url.length ; j++){
                        insert(res.data.data.url[j])
                    }
                }
            }).catch((error) => {
                this.$message({
                    type: 'warning',
                    duration: 1500,
                    showClose: true,
                    message: '上传失败!'
                })
            })

        }
        this.editor.customConfig.onchange = (html) => {
            this.addFormData.description = html
        }
        this.editor.create()
        $('.w-e-text-container').height(600)
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
