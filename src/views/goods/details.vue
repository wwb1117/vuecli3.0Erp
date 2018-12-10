<template>
    <section>
        <header class="details_header">
            <div>
                <el-breadcrumb separator='-' style="line-height:45px;font-size:15px">
                    <el-breadcrumb-item :to="{ path: '/goodsList' }">商品列表</el-breadcrumb-item>
                    <el-breadcrumb-item>商品详情</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </header>
        <section class="details_conent">
            <div class="details_box goodDetailWrap" :style="{height: $store.state.home.modelContentHeight-23 + 'px'}">
                <div class="details_text">
                    <!-- 轮播图 -->
                    <div id="box">
                        <div class="topbox">
                            <ul class="bigbox">
                                <li v-for='(item, index) in imglist' :key='index'><img :src="item.imgUrl" alt="" /></li>
                            </ul>
                        </div>

                        <div class="bottomshow">
                            <i class="el-icon-arrow-left" @click="prev()" style="font-size:50px;color:blue;cursor: pointer"></i>
                            <div style="width:378px;overflow:hidden">
                                <div class="bottombox">
                                    <ul class="smallbox">
                                        <li v-for='(item, index) in imglist' :key='index' @click='imgLi(index)'><img :src="item.imgUrl" alt="" /></li>
                                    </ul>
                                </div>
                            </div>
                            <i class="el-icon-arrow-right" @click="next()" style="font-size:50px;color:blue;cursor: pointer"></i>
                        </div>

                    </div>
                    <!-- 右侧详细内容 -->
                    <ul class="recommend">
                        <li class="list_title"><h2>{{ goodconent.title }}</h2></li>
                        <li class="list_dl">
                            <el-form :inline="true" class="myForm" :model="goodconent" label-position="right" size="small" label-width="120px">
                                <el-form-item label="商品ID : " prop='id'>
                                    <span v-text="goodconent.id"></span>
                                </el-form-item>
                                <el-form-item label="库存最小单位 : " prop='unitMsg'>
                                    <span v-text="goodconent.unitMsg"></span>
                                </el-form-item>
                                <br>
                                <el-form-item label="商品编号 : " prop='itemCode'>
                                    <span v-text="goodconent.itemCode"></span>
                                </el-form-item>
                                <el-form-item label="保质期 : " prop='expirationDate'>
                                    <span v-text="goodconent.expirationDate"></span>
                                    <span>月</span>
                                </el-form-item>
                                <br>
                                <el-form-item label="建议零售价 : " prop='suggestedPrice'>
                                    <span v-text="goodconent.suggestedPrice"></span>
                                </el-form-item>
                                <el-form-item label="上架时间 : " prop='shelfStartTime'>
                                    <span>{{goodconent.shelfStartTime | time_m}}</span>
                                </el-form-item>
                                <br>
                                <el-form-item label="商品分类 : " prop='categoryName'>
                                    <span v-text="goodconent.categoryName"></span>
                                </el-form-item>
                                <el-form-item label="下架时间 : " prop='shelfEndTime'>
                                    <span>{{goodconent.shelfEndTime | time_m}}</span>
                                </el-form-item>
                                <br>
                                <el-form-item label="商品品牌 : " prop='brandName'>
                                    <span v-text="goodconent.brandName"></span>
                                </el-form-item>
                                <el-form-item label="运费模板 : " prop='shelfEndTime'>
                                    <span v-text="goodconent.transportTemplateName"></span>
                                </el-form-item>
                                <br>
                                <el-form-item label="商品属性 : " prop='property'>
                                    <el-tooltip class="item" effect="dark" :content="goodconent.property" placement="bottom">
                                        <span>{{myBase.splitText(goodconent.property, 20)}}</span>
                                    </el-tooltip>
                                </el-form-item>
                                <el-form-item label="供货区域 : " prop='transportTemplateArea'>
                                    <el-tooltip class="item" effect="dark" :content="goodconent.transportTemplateArea" placement="bottom">
                                        <span>{{myBase.splitText(goodconent.transportTemplateArea, 20)}}</span>
                                    </el-tooltip>
                                </el-form-item>
                                <br>
                                <el-form-item class="maxWidth" label="商品卖点 : " prop='sellingPoint'>
                                    <span v-text="goodconent.sellingPoint"></span>
                                </el-form-item>
                                <br>
                                <el-form-item class="maxWidth" label="购买提醒 : " prop='buyRemind'>
                                    <span v-text="goodconent.buyRemind"></span>
                                </el-form-item>
                                <br>
                                <el-form-item class="maxWidth" label="商品详情 : ">
                                    <el-button @click="lookGood" type="text">查看详情</el-button>
                                </el-form-item>
                            </el-form>
                        </li>
                    </ul>
                </div>
                <div style="padding-top: 30px; border-top: 1px solid #e4e8eb; margin-top: 30px">
                    <el-row>
                            <el-col :span="2" class="paddinglr20" style="text-align: right">
                                <label>规格明细</label>
                            </el-col>
                            <el-col :span="22">
                                <el-table
                                    border
                                    :span-method="tableMergeMethod"
                                    :data="goodconent.itemPriceDetailVOList"
                                    style="width: 100%">
                                        <el-table-column prop="skuPropertyValueName" label="规格"></el-table-column>
                                        <el-table-column prop="supplyMsg" label="包装类型"></el-table-column>
                                        <el-table-column prop="inventory" label="库存(包/罐/装)">
                                            <template slot="header" slot-scope="slot">
                                                <label class="myRequired">库存(包/罐/装)</label>
                                            </template>
                                            <template slot-scope="scope" >
                                                <span v-text="scope.row.inventory"></span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="singleSkuCostPrice" label="单品成本价(元)">
                                        </el-table-column>
                                        <el-table-column prop="barCode" label="商品条形码">
                                        </el-table-column>
                                        <el-table-column prop="roughWeight" label="规格重量(kg)">
                                            <template slot="header" slot-scope="slot">
                                                <label class="myRequired">规格重量(kg)</label>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="singleSkuPrice" label="单品售价(元)">
                                            <template slot="header" slot-scope="slot">
                                                <label class="myRequired">单品售价(元)</label>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="packageMaterialPrice" label="包材费(元)">
                                        </el-table-column>
                                        <el-table-column prop="totalPrice" label="规格总价(元)">
                                            <template slot-scope="scope" >
                                                <el-input :disabled="true" v-model="scope.row.totalPrice" size="small" placeholder="规格总价"></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="sellPrice" label="商品费率(‰)">
                                            <template slot-scope="scope" >
                                                <el-input :disabled="true" v-model="goodconent.rate" size="small" placeholder="商品费率"></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="sellPrice" label="用户购买价(元)">
                                        </el-table-column>
                                </el-table>
                            </el-col>
                    </el-row>
                </div>
                <div style="margin-top: 30px;">
                    <el-row>
                        <el-col :span="2" class="paddinglr20" style="text-align: right">
                            <label>资质文件</label>
                        </el-col>
                        <el-col class="imgWrap" :span="22">
                            <div>
                                <img v-if="goodconent.itemAptitudeImgVO.customsDeclarationUrl" @click="imgClick(goodconent.itemAptitudeImgVO.customsDeclarationUrl)" :src="goodconent.itemAptitudeImgVO.customsDeclarationUrl" alt="">
                                <img v-if="!goodconent.itemAptitudeImgVO.customsDeclarationUrl" src="../../../public/img/noimg.jpg">
                                <span>海关报关/通关单</span>
                            </div>
                            <div>
                                <img v-if="goodconent.itemAptitudeImgVO.customsFormUrl" @click="imgClick(goodconent.itemAptitudeImgVO.customsFormUrl)" :src="goodconent.itemAptitudeImgVO.customsFormUrl" alt="">
                                <img v-if="!goodconent.itemAptitudeImgVO.customsFormUrl" src="../../../public/img/noimg.jpg">
                                <span>海关送检单</span>
                            </div>
                            <div>
                                <img v-if="goodconent.itemAptitudeImgVO.pratiqueUrl" @click="imgClick(goodconent.itemAptitudeImgVO.pratiqueUrl)" :src="goodconent.itemAptitudeImgVO.pratiqueUrl" alt="">
                                <img v-if="!goodconent.itemAptitudeImgVO.pratiqueUrl" src="../../../public/img/noimg.jpg">
                                <span>检验检疫证书</span>
                            </div>
                            <div>
                                <img v-if="goodconent.itemAptitudeImgVO.approveUrl" @click="imgClick(goodconent.itemAptitudeImgVO.approveUrl)" :src="goodconent.itemAptitudeImgVO.approveUrl" alt="">
                                <img v-if="!goodconent.itemAptitudeImgVO.approveUrl" src="../../../public/img/noimg.jpg">
                                <span>3C认证</span>
                            </div>
                            <div>
                                <img v-if="goodconent.itemAptitudeImgVO.factoryInspectionUrl" @click="imgClick(goodconent.itemAptitudeImgVO.factoryInspectionUrl)" :src="goodconent.itemAptitudeImgVO.factoryInspectionUrl" alt="">
                                <img v-if="!goodconent.itemAptitudeImgVO.factoryInspectionUrl" src="../../../public/img/noimg.jpg">
                                <span>厂检报告</span>
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </section>
        <el-dialog
            title="商品详情"
            :visible.sync="dialogVisible"
            width="70%"
            >
            <div label="商品详情" style='font-size:16px; height: 700px; overflow: auto;'>
                <div v-html="goodDetailHtml" class="htmlconent"></div>
            </div>
        </el-dialog>
        <el-dialog
            title="资质文件"
            :visible.sync="imgdialogVisible"
            width="70%"
            >
            <div>
                <img style="width: 100%" :src="imgDialogUrl" alt="">
            </div>
        </el-dialog>
        <footer class="details_footer">
            <el-button size='small' @click="returnPrev" style="width:90px">返回</el-button>
        </footer>
    </section>
</template>
<script>
import api from 'api/goods'

export default {
    data() {
        return {
            dialogVisible: false,
            imgdialogVisible: false,
            imgDialogUrl: '',
            goodDetailHtml: '',

            activeName: 'first',

            goodconent:{
                itemAptitudeImgVO: {}
            },

            skulist:{},

            imglist: [],

            num: 0
        }
    },
    methods: {
        returnPrev() {
            this.$router.push('goodsList')
        },
        lookGood(){
            this.dialogVisible = true
        },
        imgClick(url){
            this.imgDialogUrl = url
            this.imgdialogVisible = true
        },
        tableMergeMethod({ row, column, rowIndex, columnIndex }){
            if (columnIndex === 1 || columnIndex === 3 || columnIndex === 4 || columnIndex === 5) {
                if (rowIndex % this.goodconent.itemSupplyPropertyVOList.length === 0) {
                    return [this.goodconent.itemSupplyPropertyVOList.length, 1]
                } else {
                    return [0, 0]
                }
            } else {
                return [1, 1]
            }
        },
        get() {
            var id = this.$store.state.home.currentModelId

            api.getGoodDetail(id).then((response)=>{
                this.goodconent = response.data
                if (!response.data.itemAptitudeImgVO) {
                    this.goodconent.itemAptitudeImgVO = {}
                }
                this.skulist = response.data.itemSkuPropertyList
                this.imglist = response.data.itemImgVOList
                let property = response.data.property
                let propertyArr = []

                if (!property) {
                    property = []
                } else {
                    property = JSON.parse(property)
                }

                property.forEach(item => {
                    let str = item.propertyName + ' - ' + item.propertyValue

                    propertyArr.push(str)
                })

                this.goodconent.property = propertyArr.join(";")

                if (response.data.description) {
                    this.goodDetailHtml = response.data.description.replace(/<img/g, "<br><img")
                }

            })
        },
        next() {
            this.num ++;
            let len = $('.bigbox li').length

            if (this.num > len - 1){
                this.num = len - 1
            } else {
                $('.bigbox').animate({left: -this.num * 418 + 'px'}, 100)
                $('.smallbox').animate({left: -this.num * 60 + 'px'}, 100)
                $('.smallbox li img').removeClass('active').eq(this.num).addClass('active')
            }
        },
        prev() {
            this.num --;

            if (this.num < 0){
                this.num = 0
            } else {
                $('.bigbox').animate({left: -this.num * 418 + 'px'}, 100)
                $('.smallbox').animate({left: -this.num * 60 + 'px'}, 100)
                $('.smallbox li img').removeClass('active').eq(this.num).addClass('active')
            }
        },
        imgLi(index) {
            this.num = index
            $('.bigbox').animate({left: -index * 418 + 'px'}, 100)
            $('.smallbox').animate({left: -index * 60 + 'px'}, 100)
        }
    },

    activated() {
        this.get()
        $('.bigbox').css({'left': '0'})
        $('.smallbox').css({'left': '0'})
        $('.smallbox li img').eq(0).addClass('active')
    },
    mounted() {
        this.get()
    }
}
</script>
<style scoped>
    /* 轮播 */
    .bigbox{
        padding: 0;
        display: flex;
        position: absolute;
    }
    .bigbox li img{
        width: 418px;
        height: 418px
    }
    .smallbox{
        padding: 0;
        display: flex;
        position: absolute;
    }
    .smallbox li img{
        width: 50px;
        height: 50px;
        margin-right: 10px;
        border: 1px solid #ccc;
        cursor: pointer;
    }
    .topbox{
        width: 418px;
        margin: auto;
        overflow: hidden;
        position: relative;
        height: 418px;
    }
    .bottombox{
        width: 52px;
        height: 52px;
        margin: auto;
        position: relative;
        border: 1px solid red
    }
    .bottomshow{
        margin-top:20px;
        width: 418px;
        overflow: hidden;
        display: flex
    }

    /* 顶部 */
    .details_header{
        height: 45px;
        width: 100%;
        padding: 0 30px;
        display: flex;
        justify-content: space-between
    }
    .details_conent{
        padding:10px;
        background: #f5f5f5;
        border-top:1px solid #e6e9e9
    }
    .details_box{
        border: 1px solid #e6e9eb;
        color: #5e6161;
        background: white;
        padding: 50px;
        overflow: auto
    }
    /* 内容 */
    .details_text{
        display: flex;

    }
    .recommend{
        margin-left: 50px;
        margin-top: -40px
    }
    .recommend li{
        display: flex;
        margin-top: 20px
    }
    .recommend li p{
        padding: 5px 18px;
        border: 1px solid #e1e1e1;
        margin-left: 20px
    }
    .list_title{
        color: #525252;
    }
    .list_recommend{
        width: 644px;
        color: #888
    }
    .list_money{
        width: 930px;
        height: 67px;
        background: #f8f8f8;
        color:#888;
        line-height: 67px
    }
    .list_dl{
        width: 930px;
        border-top: 1px solid #e7e7e7;
        padding: 10px 40px;
    }
    .list_dl dl dd{
        color: #888;
        margin-top: 10px
    }
    .displaybox{
        display: flex;
        flex-wrap: wrap;
        width: 620px;
    }

    /* 底部 */
    .details_footer{
        border-top:1px solid #e5e8e8;
        padding: 12px 30px;
        /* margin-top: -23px; */
        background: white
    }
    .paddinglr20{
        padding: 0 20px;
    }
    .padding10{
        padding: 10px;
    }
    .imgWrap{
        display: flex;
    }
    .imgWrap>div{
        width: 150px;
        margin-right: 20px;
        text-align: center;
    }
    .imgWrap img{
        width: 150px;
        height: 150px;
    }
    .htmlconent>p{
        text-align: left;
    }
    .htmlconent>p>img{
        width: 800px;
    }
</style>


