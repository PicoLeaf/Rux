// c = components
// o = observer
// b = bindToComponent
// f = functions

let c = [],
    f = new Map(),
    b = (node, component) => {
        let self = new component();

        self.states = new Proxy(self.states, {
            get: (target, prop) => target[prop],
            deleteProperty: (target, prop) => {
                delete target[prop];
                self.refresh();

                // true-ish value
                return 1;
            },
            set: (target, prop, value) => {
                target[prop] = value;
                self.refresh();

                // true-ish value
                return 1;
            }
        })

        self.mount(node);
    },
    SafeRegisterCustomElements = (...elements) => (c = [...c, ...elements]).forEach(component => { for (let element of document.getElementsByTagName(component.name)) if (!element.component) b(element, component) }),
    RegisterCustomElements = (...elements) => (c = [...c, ...elements]).forEach(component => { for (let element of document.getElementsByTagName(component.name)) b(element, component) }),
    o = new MutationObserver(mutations => {
        for (let mutation of mutations) {
            if (mutation.type == 'childList') {
                mutation.addedNodes.forEach(node => {
                    for (let i = 0; i < c.length; i++) {
                        let component = c[i];

                        if (component.name.toLowerCase() == node.localName) return b(node, component);
                    }
                });
            }
            else if (mutation.type == 'attributes') {
                if (mutation.target.component) mutation.target.component.refresh();
            }
        }
    });

o.observe(document, { attributes: 1, childList: 1, subtree: 1 });


class Component {
    states = {};

    attributes = new Proxy({}, {
        get: (_, prop) => {
            let attr = this.html.getAttribute(prop);

            if (attr?.startsWith("return[...f.values()][")) return new Function("..._", attr);
            return attr;
        },
        has: (_, prop) => this.html.hasAttribute(prop),
        set: (_, prop, value) => { this.html.setAttribute(prop, value); return 1 },
        deleteProperty: (_, prop) => { this.html.removeAttribute(prop); return 1 },
    });

    constructor() { }

    render() { }
    mount(node) {
        this.html = node;
        this.html.component = this;
        this.refresh();
    }
    dismount() { }
    refresh() {
        this.html.innerHTML = this.render();
    }

    rux(strings, ...exps) {
        let str = "";

        exps.forEach((exp, index) => {
            if (typeof exp == "function") {
                let funcStr = exp.toString();

                f.set(funcStr, exp.bind(this));

                str += strings[index] + `"return[...f.values()][${[...f.keys()].findIndex(key => key == funcStr)}](...arguments)"`;
            }
            else str += strings[index] + exp + "";
        });

        str += strings[strings.length - 1];

        return str;
    }
}

// export { Component, PushCustomElements, SafeRegisterCustomElements, RegisterCustomElements };

// function compose(...elements) {
//     let str = "";

//     elements.forEach(element => {
//         // str += `"event.path.forEach(e=>{if(e.component?.${element.name}) return e.component.${element.name}()});${element.name}.call()"`
//         if (typeof element == "function") str += `"f[${f.includes(element) ? f.findIndex(e => e == element) : f.push(element) - 1}]"`;
//         else str += element + "";
//     });

//     return str;
// }