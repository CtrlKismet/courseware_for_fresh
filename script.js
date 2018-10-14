function numMove(selector, moveX, moveY, delayTime) {
    //从左往右       100% 0
    //从右往左      -100% 0
    //从上往下      0  100%
    //从下往上      0 -100%
    $(selector).css('transform', 'translate(' + moveX + '%,' + moveY + '%)');
    setTimeout(function () {
        $(selector).css('transition', 'unset');
        $(selector).css('transform', 'none');
    }, delayTime);
    $(selector).css('transition', 'transform 0.3s ease-out');
}

var t1;
$(function () {
    t1 = new TimelineMax();
    t1.stop();
    t1.add('state0');
    var aniTime = 0.1;
    for (var i = 1; i < 4; i++) {
        t1.staggerTo('#sortedNum' + i, aniTime, {
            opacity: 0
        });
        t1.add('state' + i);
    }

    t1.staggerTo('span[id^=sortedNum]', aniTime, {
        opacity: 1
    });
    t1.add('state4');

    t1.staggerTo('#sortedNum1', aniTime, {
        opacity: 0
    });
    t1.staggerTo('#sortedNum2', aniTime, {
        opacity: 0
    }, -1);
    t1.add('state5');

    t1.staggerTo('#sortedNum3', aniTime, {
        opacity: 0
    });
    t1.staggerTo('#sortedNum5', aniTime, {
        opacity: 0
    }, -1);
    t1.add('state6');

    t1.staggerTo('span[id^=sortedNum]', aniTime, {
        opacity: 1
    });
    t1.add('state7');

    t1.staggerTo('li#another', aniTime * 10, {
        opacity: 1
    });
    t1.add('state8');

    t1.staggerTo('#sortedNum1', aniTime, {
        opacity: 0
    });
    t1.staggerTo('#sortedNum2', aniTime, {
        opacity: 0
    }, -1);
    t1.add('state9');

    t1.staggerTo('#sortedNum3', aniTime, {
        opacity: 0
    });
    t1.staggerTo('#sortedNum5', aniTime, {
        opacity: 0
    }, -1);
    t1.add('state10');

    t1.staggerTo('span[id^=sortedNum]', aniTime, {
        opacity: 1
    });
    t1.add('state11');
});

let v = new Vue({
    el: ".allPage",
    data: {
        /*用于旋转*/
        show_page: [true, false, false, false, false, false, false, false, false, true],

        /*用于翻页*/
        pre_page: 9,
        now_page: 9,
        max_page: 10,

        /*用于时间*/
        time_h1: [0, 0],
        time_h2: [0, 0],
        time_m1: [0, 0],
        time_m2: [0, 0],
        time_s1: [0, 0],
        time_s2: [0, 0],

        /*用于第2页(问答)*/
        choose_ans: 0,
        answer: ["", "A:顾名思义，程序设计竞赛就是一个或者多个同学在规定的时间内通过编写计算机程序来解决问题的比赛。",
            "A:举个简单的例子，要求你输入一个整数n，输出1~n的整数之和。",
            "A:所写的程序必须在规定时间内（一般是1s）得出结果。",
            "A:一般的说我们学院的院赛（大一），学校的校赛（全校）；如果加入我们学校的ACM集训队能接触更多的比赛；还有一些社会性的比赛，比如百度每年举办的“百度之星”。",
            "A:有德育分，同时也是一种个人荣誉的体现，有些比赛还会有奖金。",
            "A:有一台电脑以及一颗愿意学习的心就好了" + '\u263A'
        ],

        /*用于猜数字游戏*/
        game_cnt1: 0,
        game_cnt2: 0,
        game_cnt3: 0,

        /*用于二分法动画演示*/
        frame_cnt: 0,

        /*用于快速幂解法切换*/
        sol_flag: -1,
        calc_cnt: 0
    },
    methods: {
        /*翻页（同时进行页码变化）*/
        getPrePage: function () {
            if (v.now_page == 0) return;
            clearFlag();
            v.pre_page = v.now_page;
            Vue.set(v.show_page, v.now_page, false);
            v.now_page--;
            Vue.set(v.show_page, v.now_page, true);
            numMove('body>div.allPage>div.pagecnt>span:nth-child(1)', 0, 100, 310);
            setTimeout("v.pre_page = v.now_page", 310);
        },
        getNextPage: function () {
            if (v.now_page == v.max_page - 1) return;
            clearFlag();
            v.pre_page = v.now_page;
            Vue.set(v.show_page, v.now_page, false);
            v.now_page++;
            Vue.set(v.show_page, v.now_page, true);
            numMove('body>div.allPage>div.pagecnt>span:nth-child(1)', 0, -100, 310);
            setTimeout("v.pre_page = v.now_page", 310);
        },
        /*问答*/
        changeAns: function (ans) {
            $('#page-1 > div.answer').css("transform", "scale(0)");
            setTimeout(function () {
                v.choose_ans = ans;
                $('#page-1 > div.answer').css("transform", "scale(1)");
            }, 400);
        },
        /*二分法动画演示*/
        playFrame: function () {
            if (v.frame_cnt > 10) return;
            t1.tweenTo('state' + (++v.frame_cnt));
        }
    }
});

/*背景动画*/
$(function () {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var cw = canvas.width = window.innerWidth,
        cx = cw / 2;
    var ch = canvas.height = window.innerHeight,
        cy = ch / 2;

    ctx.fillStyle = "#000";
    var linesNum = 16;
    var linesRy = [];
    var requestId = null;

    class Line {
        constructor(flag) {
            this.flag = flag;
            this.a = {};
            this.b = {};
            if (flag == "v") {
                this.a.y = 0;
                this.b.y = ch;
                this.a.x = randomIntFromInterval(0, ch);
                this.b.x = randomIntFromInterval(0, ch);
            } else if (flag == "h") {
                this.a.x = 0;
                this.b.x = cw;
                this.a.y = randomIntFromInterval(0, cw);
                this.b.y = randomIntFromInterval(0, cw);
            }
            this.va = randomIntFromInterval(25, 100) / 100;
            this.vb = randomIntFromInterval(25, 100) / 100;
            this.draw = function () {
                ctx.strokeStyle = "#ccc";
                ctx.beginPath();
                ctx.moveTo(this.a.x, this.a.y);
                ctx.lineTo(this.b.x, this.b.y);
                ctx.stroke();
            };
            this.update = function () {
                if (this.flag == "v") {
                    this.a.x += this.va;
                    this.b.x += this.vb;
                } else if (flag == "h") {
                    this.a.y += this.va;
                    this.b.y += this.vb;
                }
                this.edges();
            };
            this.edges = function () {
                if (this.flag == "v") {
                    if (this.a.x < 0 || this.a.x > cw) {
                        this.va *= -1;
                    }
                    if (this.b.x < 0 || this.b.x > cw) {
                        this.vb *= -1;
                    }
                } else if (flag == "h") {
                    if (this.a.y < 0 || this.a.y > ch) {
                        this.va *= -1;
                    }
                    if (this.b.y < 0 || this.b.y > ch) {
                        this.vb *= -1;
                    }
                }
            };
        }
    }

    for (var i = 0; i < linesNum; i++) {
        var flag = i % 2 == 0 ? "h" : "v";
        var l = new Line(flag);
        linesRy.push(l);
    }

    function Draw() {
        requestId = window.requestAnimationFrame(Draw);
        ctx.clearRect(0, 0, cw, ch);

        for (var i = 0; i < linesRy.length; i++) {
            var l = linesRy[i];
            l.draw();
            l.update();
        }
        for (var i = 0; i < linesRy.length; i++) {
            var l = linesRy[i];
            for (var j = i + 1; j < linesRy.length; j++) {
                var l1 = linesRy[j]
                Intersect2lines(l, l1);
            }
        }
    }

    function Init() {
        linesRy.length = 0;
        for (var i = 0; i < linesNum; i++) {
            var flag = i % 2 == 0 ? "h" : "v";
            var l = new Line(flag);
            linesRy.push(l);
        }

        if (requestId) {
            window.cancelAnimationFrame(requestId);
            requestId = null;
        }

        cw = canvas.width = window.innerWidth,
            cx = cw / 2;
        ch = canvas.height = window.innerHeight,
            cy = ch / 2;

        Draw();
    };

    setTimeout(function () {
        Init();

        addEventListener('resize', Init, false);
    }, 15);

    function Intersect2lines(l1, l2) {
        var p1 = l1.a,
            p2 = l1.b,
            p3 = l2.a,
            p4 = l2.b;
        var denominator = (p4.y - p3.y) * (p2.x - p1.x) - (p4.x - p3.x) * (p2.y - p1.y);
        var ua = ((p4.x - p3.x) * (p1.y - p3.y) - (p4.y - p3.y) * (p1.x - p3.x)) / denominator;
        var ub = ((p2.x - p1.x) * (p1.y - p3.y) - (p2.y - p1.y) * (p1.x - p3.x)) / denominator;
        var x = p1.x + ua * (p2.x - p1.x);
        var y = p1.y + ua * (p2.y - p1.y);
        if (ua > 0 && ub > 0) {
            markPoint({
                x: x,
                y: y
            })
        }
    }

    function markPoint(p) {
        ctx.beginPath();
        // ctx.fillStyle = "#79797963";
        // ctx.arc(p.x, p.y, 1, 0, 2 * Math.PI);
        ctx.fill();
    }

    function randomIntFromInterval(mn, mx) {
        return ~~(Math.random() * (mx - mn + 1) + mn);
    }
});

function getTime() {
    var tme = new Date();
    var dlyTime = 500;
    if (v.time_h1[0] != parseInt(tme.getHours() / 10)) {
        Vue.set(v.time_h1, 0, parseInt(tme.getHours() / 10));
        numMove('body>div.allPage>div.timeNow>span:nth-child(1)', 0, 100, dlyTime);
        setTimeout("Vue.set(v.time_h1, 1, v.time_h1[0])", dlyTime);
    }
    if (v.time_h2[0] != tme.getHours() % 10) {
        Vue.set(v.time_h2, 0, tme.getHours() % 10);
        numMove('body>div.allPage>div.timeNow>span:nth-child(2)', 0, 100, dlyTime);
        setTimeout("Vue.set(v.time_h2, 1, v.time_h2[0])", dlyTime);
    }
    if (v.time_m1[0] != parseInt(tme.getMinutes() / 10)) {
        Vue.set(v.time_m1, 0, parseInt(tme.getMinutes() / 10));
        numMove('body>div.allPage>div.timeNow>span:nth-child(4)', 0, 100, dlyTime);
        setTimeout("Vue.set(v.time_m1, 1, v.time_m1[0])", dlyTime);
    }
    if (v.time_m2[0] != tme.getMinutes() % 10) {
        Vue.set(v.time_m2, 0, tme.getMinutes() % 10);
        numMove('body>div.allPage>div.timeNow>span:nth-child(5)', 0, 100, dlyTime);
        setTimeout("Vue.set(v.time_m2, 1, v.time_m2[0])", dlyTime);
    }
    if (v.time_s1[0] != parseInt(tme.getSeconds() / 10)) {
        Vue.set(v.time_s1, 0, parseInt(tme.getSeconds() / 10));
        numMove('body>div.allPage>div.timeNow>span:nth-child(7)', 0, 100, dlyTime);
        setTimeout("Vue.set(v.time_s1, 1, v.time_s1[0])", dlyTime);
    }
    if (v.time_s2[0] != parseInt(tme.getSeconds() % 10)) {
        Vue.set(v.time_s2, 0, parseInt(tme.getSeconds() % 10));
        numMove('body>div.allPage>div.timeNow>span:nth-child(8)', 0, 100, dlyTime);
        setTimeout("Vue.set(v.time_s2,  1, v.time_s2[0])", dlyTime);
    }
    setTimeout("getTime()", 500);
}

function clearFlag() {
    if (v.frame_cnt != 0) {
        t1.reverse();
        t1.seek('state0');
        t1.reverse();
    }
    v.choose_ans = v.game_cnt1 = v.game_cnt2 = v.game_cnt3 = v.frame_cnt = v.calc_cnt = 0;
    v.sol_flag = -1;
    $('#page-1 .answer').css('transform',"scale(0)");
}

window.onload = function () {
    $('.allPage').focus();
    getTime();
}