class App extends Component {
    render() {
        return `
            <link rel="stylesheet" href="style.css">
            <main>
                
                <h1>Rux sample app</h1>

                <hr>

                <h3>What is rux</h3>
                Rux is a small framework (0.9 KB) that lets you add custom html elements.

                <h3>Including rux in your projects</h3>
                You can find rux <a href="../../rux.min.js">here</a>, and include it using the following script tag:
                <Snippet code='<script src="path/to/rux.min.js"></script>'></Snippet>
                Or without using any external file:
                <Snippet code='<script src=&#039;data,let c=[],f={},d=document,r="refresh",p="deleteProperty",h="html",a="Attribute",Push=(...e)=>setTimeout((t=>(c=[...c,...e]).map((e=>d.querySelectorAll(e.name).forEach((t=>new e(t)))))),0),o=new MutationObserver((e=>e.map((e=>("a"==e.type[0]&&e.target._?.[r](),e.addedNodes.forEach((e=>c.map((t=>t.name.toUpperCase()==e.tagName&&new t(e))))))))));o.observe(d,{attributes:1,childList:1,subtree:1});class Component{states=new Proxy({},{get:(e,t)=>e[t],[p]:(e,t)=>(delete e[t],!this[r]()),set:(e,t,s)=>(e[t]=s,!this[r]())})attributes=new Proxy({},{get:(e,t)=>(t=this[h]["get"+a](t),f[t?.slice(3,-16)]??t),has:(e,t)=>this[h]["has"+a](t),set:(e,t,r)=>(r=this.rux\`${r}\`,!this[h]["set"+a](t,r)),[p]:(e,t)=>!this[h]["remove"+a](t)});constructor(e){e._=this,this[h]=e,this[r]()}[r](){this[h].innerHTML=this.render()}rux=(e,...t)=>t.reduce(((t,r,s)=>t+(r?.bind?(f[btoa(r)]=r.bind(this),\`"f[&amp;#039;\${btoa(r)}\&amp;#039;](...arguments)"\`):r)+e[s+1]),e[0])}&#039;></script>'></Snippet>
                <br>

                <h3>Rux API</h3>

                Rux allows you to write new html tags using javascript, so called "components".
                ${Demonstrate(HelloWorld, " ")}
                We create a custom component by extending the <kbd>Component</kbd> class, and adding them to rux with <kbd>Push</kbd>.
                <br>
                We implement a <kbd>render</kbd> function that returns a string.
                <br>
                Render is called whenever an attribute or state change for said Component, you can manually trigger a render with <kbd>this.refresh</kbd>

                <h3>Component attributes</h3>
                You can use <kbd>this.attributes.YourAttributeName</kbd> to access a attribute of the html attached to that component instance.
                ${Demonstrate(Hello, 'user="home!"')}
                The component is directly re-rendered when the attribute changes.
                <br>

                <h3>Rux States</h3>

                You can associate a component instance and some states with <kbd>this.states.StateName</kbd>, whenever a state is changed, the component is re-rendered, that means the data cannot be changed during <kbd>render</kbd> since it creates an infinite loop
                ${Demonstrate(ClickButton)}
                Here we use the constructor to instantiate a state, clickCount,
                then in the render function, we set the onclick attribute to clickEvent.

                <h3>this.rux?</h3>

                As you might have noticed earlier I used a helper function called this.rux,
                this.rux is a tag template function, transforming js expressions into a small wrapper that calls upon the embedded code.
                <br>
                This can be extremely useful with event attributes such as <kbd>onclick</kbd>

                <h3>Component lifecycle</h3>

                <Snippet code='${ComponentLifecycle.toString()}'></Snippet>

                <h3>Attribute manipulation</h3>

                ${Demonstrate(AttributeTest)}

               <h3>Advanced Component</h3>

                You can tweak the inner working of a component by overriding the mount, dismount and refresh function, for example here, Let's implement a component over <a href="https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM">Shadow DOM</a>.
                <Snippet code='${ShadowComponent.toString()}\n\n${ShadowHelloWorld.toString()}'></Snippet>
                When creating a new kind of component you should try creating an API as close as rux's API possible.

                <h3>Programmatically instantiating components</h3>

                You can use the DOM API to create an element with the name of your component.
                <Snippet code='let element = document.createElement("HelloWorld");\n\ndocument.body.appendChild(element);'></Snippet>
                If you wish to access the component instance bound to your element, you can do so by looking at the "_" field of your new element,
                <br>
                Although you do need to use <kbd>setTimeout</kbd> to let rux the time to instantiate the component.
                <Snippet code='setTimeout(() => {\n\tconsole.log(element._);\n}, 0);'></Snippet>

                <h3>What does rux means?</h3>
                Not much, it sounds quite tech-like, it could mean Reactive User Experience?

                <h3>Why rux</h3>
                I made it as a gift for @JeremieLeymarie's birthday, when Jeremie and I are making a project together, it is always a little bit of a conflict between us, he wishes for a cool, scalable, reactive framework, and I want to keep our project size always small and VanillaJS flavored.
                <br>
                So I made rux.
            </main>
        `;
    }
}

class Snippet extends Component {
    render() {
        let code = this.attributes.code;
        return `<pre><code>${this.escapeSpecialCharacters(code)}</code></pre>`;
    }

    /**
     * @author jbo5112 on stack overflow
     */
    escapeSpecialCharacters(text) {
        let map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };

        return text.replace(/[&<>"']/g, m => map[m]);
    }
}

function Demonstrate(Component, Usage) {
    return `
        <Snippet code='${Component.toString()}\n\nPush(${Component.name});'></Snippet>
        ${Usage ? `<Snippet code='<${Component.name}${Usage !== " " ? " " + Usage : ""}></${Component.name}>'></Snippet>` : ""}
        <output>
        <${Component.name} ${Usage}></${Component.name}>
        </output>
        <br>
        `
}

// Examples:

class HelloWorld extends Component {
    render() {
        return "Hello World!";
    }
}

class Hello extends Component {
    render() {
        return "Hello " + this.attributes.user;
    }
}

class ClickButton extends Component {
    constructor(node) {
        super(node);
        this.states.clickCount = 0;
    }

    render() {
        return this.rux`<button onclick=${this.clickEvent}>You clicked on this button ${this.states.clickCount} times</button>`;
    }

    clickEvent() {
        this.states.clickCount = this.states.clickCount + 1;
    }
}

class AttributeTest extends Component {
    render() {
        return this.rux`
            Is test a attribute: ${"test" in this.attributes}
            <br>
            Test: ${this.attributes.test}
            <br>
            <button onclick=${ () => this.attributes.test = 42 }>test = 42</button>
            <button onclick=${ () => this.attributes.test++ }>test++</button>
            <button onclick=${ () => this.attributes.test-- }>test--</button>
            <button onclick=${ () => delete this.attributes.test }>delete test</button>
        `
    }
}

class ComponentLifecycle extends Component {
    constructor(node) {
        super(node);
    }

    refresh() {
        this.html.innerHTML = this.render();
    }

    render() {
        return "";
    }

    rux(strings, ...exps) { /* ... */ }
}

class ShadowComponent extends Component {
    constructor(node) {
        this.html = node;
        this.html._ = this; // binds the html to this component
        this.shadow = this.html.attachShadow({mode: "open"})
        this.refresh();
    }

    refresh() {
        this.shadow.innerHTML = this.render();
    }
}

class ShadowHelloWorld extends ShadowComponent {
    render() {
        return "Hello Dark World!";
    }
}

Push(App, Snippet, HelloWorld, Hello, ClickButton, AttributeTest);
