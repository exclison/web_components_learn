# 使用 shadow DOM

Web components 的一个重要属性是封装——可以将标记结构、样式和行为隐藏起来，并与页面上的其他代码相隔离，保证不同的部分不会混在一起，可使代码更加干净、整洁。其中，Shadow DOM 接口是关键所在，它可以将一个隐藏的、独立的 DOM 附加到一个元素上。

## 基本用法

可以使用 `Element.attachShadow()` 方法来将一个 shadow root 附加到任何一个元素上。它接受一个配置对象作为参数，该对象有一个 mode 属性，值可以是 open 或者 closed

```javascript
let shadow = elementRef.attachShadow({ mode: "open" });
let shadow = elementRef.attachShadow({ mode: "closed" });
```

open 表示可以通过页面内的 JavaScript 方法来获取 Shadow DOM，例如使用 `Element.shadowRoot` 属性：

```javascript
let myShadowDom = myCustomElem.shadowRoot;
```

如果你将一个 Shadow root 附加到一个 Custom element 上，并且将 mode 设置为 closed，那么就不可以从外部获取 Shadow DOM 了——`myCustomElem.shadowRoot` 将会返回 null。

如果你想将一个 Shadow DOM 附加到 custom element 上，可以在 custom element 的构造函数中添加如下实现（目前，这是 shadow DOM 最实用的用法）：

```javascript
let shadow = this.attachShadow({ mode: "open" });
```

将 Shadow DOM 附加到一个元素之后，就可以使用 DOM APIs 对它进行操作，就和处理常规 DOM 一样。

```javascript
var para = document.createElement("p");
shadow.appendChild(para);
```

为 shadow DOM 添加样式

```javascript
// 为 shadow DOM 添加一些 CSS 样式
var style = document.createElement("style");

style.textContent = `
.wrapper {
  position: relative;
}`;

shadow.appendChild(style);
```

使用外部引入的样式

```javascript
// 将外部引用的样式添加到 Shadow DOM 上
const linkElem = document.createElement("link");
linkElem.setAttribute("rel", "stylesheet");
linkElem.setAttribute("href", "style.css");

// 将所创建的元素添加到 Shadow DOM 上

shadow.appendChild(linkElem);
```
