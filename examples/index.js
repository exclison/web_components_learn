

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
