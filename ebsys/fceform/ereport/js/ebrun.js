//控制显示报表文件的运行结果时用
//作者：梅勇，
//日期：2010-05-12

window.attachEvent('onbeforeprint', function() {
    ebBigDiv.align = "left";
})
window.attachEvent('onafterprint', function() {
    ebBigDiv.align = "center";
})
