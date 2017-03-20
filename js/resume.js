/**
 * Created by Administrator on 2017/2/27.
 */

var proto = {
    //将基本的结构渲染出来
    init: function () {
        var $this = this;
        $ul = $("<ul class='pages'></ul>");
        $.each(this.pages, function (index, ele) {
            $li = $("<li class='page" + index + "'></li>");
            $li.append($(ele));
            $ul.append($li);
        });
        this.append($ul);

    },
    //是否播放音乐
    isMusic: function () {
        var audio = $('audio')[0];
        this.find('aside').on('touchend', function (event) {
            event.stopPropagation();
            var isPlay = $(this).toggleClass('musicAn').hasClass('musicAn');
            isPlay ? audio.play() : audio.pause();
        })
    },
    touchDirection: function () {
        var $this = this;
        this.on('touchstart', function (event) {
            event.stopPropagation();
            this.startY = event.touches[0].clientY;
        });
        this.on('touchmove', function (event) {
            event.stopPropagation();
            event.preventDefault();
            this.moveEndY = event.touches[0].clientY;
            this.distanceY = this.moveEndY - this.startY;
            this.isMove = true;
        });
        this.on('touchend', function (event) {
            event.stopPropagation();
            //防止一次滚动多次页面
            if ($this.lock)return;
            //防止点击距离过小，但是不能滑动，却进入下面的if,让lock锁住(lock变为true)，无法进行下次滑动的动画
            if (Math.abs(this.distanceY) < $this.height / 10) {
                return
            }
            if (this.distanceY < 0) {
                if ($this.index >= $this.pages.length - 1) {
                    return
                }
                $this.index++;
                $this.lock = true;
            }
            else {
                if ($this.index == 0) {
                    return
                }
                $this.index--;
                $this.lock = true;
            }
            if (this.isMove && Math.abs(this.distanceY) > $this.height / 10) {
                $ul.css({
                    transform: 'translateY(-' + $this.index + '00%)'
                });
                window.setTimeout(function () {
                    $this.lock = false;
                    $this.trigger('transitionEnd', [$this, $this.index]);
                }, 1000);
            }
            $this.showArrow();
            this.startY = 0;
            this.moveEndY = 0;
            this.distanceY = 0;
            this.isMove = false;
        });
    },
    //滚动事件
    scrollMouse: function () {
        var $this = this;
        this.on('mousewheel', function (event) {
            if ($this.lock)return;
            if (event.originalEvent.wheelDelta < 0) {
                if ($this.index >= $this.pages.length - 1) {
                    return
                }
                $this.index++;
                $this.lock = true;
            }
            else {
                if ($this.index == 0) {
                    return
                }
                $this.index--;
                $this.lock = true;
            }
            $this.translateScroll();
            $this.showArrow();
        });
    },
    //箭头的touch事件
    liClick: function () {
        var $this = this;
        //页面滑动就不要触发箭头的touch事件
        if (this.isMove) {
            return
        }
        $('.go-next').on('touchend', function (event) {
            event.stopPropagation();
            if ($this.index < $this.pages.length - 1) {
                $this.index++;
                $this.translateScroll();
                $this.showArrow();
            }
        });
        $('.go-up').on('touchend', function (event) {
            event.stopPropagation();
            if ($this.index >=0) {
                $this.index--;
                $this.translateScroll();
                $this.showArrow();
            }

        });
    },
    //这里让动画滚动起来
    translateScroll: function () {
        var $this = this;
        $ul.css({
            transform: 'translateY(-' + $this.index + '00%)'
        });
        window.setTimeout(function () {
            $this.lock = false;
            $this.trigger('transitionEnd', [$this, $this.index]);
        }, 1000);
    },
    //这里调用是否显示箭头
    showArrow: function () {
        //
        if (this.index == 0) {
            this.flag = false;
        }
        //走到最后一页，显示向上的箭头
        if (this.index == this.pages.length - 1) {
            this.flag = true;
        }
        if (!this.flag && this.index < this.pages.length - 1) {
            $('.go-next').show();
            $('.go-up').hide();
        }
        if (this.flag && this.index > 0) {
            $('.go-up').show();
            $('.go-next').hide();
        }
    },
  //返回当前是第几页
    showPage: function () {
        return this.index
    }
};
//这里定义参数
var _default = {
    index: 0,
    //让动画锁住
    lock: false,
    //这里箭头向上向下的调用模式
    flag: false,
//是否滑动了
    isMove: false,
    startY: 0,
    moveEndY: 0,
    distanceY: 0,
    //用户自定义pages
    pages: []
};
//通过jquery的方式拓展了一个插件
$.fn.myFunction = function (option, height) {
    //myFunction被谁调用了,this就指向谁
    $.extend(this, proto);
    //先继承opt这个对象
    $.extend(this, _default);
    //在继承这个option参数覆盖上面的参数
    $.extend(this, option, height);
    this.init();
    this.touchDirection();
    this.liClick();
    this.isMusic();
    this.scrollMouse();
};
$(function () {

    animatePage1();
    fontPage1();
    //自定义transitionEnd事件，结束后执行回调函数
    $('#container').on('transitionEnd', function (event, container,index,ul) {
        if (index == 0) {
            animatePage1();
            fontPage1();
        } else {
            removeAnimate();
            removePage1()
        }
        //�ڶ�ҳ
        if (index == 1) {
            animatePage2();
        } else {
            removePage2()
        }

//����ҳ
        if (index == 2) {

        } else {

        }

//����ҳ
        if (index == 3) {
            addImage()
        } else {
            var hasDiv = document.getElementsByClassName('imgBox')[0];
            var parentEle = document.getElementById('page4');
            if (hasDiv) {
                parentEle.removeChild(hasDiv)
            }
        }
    }).myFunction(
        {
            pages: ["#page1", "#page2", "#page3", "#page4", "#page5"]
        }, {
            height: $('html').height()
        },{ele:$('#nav')}
    )
});
//屏幕自适应
//function autoBody(element) {
//    element.style.width = document.documentElement.clientWidth + 'px';
//    element.style.height = document.documentElement.clientHeight + 'px';
//}
//��һҳ����
function animatePage1() {
    $('#page1 img.fly1').animate({
        'right': 150,
        'top': 150
    }, 2000);
    $('#page1 img.fly2').animate({
        'right': 250,
        'top': 250
    }, 2000);

    $('#page1 img.fly3').animate({
        'right': 150,
        'top': 350
    }, 2000);
};
function fontPage1() {
    $('#page1 .personBox').animate({
        'marginTop': '100'
    }, 1000, function () {
        $('#page1 .footer').fadeIn(2000)
    })
}
function removePage1() {
    $('.personBox').animate({
        'marginTop': '-500'
    }, 100)
}
function removeAnimate() {
    $('#page1 img').animate({
        'right': 0,
        'top': 0
    }, 200);
}
//�ڶ�ҳ����
function animatePage2() {
    $('#page2').find('.personal').animate({
        marginLeft: 0
    }, 500, function () {
        $('.personal li').fadeIn(200)
    });
    $('#page2').find('.oneself').animate({
        marginRight: 0
    }, 500, function () {
        $('.oneself li').fadeIn(200);
    });
    $('#page2').find('.github ').fadeIn(2000);
}
function removePage2() {
    $('#page2').find('.personal').css({
        marginLeft: '-5000px'
    });
    $('#page2').find('.oneself').css({
        marginRight: '-5000px'
    });
    $('#page2').find('.github ').fadeOut(100);
}
//随机图片的生成
function addImage() {
    var parentEle = document.getElementById('page4');
    var imgList = document.createElement('div');
    imgList.className = 'imgBox';
    parentEle.appendChild(imgList);
    var imgArr = ['newMarried/bg1.jpg', 'newMarried/bg2.jpg', 'newMarried/bg3.jpg', 'newMarried/bg4.jpg', 'newMarried/bg5.jpg'];
    var angle = [-80, -40, -10, 10, 50, 80, 110];
    var index = 0;
    var cx = parentEle.clientWidth;
    var cy = parentEle.clientHeight;
    var timer = null;
    parentEle.onclick = function () {
        index++;
        var next = index % imgArr.length;
        var angleRandom = angle[Math.floor(Math.random() * angle.length)];
        x = (Math.random() * (cx - 400)) + 100;
        y = (Math.random() * (cy - 400)) + 100;
        var img = document.createElement('img');
        img.src = imgArr[next];
        img.style.left = x + 'px';
        img.style.top = y + 'px';
        img.style.transform = 'rotate(' + angleRandom + 'deg)';
        imgList.appendChild(img);
        if (index >= 10) {
            clearInterval(timer);
        }
    };
    timer = setInterval(parentEle.onclick, 200);
}


