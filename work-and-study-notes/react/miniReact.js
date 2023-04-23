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
    createDom(element, container) {
        const dom = element.type === ELEMENT_TYPE.TEXT_ELEMENT
            ? document.createTextNode("")
            : document.createElement(element.type);

        const isProperty = key => key !== "children";
        Object.keys(element.props)
            .filter(isProperty)
            .forEach(name => {
               dom[name] = element.props[name];
            });

        // element.props.children.forEach(child=> {
        //     this.render(child, dom);
        // });
        //
        // container.appendChild(dom);
        return dom;
    },
    wipRoot: null,
    render(element, container) {
        // 本来render()是进行DOM的创建！现在改为nextUnitOfWork的赋值
        // DOM的详细创建方法调用放在performUnitOfWork()中
        // DOM的详细创建方法放在createDOM()中
        this.wipRoot = {
            dom: container,
            props: {
                children: [element]
            }
        }
        this.nextUnitOfWork = this.wipRoot;
    },
    commitRoot() {
        this.commitWork(this.wipRoot.child);
        this.wipRoot = null;
    },
    commitWork(fiber) {
        if(!fiber) return;

        const domParent = fiber.parent.dom;
        domParent.appendChild(fiber.dom);
        this.commitWork(fiber.child);
        this.commitRoot(fiber.sibling);
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

        if(!this.nextUnitOfWork && this.wipRoot) {
            commitRoot();
        }

        // 如果剩余时间不够了，则调用requestIdleCallback等待浏览器有空闲时间再执行
        requestIdleCallback(this.workLoop);
    },
    performUnitOfWork(fiber) {
        // 执行每一个unit的任务：
        if(!fiber.dom) {
            fiber.dom = this.createDom(fiber);
        }

        // if(fiber.parent) {
        //     fiber.parent.dom.appendChild(fiber.dom);
        // }

        // 新的fiber先寻找它的children数据
        const elements = fiber.props.children;
        let index = 0;
        let prevSibling = null;

        while(index < elements.length) {
            const element = elements[i];

            const newFiber = {
                type: element.type,
                props: element.props,
                parent: fiber,
                dom: null
            }

            if(index === 0) {
                fiber.child = newFiber;
            } else {
                // 此时prevSibling是newFiber的左边元素
                prevSibling.sibling = newFiber;
            }

            prevSibling = newFiber;
            index++;
        }

        if(fiber.child) {
            return fiber.child;
        }

        let nextFiber = fiber;
        while(nextFiber) {
            // 新的fiber先寻找它的sibling数据
            if(nextFiber.sibling) {
                return nextFiber.sibling;
            }
            // 没有children，没有sibling，则直接找它的parent
            nextFiber = nextFiber.parent;
        }
    }

};



const element = miniReact.createElement(
    "div",
    {id: "foo"},
    miniReact.createElement("a", null, "bar"),
    miniReact.createElement("b")
)
const container = document.getElementById("root")
miniReact.render(element, container);
