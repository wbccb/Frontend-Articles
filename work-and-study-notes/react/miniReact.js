window.requestIdleCallback = window.requestIdleCallback || function(handler) {
    // 这个并不是 polyfill ，因为它在功能上并不相同； setTimeout() 并不会让你利用空闲时段，
    // 而是使你的代码在情况允许时执行你的代码，以使我们可以尽可能地避免造成用户体验性能表现延迟的后果
    // https://developer.mozilla.org/zh-CN/docs/Web/API/Background_Tasks_API#%E5%9B%9E%E9%80%80%E5%88%B0_settimeout
    let startTime = Date.now();

    return setTimeout(function() {
        handler({
            didTimeout: false,
            timeRemaining: function() {
                return Math.max(0, 50.0 - (Date.now() - startTime));
            }
        });
    }, 1);
}

const ELEMENT_TYPE = {
    TEXT_ELEMENT: "TEXT_ELEMENT"
}

const miniReact = {
    createTextElement(text) {
        return {
            type: ELEMENT_TYPE.TEXT_ELEMENT,
            props: {
                nodeValue: text,
                children: []
            }
        }
    },
    createElement(type, props, ...children) {
        const newChildren = children.map(child =>
            typeof child === "object"
                ? child
                : this.createTextElement(child));
        return {
            type,
            props: {
                ...props,
                children: newChildren
            }
        }
    },
    render(element, container) {
        const dom = element.type === ELEMENT_TYPE.TEXT_ELEMENT
            ? document.createTextNode("")
            : document.createElement(element.type);

        const isProperty = key => key !== "children";
        Object.keys(element.props)
            .filter(isProperty)
            .forEach(name => {
               dom[name] = element.props[name];
            });

        element.props.children.forEach(child=> {
            this.render(child, dom);
        });

        container.appendChild(dom);
    },
    nextUnitOfWork: null,
    workLoop(deadline) {
        // 检测当前浏览器剩余时间是否能够执行一个unit的任务
        // 如果不能，则触发requestIdleCallback()等待浏览器的下一个空闲时间
        let shouldYield = false;
        while(this.nextUnitOfWork && !shouldYield) {
            // 剩余时间足够的前提下，执行performUnitOfWork()执行一个unit的任务
            this.nextUnitOfWork = this.performUnitOfWork(this.nextUnitOfWork);

            // 剩余时间足够的话：shouldYield=false
            shouldYield = deadline.timeRemaining() < 1;
        }

        // 如果剩余时间不够了，则调用requestIdleCallback等待浏览器有空闲时间再执行
        requestIdleCallback(this.workLoop);
    },
    performUnitOfWork(nextUnitOfWork) {
        // 执行每一个unit的任务
    }
};

// 调用requestIdleCallback等待浏览器有空闲时间再执行
requestIdleCallback(miniReact.workLoop);

const element = miniReact.createElement(
    "div",
    {id: "foo"},
    miniReact.createElement("a", null, "bar"),
    miniReact.createElement("b")
)
const container = document.getElementById("root")
miniReact.render(element, container);
