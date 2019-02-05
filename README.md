# 淘宝买家秀

## 添加到浏览器书签

在搜索页面上点击书签会在每一个商品Item下面出现一个按钮

```
 javascript:function addHtml(){const aa=document.getElementsByTagName("div");for(let i=0;i<aa.length;i++){if(aa[i].getAttribute('data-category')==='auctions'){const para=document.createElement("dev");const href=document.createElement("a");const hrefContent=document.createTextNode('查看买家秀');const elementsByTagName=aa[i].getElementsByTagName('a');let itemId;for(let j=0;j<elementsByTagName.length;j++){if(elementsByTagName[j].getAttribute('data-nid')){itemId=elementsByTagName[j].getAttribute('data-nid')}}href.setAttribute("href",'http://chishenme.ztianzeng.com/?id='+itemId);href.setAttribute("target",'view_window');href.appendChild(hrefContent);para.appendChild(href);aa[i].appendChild(para)}}return false}addHtml();
```
