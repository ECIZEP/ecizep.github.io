function addListener(element,event,listener){
	if(element.addEventListener){
		element.addEventListener(event,listener,false);
	}else if(element.attachEvent){
		element.attachEvent("on" + event,listener);
	}else{
		element["on" + event] = listener;
	}
}

var buttonlist = document.getElementsByTagName("input");
var container = document.getElementById('container');

function Queue(){
	this.dataArray = [];
}

Queue.prototype = {
	constructor: Queue,
	isEmpty: function(){
		if(this.dataArray.length == 0){
			return true;
		}else{
			return false;
		}
	},
	leftPush: function(num){
		this.dataArray.unshift(num);
	},
	rightPush: function(num){
		this.dataArray.push(num);
	},
	leftPop: function(){
		if(!this.isEmpty()){
			this.dataArray.shift();
		}else{
			alert("当前队列为空,无法删除元素");
		}
	},
	rightPop: function(){
		if(!this.isEmpty()){
			this.dataArray.pop();
		}else{
			alert("当前队列为空,无法删除元素");
		}
	},
	deleteIndex: function(index){
		if(!this.isEmpty()){
			this.dataArray.splice(index,1);
		}else{
			alert("当前队列为空,无法删除元素");
		}
	},
	display: function(){
		return this.dataArray.join(",");
	}
};

var myQueue = new Queue();

function refresh(){
	var innerHTML = "";
	for (var i = 0; i < myQueue.dataArray.length; i++) {
		innerHTML = innerHTML + "<span>" + myQueue.dataArray[i] + "</span>";
	}
	container.innerHTML = innerHTML;

	spans = container.getElementsByTagName('span');
	for (var i = 0; i < spans.length; i++) {
		//给节点添加属性来保存当前的i值
		/*spans[i].index = i;
		addListener(spans[i],"click",function(event){
			console.log(event.target.index);
			myQueue.deleteIndex(event.target.index);
			refresh();
		});*/
		//闭包的方式访问外部函数作用域
		addListener(spans[i],"click",function(index){
			return function(){myQueue.deleteIndex(index);refresh();}
		}(i));
	}}
}

/*对按钮添加事件*/
addListener(buttonlist[1],"click",function(){
	var inputValue = buttonlist[0].value;
	if((/^[0-9]+$/).test(inputValue)){
		myQueue.leftPush(inputValue);
		refresh();
	}else{
		alert("请输入整数！");
	}
});

addListener(buttonlist[2],"click",function(){
	var inputValue = buttonlist[0].value;
	if((/^[0-9]+$/).test(inputValue)){
		myQueue.rightPush(inputValue);
		refresh();
	}else{
		alert("请输入整数！");
	}
});

addListener(buttonlist[3],"click",function(){
	myQueue.leftPop();
	refresh();
});

addListener(buttonlist[4],"click",function(){
	myQueue.rightPop();
	refresh();
});


