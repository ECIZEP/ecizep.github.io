/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/

function addEventHandler(element,event,hander){
  if(element.addEventListener){
    element.addEventListener(event,hander,false);
  }else if(element.attachEvent){
    element.attachEvent("on" + event,hander);
  }else{
    element["on" + event] = hander;
  }
}

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = dat.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
  var returnData = {};
  var dat = new Date("2016-01-01");
  var datStr = ''
  for (var i = 1; i < 92; i++) {
    datStr = getDateStr(dat);
    returnData[datStr] = Math.ceil(Math.random() * seed);
    dat.setDate(dat.getDate() + 1);
  }
  return returnData;
}

var aqiSourceData = {
  "北京": randomBuildData(500),
  "上海": randomBuildData(300),
  "广州": randomBuildData(200),
  "深圳": randomBuildData(100),
  "成都": randomBuildData(300),
  "西安": randomBuildData(500),
  "福州": randomBuildData(100),
  "厦门": randomBuildData(100),
  "沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
  nowSelectCity: -1,
  nowGraTime: "day"
}


var colors = ['#16324a', '#24385e', '#393f65', '#4e4a67', '#5a4563', '#b38e95',
              '#edae9e', '#c1b9c2', '#bec3cb', '#9ea7bb', '#99b4ce', '#d7f0f8'];
/**
 * 渲染图表
 */
function renderChart() {
  var leftValue = 0;
  var dateStr = Object.getOwnPropertyNames(chartData);
  var chart = document.getElementById('aqi-chart');
  while(chart.firstChild){
      chart.removeChild(chart.firstChild);
  }
  for (var i = 0; i < dateStr.length; i++) {
    var newNode = document.createElement('span');
    newNode.style.height = chartData[dateStr[i]] + 'px';
    newNode.style.left = leftValue + 'px';
    //按照高度给span计算color
    //var colorIndex = Math.floor(parseInt(chartData[dateStr[i]])/100);
    var colorIndex = Math.floor(Math.random()*colors.length);
    newNode.style.backgroundColor = colors[colorIndex];
    newNode.setAttribute("title",dateStr[i] + ":" + chartData[dateStr[i]]);
    if(pageState.nowGraTime == 'day'){
      newNode.setAttribute("class","day");
      leftValue = leftValue + 13;
    }else if(pageState.nowGraTime == 'week'){
      newNode.setAttribute("class","week");
      leftValue = leftValue + 80;
    }else{
      newNode.setAttribute("class","month");
      leftValue = leftValue + 150;
    }
    chart.appendChild(newNode);
  }
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange() {
  // 确定是否选项发生了变化 
  pageState.nowGraTime = this.value;
  console.log(pageState.nowGraTime);
  // 设置对应数据
  initAqiChartData();
  // 调用图表渲染函数
  renderChart();
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
  // 确定是否选项发生了变化 
  pageState.nowSelectCity = this.value;
  console.log(pageState.nowSelectCity);
  // 设置对应数据
  initAqiChartData();
  // 调用图表渲染函数
  renderChart();
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
  var radios = document.getElementById('form-gra-time').getElementsByTagName('input');
  for (var i = 0; i < radios.length; i++) {
    addEventHandler(radios[i],"change",graTimeChange);
  }
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
  var innerHTML = "";
  var options = document.getElementById('city-select');
  var citystrs = Object.getOwnPropertyNames(aqiSourceData);
  for(var element in aqiSourceData){
     innerHTML = innerHTML + "<option>" + element + "</option>";
  }
  options.innerHTML = innerHTML;
  pageState.nowSelectCity = citystrs[0];
  // 给select设置事件，当选项发生变化时调用函数citySelectChange
  addEventHandler(options, "change", citySelectChange);
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
  // 将原始的源数据处理成图表需要的数据格式
  // 处理好的数据存到 chartData 中
  chartData = {};
  if(pageState.nowGraTime == 'day'){
    chartData = aqiSourceData[pageState.nowSelectCity];
  }else if(pageState.nowGraTime == 'week'){
    //获取日期字符串数组
    dayData = aqiSourceData[pageState.nowSelectCity];
    var dateStr = Object.getOwnPropertyNames(dayData);
    var month = 0;
    var week = 1;
    var dayNumOfWeek = 0;
    var weekaqi = 0;
    var date;
    for (var i = 0; i < dateStr.length; i++) {
      date = new Date(dateStr[i]);
      //本月的数据才加入计算
      if(date.getMonth() == month){
        console.log(dateStr[i] + " " + date.getDay() + " " + dayData[dateStr[i]]);
        weekaqi = weekaqi + dayData[dateStr[i]];
        dayNumOfWeek++;
      }
      //数据统计
      if(date.getDay() == 0 || date.getMonth() > month){
        if(weekaqi != 0){
          chartData[date.getFullYear() + "-" + (month+1) + "月第" + week +"周"] = Math.round(weekaqi/dayNumOfWeek);
          console.log(date.getFullYear() + "-" + (month+1) + "月第" + week +"周");
        }
        dayNumOfWeek = 0;
        week += 1;
        weekaqi = 0;
      }
      if(date.getMonth() > month){
        month++;
        week = 1;
        i--;
      }
    }
    if(weekaqi != 0){
      chartData[date.getFullYear() + "-" + (month+1) + "月第" + week +"周"] = Math.round(weekaqi/dayNumOfWeek);
      console.log(date.getFullYear() + "-" + (month+1) + "月第" + week +"周");
    }
  }else if(pageState.nowGraTime == 'month'){
    dayData = aqiSourceData[pageState.nowSelectCity];
    var dateStr = Object.getOwnPropertyNames(dayData);
    var date;
    var aqiMonth = 0;
    var dayOfMonth = 0;
    var month = 0;
    for (var i = 0; i < dateStr.length; i++) {
      date = new Date(dateStr[i]);
      if(date.getMonth() == month){
        aqiMonth = aqiMonth + dayData[dateStr[i]];
        dayOfMonth++;
      }else{
        chartData[date.getFullYear() + "-" + (month+1) + "月"] = Math.round(aqiMonth/dayOfMonth);
        month++;
        dayOfMonth = 0;
        aqiMonth = 0;
        i--;
      }
    }
    if(aqiMonth != 0){
      chartData[date.getFullYear() + "-" + (month+1) + "月"] = Math.round(aqiMonth/dayOfMonth);
    }
  }
  console.log(chartData);
}

/**
 * 初始化函数
 */
function init() {
  initGraTimeForm()
  initCitySelector();
  initAqiChartData();
}

init();