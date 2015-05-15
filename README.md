#iTorrJS v2 说明

iTorr这个JS封装 是我在项目中常常要用到的函数封装 在大部分情况下推荐使用**原生实现**
配合 **iTorrCSS** 使用最佳

最新版抛弃了IE8-的支持，在IE8-下推荐使用原生或其他框架

> DOM操作函数可以像jQuery一样链式编程



##选择器 

选择器封装了新的方法 依据CSS选择器规范
实现了获取单DOM(querySelector)以及多个DOM(querySelectorAll)的情况


###获取 #abc

    $('#abc')

###获取 body

    $('body')

###获取全部的 li标签

    $$('li')

###获取全部的 `.ul-li class`

    $$('.ul-li')

###复杂一点的

    $$('#main>p .show')


##AJAX JSON-P LoadJS/CSS 

重点部分在于AJAX函数和Load函数，在这两个函数里，iTorrJS全局缓存了加载过的数据到当前浏览器进程，在单页面应用中 再次打开相同页面时，会直接将数据交给回调函数，具体表现就是载入打开过的页面时只需要js运算以及DOM渲染时间。

> 非单页应用可以配合 本地存储 $.stor 将多复用数据缓存到本地，在再次加载时重新释放到浏览器进程 实现数据缓存(需单独实现数据更新)

##$.x(url,POSTdata?,func?,err?) //AJAX函数 GET、POST


###首先请求一份文本内容
GET请求 1.txt 并将 文本内容 返回到控制台

    $.x('1.txt',function(r){
    	console.log(r);
    });

###再来尝试请求一份JSON数据
GET请求 1.json 并将 JSON数据 返回到控制台

    $.x('1.json',function(r){
    	console.log(r);
    });

在这里对于文本和JSON是在一样的参数上实现的，具体的判定需要服务器配合 返回 Content-Type JSON头
否则将统一返回文本内容

###再来一段POST提交

    $.x('login','id=itorr&password=12345',function(r){
    	console.log(r);
    });

将参数2变成POST内容即实现POST提交～ 这里可以提交不仅只文本数据 也可以是file 也可以是二进制

###如果在网络不佳的情况，我们需要对AJAX进行错误处理

    $.x('1.txt',function(r){
    	console.log(r);
    },function(){
    	/*相应的错误处理*/
    });

在回调函数后面再跟着一个函数即为出错时调用

## $.j(url,func?,err?) //加载CSS 加载JS JSON-P回调
    /*在这两个函数里实现了在当前浏览器进程内的数据缓存*/

###加载JS文件到DOM 并运行

    $.j('http://baidu.com/tongji.js');

###加载JS文件到DOM 并运行之后运行回调函数

    $.j('http://baidu.com/tongji.js',function(){
    	/*加载运行完JS 运行这行代码*/
    });

###添加CSS文件到DOM 并应用样式

    $.j('http://baidu.com/flower.css');

###添加CSS文件到DOM 并应用样式之后运行回调函数

    $.j('http://baidu.com/flower.css',function(){
    	/*添加CSS文件到DOM 并应用样式 运行这行代码*/
    });

###通过JSON-P(可跨域)获取一段数据

    $.j('http://baidu.com/user?callback={cb}',function(data){
    	console.log(data);
    });

url中 callback字段请用 `{cb}` 替代

##通过JSON-P(可跨域)获取一段数据 容错

    $.j('http://baidu.com/user?callback={cb}',function(data){
    	console.log(data);
    },function(){
    	alert('出错了！！！');
    });

###添加HTML模块到`document.body` 运行第一个出现的 `<script>`到`</script>` 之间的代码

    $.j('i/m/hallo.html');

###添加HTML模块到 #abc

    $.j('i/m/hallo.html',$('#abc'));



##D.x(url) //获取xhr 写入DOM innerHTML 
 对DOM的封装，简单的AJAX函数

###将 1.txt 中的内容插入到 #abc

    $('#abc').x('1.txt');


###POST user.php 并将内容写到#abc

    $('#abc').x('user.php','type=admin');


###载入 1.txt 通过预处理函数替换文字 abc 成 123 写到 #abc

    $('#abc').x('1.txt'，function(r){
    	return r.replace(/abc/g,'123')
    });

##CSS
操作内联css的函数没有和jQuery以及其他框架一样实现的复杂、难用、缓慢。
和选择器一样，按照CSS语言写法传参即可 浏览器私有参数同样可以传参

iTorrJS中动画过程使用CSS3缓动实现，配合操作元素class 或者修改内联样式实现


##D.css(text?) //设置、获取标签内联样式

> 能使用增减class实现的效果尽量不用设置内联实现

###给 `$('#abc')` 设置 红色文字颜色

    $('#abc').css('color:red');

##D.hide(延时) //隐藏元素
隐藏某标签，以CSS3动画的形式
###隐藏 `$('#abc')` 

    $('#abc').hide();
    
###一秒后隐藏 `$('#abc')` 

    $('#abc').hide(1000);
    
> 需设置CSS `.h` 进行配合
##D.show(延时) //显示元素
###显示 `$('#abc')` 

    $('#abc').show();
    

###一秒后显示 `$('#abc')` 

    $('#abc').show(1000);
    
> 需设置CSS `.h` 进行配合

##DOM操作
封装了几个常用但不好用的DOM操作
函数会返回DOM元素本身 更多的DOM操作请参考原生JS

##$.D(标签类型) //新建DOM

##D.add(DOM标签) //插入 参数1 到元素末尾
##D.del() //删除元素
##D.copy() //复制元素
##D.addTo(DOM标签) //插入元素到 参数1 末尾
##D.addToBefore(DOM标签) //插入元素到 参数1 开头

##D.classAdd
##D.classDel


##本地存储
封装了常用的cookie 以及HTML5本地存储

##$.cookie //读取、设置 cookie
##$.stor //读取、设置 stor

##格式化
封装了几个项目常用格式化函数

##N.reDate //格式显示时间
##S.enTxt //转码防止XSS
##S.enHtml //格式化链接 图标 等


##杂类

##O.each、A.each
##$.swf //获取 flash 标签(需HTML配合) 方便AS/JS交互

##D.setSubmit(url?,func,err) //绑定默认表单事件 +验证 +AJAX




