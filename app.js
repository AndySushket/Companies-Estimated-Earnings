var TreeOfCompany = (function () {

	var mothertree = this;
	this.mainBlock = document.getElementById("tree");
	this.body = document.querySelector('body');
	this.addingBlock = document.getElementById("inputs");
	this.mainUL = document.getElementById("mainUL");
	this.arr = [];
	this.title=document.querySelector('.title');

	const client = new stitch.StitchClient('test-nzvqd');
	const db = client.service('mongodb', 'mongodb-atlas').db('DataBase');


	client.login().then( () =>
	db.collection('Companies').find()
	).then(docs => {
		mothertree.arr=docs[0].companys;
		console.log("DB connected", docs[0].companys);
}).catch(err => {
		console.error(err)
}).then(() =>
	this.intArr());

	imgEvent(false,false,this.arr,this.title);

	function reGetSelectors(){
		mothertree.addingBlock.names = document.getElementById("name");
		mothertree.addingBlock.profit = document.getElementById("profit");
		mothertree.addingBlock.addButton = document.getElementById("button");
		mothertree.addingBlock.addChild = document.querySelectorAll(".addChild");
		mothertree.addingBlock.deleteNode = document.querySelector(".deleteNode");
	}
	reGetSelectors();

	this.intArr = () => {

		arr.forEach(function (item, i, arr) {
			if (item.childs instanceof Array && item.childs.length!==0) {
				mothertree.mainUL.appendChild(makeanotherArr(item, i, arr));
			}
			else{
				mothertree.mainUL.appendChild(makeElem(item, i, arr));
			}
		});
	}

	function hideInputs(){
		mothertree.addingBlock.style.height="0px";
		mothertree.addingBlock.style.opacity="0";
		mothertree.addingBlock.names.value="";
		mothertree.addingBlock.profit.value="";
	}

	function makeElem(item, i, arr) {
		var element = document.createElement('li');
		if (i === arr.length - 1) {
			element.className = "last";
		}
		var span = document.createElement('span');
		var link = document.createElement('p');
		var company = document.createElement('i');
		company.className = "company";
		company.innerHTML = item.company+" | "+item.profit+"$ | ";
		company.style.fontWeight="100";
		element.appendChild(span);
		span.appendChild(link);
		link.appendChild(company);
		imgEvent(item, i, arr, link);
		return element;
	}

	function makeanotherArr(item, i, arr) {
		mothertree.sumProfit=0;
		var element = document.createElement('li');
		if (i === arr.length-1) {
			element.className = "last";
		}
		var newUL = document.createElement('ul');
		var span = document.createElement('span');
		var link = document.createElement('p');
		var company = document.createElement('i');
		mothertree.sumProfit+=item.profit;
		profit(item,arr);
		company.innerHTML = item.company+" | "+item.profit+"$ | "+mothertree.sumProfit+"$ | ";
		company.style.fontWeight="800";
		element.appendChild(span);
		span.appendChild(link);
		link.appendChild(company);
		imgEvent(item, i, arr, link);
		element.appendChild(newUL);
		item.childs.forEach(function (item, i, arr) {
			if (item.childs instanceof Array && item.childs.length!==0) {
				newUL.appendChild(makeanotherArr(item, i, arr))
			}
			else {
				newUL.appendChild(makeElem(item, i, arr));
			}
		});
		return element;
	}

	function AddChild(item, i, arr){
		mothertree.addingBlock.addButton.value="add";
		mothertree.addingBlock.style.opacity="1";
		mothertree.addingBlock.style.height="40px";
		mothertree.addingBlock.addButton.addEventListener("click",()=>{
			try {
				if (mothertree.addingBlock.names.value !== "" && mothertree.addingBlock.profit.value !== "") {
					if (!arr[i].childs) {
						arr[i].childs = [];
					}
					arr[i].childs.push({company: mothertree.addingBlock.names.value,profit: +mothertree.addingBlock.profit.value});
				}
			}
			catch(e){
				arr.push({company: mothertree.addingBlock.names.value,profit: +mothertree.addingBlock.profit.value});
			}
			rebuild();
		})
	}

	function EditNode(item, i, arr){
		mothertree.addingBlock.addButton.value="edit";
		mothertree.addingBlock.style.opacity="1";
		mothertree.addingBlock.style.height="40px";
		mothertree.addingBlock.names.value= item.company;
		mothertree.addingBlock.profit.value= item.profit;
		mothertree.addingBlock.addButton.addEventListener("click",function(){
			if(mothertree.addingBlock.names.value!=="" && mothertree.addingBlock.profit.value!=="" ){
				arr[i].company=mothertree.addingBlock.names.value;
				arr[i].profit=+mothertree.addingBlock.profit.value;
			}
			rebuild();
		});
	}

	function DeleteNode(item, i, arr){
			arr.splice(i, 1);
			rebuild();
	}

	function rebuild(){
		if(mothertree.addingBlock.style.height!=="0px") {
			var old_element = document.getElementById("button");
			var new_element = old_element.cloneNode(true);
			old_element.parentNode.replaceChild(new_element, old_element);
			hideInputs();
		}
		client.login().then(() =>
		db.collection('Companies').updateOne({owner_id: client.authedId()}, {$set:{companys:mothertree.arr}})).then(() =>
		db.collection('Companies').find()
	).then(docs => {
			mothertree.arr=docs[0].companys;
		console.log("DB changed", docs[0].companys);
	}).catch(err => {
			console.error(err)
	}).then(()=>
		mothertree.mainUL.innerHTML=""
	).then(() =>
		mothertree.intArr());
		reGetSelectors();
	}

	function imgEvent(item, i, arr, link){
		var addChild = document.createElement('img');
		addChild.className = "addChild";
		addChild.src = "img/add.png";
		addChild.title = "add";
		link.appendChild(addChild);
		addChild.addEventListener("click", function(){
			AddChild(item, i, arr);
		});
		if (link.className === "title"){
			addChild.style.margin = "0px 0px -4px 3px";
			return;
		}
		var deleteNode = document.createElement('img');
		deleteNode.className = "deleteNode";
		deleteNode.src = "img/close.png";
		deleteNode.title ="delete";
		var editNode = document.createElement('img');
		editNode.className = "editNode";
		editNode.src = "img/edit.png";
		editNode.title = "edit";
		link.appendChild(editNode);
		link.appendChild(deleteNode);
		editNode.addEventListener("click", function(){
			EditNode(item, i, arr);
		});
		deleteNode.addEventListener("click", function() {
			DeleteNode(item, i, arr);
		});
	}

	function profit(item){
		if (item.childs instanceof Array) {
			item.childs.forEach(function (childitem) {
				mothertree.sumProfit+=childitem.profit;
				if (childitem.childs) {
					profit(childitem);
				}
			});
		}
	}

})();
