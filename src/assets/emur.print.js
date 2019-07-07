(function ($,document) {
var printCookieName='remote_print_ip_',
pathName=window.document.location.pathname,
projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1),
_printBaseOpts = {//打印基本参数
	ip : '127.0.0.1',
	port:'8008',
	printer:'defalut',  //打印机名称 'AGFA-AccuSet v52.3' 'ZDesigner GK888t'
	preview:false,      //是否预览，只有网页打印支持预览，直接打印没有预览
	portrait:'1',		//打印方向  1：横向 其它：纵向
	pagetype:'defalut',      //纸张类型  如 A4  A3 tmdy_5*3 等 A4,A3这种默认的纸张可以不传宽，高,其它认为是自定义纸张 
	//pagewidth:210,		//自定义纸张 宽度  RAW(printtype=1)方式时也用这个 单位mm
	//pageheight:297,     //自定义纸张 高度	
	printtype:'2',		//打印类型 1：RAW 直接打印 2：网页打印
	printinfo:'默认打印内容',  // 打印内容  $(".datagrid-view").getPrintArea() //
	showContent:false    //是否先显示内容
},_windowBaseOpts = {//打开窗口的基本参数
	title: '窗口',
	width: 400,
	hight:200,
    iconCls: 'icon-edit',
    closed: true,
    modal: true,//定义窗口是否带有遮罩效果
    inline: false,//定义如何布局窗口，如果设置为true，窗口将显示在它的父容器中，否则将显示在所有元素的上面；默认false；
    shadow: false,//如果设置为true，显示窗口的时候将显示阴影;默认true；
    minimizable: false,
    maximizable: false,
    collapsible: false,
    inContainer: true
},_pagetypes = {
	a4:{pagewidth:210,pageheight:297},
	a3:{pagewidth:297,pageheight:420}
};
//增加打印插件	
emur.print={
	print_type:undefined,//打印类型  默认为条码打印
	pre_opts:undefined,//上一次的请求打印参数
	init:function(args){
		if(typeof args == "string"){
			this.print_type = args;
		}else if(typeof args== "object"){
			this.print_type = args.print_type;
		}
	},
	/**
	 * 远程打印服务
	 * options 请求参数
	 * success 成功回调函数
	 * error   失败回调函数
	 */
	remotePrint:function(opts,success,error){
	   if(!_checkOpts(opts)){
		   return false;
	   }
	   //alert(JSON.stringify(opts));
	   //opts.preview = true;
	   if(opts.showContent&&!opts.preview){
		   _openPreviewWindow(opts);
		   return false;
	   }
	   //初始化是否回调的值
	   var hasCallback = false;
	   //远程的打印服务如果没有打开   ajax请求不能捕捉到错误  所以这里做一个超时的处理
	   setTimeout(function(){
		   if(!hasCallback){
			   $.messager.show({showSpeed:1000,msg:'打印超时,请检查选择的打印机服务是否开启！',timeout:2000,showType:'fade'});
			   emur.print.openPrintCfgWin();
		   }
	   },5000);
	   $.ajax({				              
	        type:'post',   	                
			url: _bulidUrl(opts),
			data: opts,			    			
			dataType: "jsonp",	      //跨域访问 
			crossDomain: true,   			    			 			    											
		    contentType: "application/json;charset=utf-8", //必须有			    			
			async:false,  //(默认: true) 默认设置下，所有请求均为异步请求。
			success:function(data, status){ 
				hasCallback = true;
			    if($.isFunction(success)){
				  success.call(this,data,status);
			    }else{
			      var msg = data.message;
			      if(status=='success'){
			    	  //成功的提示
			    	  msg = '<div style="margin-left:85px;margin-top:10px;"><b>打印成功！</b></div>';
			      }
	        	  $.messager.show({showSpeed:1500,msg:msg,timeout:2000,showType:'fade'});
			    }
	        },    
	        error: function(XMLHttpRequest, textStatus, errorThrown) {
	        	hasCallback = true;
			    if($.isFunction(error)){
				    error.call(this,XMLHttpRequest, textStatus, errorThrown);
			    }else{
	        	    $.messager.show({showSpeed:1500,msg:errorThrown,timeout:2000,showType:'fade'});
			    }
	        }
	   });
	},
	//获取cookie
	getPrintCookie:function(){
		var ret = undefined;
		if(this.print_type==undefined){
			$.messager.alert("提示","请先对打印插件初始化,调用init方法！"); 
			return false;
		}
		var client_print_info = $.cookie(printCookieName+this.print_type);
	    if(client_print_info){
	       ret = {};
		   var ary = client_print_info.split("_");
		   //设置ip和打印机名称
		   ret.ip = ary[0];
		   ret.printer = ary[1];
	    }
		return ret;
	},
	//设置打印的cookie
	setPrintCookie:function(ip,name){
		if(this.print_type==undefined){
			$.messager.alert("提示","请先对打印插件初始化,调用init方法！"); 
			return false;
		}
		var invalidDate = new Date();
		//100年后失效
		invalidDate.setTime(invalidDate.getTime() + (100 * 365 * 24 * 60 * 60 * 1000));
		//把打印机ip和名字存储cookie
		var val = ip+'_'+name;
		//设置cookie
		$.cookie(printCookieName+this.print_type,val, {path:projectName,expires: invalidDate}); 
	},
	//删除打印的cookie
	delPrintCookie:function(){
		if(this.print_type==undefined){
			$.messager.alert("提示","请先对打印插件初始化,调用init方法！"); 
			return false;
		}
		$.cookie(printCookieName+this.print_type,null,{path:projectName,expires:-1}); // 删除 cookie
	},
	bulidOpts:function(cont,opts){
	   var baseOpts = $.extend({}, _printBaseOpts); 
	   try{
		   //使用正则获取打印信息   这个配置用隐藏input的方式写在模板中
		   var rg = new RegExp("<input\\s*id=\\s*([\"'])printInfo\\s*([\"'])([^<]*)>(.*)</input>", "i"),  
		   rgAtt = new RegExp("([a-z]+)\\s*=\\s*([\"'])([^\"']*)\\2", "i");
		   var match = rg.exec(cont);
		   if (match) {
			   var attStr = match[0];
			   while (rgAtt.test(attStr)) {
				   if('id'!=RegExp.$1&&'type'!=RegExp.$1&&'null'!=RegExp.$3&&''!=RegExp.$1){
					   baseOpts[RegExp.$1]=RegExp.$3
				   }
				   attStr = RegExp.rightContext;
			   }
		   }
		   //去除initPrint和SetPrintSettings方法
		   //var reg=new RegExp("((initPrint\(\))|(SetPrintSettings\(\)));?(?!\s*\{.*\})","g");
		   //cont=cont.replace(reg,"");
		   //去除打印内容里面的函数
		   cont = cont.replaceAll("(?i)(<SCRIPT)[\\s\\S]*?((</SCRIPT>)|(/>))", "")
	   }catch(e){/*这里只是防止出错  不做处理 */}
	   //假如传入了打印类型  则用传入的打印类型
	   if(opts.print_type){
		   this.print_type = opts.print_type;
	   }
	   //根据打印类型获取cookie中存的ip地址和名称
	   var client_print_info = this.getPrintCookie();
	   if(client_print_info){
		   //设置ip和打印机名称
		   baseOpts.ip = client_print_info.ip;
		   baseOpts.printer = client_print_info.printer;
	   }
	   //复制用户自定义参数
	   var retopts = $.extend({}, baseOpts, opts?opts:{}); 
	   //把打印内容组进参数
	   retopts.printinfo = cont;
	   return retopts
	},
	//打开打印配置窗口
	openPrintCfgWin:function(){
		var id = "print_cfg_window";
		if(!$("#"+id).attr("id")){
			var winDiv = '<div id="'+id+'"></div>';
			$('body').append(winDiv);
		}
		var url = projectName+'/cssd/dy/printCfg.jsp';
		if(this.print_type){
			url = url+"?print_type="+this.print_type
		}
    	var windowOpts = {
    		id:id,
    		url:url,
        	title: '打印配置',
        	width: 400,
            height: 200,
            onClose:function(){
            	//解除右键菜单绑定
            	$(document).unbind("contextmenu");
            }
        }
    	_openWindow(windowOpts);
	}
}
//===================私有方法开始================
//验证参数
function _checkOpts(opts){
	if($.string && !$.string.isIPv4(opts.ip)){
	   $.messager.alert("提示","请使用正确的ip地址！"); 
	   return false;
	}
	return true;
}
//组装url
function _bulidUrl(opts){
	return 'http://'+opts.ip+':'+opts.port+'/print';
}
//打印debug信息
function _debug() {    
	var msg;
    if (window.console && window.console.log&&arguments.length>0){
    	if(typeof arguments[0] === 'string'){
    		msg = arguments[0];
    	}else if(typeof arguments[0] === 'object'){
    		msg = JSON.stringify(arguments[0]);
    	}
    	window.console.log('===debug:'+msg+'===');    
    }   
};
//打开预览页面
function _openPreviewWindow(opts,success,error){
	var id = "print_preview_window";
	if(!$("#"+id).attr("id")){
		var winDiv = '<div id="'+id+'"></div>';
		$('body').append(winDiv);
	}
	var height = $('body').height();
	var windowOpts = {
    		id:id,
    		width:500,
    		height:height,
    		left:window.screen.width/2,
        	title: '打印预览', 
    	    tools: [{    
    		    iconCls:'icon-print',    
    		    handler:function(){
    		    	opts.showContent = false;
    		    	$("#"+id).window('close'); 
    		    	emur.print.remotePrint(opts,success,error);
    		    }    
    		  },'-'],
            onBeforeOpen:function(){
            	if(opts&&opts.printinfo){
            		$("#"+id).html(opts.printinfo);
            	}
            }
     }
     _openWindow(windowOpts);
}

function _openWindow(opts){
	var windowOpts =  $.extend({}, _windowBaseOpts, opts?opts:{}); 
	$("#"+windowOpts.id).empty();   //先清空
	$("#"+windowOpts.id).window(windowOpts);
	$("#"+windowOpts.id).load(windowOpts.url);
	$("#"+windowOpts.id).window('open');  // 打开窗口
}

$(function(){
	//设置一个定时任务   防止打印按钮还没加载好  会被easyui给冲掉
	setTimeout(function(){
	   //绑定右键开启打印配置窗口
	   if($(".icon-print")){
		   $(".icon-print").parent().attr("title","右键打印按钮进行打印配置！").mousedown(function(e){ 
		          if(3 == e.which){ 
		        	  //屏蔽整个页面的右键菜单事件
			     	  $(document).bind('contextmenu',function(e){
			    		 return false;
			          });
			     	  //打开打印配置窗口
		        	  emur.print.openPrintCfgWin();
		          }
			}) 
	   }
	},1000);
})

//===================私有方法结束================
})(jQuery,document);