class Parser {
    static parse(str) {
        let obj = JSON.parse(str)
        if (obj && obj._class) {
            if (obj._class == 'CList')
                return CList.fromArray(obj.array)
            if (obj._class == 'Graph')
                return Graph.fromArray(obj.array)
        }

        return ""
    }
}

class CNode {
    constructor(arg) {
        this._class = 'CNode'
        this.value = arg
        this.parentLeft = null
        this.parentRight = null
    }

    clone() {
        return new CNode(this.value)
    }
}

class CList {
    static fromArray(arr) {
        let l = new CList()
        while (arr.length > 0)
            l.add(arr.shift())
        return l
    }

    constructor() {
        this._class = 'CList'
        this.length = 0
        this.head = null
    }

    shift(amount) {
        this.head = this.get(amount)
    }

    add(arg) {
        if (arg._class != 'CNode') {
            arg = new CNode(arg)
        }
        this.length++
        if (!this.head) {
            arg.parentLeft = arg
            arg.parentRight = arg
            this.head = arg
        } else {
            arg.parentLeft = this.head.parentLeft
            arg.parentRight = this.head
            arg.parentLeft.parentRight = arg
            arg.parentRight.parentLeft = arg
        }
    }

    get(index) {
        let node = this.head
        index %= this.length
        while (index < 0) {
            index++
            node = node.parentLeft
        }
        while (index > 0) {
            index--
            node = node.parentRight
        }
        return node
    }

    remove(node) {
        if (node._class == 'CNode') {
            let left = node.parentLeft
            let right = node.parentRight
            left.parentRight = right
            right.parentLeft = left
            if (node == this.head) this.head = right
            this.length--
            return node
        } else {
            return this.remove(this.get(node))
        }
    }

    asArray() {
        let arr = []
        let node = null
        while (node != this.head) {
            if (!node) node = this.head
            arr.push(node.value)
            node = node.parentRight
        }
        return arr;
    }

    serialize() {
        let data = this.asArray()
        return JSON.stringify({ _class: this._class, array: data });
    }
}

class Graph {
    static fromArray(arr) {
        const graph = new Graph(arr.shift().value)
        for (let n of arr) {
            graph.set(n.value, n.path)
        }
        return graph
    }

    constructor(arg) {
        this._class = 'Graph'
        this.value = arg
        this.childLeft = null
        this.childRight = null
        this.parent = null
    }

    set(node, path) {
        if (node._class == 'Graph') {
            if (path.length > 1) {
                let c = path[0]
                path = path.slice(1)
                if (c == 'l')
                    this.childLeft.set(node, path)
                if (c == 'r')
                    this.childRight.set(node, path)
            } else {
                node.parent = this
                if (path == 'l')
                    this.childLeft = node
                if (path == 'r')
                    this.childRight = node
            }
            return node
        } else {
            return this.set(new Graph(node), path)
        }
    }

    print() {
        console.log(this.value)
        if (this.parent) this.parent.print()
    }

    getPath() {
        let head = this
        let node = this
        let path = []
        while (head.parent) {
            head = head.parent
            if (node === head.childLeft)
                path.push('l')
            if (node === head.childRight)
                path.push('r')
            node = head
        }
        return path.reverse().join('')
    }

    top() {
        let head = this
        while (head.parent)
            head = head.parent
        return head
    }

    _serialize(arr) {
        let head = this
        let left = null, right = null
        arr.push({ value: head.value, path: head.getPath() })
        if (head.childLeft) left = head.childLeft._serialize(arr)
        if (head.childRight) right = head.childRight._serialize(arr)
        return arr
    }

    serialize() {
        const array = []
        const graph = { _class: 'Graph', array: this.top()._serialize(array) }
        return JSON.stringify(graph)
    }
}

let data = []

req = new XMLHttpRequest()
req.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        let rec = JSON.parse(this.response)
        for (let e of rec) {
            let x = JSON.stringify(e)
            let y = Parser.parse(x)
            data.push(y)
            console.log(y)
        }
    }
}
req.open("GET", "data.json", true)
req.send()