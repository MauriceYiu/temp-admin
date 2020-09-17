import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import { getToken } from '@/utils/auth'
import store from '@/store'
import decryptStr from "./aesUtils";
// create an axios instance
const service = axios.create({
    baseURL: window.API_BASE_URI + '/api/v1', // url = base url + request url
    // withCredentials: true, // send cookies when cross-domain requests
    timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
    config => {
        // do something before request is sent

        if (getToken()) {
            if (!config.data) config.data = {}
            if (!config.data.token) config.data.token = getToken()
            config.headers['User-Token'] = localStorage.getItem('User-Token');
        }
        if (!config.data.platform) {
            config.data.platform = 'pc'
        }
        return config
    },
    error => {
        // do something with request error
        console.log(error) // for debug
        return Promise.reject(error)
    }
)

// response interceptor
service.interceptors.response.use(
    /**
     * If you want to get http information such as headers or status
     * Please return  response => response
     */

    /**
     * Determine the request status by custom code
     * Here is just an example
     * You can also judge the status by HTTP Status Code
     */
    response => {
        let res = response.data;
        console.log(response.headers["content-type"]);
        if(String(response.headers["content-type"]).indexOf("csv")!=-1){
            return res;
        }
        if (window.isAes) {
            res = decryptStr(response.data)
        }
        // if the custom code is not 20000, it is judged as an error.
        if (res.status !== 200) {
            Message({
                message: res.message || 'Error',
                type: 'error',
                duration: 5 * 1000
            })

            // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
            if (res.status === 777 || res.status === 778 || res.status === 401) {
                // to re-login
                MessageBox.confirm('登录过期，请重新登录', '提示', {
                    confirmButtonText: '确定',
                    type: 'warning'
                }).then(() => {
                    store.dispatch('user/resetToken').then(() => {
                        location.reload()
                    })
                })
            }
        }
        return res
    },
    error => {
        let res = error.response.data;
        if (window.isAes) {
            res = decryptStr(error.response.data);
        }
        Message({
            message: res.message,
            type: 'error',
            duration: 5 * 1000
        })
        if (error.response.status === 777 || error.response.status === 778 || error.response.status === 401) {
            // to re-login
            MessageBox.confirm('登录过期，请重新登录', '提示', {
                confirmButtonText: '确定',
                type: 'warning'
            }).then(() => {
                store.dispatch('user/resetToken').then(() => {
                    location.reload()
                })
            })
        }
        return Promise.reject(res)
    }
)

export default service