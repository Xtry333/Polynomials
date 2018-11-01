function filterArray(arr) {
    if (!Array.isArray(arr)) {
        throw new Error("Argument is not array");
    }
    var array = [];
    for (var i = 0; i < arr.length; i++) {
        var num = parseFloat(arr[i]);
        array.push(Number.isFinite(num) ? num : 0);
    }
    return array;
}

function isString(x) {
    return Object.prototype.toString.call(x) === "[object String]";
}

class Poly {
    constructor(arg, char) {
        this.mlp = [];
        this.char = "x";
        if (isString(arg)) {
            this.mlp = this.parseString(arg);
        } else if (Array.isArray(arg)) {
            this.mlp = filterArray(arg);
            if (char !== undefined) {
                this.char = char;
            }
        }
    }

    length() {
        return this.mlp.length;
    }

    add(arg) {
        var mlp = [];
        var a1 = [];
        var a2 = this.mlp.slice().reverse();
        if (Poly.isPoly(arg)) {
            if (arg.char != this.char) {
                throw new Error("Cannot add these polynomians (diffrent characters)");
            }
            a1 = arg.mlp.slice().reverse();
        } else if (arg instanceof(Array)) {
            a1 = filterArray(arg.reverse());
        }
        var len = Math.max(a1.length, a2.length);
        for(var i = 0; i < len; i++) {
            mlp[i] = 0;
            if (a1.length > i) {
                mlp[i] += a1[i];
            }
            if (a2.length > i) {
                mlp[i] += a2[i];
            }
        }
        return new Poly(mlp.reverse(), this.char);
    }

    mul(arg) {
        if (Poly.isPoly(arg)) {
            if (arg.char != this.char) {
                throw new Error("Cannot multiply these polynomians (diffrent characters)");
            }
            var mlp = [];
            var a1 = arg.mlp.slice().reverse();
            var a2 = this.mlp.slice().reverse();
            for (var i = 0; i < a1.length + a2.length - 1; i++) {
                mlp[i] = 0;
            }
            for (var i1 = 0; i1 < a1.length; i1++) {
                for (var i2 = 0; i2 < a2.length; i2++) {
                    mlp[i2 + i1] += a1[i1] * a2[i2];
                }
            }
            return new Poly(mlp.reverse(), this.char);
        } else if (Array.isArray(arg)) {
            return this.mul(new Poly(arg));
        } else if (Number.isFinite(arg)) {
            p.mlp = this.mlp;
            for(var i = 0; i < p.mlp.length; i++) {
                p.mlp[i] *= arg;
            }
            return new Poly(mlp, this.char);
        }
        return null;
    }

    derivative() {
        var mlp = [];
        var len = this.mlp.length;
        var a = this.mlp.slice().reverse();
        for (var i = 1; i < len; i++) {
            mlp[i - 1] = a[i] * i;
        }
        return new Poly(mlp.reverse(), this.char);
    }

    calculate(val1, val2, val3) {
        if (arguments.length == 3 && Number.isFinite(val1) && Number.isFinite(val2) && Number.isFinite(val3)) {
            var res = [];
            for (var s = val1; s < val3; s += val2) {
                res.push(this.calculate(s));
            }
            return res;
        }
        var v = 0;
        if (Number.isFinite(val1)) {
            for(var p = 0; p < this.mlp.length; p++) {
                v += Math.pow(val1, p) * this.mlp[this.mlp.length - p - 1];
            }
        }
        return v;
    }

    toString() {
        var res = String();
        var pow = this.mlp.length - 1;
        this.mlp.forEach(e => {
            if (e != 0) {
                if (res.length > 0 && e < 0) {
                    res = res.slice(0, -1);
                }
                if (e != -1 && e != 1 || pow < 1) {
                    res += e;
                } else if (e == -1) {
                    res += "-";
                }
                if (pow > 0) {
                    res += this.char;
                    if (pow > 1) {
                        res += "^" + pow;
                    }
                }
                res += "+"
            }
            pow--;
        });
        if (res.length == 0) {
            return 0;
        }
        return res.slice(0, -1).replace(/(.)(\-|\+)(?=.)/g, "$1 $2 ");
    }

    coer() {
        this.mlp.reverse();
        return this;
    }

    parseString(str) {
        var parts = [];
        var mlp = [];
        if (isString(str)) {
            var chars = str.match(/[a-z]/g);
            if (chars !== null) {
                for (var i = 1; i < chars.length; i++) {
                    if (chars[0] != chars[i]) {
                        throw new Error("Invalid formatting");
                    }
                }
                this.char = chars[0];
            }
            parts = str.replace(/ +/g, "").replace(/\+\-/g, "-").replace(/\-/g, "+-").replace(/\*/g, "").split("+");
            parts.forEach(e => {
                var p;
                if (e.length > 0) {
                    p = e.replace(/^(\-)?(\d+(?:\.\d+)?)?([a-z])(\^)?([^\d])?$/g, "$1$2x^1").replace(/^(\-)?(\d+(?:\.\d+)?)?([a-z])?(\^)?([^\d])?$/g, "$1$2x^0").replace(/^(\-)?[a-z]/g, "$11x");
                } else {
                    p = "0x^0";
                }
                var pow = p.match(/[a-z]\^\d+/g);
                var num = p.match(/^(-)?\d+(\.\d+)?/g);
                if (pow !== null) {
                    var n = pow[0].substr(2);
                    if (mlp[n] === undefined) {
                        mlp[n] = parseFloat(num[0]);
                    } else {
                        mlp[n] += parseFloat(num[0]);
                    }
                } else {
                    throw new Error("Cannot parse string to polynomian (wrong formatting)");
                }
            });
        }
        return filterArray(mlp).reverse();
    }

    static isPoly(arg) {
        return arg instanceof (Poly);
    }

    static fromArray(mlp) {
        var p = new Poly();
        mlp = mlp.parseFloats();
        if (mlp != null && Array.isArray(mlp)) {
            p.mlp = mlp;
        } else {
            if (!Array.isArray(mlp))
                throw new Error(mlp + " is not an array!");
        }
        return p;
    }
}