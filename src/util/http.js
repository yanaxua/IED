import axios from 'axios'
import Vue from './vueutil'
import vm from "../main.js";
import { homePage, getCookie, delCookie } from "./util";
import { Message, MessageBox } from 'element-ui';

import router from '@/router'

//axios配置
axios.defaults.timeout = 50000;
axios.defaults.withCredentials = true;
axios.defaults.baseURL = '/api'; //设置开发时跨域求后台数据的基础url;
axios.defaults.headers['Content-Type'] = 'application/json;charset=UTF-8'

var loginOut = function() {
    window.sessionStorage.clear();
    delCookie('name');
    delCookie('st');
    window.location.href = Vue.prototype.homePage;
}

let loading;
//axios request 拦截器
axios.interceptors.request.use(
    config => {
        const token = getCookie('st'); //获取Cookie
        //todo 打包后要改
        if (!token) {
            loginOut();
        }
        //如果传入noLoading为真值,那么就没有loading效果
        if (!config.noLoading) {
            if (!loading || !loading.show) {
                loading = Vue.$vLoading({
                    target: '.plat-div-content'
                });
            }
        }
        if (typeof config.resoureType === "undefined") {
            // setCookie("mr", vm.$route.query.id);
            config.headers["mm"] = vm.$route.query.id;
        } else {
            // setCookie("mr", config.resoureType);
            config.headers["mm"] = config.resoureType;
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    }
);

//axios response  拦截器
axios.interceptors.response.use(
    response => {
        if (loading) {
            loading.close();
        }
        return response;
    },
    error => {
        if (loading) {
            loading.close()
        };
        switch (error.response.status) {
            case 40201:
                //todo 打包后要改
                loginOut();
                break;
            case 40301:
                Message({
                    showClose: true,
                    message: '该资源不存在！',
                    type: 'error',
                    duration: 5 * 1000
                })
                break;
            case 40302:
                MessageBox.alert('危险行为,操作已被拦截!', '警告', {
                    type: 'warning',
                    confirmButtonText: '确定'
                })
                break;
            case 40303:
                MessageBox.confirm('账号在另一个地方登录,是否需要重新定义', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    //todo 打包后要改
                    loginOut();
                })
                break;
            case 40304:
                //TODO 定向到服务器拒绝页面
                window.location.href = 'err.html'
                break;
            // case 502:
            //     loginOut();
            //     break;
        }
        return Promise.reject(error.response.data)
    });


export default axios;