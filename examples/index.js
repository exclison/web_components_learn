

let template = document.getElementById('my-paragraph');
let templateContent = template.content;
// document.body.appendChild(templateContent);

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


const shadow_dom = document.getElementById('shadow_dom')
let shadowRoot = shadow_dom.attachShadow({ mode: 'open' })
shadowRoot.innerHTML = `
<div>this is shadow dom</div>
`

console.log(shadow_dom, 'shadow_dom')
console.log(shadow_dom.shadowRoot, 'shadowRoot')