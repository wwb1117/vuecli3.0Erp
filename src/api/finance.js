import HttpClient from 'utils/HttpClient';
export default {
    // 获取收付款单列表
    getPayAndReceList(data) {
        return HttpClient.get('/finance/list', data);
    },
    // 获取收付款单详情
    getPayAndReceDetail(id){
        return HttpClient.get(`/finance/${id}`);
    },
    //确认收款
    confirmReceFinaNo(data){
        return HttpClient.put('/finance/confirmOrder', data);
    },
    //收付款单作废
    invalidFinaNo(data){
        return HttpClient.put('/finance/invalidOrder', data);
    },
    //付款单添加附件
    addExtrueImg(data){
        return HttpClient.put('/finance/updateOrder', data);
    },
    //新增付款单
    addPayNo(data){
        return HttpClient.post('/finance/insertOrder', data);
    },
    //获取发票列表
    getInvoiceList(data) {
        return HttpClient.get('/finance/invoice/list', data);
    },
    //确认发票
    comfirmInvoice(data){
        return HttpClient.put('/finance/invoice/confirmInvoice', data);
    },
    //发票作废
    invalidInvoice(data){
        return HttpClient.put('/finance/invoice/invalidInvoice', data);
    },
    //发票详情
    getInvoiceDetail(id){
        return HttpClient.get(`/finance/invoice/${id}`);
    },
    //新增发票
    addInvoice(data){
        return HttpClient.post('/finance/invoice/insertInvoice', data);
    },
    //账单列表
    getBillList(data){
        return HttpClient.get('/finance/bill/list', data);
    },
    //获取历史账单列表
    getHisBillList(data){
        return HttpClient.get(`/finance/bill/historyList/${data.id}`, data);
    },
    //获取本期账单详情
    getCurrentBillInfo(id, data){
        return HttpClient.get(`/finance/bill/getCurrentBill/${id}`, data);
    },
    //获取账单详情
    getBillInfo(id){
        return HttpClient.get(`/finance/bill/${id}`);
    },
    //生成账单
    insertBill(data){
        return HttpClient.post('/finance/bill/insertBill', data);
    }
}
