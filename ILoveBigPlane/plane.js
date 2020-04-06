;window.onload = function () {
	function $(idname){
		return document.getElementById(idname);
	}
	var game = $('game')
	var gameStart = $('gameStart')
	var gameEnter = $('gameEnter')
	var myplane = $('myplane')
	var bullets = $('bullets')
	var enermys = $('enermys')
	var headtitle = $('headtitle')
	var s = $("scores").firstElementChild.firstElementChild;
	var bulletH = 15;
	var bulletW = 6;
	var gameStatus = false;
	var a = null //创建子弹的定时器
	var b = null //创建敌机的定时器	

	headtitle.onclick = function(){
		gameStart.style.display = "none"
		gameEnter.style.display = "block"
		document.onkeyup = function(evt){
			var e = evt || window.event;  //兼容
			var keyVal = e.keyCode;
			if(keyVal == 32){
				if(!gameStatus){
					scores = 0;
					this.onmousemove = myPlaneMove;
					shot();
					enermyAppear();
					//暂停游戏之后开始：
					if(bulletset.length != 0){reStart(bulletset,1)};
					if(enermyset.length != 0){reStart(enermyset)};

				}else{
					this.onmousemove = null;
					clearInterval(a);
					clearInterval(b);
					a = null;
					b = null;
					clear(bulletset);
					clear(enermyset);
				}
				gameStatus = !gameStatus;
				
			}
		}
	}

	function getStyle(ele,attr){
		var res = null;
		if(ele.currentStyle){
			res = elecurrentStyle[attr];
		}else{
			res = window.getComputedStyle(ele,null)[attr]
		}
		return parseFloat(res);
	}
	var gameW = getStyle(game,"width")
	var gameH = getStyle(game,"height")
	var gameML = getStyle(game,"marginLeft")
	var gameMT = getStyle(game, "marginTop")
	var myPlaneW = getStyle(myplane, "width")
	var myPlaneH = getStyle(myplane, "height")
	var bulletset = [];
	var enermyset = [];
	var scores = 0;


	function myPlaneMove(evt){
		var e = evt || window.event;
		var mouse_x = e.x || e.pageX //兼容
		var mouse_y = e.y || e.pageY;
		//计算得到鼠标移动时己方飞机的左上边距
		var myPlaneleft = mouse_x - gameML - myPlaneW/2;
		var myPlaneTop = mouse_y - gameMT - myPlaneH/2;
		if(myPlaneleft <= 0){
			myPlaneleft = 0;
		}else if(myPlaneleft >= gameW - myPlaneW){
			myPlaneleft = gameW - myPlaneW;
		}

		if (myPlaneTop <= 0){
			myPlaneTop = 0;
		}else if(myPlaneTop >= gameH - myPlaneH){
			myPlaneTop = gameH - myPlaneH;
		}
		myplane.style.left = myPlaneleft + "px"
		myplane.style.top = myPlaneTop + "px";
	}
	function shot(){
		if(a) return;
		a = setInterval(function(){
			createBullet();
		},100);//100ms创建一个子弹
	}
	function createBullet(){
		var bullet = new Image(bulletW,bulletH);
		bullet.src = "bullet1.png";
		bullet.className = "b";
		//确定子弹的位置
		//创建每一颗子弹都需要确定己方飞机的位置
		var myPlaneL = getStyle(myplane,"left");
		var myPlaneT = getStyle(myplane, "top");
		//确定创建子弹的位置
		var bulletL = myPlaneL + myPlaneW/2 - bulletW/2;
		var bulletT = myPlaneT - bulletH;
		bullet.style.left = bulletL + "px";
		bullet.style.top = bulletT + "px";
		bullets.appendChild(bullet);
		bulletset.push(bullet);

		move(bullet,'top');
	}
	//子弹的运动
	function move(ele,attr){
		var speed = -8;
		ele.timer = setInterval(function(){
			var moveVal = getStyle(ele,attr);
			if(moveVal <= -bulletH){
				clearInterval(ele.timer);
				ele.parentNode.removeChild(ele);
				bulletset.splice(0,1);
			}else{
				ele.style[attr] = moveVal + speed + "px";
			}
		},10);
	}
	var enermysObj = {
		enermy1: {
			width: 40,
			height: 40,
			score: 10,
			hp: 400,
		},
		enermy2: {
			width: 55,
			height: 100,
			score: 100,
			hp: 1500,
		},
		enermy3: {
			width: 200,
			height: 250,
			score:500,
			hp: 4000,
		},
	}




	//创建敌机：
	function enermyAppear(){
		if(b) return ;
		b = setInterval(function(){
			createEnermy();
			//删除死亡敌机
			delEnermy();
		},1000);
	}

	//制造敌机的函数：
	function createEnermy(){
		var percent = [1,1,1,1,1,1,1,1,1,1,2,2,2,2,3];
		var enermyType = percent[Math.floor(Math.random()*percent.length)];
		var enermyData = enermysObj["enermy" + enermyType]
		var enermy = new Image(enermyData.width,enermyData.height);
		enermy.src = "enermy" + enermyType + ".gif";
		enermy.score = enermyData.score;
		enermy.hp = enermyData.hp;
		enermy.className = "e";
		enermy.dead = false;
		enermy.t = enermyType;

		//确定当前敌机出现的位置
		var enermyL = Math.floor(Math.random()*(gameW - enermyData.width + 1));
		var enermyT = -enermyData.height
		enermy.style.left = enermyL + "px";
		enermy.style.top = enermyT + "px";
		enermys.appendChild(enermy);
		enermyset.push(enermy); 
		enermyMove(enermy,"top");
	}

	function enermyMove(ele,attr){
		var speed = null;
		if(ele.t == 1){
			speed = 1.5;
		}else if(ele.t == 2){
			speed = 1;
		}else if(ele.t == 3){
			speed = 0.5;
		}
		ele.timer = setInterval(function(){
			var moveVal = getStyle(ele,attr);
			if (moveVal >= gameH){
				clearInterval(ele.timer);
				enermys.removeChild(ele);
				enermyset.splice(0,1);
			}else{
				ele.style[attr] = moveVal + speed + "px"
;				danger(ele);
				//检测碰撞
				gameOver();
			}

		},10);
	}

	//清除所有敌机和所有子弹上的运动定时器
		function clear(childs){
			for(var i=0;i<childs.length;i++){
				clearInterval(childs[i].timer);
			}
		}

		function reStart(childs,type){
			for(var i=0;i<childs.length;i++){
				type == 1 ? move(childs[i],"top") : enermyMove(childs[i],"top");
			}

		}


		//condition：
		//1.子弹的左边距 + 子弹的宽度 >= 敌机的左边距
		//2.子弹的左边距 <= 敌机的左边距 + 敌机的宽度
		//3.子弹的上边距 <= 敌机的上边距 + 敌机的高度
		//4.子弹的上边距 + 子弹的高度 >= 敌机的上边距

		//检测子弹和敌机的碰撞
		function danger(enermy){
			for(var i=0;i<bulletset.length;i++){
				var bulletL = getStyle(bulletset[i],"left")
				var bulletT = getStyle(bulletset[i],"top")
				var enermyL = getStyle(enermy,"left")
				var enermyT = getStyle(enermy,"top");
				var enermyH = getStyle(enermy,"height")
				var enermyW = getStyle(enermy,"width")

				var condition = bulletL + bulletW >= enermyL && bulletL <= enermyL + enermyW && bulletT <= enermyT + enermyH && enermyT + bulletH >= enermyT;

				if(condition){
					//删除碰撞子弹的定时器
					clearInterval(bulletset[i].timer);
					//再删除元素
					bullets.removeChild(bulletset[i]);
					//最后从集合中删除元素
					bulletset.splice(i,1);
					//发生碰撞之后 敌机血量减少 血量为0时删除敌机
					
					enermy.hp -= 100;
					if(enermy.hp == 0){
						clearInterval(enermy.timer);
						//enermys.removeChild(enermy);
						//enermyset.splice(enermy);
						//替换爆炸图片
						enermy.src = "bomb" + enermy.t + ".png";
						enermy.dead = true;
						//计算得分
						scores += enermy.score;
						s.innerHTML = scores;
					}
				}
			}
		}
		//延时删除集合和文档中的死亡敌机
		//遍历需要时间
		function delEnermy(){
			for(var i=enermyset.length - 1;i>=0;i--){
				if(enermyset[i].dead){
					(function(index){
						enermys.removeChild(enermyset[index]);
						enermyset.splice(index,1);
					})(i)
				}
			}
		}

		//己方飞机和敌方飞机的碰撞：
		//满足下列条件：
		//1.己方飞机的左边距 + 己方飞机的宽度 >= 敌方飞机的左边距 
		//2.己方飞机的左边距 <= 敌方飞机的左边距 + 敌方飞机的宽度
		//3.己方飞机的上边距 <= 敌方飞机的上边距 + 敌方飞机的高度
		//4.己方飞机的上边距 + 己方飞机的高度 >= 敌方飞机的上边距 

		function gameOver(){
			//所有的敌方飞机都在一个集合内
			for(var i=0;i<enermyset.length;i++){
				if(!enermyset[i].dead){
					//找出游戏界面内存活的敌机
					var enermyL = getStyle(enermyset[i],"left")
					var enermyT = getStyle(enermyset[i],"top")
					var enermyW = getStyle(enermyset[i],"width")
					var enermyH = getStyle(enermyset[i],"height")

					var myPlaneL = getStyle(myplane,"left")
					var myPlaneT = getStyle(myplane,"top");

					var condition = myPlaneL + enermyW >= enermyL && myPlaneL <= enermyL + enermyW && myPlaneT <= enermyT + enermyH && myPlaneT + myPlaneH >= enermyT;
					if(condition){
						//碰撞
						clearInterval(a);
						clearInterval(b);
						a = null;
						b = null;
						remove(bulletset);
						remove(enermyset);
						bulletset = []
						enermyset = []
						//清除己方飞机的移动事件
						document.onmousemove = null;
						alert("HA HA HA We all like big plane!🚀 You get: "+ scores +"🤪\nKeep your initial Dream and fight!🤩 \nMade by Wange at 04052020👍")
						gameStart.style.display = "block";
						gameEnter.style.display = "none";

						myplane.style.left = "200px";
						myplane.style.bottom = "0px";	

					}
				}

			}
		}

		//删除元素
		function remove(childs){
			for(var i= childs.length - 1;i>=0;i--){
				clearInterval(childs[i].timer);
				childs[i].parentNode.removeChild(childs[i]);
			}
		}

}