# Web Component

Web Component 是一套不同的技术，允许你创建可重用的定制元素（它们的功能封装在你的代码之外）并且在你的 web 应用中使用它们。

Web Components 由三项主要技术组成，它们可以一起使用来创建封装功能的定制元素，可以在你喜欢的任何地方重用，不必担心代码冲突。

1. Custom element:一组 JavaScript API，允许您定义 custom elements 及其行为，然后可以在您的用户界面中按照需要使用它们
2. Shadow DOM：一组 JavaScript API，用于将封装的“影子”DOM 树附加到元素（与主文档 DOM 分开呈现）并控制其关联的功能。通过这种方式，您可以保持元素的功能私有，这样它们就可以被脚本化和样式化，而不用担心与文档的其他部分发生冲突
3. HTML template： `<template>` 和 `<slot>` 元素使您可以编写不在呈现页面中显示的标记模板。然后它们可以作为自定义元素结构的基础被多次重用。

实现 web component 的基本方法通常如下所示：

创建一个类或函数来指定 web 组件的功能，如果使用类，请使用 ECMAScript 2015 的类语法 (参阅类获取更多信息)。
使用 `CustomElementRegistry.define()` 方法注册您的新自定义元素，并向其传递要定义的元素名称、指定元素功能的类、以及可选的其所继承自的元素。
如果需要的话，使用 `Element.attachShadow()` 方法将一个 shadow DOM 附加到自定义元素上。使用通常的 DOM 方法向 shadow DOM 中添加子元素、事件监听器等等。
如果需要的话，使用 `<template>` 和 `<slot>` 定义一个 HTML 模板。再次使用常规 DOM 方法克隆模板并将其附加到您的 shadow DOM 中。
在页面任何您喜欢的位置使用自定义元素，就像使用常规 HTML 元素那样。

## 使用 Custom element

CustomElementRegistry 接口的实例用来处理 web 文档中的 custom elements — 该对象允许你注册一个 custom element，返回已注册 custom elements 的信息，等等。

CustomElementRegistry.define() 方法用来注册一个 custom element，该方法接受以下参数：

1. 元素名称。注意，custom element 的名称不能是单个单词，且其中必须要有短横线。
2. 定义元素行为的 类 。
3. 可选参数，一个包含 extends 属性的配置对象，是可选参数。它指定了所创建的元素继承自哪个内置元素，可以继承任何内置元素。

```javascript
class WordCount extends HTMLParagraphElement {
  constructor() {
    // 必须首先调用 super 方法
    super();
    // 元素的功能代码写在这里
    ...
  }
}
customElements.define('word-count', WordCount, { extends: 'p' });

```

### custom elements 共有两种：

1. Autonomous custom elements 是独立的元素，它不继承其他内建的 HTML 元素。你可以直接把它们写成 HTML 标签的形式，来在页面上使用。例如 `<popup-info>`，或者是 `document.createElement("popup-info")`这样。
2. Customized built-in elements 继承自基本的 HTML 元素。在创建时，你必须指定所需扩展的元素（正如上面例子所示），使用时，需要先写出基本的元素标签，并通过 is 属性指定 custom element 的名称。例如`<p is="word-count">, 或者 document.createElement("p", { is: "word-count" })。
`

### 示例

1. Autonomous custom elements

- 注册组件

```javascript
class PopUpInfo extends HTMLElement {
  constructor() {
    // 必须首先调用 super 方法
    super();
    // 元素的功能代码写在这里
    // 创建一个 shadow root
    const shadow = this.attachShadow({ mode: "open" });

    // 创建一个 spans
    const wrapper = document.createElement("span");
    wrapper.setAttribute("class", "wrapper");

    // 创建一些 CSS，并应用到 shadow dom 上
    const style = document.createElement("style");

    style.textContent = ".wrapper {}";
    // 简洁起见，省略了具体的 CSS

    // 将创建的元素附加到 shadow dom
    shadow.appendChild(style);
    shadow.appendChild(wrapper);
  }
}
customElements.define("popup-info", PopUpInfo);
```

- 使用组件

```html
<popup-info></popup-info>
```

2. Customized built-in elements

- 注册组件

```javascript
class ExpandingList extends HTMLUListElement {
  constructor() {
    // 必须首先调用 super 方法
    super();
    // 元素的功能代码写在这里
    ...
  }
}
customElements.define('expanding-list', ExpandingList, { extends: "ul" });
```

- 使用组件

```html
<ul is="expanding-list">
  ...
</ul>
```

### 生命周期函数

在 custom element 的构造函数中，可以指定多个不同的回调函数，它们将会在元素的不同生命时期被调用：

- connectedCallback：当 custom element 首次被插入文档 DOM 时，被调用。
- disconnectedCallback：当 custom element 从文档 DOM 中删除时，被调用。
- adoptedCallback：当 custom element 被移动到新的文档时，被调用。
- attributeChangedCallback: 当 custom element 增加、删除、修改自身属性时，被调用。

需要注意的是，如果需要在元素属性变化后，触发 attributeChangedCallback()回调函数，你必须监听这个属性。这可以通过定义 observedAttributes() get 函数来实现，observedAttributes()函数体内包含一个 return 语句，返回一个数组，包含了需要监听的属性名称：

```javascript
static get observedAttributes() {return ['w', 'l']; }
```

```javascript
class NavBar extends HTMLElement {
  static get observedAttributes() {
    return ["title"];
  }
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.innerHTML = this.template();
  }
  template() {
    return `
            <div id="nav_bar" class="nav_bar">
                <span id="title"></span>
                <img id="menu_icon" src="img/menu_btn.png" alt="">
            </div>
        `;
  }
  // 当 custom element 首次被插入文档 DOM 时，被调用。
  connectedCallback() {
    this.updatehasmenu();
    this.updatebackground();
  }
  // 当 custom element 从文档 DOM 中删除时，被调用。
  disconnectedCallback() {}
  // 当 custom element 被移动到新的文档时，被调用。
  adoptedCallback() {}
  // 当 custom element 增加、删除、修改自身属性时，被调用。
  attributeChangedCallback(name, oldValue, newValue) {
    this[`update${name}`](newValue);
  }
  updatetitle(value) {
    const shadow = this.shadowRoot;
    const titleElement = shadow.querySelector("#title");
    titleElement.innerText = value;
  }
}

customElements.define("nav-bar", NavBar);
```
