/**
 * Created by Administrator on 2017/3/3.
 */
$(function(){
 var nav=document.getElementById('nav');
    var navList=nav.children;
    var boxHeight=$('.pages').height();
    var ulHeight=$('#nav').height();
//最大定位
    var maxY=0;
//最小定位
    var minY=boxHeight-ulHeight;
//定义缓冲滑动距离
  var   buffer=100;
//定义最大滑动区间
    var maxSwipe=maxY+buffer;
//定义最小滑动区间
    var  minSwipe=minY-buffer;
var startY=0;
var moveEndY=0;
    var currentY=0;
    var distanceY=0;
    var isMove=false;
    var date=new Date();
    function removeTransition(){
        $('#nav').css({
            'transition':'none'
        });
    }
//增加过度效果
    function addAnimate(move) {
        $('#nav').css({
            'transform': 'translateY(' + move + 'px)'
        });
    }
//定义动画函数
    function addTransition() {
        $('#nav').css({
            'transition': 'all .5s linear'
        });
    }
  var startTime=0;
   nav.addEventListener('touchstart',function(event){
      startTime=date.getTime();
       event.stopPropagation();
       startY=event.touches[0].clientY;
   });
    //
    nav.addEventListener('touchmove',function(event){
        event.stopPropagation();
        event.preventDefault();
        moveEndY=event.touches[0].clientY;
        distanceY=moveEndY-startY;
        //currentY=moveEndY;
        isMove=true;
        removeTransition();
      if((distanceY+currentY)>minSwipe && (distanceY+currentY)<maxSwipe){
          //这里注意必须是distanceY+currentY
          addAnimate(distanceY+currentY);
      }
    });

    nav.addEventListener('touchend',function(event){
        event.stopPropagation();
        var endTime=date.getTime();
        if( !isMove && (endTime- startTime)<150){
            clickMove();
        }
        if((distanceY+currentY)>maxY){
            currentY=maxY;
            console.log(currentY);
            addTransition();
            addAnimate(currentY);
            return
        }
        if((distanceY+currentY)<minY){
            currentY=minY;
            addTransition();
            addAnimate(currentY);
            return
        }
       currentY=distanceY+currentY;
        startY = 0;
        moveEndY = 0;
        distanceY = 0;
        isMove=false;
    });
    function clickMove(){
        var rightContainer=document.getElementsByClassName('rightContainer')[0];
        var containerChild=rightContainer.children;
        //伪数组变为数组
        navList=Array.from(navList);
        //containerChild=Array.from(containerChild);
        navList.forEach(function(ele,index){
            var _index=index;
            var liHeight=ele.offsetHeight;
            ele.onclick=function(){
                //this.style.transformStyle='preserve-3d';
                this.style.transform='rotateX(360deg)';
                var eleBg= nav.getElementsByClassName('bg');
                if(eleBg.length>0){
                    eleBg[0].className=''
                }
                this.className='bg';
                for(var i=0 ; i<containerChild.length;i++){
                    var classNameLen=rightContainer.getElementsByClassName('active');
                    if(classNameLen.length>=1){
                        classNameLen[0].className=''
                    }

                    containerChild[_index].className='active';
                }
                var target=-liHeight*_index;
                if(Math.abs(target)<Math.abs(minY)){
                    addTransition();
                    addAnimate(target);
                    currentY=target;
                }else{
                    currentY=minY;
                    addAnimate(currentY);
                }

            }
        })
    }
});
