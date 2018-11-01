class Hexa {
    constructor() {
        this.center = new HexaNode();
    }
}

class HexaNode {
    constructor() {
        this.nodes = [];
    }

    addNode(node, side) {
        if (HexaNode.isHexaNode(node) && Number.isInteger(side)) {
            this.nodes[side%6] = node;
            node.nodes[(side+3)%6] = this;
        }
    }

    static isHexaNode(arg) {
        return arg instanceof(HexaNode);
    }
}