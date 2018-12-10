import HttpClient from 'utils/HttpClient';

export default {
    login(data){
        return HttpClient.post('/user/login', data);
    },
    login2(data){
        return HttpClient.post('/user/login', data);
    },
    loginOut(){
        return HttpClient.get('/user/logout');
    }
}
