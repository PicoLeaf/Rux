let c = [],
    f = {},
    d = document,
    r = "refresh",
    p = "deleteProperty",
    h = "html",
    a = "Attribute",
    Push = (...e) => setTimeout(_=>(c = [...c, ...e]).map(c => d.querySelectorAll(c.name).forEach(n => new c(n))),0),
    o = new MutationObserver(m => 
        m.map(m => (m.type[0]=='a'&&m.target._?.[r](), m.addedNodes.forEach(n => c.map(c => c.name.toUpperCase() == n.tagName && new c(n)))))
    )
o.observe(d, { attributes: 1, childList: 1, subtree: 1 })

class Component {
    states =  new Proxy({}, {
        get: (t, p) => t[p],
        [p]: (t, p) => (delete t[p], !this[r]()),
        set: (t, p, v) => (t[p] = v, !this[r]())
    })

    attributes = new Proxy({}, {
        get: (_, p) => (p=this[h]["get"+a](p), f[p?.slice(3,-16)] ?? p),
        has: (_, p) => this[h]["has"+a](p),
        set: (_, p, v) => (v=this.rux`${v}`, !this[h]["set"+a](p, v)),
        [p]: (_, p) => !this[h]["remove"+a](p),
    })

    constructor(n) {
        n._ = this
        this[h] = n
        this[r]()
    }
    [r](){if(this[h])this[h].innerHTML = this.render()}
    rux=(s, ...e)=> e.reduce((a,e,i)=> a+(e?.bind ? (f[btoa(e)] = e.bind(this), `f['${btoa(e)}'](...arguments)`) : e)+s[i+1], s[0])
}
