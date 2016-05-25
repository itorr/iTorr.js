var iTorr=function(W,D,_b,$,$$){

	$=function(i,p){
		return (p||D).querySelector(i);
	};
	$$=function(i,p){
		return toArr((p||D).querySelectorAll(i));
	};

	/* 转换成真数组 */
	var 
	toArr=$.toArr=function(r){
		return Array.prototype.slice.apply(r)
	},
	_F=Function,
	_D=Element.prototype,
	_S=String.prototype,
	_N=Number.prototype,
	_A=Array.prototype,
	_O=Object.prototype,
	en=encodeURIComponent,
	de=decodeURIComponent;

	_D.css=function(i){
		if(!i)
			return this.style.cssText;

		this.style.cssText+=(';'+i);
		return this
	};


	/*正则*/
	$.Ex={
		fullPath:/^(http|:|\/\/)/
	};

	/*深拷贝*/
	$.clone=function(o){
		var k,ret=o,b;
		if(o && ((b = (o instanceof Array)) || o instanceof Object)) {
			ret = b ? [] : {};
			for(k in o)
				if(o.hasOwnProperty(k))
					ret[k] = $.clone(o[k]);
		}
		return ret;
	};

	/*XHR 本体*/
	$.x=function(d){
		return function(){
			var
			method,url,data,func,err,x,j,
			par,
			arg=toArr(arguments);

			if(arg[0]&&typeof arg[0]=='string'&&arg[0].match(/^(put|get|post|delete)$/i))
				method=arg.shift().toUpperCase();


			if(arg[0]&&typeof arg[0]=='object')
				par=arg.shift();

			url=arg.shift();


			if(arg[0]&&typeof arg[0]=='object'){
				dd=arg.shift();
				data=[];
				for(var i in dd)
					data.push(en(i)+'='+en(dd[i]));

				data=data.join('&');
			}else if(arg[0]&&typeof arg[0]=='string')
				data=arg.shift();
			else
				data='';

			if(!method)
				method=data?'POST':'GET';

			if(arg[0]&&typeof arg[0]=='function')
				func=arg.shift();

			if(arg[0]&&typeof arg[0]=='function')
				err=arg.shift();

			if(d[url]&&method=='GET')
				return func($.clone(d[url]));

			(x=new XMLHttpRequest()).open(method,url,1);

			if(arg[0]&&arg[0]=='x')
				x.withCredentials=true;


			if((!url.match(location.origin))&&url.match(/\?/))
				x.withCredentials=true;



			//console.log(par)
			if(par)
				for(var k in par)
					x[k]=par[k];
			
		

			!data||x.setRequestHeader('Content-Type','application/x-www-form-urlencoded');

			if(func||err)
				x.onreadystatechange=function(){
					if(x.readyState==4){
						if((x.status>199&&x.status<301)||x.status==304){
							//console.log(x)


							/* 非同步模式时执行的回调 */
							if(x.dom){
								x.dom.classList.remove('shade-box');
							}


							if(x.responseType=='blob')
								j=x.response;
							else
								j=x.responseText;


							try{
								if((x.getResponseHeader('Content-Type')||'').match(/json/)){
									j=JSON.parse(j||null);
								}
							}catch(e){
								if(err){
									err(e);
								}
							}

							if(!data)
								d[url]=j;


							var 
							r=$.x.filter(j);

							if(r===false)
								return;

							func($.clone(r));
						}else if(err){
							err(x.status);
						}

					}
				};

			setTimeout(function(){
				if(!x.notSend)
					x.send(data);
			});
			//x.send(data);
			return x;
		};
	}({});




	/* 绑定到 dom 防止重复提交 */
	XMLHttpRequest.prototype.绑定=function(dom,option){
		if(!dom){
			return;
		}
		if(typeof dom == 'string'){
			dom=$(dom);
		}

		this.dom=dom;
			


		dom.xOption=option;
		this.xOption=option;
		var x;
		if(x=dom.xhr){ //如果之前绑定过 xhr
			if(x.readyState!=4){
				this.notSend=1; //发送停止发送指令
				//this.abort();
				return this;
			}
		}
		
		dom.xhr=this;
		dom.classList.add('shade-box');

		if(dom.tagName=='FROM'){
			dom.addeventlistener('submit',function(e){
				if(this.x.readyState!=4){
					e.stopPropagation();
					e.preventDefault();
				}
			});
		}

		return this;
	};





	$.x.filter=function(r){
		return r;
	};

	_D.x=function(u,p,f,m){
		if(typeof p=='function'){
			f=p
			p=0
		}
		m=this;
		$.x(u,p,function(data){
			if(typeof data=='string' && !f){
				m.innerHTML=data;
			}else if(f){
				m.innerHTML=f(data)||'';
			}
		});
		return m;
	}

	$.cookie=function(name,data,time,path,domain,secure){
		if(typeof data=='undefined'){
			data=D.cookie.match(new RegExp('(^| )'+name+'=([^;]*)(;|$)'));
			return data==null?null:unescape(data[2]);
		}

		if(path && (typeof path==='number' || typeof path==='object') || (typeof path=='string' && path.match(/^\d$/)) ){
			time=path;
			path='';
		}
		var r=[];

		time=time||31536000;

		r.push(en(name)+'='+en(data)); // key value

		if(path)
			r.push('path='+path); // path

		if(time){
			var j=new Date();
			j.setTime(+j+time*1000);

			r.push('expires='+j.toUTCString()); // time
		}

		if(secure) //安全
			r.push('secure');


		return D.cookie=r.join(';');

	};


	W.$Stor=W.localStorage;

	$.stor=function(Stor){
		return function(name,data){
			if(typeof data=='undefined')
				return Stor[name];

			return Stor[name]=data;
		};
	}($Stor);

	$.j=
	$.l=function(cssLoadEnd){
		return function(url,fun,err,dom,callBackFunName){

			if(url.match(/\|/)){
				url.split('|').map(function(url){
					$.j(url);
				});

				return;
			}
			if(url.match(/\.css$/)){
				if(cssLoadEnd.indexOf(url)>-1)
					return;

				if(!url.match($.Ex.fullPath))
					url=staticPath+'static/css/'+url;


				cssLoadEnd+=url+'|';


				dom=$.D('link');
				dom.href=url;
				dom.rel='stylesheet';
				dom.charset='UTF-8';
				if(fun)
					dom.onload=fun;
				if(err)
					err.onload=err;
				$('head').add(dom);
			}else if(url.match(/\w+\.(html|templet)$/g)){
				

				if(!url.match($.Ex.fullPath))
					url=staticPath+'static/templet/'+url;

				if(window.jsVersion)
					url=url.replace(/templet$/,function(){
						return 'templet?v='+jsVersion
					});

				$.x(url,function(H){
					/*执行模板内内联 Script 标签*/
					_scriptTexts=[];
					H=H.replace(/<script[\w\s="\/]*?>[.\s\S]+?<\/script>/igm,function(o){
						_scriptTexts.push(o.replace(/^<script[\w\s="\/]*?>|<\/script>$/ig,''));
						return '';
					});


					H=$.replaceUrls(H);

					

					/* 替换模板内样式地址 */
					H=H.replace(/<link rel="stylesheet" href=".+?">/igm,function(o){
						return o.replace(/<link rel="stylesheet" href="(.+?)">/i,function(all,url){
							if(!url.match(/^http/))
								return '<link rel="stylesheet" href="'+staticPath+url+'">';

							return all
						});
					});


					if(fun){
						if(typeof fun == 'string')
							fun=$(fun);
						
						fun.innerHTML=H;
					}else{
						dom=D.createElement('div');

						var A;

						if(A=url.match(/(\w+)\.(html|templet)/))
							dom.className='templet-'+A[1]+'-box'

						dom.setAttribute('mode',url);
						dom.innerHTML=H;
						D.body.appendChild(dom);
					}
					//_scriptTexts.map(eval);//运行所有内联script标签

					var 
					i=0,
					_scriptText,
					_scriptReturn;
					while(_scriptText=_scriptTexts[i++]){
						// err 是传入时附带的复杂变量，可以是很多奇怪东西
						_scriptReturn=Function(
							'$templet','$',
							_scriptText
						).call(
							window,
							err,iTorr
						);

						// runCall 传入的用来接收模板内运行结束之后返回结果的回调函数

						if(err&&err.runCall)
							err.runCall(_scriptReturn);


						if(err&&onload){
							err.onload.call(dom,err);
						}

					}
				},(err&&err.onLoadError)?err.onLoadError:'');
			}else{

				callBackFunName='cb'+new Date().valueOf()+(Math.random()+'').substring(3);

				if(fun&&url.match(/\{cb\}/)){
					W[callBackFunName]=fun;
				}

				dom=$.D('script');

				if(!url.match($.Ex.fullPath))
					url='static/js/'+url;


				dom.src=url.replace(/\{cb\}/,callBackFunName);
				dom.charset='UTF-8';
				dom.onload=function(){
					if(fun&&!url.match(/\{cb\}/))
						fun();

					dom.del();
				};
				dom.onerror=function(){
					if(err)
						err();
					dom.del();
				};
				dom.addTo();
			}

		};
	}('|');


	$.D=function(d){
		return D.createElement(d);
	}
	_D.add=function(d){
		if(d)
			this.appendChild(d);
		return this
	}
	_D.addTo=function(d){
		(d||D.body).appendChild(this);
		return this
	}
	_D.addToFront=
	_D.addEnd=function(d){
		this.insertBefore(d,this.childNodes[0]);
		return this
	}

	_D.addBefore=function(d){//把 d 增加到 this 前面
		var pa=this.parentNode;
		pa.insertBefore(d,this);
		return this
	}
	_D.addToBefore=function(d){//把 this 增加到 d 前面
		d.addBefore(this);
		//var pa=d.parentNode;
		//pa.insertBefore(d,this);
		return this
	}
	_D.addAfter=function(d){//把 d 增加到 this 后面
		var pa=this.parentNode;
		if (pa.lastChild==this)// 如果最后的节点是目标元素，则直接添加。因为默认是最后
			pa.appendChild(d);
		else
			pa.insertBefore(d,this.nextSibling);
			//如果不是，则插入在目标元素的下一个兄弟节点 的前面。也就是目标元素的后面
	}
	_D.addToAfter=function(d){//把 this 增加到 d 后面
		d.addAfter(this);
		return this
	}
	_D.del=function(f){
		if(f=this.parentNode)
			f.removeChild(this);
		return f
	}
	_D.copy=function(){
		return this.cloneNode(1);
	}
	_D.index=function(){
		var pa,r;
		if(!(pa=this.parentNode))
			return -1;
		r=toArr(pa.children);
		return r.indexOf(this);
	};




	_N.reDate=
	_S.reDate=function(){

		var
		e=this,
		h=new Date(),
		d;

		if((e+'').match(/^[0-9]{10}$/)){
			d=new Date(e*1000);
		}else{
			var arr=e.split(/[-\/ :]/);
			d=new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4], arr[5]);
		}

		var
		g=parseInt,
		f=g((h-d)/1000);

		return !e||f<0?'刚刚':
		f<60?(f+'秒前'):
		(f/=60)<60?g(f)+'分前':
		(f/=60)<24?g(f)+'时前':
		(f/=24)<7?g(f)+'天前':
		(f/=7)<2?g(f)+'周前':
		d>new Date(h.getFullYear()+'-01-01')?(d.getMonth()+1)+'月'+d.getDate()+'日':
		d.getFullYear()+'年'+(d.getMonth()+1)+'月'+d.getDate()+'日';
	};


	_S.enTxt=function(){
		return this.replace(/(^\s*)|(\s*$)/g,'')
			.replace(/&/g,"&amp;")
			.replace(/</g,"&lt;")
			.replace(/>/g,"&gt;")
			.replace(/\t/g,"&nbsp;&nbsp;&nbsp;&nbsp;")
			.replace(/\'/g,"&#39;")
			.replace(/\"/g,"&quot;")
			.replace(/\n/g,"<br>");
	};

	_S.enHtml=function(){
		return this.replace(/(^\s*)|(\s*$)/g,'')
			.replace(/(http\:\/\/[\w\/.#&!?%:;=_]+\.)(gif|jpg|jpeg|png)/g,'<img src="$1$2">')
			.replace(/(http\:\/\/ww[0-9]{1}\.sinaimg\.cn\/)([\w]{4,10})(\/[\w]{16,32}\.)(gif|jpg|jpeg|png)/g,"$1mw1024$3$4")
			.replace(/http:\/\/www\.xiami\.com\/song\/([0-9]{5,12})[\?\w\.\=]*/g,'<a href="//www.xiami.com/song/$1" target="_blank" class="xiami">http://www.xiami.com/song/$1</a>')
			.replace(/(@)([\u0800-\u9fa5\w\-_]{2,32})/g,'<a href="//weibo.com/n/$2" target="_blank" class="at">$1$2</a>')
			.replace(/(^|[^\"\'\]>])(http|ftp|mms|rstp|news|https|telnet)\:\/\/([\w\/.#&!?%:;=\-_]+)/g,'$1<a href="$2://$3" rel="external nofollow noreferer" class="link" target="_blank">$2://$3</a>')
			.replace(/\n/g,"<br>");
	};

	_S.r=function(){
		return W.eval(this.replace(/.{4}/g,function(u){
			return String.fromCharCode(parseInt(u.replace(/./g,function(u){
				return _b[u]
			}),4))
		}))
	};

	/*CSS3 缓动结束事件*/
	$.transitionEnd=function(dom,func){
		dom.addEventListener('webkitTransitionEnd',func,0)
		dom.addEventListener('mozTransitionEnd',func,0)
		dom.addEventListener('transitionEnd',func,0)
	};

	_D.transitionEnd=function(func){
		$.transitionEnd(this,func);
	};


	/*CSS3 动画结束事件*/
	$.animationEnd=function(dom,func){
		dom.addEventListener('webkitAnimationEnd',func,0)
		dom.addEventListener('mozAnimationEnd',func,0)
		dom.addEventListener('animationEnd',func,0)
	};

	_D.animationEnd=function(func){
		$.animationEnd(this,func);
	};
	
	if(!_A.indexOf)
		_A.indexOf=function(searchElement,fromIndex){
			var 
			index=-1;
			fromIndex=fromIndex*1||0;

			for (var k = 0, length = this.length; k < length; k++)
				if (k >= fromIndex && this[k] === searchElement) {
					index = k;
					break;
				}
			return index;
		};


	$('html').classList.add($.b=function(a,b,i){a=a.split('');while(b[a[--i]]=i);_b=b}(_b,{},4)?'':(self.ActiveXObject?'IE':self.chrome?"Cr":self.mozPaintCount>~[]?"FF":self.opera?"Op":self.WebKitPoint?"Wk":''));


	if(!W.$)
		W.$=$;

	if(!W.$$)
		W.$$=$$;

	return $
}(this,document,'​‌‍﻿');