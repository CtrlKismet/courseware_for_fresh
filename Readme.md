# 科协九点半第一周ppt（web端）

## 学到的知识

``` css
span::before {
    content:attr(data-before);
}

span::after {
    content:attr(data-after);
}
```

`<span data-before="Pre" data-after="Nxt"></span>`

选择器before以及after是在当前元素的前方/后方插入一个相同的tag
可以用于制作数字滚动效果（详见html效果）

翻转动画的制作（详见html以及css）

[html常见特殊字符](https://blog.csdn.net/bluestarf/article/details/40652011)