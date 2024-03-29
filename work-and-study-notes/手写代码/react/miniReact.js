// 本文是为了更加理解https://pomb.us/build-your-own-react/的整体流程，所以自己手写的代码
// 整体功能没有进行测试是否跑通，不能作为生产环境使用，可以直接使用
// https://codesandbox.io/s/didact-8-21ost
// 作为生产环境的代码使用


window.requestIdleCallback = window.requestIdleCallback || function (handler) {
    // 这个并不是 polyfill ，因为它在功能上并不相同； setTimeout() 并不会让你利用空闲时段，
    // 而是使你的代码在情况允许时执行你的代码，以使我们可以尽可能地避免造成用户体验性能表现延迟的后果
    // https://developer.mozilla.org/zh-CN/docs/Web/API/Background_Tasks_API#%E5%9B%9E%E9%80%80%E5%88%B0_settimeout
    let startTime = Date.now();

    return setTimeout(function () {
        handler({
            didTimeout: false,
            timeRemaining: function () {
                return Math.max(0, 50.0 - (Date.now() - startTime));
            }
        });
    }, 1);
}

const ELEMENT_TYPE = {
    TEXT_ELEMENT: "TEXT_ELEMENT"
}

const miniReact = {
    hookIndex: null,
    wipFiber: null,
    useState(initial) {
        // 是否之前就存在该hook
        const oldHook =
            this.wipFiber.alternate &&
            this.wipFiber.alternate.hooks &&
            this.wipFiber.alternate.hooks[this.hookIndex];
        const hook = {
            state: oldHook ? oldHook.state : initial,
            queue: []
        }

        const setState = (action) => {
            hook.queue.push(action);

            // 模仿render()函数
            this.wipRoot = {
                dom: this.currentRoot.dom,
                props: this.currentRoot.props,
                alternate: this.currentRoot
            }
            this.nextUnitOfWork = this.wipRoot;
            this.deletions = [];
        }

        this.wipFiber.hooks.push(hook);
        this.hookIndex++;
        return [hook.state, setState];
    },
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
    currentRoot: null,
    render(element, container) {
        // 本来render()是进行DOM的创建！现在改为nextUnitOfWork的赋值
        // DOM的详细创建方法调用放在performUnitOfWork()中
        // DOM的详细创建方法放在createDOM()中
        this.wipRoot = {
            dom: container,
            props: {
                children: [element]
            },
            alternate: this.currentRoot
        }
        this.deletions = [];
        this.nextUnitOfWork = this.wipRoot;
    },
    commitRoot() {
        this.deletions.forEach(this.commitWork);
        this.commitWork(this.wipRoot.child);
        this.currentRoot = this.wipRoot;
        this.wipRoot = null;
    },
    commitWork(fiber) {
        if (!fiber) return;

        let domParentFiber = fiber.parent;
        while (!domParentFiber.dom) {
            domParentFiber = domParentFiber.parent;
        }

        const domParent = domParentFiber.dom;
        // 以前这里只有新增的逻辑，现在我们要完善更新和删除逻辑
        if (fiber.effectTag === "PLACEMENT" && fiber.dom !== null) {
            // 新增逻辑
            domParent.appendChild(fiber.dom);
        } else if (fiber.effectTag === "PLACEMENT" && fiber.dom !== null) {
            this.updateDom(
                fiber.dom,
                fiber.alternate.props,
                fiber.props
            );
        } else if (fiber.effectTag === "DELETION") {
            this.commitDelete(fiber, domParent);
        }

        this.commitWork(fiber.child);
        this.commitRoot(fiber.sibling);
    },
    commitDelete(fiber, domParent) {
        if (fiber.dom) {
            domParent.removeChild(fiber.dom);
        } else {
            this.commitDelete(fiber.child, domParent);
        }
    },
    updateDom(dom, prevProps, nextProps) {
        const isProperty = key => key !== "children";
        const isGone = (prev, next) => key => !(key in next);
        const isAddOrUpdate = (prev, next) => key => prev[key] !== next[key];
        const isEvent = key => key.startsWith("on")


        // 特殊处理事件on
        Object.keys(prevProps)
            .filter(isEvent)
            .filter((key) => {
                return !(key in nextProps) || isAddOrUpdate(prevProps, nextProps)
            })
            .forEach(name => {
                // name=onClick onTouch等等
                const eventType = name.toLowerCase().substring(2);
                dom.removeEventListener(eventType, prevProps[name]);
            });


        // 删除旧的props
        Object.keys(prevProps)
            .filter(isProperty)
            .filter(isGone(prevProps, nextProps))
            .forEach(name => {
                dom[name] = "";
            });

        // 特殊处理事件on
        Object.keys(nextProps)
            .filter(isEvent)
            .filter(isAddOrUpdate(prevProps, nextProps))
            .forEach(name => {
                const eventType = name.toLowerCase().substring(2);
                dom.addEventListener(eventType, nextProps[name]);
            })

        // 赋值新的props
        Object.keys(nextProps)
            .filter(isProperty)
            .filter(isAddOrUpdate(prevProps, nextProps))
            .forEach(name => {
                dom[name] = nextProps[name];
            });
    },
    nextUnitOfWork: null,
    workLoop(deadline) {
        // 检测当前浏览器剩余时间是否能够执行一个unit的任务
        // 如果不能，则触发requestIdleCallback()等待浏览器的下一个空闲时间
        let shouldYield = false;
        while (this.nextUnitOfWork && !shouldYield) {
            // 剩余时间足够的前提下，执行performUnitOfWork()执行一个unit的任务
            this.nextUnitOfWork = this.performUnitOfWork(this.nextUnitOfWork);

            // 剩余时间足够的话：shouldYield=false
            shouldYield = deadline.timeRemaining() < 1;
        }

        if (!this.nextUnitOfWork && this.wipRoot) {
            this.commitRoot();
        }

        // 如果剩余时间不够了，则调用requestIdleCallback等待浏览器有空闲时间再执行
        requestIdleCallback(this.workLoop);
    },
    deletions: [],
    // 还是按照child->sibling的顺序寻找新的fiber，只是会检测能否复用之前的DOM
    reconcileChildren(wipFiber, elements) {
        let index = 0;
        let oldFiber = wipFiber.alternate && wipFiber.alternate.child;
        let prevSibling = null;

        while (index < elements.length) {
            const element = elements[i];

            const sameType = oldFiber && element && element.type === oldFiber.type;
            let newFiber = null;

            if (sameType) {
                newFiber = {
                    type: oldFiber.type,
                    props: element.props,
                    dom: oldFiber.dom,
                    parent: wipFiber,
                    alternate: oldFiber,
                    efectTag: "UPDATE"
                }
            } else if (element && !sameType) {
                newFiber = {
                    type: element.type,
                    props: element.props,
                    dom: null,
                    parent: wipFiber,
                    alternate: null,
                    effectTag: "PLACEMENT"
                }
            } else if (oldFiber && !sameType) {
                oldFiber.effectTag = "DELETION";
                this.deletions.push(oldFiber);
            }


            if (index === 0) {
                wipFiber.child = newFiber;
            } else {
                // 此时prevSibling是newFiber的左边元素
                prevSibling.sibling = newFiber;
            }

            prevSibling = newFiber;
            index++;
        }
    },
    updateFunctionComponent(fiber) {
        // useState放在Component中，hooks是跟fiber进行绑定，考虑最简单情况
        // 只有一个useXXX，只有一个function Component，因此只需要一个wipFiber
        this.wipFiber = fiber;
        this.hookIndex = 0;
        this.wipFiber.hooks = [];

        const children = [fiber.type(fiber.props)];
        this.reconcileChildren(fiber, elements);
    },
    updateHostComponent(fiber) {
        if (!fiber.dom) {
            fiber.dom = this.createDom(fiber);
        }
        const elements = fiber.props.children;
        // 区分哪些能够复用哪些要删除哪些要新增
        this.reconcileChildren(fiber, elements);
    },
    performUnitOfWork(fiber) {
        // 执行每一个unit的任务：
        const isFunctionComponent = fiber.type instanceof Function;

        if (isFunctionComponent) {
            this.updateFunctionComponent(fiber);
        } else {
            this.updateHostComponent(fiber);
        }

        // if(fiber.parent) {
        //     fiber.parent.dom.appendChild(fiber.dom);
        // }


        if (fiber.child) {
            return fiber.child;
        }

        let nextFiber = fiber;
        while (nextFiber) {
            // 新的fiber先寻找它的sibling数据
            if (nextFiber.sibling) {
                return nextFiber.sibling;
            }
            // 没有children，没有sibling，则直接找它的parent
            nextFiber = nextFiber.parent;
        }
    }

};

/** @jsx Didact.createElement */
function Counter() {
    const [state, setState] = miniReact.useState(1)
    return (
        <h1 onClick={() => setState(c => c + 1)}>
            Count: {state}
        </h1>
    )
}

const element1 = <Counter/>


const element = miniReact.createElement(
    "div",
    {id: "foo"},
    miniReact.createElement("a", null, "bar"),
    miniReact.createElement("b"),
    element1
)
const container = document.getElementById("root")
miniReact.render(element, container);
