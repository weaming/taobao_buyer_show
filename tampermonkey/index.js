// ==UserScript==
// @name         买家秀
// @version      3.4
// @description  买家秀
// @author       yyyy
// @include      http*://s.taobao.com/*
// @require      https://cdn.bootcss.com/jquery/2.2.4/jquery.min.js
// @grant        none
// ==/UserScript==

(function() {
    var api = 'http://chishenme.ztianzeng.com/?id=';

    $('body').on("DOMNodeInserted", ".item.J_MouserOnverReq", function (event) {
        if($(event.target).attr('class') == 'ww-inline ww-online'){
            var s = $(event.currentTarget).find('a[data-nid]');
            var href = api + s.attr('data-nid');
            if($(event.currentTarget).find('a.zeng').length == 0){
                $(event.currentTarget).find('.ctx-box.J_MouseEneterLeave').append('<a class=zeng target="view_window" href="'+href+'">查看买家秀</p>');
            }

            var adS = $('.item.J_MouserOnverReq.item-ad').find('a[data-nid]');
            if($('.item.J_MouserOnverReq.item-ad').find('a.zeng').length == 0){
                $('.item.J_MouserOnverReq.item-ad').find('.ctx-box.J_MouseEneterLeave').append('<a class=zeng target="view_window" href="'+api+adS.attr('data-nid')+'">查看买家秀</p>');
            }
        }
    });


})();