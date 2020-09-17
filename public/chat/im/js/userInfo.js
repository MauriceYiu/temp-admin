function loadCustomAppData() {
    var $infoBox = $("#infoBox");
    var $mask = $("#mask");
    var role = localStorage.getItem("role");
    var myId = localStorage.getItem("uid");
    var currentServiceOrderId;
    var serviceOrderObj = {};
    var shareObj = {};
    var templateMsgObj = {};
    var autoReply = {
        enable: false,
        messages: [],
        selected: 0
    };
    var groups = [];

    $("#appAutoReply").click(function(e) {
        $mask.removeClass("hide");
        $("#autoReply").removeClass("hide");
        API.ajax("/api/v1/chat/autoReply", {}, (j) => {
            if (j.status === 200 && j.data) {
                autoReply = j.data;
                autoReplyDataBind();
            }
        });
    });

    $("#newReplySubmit").click(function(e) {
        var content = $("#newReplyContent").val();
        if (!content) {
            alert('请输入内容');
            return;
        }
        autoReply.messages.push(content);
        $("#newReplyContent").val('');
        autoReplyDataBind();
    });

    $("#autoReplyEnable").change(function(e) {
        autoReply.enable = $(this).prop("checked");
    });

    $("#autoReply .list").on("click", ".del", function(e) {
        var idx = $(this).data().index;
        autoReply.messages.splice(idx, 1);
        autoReplyDataBind();
        e.stopPropagation();
    });

    $("#autoReply .list").on("click", ".item", function(e) {
        var idx = $(this).data().index;
        autoReply.selected = idx;
        autoReplyDataBind();
        e.stopPropagation();
    });

    function autoReplyDataBind() {
        $("#autoReplyEnable").prop("checked", autoReply.enable);
        $("#autoReply .list").empty();
        autoReply.messages.forEach((m, i) => {
            $("#autoReply .list").append("<div class=\"item\" data-index='" + i + "'>\n" +
                "      <div class=\"left\">\n" +
                "        <p>" + m + "</p>\n" +
                "      </div>\n" +
                "      <div class=\"right\">\n" +
                "        <div class=\"imgWrap\">\n" +
                (i === autoReply.selected ? "          <img src=\"./images/select.png\" alt=\"\">\n" : "") +
                "        </div>\n" +
                "      </div>\n" +
                "      <div class=\"btnGroup\">\n" +
                "        <div class=\"del\" data-index='" + i + "'>删除</div>\n" +
                "      </div>\n" +
                "    </div>");
        });
    }

    autoReplyDataBind();

    $("#autoReply .submit").click(function(e) {
        $("#autoReply").addClass("hide");
        $mask.addClass("hide");
        API.ajax("/api/v1/chat/autoReply/set", { autoReply: autoReply }, (j) => {
            if (j.status === 200) {}
        });
    });
    $("#appTemplate").click(function(e) {
        $mask.removeClass("hide");
        $("#modelEdit").removeClass("hide");
        API.ajax("/api/v1/mtc/all", {}, (j) => {
            if (j.status === 200) {
                $("#modelEdit .list:first").empty();
                j.data.forEach((e, i) => {
                    templateMsgObj[e.id] = e;
                    $("#modelEdit .list:first").append("<div class=\"item\" data-id='" + e.id + "'>\n" +
                        "      <p>" + e.content + "</p>\n" +
                        "      <div class=\"btnGroup\">\n" +
                        "        <img data-id='" + e.id + "' class='edit' src=\"./images/edit.png\" alt=\"\">\n" +
                        "        <img data-id='" + e.id + "' class='del' src=\"./images/del.png\" alt=\"\">\n" +
                        "      </div>\n" +
                        "    </div>");
                });
            }
        });
    });
    $("#modelEdit").on("click", ".edit", function(e) {
        let templateId = $(this).data().id;
        if (templateMsgObj[templateId]) {
            $("#modelContent").val(templateMsgObj[templateId].content);
            $("#modelId").val(templateId);
        }
    });
    $("#modelEdit .list").on("dblclick", ".item", function(e) {
        let templateId = $(this).data().id;
        if (templateMsgObj[templateId]) {
            $mask.addClass("hide");
            $("#modelEdit").addClass("hide");
            $("#messageText").val(templateMsgObj[templateId].content);
        }
    });
    $("#modelEdit").on("click", ".del", function(e) {
        let templateId = $(this).data().id;
        if (confirm('确定要删除该模板消息吗？')) {
            API.ajax("/api/v1/mtc/del", { targetId: templateId }, (j) => {
                if (j.status === 200) {
                    $("#modelContent").val('');
                    $("#modelId").val('0');
                    $("#appTemplate").trigger("click");
                } else {
                    alert(j.message);
                }
            });
        }
    });
    $("#modelEdit .addBtn").click(function(e) {
        var content = $("#modelContent").val();
        var modelId = $("#modelId").val();
        if (!content) {
            alert('请输入模板内容');
            return;
        }
        API.ajax("/api/v1/mtc/edit", { templateId: modelId, type: 'text', content: content }, (j) => {
            if (j.status === 200) {
                $("#modelContent").val('');
                $("#modelId").val('0');
                $("#appTemplate").trigger("click");
            } else {
                alert(j.message);
            }
        });
    });
    $("#appLink").click(function(e) {
        $mask.removeClass("hide");
        $("#share").removeClass("hide");
        $("#share .tabBox div").removeClass("blue");
        $("#share .tabBox div").first().addClass("blue");
        loadShareData('course');
    });
    $("#share .tabBox .shareTtab").click(function(e) {
        $("#share .tabBox div").removeClass("blue");
        $(this).addClass("blue");
        console.log($(this).data().type);
        loadShareData($(this).data().type);
    });
    $("#share .list").on("dblclick", ".item", function(e) {
        let shareId = $(this).data().type;
        if (!shareId || !shareObj[shareId]) return;
        $("#share").addClass("hide");
        $mask.addClass("hide");
        let content = {
            type: 111,
            title: shareObj[shareId].title,
            content: shareObj[shareId].content,
            image: shareObj[shareId].image,
            redirectType: shareObj[shareId].redirectType,
            url: shareObj[shareId].url,
        };
        yunXin.sendMyMessage('p2p', currentChatId, content)
    });
    $("#share .submit").click(function(e) {
        $("#share").addClass("hide");
        $mask.addClass("hide");
    });
    $("#modelEdit .submit").click(function(e) {
        $("#modelEdit").addClass("hide");
        $mask.addClass("hide");
    });

    function loadShareData(type) {
        let url = null;
        let params = null;
        let typeName = null;
        switch (type) {
            case 'course':
                typeName = '课程'
                url = "/api/v1/course/list";
                params = { type: 'course', limit: 50 };
                break;
            case 'news':
                typeName = '资讯';
                url = "/api/v1/course/list";
                params = { type: 'news', limit: 50 };
                break;
            case 'tech':
                typeName = '技术';
                url = "/api/v1/course/list";
                params = { type: 'tech', limit: 50 };
                break;
            case 'live':
                typeName = '直播';
                url = "/api/v1/live/list";
                params = { limit: 50, statuses: ['ok', 'ing'] };
                break;
            case 'guide':
                typeName = '攻略';
                url = "/api/v1/tool/all";
                params = { type: 'guide', limit: 50 };
                break;
            case 'tool':
                typeName = '工具';
                url = "/api/v1/tool/all";
                params = { type: 'tool', limit: 50 };
                break;
            case 'activity':
                typeName = '线下课程';
                url = "/api/v1/activity/list";
                params = { limit: 50 };
                break;
        }
        if (!url) return;
        $("#share .list").empty();
        shareObj = {};
        API.ajax(url, params, (json) => {
            if (json.status === 200) {
                json.data.forEach((item, index) => {
                    let image, name, content;

                    switch (type) {
                        case 'course':
                        case 'news':
                        case 'tech':
                        case 'live':
                        case 'activity':
                            image = item.coverImage;
                            name = item.title;
                            content = item.intro
                            break;
                        case 'guide':
                        case 'tool':
                            image = item.logo;
                            name = item.name;
                            content = item.intro
                            break;
                    }

                    shareObj[item.id] = {
                        title: name,
                        content: content,
                        image: image,
                        redirectType: type,
                        url: item.id
                    };

                    $("#share .list").append("<div class=\"item\" data-type='" + item.id + "'>\n" +
                        "      <div class=\"left\">\n" +
                        "        <div class=\"imgWrap\">\n" +
                        "          <img src=\"" + image + "\" alt=\"\">\n" +
                        "        </div>\n" +
                        "        <div class=\"des\">\n" +
                        "          <div class=\"name\">" + name + "</div>\n" +
                        "          <div class=\"tag\">#" + typeName + "</div>\n" +
                        "        </div>\n" +
                        "      </div>\n" +
                        "      <div class=\"right\">\n" +
                        "        <div class=\"imgWrap\">\n" +
                        // "          <img src=\"./images/select.png\" alt=\"\">\n" +
                        // "          <!--<img src=\"./images/default.png\" alt=\"\">-->\n" +
                        "        </div>\n" +
                        "      </div>\n" +
                        "    </div>");
                });
            }
        });
    }

    $("#demander").click(function(e) {
        $mask.removeClass("hide");
        $("#demandTable").removeClass("hide");
        serviceOrderObj = {};
        $(".serviceOrders").empty();
        API.ajax("/api/v1/service/buys", {
            targetUserId: currentChatId,
            limit: 50
        }, (j) => {
            if (j.status === 200) {
                j.data.forEach((e, i) => {
                    serviceOrderObj[e.number] = e;
                    var item = $("<option value='" + e.number + "'>" + e.number + "</option>");
                    $("#demandTable").find(".serviceOrders").append(item);
                });
                $("#demandTable").find(".serviceOrders").trigger("change");
            }
        });
    });
    // 
    $("#demanderNew").click(function(e) {
        $mask.removeClass("hide");
        $("#demandTableNew").removeClass("hide");
        serviceOrderObj = {};
        $(".serviceOrdersNew").empty();
        API.ajaxForCrm("/api/order/consumer/consult/list", {
            limit: 30,
            page: 0,
            customerId: currentChatId,
            // orderStatus: "SERVING"//默认查询所有的
            orderStatus: null//默认查询所有的
        },function(res){
            if(res.code == 200){
                res.data.forEach((e, i) => {
                    serviceOrderObj[e.orderNo] = e;
                    var item = $("<option value='" + e.orderNo + "'>" + e.orderNo + "</option>");
                    $("#demandTableNew").find(".serviceOrdersNew").append(item);
                });
                $("#demandTableNew").find(".serviceOrdersNew").trigger("change");
            }
        })
    });
    $("#demandTableNew").find(".serviceOrdersNew").change(function(e) {
        let order = serviceOrderObj[$(this).val()];
        console.log(order);
        $("#demandTableNew .serviceOrderName").text(order.consultProduct);
        $("#demandTableNew .serviceOrderTime").text(parseTime(order.createTime));
        $("#demandTableNew .serviceOrderPrice").text(showDecimal(order.amount));
        $("#demandTableNew .serviceOrderPriceValues").empty();
        // Object.keys(order.extra.values).map(key => {
        //     $("#demandTableNew .serviceOrderPriceValues").append("<p><span>" + key + "</span> " + order.extra.values[key] + "</p>");
        // });
    });
    // 
    $("#demandTable").find(".serviceOrders").change(function(e) {
        let order = serviceOrderObj[$(this).val()];
        console.log(order);
        $("#demandTable .serviceOrderName").text(order.serviceName);
        $("#demandTable .serviceOrderTime").text(parseTime(order.createTime));
        $("#demandTable .serviceOrderPrice").text(showDecimal(order.price));
        $("#demandTable .serviceOrderPriceValues").empty();
        Object.keys(order.extra.values).map(key => {
            $("#demandTable .serviceOrderPriceValues").append("<p><span>" + key + "</span> " + order.extra.values[key] + "</p>");
        });
    });
    $("#noteAdd").click(function(e) {
        $mask.removeClass("hide");
        $("#addNote").removeClass("hide");
    });
    $("#evaluate").click(function(e) {
        $mask.removeClass("hide");
        $("#evaluateCsView").removeClass("hide");
        $("#evaluateCsView .demandTableBox").empty();
        API.ajax("/api/v1/chat/csEvaluates", {
            userId: currentChatId,
            csId: localStorage.getItem("uid"),
            limit: 50
        }, (j) => {
            if (j.status === 200) {
                j.data.forEach((e, i) => {
                    $("#evaluateCsView .demandTableBox").append("<div class=\"order\">\n" +
                        "      <div class=\"flex\">\n" +
                        "        <p><span>评价星级</span> " + e.score + "星</p>\n" +
                        "        <p><span>提交时间</span> " + parseTime(e.createTime) + "</p>\n" +
                        "      </div>\n" +
                        "      <div class=\"center\">\n" +
                        "        <p><span>评价</span></p>\n" +
                        "        <div class=\"evaluateBox\">\n" +
                        "          <div class=\"item\">" + e.professionText + "</div>\n" +
                        "          <div class=\"item\">" + e.speedText + "</div>\n" +
                        "          <div class=\"item\">" + e.serviceText + "</div>\n" +
                        "        </div>\n" +
                        "      </div>\n" +
                        "      <p><span>打赏金币</span> " + showDecimal(e.bestow) + "币</p>\n" +
                        "    </div>");
                });
            }
        });
    });
    $("#requireEvaluate").click(function(e) {
        switch (role) {
            case 'cs':
                API.ajax("/api/v1/chat/csIng", { userId: currentChatId, csId: localStorage.getItem("uid") }, (json) => {
                    if (json.status === 200) {
                        if (json.servicing && json.data.length === 0) {
                            $mask.removeClass("hide");
                            $("#openCsReward").removeClass("hide");
                        } else {
                            alert('暂无服务关系，无法请求评价');
                        }
                    } else {
                        alert(json.message);
                    }
                });
                break;
            case 'teacher':
                API.ajax("/api/v1/service/ing", { userId: currentChatId, teacherId: localStorage.getItem("uid") }, (json) => {
                    if (json.status === 200) {
                        if (json.data.length > 0 && "ing" === json.data[0].status.value) {
                            currentServiceOrderId = json.data[0].id;
                            $mask.removeClass("hide");
                            $("#openReward").removeClass("hide");
                        } else {
                            alert('暂无业务往来，无法请求评价');
                        }
                    } else {
                        alert(json.message);
                    }
                });
                break;
        }
    });
    $("#afterSale").click(function(e) {
        $mask.removeClass("hide");
        $("#saleView").removeClass("hide");
        $("#saleView .demandTableBox").empty();
        API.ajax("/api/v1/service/buys", {
            targetUserId: currentChatId,
            statuses: ['afterSale', 'afterSaleFail', 'afterSaleSuccess', 'financeReject', 'failFinished'],
            limit: 50
        }, (j) => {
            if (j.status === 200) {
                j.data.forEach((e, i) => {
                    $("#saleView .demandTableBox").append("<div class=\"order\">\n" +
                        "      <div class=\"flex\">\n" +
                        "        <p><span>售后类型</span> " + e.afterSale.type + "</p>\n" +
                        "        <p><span>提交时间</span> " + parseTime(e.afterSale.createTime) + "</p>\n" +
                        "      </div>\n" +
                        "      <p><span>售后状态</span> 售后-" + e.afterSale.checkStatus.text + "</p>\n" +
                        "      <p><span>退款金币</span> " + showDecimal(e.price) + "币</p>\n" +
                        "      <p><span>售后原因</span> " + e.afterSale.reason + "</p>\n" +
                        "    </div>");
                });
            }
        });
    });
    // 新售后查看
    $("#afterSaleNew").click(function(e) {
        // 只有老师能够查看
        if ('teacher' === role) {
            $mask.removeClass("hide");
            $("#saleViewNew").removeClass("hide");
            $("#saleViewNew .demandTableBox").empty();
            var afterSalesType = {
                PRODUCT:"产品售后",
                CONTENT:"内容售后",
                BUSINESS_SCHOOL:"商学售后",
                LIVE:"直播售后",
                RECHARGE :"充值售后"
            };
            var orderStatus = {
                "TO_BE_DOCK": "待对接",
                "PROCESS": "处理中",
                "CONTINUE_SERVICE": "继续服务",
                "END_OF_SERVICE": "结束服务",
                "RESELECT_TEACHER": "重选老师",
                "APPOINT_TEACHER": "指定老师",
                "REFUND": "退款",
                "CANCEL": "取消订单",
            }
            API.ajaxForCrm("/api/order/afterSales/list", {
                customerId: currentChatId,
                teacherId: myId,
                // statuses: ['afterSale', 'afterSaleFail', 'afterSaleSuccess', 'financeReject', 'failFinished'],
                limit: 50,
                page:0
            }, (j) => {
                if (j.status === 200) {
                    j.data.forEach((e, i) => {
                        $("#saleViewNew .demandTableBox").append("<div class=\"order\">\n" +
                            "      <div class=\"flex\">\n" +
                            "        <p><span>售后类型</span> " + afterSalesType[e.afterSalesType] + "</p>\n" +
                            "        <p><span>提交时间</span> " + parseTime(e.createTime) + "</p>\n" +
                            "      </div>\n" +
                            "      <p><span>售后状态</span>" + orderStatus[e.orderStatus] + "</p>\n" +
                            // "      <p><span>退款金币</span> " + showDecimal(e.price) + "币</p>\n" +
                            "      <p><span>售后原因</span> " + (e.result?e.result:"---") + "</p>\n" +
                            "    </div>");
                    });
                }
        });
        }else{
            alert("只有老师能够查看");
        }
        
    });
    // 新售后查看end
    $("#rechooseTeacher").click(function(e) {
        if ('teacher' === role) {
            if (confirm('真的要让客户重新选择老师操作吗？')) {
                API.ajax("/api/v1/service/rechooseTeacher", {
                    targetUserId: currentChatId
                }, j => {
                    if (j.status === 200) {
                        alert('操作成功');
                    } else {
                        alert(j.message);
                    }
                });
            }
        } else {
            alert('只有技术老师才有重选老师的功能')
        }
    });
    $("#rechooseTeacherNew").unbind("click").bind("click",(function(e) {
        if ('teacher' === role) {
            $(".serviceOrdersNewForResTeacher").empty();
            $mask.removeClass("hide");
            $("#reSelTeacher").removeClass("hide");
            // $(".afterSaleTypeNewForTeacher").unbind("change").bind("change",function() {
                // $(".serviceOrdersNewForResTeacher").empty();
                // var typeVal = $(this).val();
                // if (typeVal == "") {
                //     return;
                // }
                // switch (typeVal) {
                    // case "PRODUCT":
            API.ajaxForCrm("/api/order/consumer/consult/list", {
                limit: 30,
                page: 0,
                customerId: currentChatId,
                teacherId: myId,
                orderStatus: "SERVING"
            },function(res){
                if(res.code == 200){
                    res.data.forEach((e, i) => {
                        var item = $('<option value="' + e.id + '">' + e.consultProduct +'('+e.orderNo+')'+ '</option>');
                        $("#reSelTeacher").find(".serviceOrdersNewForResTeacher").append(item);
                    })
                }
            })
                    //     break;
                    // default:
                    //     break;
                // }
            // })
        } else {
            alert('只有技术老师才有重选老师的功能')
        }
    }));
    $("#afterSaleAdd").click(function(e) {
        if ('cs' === role || 'teacher' === role) {
            $(".serviceOrders").empty();
            $mask.removeClass("hide");
            $("#afterSaleSubmit").removeClass("hide");
            API.ajax("/api/v1/service/buys", {
                targetUserId: currentChatId,
                limit: 50,
                statuses: ['ing', 'evaluate']
            }, (j) => {
                if (j.status === 200) {
                    j.data.forEach((e, i) => {
                        var item = $('<option value="' + e.id + '">' + e.number + '，' + e.serviceName + '(' + e.status.text + ')</option>');
                        $("#afterSaleSubmit").find(".serviceOrders").append(item);
                    });
                }
            });
        } else {
            alert('只有客服或技术老师才有售后功能')
        }
    });

    $("#afterSaleAddNew").click(function(e) {
        if ('cs' === role || 'teacher' === role) {
            $(".serviceOrdersNew").empty();
            $mask.removeClass("hide");
            $("#afterSaleSubmitNew").removeClass("hide");
            $(".afterSaleTypeNew").unbind("change").bind("change",function() {
                    $(".serviceOrdersNew").empty();
                    var typeVal = $(this).val();
                    if (typeVal == "") {
                        return;
                    }
                    switch (typeVal) {
                        case "PRODUCT":
                            API.ajaxForCrm("/api/order/consumer/consult/list", {
                                limit: 30,
                                page: 0,
                                customerId: currentChatId,
                                orderStatus: "SERVING"
                            },function(res){
                                if(res.code == 200){
                                    res.data.forEach((e, i) => {
                                        var item = $('<option value="' + e.id + '">' + e.consultProduct +'('+e.orderNo+')'+ '</option>');
                                        $("#afterSaleSubmitNew").find(".serviceOrdersNew").append(item);
                                    })
                                }
                            })
                            break;
                        case "CONTENT":
                            API.ajaxForCrm("/api/order/consumer/content/list", {
                                limit: 30,
                                page: 0,
                                customerId: currentChatId,
                                orderStatus: "NORMAL"
                            },function(res){
                                if(res.code == 200){
                                    res.data.forEach((e, i) => {
                                        var item = $('<option value="' + e.id + '">' + e.courseName +'('+e.orderNo+')'+'</option>');
                                        $("#afterSaleSubmitNew").find(".serviceOrdersNew").append(item);
                                    })
                                }
                            })
                            break;
                        case "BUSINESS_SCHOOL":
                            API.ajaxForCrm("/api/order/consumer/businessSchool/list", {
                                limit: 30,
                                page: 0,
                                customerId: currentChatId,
                                orderStatus: "NORMAL"
                            },function(res){
                                if(res.code == 200){
                                    res.data.forEach((e, i) => {
                                        var item = $('<option value="' + e.id + '">' + e.title +'('+e.orderNo+')'+ '</option>');
                                        $("#afterSaleSubmitNew").find(".serviceOrdersNew").append(item);
                                    })
                                }
                            })
                            break;
                        case "RECHARGE":
                            API.ajaxForCrm("/api/order/recharge/list", {
                                limit: 30,
                                page: 0,
                                customerId: currentChatId,
                                orderStatus: "NORMAL"
                            },function(res){
                                if(res.code == 200){
                                    res.data.forEach((e, i) => {
                                        var item = $('<option value="' + e.id + '">'+(e.rechargePrice / 100)+'('+e.orderNo+')'+'(充值订单)</option>');
                                        $("#afterSaleSubmitNew").find(".serviceOrdersNew").append(item);
                                    })
                                }
                            })
                            break;
                        default:
                            break;
                    }
                    // console.log(optionsData)
                    // switch (typeVal) {
                    //     case "PRODUCT":
                    //         optionsData.forEach((e, i) => {
                    //             var item = $('<option value="' + e.id + '">' + '，' + e.consultProduct + '</option>');
                    //             $("#afterSaleSubmitNew").find(".serviceOrdersNew").append(item);
                    //         })
                    //         break;
                    //     case "CONTENT":
                    //         optionsData.forEach((e, i) => {
                    //             var item = $('<option value="' + e.id + '">' + '，' + e.courseName + '</option>');
                    //             $("#afterSaleSubmitNew").find(".serviceOrdersNew").append(item);
                    //         })
                    //         break;
                    //     case "BUSINESS_SCHOOL":
                    //         optionsData.forEach((e, i) => {
                    //             var item = $('<option value="' + e.id + '">' + '，' + e.title + '</option>');
                    //             $("#afterSaleSubmitNew").find(".serviceOrdersNew").append(item);
                    //         })
                    //         break;
                    //     case "RECHARGE":
                    //         optionsData.forEach((e, i) => {
                    //             var item = $('<option value="' + e.id + '">' + '，(充值订单)</option>');
                    //             $("#afterSaleSubmitNew").find(".serviceOrdersNew").append(item);
                    //         })
                    //         break;
                    //     default:
                    //         break;
                    // }
                    
                })
                // API.ajaxForCrm("/api/order/afterSales/list", {
                //         limit: 30,
                //         page: 0,
                //         customerId: 0
                //     })
                /**
                API.ajax("/api/v1/service/buys", {
                    targetUserId: currentChatId,
                    limit: 50,
                    statuses: ['ing', 'evaluate']
                }, (j) => {
                    if (j.status === 200) {
                        j.data.forEach((e, i) => {
                            var item = $('<option value="' + e.id + '">' + e.number + '，' + e.serviceName + '(' + e.status.text + ')</option>');
                            $("#afterSaleSubmitNew").find(".serviceOrders").append(item);
                        });
                    }
                });
                */
        } else {
            alert('只有客服或技术老师才有售后功能')
        }
    });
    $("#notes").click(function(e) {
        $mask.removeClass("hide");
        $("#addNotes").removeClass("hide");
        $("#addNotes .list:first").empty();
        API.ajax("/api/v1/user/notes", { userId: currentChatId, teacherId: localStorage.getItem("uid"), limit: 50 }, j => {
            if (j.status === 200) {
                j.data.forEach((e, i) => {
                    $("#addNotes .list:first").append("<div class=\"item\" data-id='" + e.id + "'>\n" +
                        "      <p>" + e.content + "</p>\n" +
                        "      <div class=\"btnGroup\">\n" +
                        "        <div class=\"left\">\n" +
                        "          <span class=\"edit\" data-id='" + e.id + "' data-content='" + e.content + "'>编辑</span>\n" +
                        "          <span class=\"delete\" data-id='" + e.id + "'>删除</span>\n" +
                        "        </div>\n" +
                        "        <div class=\"time\">" + parseTime(e.createTime) + "</div>\n" +
                        "      </div>\n" +
                        "    </div>");
                });
            }
        });
    });

    $("#addNotes .list").on("click", ".edit", function(e) {
        let noteId = $(this).data("id");
        let content = $(this).data("content");
        var newNote = prompt('请重新输入笔记', content);
        if (newNote) {
            API.ajax("/api/v1/user/note", { noteId: noteId, targetUserId: currentChatId, content: newNote }, j => {
                if (j.status === 200) {
                    alert('修改成功');
                    $("#notes").trigger("click");
                } else {
                    alert(j.message);
                }
            });
        }
    });

    $("#addNotes .list").on("click", ".delete", function(e) {
        if (confirm('真的要删除这条笔记吗？')) {
            let noteId = $(this).data("id");
            API.ajax("/api/v1/user/noteDel", { targetId: noteId }, j => {
                if (j.status === 200) {
                    alert('删除成功');
                    $("#notes").trigger("click");
                } else {
                    alert(j.message);
                }
            });
        }
    });

    $("#openReward .cancel").click(function(e) {
        $("#openReward").addClass("hide");
        $mask.addClass("hide");
    });
    $("#addNotes .submit").click(function(e) {
        $("#addNotes").addClass("hide");
        $mask.addClass("hide");
    });
    $("#addNote .cancel").click(function(e) {
        $("#addNote").addClass("hide");
        $mask.addClass("hide");
    });
    $("#addNote .submit").click(function(e) {
        var content = $("#addNoteContent").val();
        console.log(content);
        if (!content) {
            alert('请输入笔记内容')
            return;
        }
        API.ajax("/api/v1/user/note", {
            targetUserId: currentChatId,
            content: content
        }, (json) => {
            if (json.status === 200) {
                $("#addNoteContent").val('');
                $("#addNote").addClass("hide");
                $mask.addClass("hide");
                alert('成功提交笔记')
            } else {
                alert(json.message);
            }
        });
    });
    $("#openReward .confirm").click(function(e) {
        API.ajax("/api/v1/service/requireEvaluate", { orderId: currentServiceOrderId }, (json) => {
            if (json.status === 200) {
                $("#openReward").addClass("hide");
                $mask.addClass("hide");
                yunXin.sendMyMessage('p2p', currentChatId, {
                    type: 107,
                    title: '老师请求评价',
                    content: '',
                    image: '',
                    redirectType: '',
                    url: '',
                })
            } else {
                alert(json.message);
            }
        });
    });
    $("#evaluateCsView .submit").click(function(e) {
        $("#evaluateCsView").addClass("hide");
        $mask.addClass("hide");
    });
    $("#demandTable .submit").click(function(e) {
        $("#demandTable").addClass("hide");
        $mask.addClass("hide");

        $("#demandTable .serviceOrderName").text('');
        $("#demandTable .serviceOrderTime").text('');
        $("#demandTable .serviceOrderPrice").text('');
        $("#demandTable .serviceOrderPriceValues").empty();
    });
    // 
    $("#demandTableNew .submit").click(function(e) {
        $("#demandTableNew").addClass("hide");
        $mask.addClass("hide");

        $("#demandTableNew .serviceOrderName").text('');
        $("#demandTableNew .serviceOrderTime").text('');
        $("#demandTableNew .serviceOrderPrice").text('');
        $("#demandTableNew .serviceOrderPriceValues").empty();
    });
    // 
    $("#saleView .submit").click(function(e) {
        $("#saleView").addClass("hide");
        $mask.addClass("hide");
    });
    $("#saleViewNew .submit").click(function(e) {
        $("#saleViewNew").addClass("hide");
        $mask.addClass("hide");
    });
    $("#evaluateView .submit").click(function(e) {
        $("#evaluateView").addClass("hide");
        $mask.addClass("hide");
    });
    $("#openCsReward .cancel").click(function(e) {
        $("#openCsReward").addClass("hide");
        $mask.addClass("hide");
    });
    $("#afterSaleSubmit .cancel").click(function(e) {
        $("#afterSaleSubmit").addClass("hide");
        $mask.addClass("hide");
    });
    $("#afterSaleSubmitNew .cancel").click(function(e) {
        $("#afterSaleSubmitNew").addClass("hide");
        $mask.addClass("hide");
        $("#afterSaleSubmitNew .afterSaleTypeNew").val("");
    });
    $("#reSelTeacher .cancel").click(function(e) {
        $("#reSelTeacher").addClass("hide");
        $mask.addClass("hide");
        $("#reSelTeacher .afterSaleTypeNewForTeacher").val("");
    });
    $("#reSelTeacher .submit").unbind("click").bind("click",function(e) {
        var relOrderId = $("#reSelTeacher .serviceOrdersNewForResTeacher").val();
        // var afterSalesType = $("#reSelTeacher .afterSaleTypeNewForTeacher").val();
        // var note = $("#afterSaleContentNewForTeacher").val();
        if (!relOrderId) {
            alert('请选择订单')
            return;
        }
        API.ajaxForCrm("/api/order/consumer/consult/reset", {
            targetId: relOrderId,
        }, (json) => {
            if (json.status === 200) {
                $("#reSelTeacher").addClass("hide");
                $mask.addClass("hide");
                alert('操作成功')
                $("#reSelTeacher .afterSaleTypeNewForTeacher").val("");
            } else {
                alert(json.message);
            }
        });
    });
    // 
    $("#afterSaleSubmitNew .submit").unbind("click").bind("click",function(e) {
        var relOrderId = $("#afterSaleSubmitNew .serviceOrdersNew").val();
        var afterSalesType = $("#afterSaleSubmitNew .afterSaleTypeNew").val();
        var note = $("#afterSaleContentNew").val();
        if (!note) {
            alert('请输入售后描述')
            return;
        }
        API.ajaxForCrm("/api/order/afterSales/edit", {
            relOrderId: relOrderId,
            submitterId:myId,
            note:note,
            customerId:currentChatId,
            afterSalesType:afterSalesType,
        }, (json) => {
            if (json.status === 200) {
                $("#afterSaleSubmitNew").addClass("hide");
                $mask.addClass("hide");
                alert('成功提交售后')
                $("#afterSaleSubmitNew .afterSaleTypeNew").val("");
            } else {
                alert(json.message);
            }
        });
    });
    // 
    $("#afterSaleSubmit .submit").click(function(e) {
        var orderId = $("#afterSaleSubmit .serviceOrders").val();
        var type = $("#afterSaleSubmit .afterSaleType").val();
        var content = $("#afterSaleContent").val();
        console.log(type, content);
        if (!content) {
            alert('请输入售后描述')
            return;
        }
        API.ajax("/api/v1/service/requireAfterSale", {
            orderId: orderId,
            type: type,
            reason: content
        }, (json) => {
            if (json.status === 200) {
                $("#afterSaleSubmit").addClass("hide");
                $mask.addClass("hide");
                alert('成功提交售后')
            } else {
                alert(json.message);
            }
        });
    });
    $("#openCsReward .confirm").click(function(e) {
        var type = $(this).parent().parent().find(".evaluateType").val();
        var title = $(this).parent().parent().find(".evaluateTitle").val();
        if (!type) {
            alert('请输入类型')
            return;
        }
        if (!title) {
            alert('请输入咨询内容')
            return;
        }
        API.ajax("/api/v1/chat/csRequireEvaluate", { targetUserId: currentChatId, type: type, title: title }, (json) => {
            if (json.status === 200) {
                $("#openCsReward").addClass("hide");
                $mask.addClass("hide");
                yunXin.sendMyMessage('p2p', currentChatId, {
                    type: 108,
                    title: '客服请求评价',
                    content: '',
                    image: '',
                    redirectType: '',
                    url: '',
                })
            } else {
                alert(json.message);
            }
        });
    });

    function chat2Somebody(account) {
        let userById = yunXin.cache.getUserById(account);
        if (userById) {
            window.yunXin.openChatBox(account, 'p2p');
        } else {
            nim.getUser({
                account: account,
                done: (error, user) => {
                    console.log(error, user);
                    if (user) {
                        yunXin.cache.setPersonlist([user]);
                        window.yunXin.openChatBox(account, 'p2p');
                    } else {
                        alert('该账号异常，无法聊天！')
                    }
                }
            })
        }
    }

    $("#department").on("click", ".userItem", function() {
        let userId = $(this).data("id");
        chat2Somebody(userId);
    });
    $("#colleagues").on("click", ".userItem", function() {
        let userId = $(this).data("id");
        chat2Somebody(userId);
    });
    $("#contactList").on("click", ".userItem", function() {
        let userId = $(this).data("id");
        chat2Somebody(userId);
    });
    $("#contactList").on("click", ".menuRight", function(e) {
        // e.stopPropagation();
    });
    $("#contactList").on("click", ".info", function(e) {
        $(".right-panel").addClass("hide");
        $infoBox.removeClass("hide");
        $(this).parent().addClass("hide");
        let userId = $(this).data("id");
        console.log(userId);
        loadDetail(userId);
        loadStatistics(userId);
        loadNotes(userId);
        e.stopPropagation();
    });
    $("#nickNameEdit").click(function(e) {
        var oldNickName = $("#nickName").text();
        var nickName = prompt('请输入备注名称', oldNickName);
        if (nickName) yunXin.addFriendAlias(currentChatId, nickName);
    });
    $("#groupMenu .groups").on("click", "li", function(e) {
        console.log($(this).data());
        var groupId = $(this).data("groupId");
        var id = $(this).data("id");
        API.ajax("/api/v1/chat/groupEnter", { targetId: groupId, enter: true, ids: [id] }, (json) => {
            if (json.status === 200) {
                loadCustomers();
            } else {
                alert(json.message);
            }
        });
    });
    $("#groupMenu .item").click(function(e) {
        $("#groupMenu").addClass("hide");
        var type = $(this).data("type");
        var id = $(this).data("id");
        var groupName, nickName;
        switch (type) {
            case 0:
                groupName = prompt('请输入分组名称');
                if (groupName) {
                    API.ajax("/api/v1/chat/groupEdit", { name: groupName }, (json) => {
                        if (json.status === 200) {
                            loadCustomers();
                        } else {
                            alert(json.message);
                        }
                    });
                }
                break;
            case 1:
                groupName = prompt('请输入新的分组名称');
                if (groupName) {
                    API.ajax("/api/v1/chat/groupEdit", { groupId: id, name: groupName }, (json) => {
                        if (json.status === 200) {
                            loadCustomers();
                        } else {
                            alert(json.message);
                        }
                    });
                }
                break;
            case 2:
                if (confirm('您真的要删除该分组吗？')) {
                    API.ajax("/api/v1/chat/groupDel", { targetId: id }, (json) => {
                        if (json.status === 200) {
                            loadCustomers();
                        } else {
                            alert(json.message);
                        }
                    });
                }
                break;
            case 3:
                $(".right-panel").addClass("hide");
                $infoBox.removeClass("hide");
                let userId = $(this).data("id");
                console.log(userId);
                loadDetail(userId);
                loadStatistics(userId);
                loadNotes(userId);
                break;
            case 4:
                nickName = prompt('请输入备注名称');
                yunXin.addFriendAlias(id, nickName);
                loadCustomers();
                break;
            case 5:
                break;
            case 6:
                if (confirm('您真的要称出该分组吗？')) {
                    console.log($(this).data());
                    let groupId = $(this).data("groupId");
                    API.ajax("/api/v1/chat/groupEnter", { targetId: groupId, enter: false, ids: [id] }, (json) => {
                        if (json.status === 200) {
                            loadCustomers();
                        } else {
                            alert(json.message);
                        }
                    });
                }
                break;
        }
        e.stopPropagation();
    });
    $("#contactList").on("click", ".dian", function(e) {
        console.log($(this).data());
        var type = $(this).data("type");
        var id = $(this).data("id");
        var groupId = $(this).data("groupId");
        let $groupMenu = $("#groupMenu");
        $groupMenu.find(".item").addClass("hide").data("id", id).data("groupId", groupId);
        $groupMenu.find("li").data("id", id);
        switch (type) {
            case 0:
                $groupMenu.find(".group-add").removeClass("hide");
                break;
            case 1:
                $groupMenu.find(".info").removeClass("hide");
                $groupMenu.find(".remark").removeClass("hide");
                $groupMenu.find(".move").removeClass("hide");
                break;
            case 2:
                $groupMenu.find(".info").removeClass("hide");
                $groupMenu.find(".remark").removeClass("hide");
                $groupMenu.find(".move").removeClass("hide");
                $groupMenu.find(".remove").removeClass("hide");
                break;
            case 3:
                $groupMenu.find(".group-rename").removeClass("hide");
                $groupMenu.find(".group-del").removeClass("hide");
                break;
        }
        $groupMenu.removeClass("hide").css("top", e.clientY - 20).css("left", e.clientX + 20);
        e.stopPropagation();
    });
    $("#contactList").on("click", ".head", function(e) {
        console.log("arrowDown button");
        let parent = $(this).parent();
        parent.find(".userList").toggleClass("hide");
        $(this).find(".arrowDown").toggleClass("group-inverse");
        e.stopPropagation();
    });
    $("#select").on("click", ".selectItem", function(e) {
        $("#contactsWrap .list").addClass("hide");
        $("#contactsWrap").find("#" + $(this).data("type")).removeClass("hide");
        $("#select .selectItem").removeClass("blue");
        $(this).addClass("blue");
    });

    loadCustomers();
    loadDepartmentStaffs();

    function loadDepartmentStaffs() {
        API.ajax("/api/v1/user/staffs", {}, (json) => {
            if (json.status === 200) {
                $("#staffsCount").text(json.data.length)
                let departmentId = localStorage.getItem("departmentId");
                json.data.forEach((staff, index) => {
                    let item = "<div class=\"userItem\" data-id='" + staff.id + "'>\n" +
                        "                  <div class=\"userInfo\">\n" +
                        "                    <img src=\"" + staff.avatar + "\" alt=\"\" class=\"avatar\">\n" +
                        "                    <span>" + staff.name + "</span>\n" +
                        "                  </div>\n" +
                        "                  <div class=\"right\">\n" +
                        "                    <img src=\"./images/newAdd/dian.png\" alt=\"\" class=\"dian hide\">\n" +
                        "                  </div>\n" +
                        "                </div>";
                    $("#colleagues .userList").append(item);
                    if (departmentId === staff.departmentId) {
                        $("#department .userList").append(item);
                    }
                });
            }
        });
    }

    function loadCustomers() {
        API.ajax("/api/v1/staff/customers", {}, (json) => {
            if (json.status === 200) {
                var ids = [];

                $("#friendsCount").text(json.data.length);
                $("#contactList .groups").remove();
                $("#groupMenu .groups").empty();
                groups = json.groups;
                groups.forEach((group, index) => {
                    $("#groupMenu .groups").append("<li data-group-id='" + group.id + "'>" + group.name + "</li>");
                    var customersHtml = "";
                    group.customers.forEach((customer, index) => {
                        ids.push(customer.id);
                        customersHtml += "<div class=\"userItem\" data-id='" + customer.id + "'>\n" +
                            "                  <div class=\"userInfo\">\n" +
                            "                    <img src=\"" + customer.avatar + "\" alt=\"\" class=\"avatar\">\n" +
                            "                    <span>" + (yunXin.getNick(customer.id) || customer.name) + "</span>\n" +
                            "                  </div>\n" +
                            "                  <div class=\"right\">\n" +
                            "                    <img src=\"./images/newAdd/dian.png\" alt=\"\" class=\"dian\" data-type=\"2\" data-id=\"" + customer.id + "\" data-group-id='" + group.id + "'>\n" +
                            "                  </div>" +
                            "                </div>";
                    });
                    var html = "<div class=\"contactList_title groups\">\n" +
                        "              <div class=\"head\">\n" +
                        "                <div class=\"left\">" + group.name + "</div>\n" +
                        "                <div class=\"right\">\n" +
                        "                  <img src=\"./images/newAdd/dian.png\" alt=\"\" class=\"dian\" data-type=\"3\" data-id=\"" + group.id + "\">\n" +
                        "                  <img src=\"./images/newAdd/arrowDown.png\" alt=\"\" class=\"arrowDown\">\n" +
                        "                </div>\n" +
                        "              </div>\n" +
                        "              <div class=\"userList\">\n" + customersHtml +
                        "              </div>" +
                        "            </div>"
                    $("#contactList").append(html);
                });

                $("#contactAll .userList").empty();
                json.data.forEach((item, index) => {
                    if (ids.indexOf(item.id) === -1) {
                        $("#contactAll .userList").append("<div class=\"userItem\" data-id='" + item.id + "'>\n" +
                            "                  <div class=\"userInfo\">\n" +
                            "                    <img src=\"" + item.avatar + "\" alt=\"\" class=\"avatar\">\n" +
                            "                    <span>" + (yunXin.getNick(item.id) || item.name) + "</span>\n" +
                            "                  </div>\n" +
                            "                  <div class=\"right\">\n" +
                            "                    <img src=\"./images/newAdd/dian.png\" alt=\"\" class=\"dian\" data-type=\"1\" data-id=\"" + item.id + "\">\n" +
                            "                  </div>\n" +
                            "                </div>");
                    }
                });
            }
        });
    }

    function loadDetail(userId) {
        API.ajax("/api/v1/user/detailM", { targetId: userId }, (json) => {
            if (json.status === 200) {
                $infoBox.find(".avatar img").attr("src", json.data.extra.trueAvatar);
                $infoBox.find(".nickName").text(json.data.extra.trueName);
                $infoBox.find(".sign").text(json.data.extra.sign);
                $infoBox.find(".gender").text(json.data.gender.text);
                $infoBox.find(".city").text((json.data.province || '') + (json.data.city || ''));
                $infoBox.find(".account").text(json.data.mobile);
                $infoBox.find(".registerTime").text(parseTime(json.data.createTime));
                $infoBox.find(".surplus").text(showDecimal(json.data.surplus));
                $infoBox.find(".taken").text(showDecimal(json.data.recharge + json.data.rechargeGift - json.data.surplus));
                $infoBox.find(".vip").text(vipString(json.data.recharge));
            }
        });
    }

    function loadStatistics(userId) {
        API.ajax("/api/v1/user/statistics", { targetId: userId }, (json) => {
            if (json.status === 200) {
                $infoBox.find(".question").text(json.data.question);
                $infoBox.find(".fav").text(json.data.fav);
                $infoBox.find(".followed").text(json.data.followed);
                $infoBox.find(".courseBuy").text(json.data.courseBuy);
                $infoBox.find(".wealthFlow").text(json.data.wealthFlow);
                $infoBox.find(".activityDating").text(json.data.activityDating);
                $infoBox.find(".coupon").text(json.data.coupon);
            }
        });
    }

    function loadNotes(userId) {
        API.ajax("/api/v1/user/notes", { userId: userId, teacherId: localStorage.getItem("uid"), limit: 100 }, (json) => {
            if (json.status === 200) {
                let notes = $infoBox.find(".note .list");
                notes.html("");
                json.data.forEach((note, index) => {
                    notes.append("<div class=\"item\">\n" +
                        "                <p>" + note.content + "</p>\n" +
                        "                <div class=\"bottom\">\n" +
                        "                  <div class=\"left\">\n" +
                        "                    " + note.teacherName + "\n" +
                        "                  </div>\n" +
                        "                  <div class=\"right\">\n" +
                        "                    " + parseTime(note.createTime) + "\n" +
                        "                  </div>\n" +
                        "                </div>\n" +
                        "              </div>");
                });
            }
        });
    }

    $("body").click(function(e) {
        $(".groupMenu").addClass("hide");
    });

    $("#groupMenu .move").hover(function(e) {
        $("#groupMenu .groups").toggleClass("hide");
    });

    var dropbox, uploadForm;

    dropbox = document.getElementById("messageText");
    dropbox.addEventListener("dragenter", dragenter, false);
    dropbox.addEventListener("dragover", dragover, false);
    dropbox.addEventListener("paste", paste, false);
    //dropbox.addEventListener("drop", drop, false);

    uploadForm = document.getElementById("uploadForm");
    uploadForm.addEventListener("drop", drop, false);

    //uploadForm.addEventListener("dragleave", dragleave, false);

    function paste(e) {
        console.log(e);
        //if (!(e.clipboardData && e.clipboardData.items)) {
        //  return;
        //}

        for (var i = 0, len = e.clipboardData.items.length; i < len; i++) {
            var item = e.clipboardData.items[i];

            if (item.kind === "string") {
                item.getAsString(function(str) {
                    console.log(str);
                })
            } else if (item.kind === "file") {
                var pasteFile = item.getAsFile();
                console.log(pasteFile);
                var reader = new FileReader();
                // 将图片转成DataURL格式
                reader.readAsDataURL(pasteFile);
                reader.onload = function() {
                    //读取完毕后输出结果
                    console.log(reader.result);
                    yunXin.sendDragFileMessage(pasteFile.name, reader.result);
                }
            }
        }
    }

    // 目标进入drop区域
    function dragenter(e) {
        $("#uploadForm").removeClass("hide");
    }

    // 目标位于drop区域上方
    function dragover(e) {
        $("#uploadForm").removeClass("hide");

    }
    $("body").mouseenter(function() {
        $("#uploadForm").addClass("hide");
    })
    $("body").mouseleave(function() {
            $("#uploadForm").addClass("hide");
        })
        // 目标离开drop区域
    function dragleave(e) {
        $("#uploadForm").addClass("hide");
    }

    // 目标在drop区域被释放/放置（松开鼠标）
    function drop(ev) {
        setTimeout(() => {
            $("#uploadForm").addClass("hide");
        }, 100)
    }
}