# 核心概念
1. Custom Elements
2. Shadow DOM
3. HTML templates

> Polyfill是一个js库，主要抚平不同浏览器之间对js实现的差异。
>`https://github.com/webcomponents/polyfills/tree/master/packages/webcomponentsjs`可以抹平不同浏览器对于WebComponent的差异

# Custom Elements

## 定义
使用JS/HTML/CSS来创建自定义html标签，内部封装好逻辑和UI，就像其他内置的HTML标签一样可直接引用。同时，提供了生命周期钩子函数，以便在适当的时机进行调用

## 生命周期

Web Components 也有属于自己的生命周期钩子函数，当我们定义一个元素时，它会在元素的不同阶段触发它们，为：

- connectedCallback：当 custom element 首次被插入文档 DOM 时，被调用。
- disconnectedCallback：当 custom element 从文档 DOM 中删除时，被调用。
- adoptedCallback：当 custom element 被移动到新的文档时，被调用。
- attributeChangedCallback: 当 custom element 增加、删除、修改自身属性时，被调用。

## 示例
```
// components-div.js
class ComponentsDiv extends HTMLElement {
  constructor() {
    super();
    this.render();
  }

  render() {
    const shadow = this.attachShadow({ mode: 'open' });
    const dom = document.createElement('div');
    const style = document.createElement('style');
    dom.textContent = 'components-div';
    style.textContent = `
      div {
        color: red;
      }
    `;
    shadow.appendChild(style);
    shadow.appendChild(dom);
  }
}

// 注册组件
customElements.define('components-div', ComponentsDiv)
```


# Shadow DOM

## 示例
> 下图来自 https://juejin.cn/post/7153521106916212744

![video-shadow-dom](https://wbccb.github.io/Frontend-Articles/image/webpack-component.png)

## 说明
操作 Shadow DOM 就和我们操作普通的 DOM 是一样的，可以为 Shadow DOM 添加属性、样式、子节点，也可以为子节点添加样式。但是不同的是 Shadow DOM 内部的元素不会影响到它外部的元素。Web components 的封装能力 Shadow DOM 是最关键的一环，Shadow DOM 可以将标记结构、样式和行为隐藏起来，并与页面上的其他代码相隔离，保证不同的部分不会混在一起，可使代码更加干净、整洁。

## 用法

### 核心代码
```javascript
const shadow = this.attachShadow({ mode: 'open' });
shadow.appendChild(xxxx);
```
### 示例
为目前的WebComponent创建专属的样式和布局
```javascript
constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    const dom = document.createElement('div');
    const style = document.createElement('style');
    dom.textContent = 'components-div';
    style.textContent = `
      div {
        color: red;
      }
    `;
    shadow.appendChild(style);
    shadow.appendChild(dom);
}
```

# HTML templates

## 定义
template 是 Web Components API 提供的一个标签，它的特性就是包裹在 template 中的 HTML 片段不会在页面加载的时候解析渲染，但是可以被 js 访问到，进行一些插入显示等操作。

> 注：Web Components 使用 HTML template 其实和在 Vue 中使用 template 类似。 Web Components提供了组件模板达到复用的目的，另外还包含slot功能，可以给slot指定名字变成具名slot，跟Vue里slot的用法一毛一样

> 备注： 模板在浏览器中的支持情况很好



# 参考文章
1. [WebComponent多个参数解释](https://juejin.cn/post/7153521106916212744)