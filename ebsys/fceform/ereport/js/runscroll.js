//用于控制固定行列的显示方式
//作者：梅勇，
//日期：2008-01-04

window.attachEvent('onload',function () {
	document.body.scroll="no";
	ebrun_win_onresize();
})
window.attachEvent('onresize', ebrun_win_onresize)	;
function ebrun_win_onresize(){
    var Area4 = $id("div4Area4");
    if (Area4 == null) return;
    var Area1 = $id("div4Area1");
    var Area2 = $id("div4Area2");
    var Area3 = $id("div4Area3");
    var tmpwidth = 0;
    var width3 = 0;
    if (Area3 != null) width3 = Area3.childNodes(0).offsetWidth;
    var offsetWidth = (document.body.clientWidth - width3 - Area4.childNodes(0).offsetWidth) / 2;
    if (offsetWidth < 0) offsetWidth = 0;
    if (offsetWidth > 0) {
        tmpwidth = document.body.clientWidth - Area4.style.pixelLeft;
    } else {
        tmpwidth = document.body.clientWidth - width3;
    }
    if (Area3 != null) Area3.style.left = offsetWidth;
    if (Area1 != null) Area1.style.left = offsetWidth;
    Area4.style.left = offsetWidth + width3;
    if (Area2 != null) Area2.style.left = offsetWidth + width3;
    if (tmpwidth < 0) tmpwidth = 0;
    Area4.style.width = tmpwidth;
    var tmpheight = document.body.clientHeight - Area4.offsetTop;
    if (tmpheight < 0) tmpheight = 0;
    Area4.style.height = tmpheight;
    if (Area2 != null) {
        Area2.style.width = tmpwidth;
        if (Area4.scrollHeight > Area4.clientHeight) {
            Area2.style.overflowY = "scroll";
        } else {
            Area2.style.overflowY = "hidden";
        }
    }
    if (Area3 != null) {
        Area3.style.height = tmpheight;
        if (Area4.scrollWidth > Area4.clientWidth) {
            Area3.style.overflowX = "scroll";
        } else {
            Area3.style.overflowX = "hidden";
        }
    }

}
function div_onscroll()
{
	var Area4 = $id("div4Area4");
	var Area2 = $id("div4Area2");
	var Area3 = $id("div4Area3");
	if(Area3 != null) Area3.scrollTop=Area4.scrollTop;
	if(Area2 != null) Area2.scrollLeft=Area4.scrollLeft;
}
function $id(elementID)
{
	return document.getElementById(elementID);
}