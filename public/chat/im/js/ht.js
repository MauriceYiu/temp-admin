$("body").on("DOMNodeInserted",function(val){
    $(".msg-click").unbind("click").bind("click",function (e) { 
        console.log(JSON.parse($(this).attr("data-msgcont")));
        var msgType = $(this).attr("data-msgtype");
        var msgCont = JSON.parse($(this).attr("data-msgcont"));
        if(msgType == "custom"){
            if(msgCont.content){
                var obj = JSON.parse(msgCont.content);
                // var objData = JSON.parse(obj.data);
                var typeStr = "115,116,117";
                var type = obj.type + '';
                if(type.indexOf(typeStr)){
                    API.ajaxForCrmGet("/api/order/contract/findByRelOrderId?relOrderId="+obj.data.relOrderId,{
                    },function (res) { 
                        if(res.data.status == "AUDITING"){
                            $("#imageMask .cont-wrap .btn-wrap").removeClass("hide");
                        }else{
                            $("#imageMask .cont-wrap .btn-wrap").addClass("hide");
                            return;
                        }
                        $("#imageMask").unbind("click").bind("click",function(e){
                            $(this).addClass("hide");
                            $("#htPic").attr("src","");
                            $("#cardPicOne").attr("src","");
                            $("#cardPicTwo").attr("src","");
                            $("#imageMask .note-wrap").addClass("hide");
                            $("#noteCnt").val("");
                        })
                        $("#imageMask .cont-wrap").unbind("click").bind("click",function(e){
                            e.preventDefault();
                            e.stopPropagation();
                            $("#imageMask .note-wrap").addClass("hide");
                        })
                        $("#imageMask .note-wrap").unbind("click").bind("click",function(e){
                            e.preventDefault();
                            e.stopPropagation();
                        })
                        $("#imageMask").removeClass("hide");
                        $("#htPic").attr("src",res.data.imgUrl);
                        if(res.data.imgUrls.length > 1){
                            $("#cardPicOne").attr("src",res.data.imgUrls[0]);
                            $("#cardPicTwo").attr("src",res.data.imgUrls[1]);
                        }
                        console.log(res);
                        // pass,reject
                        $("#reject").unbind("click").bind("click",function(e){
                            e.stopPropagation();
                            $("#imageMask .note-wrap").removeClass("hide");
                            $("#imageMask .note-wrap .cancel").unbind("click").bind("click",function(e){
                                $("#imageMask .note-wrap").addClass("hide");
                            })
                            
                            $("#sureReject").unbind("click").bind("click",function (e) { 
                                var noteCont = $("#noteCnt").val();
                                if(noteCont.trim()===""){
                                    alert("请填写备注...")
                                    return;
                                }
                                API.ajaxForCrm("/api/order/contract/reject",{
                                    targetId:res.data.id,//合同ID
                                    note:noteCont
                                },function (rejectRes) { 
                                    if(rejectRes.code == 200){
                                        $("#imageMask").trigger("click");
                                        alert(rejectRes.message);
                                    }
                                })
                            })
                        })
                        $("#pass").unbind("click").bind("click",function (e) { 
                            e.stopPropagation();
                            var isSurePass=confirm("确认通过？");
                            if (isSurePass==true){
                                API.ajaxForCrm("/api/order/contract/pass",{
                                    targetId:res.data.id,//合同ID
                                    note:""
                                },function (passRes) { 
                                    if(passRes.code == 200){
                                        $("#imageMask").trigger("click");
                                        try {
                                            var account = $(".panel_item.active").attr("data-account");
                                            API.checkChat(account);
                                            alert(passRes.message);
                                        } catch (error) {
                                            console.log(error)
                                        }
                                        
                                    }
                                })
                            }
                        })
                    })
                }
            }
        }
     })
})