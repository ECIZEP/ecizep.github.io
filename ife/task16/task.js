/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };


 技术关键词：时间冒泡，data属性应用，事件target属性
 */
var aqiData = {};
var cityInput = document.getElementById("aqi-city-input");
var aqiInput = document.getElementById("aqi-value-input");
var table = document.getElementById("aqi-table");
/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function trim(str){ //删除左右两端的空格　　   
 
    return str.replace(/(^\s*)|(\s*$)/g, "");   
 
}   


function addAqiData() {
	var city = trim(cityInput.value);
	var aqi = trim(aqiInput.value);
	//只含有函数或者字母
	if(!city.match(/^[a-zA-Z\u4E00-\u9FA5]+$/)){
		alert("请输入正确的城市名称，只允许出现汉字或者字母");
		return;
	}
	//只含有数字
	if(!aqi.match(/^[0-9]+$/)){
		alert("请输入正确的值，只允许出现数字");
		return;
	}
	aqiData[city] = aqi;
}

/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
	var items = "<tr><th>城市</th><th>空气质量</th><th>操作</th></tr>";
	for(var city in aqiData){
		items += "<tr><td>" + city + "</td><td>" + aqiData[city] + "</td><td><button data-city = '" + city + "'>删除</button></td></tr>"
	}
	//innerHTML在IE789中只读，无法修改
	table.innerHTML = city?items:"";
}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
  addAqiData();
  renderAqiList();
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle(city) {
  // do sth.
  delete aqiData[city];
  renderAqiList();
}

//兼容IE的事件操作
var eventUtil = {
	getEvent: function(event){
		return event?event:window.event;
	},
	getElement:function(event){
		return event.target?event.target:event.srcElement;
	}
}

function init() {

  // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
  var addbtn = document.getElementById("add-btn");
  addbtn.onclick = addBtnHandle;
  // 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
  table.onclick = function(event){
  	event = eventUtil.getEvent(event);
  	if(eventUtil.getElement(event).nodeName.toLowerCase() == "button"){
  		delBtnHandle(eventUtil.getElement(event).getAttribute('data-city'));
  		//delBtnHandle(eventUtil.getElement(event).dataset.city); IE11才支持dataset属性
  	}
  }
}

init();