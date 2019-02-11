var api = 'http://chishenme.ztianzeng.com/?id=';
const aa = document.getElementsByTagName("div");
for (let i = 0; i < aa.length; i++) {
    if (aa[i].getAttribute('data-category') === 'auctions') {
        const para = document.createElement("dev");
        const href = document.createElement("a");
        const hrefContent = document.createTextNode('查看买家秀');
        const elementsByTagName = aa[i].getElementsByTagName('a');
        let itemId;
        for (let j = 0; j < elementsByTagName.length; j++) {
            if (elementsByTagName[j].getAttribute('data-nid')) {
                itemId = elementsByTagName[j].getAttribute('data-nid')
            }
        }
        href.setAttribute("href", api + itemId);
        href.setAttribute("target", 'view_window');
        href.appendChild(hrefContent);
        para.appendChild(href);
        aa[i].appendChild(para)
    }
}