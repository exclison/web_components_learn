# 使用 templates and slots

## 关于模板 (Templates)

当您必须在网页上重复使用相同的标记结构时，使用某种模板而不是一遍又一遍地重复相同的结构是有意义的。以前这是可行的，但 HTML `<template>` 元素使它更容易实现 (这在现代浏览器中得到了很好的支持)。此元素及其内容不会在 DOM 中呈现，但仍可使用 JavaScript 去引用它。

```html
<template id="my-paragraph">
  <p>My paragraph</p>
</template>
```

上面的代码不会展示在你的页面中，直到你用 JavaScript 获取它的引用，然后添加到 DOM 中，如下面的代码：

```javascript
let template = document.getElementById("my-paragraph");
let templateContent = template.content;
document.body.appendChild(templateContent);
```

## 在 Web Component 中使用模板

模板（Template）本身就是有用的，而与 web 组件（web component）一起使用效果更好。我们定义一个 web 组件使用模板作为阴影（shadow）DOM 的内容，叫它 `<my-paragraph>`：

```javascript
customElements.define(
  "my-paragraph",
  class extends HTMLElement {
    constructor() {
      super();
      let template = document.getElementById("my-paragraph");
      let templateContent = template.content;

      const shadowRoot = this.attachShadow({ mode: "open" });
      shadowRoot.appendChild(templateContent.cloneNode(true));
    }
  }
);
```

要注意的关键是我们使用 Node.cloneNode() 方法添加了模板的拷贝到阴影的根结点上。

因为我们添加了模板的内容到 shadow DOM，所以我们可以加入一些样式信息到模板的 `<style>` 标签里，这些样式信息稍后会封装到自定义的元素中。如果只给它添加到一个标准的 DOM 中是不起作用的。

```html
<template id="my-paragraph">
  <style>
    p {
      color: white;
      background-color: #666;
      padding: 5px;
    }
  </style>
  <p>My paragraph</p>
</template>
```

## 使用槽 (slots) 添加灵活度

插槽由其 name 属性标识，并且允许您在模板中定义占位符，当在标记中使用该元素时，该占位符可以填充所需的任何 HTML 标记片段。

如果你想添加一个槽到我们的这个例子，我们会将模板的 p 标签改成下面这样：

```html
<p><slot name="my-text">My default text</slot></p>
```

如果在标记中包含元素时未定义相关的插槽内容，或者浏览器不支持 slot 属性，则`<my-paragraph>`仅包含后备内容"My default text"。

要定义插槽内容，我们在`<my-paragraph>`元素内包括一个 HTML 结构，该结构具有 slot 属性，其值等于我们要填充的`<slot>`的 name 属性的值。

```html
<my-paragraph>
  <span slot="my-text">Let's have some different text!</span>
</my-paragraph>
```
