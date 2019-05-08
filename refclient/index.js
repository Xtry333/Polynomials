class Cyclic {
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
    constructor(arg) {
        this._class = 'Graph'
        this.value = arg
        this.childLeft = null
        this.childRight = null
        this.parent = null
    }

    set(node, path) {
        if (node._class == 'Graph') {
            path = path.split('')
            let current = this
            while (path.length > 1) {
                let d = path.shift()
                if (d == 'l')
                    current = this.childLeft
                if (d == 'r')
                    current = this.childRight
            }
            let d = path.shift()
            if (d == 'l')
                current.childLeft = node
            if (d == 'r')
                current.childRight = node
            node.parent = current
            return node
        } else {
            return this.set(new Graph(node), path)
        }
    }

    print() {
        console.log(this.value)
        if (this.parent) this.parent.print()
    }
}

let x = new CList()
x.add(1)
x.add(2)
x.add(3)
x.add(4)
x.add(5)

let y = new Graph(0)
y.set(1, 'l')
y.set(2, 'r')
y.set(3, 'lr')
y.set(4, 'll')
y.set(5, 'rl')
y.set(6, 'rr')
y.set(7, 'lrl')
y.set(8, 'lrr')
y.set(9, 'rll')
y.set(10, 'rlr')