var vips = [];
var currentChatId = null;
var $userInfo = $("#userInfo");

var API = {
    userDetail: function(userId) {
        currentChatId = userId;
        this.ajax("/api/v1/user/detailM", { targetId: userId }, function(json) {
            if (json.status === 200) {
                //VIP3  |  男  |  四川成都  |  2019.08.12 注册
                let user = json.data;
                if ("app" === user.app.value) {
                    $userInfo.html(vipString(user.recharge) + "  |  " + user.gender.text + "  |  " +
                        (user.province || '') + (user.city || '') + "  |  " + parseTime(user.createTime, '{y}-{m}-{d}') + " 注册" +
                        '<br>' + user.mobile+'(ID: '+user.id+')');
                    $("#chatTitle .titleRight").removeClass("visibility");
                } else {
                    $userInfo.html("");
                    $("#chatTitle .titleRight").addClass("visibility");
                }
                if (['admin', 'user', 'official', 'salesman'].indexOf(localStorage.getItem("role")) > -1) {
                    $("#chatTitle .titleRight").addClass("visibility");
                }
            }
        })
        nim.searchHistoryMsgs({
            scene: 'p2p',
            to: currentChatId,
            keyword: '在线业务',
            done: function(error, obj) {
                console.log(error);
                console.log(obj);
            }
        });
    },
    checkChat: function(userId) {
        this.ajax("/api/v1/chat/threshold", { targetId: userId }, function(json) {
            if (json.status) {
                if (!json.data) {
                    $("#chatEditor").addClass("hide");
                    $("#chatInputbox").addClass("hide");
                    $("#noChat").removeClass("hide");
                } else {
                    $("#chatEditor").removeClass("hide");
                    $("#chatInputbox").removeClass("hide");
                    $("#noChat").addClass("hide");
                }
            }
        })
    },
    vipAll: function() {
        this.ajax("/api/v1/vip/all", {}, function(json) {
            vips = json.data;
        })
    },
    ajax: function(method, data, success_function_handle, error_function_handle) {
        this.post(window.API_BASE_URI + method, data, success_function_handle, error_function_handle);
    },
    ajaxForCrm: function(method, data, success_function_handle, error_function_handle) {
        this.post(window.API_BASE_URI_FOR_CRM + method, data, success_function_handle, error_function_handle);
    },
    ajaxForCrmGet: function(method, data, success_function_handle, error_function_handle) {
        this.get(window.API_BASE_URI_FOR_CRM + method, data, success_function_handle, error_function_handle);
    },
    post: function(url, data, success_function_handle, error_function_handle) {
        let that = this;
        let xhr = new XMLHttpRequest();
        xhr.open('post', url);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        let userToken = localStorage.getItem("User-Token");
        xhr.setRequestHeader("User-Token", userToken);
        data.token = localStorage.getItem("token");
        xhr.send(JSON.stringify(data));
        xhr.onreadystatechange = function() {
            if (xhr.status === 200) {
                if (xhr.readyState === 4) {
                    // let res = JSON.parse(xhr.responseText);
                    var res = JSON.parse(xhr.responseText);
                    if (window.isAes) {
                        res = decryptStr(JSON.parse(xhr.responseText))
                    }
                    console.log(res)
                    if (success_function_handle) {
                        if (777 === res.code || 778 === res.code || 502 === res.code || 401 === res.code || 444 === res.code) {
                            alert('登录失效，请重新登录!');
                            window.close();
                        } else {
                            success_function_handle(res);
                        }
                    }

                } else {

                    var errRes = JSON.parse(xhr.responseText);
                    if (window.isAes) {
                        errRes = decryptStr(JSON.parse(xhr.responseText))
                    }
                    
                    if (error_function_handle) error_function_handle(errRes);
                }
            }else{
                    var res = JSON.parse(xhr.responseText);
                    if (window.isAes) {
                        res = decryptStr(JSON.parse(xhr.responseText))
                    }
                    alert(res.message)
            }
        }
    },
    get: function(url, data, success_function_handle, error_function_handle) {
        let that = this;
        let xhr = new XMLHttpRequest();
        xhr.open('get', url);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        let userToken = localStorage.getItem("User-Token");
        xhr.setRequestHeader("User-Token", userToken);
        data.token = localStorage.getItem("token");
        xhr.send(JSON.stringify(data));
        xhr.onreadystatechange = function() {
            if (xhr.status === 200) {
                if (xhr.readyState === 4) {
                    // let res = JSON.parse(xhr.responseText);
                    var res = JSON.parse(xhr.responseText);
                    if (window.isAes) {
                        res = decryptStr(JSON.parse(xhr.responseText))
                    }
                    console.log(res)
                    if (success_function_handle) {
                        if (777 === res.code || 778 === res.code || 502 === res.code || 401 === res.code) {
                            alert('登录失效，请重新登录!');
                            window.close();
                        } else {
                            success_function_handle(res);
                        }
                    }

                } else {

                    var errRes = JSON.parse(xhr.responseText);
                    if (window.isAes) {
                        errRes = decryptStr(JSON.parse(xhr.responseText))
                    }

                    if (error_function_handle) error_function_handle(errRes);
                }
            }
        }
    }
};

function showDecimal(num) {
    let numObj = parseFloat(num / 100);
    return numObj.toFixed(2);
}

function vipString(recharge) {
    if (vips && vips.length > 0) {
        for (let i = vips.length - 1; i >= 0; i--) {
            if (recharge >= vips[i].value) {
                return vips[i].name;
            }
        }
    }
    return '--';
}

function parseTime(time, cFormat) {
    if (arguments.length === 0) {
        return null
    }
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
    let date
    if (typeof time === 'object') {
        date = time
    } else {
        if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
            time = parseInt(time)
        }
        if ((typeof time === 'number') && (time.toString().length === 10)) {
            time = time * 1000
        }
        date = new Date(time)
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    }
    const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key]
            // Note: getDay() returns 0 on Sunday
        if (key === 'a') {
            return ['日', '一', '二', '三', '四', '五', '六'][value]
        }
        if (result.length > 0 && value < 10) {
            value = '0' + value
        }
        return value || 0
    })
    return time_str
}

API.vipAll();