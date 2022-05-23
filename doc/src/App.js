class App extends Component {
    render() {
        return `
            <link rel="stylesheet" href="style.css">
            <main>
                
                <h1>Rux sample app</h1>

                <hr>

                <h3>What is rux</h3>
                Rux is a small framework (1,8 KB) that tries to ease the app creation process by helping the developer creating custom html elements.

                <h3>Including rux in your projects</h3>
                You can find rux <a href="../../rux.min.js">here</a>, and include it using the following script tag:
                <Snippet code='<script src="path/to/rux.min.js" defer></script>'></Snippet>
                Or without using any external file:
                <Snippet code='<script src=&#039;data,let c=[],f=new Map,b=(node,component)=>{let self=new component;self.states=new Proxy(self.states,{get:(target,prop)=>target[prop],deleteProperty:(target,prop)=>{delete target[prop];self.refresh();return 1},set:(target,prop,value)=>{target[prop]=value;self.refresh();return 1}});self.mount(node)},SafeRegisterCustomElements=(...elements)=>(c=[...c,...elements]).forEach(component=>{for(let element of document.getElementsByTagName(component.name))if(!element.component)b(element,component)}),RegisterCustomElements=(...elements)=>(c=[...c,...elements]).forEach(component=>{for(let element of document.getElementsByTagName(component.name))b(element,component)}),o=new MutationObserver(mutations=>{for(let mutation of mutations){if(mutation.type=="childList"){mutation.addedNodes.forEach(node=>{for(let i=0;i<c.length;i++){let component=c[i];if(component.name.toLowerCase()==node.localName)return b(node,component)}})}else if(mutation.type=="attributes"){if(mutation.target.component)mutation.target.component.refresh()}}});o.observe(document,{attributes:1,childList:1,subtree:1});class Component{states={};attributes=new Proxy({},{get:(_,prop)=>{let attr=this.html.getAttribute(prop);if(attr?.startsWith("return[...f.values()]["))return new Function("..._",attr);return attr},has:(_,prop)=>this.html.hasAttribute(prop),set:(_,prop,value)=>{this.html.setAttribute(prop,value);return 1},deleteProperty:(_,prop)=>{this.html.removeAttribute(prop);return 1}});constructor(){}render(){}mount(node){this.html=node;this.html.component=this;this.refresh()}dismount(){}refresh(){this.html.innerHTML=this.render()}rux(strings,...exps){let str="";exps.forEach((exp,index)=>{if(typeof exp=="function"){let funcStr=exp.toString();f.set(funcStr,exp.bind(this));str+=strings[index]+\`"return[...f.values()][\${[...f.keys()].findIndex(key=>key==funcStr)}](...arguments)"\`}else str+=strings[index]+exp+""});str+=strings[strings.length-1];return str}}&#039; defer></script>'></Snippet>
                The <kbd>defer</kbd> keyword will load rux after the page has finished rendering, if you want to include any code that uses rux API you will have to include <kbd>defer</kbd> to your script tag
                <br>

                <h3>Rux API</h3>

                Rux allows you to write new html tags using javascript, they are called "components".
                ${Demonstrate(HelloWorld, " ")}
                We create a custom component by extending the <kbd>Component</kbd> class, and then registering it in <kbd>RegisterCustomElements</kbd>.
                <br>
                We implement a <kbd>render</kbd> function that returns a string.
                <br>
                Render is called whenever an attribute or state change for said Component, you can manually trigger a render with <kbd>this.refresh</kbd>

                <h3>Component attributes</h3>
                You can use <kbd>this.attributes.YourAttributeName</kbd> to access a attribute of the html attached to that component instance.
                ${Demonstrate(Hello, 'user="World!"')}
                The component is directly re-rendered when the attribute change.
                <br>

                <h3>Rux States</h3>

                You can associate a component instance and some states with <kbd>this.states.StateName</kbd>, whenever a state is changed, the component is re-rendered, this can be useful, but that also means the data cannot be changed during the render at the risk of creating an infinite loop, you can still change the internal value of a state with <kbd>this.states._StateName</kbd>.
                ${Demonstrate(ClickButton)}
                Here we use the constructor to instantiate a state, clickCount,
                then in the render function, we set the onclick attribute to clickEvent, and clickEvent increases the clickCount state

                <h3>this.rux?</h3>

                As you might have noticed earlier I used a helper function called this.rux,
                this.rux is a tag template function, if it finds a function, it will bind it to the component, store it and will produce a small javascript expression that calls said function.
                <br>
                This can be extremely useful with event attributes such as <kbd>onclick</kbd>, but keep in mind that it does not allow you to store javascript objects inside of an attribute.

                <h3>Component lifecycle</h3>

                <Snippet code='${ComponentLifecycle.toString()}'></Snippet>

                <h3>Attribute manipulation</h3>

                ${Demonstrate(AttributeTest)}
                
                <h3>RegisterCustomElements</h3>

                The <kbd>RegisterCustomElements</kbd> function can only be called once, calling it multiple times will break your app
                <br>
                If you have multiple component in multiple files that you wish to register, register them all at the same time.
                <Snippet code='<script src="component1.js" defer></script>\n<script src="component2.js" defer></script>\n<script src="component3.js" defer></script>\n<script defer>\nRegisterCustomElements(component1, component2, component3);\n</script>'></Snippet>
                
                If for some reason, you cannot call them all at once, you can use instead <kbd>SafeRegisterCustomElements();</kbd> that can be called multiple times, with the tradeoff of being slightly slower.
                <br>

                <h3>Advanced Component</h3>

                You can tweak the inner working of a component by overriding the mount, dismount and refresh function, for example here, Let's implement the new <a href="https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM">Shadow DOM feature</a> into a new kind of Component.
                <Snippet code='${ShadowComponent.toString()}\n\n${ShadowHelloWorld.toString()}'></Snippet>
                When creating a new kind of component you should try creating an API as close as rux's API possible.

                <h3>Programmatically instantiating components</h3>

                You can use the DOM API to create an element with the name of your component.
                <Snippet code='let element = document.createElement("HelloWorld");\n\ndocument.adoptNode(element);'></Snippet>
                If you wish to access the component instance bound to your element, you can do so by looking at the property "component" of your new element,
                <br>
                But you need to use <kbd>setTimeout</kbd> to let rux the time to instantiate the component.
                <Snippet code='setTimeout(() => {\n\tconsole.log(element.component);\n}, 0);'></Snippet>

                It is quite common to find a central "App" component among projects, as it allows the application to scale and allows you to instantiate your components in the render lifecycle directly.

                <Snippet code='class App extends Component {\n\trender() {\n\t\treturn \`<HelloWorld></HelloWorld>\`;\n\t}\n}'></Snippet>

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
        <Snippet code='${Component.toString()}\n\nRegisterCustomElements(${Component.name});'></Snippet>
        ${Usage ? `<Snippet code='<${Component.name}${Usage !== " " ? " " + Usage : ""}></${Component.name}>'></Snippet>` : ""}
        Will output:
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
    constructor() {
        super();
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
    constructor() {
        super();
        // The constructor is called first,
        // It is important to note that the element was not rendered yet,
        // and that the component is not attached to the HTMLElement itself or "mounted"
        // therefore this.attributes does not work here
    }

    mount(node) {
        // Default behavior:
        this.html = node;
        this.html.component = this;
        this.refresh();
        // This attaches the component to the html element
        // It is recommended to not override it
    }

    dismount(node) {
        // This triggers when the component is removed
    }

    refresh() {
        // Default behavior:
        this.html.innerHTML = this.render();
        // We call refresh when we want to update the component,
        // It is recommended to not override it
    }

    render() {
        // This renders out the component
        return "";
    }

    rux(strings, ...exps) {
        // This is a helper function, I talked about it above
    }
}

class ShadowComponent extends Component {
    mount(node) {
        this.html = node;
        this.html.component = this;
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

RegisterCustomElements(App, Snippet, HelloWorld, Hello, ClickButton, AttributeTest);
