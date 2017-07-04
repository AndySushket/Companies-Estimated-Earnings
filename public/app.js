let TreeOfCompany = (function () {

	let mothertree = this;
	this.body = document.querySelector('body');
	this.addingBlock = document.getElementById("inputs");
	this.mainUL = document.getElementById("mainUL");
	this.arr=[];
	this.title=document.querySelector('.title');

	let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			let result=JSON.parse(xhttp.responseText);
			mothertree.arr=result[0].companys;
			mothertree.intArr();
			imgEvent(false,false,mothertree.arr,mothertree.title);
			reGetSelectors();
		}
	};
	xhttp.open("GET","/getDB",true);
	xhttp.send();

	function reGetSelectors() {
		mothertree.addingBlock.names = document.getElementById("name");
		mothertree.addingBlock.profit = document.getElementById("profit");
		mothertree.addingBlock.addButton = document.getElementById("button");
		mothertree.addingBlock.addChild = document.querySelectorAll(".addChild");
		mothertree.addingBlock.deleteNode = document.querySelector(".deleteNode");
	}

	this.intArr = () => {
		arr.forEach(function (item, i, arr) {
			if (item.childs instanceof Array && item.childs.length!==0) {
				mothertree.mainUL.appendChild(makeanotherArr(item, i, arr));
			}
			else{
				mothertree.mainUL.appendChild(makeElem(item, i, arr));
			}
		});
	};

	function hideInputs(){
		mothertree.addingBlock.style.height="0px";
		mothertree.addingBlock.style.opacity="0";
		mothertree.addingBlock.names.value="";
		mothertree.addingBlock.profit.value="";
	}

	function makeElem(item, i, arr) {
		let element = document.createElement('li');
		if (i === arr.length - 1) {
			element.className = "last";
		}
		let span = document.createElement('span');
		let link = document.createElement('p');
		let company = document.createElement('i');
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
		let element = document.createElement('li');
		if (i === arr.length-1) {
			element.className = "last";
		}
		let newUL = document.createElement('ul');
		let span = document.createElement('span');
		let link = document.createElement('p');
		let company = document.createElement('i');
		mothertree.sumProfit+=item.profit;
		profit(item,arr);
		company.innerHTML = item.company+" | "+item.profit+"$ | "+mothertree.sumProfit+"$ | ";
		company.style.fontWeight="600";
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
				mothertree.arr.push({company: mothertree.addingBlock.names.value,profit: +mothertree.addingBlock.profit.value});
			}
			insert();
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
			insert();
		});
	}

	function DeleteNode(item, i, arr){
		arr.splice(i, 1);
		insert()
	}

	function rebuild(){
		if(mothertree.addingBlock.style.height!=="0px") {
			let old_element = document.getElementById("button");
			let new_element = old_element.cloneNode(true);
			old_element.parentNode.replaceChild(new_element, old_element);
			hideInputs();
		}
		mothertree.mainUL.innerHTML="";
		mothertree.intArr();
		reGetSelectors();
	}

	function insert(){
		let json =JSON.stringify(mothertree.arr);
		let xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				let result=JSON.parse(xhttp.responseText);
				mothertree.arr=result[0].companys;
				setTimeout(function () {
					rebuild();
				},500)
			}
		};
		xhttp.open("POST","/insertDB",true);
		xhttp.setRequestHeader("Content-type","application/json");
		xhttp.send(json);
	}

	function imgEvent(item, i, arr, link){
		let addChild = document.createElement('img');
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
		let deleteNode = document.createElement('img');
		deleteNode.className = "deleteNode";
		deleteNode.src = "img/close.png";
		deleteNode.title ="delete";
		let editNode = document.createElement('img');
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