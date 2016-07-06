define('../js/DseUnderWinMain',['dseCommon','../js/DseUnderWinRequest'],function(require,exports,module){
	let dseCommon = require('dseCommon').DseCommon;
	let dseUtlis = dseCommon.DseUtils;
	let request = require('../js/DseUnderWinRequest').DseUnderWinRequest;

	let params = {};
	let winConfig = {
		target: $('#defaultDemo'),
		isClickReset:false,
		onClick: function(node,nodes,all){
			
		},
		onDbClick: function(node,nodes){
		},
		appendTo: $('body'),/*追加到的元素*/
		groupInfo: {
			groups:['一级','二级','三级']/*分组信息*/
		},
		allInfo:{
			text: '全部',/*全选节点显示*/
		},
		displayField: 'text',/*显示字段*/
	}
	let dseUnderWin = new dseCommon.DseUnderWin(winConfig);

	/*默认*/
	let buildDefault = function(data){
		dseUnderWin.data = data;
		dseUnderWin.createDistWin();
	}

	/*默认选中第一个*/
	let buildSelecteData = function(data){
		data[0].selected = true;
		dseUnderWin.data = data;
		dseUnderWin.target = $('#selectedDemo');
		dseUnderWin.isClickReset = true;
		dseUnderWin.isMultiSelect = false;
		dseUnderWin.appendTo = $('#selectedAppendNode');
		dseUnderWin.createDistWin();
	}
	/*不使用appendTo*/
	let buildUnappendTo = function(data){
		let target = $('#unappendDemo');
		dseUnderWin.data = data;
		dseUnderWin.target = target;
		dseUnderWin.isClickReset = true;
		dseUnderWin.isMultiSelect = false;
		dseUnderWin.allInfo = null;
		dseUnderWin.groupInfo = null;
		dseUnderWin.appendTo = null;
		let distWin = dseUnderWin.createDistWin();
		target.on('click',function(){
			target.append(distWin.panel);
		});
	}

	let buildCustomerHeader = function(data){
		let target = $('#customerHeader');
		dseUnderWin.data = data;
		dseUnderWin.target = target;
		dseUnderWin.appendTo = target;
		dseUnderWin.createDistWin({
			headerHtml: '<label>自定义头部: </label>',
			onRenderHeader: function(node,selectedNode){
				return `<div>${node.text}</div>`;
			}
		});
	}


	params.success = function(data){
		/*默认*/
		buildDefault(data);
		/*第一个元素被选中*/
		buildSelecteData(data);
		/*不配置appendTo使用*/
		buildUnappendTo(data);
		/*自定义头部*/
		buildCustomerHeader(data);
		
	}
	request.listDist(params);
});