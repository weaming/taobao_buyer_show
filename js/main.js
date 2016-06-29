var __n = 1,
	__max = 1,
	__timeout = 1000 * 60 * 5,
    __API = ["https://api.bitsflow.org/api/buyershow"],
    __title = getUrlParam('t');

if (__title){localStorage.setItem('title'+getUrlParam('id'), __title); location.search = '?id=' + getUrlParam('id');}
if (location.port != ""){__API = ["http://localhost:5000/api/buyershow"]};

function getUrlParam(name) {
 	var reg = new RegExp("(^|&)" + name + "=(.*?)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null){return decodeURI(r[2]);}
    return '';
}

$(document).ready(function() {
	var callback = function(data, id, currtPage){
		var _type = typeof(data);
		if (_type !== 'string'){
			var _data = {};
			_data.total = data.total;
			_data.maxPage = data.maxPage;
			_data.currentPageNum = data.currentPageNum;
			_data.comments = [];
		}else{
			var _data = JSON.parse(data);
			var data = _data.data;
			var _time = _data.time;
			var time = new Date();
			time = time.getTime();
			if (time - _time > __timeout){
				localStorage.removeItem(id + '-' + data.currentPageNum);
				getData(_data.id, data.currentPageNum);
				return;
			}
			console.log('localStorage', _data)
		}
		__max = data.maxPage;
		var _key = id + '-' + data.currentPageNum;

	    if (data.comments.length < 1 && __n == 1){
	        $('.boxContainer').html("<h2>当前商品没有含有照片的评论！</h2>");
	        return;
	    }

		for (i=0;i<data.comments.length;i++){
			var obj = data.comments[i];
			var content = obj.content;

			if (_type !== 'string'){
				var _obj = {};
				_data.comments.push(_obj);
				var _photos = [];
				_obj.content = content;
				_obj.photos = _photos;
			}

			for (p in obj.photos){
				p = obj.photos[p];
				if (_type !== 'string'){_photos.push({url: p.url});}
				addImg("https:" + p.url, content);
			}
		}

		if (_type !== 'string'){
			var time = new Date();
			time = time.getTime();
            var title = localStorage.getItem('title'+id);
			_data = {
				id: id,
				time: time,
	            title: title,
				data: _data,
			}
	        console.log('_data', _data)
			localStorage.setItem(_key, JSON.stringify(_data));
            if (!title) return;

	        var DATA = {data: JSON.stringify(_data)};
	        for(i in __API){console.log(__API[i]);api_save(__API[i], DATA);}
		}
	}

	function api_save(url, data){
        if (!data.data.title){console.log('save error: no title.');return;};
	    var ajaxcb = function(response, status){console.log('save', status, response);}
	    $.post(url, data, ajaxcb);
	}

	function api_hot(url, n){
	    n = n || 10;
	    var ajaxcb = function(response, status){
	        console.log('hot', status, response);
	        if (status == 'success' && response.status == 'success'){
                $(".wrapper").append('<div class="hot-wrapper"><h4>其他人在看</h4><div class="hot"></div></div>');}
	        else return;
	        var data = response.data;
	        var html = [];
	        for (url in data) addHot(url, data[url][0], data[url][1]);
	        $(".hot").append(html.join("\n"));
	    }

	    var data = {n: n};
	    $.get(url, data, ajaxcb);
	}

	function addImg(src, content, selector){
	    selector = selector || '.boxContainer';
		var html = [];

		html.push('<div class="imgBox">');
		html.push('<a href="' + src.slice(0, -12) + '"class="fancybox" title="' + content + '">');
		html.push('<div class="img"><img src="' + src + '" alt="' + content.substr(0,70) + '"></div>');
		html.push('</a>');

		html.push('<a href="' + src.slice(0, -12) + '"class="fancybox">');
		html.push('<p>' + content + '</p>');
		html.push('</a>');
		html.push('</div>');

		$(selector).append(html.join("\n"));
	}

	function addHot(url, img, content, selector){
	    selector = selector || '.hot';
		var html = [];

		html.push('<div class="imgBox">');
		html.push('<a href="' + url + '"class="" title="' + content + '">');
		html.push('<div class="img"><img src="' + img + '" alt="' + img + '"></div>');
		html.push('</a>');

		html.push('<a href="' + url + '"class="">');
		html.push('<p>' + content + '</p>');
		html.push('</a>');
		html.push('</div>');

		$(selector).append(html.join("\n"));
	}

	var getData = function(id, currtPage){
		currtPage = currtPage || __n;
		var localData = localStorage.getItem(id + "-" + currtPage);
		// var localData = null;
		if (localData){
		    callback(localData, id, currtPage);
			return;
		}

		var commentsAPI = "https://rate.taobao.com/feedRateList.htm";
		var data = {
			"rateType": 3,
			"auctionNumId": id,
			"currentPageNum": currtPage,
			"orderType": "feedbackdate"
		};

		$.ajax({
		    url: commentsAPI,
		    // The name of the callback parameter
		    // jsonpCallback: "callback",
		    // Tell jQuery we're expecting JSONP
		    dataType: "jsonp",
		    data: data,
		    success: function( response ) {
		        console.log( 'taobao', response );
		        callback(response, id, currtPage);
		    },
		    error: function(response){
		        console.log( 'taobao_error', response );
                $('.boxContainer').html("<h2>网络错误！</h2>");
		    }
		});
	}

	// 41979357531
	var _id = getUrlParam('id');
	if (_id){getData(_id); };
	//else{$(".boxContainer").html("获取ID出错");};
    api_hot(__API[0]);

	/* This is basic - uses default settings */
	$("a.fancybox").fancybox({
		padding: 0,
		beforeLoad: function(){
			this.title = $(this.element).find('img').attr('alt');
		}
	});

	//当内容滚动到底部时加载新的内容
	setTimeout(function(){
	$(window).scroll(function() {
		// $(document).scrollTop() //获取垂直滚动条到顶部的距离
		// $(document).height()//整个网页的高度
		// $(window).height()//浏览器窗口的高度
		var x = $(document).height() - $(window).height() - $(document).scrollTop();
		if (x <= 5 && __n <= __max){
			__n += 1;
			if (__n <= __max){getData(_id);}
		}
	});
	}, 300);
});
