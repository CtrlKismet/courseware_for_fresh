function numFromUpToDown(selector, delayTime) {
    $(selector).css('transform', 'translate(0,-100%)');
    setTimeout(function () {
        $(selector).css('transition', 'unset');
        $(selector).css('transform', 'none');
    }, delayTime);
    $(selector).css('transition', 'transform 0.3s ease-out');
}

function numFromDownToUp(selector, delayTime) {
    $(selector).css('transform', 'translate(0,100%)');
    setTimeout(function () {
        $(selector).css('transition', 'unset');
        $(selector).css('transform', 'none');
    }, delayTime);
    $(selector).css('transition', 'transform 0.3s ease-out');
}

let v = new Vue({
    el: ".allPage",
    data: {
        show_page: [true, false, false, false, false, false, false, false, false],
        pre_page: 0,
        now_page: 0,
        max_page: 10,
        time_h1: [0, 0],
        time_h2: [0, 0],
        time_m1: [0, 0],
        time_m2: [0, 0],
        time_s1: [0, 0],
        time_s2: [0, 0],
    },
    methods: {
        getPrePage: function () {
            if (v.now_page == 0) return;
            v.pre_page = v.now_page;
            Vue.set(v.show_page, v.now_page, false);
            v.now_page--;
            Vue.set(v.show_page, v.now_page, true);
            numFromDownToUp('body>div.allPage>div.pagecnt>span:nth-child(1)', 310);
            setTimeout("v.pre_page = v.now_page", 310);
        },
        getNextPage: function () {
            if (v.now_page == v.max_page - 1) return;
            v.pre_page = v.now_page;
            Vue.set(v.show_page, v.now_page, false);
            v.now_page++;
            Vue.set(v.show_page, v.now_page, true);
            numFromUpToDown('body>div.allPage>div.pagecnt>span:nth-child(1)', 310);
            setTimeout("v.pre_page = v.now_page", 310);
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
            }
            else if (flag == "h") {
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
                }
                else if (flag == "h") {
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
                }
                else if (flag == "h") {
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
        numFromDownToUp('body>div.allPage>div.timeNow>span:nth-child(1)', dlyTime);
        setTimeout("Vue.set(v.time_h1, 1, v.time_h1[0])", dlyTime);
    }
    if (v.time_h2[0] != tme.getHours() % 10) {
        Vue.set(v.time_h2, 0, tme.getHours() % 10);
        numFromDownToUp('body>div.allPage>div.timeNow>span:nth-child(2)', dlyTime);
        setTimeout("Vue.set(v.time_h2, 1, v.time_h2[0])", dlyTime);
    }
    if (v.time_m1[0] != parseInt(tme.getMinutes() / 10)) {
        Vue.set(v.time_m1, 0, parseInt(tme.getMinutes() / 10));
        numFromDownToUp('body>div.allPage>div.timeNow>span:nth-child(4)', dlyTime);
        setTimeout("Vue.set(v.time_m1, 1, v.time_m1[0])", dlyTime);
    }
    if (v.time_m2[0] != tme.getMinutes() % 10) {
        Vue.set(v.time_m2, 0, tme.getMinutes() % 10);
        numFromDownToUp('body>div.allPage>div.timeNow>span:nth-child(5)', dlyTime);
        setTimeout("Vue.set(v.time_m2, 1, v.time_m2[0])", dlyTime);
    }
    if (v.time_s1[0] != parseInt(tme.getSeconds() / 10)) {
        Vue.set(v.time_s1, 0, parseInt(tme.getSeconds() / 10));
        numFromDownToUp('body>div.allPage>div.timeNow>span:nth-child(7)', dlyTime);
        setTimeout("Vue.set(v.time_s1, 1, v.time_s1[0])", dlyTime);
    }
    if (v.time_s2[0] != parseInt(tme.getSeconds() % 10)) {
        Vue.set(v.time_s2, 0, parseInt(tme.getSeconds() % 10));
        numFromDownToUp('body>div.allPage>div.timeNow>span:nth-child(8)', dlyTime);
        setTimeout("Vue.set(v.time_s2,  1, v.time_s2[0])", dlyTime);
    }
    setTimeout("getTime()", 500);
}

window.onload = function () {
    $('.allPage').focus();
    getTime();
}