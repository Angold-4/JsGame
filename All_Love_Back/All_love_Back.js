;window.onload = function(){
	function $(idName){
		return document.getElementById(idName);
	}
	var gamestart = $("gamestart");
	var gameenter = $("gameenter");
	var enter = $("enter");
	var wa = $("wa");
	var s = false;
	var a = null;
	var pipes = $("pipes")
	var score = 0;

	var allpipes = [];

	enter.onclick = function(){  
		gamestart.style.display = "none";
		gameenter.style.display = "block"

		document.onkeyup = function(evt){
			var e = evt || window.event;
			var c = e.keyCode;
			if(c == 32){
				if(!s){
					wangejump();
					gameenter.onclick = function(){
						wangejump(true);
					}
					create();
					continuegame();


				}else{
					stop();


				}
				s = !s;
			}
		}
	}


    function create(){
	    a = setInterval(function(){ 
	    	createpipe();
	    	console.log(allpipes);
	    },2500);}

    function createpipe(){
	    var div = document.createElement("div");
        div.className = "pipe1";
        div.s = true;

	    var randUp_modH = randheight();
	    var randDown_modH = 600 - 34 - 140 - 144 - 144 - randUp_modH;
        div.innerHTML = `<div class="up"><div class = "up_mod" style="height:${randUp_modH}px"></div><div class = "up_pipe"></div></div><div class = "down"><div class = "down_pipe"></div><div class = "down_mod" style = "height:${randDown_modH}px"></div></div>`;	
	    pipes.appendChild(div);
	    pipemove(div);
	    allpipes.push(div);

    }



    function randheight(){
	    return Math.floor(Math.random()*(600 - 34 - 144 - 144 - 140 + 1));
    }
    function pipemove(p){
    	var speed = -1;
    	p.timer = setInterval(function(){
    		var moveVal = getStyle(p,"left");
    		if(moveVal <= -80){
    			clearInterval(p.timer);
    			p.timer = undefined;
    			allpipes.splice(0,1);
    		}else{
    			if(moveVal + speed <= 70 - 80 && p.s){
    				p.s = false;
    				scores.innerHTML = ++score;
    			}
    			p.style.left = moveVal + speed + "px";

    		}
    	},10)

    }


    var jumpheight = 31;
    function wangejump(flag){
	    if(wa.timer){
	 	    clearInterval(wa.timer);
		    delete wa.timer;
	    }
	    var speed = flag ? -1 : 1.8; 
	    var end = getStyle(wa,"top") - jumpheight;
	    wa.timer = setInterval(function(){
		    var moveVal = getStyle(wa,"top");
		    if (moveVal <= 0) speed = 1.8;
		    if(moveVal == end){
			    speed = 1.8;
			    wa.style.top = moveVal + speed + "px";

		    }else{
			    wa.style.top = Math.min(467,moveVal + speed)+ "px";
			    if (moveVal >= 467){
				    clearInterval(wa.timer);
				    delete wa.timer;
			    }
		    }
		    impact();
	    },10);
    }



    function impact(){
    	var waT = getStyle(wa,"top");
    	for(var i=0;i <allpipes.length;i++){
    		if(allpipes[i].s){
    			var pleft = getStyle(allpipes[i],"left");
    			var pup = getStyle(allpipes[i].firstElementChild,"height");
    			if (170 >= pleft && 60 <= pleft + 80 &&( waT <= pup|| waT + 100 >= pup + 140)){
    				console.log("Game Over: " + score );
    				alert("全部的爱：" + score +"❤️")
    				gameover();

    			}
    		}
    	}
    }


    function gameover(){
    	clearInterval(a);
    	clearInterval(wa.timer);
    	gameenter.style.display = "none";
    	gamestart.style.display = "block";
    	score = 0;
    	scores.innerHTML = 0;
    	s = false;
    	for(var i = allpipes.length - 1;i >= 0;i--){
    		clearInterval(allpipes[i].timer);
    		pipes.removeChild(allpipes[i]);   	
    	}
    	allpipes = [];
    }


    function stop(){
    	clearInterval(a);
    	clearInterval(wa.timer);
    	gameenter.onclick = null;
    	for(var i = 0;i < allpipes.length[i];i++){
    		clearInterval(allpipes[i].timer);
    	}
    }

    function continuegame(){
    	for(var i = 0;i < allpipes.length;i++){
    		pipemove(allpipes[i]);
    	}
    }





    function getStyle(ele,attr){
	    var res = null;
	    if(ele.currentStyle){
		    res = ele.currentStyle[attr];
	    }else{
		    res = window.getComputedStyle(ele,null)[attr];
	    }
	    return parseFloat(res)};

}







