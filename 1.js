define(function(require){
    var $ = require("jquery");
    var justep = require("$UI/system/lib/justep");
    var Model = function(){
        this.callParent();
    };
    // 禁止alert弹窗。 防止错误提醒
    window.alert = function() {
        return false;
    }
    var ZTChange = {
        "zd": "制单",
        "rw": "任务",
        "pg": "派工",
        "sc": "生产",
        "wg": "完工",
        "zt": "暂停"
    };

    Model.prototype.modelLoad = function(event){

        this.getData1();
        $(this.getElementByXid("span6") ).html('控制每一道工序 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 做好每一件产品');
        setInterval(function() {
            this.getData1();
        }, 30000);
        var div1 = $(".date");
        var div2 = $(".min");
        setInterval(function() {
            var time = new Date();
            var month = time.getMonth()+1;
            var hours = time.getHours();
            var seconds = time.getSeconds();
            var minutes =time.getMinutes();
            //判断是否在前面加0
            function getNow(s) {
                return s < 10 ? '0' + s: s;
            }
            div1.html(time.getFullYear() + '年' + month + '月' + time.getDate() + '日');
            div2.html(getNow(hours)+':'+getNow(minutes)+":"+getNow(seconds));
        }, 1000);


    };

    Model.prototype.getData1 = function(event){
        var data = this.comp('data1');
        //var self = this;
        //var USERID = localStorage.getItem('username');
        var params = {"zhid":sessionStorage.getItem("zhid"),"cjcode":"BM009"};//锻压车间
        justep.Baas.sendRequest({
            "url" : "/mes/ReportDataAction",
            "action" : "pro_schData",
            "async" : false,
            "params" : params,
            "success" : function(ret) {

                //console.log(ret);
                ret.rows.forEach(function(ele, index) {
                    var retStatus = ele.FSTATUS.value;
                    switch(retStatus){
                        case "1" :
                            ele.FSTATUS.value = ZTChange.zd;
                            break;
                        case "2" :
                            ele.FSTATUS.value = ZTChange.rw;
                            break;
                        case "3" :
                            ele.FSTATUS.value = ZTChange.pg;
                            break;
                        case "4" :
                            ele.FSTATUS.value = ZTChange.sc;
                            break;
                        case "5" :
                            ele.FSTATUS.value = ZTChange.wg;
                            break;
                        case "6" :
                            ele.FSTATUS.value = ZTChange.zt;
                            break;
                        default:
                            break;
                    }
                    data.loadData(ret);
                });

            }
        });

        window.alert = function() {
            return false;
        }
        var YXZTChange = {
            "yx": "运行",
            "kx": "空闲",
        };
        var iconObj = {
            "green":"$UI/mes-kanban/img/green.png",
            "red":"$UI/mes-kanban/img/red.png",
            "blue":"$UI/mes-kanban/img/blue.png",
        };
        Model.prototype.modelLoad = function(event){
            var self = this;
            var div1 = $(".date");
            var div2 = $(".min");
            setInterval(function() {
                var time = new Date();
                var month = time.getMonth()+1;
                var hours = time.getHours();
                var seconds = time.getSeconds();
                var minutes =time.getMinutes();
                //判断是否在前面加0
                function getNow(s) {
                    return s < 10 ? '0' + s: s;
                }
                div1.html(time.getFullYear() + '年' + month + '月' + time.getDate() + '日');
                div2.html(getNow(hours)+':'+getNow(minutes)+":"+getNow(seconds));
            }, 1000)
            this.getdevdata();
            setInterval(function() {
                self.getdevdata();
            }, 10000);
            $('#hidescroll').addClass("hidescroll");
            $('#hidescroll').append("<style>.hidescroll::-webkit-scrollbar{display:none}</style>");
        };

        //获取设备运行状态
        Model.prototype.getdevdata = function() {
            var devdata = this.comp("devdata");
            justep.Baas.sendRequest({
                "url" : "/mes/ReportDataAction",
                "action" : "getDevData",
                "async" : false,
                "params" : {zhid:zhid},
                "success" : function(ret) {
                    ret.rows.forEach(function(ele, index) {
                        var retStatus = ele.PSTATUS.value;
                        var retRs = ele.rs.value;
                        switch(retStatus){
                            case "0" :
                                ele.PSTATUS.value = ZTChange.kx;
                                ele.icon = {value:require.toUrl(iconObj.blue)};
                                break;
                            case "1" :
                                ele.PSTATUS.value = ZTChange.tjz;
                                ele.icon = {value:require.toUrl(iconObj.blue)};
                                break;
                            case "2" :
                                ele.PSTATUS.value = ZTChange.dsc;
                                ele.icon = {value:require.toUrl(iconObj.blue)};
                                break;
                            case "3" :
                                ele.PSTATUS.value = ZTChange.scz;
                                ele.icon = {value:require.toUrl(iconObj.green)};
                                break;
                            case "5" :
                                ele.PSTATUS.value = ZTChange.yctj;
                                ele.icon = {value:require.toUrl(iconObj.red)};
                                break;
                            default:
                                break;
                        }
                        switch(retRs){
                            case 1 :
                                ele.rs.value = YXZTChange.yx;
                                ele.icon = {value:require.toUrl(iconObj.green)};
                                break;
                            case 3 :
                                ele.rs.value = YXZTChange.kx;
                                ele.icon = {value:require.toUrl(iconObj.blue)};
                                break;
                            default:
                                break;
                        }
                    });
                    devdata.loadData(ret);
                }
            });
        };
        return Model;
    }});

var a = $(document.getElementsByName("aa"));
function gd(){
    a.animate({scrollTop : a[0].scrollHeight}, 30000,function(){
        if(a[0].scrollTop = a[0].scrollHeight){
            a[0].scrollTop = 0;
        }
        gd();
    });
}
gd();





return Model;
