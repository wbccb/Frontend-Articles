// 事件捕获：事件从最外层触发，直到找到最具体的元素。
// 如上面的代码，在事件捕获下，如果点击p标签，click 事件的顺序应该是 document->html->body->div->p

// 事件冒泡：事件会从最内层的元素开始发生，一直向上传播，直到触发 document 对象。
// 因此在事件冒泡下，p 元素发生 click 事件的顺序为 p->div->body->html->document

// element.addEventListener(event, function, useCapture)
// 第三个参数是：默认值是 false ，表示在 事件冒泡阶段 调用事件处理函数；如果设置为 true ，则表示在 事件捕获阶段 调用事件处理函数。

// 为什么要使用事件代理？
// 比如100个（甚至更多）li 标签绑定事件，如果一个一个绑定，不仅相当麻烦，还会占用大量的内存空间，降低性能。

// 而使用事件代理作用如下：
// 代码简洁
// 减少浏览器内存占用

// 事件代理的原理：
// 事件代理（事件委托）是利用事件的冒泡原理来实现的，比如当我们点击内容的li标签时，会冒泡到外层的ul标签上。
// 因此，当我们想给很多个li标签添加事件的时候，可以给他的父级元素添加对应的事件，当触发任意li元素时，会冒泡到其父级元素，这时绑定在父级元素的事件就会被触发，这就是事件代理（委托），委托他们的父级元素代为执行事件。

<div id="box">
    <a id="a1" href='#'>a1</a>
    <a id="a2" href='#'>a2</a>
    <a id="a3" href='#'>a3</a>
    <a id="a4" href='#'>a4</a>
    <a id="a5" href='#'>a5</a>
    <a id="a6" href='#'>a6</a>
    <input/>
    <button type="button" id='addA'>增加a标签</button>
</div>


function bindEvent(parent, eventType, selectorDom, fn) {
    if(fn === undefined) {
        fn = selectorDom;
        selectorDom = null;
    }

    parent.addEventListener(eventType, (event)=> {
       const target = event.target;
       if(selectorDom) {
           if(target.matches(selectorDom)) {
               fn.call(target, event);
           } else {
               // 筛选失败，不执行什么操作
           }
       } else {
           fn.call(target, event);
       }
    });
}

var parent = document.getElementById("box");
bindEvent(parent, "click", "A", (event) => {
    // 点击某一个子元素，过滤<a>标签，其它都被过滤掉
    console.log(event.target.innerHTML);
});