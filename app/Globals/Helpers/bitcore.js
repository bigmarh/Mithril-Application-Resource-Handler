var required = function e(t, r, n) {
    function i(o, a) {
        if (!r[o]) {
            if (!t[o]) {
                var f = "function" == typeof required && required;
                if (!a && f) return f(o, !0);
                if (s) return s(o, !0);
                var c = new Error("Cannot find module '" + o + "'");
                throw c.code = "MODULE_NOT_FOUND", c
            }
            var u = r[o] = {
                exports: {}
            };
            t[o][0].call(u.exports, function(e) {
                var r = t[o][1][e];
                return i(r ? r : e)
            }, u, u.exports, e, t, r, n)
        }
        return r[o].exports
    }
    for (var s = "function" == typeof required && required, o = 0; o < n.length; o++) i(n[o]);
    return i
}({
    1: [function(e, t) {
        (function(r) {
            "use strict";

            function n(e, t, r) {
                if (!(this instanceof n)) return new n(e, t, r);
                if (i.isArray(e) && i.isNumber(t)) return n.createMultisig(e, t, r);
                if (e instanceof n) return e;
                if (s.checkArgument(e, new TypeError("First argument is required, please include address data.")), t && !a.get(t)) throw new TypeError('Second argument must be "livenet" or "testnet".');
                if (r && r !== n.PayToPublicKeyHash && r !== n.PayToScriptHash) throw new TypeError('Third argument must be "pubkeyhash" or "scripthash".');
                var o = this._classifyArguments(e, t, r);
                return o.network = o.network || a.get(t) || a.defaultNetwork, o.type = o.type || r || n.PayToPublicKeyHash, c.defineImmutable(this, {
                    hashBuffer: o.hashBuffer,
                    network: o.network,
                    type: o.type
                }), this
            }
            var i = e("lodash"),
                s = e("./util/preconditions"),
                o = e("./encoding/base58check"),
                a = e("./networks"),
                f = e("./crypto/hash"),
                c = e("./util/js");
            n.prototype._classifyArguments = function(t, s, o) {
                var a = e("./publickey"),
                    f = e("./script");
                if ((t instanceof r || t instanceof Uint8Array) && 20 === t.length) return n._transformHash(t);
                if ((t instanceof r || t instanceof Uint8Array) && 21 === t.length) return n._transformBuffer(t, s, o);
                if (t instanceof a) return n._transformPublicKey(t);
                if (t instanceof f) return n._transformScript(t, s);
                if ("string" == typeof t) return n._transformString(t, s, o);
                if (i.isObject(t)) return n._transformObject(t);
                throw new TypeError("First argument is an unrecognized data format.")
            }, n.PayToPublicKeyHash = "pubkeyhash", n.PayToScriptHash = "scripthash", n._transformHash = function(e) {
                var t = {};
                if (!(e instanceof r || e instanceof Uint8Array)) throw new TypeError("Address supplied is not a buffer.");
                if (20 !== e.length) throw new TypeError("Address hashbuffers must be exactly 20 bytes.");
                return t.hashBuffer = e, t
            }, n._transformObject = function(e) {
                return s.checkArgument(e.hash || e.hashBuffer, "Must provide a `hash` or `hashBuffer` property"), s.checkArgument(e.type, "Must provide a `type` property"), {
                    hashBuffer: e.hash ? new r(e.hash, "hex") : e.hashBuffer,
                    network: a.get(e.network) || a.defaultNetwork,
                    type: e.type
                }
            }, n._classifyFromVersion = function(e) {
                var t = {};
                switch (t.network = a.get(e[0]), e[0]) {
                    case a.livenet.pubkeyhash:
                        t.type = n.PayToPublicKeyHash;
                        break;
                    case a.livenet.scripthash:
                        t.type = n.PayToScriptHash;
                        break;
                    case a.testnet.pubkeyhash:
                        t.type = n.PayToPublicKeyHash;
                        break;
                    case a.testnet.scripthash:
                        t.type = n.PayToScriptHash
                    case a.bctestnet.pubkeyhash:
                        t.type = n.PayToPublicKeyHash;
                        break;
                    case a.bctestnet.scripthash:
                        t.type = n.PayToScriptHash
                }
                return t
            }, n._transformBuffer = function(e, t, i) {
                var s = {};
                if (!(e instanceof r || e instanceof Uint8Array)) throw new TypeError("Address supplied is not a buffer.");
                if (21 !== e.length) throw new TypeError("Address buffers must be exactly 21 bytes.");
                t = a.get(t);
                var o = n._classifyFromVersion(e);
                if (!o.network || t && t !== o.network) throw new TypeError("Address has mismatched network type.");
                if (!o.type || i && i !== o.type) throw new TypeError("Address has mismatched type.");
                return s.hashBuffer = e.slice(1), s.network = o.network, s.type = o.type, s
            }, n._transformPublicKey = function(t) {
                var r = e("./publickey"),
                    i = {};
                if (!(t instanceof r)) throw new TypeError("Address must be an instance of PublicKey.");
                return i.hashBuffer = f.sha256ripemd160(t.toBuffer()), i.type = n.PayToPublicKeyHash, i
            }, n._transformScript = function(t, r) {
                var i = e("./script"),
                    s = {};
                if (!(t instanceof i)) throw new TypeError("Address must be an instance of Script.");
                return t.isScriptHashOut() ? (s.hashBuffer = t.getData(), s.type = n.PayToScriptHash) : t.isPublicKeyHashOut() ? (s.hashBuffer = t.getData(), s.type = n.PayToPublicKeyHash) : (s.hashBuffer = f.sha256ripemd160(t.toBuffer()), s.type = n.PayToScriptHash), s.network = a.get(r) || a.defaultNetwork, s
            }, n.createMultisig = function(t, r, i) {
                var s = e("./script");
                return i = i || t[0].network, new n(s.buildMultisigOut(t, r), i || a.defaultNetwork)
            }, n._transformString = function(e, t, r) {
                if ("string" != typeof e) throw new TypeError("Address supplied is not a string.");
                var i = o.decode(e),
                    s = n._transformBuffer(i, t, r);
                return s
            }, n.fromPublicKey = function(e, t) {
                var r = n._transformPublicKey(e);
                return t = t || a.defaultNetwork, new n(r.hashBuffer, t, r.type)
            }, n.fromPublicKeyHash = function(e, t) {
                var r = n._transformHash(e);
                return new n(r.hashBuffer, t, n.PayToPublicKeyHash)
            }, n.fromScriptHash = function(e, t) {
                var r = n._transformHash(e);
                return new n(r.hashBuffer, t, n.PayToScriptHash)
            }, n.fromScript = function(e, t) {
                var r = n._transformScript(e, t);
                return new n(r.hashBuffer, t, r.type)
            }, n.fromBuffer = function(e, t, r) {
                var i = n._transformBuffer(e, t, r);
                return new n(i.hashBuffer, i.network, i.type)
            }, n.fromString = function(e, t, r) {
                var i = n._transformString(e, t, r);
                return new n(i.hashBuffer, i.network, i.type)
            }, n.fromJSON = function(e) {
                c.isValidJSON(e) && (e = JSON.parse(e)), s.checkState(c.isHexa(e.hash), 'Unexpected hash property, "' + e.hash + '", expected to be hex.');
                var t = new r(e.hash, "hex");
                return new n(t, e.network, e.type)
            }, n.getValidationError = function(e, t, r) {
                var i;
                try {
                    new n(e, t, r)
                } catch (s) {
                    i = s
                }
                return i
            }, n.isValid = function(e, t, r) {
                return !n.getValidationError(e, t, r)
            }, n.prototype.isPayToPublicKeyHash = function() {
                return this.type === n.PayToPublicKeyHash
            }, n.prototype.isPayToScriptHash = function() {
                return this.type === n.PayToScriptHash
            }, n.prototype.toBuffer = function() {
                var e = new r([this.network[this.type]]),
                    t = r.concat([e, this.hashBuffer]);
                return t
            }, n.prototype.toObject = function() {
                return {
                    hash: this.hashBuffer.toString("hex"),
                    type: this.type,
                    network: this.network.toString()
                }
            }, n.prototype.toJSON = function() {
                return JSON.stringify(this.toObject())
            }, n.prototype.toString = function() {
                return o.encode(this.toBuffer())
            }, n.prototype.inspect = function() {
                return "<Address: " + this.toString() + ", type: " + this.type + ", network: " + this.network + ">"
            }, t.exports = n
        }).call(this, e("buffer").Buffer)
    }, {
        "./crypto/hash": 6,
        "./encoding/base58check": 11,
        "./networks": 20,
        "./publickey": 23,
        "./script": 24,
        "./util/js": 39,
        "./util/preconditions": 40,
        buffer: 43,
        lodash: 233
    }],
    2: [function(e, t) {
        (function(r) {
            "use strict";

            function n(e) {
                return this instanceof n ? (i.extend(this, n._from(e)), this) : new n(e)
            }
            var i = e("lodash"),
                s = e("./blockheader"),
                o = e("./crypto/bn"),
                a = e("./util/buffer"),
                f = e("./encoding/bufferreader"),
                c = e("./encoding/bufferwriter"),
                u = e("./crypto/hash"),
                d = e("./util/js"),
                h = e("./transaction");
            n.MAX_BLOCK_SIZE = 1e6, n._from = function(e) {
                var t = {};
                if (a.isBuffer(e)) t = n._fromBufferReader(f(e));
                else if (d.isValidJSON(e)) t = n._fromJSON(e);
                else {
                    if (!i.isObject(e)) throw new TypeError("Unrecognized argument for Block");
                    t = {
                        header: e.header,
                        transactions: e.transactions
                    }
                }
                return t
            }, n._fromJSON = function(e) {
                d.isValidJSON(e) && (e = JSON.parse(e));
                var t = [];
                e.transactions.forEach(function(e) {
                    t.push(h().fromJSON(e))
                });
                var r = {
                    header: s.fromJSON(e.header),
                    transactions: t
                };
                return r
            }, n.fromJSON = function(e) {
                var t = n._fromJSON(e);
                return new n(t)
            }, n._fromBufferReader = function(e) {
                var t = {};
                t.header = s.fromBufferReader(e);
                var r = e.readVarintNum();
                t.transactions = [];
                for (var n = 0; r > n; n++) t.transactions.push(h().fromBufferReader(e));
                return t
            }, n.fromBufferReader = function(e) {
                var t = n._fromBufferReader(e);
                return new n(t)
            }, n.fromBuffer = function(e) {
                return n.fromBufferReader(f(e))
            }, n.fromString = function(e) {
                var t = new r(e, "hex");
                return n.fromBuffer(t)
            }, n.fromRawBlock = function(e) {
                a.isBuffer(e) || (e = new r(e, "binary"));
                var t = f(e);
                t.pos = n.Values.START_OF_BLOCK;
                var i = n._fromBufferReader(t);
                return new n(i)
            }, n.prototype.toObject = function() {
                var e = [];
                return this.transactions.forEach(function(t) {
                    e.push(t.toObject())
                }), {
                    header: this.header.toObject(),
                    transactions: e
                }
            }, n.prototype.toJSON = function() {
                return JSON.stringify(this.toObject())
            }, n.prototype.toBuffer = function() {
                return this.toBufferWriter().concat()
            }, n.prototype.toString = function() {
                return this.toBuffer().toString("hex")
            }, n.prototype.toBufferWriter = function(e) {
                e || (e = new c), e.write(this.header.toBuffer()), e.writeVarintNum(this.transactions.length);
                for (var t = 0; t < this.transactions.length; t++) this.transactions[t].toBufferWriter(e);
                return e
            }, n.prototype.getTransactionHashes = function() {
                var e = [];
                if (0 === this.transactions.length) return [n.Values.NULL_HASH];
                for (var t = 0; t < this.transactions.length; t++) e.push(this.transactions[t]._getHash());
                return e
            }, n.prototype.getMerkleTree = function() {
                for (var e = this.getTransactionHashes(), t = 0, n = this.transactions.length; n > 1; n = Math.floor((n + 1) / 2)) {
                    for (var i = 0; n > i; i += 2) {
                        var s = Math.min(i + 1, n - 1),
                            o = r.concat([e[t + i], e[t + s]]);
                        e.push(u.sha256sha256(o))
                    }
                    t += n
                }
                return e
            }, n.prototype.getMerkleRoot = function() {
                var e = this.getMerkleTree();
                return e[e.length - 1]
            }, n.prototype.validMerkleRoot = function() {
                var e = new o(this.header.merkleRoot.toString("hex"), "hex"),
                    t = new o(this.getMerkleRoot().toString("hex"), "hex");
                return 0 !== e.cmp(t) ? !1 : !0
            }, n.prototype._getHash = function() {
                return this.header._getHash()
            };
            var p = {
                configurable: !1,
                writeable: !1,
                get: function() {
                    return this._id || (this._id = this.header.id), this._id
                },
                set: i.noop
            };
            Object.defineProperty(n.prototype, "id", p), Object.defineProperty(n.prototype, "hash", p), n.prototype.inspect = function() {
                return "<Block " + this.id + ">"
            }, n.Values = {
                START_OF_BLOCK: 8,
                NULL_HASH: new r("0000000000000000000000000000000000000000000000000000000000000000", "hex")
            }, t.exports = n
        }).call(this, e("buffer").Buffer)
    }, {
        "./blockheader": 3,
        "./crypto/bn": 4,
        "./crypto/hash": 6,
        "./encoding/bufferreader": 12,
        "./encoding/bufferwriter": 13,
        "./transaction": 27,
        "./util/buffer": 38,
        "./util/js": 39,
        buffer: 43,
        lodash: 233
    }],
    3: [function(e, t) {
        (function(r) {
            "use strict";
            var n = e("lodash"),
                i = e("./crypto/bn"),
                s = e("./util/buffer"),
                o = e("./encoding/bufferreader"),
                a = e("./encoding/bufferwriter"),
                f = e("./crypto/hash"),
                c = e("./util/js"),
                u = function h(e) {
                    return this instanceof h ? (n.extend(this, h._from(e)), this) : new h(e)
                };
            u._from = function(e) {
                var t = {};
                if (s.isBuffer(e)) t = u._fromBufferReader(o(e));
                else if (c.isValidJSON(e)) t = u._fromJSON(e);
                else {
                    if (!n.isObject(e)) throw new TypeError("Unrecognized argument for BlockHeader");
                    t = {
                        version: e.version,
                        prevHash: e.prevHash,
                        merkleRoot: e.merkleRoot,
                        time: e.time,
                        bits: e.bits,
                        nonce: e.nonce
                    }
                }
                return t
            }, u._fromJSON = function(e) {
                c.isValidJSON(e) && (e = JSON.parse(e));
                var t = {
                    version: e.version,
                    prevHash: new r(e.prevHash, "hex"),
                    merkleRoot: new r(e.merkleRoot, "hex"),
                    time: e.time,
                    timestamp: e.time,
                    bits: e.bits,
                    nonce: e.nonce
                };
                return t
            }, u.fromJSON = function(e) {
                var t = u._fromJSON(e);
                return new u(t)
            }, u.fromRawBlock = function(e) {
                s.isBuffer(e) || (e = new r(e, "binary"));
                var t = o(e);
                t.pos = u.Constants.START_OF_HEADER;
                var n = u._fromBufferReader(t);
                return new u(n)
            }, u.fromBuffer = function(e) {
                var t = u._fromBufferReader(o(e));
                return new u(t)
            }, u.fromString = function(e) {
                var t = new r(e, "hex");
                return u.fromBuffer(t)
            }, u._fromBufferReader = function(e) {
                var t = {};
                return t.version = e.readUInt32LE(), t.prevHash = e.read(32), t.merkleRoot = e.read(32), t.time = e.readUInt32LE(), t.bits = e.readUInt32LE(), t.nonce = e.readUInt32LE(), t
            }, u.fromBufferReader = function(e) {
                var t = u._fromBufferReader(e);
                return new u(t)
            }, u.prototype.toObject = function() {
                return {
                    version: this.version,
                    prevHash: this.prevHash.toString("hex"),
                    merkleRoot: this.merkleRoot.toString("hex"),
                    time: this.time,
                    bits: this.bits,
                    nonce: this.nonce
                }
            }, u.prototype.toJSON = function() {
                return JSON.stringify(this.toObject())
            }, u.prototype.toBuffer = function() {
                return this.toBufferWriter().concat()
            }, u.prototype.toString = function() {
                return this.toBuffer().toString("hex")
            }, u.prototype.toBufferWriter = function(e) {
                return e || (e = new a), e.writeUInt32LE(this.version), e.write(this.prevHash), e.write(this.merkleRoot), e.writeUInt32LE(this.time), e.writeUInt32LE(this.bits), e.writeUInt32LE(this.nonce), e
            }, u.prototype.getTargetDifficulty = function() {
                for (var e = i(16777215 & this.bits), t = 8 * ((this.bits >>> 24) - 3); t-- > 0;) e = e.mul(2);
                return e
            }, u.prototype._getHash = function() {
                var e = this.toBuffer();
                return f.sha256sha256(e)
            };
            var d = {
                configurable: !1,
                writeable: !1,
                enumerable: !0,
                get: function() {
                    return this._id || (this._id = o(this._getHash()).readReverse().toString("hex")), this._id
                },
                set: n.noop
            };
            Object.defineProperty(u.prototype, "id", d), Object.defineProperty(u.prototype, "hash", d), u.prototype.validTimestamp = function() {
                var e = Math.round((new Date).getTime() / 1e3);
                return this.time > e + u.Constants.MAX_TIME_OFFSET ? !1 : !0
            }, u.prototype.validProofOfWork = function() {
                var e = new i(this.id, "hex"),
                    t = this.getTargetDifficulty();
                return e.cmp(t) > 0 ? !1 : !0
            }, u.prototype.inspect = function() {
                return "<BlockHeader " + this.id + ">"
            }, u.Constants = {
                START_OF_HEADER: 8,
                MAX_TIME_OFFSET: 7200,
                LARGEST_HASH: new i("10000000000000000000000000000000000000000000000000000000000000000", "hex")
            }, t.exports = u
        }).call(this, e("buffer").Buffer)
    }, {
        "./crypto/bn": 4,
        "./crypto/hash": 6,
        "./encoding/bufferreader": 12,
        "./encoding/bufferwriter": 13,
        "./util/buffer": 38,
        "./util/js": 39,
        buffer: 43,
        lodash: 233
    }],
    4: [function(e, t) {
        (function(r) {
            "use strict";
            var n = e("bn.js"),
                i = e("../util/preconditions"),
                s = e("lodash"),
                o = function c(e, t) {
                    return this instanceof c ? void n.apply(this, arguments) : new c(e, t)
                };
            o.prototype = n.prototype;
            var a = function(e) {
                for (var t = new r(e.length), n = 0; n < e.length; n++) t[n] = e[e.length - 1 - n];
                return t
            };
            o.fromNumber = function(e) {
                return i.checkArgument(s.isNumber(e)), o(e)
            }, o.prototype.toNumber = function() {
                return parseInt(this.toString(10), 10)
            }, o.fromString = function(e) {
                return i.checkArgument(s.isString(e)), o(e)
            }, o.fromBuffer = function(e, t) {
                "undefined" != typeof t && "little" === t.endian && (e = a(e));
                var r = e.toString("hex"),
                    n = new o(r, 16);
                return n
            }, o.trim = function(e, t) {
                return e.slice(t - e.length, e.length)
            }, o.pad = function(e, t, n) {
                for (var i = new r(n), s = 0; s < e.length; s++) i[i.length - 1 - s] = e[e.length - 1 - s];
                for (s = 0; n - t > s; s++) i[s] = 0;
                return i
            }, o.prototype.toBuffer = function(e) {
                var t, n;
                if (e && e.size) {
                    n = this.toString(16, 2);
                    var i = n.length / 2;
                    t = new r(n, "hex"), i === e.size ? t = t : i > e.size ? t = o.trim(t, i) : i < e.size && (t = o.pad(t, i, e.size))
                } else n = this.toString(16, 2), t = new r(n, "hex");
                return "undefined" != typeof e && "little" === e.endian && (t = a(t)), t
            }, o.fromSM = function(e, t) {
                var n;
                if (0 === e.length) return o.fromBuffer(new r([0]));
                var i = "big";
                return t && (i = t.endian), "little" === i && (e = a(e)), 128 & e[0] ? (e[0] = 127 & e[0], n = o.fromBuffer(e), n.neg().copy(n)) : n = o.fromBuffer(e), n
            }, o.prototype.toSMBigEndian = function() {
                var e;
                return -1 === this.cmp(0) ? (e = this.neg().toBuffer(), 128 & e[0] ? e = r.concat([new r([128]), e]) : e[0] = 128 | e[0]) : (e = this.toBuffer(), 128 & e[0] && (e = r.concat([new r([0]), e]))), 1 === e.length & 0 === e[0] && (e = new r([])), e
            }, o.prototype.toSM = function(e) {
                var t = e ? e.endian : "big",
                    r = this.toSMBigEndian();
                return "little" === t && (r = a(r)), r
            }, o.fromScriptNumBuffer = function(e, t) {
                var r = 4;
                if (i.checkArgument(e.length <= r, new Error("script number overflow")), t && e.length > 0 && 0 === (127 & e[e.length - 1]) && (e.length <= 1 || 0 === (128 & e[e.length - 2]))) throw new Error("non-minimally encoded script number");
                return o.fromSM(e, {
                    endian: "little"
                })
            }, o.prototype.toScriptNumBuffer = function() {
                return this.toSM({
                    endian: "little"
                })
            };
            var f = function(e) {
                o.prototype["_" + e] = o.prototype[e];
                var t = function(t) {
                    return "string" == typeof t ? t = new o(t) : "number" == typeof t && (t = new o(t.toString())), this["_" + e](t)
                };
                o.prototype[e] = t
            };
            o.prototype.gt = function(e) {
                return this.cmp(e) > 0
            }, o.prototype.lt = function(e) {
                return this.cmp(e) < 0
            }, f("add"), f("sub"), f("mul"), f("mod"), f("div"), f("cmp"), f("gt"), f("lt"), t.exports = o
        }).call(this, e("buffer").Buffer)
    }, {
        "../util/preconditions": 40,
        "bn.js": 210,
        buffer: 43,
        lodash: 233
    }],
    5: [function(e, t) {
        (function(r) {
            "use strict";
            var n = e("./bn"),
                i = e("./point"),
                s = e("./signature"),
                o = e("../publickey"),
                a = e("./random"),
                f = e("./hash"),
                c = e("../util/buffer"),
                u = e("lodash"),
                d = e("../util/preconditions"),
                h = function p(e) {
                    return this instanceof p ? void(e && this.set(e)) : new p(e)
                };
            h.prototype.set = function(e) {
                return this.hashbuf = e.hashbuf || this.hashbuf, this.endian = e.endian || this.endian, this.privkey = e.privkey || this.privkey, this.pubkey = e.pubkey || (this.privkey ? this.privkey.publicKey : this.pubkey), this.sig = e.sig || this.sig, this.k = e.k || this.k, this.verified = e.verified || this.verified, this
            }, h.prototype.privkey2pubkey = function() {
                this.pubkey = this.privkey.toPublicKey()
            }, h.prototype.calci = function() {
                for (var e = 0; 4 > e; e++) {
                    this.sig.i = e;
                    var t;
                    try {
                        t = this.toPublicKey()
                    } catch (r) {
                        console.error(r);
                        continue
                    }
                    if (t.point.eq(this.pubkey.point)) return this.sig.compressed = this.pubkey.compressed, this
                }
                throw this.sig.i = void 0, new Error("Unable to find valid recovery factor")
            }, h.fromString = function(e) {
                var t = JSON.parse(e);
                return new h(t)
            }, h.prototype.randomK = function() {
                var e, t = i.getN();
                do e = n.fromBuffer(a.getRandomBuffer(32)); while (!e.lt(t) || !e.gt(0));
                return this.k = e, this
            }, h.prototype.deterministicK = function(e) {
                u.isUndefined(e) && (e = 0);
                var t = new r(32);
                t.fill(1);
                var s = new r(32);
                s.fill(0);
                var o = this.privkey.bn.toBuffer({
                    size: 32
                });
                s = f.sha256hmac(r.concat([t, new r([0]), o, this.hashbuf]), s), t = f.sha256hmac(t, s), s = f.sha256hmac(r.concat([t, new r([1]), o, this.hashbuf]), s), t = f.sha256hmac(t, s), t = f.sha256hmac(t, s);
                for (var a = n.fromBuffer(t), c = i.getN(), d = 0; e > d || !a.lt(c) || !a.gt(0); d++) s = f.sha256hmac(r.concat([t, new r([0])]), s), t = f.sha256hmac(t, s), t = f.sha256hmac(t, s), a = n.fromBuffer(t);
                return this.k = a, this
            }, h.prototype.toPublicKey = function() {
                var e = this.sig.i;
                d.checkArgument(0 === e || 1 === e || 2 === e || 3 === e, new Error("i must be equal to 0, 1, 2, or 3"));
                var t = n.fromBuffer(this.hashbuf),
                    r = this.sig.r,
                    s = this.sig.s,
                    a = 1 & e,
                    f = e >> 1,
                    c = i.getN(),
                    u = i.getG(),
                    h = f ? r.add(c) : r,
                    p = i.fromX(a, h),
                    l = p.mul(c);
                if (!l.isInfinity()) throw new Error("nR is not a valid curve point");
                var b = t.neg().mod(c),
                    g = r.invm(c),
                    y = p.mul(s).add(u.mul(b)).mul(g),
                    m = o.fromPoint(y, this.sig.compressed);
                return m
            }, h.prototype.sigError = function() {
                if (!c.isBuffer(this.hashbuf) || 32 !== this.hashbuf.length) return "hashbuf must be a 32 byte buffer";
                var e = this.sig.r,
                    t = this.sig.s;
                if (!(e.gt(0) && e.lt(i.getN()) && t.gt(0) && t.lt(i.getN()))) return "r and s not in range";
                var r = n.fromBuffer(this.hashbuf, this.endian ? {
                        endian: this.endian
                    } : void 0),
                    s = i.getN(),
                    o = t.invm(s),
                    a = o.mul(r).mod(s),
                    f = o.mul(e).mod(s),
                    u = i.getG().mulAdd(a, this.pubkey.point, f);
                return u.isInfinity() ? "p is infinity" : 0 !== u.getX().mod(s).cmp(e) ? "Invalid signature" : !1
            }, h.toLowS = function(e) {
                return e.gt(n.fromBuffer(new r("7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5D576E7357A4501DDFE92F46681B20A0", "hex"))) && (e = i.getN().sub(e)), e
            }, h.prototype._findSignature = function(e, t) {
                var r, n, s, o, a = i.getN(),
                    f = i.getG(),
                    c = 0;
                do(!this.k || c > 0) && this.deterministicK(c), c++, r = this.k, n = f.mul(r), s = n.x.mod(a), o = r.invm(a).mul(t.add(e.mul(s))).mod(a); while (s.cmp(0) <= 0 || o.cmp(0) <= 0);
                return o = h.toLowS(o), {
                    s: o,
                    r: s
                }
            }, h.prototype.sign = function() {
                var e = this.hashbuf,
                    t = this.privkey,
                    r = t.bn;
                d.checkState(e && t && r, new Error("invalid parameters")), d.checkState(c.isBuffer(e) && 32 === e.length, new Error("hashbuf must be a 32 byte buffer"));
                var i = n.fromBuffer(e, this.endian ? {
                        endian: this.endian
                    } : void 0),
                    o = this._findSignature(r, i);
                return o.compressed = this.pubkey.compressed, this.sig = new s(o), this
            }, h.prototype.signRandomK = function() {
                return this.randomK(), this.sign()
            }, h.prototype.toString = function() {
                var e = {};
                return this.hashbuf && (e.hashbuf = this.hashbuf.toString("hex")), this.privkey && (e.privkey = this.privkey.toString()), this.pubkey && (e.pubkey = this.pubkey.toString()), this.sig && (e.sig = this.sig.toString()), this.k && (e.k = this.k.toString()), JSON.stringify(e)
            }, h.prototype.verify = function() {
                return this.verified = this.sigError() ? !1 : !0, this
            }, h.sign = function(e, t, r) {
                return h().set({
                    hashbuf: e,
                    endian: r,
                    privkey: t
                }).sign().sig
            }, h.verify = function(e, t, r, n) {
                return h().set({
                    hashbuf: e,
                    endian: n,
                    sig: t,
                    pubkey: r
                }).verify().verified
            }, t.exports = h
        }).call(this, e("buffer").Buffer)
    }, {
        "../publickey": 23,
        "../util/buffer": 38,
        "../util/preconditions": 40,
        "./bn": 4,
        "./hash": 6,
        "./point": 7,
        "./random": 8,
        "./signature": 9,
        buffer: 43,
        lodash: 233
    }],
    6: [function(e, t) {
        (function(r) {
            "use strict";
            var n = e("hash.js"),
                i = e("sha512"),
                s = e("crypto"),
                o = e("../util/buffer"),
                a = e("../util/preconditions"),
                f = t.exports;
            f.sha1 = function(e) {
                return a.checkArgument(o.isBuffer(e)), s.createHash("sha1").update(e).digest()
            }, f.sha1.blocksize = 512, f.sha256 = function(e) {
                return a.checkArgument(o.isBuffer(e)), s.createHash("sha256").update(e).digest()
            }, f.sha256.blocksize = 512, f.sha256sha256 = function(e) {
                return a.checkArgument(o.isBuffer(e)), f.sha256(f.sha256(e))
            }, f.ripemd160 = function(e) {
                a.checkArgument(o.isBuffer(e));
                var t = (new n.ripemd160).update(e).digest();
                return new r(t)
            }, f.sha256ripemd160 = function(e) {
                return a.checkArgument(o.isBuffer(e)), f.ripemd160(f.sha256(e))
            }, f.sha512 = function(e) {
                a.checkArgument(o.isBuffer(e));
                var t = i(e);
                return new r(t)
            }, f.sha512.blocksize = 1024, f.hmac = function(e, t, n) {
                a.checkArgument(o.isBuffer(t)), a.checkArgument(o.isBuffer(n)), a.checkArgument(e.blocksize);
                var i = e.blocksize / 8;
                if (n.length > i) n = e(n);
                else if (i > n) {
                    var s = new r(i);
                    s.fill(0), n.copy(s), n = s
                }
                var f = new r(i);
                f.fill(92);
                var c = new r(i);
                c.fill(54);
                for (var u = new r(i), d = new r(i), h = 0; i > h; h++) u[h] = f[h] ^ n[h], d[h] = c[h] ^ n[h];
                return e(r.concat([u, e(r.concat([d, t]))]))
            }, f.sha256hmac = function(e, t) {
                return f.hmac(f.sha256, e, t)
            }, f.sha512hmac = function(e, t) {
                return f.hmac(f.sha512, e, t)
            }
        }).call(this, e("buffer").Buffer)
    }, {
        "../util/buffer": 38,
        "../util/preconditions": 40,
        buffer: 43,
        crypto: 47,
        "hash.js": 226,
        sha512: 236
    }],
    7: [function(e, t) {
        (function(r) {
            "use strict";
            var n = e("./bn"),
                i = e("../util/buffer"),
                s = e("elliptic").curves.secp256k1,
                o = s.curve.point.bind(s.curve),
                a = s.curve.pointFromX.bind(s.curve),
                f = function(e, t, r) {
                    var n = o(e, t, r);
                    return n.validate(), n
                };
            f.prototype = Object.getPrototypeOf(s.curve.point()), f.fromX = function(e, t) {
                var r = a(e, t);
                return r.validate(), r
            }, f.getG = function() {
                return f(s.curve.g.getX(), s.curve.g.getY())
            }, f.getN = function() {
                return n(s.curve.n.toArray())
            }, f.prototype._getX = f.prototype.getX, f.prototype.getX = function() {
                return n(this._getX().toArray())
            }, f.prototype._getY = f.prototype.getY, f.prototype.getY = function() {
                return n(this._getY().toArray())
            }, f.prototype.validate = function() {
                if (this.isInfinity()) throw new Error("Point cannot be equal to Infinity");
                if (0 === this.getX().cmp(0) || 0 === this.getY().cmp(0)) throw new Error("Invalid x,y value for curve, cannot equal 0.");
                var e = a(this.getY().isOdd(), this.getX());
                if (0 !== e.y.cmp(this.y)) throw new Error("Invalid y value for curve.");
                var t = this.getX().gt(-1) && this.getX().lt(f.getN()),
                    r = this.getY().gt(-1) && this.getY().lt(f.getN());
                if (!t || !r) throw new Error("Point does not lie on the curve");
                if (!this.mul(f.getN()).isInfinity()) throw new Error("Point times N must be infinity");
                return this
            }, f.pointToCompressed = function(e) {
                var t, n = e.getX().toBuffer({
                        size: 32
                    }),
                    s = e.getY().toBuffer({
                        size: 32
                    }),
                    o = s[s.length - 1] % 2;
                return t = new r(o ? [3] : [2]), i.concat([t, n])
            }, t.exports = f
        }).call(this, e("buffer").Buffer)
    }, {
        "../util/buffer": 38,
        "./bn": 4,
        buffer: 43,
        elliptic: 212
    }],
    8: [function(e, t) {
        (function(r, n) {
            "use strict";

            function i() {}
            i.getRandomBuffer = function(e) {
                return r.browser ? i.getRandomBufferBrowser(e) : i.getRandomBufferNode(e)
            }, i.getRandomBufferNode = function(t) {
                var r = e("crypto");
                return r.randomBytes(t)
            }, i.getRandomBufferBrowser = function(e) {
                if (!window.crypto && !window.msCrypto) throw new Error("window.crypto not available");
                if (window.crypto && window.crypto.getRandomValues) var t = window.crypto;
                else {
                    if (!window.msCrypto || !window.msCrypto.getRandomValues) throw new Error("window.crypto.getRandomValues not available");
                    var t = window.msCrypto
                }
                var r = new Uint8Array(e);
                t.getRandomValues(r);
                var i = new n(r);
                return i
            }, i.getPseudoRandomBuffer = function(e) {
                for (var t, r = 4294967296, i = new n(e), s = 0; e >= s; s++) {
                    var o = Math.floor(s / 4),
                        a = s - 4 * o;
                    0 === a ? (t = Math.random() * r, i[s] = 255 & t) : i[s] = 255 & (t >>>= 8)
                }
                return i
            }, t.exports = i
        }).call(this, e("_process"), e("buffer").Buffer)
    }, {
        _process: 187,
        buffer: 43,
        crypto: 47
    }],
    9: [function(e, t) {
        (function(r) {
            "use strict";
            var n = e("./bn"),
                i = e("lodash"),
                s = e("../util/preconditions"),
                o = e("../util/buffer"),
                a = function f(e, t) {
                    if (!(this instanceof f)) return new f(e, t);
                    if (e instanceof n) this.set({
                        r: e,
                        s: t
                    });
                    else if (e) {
                        var r = e;
                        this.set(r)
                    }
                };
            a.prototype.set = function(e) {
                return this.r = e.r || this.r || void 0, this.s = e.s || this.s || void 0, this.i = "undefined" != typeof e.i ? e.i : this.i, this.compressed = "undefined" != typeof e.compressed ? e.compressed : this.compressed, this
            }, a.fromCompact = function(e) {
                var t = new a,
                    r = !0,
                    i = e.slice(0, 1)[0] - 27 - 4,
                    o = e.slice(1, 33),
                    f = e.slice(33, 65);
                return s.checkArgument(0 === i || 1 === i || 2 === i || 3 === i, new Error("i must be 0, 1, 2, or 3")), s.checkArgument(32 === o.length, new Error("r must be 32 bytes")), s.checkArgument(32 === f.length, new Error("s must be 32 bytes")), t.compressed = r, t.i = i, t.r = n.fromBuffer(o), t.s = n.fromBuffer(f), t
            }, a.fromDER = function(e, t) {
                var r = a.parseDER(e, t),
                    n = new a;
                return n.r = r.r, n.s = r.s, n
            }, a.fromTxFormat = function(e) {
                var t = e.readUInt8(e.length - 1),
                    r = e.slice(0, e.length - 1),
                    n = new a.fromDER(r, !1);
                return n.nhashtype = t, n
            }, a.fromString = function(e) {
                var t = new r(e, "hex");
                return a.fromDER(t)
            }, a.parseDER = function(e, t) {
                s.checkArgument(o.isBuffer(e), new Error("DER formatted signature should be a buffer")), i.isUndefined(t) && (t = !0);
                var r = e[0];
                s.checkArgument(48 === r, new Error("Header byte should be 0x30"));
                var a = e[1],
                    f = e.slice(2).length;
                s.checkArgument(!t || a === f, new Error("Length byte should length of what follows")), a = f > a ? a : f;
                var c = e[2];
                s.checkArgument(2 === c, new Error("Integer byte for r should be 0x02"));
                var u = e[3],
                    d = e.slice(4, 4 + u),
                    h = n.fromBuffer(d),
                    p = 0 === e[4] ? !0 : !1;
                s.checkArgument(u === d.length, new Error("Length of r incorrect"));
                var l = e[4 + u + 0];
                s.checkArgument(2 === l, new Error("Integer byte for s should be 0x02"));
                var b = e[4 + u + 1],
                    g = e.slice(4 + u + 2, 4 + u + 2 + b),
                    y = n.fromBuffer(g),
                    m = 0 === e[4 + u + 2 + 2] ? !0 : !1;
                s.checkArgument(b === g.length, new Error("Length of s incorrect"));
                var v = 4 + u + 2 + b;
                s.checkArgument(a === v - 2, new Error("Length of signature incorrect"));
                var _ = {
                    header: r,
                    length: a,
                    rheader: c,
                    rlength: u,
                    rneg: p,
                    rbuf: d,
                    r: h,
                    sheader: l,
                    slength: b,
                    sneg: m,
                    sbuf: g,
                    s: y
                };
                return _
            }, a.prototype.toCompact = function(e, t) {
                if (e = "number" == typeof e ? e : this.i, t = "boolean" == typeof t ? t : this.compressed, 0 !== e && 1 !== e && 2 !== e && 3 !== e) throw new Error("i must be equal to 0, 1, 2, or 3");
                var n = e + 27 + 4;
                t === !1 && (n -= 4);
                var i = new r([n]),
                    s = this.r.toBuffer({
                        size: 32
                    }),
                    o = this.s.toBuffer({
                        size: 32
                    });
                return r.concat([i, s, o])
            }, a.prototype.toBuffer = a.prototype.toDER = function() {
                var e = this.r.toBuffer(),
                    t = this.s.toBuffer(),
                    n = 128 & e[0] ? !0 : !1,
                    i = 128 & t[0] ? !0 : !1,
                    s = n ? r.concat([new r([0]), e]) : e,
                    o = i ? r.concat([new r([0]), t]) : t,
                    a = s.length,
                    f = o.length,
                    c = 2 + a + 2 + f,
                    u = 2,
                    d = 2,
                    h = 48,
                    p = r.concat([new r([h, c, u, a]), s, new r([d, f]), o]);
                return p
            }, a.prototype.toString = function() {
                var e = this.toDER();
                return e.toString("hex")
            }, a.isTxDER = function(e) {
                if (e.length < 9) return !1;
                if (e.length > 73) return !1;
                if (48 !== e[0]) return !1;
                if (e[1] !== e.length - 3) return !1;
                var t = e[3];
                if (5 + t >= e.length) return !1;
                var r = e[5 + t];
                if (t + r + 7 !== e.length) return !1;
                var n = e.slice(4);
                if (2 !== e[2]) return !1;
                if (0 === t) return !1;
                if (128 & n[0]) return !1;
                if (t > 1 && 0 === n[0] && !(128 & n[1])) return !1;
                var i = e.slice(6 + t);
                return 2 !== e[6 + t - 2] ? !1 : 0 === r ? !1 : 128 & i[0] ? !1 : r > 1 && 0 === i[0] && !(128 & i[1]) ? !1 : !0
            }, a.prototype.hasLowS = function() {
                return this.s.lt(1) || this.s.gt(n("7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5D576E7357A4501DDFE92F46681B20A0")) ? !1 : !0
            }, a.prototype.hasDefinedHashtype = function() {
                return this.nhashtype < a.SIGHASH_ALL || this.nhashtype > a.SIGHASH_SINGLE ? !1 : !0
            }, a.prototype.toTxFormat = function() {
                var e = this.toDER(),
                    t = new r(1);
                return t.writeUInt8(this.nhashtype, 0), r.concat([e, t])
            }, a.SIGHASH_ALL = 1, a.SIGHASH_NONE = 2, a.SIGHASH_SINGLE = 3, a.SIGHASH_ANYONECANPAY = 128, t.exports = a
        }).call(this, e("buffer").Buffer)
    }, {
        "../util/buffer": 38,
        "../util/preconditions": 40,
        "./bn": 4,
        buffer: 43,
        lodash: 233
    }],
    10: [function(e, t) {
        (function(r) {
            "use strict";
            var n = e("lodash"),
                i = e("bs58"),
                s = e("buffer"),
                o = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz".split(""),
                a = function f(e) {
                    if (!(this instanceof f)) return new f(e);
                    if (r.isBuffer(e)) {
                        var t = e;
                        this.fromBuffer(t)
                    } else if ("string" == typeof e) {
                        var n = e;
                        this.fromString(n)
                    } else e && this.set(e)
                };
            a.validCharacters = function(e) {
                return s.Buffer.isBuffer(e) && (e = e.toString()), n.all(n.map(e, function(e) {
                    return n.contains(o, e)
                }))
            }, a.prototype.set = function(e) {
                return this.buf = e.buf || this.buf || void 0, this
            }, a.encode = function(e) {
                if (!s.Buffer.isBuffer(e)) throw new Error("Input should be a buffer");
                return i.encode(e)
            }, a.decode = function(e) {
                if ("string" != typeof e) throw new Error("Input should be a string");
                return new r(i.decode(e))
            }, a.prototype.fromBuffer = function(e) {
                return this.buf = e, this
            }, a.prototype.fromString = function(e) {
                var t = a.decode(e);
                return this.buf = t, this
            }, a.prototype.toBuffer = function() {
                return this.buf
            }, a.prototype.toString = function() {
                return a.encode(this.buf)
            }, t.exports = a
        }).call(this, e("buffer").Buffer)
    }, {
        bs58: 211,
        buffer: 43,
        lodash: 233
    }],
    11: [function(e, t) {
        (function(r) {
            "use strict";
            var n = e("lodash"),
                i = e("./base58"),
                s = e("buffer"),
                o = e("../crypto/hash").sha256sha256,
                a = function f(e) {
                    if (!(this instanceof f)) return new f(e);
                    if (r.isBuffer(e)) {
                        var t = e;
                        this.fromBuffer(t)
                    } else if ("string" == typeof e) {
                        var n = e;
                        this.fromString(n)
                    } else e && this.set(e)
                };
            a.prototype.set = function(e) {
                return this.buf = e.buf || this.buf || void 0, this
            }, a.validChecksum = function(e, t) {
                return n.isString(e) && (e = new s.Buffer(i.decode(e))), n.isString(t) && (t = new s.Buffer(i.decode(t))), t || (t = e.slice(-4), e = e.slice(0, -4)), a.checksum(e).toString("hex") === t.toString("hex")
            }, a.decode = function(e) {
                if ("string" != typeof e) throw new Error("Input must be a string");
                var t = new r(i.decode(e));
                if (t.length < 4) throw new Error("Input string too short");
                var n = t.slice(0, -4),
                    s = t.slice(-4),
                    a = o(n),
                    f = a.slice(0, 4);
                if (s.toString("hex") !== f.toString("hex")) throw new Error("Checksum mismatch");
                return n
            }, a.checksum = function(e) {
                return o(e).slice(0, 4)
            }, a.encode = function(e) {
                if (!r.isBuffer(e)) throw new Error("Input must be a buffer");
                var t = new r(e.length + 4),
                    n = a.checksum(e);
                return e.copy(t), n.copy(t, e.length), i.encode(t)
            }, a.prototype.fromBuffer = function(e) {
                return this.buf = e, this
            }, a.prototype.fromString = function(e) {
                var t = a.decode(e);
                return this.buf = t, this
            }, a.prototype.toBuffer = function() {
                return this.buf
            }, a.prototype.toString = function() {
                return a.encode(this.buf)
            }, t.exports = a
        }).call(this, e("buffer").Buffer)
    }, {
        "../crypto/hash": 6,
        "./base58": 10,
        buffer: 43,
        lodash: 233
    }],
    12: [function(e, t) {
        (function(r) {
            "use strict";
            var n = e("lodash"),
                i = e("../util/preconditions"),
                s = e("../util/buffer"),
                o = e("../crypto/bn"),
                a = function f(e) {
                    if (!(this instanceof f)) return new f(e);
                    if (r.isBuffer(e)) this.set({
                        buf: e
                    });
                    else if (e) {
                        var t = e;
                        this.set(t)
                    }
                };
            a.prototype.set = function(e) {
                return this.buf = e.buf || this.buf || void 0, this.pos = e.pos || this.pos || 0, this
            }, a.prototype.eof = function() {
                return this.pos >= this.buf.length
            }, a.prototype.read = function(e) {
                i.checkArgument(!n.isUndefined(e), "Must specify a length");
                var t = this.buf.slice(this.pos, this.pos + e);
                return this.pos = this.pos + e, t
            }, a.prototype.readAll = function() {
                var e = this.buf.slice(this.pos, this.buf.length);
                return this.pos = this.buf.length, e
            }, a.prototype.readUInt8 = function() {
                var e = this.buf.readUInt8(this.pos);
                return this.pos = this.pos + 1, e
            }, a.prototype.readUInt16BE = function() {
                var e = this.buf.readUInt16BE(this.pos);
                return this.pos = this.pos + 2, e
            }, a.prototype.readUInt16LE = function() {
                var e = this.buf.readUInt16LE(this.pos);
                return this.pos = this.pos + 2, e
            }, a.prototype.readUInt32BE = function() {
                var e = this.buf.readUInt32BE(this.pos);
                return this.pos = this.pos + 4, e
            }, a.prototype.readUInt32LE = function() {
                var e = this.buf.readUInt32LE(this.pos);
                return this.pos = this.pos + 4, e
            }, a.prototype.readUInt64BEBN = function() {
                var e = this.buf.slice(this.pos, this.pos + 8),
                    t = o.fromBuffer(e);
                return this.pos = this.pos + 8, t
            }, a.prototype.readUInt64LEBN = function() {
                var e = this.buf.slice(this.pos, this.pos + 8),
                    t = a({
                        buf: e
                    }).readReverse(),
                    r = o.fromBuffer(t);
                return this.pos = this.pos + 8, r
            }, a.prototype.readVarintNum = function() {
                var e = this.readUInt8();
                switch (e) {
                    case 253:
                        return this.readUInt16LE();
                    case 254:
                        return this.readUInt32LE();
                    case 255:
                        var t = this.readUInt64LEBN(),
                            r = t.toNumber();
                        if (r <= Math.pow(2, 53)) return r;
                        throw new Error("number too large to retain precision - use readVarintBN");
                    default:
                        return e
                }
            }, a.prototype.readVarintBuf = function() {
                var e = this.buf.readUInt8(this.pos);
                switch (e) {
                    case 253:
                        return this.read(3);
                    case 254:
                        return this.read(5);
                    case 255:
                        return this.read(9);
                    default:
                        return this.read(1)
                }
            }, a.prototype.readVarintBN = function() {
                var e = this.readUInt8();
                switch (e) {
                    case 253:
                        return o(this.readUInt16LE());
                    case 254:
                        return o(this.readUInt32LE());
                    case 255:
                        return this.readUInt64LEBN();
                    default:
                        return o(e)
                }
            }, a.prototype.reverse = function() {
                for (var e = new r(this.buf.length), t = 0; t < e.length; t++) e[t] = this.buf[this.buf.length - 1 - t];
                return this.buf = e, this
            }, a.prototype.readReverse = function(e) {
                n.isUndefined(e) && (e = this.buf.length);
                var t = this.buf.slice(this.pos, this.pos + e);
                return this.pos = this.pos + e, s.reverse(t)
            }, t.exports = a
        }).call(this, e("buffer").Buffer)
    }, {
        "../crypto/bn": 4,
        "../util/buffer": 38,
        "../util/preconditions": 40,
        buffer: 43,
        lodash: 233
    }],
    13: [function(e, t) {
        (function(r) {
            "use strict";
            var n = e("../util/buffer"),
                i = e("assert"),
                s = function o(e) {
                    return this instanceof o ? void(e ? this.set(e) : this.bufs = []) : new o(e)
                };
            s.prototype.set = function(e) {
                return this.bufs = e.bufs || this.bufs || [], this
            }, s.prototype.toBuffer = function() {
                return this.concat()
            }, s.prototype.concat = function() {
                return r.concat(this.bufs)
            }, s.prototype.write = function(e) {
                return i(n.isBuffer(e)), this.bufs.push(e), this
            }, s.prototype.writeReverse = function(e) {
                return i(n.isBuffer(e)), this.bufs.push(n.reverse(e)), this
            }, s.prototype.writeUInt8 = function(e) {
                var t = new r(1);
                return t.writeUInt8(e, 0), this.write(t), this
            }, s.prototype.writeUInt16BE = function(e) {
                var t = new r(2);
                return t.writeUInt16BE(e, 0), this.write(t), this
            }, s.prototype.writeUInt16LE = function(e) {
                var t = new r(2);
                return t.writeUInt16LE(e, 0), this.write(t), this
            }, s.prototype.writeUInt32BE = function(e) {
                var t = new r(4);
                return t.writeUInt32BE(e, 0), this.write(t), this
            }, s.prototype.writeInt32LE = function(e) {
                var t = new r(4);
                return t.writeInt32LE(e, 0), this.write(t), this
            }, s.prototype.writeUInt32LE = function(e) {
                var t = new r(4);
                return t.writeUInt32LE(e, 0), this.write(t), this
            }, s.prototype.writeUInt64BEBN = function(e) {
                var t = e.toBuffer({
                    size: 8
                });
                return this.write(t), this
            }, s.prototype.writeUInt64LEBN = function(e) {
                var t = e.toBuffer({
                        size: 8
                    }),
                    n = new r(Array.apply(new Array, t).reverse());
                return this.write(n), this
            }, s.prototype.writeVarintNum = function(e) {
                var t = s.varintBufNum(e);
                return this.write(t), this
            }, s.prototype.writeVarintBN = function(e) {
                var t = s.varintBufBN(e);
                return this.write(t), this
            }, s.varintBufNum = function(e) {
                var t = void 0;
                return 253 > e ? (t = new r(1), t.writeUInt8(e, 0)) : 65536 > e ? (t = new r(3), t.writeUInt8(253, 0), t.writeUInt16LE(e, 1)) : 4294967296 > e ? (t = new r(5), t.writeUInt8(254, 0), t.writeUInt32LE(e, 1)) : (t = new r(9), t.writeUInt8(255, 0), t.writeInt32LE(-1 & e, 1), t.writeUInt32LE(Math.floor(e / 4294967296), 5)), t
            }, s.varintBufBN = function(e) {
                var t = void 0,
                    n = e.toNumber();
                if (253 > n) t = new r(1), t.writeUInt8(n, 0);
                else if (65536 > n) t = new r(3), t.writeUInt8(253, 0), t.writeUInt16LE(n, 1);
                else if (4294967296 > n) t = new r(5), t.writeUInt8(254, 0), t.writeUInt32LE(n, 1);
                else {
                    var i = new s;
                    i.writeUInt8(255), i.writeUInt64LEBN(e);
                    var t = i.concat()
                }
                return t
            }, t.exports = s
        }).call(this, e("buffer").Buffer)
    }, {
        "../util/buffer": 38,
        assert: 41,
        buffer: 43
    }],
    14: [function(e, t) {
        (function(r) {
            "use strict";
            var n = e("./bufferwriter"),
                i = e("./bufferreader"),
                s = e("../crypto/bn"),
                o = function a(e) {
                    if (!(this instanceof a)) return new a(e);
                    if (r.isBuffer(e)) this.buf = e;
                    else if ("number" == typeof e) {
                        var t = e;
                        this.fromNumber(t)
                    } else if (e instanceof s) {
                        var n = e;
                        this.fromBN(n)
                    } else if (e) {
                        var i = e;
                        this.set(i)
                    }
                };
            o.prototype.set = function(e) {
                return this.buf = e.buf || this.buf, this
            }, o.prototype.fromString = function(e) {
                return this.set({
                    buf: new r(e, "hex")
                }), this
            }, o.prototype.toString = function() {
                return this.buf.toString("hex")
            }, o.prototype.fromBuffer = function(e) {
                return this.buf = e, this
            }, o.prototype.fromBufferReader = function(e) {
                return this.buf = e.readVarintBuf(), this
            }, o.prototype.fromBN = function(e) {
                return this.buf = n().writeVarintBN(e).concat(), this
            }, o.prototype.fromNumber = function(e) {
                return this.buf = n().writeVarintNum(e).concat(), this
            }, o.prototype.toBuffer = function() {
                return this.buf
            }, o.prototype.toBN = function() {
                return i(this.buf).readVarintBN()
            }, o.prototype.toNumber = function() {
                return i(this.buf).readVarintNum()
            }, t.exports = o
        }).call(this, e("buffer").Buffer)
    }, {
        "../crypto/bn": 4,
        "./bufferreader": 12,
        "./bufferwriter": 13,
        buffer: 43
    }],
    15: [function(e, t) {
        "use strict";

        function r(e, t) {
            return e.replace("{0}", t[0]).replace("{1}", t[1]).replace("{2}", t[2])
        }
        var n = e("lodash"),
            i = function(e, t) {
                var i = function() {
                    if (n.isString(t.message)) this.message = r(t.message, arguments);
                    else {
                        if (!n.isFunction(t.message)) throw new Error("Invalid error definition for " + t.name);
                        this.message = t.message.apply(null, arguments)
                    }
                    this.stack = this.message + "\n" + (new Error).stack
                };
                return i.prototype = Object.create(e.prototype), i.prototype.name = e.prototype.name + t.name, e[t.name] = i, t.errors && s(i, t.errors), i
            },
            s = function(e, t) {
                n.each(t, function(t) {
                    i(e, t)
                })
            },
            o = function(e, t) {
                return s(e, t), e
            },
            a = {};
        a.Error = function() {
            this.message = "Internal error", this.stack = this.message + "\n" + (new Error).stack
        }, a.Error.prototype = Object.create(Error.prototype), a.Error.prototype.name = "bitcore.Error";
        var f = e("./spec");
        o(a.Error, f), t.exports = a.Error, t.exports.extend = function(e) {
            return i(a.Error, e)
        }
    }, {
        "./spec": 16,
        lodash: 233
    }],
    16: [function(e, t) {
        "use strict";
        t.exports = [{
            name: "InvalidB58Char",
            message: "Invalid Base58 character: {0} in {1}"
        }, {
            name: "InvalidB58Checksum",
            message: "Invalid Base58 checksum for {0}"
        }, {
            name: "InvalidNetwork",
            message: "Invalid version for network: got {0}"
        }, {
            name: "InvalidState",
            message: "Invalid state: {0}"
        }, {
            name: "NotImplemented",
            message: "Function {0} was not implemented yet"
        }, {
            name: "InvalidNetworkArgument",
            message: 'Invalid network: must be "livenet" or "testnet", got {0}'
        }, {
            name: "InvalidArgument",
            message: function() {
                return "Invalid Argument" + (arguments[0] ? ": " + arguments[0] : "")
            }
        }, {
            name: "AbstractMethodInvoked",
            message: "Abstract Method Invokation: {0}"
        }, {
            name: "InvalidArgumentType",
            message: function() {
                return "Invalid Argument for " + arguments[2] + ", expected " + arguments[1] + " but got " + typeof arguments[0]
            }
        }, {
            name: "Unit",
            message: "Internal Error on Unit {0}",
            errors: [{
                name: "UnknownCode",
                message: "Unrecognized unit code: {0}"
            }, {
                name: "InvalidRate",
                message: "Invalid exchange rate: {0}"
            }]
        }, {
            name: "Transaction",
            message: "Internal Error on Transaction {0}",
            errors: [{
                name: "Input",
                message: "Internal Error on Input {0}",
                errors: [{
                    name: "MissingScript",
                    message: "Need a script to create an input"
                }]
            }, {
                name: "NeedMoreInfo",
                message: "{0}"
            }, {
                name: "UnableToVerifySignature",
                message: "Unable to verify signature: {0}"
            }, {
                name: "DustOutputs",
                message: "Dust amount detected in one output"
            }, {
                name: "FeeError",
                message: "Fees are not correctly set {0}"
            }, {
                name: "ChangeAddressMissing",
                message: "Change address is missing"
            }]
        }, {
            name: "Script",
            message: "Internal Error on Script {0}",
            errors: [{
                name: "UnrecognizedAddress",
                message: "Expected argument {0} to be an address"
            }]
        }, {
            name: "HDPrivateKey",
            message: "Internal Error on HDPrivateKey {0}",
            errors: [{
                name: "InvalidDerivationArgument",
                message: "Invalid derivation argument {0}, expected string, or number and boolean"
            }, {
                name: "InvalidEntropyArgument",
                message: "Invalid entropy: must be an hexa string or binary buffer, got {0}",
                errors: [{
                    name: "TooMuchEntropy",
                    message: 'Invalid entropy: more than 512 bits is non standard, got "{0}"'
                }, {
                    name: "NotEnoughEntropy",
                    message: 'Invalid entropy: at least 128 bits needed, got "{0}"'
                }]
            }, {
                name: "InvalidLength",
                message: "Invalid length for xprivkey string in {0}"
            }, {
                name: "InvalidPath",
                message: "Invalid derivation path: {0}"
            }, {
                name: "UnrecognizedArgument",
                message: 'Invalid argument: creating a HDPrivateKey requires a string, buffer, json or object, got "{0}"'
            }]
        }, {
            name: "HDPublicKey",
            message: "Internal Error on HDPublicKey {0}",
            errors: [{
                name: "ArgumentIsPrivateExtended",
                message: "Argument is an extended private key: {0}"
            }, {
                name: "InvalidDerivationArgument",
                message: "Invalid derivation argument: got {0}"
            }, {
                name: "InvalidLength",
                message: 'Invalid length for xpubkey: got "{0}"'
            }, {
                name: "InvalidPath",
                message: 'Invalid derivation path, it should look like: "m/1/100", got "{0}"'
            }, {
                name: "MustSupplyArgument",
                message: "Must supply an argument to create a HDPublicKey"
            }, {
                name: "UnrecognizedArgument",
                message: "Invalid argument for creation, must be string, json, buffer, or object"
            }]
        }]
    }, {}],
    17: [function(e, t) {
        "use strict";
        t.exports = {
            _cache: {},
            _count: 0,
            _eraseIndex: 0,
            _usedList: {},
            _usedIndex: {},
            _CACHE_SIZE: 5e3,
            get: function(e, t, r) {
                r = !!r;
                var n = e + "/" + t + "/" + r;
                return this._cache[n] ? (this._cacheHit(n), this._cache[n]) : void 0
            },
            set: function(e, t, r, n) {
                r = !!r;
                var i = e + "/" + t + "/" + r;
                this._cache[i] = n, this._cacheHit(i)
            },
            _cacheHit: function(e) {
                this._usedIndex[e] && delete this._usedList[this._usedIndex[e]], this._usedList[this._count] = e, this._usedIndex[e] = this._count, this._count++, this._cacheRemove()
            },
            _cacheRemove: function() {
                for (; this._eraseIndex < this._count - this._CACHE_SIZE;) {
                    if (this._usedList[this._eraseIndex]) {
                        var e = this._usedList[this._eraseIndex];
                        delete this._usedIndex[e], delete this._cache[e]
                    }
                    delete this._usedList[this._eraseIndex], this._eraseIndex++
                }
            }
        }
    }, {}],
    18: [function(e, t) {
        (function(r) {
            "use strict";

            function n(e) {
                if (e instanceof n) return e;
                if (!(this instanceof n)) return new n(e);
                if (!e) return this._generateRandomly();
                if (d.get(e)) return this._generateRandomly(e);
                if (o.isString(e) || m.isBuffer(e))
                    if (n.isValidSerialized(e)) this._buildFromSerialized(e);
                    else {
                        if (!v.isValidJSON(e)) throw n.getSerializedError(e);
                        this._buildFromJSON(e)
                    } else {
                    if (!o.isObject(e)) throw new y.UnrecognizedArgument(e);
                    this._buildFromObject(e)
                }
            }
            var i = e("assert"),
                s = e("buffer"),
                o = e("lodash"),
                a = e("./crypto/bn"),
                f = e("./encoding/base58"),
                c = e("./encoding/base58check"),
                u = e("./crypto/hash"),
                d = e("./networks"),
                h = e("./hdkeycache"),
                p = e("./crypto/point"),
                l = e("./privatekey"),
                b = e("./crypto/random"),
                g = e("./errors"),
                y = g.HDPrivateKey,
                m = e("./util/buffer"),
                v = e("./util/js"),
                _ = 128,
                w = 1 / 8,
                S = 512;
            n.isValidPath = function(e, t) {
                if (o.isString(e)) {
                    var r = n._getDerivationIndexes(e);
                    return null !== r && o.all(r, n.isValidPath)
                }
                return o.isNumber(e) ? (e < n.Hardened && t === !0 && (e += n.Hardened), e >= 0 && e < n.MaxIndex) : !1
            }, n._getDerivationIndexes = function(e) {
                var t = e.split("/");
                if (o.contains(n.RootElementAlias, e)) return [];
                if (!o.contains(n.RootElementAlias, t[0])) return null;
                var r = t.slice(1).map(function(e) {
                    var t = parseInt(e);
                    return t += e != t.toString() ? n.Hardened : 0
                });
                return o.any(r, isNaN) ? null : r
            }, n.prototype.derive = function(e, t) {
                if (o.isNumber(e)) return this._deriveWithNumber(e, t);
                if (o.isString(e)) return this._deriveFromString(e);
                throw new y.InvalidDerivationArgument(e)
            }, n.prototype._deriveWithNumber = function(e, t) {
                if (!n.isValidPath(e, t)) throw new y.InvalidPath(e);
                t = e >= n.Hardened ? !0 : t, e < n.Hardened && t === !0 && (e += n.Hardened);
                var r = h.get(this.xprivkey, e, t);
                if (r) return r;
                var i, o = m.integerAsBuffer(e);
                i = m.concat(t ? [new s.Buffer([0]), this.privateKey.toBuffer(), o] : [this.publicKey.toBuffer(), o]);
                var f = u.sha512hmac(i, this._buffers.chainCode),
                    c = a.fromBuffer(f.slice(0, 32), {
                        size: 32
                    }),
                    d = f.slice(32, 64),
                    l = c.add(this.privateKey.toBigNumber()).mod(p.getN()).toBuffer({
                        size: 32
                    }),
                    b = new n({
                        network: this.network,
                        depth: this.depth + 1,
                        parentFingerPrint: this.fingerPrint,
                        childIndex: e,
                        chainCode: d,
                        privateKey: l
                    });
                return h.set(this.xprivkey, e, t, b), b
            }, n.prototype._deriveFromString = function(e) {
                if (!n.isValidPath(e)) throw new y.InvalidPath(e);
                var t = n._getDerivationIndexes(e),
                    r = t.reduce(function(e, t) {
                        return e._deriveWithNumber(t)
                    }, this);
                return r
            }, n.isValidSerialized = function(e, t) {
                return !n.getSerializedError(e, t)
            }, n.getSerializedError = function(e, t) {
                if (!o.isString(e) && !m.isBuffer(e)) return new y.UnrecognizedArgument("Expected string or buffer");
                if (!f.validCharacters(e)) return new g.InvalidB58Char("(unknown)", e);
                try {
                    e = c.decode(e)
                } catch (r) {
                    return new g.InvalidB58Checksum(e)
                }
                if (e.length !== n.DataLength) return new y.InvalidLength(e);
                if (!o.isUndefined(t)) {
                    var i = n._validateNetwork(e, t);
                    if (i) return i
                }
                return null
            }, n._validateNetwork = function(e, t) {
                var r = d.get(t);
                if (!r) return new g.InvalidNetworkArgument(t);
                var n = e.slice(0, 4);
                return m.integerFromBuffer(n) !== r.xprivkey ? new g.InvalidNetwork(n) : null
            }, n.fromJSON = n.fromObject = n.fromString = function(e) {
                return new n(e)
            }, n.prototype._buildFromJSON = function(e) {
                return this._buildFromObject(JSON.parse(e))
            }, n.prototype._buildFromObject = function(e) {
                  var t = {
                    version: e.network ? m.integerAsBuffer(d.get(e.network).xprivkey) : e.version,
                    depth: o.isNumber(e.depth) ? m.integerAsSingleByteBuffer(e.depth) : e.depth,
                    parentFingerPrint: o.isNumber(e.parentFingerPrint) ? m.integerAsBuffer(e.parentFingerPrint) : e.parentFingerPrint,
                    childIndex: o.isNumber(e.childIndex) ? m.integerAsBuffer(e.childIndex) : e.childIndex,
                    chainCode: o.isString(e.chainCode) ? m.hexToBuffer(e.chainCode) : e.chainCode,
                    privateKey: o.isString(e.privateKey) && v.isHexa(e.privateKey) ? m.hexToBuffer(e.privateKey) : e.privateKey,
                    checksum: e.checksum ? e.checksum.length ? e.checksum : m.integerAsBuffer(e.checksum) : void 0
                };
                return this._buildFromBuffers(t)
            }, n.prototype._buildFromSerialized = function(e) {
                var t = c.decode(e),
                    r = {
                        version: t.slice(n.VersionStart, n.VersionEnd),
                        depth: t.slice(n.DepthStart, n.DepthEnd),
                        parentFingerPrint: t.slice(n.ParentFingerPrintStart, n.ParentFingerPrintEnd),
                        childIndex: t.slice(n.ChildIndexStart, n.ChildIndexEnd),
                        chainCode: t.slice(n.ChainCodeStart, n.ChainCodeEnd),
                        privateKey: t.slice(n.PrivateKeyStart, n.PrivateKeyEnd),
                        checksum: t.slice(n.ChecksumStart, n.ChecksumEnd),
                        xprivkey: e
                    };
                return this._buildFromBuffers(r)
            }, n.prototype._generateRandomly = function(e) {
                return n.fromSeed(b.getRandomBuffer(64), e)
            }, n.fromSeed = function(e, t) {
                if (v.isHexaString(e) && (e = m.hexToBuffer(e)), !r.isBuffer(e)) throw new y.InvalidEntropyArgument(e);
                if (e.length < _ * w) throw new y.InvalidEntropyArgument.NotEnoughEntropy(e);
                if (e.length > S * w) throw new y.InvalidEntropyArgument.TooMuchEntropy(e);
                var i = u.sha512hmac(e, new s.Buffer("Bitcoin seed"));
                return new n({
                    network: d.get(t) || d.defaultNetwork,
                    depth: 0,
                    parentFingerPrint: 0,
                    childIndex: 0,
                    privateKey: i.slice(0, 32),
                    chainCode: i.slice(32, 64)
                })
            }, n.prototype._buildFromBuffers = function(t) {
                n._validateBufferArguments(t), v.defineImmutable(this, {
                    _buffers: t
                });
                var r = [t.version, t.depth, t.parentFingerPrint, t.childIndex, t.chainCode, m.emptyBuffer(1), t.privateKey],
                    i = s.Buffer.concat(r);
                if (t.checksum && t.checksum.length) {
                    if (t.checksum.toString() !== c.checksum(i).toString()) throw new g.InvalidB58Checksum(i)
                } else t.checksum = c.checksum(i);
                var o;
                o = t.xprivkey ? t.xprivkey : c.encode(s.Buffer.concat(r));
                var f = new l(a.fromBuffer(t.privateKey)),
                    h = f.toPublicKey(),
                    p = n.ParentFingerPrintSize,
                    b = u.sha256ripemd160(h.toBuffer()).slice(0, p);
                
                v.defineImmutable(this, {
                    xprivkey: o,
                    network: d.get(m.integerFromBuffer(t.version)),
                    depth: m.integerFromSingleByteBuffer(t.depth),
                    privateKey: f,
                    publicKey: h,
                    fingerPrint: b
                });
                var y = e("./hdpublickey"),
                    _ = new y(this);
                return v.defineImmutable(this, {
                    hdPublicKey: _,
                    xpubkey: _.xpubkey
                }), this
            }, n._validateBufferArguments = function(e) {
                var t = function(t, r) {
                    var n = e[t];
                    i(m.isBuffer(n), t + " argument is not a buffer"), i(n.length === r, t + " has not the expected size: found " + n.length + ", expected " + r)
                };
                t("version", n.VersionSize), t("depth", n.DepthSize), t("parentFingerPrint", n.ParentFingerPrintSize), t("childIndex", n.ChildIndexSize), t("chainCode", n.ChainCodeSize), t("privateKey", n.PrivateKeySize), e.checksum && e.checksum.length && t("checksum", n.CheckSumSize)
            }, n.prototype.toString = function() {
                return this.xprivkey
            }, n.prototype.inspect = function() {
                return "<HDPrivateKey: " + this.xprivkey + ">"
            }, n.prototype.toObject = function() {
                return {
                    network: d.get(m.integerFromBuffer(this._buffers.version)).name,
                    depth: m.integerFromSingleByteBuffer(this._buffers.depth),
                    fingerPrint: m.integerFromBuffer(this.fingerPrint),
                    parentFingerPrint: m.integerFromBuffer(this._buffers.parentFingerPrint),
                    childIndex: m.integerFromBuffer(this._buffers.childIndex),
                    chainCode: m.bufferToHex(this._buffers.chainCode),
                    privateKey: this.privateKey.toBuffer().toString("hex"),
                    checksum: m.integerFromBuffer(this._buffers.checksum),
                    xprivkey: this.xprivkey
                }
            }, n.prototype.toJSON = function() {
                return JSON.stringify(this.toObject())
            }, n.DefaultDepth = 0, n.DefaultFingerprint = 0, n.DefaultChildIndex = 0, n.Hardened = 2147483648, n.MaxIndex = 2 * n.Hardened, n.RootElementAlias = ["m", "M", "m'", "M'"], n.VersionSize = 4, n.DepthSize = 1, n.ParentFingerPrintSize = 4, n.ChildIndexSize = 4, n.ChainCodeSize = 32, n.PrivateKeySize = 32, n.CheckSumSize = 4, n.DataLength = 78, n.SerializedByteSize = 82, n.VersionStart = 0, n.VersionEnd = n.VersionStart + n.VersionSize, n.DepthStart = n.VersionEnd, n.DepthEnd = n.DepthStart + n.DepthSize, n.ParentFingerPrintStart = n.DepthEnd, n.ParentFingerPrintEnd = n.ParentFingerPrintStart + n.ParentFingerPrintSize, n.ChildIndexStart = n.ParentFingerPrintEnd, n.ChildIndexEnd = n.ChildIndexStart + n.ChildIndexSize, n.ChainCodeStart = n.ChildIndexEnd, n.ChainCodeEnd = n.ChainCodeStart + n.ChainCodeSize, n.PrivateKeyStart = n.ChainCodeEnd + 1, n.PrivateKeyEnd = n.PrivateKeyStart + n.PrivateKeySize, n.ChecksumStart = n.PrivateKeyEnd, n.ChecksumEnd = n.ChecksumStart + n.CheckSumSize, i(n.ChecksumEnd === n.SerializedByteSize), t.exports = n
        }).call(this, e("buffer").Buffer)
    }, {
        "./crypto/bn": 4,
        "./crypto/hash": 6,
        "./crypto/point": 7,
        "./crypto/random": 8,
        "./encoding/base58": 10,
        "./encoding/base58check": 11,
        "./errors": 15,
        "./hdkeycache": 17,
        "./hdpublickey": 19,
        "./networks": 20,
        "./privatekey": 22,
        "./util/buffer": 38,
        "./util/js": 39,
        assert: 41,
        buffer: 43,
        lodash: 233
    }],
    19: [function(e, t) {
        "use strict";

        function r(e) {
            if (e instanceof r) return e;
            if (!(this instanceof r)) return new r(e);
            if (e) {
                if (n.isString(e) || m.isBuffer(e)) {
                    var t = r.getSerializedError(e);
                    if (t) {
                        if (y.isValidJSON(e)) return this._buildFromJSON(e);
                        if (t instanceof b.ArgumentIsPrivateExtended) return new f(e).hdPublicKey;
                        throw t
                    }
                    return this._buildFromSerialized(e)
                }
                if (n.isObject(e)) return e instanceof f ? this._buildFromPrivate(e) : this._buildFromObject(e);
                throw new b.UnrecognizedArgument(e)
            }
            throw new b.MustSupplyArgument
        }
        var n = e("lodash"),
            i = e("./crypto/bn"),
            s = e("./encoding/base58"),
            o = e("./encoding/base58check"),
            a = e("./crypto/hash"),
            f = e("./hdprivatekey"),
            c = e("./hdkeycache"),
            u = e("./networks"),
            d = e("./crypto/point"),
            h = e("./publickey"),
            p = e("./errors"),
            l = p,
            b = p.HDPublicKey,
            g = e("assert"),
            y = e("./util/js"),
            m = e("./util/buffer");
        r.isValidPath = function(e) {
            if (n.isString(e)) {
                var t = f._getDerivationIndexes(e);
                return null !== t && n.all(t, r.isValidPath)
            }
            return n.isNumber(e) ? e >= 0 && e < r.Hardened : !1
        }, r.prototype.derive = function(e) {
            if (n.isNumber(e)) return this._deriveWithNumber(e);
            if (n.isString(e)) return this._deriveFromString(e);
            throw new b.InvalidDerivationArgument(e)
        }, r.prototype._deriveWithNumber = function(e) {
            if (e >= r.Hardened) throw new b.InvalidIndexCantDeriveHardened;
            if (0 > e) throw new b.InvalidPath(e);
            var t = c.get(this.xpubkey, e, !1);
            if (t) return t;
            var n = m.integerAsBuffer(e),
                s = m.concat([this.publicKey.toBuffer(), n]),
                o = a.sha512hmac(s, this._buffers.chainCode),
                f = i.fromBuffer(o.slice(0, 32), {
                    size: 32
                }),
                u = o.slice(32, 64),
                p = h.fromPoint(d.getG().mul(f).add(this.publicKey.point)),
                l = new r({
                    network: this.network,
                    depth: this.depth + 1,
                    parentFingerPrint: this.fingerPrint,
                    childIndex: e,
                    chainCode: u,
                    publicKey: p
                });
            return c.set(this.xpubkey, e, !1, l), l
        }, r.prototype._deriveFromString = function(e) {
            if (n.contains(e, "'")) throw new b.InvalidIndexCantDeriveHardened;
            if (!r.isValidPath(e)) throw new b.InvalidPath(e);
            var t = f._getDerivationIndexes(e),
                i = t.reduce(function(e, t) {
                    return e._deriveWithNumber(t)
                }, this);
            return i
        }, r.isValidSerialized = function(e, t) {
            return n.isNull(r.getSerializedError(e, t))
        }, r.getSerializedError = function(e, t) {
            if (!n.isString(e) && !m.isBuffer(e)) return new b.UnrecognizedArgument("expected buffer or string");
            if (!s.validCharacters(e)) return new l.InvalidB58Char("(unknown)", e);
            try {
                e = o.decode(e)
            } catch (i) {
                return new l.InvalidB58Checksum(e)
            }
            if (e.length !== r.DataSize) return new l.InvalidLength(e);
            if (!n.isUndefined(t)) {
                var a = r._validateNetwork(e, t);
                if (a) return a
            }
            var f = m.integerFromBuffer(e.slice(0, 4));
            return f === u.livenet.xprivkey || f === u.testnet.xprivkey || f === u.bctestnet.xprivkey ? new b.ArgumentIsPrivateExtended : null
        }, r._validateNetwork = function(e, t) {
            var n = u.get(t);
            if (!n) return new l.InvalidNetworkArgument(t);
            var i = e.slice(r.VersionStart, r.VersionEnd);
            return m.integerFromBuffer(i) !== n.xpubkey ? new l.InvalidNetwork(i) : null
        }, r.prototype._buildFromJSON = function(e) {
            return this._buildFromObject(JSON.parse(e))
        }, r.prototype._buildFromPrivate = function(e) {
            var t = n.clone(e._buffers),
                r = d.getG().mul(i.fromBuffer(t.privateKey));
            return t.publicKey = d.pointToCompressed(r), t.version = m.integerAsBuffer(u.get(m.integerFromBuffer(t.version)).xpubkey), t.privateKey = void 0, t.checksum = void 0, t.xprivkey = void 0, this._buildFromBuffers(t)
        }, r.prototype._buildFromObject = function(e) {
            var t = {
                version: e.network ? m.integerAsBuffer(u.get(e.network).xpubkey) : e.version,
                depth: n.isNumber(e.depth) ? m.integerAsSingleByteBuffer(e.depth) : e.depth,
                parentFingerPrint: n.isNumber(e.parentFingerPrint) ? m.integerAsBuffer(e.parentFingerPrint) : e.parentFingerPrint,
                childIndex: n.isNumber(e.childIndex) ? m.integerAsBuffer(e.childIndex) : e.childIndex,
                chainCode: n.isString(e.chainCode) ? m.hexToBuffer(e.chainCode) : e.chainCode,
                publicKey: n.isString(e.publicKey) ? m.hexToBuffer(e.publicKey) : m.isBuffer(e.publicKey) ? e.publicKey : e.publicKey.toBuffer(),
                checksum: n.isNumber(e.checksum) ? m.integerAsBuffer(e.checksum) : e.checksum
            };
            return this._buildFromBuffers(t)
        }, r.prototype._buildFromSerialized = function(e) {
            var t = o.decode(e),
                n = {
                    version: t.slice(r.VersionStart, r.VersionEnd),
                    depth: t.slice(r.DepthStart, r.DepthEnd),
                    parentFingerPrint: t.slice(r.ParentFingerPrintStart, r.ParentFingerPrintEnd),
                    childIndex: t.slice(r.ChildIndexStart, r.ChildIndexEnd),
                    chainCode: t.slice(r.ChainCodeStart, r.ChainCodeEnd),
                    publicKey: t.slice(r.PublicKeyStart, r.PublicKeyEnd),
                    checksum: t.slice(r.ChecksumStart, r.ChecksumEnd),
                    xpubkey: e
                };
            return this._buildFromBuffers(n)
        }, r.prototype._buildFromBuffers = function(e) {
            r._validateBufferArguments(e), y.defineImmutable(this, {
                _buffers: e
            });
            var t = [e.version, e.depth, e.parentFingerPrint, e.childIndex, e.chainCode, e.publicKey],
                n = m.concat(t),
                i = o.checksum(n);
            if (e.checksum && e.checksum.length) {
                if (e.checksum.toString("hex") !== i.toString("hex")) throw new l.InvalidB58Checksum(n, i)
            } else e.checksum = i;
            var s;
            s = e.xpubkey ? e.xpubkey : o.encode(m.concat(t));
            var f = h.fromString(e.publicKey),
                c = r.ParentFingerPrintSize,
                d = a.sha256ripemd160(f.toBuffer()).slice(0, c);
            return y.defineImmutable(this, {
                xpubkey: s,
                network: u.get(m.integerFromBuffer(e.version)),
                depth: m.integerFromSingleByteBuffer(e.depth),
                publicKey: f,
                fingerPrint: d
            }), this
        }, r._validateBufferArguments = function(e) {
            var t = function(t, r) {
                var n = e[t];
                g(m.isBuffer(n), t + " argument is not a buffer, it's " + typeof n), g(n.length === r, t + " has not the expected size: found " + n.length + ", expected " + r)
            };
            t("version", r.VersionSize), t("depth", r.DepthSize), t("parentFingerPrint", r.ParentFingerPrintSize), t("childIndex", r.ChildIndexSize), t("chainCode", r.ChainCodeSize), t("publicKey", r.PublicKeySize), e.checksum && e.checksum.length && t("checksum", r.CheckSumSize)
        }, r.fromString = r.fromObject = r.fromJSON = function(e) {
            return new r(e)
        }, r.prototype.toString = function() {
            return this.xpubkey
        }, r.prototype.inspect = function() {
            return "<HDPublicKey: " + this.xpubkey + ">"
        }, r.prototype.toObject = function() {
            return {
                network: u.get(m.integerFromBuffer(this._buffers.version)).name,
                depth: m.integerFromSingleByteBuffer(this._buffers.depth),
                fingerPrint: m.integerFromBuffer(this.fingerPrint),
                parentFingerPrint: m.integerFromBuffer(this._buffers.parentFingerPrint),
                childIndex: m.integerFromBuffer(this._buffers.childIndex),
                chainCode: m.bufferToHex(this._buffers.chainCode),
                publicKey: this.publicKey.toString(),
                checksum: m.integerFromBuffer(this._buffers.checksum),
                xpubkey: this.xpubkey
            }
        }, r.prototype.toJSON = function() {
            return JSON.stringify(this.toObject())
        }, r.Hardened = 2147483648, r.RootElementAlias = ["m", "M"], r.VersionSize = 4, r.DepthSize = 1, r.ParentFingerPrintSize = 4, r.ChildIndexSize = 4, r.ChainCodeSize = 32, r.PublicKeySize = 33, r.CheckSumSize = 4, r.DataSize = 78, r.SerializedByteSize = 82, r.VersionStart = 0, r.VersionEnd = r.VersionStart + r.VersionSize, r.DepthStart = r.VersionEnd, r.DepthEnd = r.DepthStart + r.DepthSize, r.ParentFingerPrintStart = r.DepthEnd, r.ParentFingerPrintEnd = r.ParentFingerPrintStart + r.ParentFingerPrintSize, r.ChildIndexStart = r.ParentFingerPrintEnd, r.ChildIndexEnd = r.ChildIndexStart + r.ChildIndexSize, r.ChainCodeStart = r.ChildIndexEnd, r.ChainCodeEnd = r.ChainCodeStart + r.ChainCodeSize, r.PublicKeyStart = r.ChainCodeEnd, r.PublicKeyEnd = r.PublicKeyStart + r.PublicKeySize, r.ChecksumStart = r.PublicKeyEnd, r.ChecksumEnd = r.ChecksumStart + r.CheckSumSize, g(r.PublicKeyEnd === r.DataSize), g(r.ChecksumEnd === r.SerializedByteSize), t.exports = r
    }, {
        "./crypto/bn": 4,
        "./crypto/hash": 6,
        "./crypto/point": 7,
        "./encoding/base58": 10,
        "./encoding/base58check": 11,
        "./errors": 15,
        "./hdkeycache": 17,
        "./hdprivatekey": 18,
        "./networks": 20,
        "./publickey": 23,
        "./util/buffer": 38,
        "./util/js": 39,
        assert: 41,
        lodash: 233
    }],
    20: [function(e, t) {
        "use strict";

        function r() {}

        function n(e, t) {
            if (e === o || e === a || e === bctestnet) return e;
            if (t) {
                var r = [o, a, bctestnet];
                for (var n in r)
                    if (r[n][t] === e) return r[n];
                return void 0
            }
            return f[e]
        }
        var i = e("lodash"),
            s = e("./util/buffer");
        r.prototype.toString = function() {
            return this.name
        };
        var o = new r;
        i.extend(o, {
            name: "livenet",
            alias: "mainnet",
            pubkeyhash: 0,
            privatekey: 128,
            scripthash: 5,
            xpubkey: 76067358,
            xprivkey: 76066276,
            networkMagic: s.integerAsBuffer(4190024921),
            port: 8333,
            dnsSeeds: ["seed.bitcoin.sipa.be", "dnsseed.bluematt.me", "dnsseed.bitcoin.dashjr.org", "seed.bitcoinstats.com", "seed.bitnodes.io", "bitseed.xf2.org"]
        });
        
        var bctestnet = new r;
         i.extend(bctestnet, {
             name: 'bctestnet',
             alias: 'bctestnet',
             pubkeyhash: 0x1B,
             privatekey: 212,
             scripthash: 0x1F,
             xpubkey: 70637039,
             xprivkey: 70215956,
             //networkMagic: BufferUtil.integerAsBuffer(0x0b110907),
             port: 18333,
             dnsSeeds: ["testnet-seed.bitcoin.petertodd.org", "testnet-seed.bluematt.me"],

         });
        var a = new r;
        i.extend(a, {
            name: "testnet",
            alias: "testnet",
            pubkeyhash: 111,
            privatekey: 239,
            scripthash: 196,
            xpubkey: 70617039,
            xprivkey: 70615956,
            networkMagic: s.integerAsBuffer(185665799),
            port: 18333,
            dnsSeeds: ["testnet-seed.bitcoin.petertodd.org", "testnet-seed.bluematt.me"]
        });
        var f = {};
        i.each(i.values(o), function(e) {
            i.isObject(e) || (f[e] = o)
        }), i.each(i.values(a), function(e) {
            i.isObject(e) || (f[e] = a)
        }),i.each(i.values(bctestnet), function(e) {
            i.isObject(e) || (f[e] = bctestnet)
        }), t.exports = {
            defaultNetwork: o,
            livenet: o,
            mainnet: o,
            testnet: a,
            bctestnet:bctestnet,
            get: n
        }
    }, {
        "./util/buffer": 38,
        lodash: 233
    }],
    21: [function(e, t) {
        (function(r) {
            "use strict";

            function n(e) {
                if (!(this instanceof n)) return new n(e);
                var t;
                if (i.isNumber(e)) t = e;
                else {
                    if (!i.isString(e)) throw new TypeError('Unrecognized num type: "' + typeof e + '" for Opcode');
                    t = n.map[e]
                }
                return a.defineImmutable(this, {
                    num: t
                }), this
            }
            var i = e("lodash"),
                s = e("./util/preconditions"),
                o = e("./util/buffer"),
                a = e("./util/js");
            n.fromBuffer = function(e) {
                return s.checkArgument(o.isBuffer(e)), new n(Number("0x" + e.toString("hex")))
            }, n.fromNumber = function(e) {
                return s.checkArgument(i.isNumber(e)), new n(e)
            }, n.fromString = function(e) {
                s.checkArgument(i.isString(e));
                var t = n.map[e];
                if ("undefined" == typeof t) throw new TypeError("Invalid opcodestr");
                return new n(t)
            }, n.prototype.toHex = function() {
                return this.num.toString(16)
            }, n.prototype.toBuffer = function() {
                return new r(this.toHex(), "hex")
            }, n.prototype.toNumber = function() {
                return this.num
            }, n.prototype.toString = function() {
                var e = n.reverseMap[this.num];
                if ("undefined" == typeof e) throw new Error("Opcode does not have a string representation");
                return e
            }, n.smallInt = function(e) {
                return s.checkArgument(e >= 0 && 16 >= e, "Invalid Argument: n must be between 0 and 16"), 0 === e ? n("OP_0") : new n(n.map.OP_1 + e - 1)
            }, n.map = {
                OP_FALSE: 0,
                OP_0: 0,
                OP_PUSHDATA1: 76,
                OP_PUSHDATA2: 77,
                OP_PUSHDATA4: 78,
                OP_1NEGATE: 79,
                OP_RESERVED: 80,
                OP_TRUE: 81,
                OP_1: 81,
                OP_2: 82,
                OP_3: 83,
                OP_4: 84,
                OP_5: 85,
                OP_6: 86,
                OP_7: 87,
                OP_8: 88,
                OP_9: 89,
                OP_10: 90,
                OP_11: 91,
                OP_12: 92,
                OP_13: 93,
                OP_14: 94,
                OP_15: 95,
                OP_16: 96,
                OP_NOP: 97,
                OP_VER: 98,
                OP_IF: 99,
                OP_NOTIF: 100,
                OP_VERIF: 101,
                OP_VERNOTIF: 102,
                OP_ELSE: 103,
                OP_ENDIF: 104,
                OP_VERIFY: 105,
                OP_RETURN: 106,
                OP_TOALTSTACK: 107,
                OP_FROMALTSTACK: 108,
                OP_2DROP: 109,
                OP_2DUP: 110,
                OP_3DUP: 111,
                OP_2OVER: 112,
                OP_2ROT: 113,
                OP_2SWAP: 114,
                OP_IFDUP: 115,
                OP_DEPTH: 116,
                OP_DROP: 117,
                OP_DUP: 118,
                OP_NIP: 119,
                OP_OVER: 120,
                OP_PICK: 121,
                OP_ROLL: 122,
                OP_ROT: 123,
                OP_SWAP: 124,
                OP_TUCK: 125,
                OP_CAT: 126,
                OP_SUBSTR: 127,
                OP_LEFT: 128,
                OP_RIGHT: 129,
                OP_SIZE: 130,
                OP_INVERT: 131,
                OP_AND: 132,
                OP_OR: 133,
                OP_XOR: 134,
                OP_EQUAL: 135,
                OP_EQUALVERIFY: 136,
                OP_RESERVED1: 137,
                OP_RESERVED2: 138,
                OP_1ADD: 139,
                OP_1SUB: 140,
                OP_2MUL: 141,
                OP_2DIV: 142,
                OP_NEGATE: 143,
                OP_ABS: 144,
                OP_NOT: 145,
                OP_0NOTEQUAL: 146,
                OP_ADD: 147,
                OP_SUB: 148,
                OP_MUL: 149,
                OP_DIV: 150,
                OP_MOD: 151,
                OP_LSHIFT: 152,
                OP_RSHIFT: 153,
                OP_BOOLAND: 154,
                OP_BOOLOR: 155,
                OP_NUMEQUAL: 156,
                OP_NUMEQUALVERIFY: 157,
                OP_NUMNOTEQUAL: 158,
                OP_LESSTHAN: 159,
                OP_GREATERTHAN: 160,
                OP_LESSTHANOREQUAL: 161,
                OP_GREATERTHANOREQUAL: 162,
                OP_MIN: 163,
                OP_MAX: 164,
                OP_WITHIN: 165,
                OP_RIPEMD160: 166,
                OP_SHA1: 167,
                OP_SHA256: 168,
                OP_HASH160: 169,
                OP_HASH256: 170,
                OP_CODESEPARATOR: 171,
                OP_CHECKSIG: 172,
                OP_CHECKSIGVERIFY: 173,
                OP_CHECKMULTISIG: 174,
                OP_CHECKMULTISIGVERIFY: 175,
                OP_NOP1: 176,
                OP_NOP2: 177,
                OP_NOP3: 178,
                OP_NOP4: 179,
                OP_NOP5: 180,
                OP_NOP6: 181,
                OP_NOP7: 182,
                OP_NOP8: 183,
                OP_NOP9: 184,
                OP_NOP10: 185,
                OP_PUBKEYHASH: 253,
                OP_PUBKEY: 254,
                OP_INVALIDOPCODE: 255
            }, n.reverseMap = [];
            for (var f in n.map) n.reverseMap[n.map[f]] = f;
            i.extend(n, n.map), n.isSmallIntOp = function(e) {
                return e instanceof n && (e = e.toNumber()), e === n.map.OP_0 || e >= n.map.OP_1 && e <= n.map.OP_16
            }, t.exports = n
        }).call(this, e("buffer").Buffer)
    }, {
        "./util/buffer": 38,
        "./util/js": 39,
        "./util/preconditions": 40,
        buffer: 43,
        lodash: 233
    }],
    22: [function(e, t) {
        (function(r) {
            "use strict";
            var n = e("lodash"),
                i = e("./address"),
                s = e("./encoding/base58check"),
                o = e("./crypto/bn"),
                a = e("./util/js"),
                f = e("./networks"),
                c = e("./crypto/point"),
                u = e("./publickey"),
                d = e("./crypto/random"),
                h = function p(e, t) {
                    if (!(this instanceof p)) return new p(e, t);
                    if (e instanceof p) return e;
                    var r = this._classifyArguments(e, t);
                    if (!r.bn || 0 === r.bn.cmp(0)) throw new TypeError("Number can not be equal to zero, undefined, null or false");
                    if (!r.bn.lt(c.getN())) throw new TypeError("Number must be less than N");
                    if ("undefined" == typeof r.network) throw new TypeError('Must specify the network ("livenet" or "testnet")');
                    return a.defineImmutable(this, {
                        bn: r.bn,
                        compressed: r.compressed,
                        network: r.network
                    }), Object.defineProperty(this, "publicKey", {
                        configurable: !1,
                        enumerable: !0,
                        get: this.toPublicKey.bind(this)
                    }), this
                };
            h.prototype._classifyArguments = function(e, t) {
                var i = {
                    compressed: !0,
                    network: t ? f.get(t) : f.defaultNetwork
                };
                if (n.isUndefined(e) || n.isNull(e)) i.bn = h._getRandomBN();
                else if (e instanceof o) i.bn = e;
                else if (e instanceof r || e instanceof Uint8Array) i = h._transformBuffer(e, t);
                else if (h._isJSON(e)) i = h._transformJSON(e);
                else if (!t && f.get(e)) i.bn = h._getRandomBN(), i.network = f.get(e);
                else {
                    if ("string" != typeof e) throw new TypeError("First argument is an unrecognized data type.");
                    a.isHexa(e) ? i.bn = o(new r(e, "hex")) : i = h._transformWIF(e, t)
                }
                return i
            }, h._getRandomBN = function() {
                var e, t;
                do {
                    var r = d.getRandomBuffer(32);
                    t = o.fromBuffer(r), e = t.lt(c.getN())
                } while (!e);
                return t
            }, h._isJSON = function(e) {
                return a.isValidJSON(e) || e.bn && e.network
            }, h._transformBuffer = function(e, t) {
                var r = {};
                if (34 === e.length && 1 === e[33]) r.compressed = !0;
                else {
                    if (33 !== e.length) throw new Error("Length of buffer must be 33 (uncompressed) or 34 (compressed)");
                    r.compressed = !1
                }
                if (r.network = f.get(e[0], "privatekey"), e[0] === f.livenet.privatekey) r.network = f.livenet;
                else {
                    if (e[0] !== f.testnet.privatekey) throw new Error("Invalid network");
                    r.network = f.testnet
                }
                if (t && r.network !== f.get(t)) throw new TypeError("Private key network mismatch");
                return r.bn = o.fromBuffer(e.slice(1, 33)), r
            }, h._transformWIF = function(e, t) {
                return h._transformBuffer(s.decode(e), t)
            }, h.fromJSON = function(e) {
                if (!h._isJSON(e)) throw new TypeError("Must be a valid JSON string or plain object");
                return new h(e)
            }, h._transformJSON = function(e) {
                a.isValidJSON(e) && (e = JSON.parse(e));
                var t = o(e.bn, "hex");
                return {
                    bn: t,
                    network: e.network,
                    compressed: e.compressed
                }
            }, h.fromString = h.fromWIF = function(e) {
                return new h(e)
            }, h.fromRandom = function(e) {
                var t = h._getRandomBN();
                return new h(t, e)
            }, h.getValidationError = function(e, t) {
                var r;
                try {
                    new h(e, t)
                } catch (n) {
                    r = n
                }
                return r
            }, h.isValid = function(e, t) {
                return !h.getValidationError(e, t)
            }, h.prototype.toString = function() {
                return this.toBuffer().toString("hex")
            }, h.prototype.toWIF = function() {
                var e, t = this.network,
                    n = this.compressed;
                return e = r.concat(n ? [new r([t.privatekey]), this.bn.toBuffer({
                    size: 32
                }), new r([1])] : [new r([t.privatekey]), this.bn.toBuffer({
                    size: 32
                })]), s.encode(e)
            }, h.prototype.toBigNumber = function() {
                return this.bn
            }, h.prototype.toBuffer = function() {
                return this.bn.toBuffer()
            }, h.prototype.toPublicKey = function() {
                return this._pubkey || (this._pubkey = u.fromPrivateKey(this)), this._pubkey
            }, h.prototype.toAddress = function() {
                var e = this.toPublicKey();
                return i.fromPublicKey(e, this.network)
            }, h.prototype.toObject = function() {
                return {
                    bn: this.bn.toString("hex"),
                    compressed: this.compressed,
                    network: this.network.toString()
                }
            }, h.prototype.toJSON = function() {
                return JSON.stringify(this.toObject())
            }, h.prototype.inspect = function() {
                var e = this.compressed ? "" : ", uncompressed";
                return "<PrivateKey: " + this.toString() + ", network: " + this.network + e + ">"
            }, t.exports = h
        }).call(this, e("buffer").Buffer)
    }, {
        "./address": 1,
        "./crypto/bn": 4,
        "./crypto/point": 7,
        "./crypto/random": 8,
        "./encoding/base58check": 11,
        "./networks": 20,
        "./publickey": 23,
        "./util/js": 39,
        buffer: 43,
        lodash: 233
    }],
    23: [function(e, t) {
        (function(r) {
            "use strict";
            var n = e("./address"),
                i = e("./crypto/bn"),
                s = e("./crypto/point"),
                o = e("./crypto/hash"),
                a = e("./util/js"),
                f = e("./networks"),
                c = e("lodash"),
                u = e("./util/preconditions"),
                d = function h(e, t) {
                    if (!(this instanceof h)) return new h(e, t);
                    if (u.checkArgument(e, new TypeError("First argument is required, please include public key data.")), e instanceof h) return e;
                    t = t || {};
                    var r = this._classifyArgs(e, t);
                    return r.point.validate(), a.defineImmutable(this, {
                        point: r.point,
                        compressed: r.compressed,
                        network: r.network || f.defaultNetwork
                    }), this
                };
            d.prototype._classifyArgs = function(e, t) {
                var n = {
                    compressed: c.isUndefined(t.compressed) || t.compressed,
                    network: c.isUndefined(t.network) ? void 0 : f.get(t.network)
                };
                if (e instanceof s) n.point = e;
                else if (d._isJSON(e)) n = d._transformJSON(e);
                else if ("string" == typeof e) n = d._transformDER(new r(e, "hex"));
                else if (d._isBuffer(e)) n = d._transformDER(e);
                else {
                    if (!d._isPrivateKey(e)) throw new TypeError("First argument is an unrecognized data format.");
                    n = d._transformPrivateKey(e)
                }
                return n
            }, d._isPrivateKey = function(t) {
                var r = e("./privatekey");
                return t instanceof r
            }, d._isBuffer = function(e) {
                return e instanceof r || e instanceof Uint8Array
            }, d._isJSON = function(e) {
                return !!(a.isValidJSON(e) || e.x && e.y)
            }, d._transformPrivateKey = function(e) {
                u.checkArgument(d._isPrivateKey(e), new TypeError("Must be an instance of PrivateKey"));
                var t = {};
                return t.point = s.getG().mul(e.bn), t.compressed = e.compressed, t.network = e.network, t
            }, d._transformDER = function(e, t) {
                u.checkArgument(d._isBuffer(e), new TypeError("Must be a hex buffer of DER encoded public key"));
                var r = {};
                t = c.isUndefined(t) ? !0 : t;
                var n, o, a, f;
                if (4 !== e[0] && (t || 6 !== e[0] && 7 !== e[0]))
                    if (3 === e[0]) a = e.slice(1), n = i(a), r = d._transformX(!0, n), r.compressed = !0;
                    else {
                        if (2 !== e[0]) throw new TypeError("Invalid DER format public key");
                        a = e.slice(1), n = i(a), r = d._transformX(!1, n), r.compressed = !0
                    } else {
                    if (a = e.slice(1, 33), f = e.slice(33, 65), 32 !== a.length || 32 !== f.length || 65 !== e.length) throw new TypeError("Length of x and y must be 32 bytes");
                    n = i(a), o = i(f), r.point = new s(n, o), r.compressed = !1
                }
                return r
            }, d._transformX = function(e, t) {
                u.checkArgument("boolean" == typeof e, new TypeError("Must specify whether y is odd or not (true or false)"));
                var r = {};
                return r.point = s.fromX(e, t), r
            }, d.fromJSON = function(e) {
                return u.checkArgument(d._isJSON(e), new TypeError("Must be a valid JSON string or plain object")), new d(e)
            }, d._transformJSON = function(e) {
                a.isValidJSON(e) && (e = JSON.parse(e));
                var t = i(e.x, "hex"),
                    r = i(e.y, "hex"),
                    n = new s(t, r);
                return new d(n, {
                    compressed: e.compressed
                })
            }, d.fromPrivateKey = function(e) {
                u.checkArgument(d._isPrivateKey(e), new TypeError("Must be an instance of PrivateKey"));
                var t = d._transformPrivateKey(e);
                return new d(t.point, {
                    compressed: t.compressed,
                    network: t.network
                })
            }, d.fromDER = d.fromBuffer = function(e, t) {
                u.checkArgument(d._isBuffer(e), new TypeError("Must be a hex buffer of DER encoded public key"));
                var r = d._transformDER(e, t);
                return new d(r.point, {
                    compressed: r.compressed
                })
            }, d.fromPoint = function(e, t) {
                return u.checkArgument(e instanceof s, new TypeError("First argument must be an instance of Point.")), new d(e, {
                    compressed: t
                })
            }, d.fromString = function(e, t) {
                var n = new r(e, t || "hex"),
                    i = d._transformDER(n);
                return new d(i.point, {
                    compressed: i.compressed
                })
            }, d.fromX = function(e, t) {
                var r = d._transformX(e, t);
                return new d(r.point, {
                    compressed: r.compressed
                })
            }, d.getValidationError = function(e) {
                var t;
                try {
                    new d(e)
                } catch (r) {
                    t = r
                }
                return t
            }, d.isValid = function(e) {
                return !d.getValidationError(e)
            }, d.prototype.toObject = function() {
                return {
                    x: this.point.getX().toString("hex"),
                    y: this.point.getY().toString("hex"),
                    compressed: this.compressed
                }
            }, d.prototype.toJSON = function() {
                return JSON.stringify(this.toObject())
            }, d.prototype.toBuffer = d.prototype.toDER = function() {
                var e, t = this.point.getX(),
                    n = this.point.getY(),
                    i = t.toBuffer({
                        size: 32
                    }),
                    s = n.toBuffer({
                        size: 32
                    });
                if (this.compressed) {
                    var o = s[s.length - 1] % 2;
                    return e = new r(o ? [3] : [2]), r.concat([e, i])
                }
                return e = new r([4]), r.concat([e, i, s])
            }, d.prototype._getID = function() {
                return o.sha256ripemd160(this.toBuffer())
            }, d.prototype.toAddress = function(e) {
                return n.fromPublicKey(this, e || this.network)
            }, d.prototype.toString = function() {
                return this.toDER().toString("hex")
            }, d.prototype.inspect = function() {
                return "<PublicKey: " + this.toString() + (this.compressed ? "" : ", uncompressed") + ">"
            }, t.exports = d
        }).call(this, e("buffer").Buffer)
    }, {
        "./address": 1,
        "./crypto/bn": 4,
        "./crypto/hash": 6,
        "./crypto/point": 7,
        "./networks": 20,
        "./privatekey": 22,
        "./util/js": 39,
        "./util/preconditions": 40,
        buffer: 43,
        lodash: 233
    }],
    24: [function(e, t) {
        t.exports = e("./script"), t.exports.Interpreter = e("./interpreter")
    }, {
        "./interpreter": 25,
        "./script": 26
    }],
    25: [function(e, t) {
        (function(r) {
            "use strict";
            var n = e("lodash"),
                i = e("./script"),
                s = e("../opcode"),
                o = e("../crypto/bn"),
                a = e("../crypto/hash"),
                f = e("../crypto/signature"),
                c = e("../publickey"),
                u = function d(e) {
                    return this instanceof d ? void(e ? (this.initialize(), this.set(e)) : this.initialize()) : new d(e)
                };
            u.prototype.verify = function(t, r, s, o, a) {
                var f = e("../transaction");
                n.isUndefined(s) && (s = new f), n.isUndefined(o) && (o = 0), n.isUndefined(a) && (a = 0), this.set({
                    script: t,
                    tx: s,
                    nin: o,
                    flags: a
                });
                var c;
                if (0 !== (a & u.SCRIPT_VERIFY_SIGPUSHONLY) && !t.isPushOnly()) return this.errstr = "SCRIPT_ERR_SIG_PUSHONLY", !1;
                if (!this.evaluate()) return !1;
                a & u.SCRIPT_VERIFY_P2SH && (c = this.stack.slice());
                var d = this.stack;
                if (this.initialize(), this.set({
                        script: r,
                        stack: d,
                        tx: s,
                        nin: o,
                        flags: a
                    }), !this.evaluate()) return !1;
                if (0 === this.stack.length) return this.errstr = "SCRIPT_ERR_EVAL_FALSE_NO_RESULT", !1;
                var h = this.stack[this.stack.length - 1];
                if (!u.castToBool(h)) return this.errstr = "SCRIPT_ERR_EVAL_FALSE_IN_STACK", !1;
                if (a & u.SCRIPT_VERIFY_P2SH && r.isScriptHashOut()) {
                    if (!t.isPushOnly()) return this.errstr = "SCRIPT_ERR_SIG_PUSHONLY", !1;
                    if (0 === c.length) throw new Error("internal error - stack copy empty");
                    var p = c[c.length - 1],
                        l = i.fromBuffer(p);
                    return c.pop(), this.initialize(), this.set({
                        script: l,
                        stack: c,
                        tx: s,
                        nin: o,
                        flags: a
                    }), this.evaluate() ? 0 === c.length ? (this.errstr = "SCRIPT_ERR_EVAL_FALSE_NO_P2SH_STACK", !1) : u.castToBool(c[c.length - 1]) ? !0 : (this.errstr = "SCRIPT_ERR_EVAL_FALSE_IN_P2SH_STACK", !1) : !1
                }
                return !0
            }, t.exports = u, u.prototype.initialize = function() {
                this.stack = [], this.altstack = [], this.pc = 0, this.pbegincodehash = 0, this.nOpCount = 0, this.vfExec = [], this.errstr = "", this.flags = 0
            }, u.prototype.set = function(e) {
                this.script = e.script || this.script, this.tx = e.tx || this.tx, this.nin = "undefined" != typeof e.nin ? e.nin : this.nin, this.stack = e.stack || this.stack, this.altstack = e.altack || this.altstack, this.pc = "undefined" != typeof e.pc ? e.pc : this.pc, this.pbegincodehash = "undefined" != typeof e.pbegincodehash ? e.pbegincodehash : this.pbegincodehash, this.nOpCount = "undefined" != typeof e.nOpCount ? e.nOpCount : this.nOpCount, this.vfExec = e.vfExec || this.vfExec, this.errstr = e.errstr || this.errstr, this.flags = "undefined" != typeof e.flags ? e.flags : this.flags
            }, u["true"] = new r([1]), u["false"] = new r([]), u.MAX_SCRIPT_ELEMENT_SIZE = 520, u.SCRIPT_VERIFY_NONE = 0, u.SCRIPT_VERIFY_P2SH = 1, u.SCRIPT_VERIFY_STRICTENC = 2, u.SCRIPT_VERIFY_DERSIG = 4, u.SCRIPT_VERIFY_LOW_S = 8, u.SCRIPT_VERIFY_NULLDUMMY = 16, u.SCRIPT_VERIFY_SIGPUSHONLY = 32, u.SCRIPT_VERIFY_MINIMALDATA = 64, u.SCRIPT_VERIFY_DISCOURAGE_UPGRADABLE_NOPS = 128, u.castToBool = function(e) {
                for (var t = 0; t < e.length; t++)
                    if (0 !== e[t]) return t === e.length - 1 && 128 === e[t] ? !1 : !0;
                return !1
            }, u.prototype.checkSignatureEncoding = function(e) {
                var t;
                if (0 !== (this.flags & (u.SCRIPT_VERIFY_DERSIG | u.SCRIPT_VERIFY_LOW_S | u.SCRIPT_VERIFY_STRICTENC)) && !f.isTxDER(e)) return this.errstr = "SCRIPT_ERR_SIG_DER_INVALID_FORMAT", !1;
                if (0 !== (this.flags & u.SCRIPT_VERIFY_LOW_S)) {
                    if (t = f.fromTxFormat(e), !t.hasLowS()) return this.errstr = "SCRIPT_ERR_SIG_DER_HIGH_S", !1
                } else if (0 !== (this.flags & u.SCRIPT_VERIFY_STRICTENC) && (t = f.fromTxFormat(e), !t.hasDefinedHashtype())) return this.errstr = "SCRIPT_ERR_SIG_HASHTYPE", !1;
                return !0
            }, u.prototype.checkPubkeyEncoding = function(e) {
                return 0 === (this.flags & u.SCRIPT_VERIFY_STRICTENC) || c.isValid(e) ? !0 : (this.errstr = "SCRIPT_ERR_PUBKEYTYPE", !1)
            }, u.prototype.evaluate = function() {
                if (this.script.toBuffer().length > 1e4) return this.errstr = "SCRIPT_ERR_SCRIPT_SIZE", !1;
                try {
                    for (; this.pc < this.script.chunks.length;) {
                        var e = this.step();
                        if (!e) return !1
                    }
                    if (this.stack.length + this.altstack.length > 1e3) return this.errstr = "SCRIPT_ERR_STACK_SIZE", !1
                } catch (t) {
                    return this.errstr = "SCRIPT_ERR_UNKNOWN_ERROR: " + t, !1
                }
                return this.vfExec.length > 0 ? (this.errstr = "SCRIPT_ERR_UNBALANCED_CONDITIONAL", !1) : !0
            }, u.prototype.step = function() {
                var e, t, r, d, h, p, l, b, g, y, m, v, _, w, S, k, I, E = 0 !== (this.flags & u.SCRIPT_VERIFY_MINIMALDATA),
                    A = -1 === this.vfExec.indexOf(!1),
                    x = this.script.chunks[this.pc];
                this.pc++;
                var P = x.opcodenum;
                if (n.isUndefined(P)) return this.errstr = "SCRIPT_ERR_UNDEFINED_OPCODE", !1;
                if (x.buf && x.buf.length > u.MAX_SCRIPT_ELEMENT_SIZE) return this.errstr = "SCRIPT_ERR_PUSH_SIZE", !1;
                if (P > s.OP_16 && ++this.nOpCount > 201) return this.errstr = "SCRIPT_ERR_OP_COUNT", !1;
                if (P === s.OP_CAT || P === s.OP_SUBSTR || P === s.OP_LEFT || P === s.OP_RIGHT || P === s.OP_INVERT || P === s.OP_AND || P === s.OP_OR || P === s.OP_XOR || P === s.OP_2MUL || P === s.OP_2DIV || P === s.OP_MUL || P === s.OP_DIV || P === s.OP_MOD || P === s.OP_LSHIFT || P === s.OP_RSHIFT) return this.errstr = "SCRIPT_ERR_DISABLED_OPCODE", !1;
                if (A && P >= 0 && P <= s.OP_PUSHDATA4) {
                    if (E && !this.script.checkMinimalPush(this.pc - 1)) return this.errstr = "SCRIPT_ERR_MINIMALDATA", !1;
                    if (x.buf) {
                        if (x.len !== x.buf.length) throw new Error("Length of push value not equal to length of data");
                        this.stack.push(x.buf)
                    } else this.stack.push(u["false"])
                } else if (A || s.OP_IF <= P && P <= s.OP_ENDIF) switch (P) {
                    case s.OP_1NEGATE:
                    case s.OP_1:
                    case s.OP_2:
                    case s.OP_3:
                    case s.OP_4:
                    case s.OP_5:
                    case s.OP_6:
                    case s.OP_7:
                    case s.OP_8:
                    case s.OP_9:
                    case s.OP_10:
                    case s.OP_11:
                    case s.OP_12:
                    case s.OP_13:
                    case s.OP_14:
                    case s.OP_15:
                    case s.OP_16:
                        h = P - (s.OP_1 - 1), e = o(h).toScriptNumBuffer(), this.stack.push(e);
                        break;
                    case s.OP_NOP:
                        break;
                    case s.OP_NOP1:
                    case s.OP_NOP2:
                    case s.OP_NOP3:
                    case s.OP_NOP4:
                    case s.OP_NOP5:
                    case s.OP_NOP6:
                    case s.OP_NOP7:
                    case s.OP_NOP8:
                    case s.OP_NOP9:
                    case s.OP_NOP10:
                        if (this.flags & u.SCRIPT_VERIFY_DISCOURAGE_UPGRADABLE_NOPS) return this.errstr = "SCRIPT_ERR_DISCOURAGE_UPGRADABLE_NOPS", !1;
                        break;
                    case s.OP_IF:
                    case s.OP_NOTIF:
                        if (k = !1, A) {
                            if (this.stack.length < 1) return this.errstr = "SCRIPT_ERR_UNBALANCED_CONDITIONAL", !1;
                            e = this.stack.pop(), k = u.castToBool(e), P === s.OP_NOTIF && (k = !k)
                        }
                        this.vfExec.push(k);
                        break;
                    case s.OP_ELSE:
                        if (0 === this.vfExec.length) return this.errstr = "SCRIPT_ERR_UNBALANCED_CONDITIONAL", !1;
                        this.vfExec[this.vfExec.length - 1] = !this.vfExec[this.vfExec.length - 1];
                        break;
                    case s.OP_ENDIF:
                        if (0 === this.vfExec.length) return this.errstr = "SCRIPT_ERR_UNBALANCED_CONDITIONAL", !1;
                        this.vfExec.pop();
                        break;
                    case s.OP_VERIFY:
                        if (this.stack.length < 1) return this.errstr = "SCRIPT_ERR_INVALID_STACK_OPERATION", !1;
                        if (e = this.stack[this.stack.length - 1], k = u.castToBool(e), !k) return this.errstr = "SCRIPT_ERR_VERIFY", !1;
                        this.stack.pop();
                        break;
                    case s.OP_RETURN:
                        return this.errstr = "SCRIPT_ERR_OP_RETURN", !1;
                    case s.OP_TOALTSTACK:
                        if (this.stack.length < 1) return this.errstr = "SCRIPT_ERR_INVALID_STACK_OPERATION", !1;
                        this.altstack.push(this.stack.pop());
                        break;
                    case s.OP_FROMALTSTACK:
                        if (this.altstack.length < 1) return this.errstr = "SCRIPT_ERR_INVALID_ALTSTACK_OPERATION", !1;
                        this.stack.push(this.altstack.pop());
                        break;
                    case s.OP_2DROP:
                        if (this.stack.length < 2) return this.errstr = "SCRIPT_ERR_INVALID_STACK_OPERATION", !1;
                        this.stack.pop(), this.stack.pop();
                        break;
                    case s.OP_2DUP:
                        if (this.stack.length < 2) return this.errstr = "SCRIPT_ERR_INVALID_STACK_OPERATION", !1;
                        t = this.stack[this.stack.length - 2], r = this.stack[this.stack.length - 1], this.stack.push(t), this.stack.push(r);
                        break;
                    case s.OP_3DUP:
                        if (this.stack.length < 3) return this.errstr = "SCRIPT_ERR_INVALID_STACK_OPERATION", !1;
                        t = this.stack[this.stack.length - 3], r = this.stack[this.stack.length - 2];
                        var O = this.stack[this.stack.length - 1];
                        this.stack.push(t), this.stack.push(r), this.stack.push(O);
                        break;
                    case s.OP_2OVER:
                        if (this.stack.length < 4) return this.errstr = "SCRIPT_ERR_INVALID_STACK_OPERATION", !1;
                        t = this.stack[this.stack.length - 4], r = this.stack[this.stack.length - 3], this.stack.push(t), this.stack.push(r);
                        break;
                    case s.OP_2ROT:
                        if (this.stack.length < 6) return this.errstr = "SCRIPT_ERR_INVALID_STACK_OPERATION", !1;
                        d = this.stack.splice(this.stack.length - 6, 2), this.stack.push(d[0]), this.stack.push(d[1]);
                        break;
                    case s.OP_2SWAP:
                        if (this.stack.length < 4) return this.errstr = "SCRIPT_ERR_INVALID_STACK_OPERATION", !1;
                        d = this.stack.splice(this.stack.length - 4, 2), this.stack.push(d[0]), this.stack.push(d[1]);
                        break;
                    case s.OP_IFDUP:
                        if (this.stack.length < 1) return this.errstr = "SCRIPT_ERR_INVALID_STACK_OPERATION", !1;
                        e = this.stack[this.stack.length - 1], k = u.castToBool(e), k && this.stack.push(e);
                        break;
                    case s.OP_DEPTH:
                        e = o(this.stack.length).toScriptNumBuffer(), this.stack.push(e);
                        break;
                    case s.OP_DROP:
                        if (this.stack.length < 1) return this.errstr = "SCRIPT_ERR_INVALID_STACK_OPERATION", !1;
                        this.stack.pop();
                        break;
                    case s.OP_DUP:
                        if (this.stack.length < 1) return this.errstr = "SCRIPT_ERR_INVALID_STACK_OPERATION", !1;
                        this.stack.push(this.stack[this.stack.length - 1]);
                        break;
                    case s.OP_NIP:
                        if (this.stack.length < 2) return this.errstr = "SCRIPT_ERR_INVALID_STACK_OPERATION", !1;
                        this.stack.splice(this.stack.length - 2, 1);
                        break;
                    case s.OP_OVER:
                        if (this.stack.length < 2) return this.errstr = "SCRIPT_ERR_INVALID_STACK_OPERATION", !1;
                        this.stack.push(this.stack[this.stack.length - 2]);
                        break;
                    case s.OP_PICK:
                    case s.OP_ROLL:
                        if (this.stack.length < 2) return this.errstr = "SCRIPT_ERR_INVALID_STACK_OPERATION", !1;
                        if (e = this.stack[this.stack.length - 1], b = o.fromScriptNumBuffer(e, E), h = b.toNumber(), this.stack.pop(), 0 > h || h >= this.stack.length) return this.errstr = "SCRIPT_ERR_INVALID_STACK_OPERATION", !1;
                        e = this.stack[this.stack.length - h - 1], P === s.OP_ROLL && this.stack.splice(this.stack.length - h - 1, 1), this.stack.push(e);
                        break;
                    case s.OP_ROT:
                        if (this.stack.length < 3) return this.errstr = "SCRIPT_ERR_INVALID_STACK_OPERATION", !1;
                        p = this.stack[this.stack.length - 3], l = this.stack[this.stack.length - 2];
                        var B = this.stack[this.stack.length - 1];
                        this.stack[this.stack.length - 3] = l, this.stack[this.stack.length - 2] = B, this.stack[this.stack.length - 1] = p;
                        break;
                    case s.OP_SWAP:
                        if (this.stack.length < 2) return this.errstr = "SCRIPT_ERR_INVALID_STACK_OPERATION", !1;
                        p = this.stack[this.stack.length - 2], l = this.stack[this.stack.length - 1], this.stack[this.stack.length - 2] = l, this.stack[this.stack.length - 1] = p;
                        break;
                    case s.OP_TUCK:
                        if (this.stack.length < 2) return this.errstr = "SCRIPT_ERR_INVALID_STACK_OPERATION", !1;
                        this.stack.splice(this.stack.length - 2, 0, this.stack[this.stack.length - 1]);
                        break;
                    case s.OP_SIZE:
                        if (this.stack.length < 1) return this.errstr = "SCRIPT_ERR_INVALID_STACK_OPERATION", !1;
                        b = o(this.stack[this.stack.length - 1].length), this.stack.push(b.toScriptNumBuffer());
                        break;
                    case s.OP_EQUAL:
                    case s.OP_EQUALVERIFY:
                        if (this.stack.length < 2) return this.errstr = "SCRIPT_ERR_INVALID_STACK_OPERATION", !1;
                        t = this.stack[this.stack.length - 2], r = this.stack[this.stack.length - 1];
                        var R = t.toString("hex") === r.toString("hex");
                        if (this.stack.pop(), this.stack.pop(), this.stack.push(R ? u["true"] : u["false"]), P === s.OP_EQUALVERIFY) {
                            if (!R) return this.errstr = "SCRIPT_ERR_EQUALVERIFY", !1;
                            this.stack.pop()
                        }
                        break;
                    case s.OP_1ADD:
                    case s.OP_1SUB:
                    case s.OP_NEGATE:
                    case s.OP_ABS:
                    case s.OP_NOT:
                    case s.OP_0NOTEQUAL:
                        if (this.stack.length < 1) return this.errstr = "SCRIPT_ERR_INVALID_STACK_OPERATION", !1;
                        switch (e = this.stack[this.stack.length - 1], b = o.fromScriptNumBuffer(e, E), P) {
                            case s.OP_1ADD:
                                b = b.add(1);
                                break;
                            case s.OP_1SUB:
                                b = b.sub(1);
                                break;
                            case s.OP_NEGATE:
                                b = b.neg();
                                break;
                            case s.OP_ABS:
                                b.cmp(0) < 0 && (b = b.neg());
                                break;
                            case s.OP_NOT:
                                b = o((0 === b.cmp(0)) + 0);
                                break;
                            case s.OP_0NOTEQUAL:
                                b = o((0 !== b.cmp(0)) + 0)
                        }
                        this.stack.pop(), this.stack.push(b.toScriptNumBuffer());
                        break;
                    case s.OP_ADD:
                    case s.OP_SUB:
                    case s.OP_BOOLAND:
                    case s.OP_BOOLOR:
                    case s.OP_NUMEQUAL:
                    case s.OP_NUMEQUALVERIFY:
                    case s.OP_NUMNOTEQUAL:
                    case s.OP_LESSTHAN:
                    case s.OP_GREATERTHAN:
                    case s.OP_LESSTHANOREQUAL:
                    case s.OP_GREATERTHANOREQUAL:
                    case s.OP_MIN:
                    case s.OP_MAX:
                        if (this.stack.length < 2) return this.errstr = "SCRIPT_ERR_INVALID_STACK_OPERATION", !1;
                        switch (g = o.fromScriptNumBuffer(this.stack[this.stack.length - 2], E), y = o.fromScriptNumBuffer(this.stack[this.stack.length - 1], E), b = o(0), P) {
                            case s.OP_ADD:
                                b = g.add(y);
                                break;
                            case s.OP_SUB:
                                b = g.sub(y);
                                break;
                            case s.OP_BOOLAND:
                                b = o((0 !== g.cmp(0) && 0 !== y.cmp(0)) + 0);
                                break;
                            case s.OP_BOOLOR:
                                b = o((0 !== g.cmp(0) || 0 !== y.cmp(0)) + 0);
                                break;
                            case s.OP_NUMEQUAL:
                                b = o((0 === g.cmp(y)) + 0);
                                break;
                            case s.OP_NUMEQUALVERIFY:
                                b = o((0 === g.cmp(y)) + 0);
                                break;
                            case s.OP_NUMNOTEQUAL:
                                b = o((0 !== g.cmp(y)) + 0);
                                break;
                            case s.OP_LESSTHAN:
                                b = o((g.cmp(y) < 0) + 0);
                                break;
                            case s.OP_GREATERTHAN:
                                b = o((g.cmp(y) > 0) + 0);
                                break;
                            case s.OP_LESSTHANOREQUAL:
                                b = o((g.cmp(y) <= 0) + 0);
                                break;
                            case s.OP_GREATERTHANOREQUAL:
                                b = o((g.cmp(y) >= 0) + 0);
                                break;
                            case s.OP_MIN:
                                b = g.cmp(y) < 0 ? g : y;
                                break;
                            case s.OP_MAX:
                                b = g.cmp(y) > 0 ? g : y
                        }
                        if (this.stack.pop(), this.stack.pop(), this.stack.push(b.toScriptNumBuffer()), P === s.OP_NUMEQUALVERIFY) {
                            if (!u.castToBool(this.stack[this.stack.length - 1])) return this.errstr = "SCRIPT_ERR_NUMEQUALVERIFY", !1;
                            this.stack.pop()
                        }
                        break;
                    case s.OP_WITHIN:
                        if (this.stack.length < 3) return this.errstr = "SCRIPT_ERR_INVALID_STACK_OPERATION", !1;
                        g = o.fromScriptNumBuffer(this.stack[this.stack.length - 3], E), y = o.fromScriptNumBuffer(this.stack[this.stack.length - 2], E);
                        var T = o.fromScriptNumBuffer(this.stack[this.stack.length - 1], E);
                        k = y.cmp(g) <= 0 && g.cmp(T) < 0, this.stack.pop(), this.stack.pop(), this.stack.pop(), this.stack.push(k ? u["true"] : u["false"]);
                        break;
                    case s.OP_RIPEMD160:
                    case s.OP_SHA1:
                    case s.OP_SHA256:
                    case s.OP_HASH160:
                    case s.OP_HASH256:
                        if (this.stack.length < 1) return this.errstr = "SCRIPT_ERR_INVALID_STACK_OPERATION", !1;
                        e = this.stack[this.stack.length - 1];
                        var N;
                        P === s.OP_RIPEMD160 ? N = a.ripemd160(e) : P === s.OP_SHA1 ? N = a.sha1(e) : P === s.OP_SHA256 ? N = a.sha256(e) : P === s.OP_HASH160 ? N = a.sha256ripemd160(e) : P === s.OP_HASH256 && (N = a.sha256sha256(e)), this.stack.pop(), this.stack.push(N);
                        break;
                    case s.OP_CODESEPARATOR:
                        this.pbegincodehash = this.pc;
                        break;
                    case s.OP_CHECKSIG:
                    case s.OP_CHECKSIGVERIFY:
                        if (this.stack.length < 2) return this.errstr = "SCRIPT_ERR_INVALID_STACK_OPERATION", !1;
                        m = this.stack[this.stack.length - 2], v = this.stack[this.stack.length - 1], _ = (new i).set({
                            chunks: this.script.chunks.slice(this.pbegincodehash)
                        });
                        var j = (new i).add(m);
                        if (_.findAndDelete(j), !this.checkSignatureEncoding(m) || !this.checkPubkeyEncoding(v)) return !1;
                        try {
                            w = f.fromTxFormat(m), S = c.fromBuffer(v, !1), I = this.tx.verifySignature(w, S, this.nin, _)
                        } catch (C) {
                            I = !1
                        }
                        if (this.stack.pop(), this.stack.pop(), this.stack.push(I ? u["true"] : u["false"]), P === s.OP_CHECKSIGVERIFY) {
                            if (!I) return this.errstr = "SCRIPT_ERR_CHECKSIGVERIFY", !1;
                            this.stack.pop()
                        }
                        break;
                    case s.OP_CHECKMULTISIG:
                    case s.OP_CHECKMULTISIGVERIFY:
                        var M = 1;
                        if (this.stack.length < M) return this.errstr = "SCRIPT_ERR_INVALID_STACK_OPERATION", !1;
                        var U = o.fromScriptNumBuffer(this.stack[this.stack.length - M], E).toNumber();
                        if (0 > U || U > 20) return this.errstr = "SCRIPT_ERR_PUBKEY_COUNT", !1;
                        if (this.nOpCount += U, this.nOpCount > 201) return this.errstr = "SCRIPT_ERR_OP_COUNT", !1;
                        var z = ++M;
                        if (M += U, this.stack.length < M) return this.errstr = "SCRIPT_ERR_INVALID_STACK_OPERATION", !1;
                        var D = o.fromScriptNumBuffer(this.stack[this.stack.length - M], E).toNumber();
                        if (0 > D || D > U) return this.errstr = "SCRIPT_ERR_SIG_COUNT", !1;
                        var L = ++M;
                        if (M += D, this.stack.length < M) return this.errstr = "SCRIPT_ERR_INVALID_STACK_OPERATION", !1;
                        _ = (new i).set({
                            chunks: this.script.chunks.slice(this.pbegincodehash)
                        });
                        for (var F = 0; D > F; F++) m = this.stack[this.stack.length - L - F], _.findAndDelete((new i).add(m));
                        for (I = !0; I && D > 0;) {
                            if (m = this.stack[this.stack.length - L], v = this.stack[this.stack.length - z], !this.checkSignatureEncoding(m) || !this.checkPubkeyEncoding(v)) return !1;
                            var H;
                            try {
                                w = f.fromTxFormat(m), S = c.fromBuffer(v, !1), H = this.tx.verifySignature(w, S, this.nin, _)
                            } catch (C) {
                                H = !1
                            }
                            H && (L++, D--), z++, U--, D > U && (I = !1)
                        }
                        for (; M-- > 1;) this.stack.pop();
                        if (this.stack.length < 1) return this.errstr = "SCRIPT_ERR_INVALID_STACK_OPERATION", !1;
                        if (this.flags & u.SCRIPT_VERIFY_NULLDUMMY && this.stack[this.stack.length - 1].length) return this.errstr = "SCRIPT_ERR_SIG_NULLDUMMY", !1;
                        if (this.stack.pop(), this.stack.push(I ? u["true"] : u["false"]), P === s.OP_CHECKMULTISIGVERIFY) {
                            if (!I) return this.errstr = "SCRIPT_ERR_CHECKMULTISIGVERIFY", !1;
                            this.stack.pop()
                        }
                        break;
                    default:
                        return this.errstr = "SCRIPT_ERR_BAD_OPCODE", !1
                }
                return !0
            }
        }).call(this, e("buffer").Buffer)
    }, {
        "../crypto/bn": 4,
        "../crypto/hash": 6,
        "../crypto/signature": 9,
        "../opcode": 21,
        "../publickey": 23,
        "../transaction": 27,
        "./script": 26,
        buffer: 43,
        lodash: 233
    }],
    26: [function(e, t) {
        (function(r) {
            "use strict";
            var n = e("../address"),
                i = e("../encoding/bufferreader"),
                s = e("../encoding/bufferwriter"),
                o = e("../crypto/hash"),
                a = e("../opcode"),
                f = e("../publickey"),
                c = e("../crypto/signature"),
                u = e("../networks"),
                d = e("../util/preconditions"),
                h = e("lodash"),
                p = e("../errors"),
                l = e("buffer"),
                b = e("../util/buffer"),
                g = e("../util/js"),
                y = function m(e) {
                    return this instanceof m ? (this.chunks = [], b.isBuffer(e) ? m.fromBuffer(e) : e instanceof n ? m.fromAddress(e) : e instanceof m ? m.fromBuffer(e.toBuffer()) : "string" == typeof e ? m.fromString(e) : void("undefined" != typeof e && this.set(e))) : new m(e)
                };
            y.prototype.set = function(e) {
                return this.chunks = e.chunks || this.chunks, this
            }, y.fromBuffer = function(e) {
                var t = new y;
                t.chunks = [];
                for (var r = new i(e); !r.eof();) {
                    var n, s, o = r.readUInt8();
                    o > 0 && o < a.OP_PUSHDATA1 ? (n = o, t.chunks.push({
                        buf: r.read(n),
                        len: n,
                        opcodenum: o
                    })) : o === a.OP_PUSHDATA1 ? (n = r.readUInt8(), s = r.read(n), t.chunks.push({
                        buf: s,
                        len: n,
                        opcodenum: o
                    })) : o === a.OP_PUSHDATA2 ? (n = r.readUInt16LE(), s = r.read(n), t.chunks.push({
                        buf: s,
                        len: n,
                        opcodenum: o
                    })) : o === a.OP_PUSHDATA4 ? (n = r.readUInt32LE(), s = r.read(n), t.chunks.push({
                        buf: s,
                        len: n,
                        opcodenum: o
                    })) : t.chunks.push({
                        opcodenum: o
                    })
                }
                return t
            }, y.prototype.toBuffer = function() {
                for (var e = new s, t = 0; t < this.chunks.length; t++) {
                    var r = this.chunks[t],
                        n = r.opcodenum;
                    e.writeUInt8(r.opcodenum), r.buf && (n < a.OP_PUSHDATA1 ? e.write(r.buf) : n === a.OP_PUSHDATA1 ? (e.writeUInt8(r.len), e.write(r.buf)) : n === a.OP_PUSHDATA2 ? (e.writeUInt16LE(r.len), e.write(r.buf)) : n === a.OP_PUSHDATA4 && (e.writeUInt32LE(r.len), e.write(r.buf)))
                }
                return e.concat()
            }, y.fromString = function(e) {
                if (g.isHexa(e) || 0 === e.length) return new y(new l.Buffer(e, "hex"));
                var t = new y;
                t.chunks = [];
                for (var n = e.split(" "), i = 0; i < n.length;) {
                    var s = n[i],
                        o = a(s),
                        f = o.toNumber();
                    if (h.isUndefined(f)) {
                        if (f = parseInt(s), !(f > 0 && f < a.OP_PUSHDATA1)) throw new Error("Invalid script: " + JSON.stringify(e));
                        t.chunks.push({
                            buf: new r(n[i + 1].slice(2), "hex"),
                            len: f,
                            opcodenum: f
                        }), i += 2
                    } else if (f === a.OP_PUSHDATA1 || f === a.OP_PUSHDATA2 || f === a.OP_PUSHDATA4) {
                        if ("0x" !== n[i + 2].slice(0, 2)) throw new Error("Pushdata data must start with 0x");
                        t.chunks.push({
                            buf: new r(n[i + 2].slice(2), "hex"),
                            len: parseInt(n[i + 1]),
                            opcodenum: f
                        }), i += 3
                    } else t.chunks.push({
                        opcodenum: f
                    }), i += 1
                }
                return t
            }, y.prototype.toString = function() {
                for (var e = "", t = 0; t < this.chunks.length; t++) {
                    var r = this.chunks[t],
                        n = r.opcodenum;
                    if (r.buf)(n === a.OP_PUSHDATA1 || n === a.OP_PUSHDATA2 || n === a.OP_PUSHDATA4) && (e = e + " " + a(n).toString()), e = e + " " + r.len, r.len > 0 && (e = e + " 0x" + r.buf.toString("hex"));
                    else if ("undefined" != typeof a.reverseMap[n]) e = e + " " + a(n).toString();
                    else {
                        var i = n.toString(16);
                        i.length % 2 !== 0 && (i = "0" + i), e = e + " 0x" + i
                    }
                }
                return e.substr(1)
            }, y.prototype.inspect = function() {
                return "<Script: " + this.toString() + ">"
            }, y.prototype.isPublicKeyHashOut = function() {
                return !(5 !== this.chunks.length || this.chunks[0].opcodenum !== a.OP_DUP || this.chunks[1].opcodenum !== a.OP_HASH160 || !this.chunks[2].buf || this.chunks[3].opcodenum !== a.OP_EQUALVERIFY || this.chunks[4].opcodenum !== a.OP_CHECKSIG)
            }, y.prototype.isPublicKeyHashIn = function() {
                return 2 === this.chunks.length && this.chunks[0].buf && this.chunks[0].buf.length >= 71 && this.chunks[0].buf.length <= 73 && f.isValid(this.chunks[1].buf)
            }, y.prototype.getPublicKeyHash = function() {
                return d.checkState(this.isPublicKeyHashOut(), "Can't retrieve PublicKeyHash from a non-PKH output"), this.chunks[2].buf
            }, y.prototype.isPublicKeyOut = function() {
                return 2 === this.chunks.length && b.isBuffer(this.chunks[0].buf) && f.isValid(this.chunks[0].buf) && this.chunks[1].opcodenum === a.OP_CHECKSIG
            }, y.prototype.isPublicKeyIn = function() {
                return 1 === this.chunks.length && b.isBuffer(this.chunks[0].buf) && 71 === this.chunks[0].buf.length
            }, y.prototype.isScriptHashOut = function() {
                var e = this.toBuffer();
                return 23 === e.length && e[0] === a.OP_HASH160 && 20 === e[1] && e[e.length - 1] === a.OP_EQUAL
            }, y.prototype.isScriptHashIn = function() {
                if (0 === this.chunks.length) return !1;
                var e = this.chunks[this.chunks.length - 1];
                if (!e) return !1;
                var t = e.buf;
                if (!t) return !1;
                var r = new y(t),
                    n = r.classify();
                return n !== y.types.UNKNOWN
            }, y.prototype.isMultisigOut = function() {
                return this.chunks.length > 3 && a.isSmallIntOp(this.chunks[0].opcodenum) && this.chunks.slice(1, this.chunks.length - 2).every(function(e) {
                    return e.buf && b.isBuffer(e.buf)
                }) && a.isSmallIntOp(this.chunks[this.chunks.length - 2].opcodenum) && this.chunks[this.chunks.length - 1].opcodenum === a.OP_CHECKMULTISIG
            }, y.prototype.isMultisigIn = function() {
                return this.chunks.length >= 2 && 0 === this.chunks[0].opcodenum && this.chunks.slice(1, this.chunks.length).every(function(e) {
                    return e.buf && b.isBuffer(e.buf) && 71 === e.buf.length
                })
            }, y.prototype.isDataOut = function() {
                return this.chunks.length >= 1 && this.chunks[0].opcodenum === a.OP_RETURN && (1 === this.chunks.length || 2 === this.chunks.length && this.chunks[1].buf && this.chunks[1].buf.length <= 40 && this.chunks[1].length === this.chunks.len)
            }, y.prototype.getData = function() {
                if (this.isDataOut() || this.isScriptHashOut()) return new r(this.chunks[1].buf);
                if (this.isPublicKeyHashOut()) return new r(this.chunks[2].buf);
                throw new Error("Unrecognized script type to get data from")
            }, y.prototype.isPushOnly = function() {
                return h.every(this.chunks, function(e) {
                    return e.opcodenum <= a.OP_16
                })
            }, y.types = {}, y.types.UNKNOWN = "Unknown", y.types.PUBKEY_OUT = "Pay to public key", y.types.PUBKEY_IN = "Spend from public key", y.types.PUBKEYHASH_OUT = "Pay to public key hash", y.types.PUBKEYHASH_IN = "Spend from public key hash", y.types.SCRIPTHASH_OUT = "Pay to script hash", y.types.SCRIPTHASH_IN = "Spend from script hash", y.types.MULTISIG_OUT = "Pay to multisig", y.types.MULTISIG_IN = "Spend from multisig", y.types.DATA_OUT = "Data push", y.identifiers = {}, y.identifiers.PUBKEY_OUT = y.prototype.isPublicKeyOut, y.identifiers.PUBKEY_IN = y.prototype.isPublicKeyIn, y.identifiers.PUBKEYHASH_OUT = y.prototype.isPublicKeyHashOut, y.identifiers.PUBKEYHASH_IN = y.prototype.isPublicKeyHashIn, y.identifiers.MULTISIG_OUT = y.prototype.isMultisigOut, y.identifiers.MULTISIG_IN = y.prototype.isMultisigIn, y.identifiers.SCRIPTHASH_OUT = y.prototype.isScriptHashOut, y.identifiers.SCRIPTHASH_IN = y.prototype.isScriptHashIn, y.identifiers.DATA_OUT = y.prototype.isDataOut, y.prototype.classify = function() {
                for (var e in y.identifiers)
                    if (y.identifiers[e].bind(this)()) return y.types[e];
                return y.types.UNKNOWN
            }, y.prototype.isStandard = function() {
                return this.classify() !== y.types.UNKNOWN
            }, y.prototype.prepend = function(e) {
                return this._addByType(e, !0), this
            }, y.prototype.equals = function(e) {
                if (d.checkState(e instanceof y, "Must provide another script"), this.chunks.length !== e.chunks.length) return !1;
                var t;
                for (t = 0; t < this.chunks.length; t++) {
                    if (b.isBuffer(this.chunks[t]) && !b.isBuffer(e.chunks[t])) return !1;
                    if (this.chunks[t] instanceof a && !(e.chunks[t] instanceof a)) return !1;
                    if (b.isBuffer(this.chunks[t]) && !b.equals(this.chunks[t], e.chunks[t])) return !1;
                    if (this.chunks[t].num !== e.chunks[t].num) return !1
                }
                return !0
            }, y.prototype.add = function(e) {
                return this._addByType(e, !1), this
            }, y.prototype._addByType = function(e, t) {
                if ("string" == typeof e) this._addOpcode(e, t);
                else if ("number" == typeof e) this._addOpcode(e, t);
                else if (e instanceof a) this._addOpcode(e, t);
                else if (b.isBuffer(e)) this._addBuffer(e, t);
                else if ("object" == typeof e) this._insertAtPosition(e, t);
                else {
                    if (!(e instanceof y)) throw new Error("Invalid script chunk");
                    this.chunks = this.chunks.concat(e.chunks)
                }
            }, y.prototype._insertAtPosition = function(e, t) {
                t ? this.chunks.unshift(e) : this.chunks.push(e)
            }, y.prototype._addOpcode = function(e, t) {
                var r;
                return r = "number" == typeof e ? e : e instanceof a ? e.toNumber() : a(e).toNumber(), this._insertAtPosition({
                    opcodenum: r
                }, t), this
            }, y.prototype._addBuffer = function(e, t) {
                var r, n = e.length;
                if (n >= 0 && n < a.OP_PUSHDATA1) r = n;
                else if (n < Math.pow(2, 8)) r = a.OP_PUSHDATA1;
                else if (n < Math.pow(2, 16)) r = a.OP_PUSHDATA2;
                else {
                    if (!(n < Math.pow(2, 32))) throw new Error("You can't push that much data");
                    r = a.OP_PUSHDATA4
                }
                return this._insertAtPosition({
                    buf: e,
                    len: n,
                    opcodenum: r
                }, t), this
            }, y.prototype.removeCodeseparators = function() {
                for (var e = [], t = 0; t < this.chunks.length; t++) this.chunks[t].opcodenum !== a.OP_CODESEPARATOR && e.push(this.chunks[t]);
                return this.chunks = e, this
            }, y.buildMultisigOut = function(e, t, r) {
                r = r || {};
                var n = new y;
                n.add(a.smallInt(t)), e = h.map(e, f);
                var i = e;
                r.noSorting || (i = h.sortBy(e, function(e) {
                    return e.toString("hex")
                }));
                for (var s = 0; s < i.length; s++) {
                    var o = i[s];
                    n.add(o.toBuffer())
                }
                return n.add(a.smallInt(e.length)), n.add(a.OP_CHECKMULTISIG), n
            }, y.buildP2SHMultisigIn = function(e, t, r, n) {
                d.checkArgument(h.isArray(e)), d.checkArgument(h.isNumber(t)), d.checkArgument(h.isArray(r)), n = n || {};
                var i = new y;
                return i.add(a.OP_0), h.each(r, function(e) {
                    i.add(e)
                }), i.add((n.cachedMultisig || y.buildMultisigOut(e, t, n)).toBuffer()), i
            }, y.buildPublicKeyHashOut = function(e) {
                d.checkArgument(!h.isUndefined(e)), d.checkArgument(e instanceof f || e instanceof n || h.isString(e)), e instanceof f ? e = e.toAddress() : h.isString(e) && (e = new n(e));
                var t = new y;
                return t.add(a.OP_DUP).add(a.OP_HASH160).add(e.hashBuffer).add(a.OP_EQUALVERIFY).add(a.OP_CHECKSIG), t._network = e.network, t
            }, y.buildPublicKeyOut = function(e) {
                d.checkArgument(e instanceof f);
                var t = new y;
                return t.add(e.toBuffer()).add(a.OP_CHECKSIG), t
            }, y.buildDataOut = function(e) {
                d.checkArgument(h.isUndefined(e) || h.isString(e) || b.isBuffer(e)), "string" == typeof e && (e = new r(e));
                var t = new y;
                return t.add(a.OP_RETURN), h.isUndefined(e) || t.add(e), t
            }, y.buildScriptHashOut = function(e) {
                d.checkArgument(e instanceof y || e instanceof n && e.isPayToScriptHash());
                var t = new y;
                return t.add(a.OP_HASH160).add(e instanceof n ? e.hashBuffer : o.sha256ripemd160(e.toBuffer())).add(a.OP_EQUAL), t._network = e._network || e.network, t
            }, y.buildPublicKeyHashIn = function(e, t, r) {
                d.checkArgument(t instanceof c || b.isBuffer(t)), d.checkArgument(h.isUndefined(r) || h.isNumber(r)), t instanceof c && (t = t.toBuffer());
                var n = (new y).add(b.concat([t, b.integerAsSingleByteBuffer(r || c.SIGHASH_ALL)])).add(new f(e).toBuffer());
                return n
            }, y.empty = function() {
                return new y
            }, y.prototype.toScriptHashOut = function() {
                return y.buildScriptHashOut(this)
            }, y.fromAddress = function(e) {
                if (e = n(e), e.isPayToScriptHash()) return y.buildScriptHashOut(e);
                if (e.isPayToPublicKeyHash()) return y.buildPublicKeyHashOut(e);
                throw new p.Script.UnrecognizedAddress(e)
            }, y.prototype.toAddress = function(e) {
                if (e = u.get(e) || this._network || u.defaultNetwork, this.isPublicKeyHashOut() || this.isScriptHashOut()) return new n(this, e);
                throw new Error("The script type needs to be PayToPublicKeyHash or PayToScriptHash")
            }, y.prototype.toScriptHashOut = function() {
                return y.buildScriptHashOut(this)
            }, y.prototype.findAndDelete = function(e) {
                for (var t = e.toBuffer(), r = t.toString("hex"), n = 0; n < this.chunks.length; n++) {
                    var i = y({
                            chunks: [this.chunks[n]]
                        }),
                        s = i.toBuffer(),
                        o = s.toString("hex");
                    r === o && this.chunks.splice(n, 1)
                }
                return this
            }, y.prototype.checkMinimalPush = function(e) {
                var t = this.chunks[e],
                    r = t.buf,
                    n = t.opcodenum;
                return r ? 0 === r.length ? n === a.OP_0 : 1 === r.length && r[0] >= 1 && r[0] <= 16 ? n === a.OP_1 + (r[0] - 1) : 1 === r.length && 129 === r[0] ? n === a.OP_1NEGATE : r.length <= 75 ? n === r.length : r.length <= 255 ? n === a.OP_PUSHDATA1 : r.length <= 65535 ? n === a.OP_PUSHDATA2 : !0 : !0
            }, t.exports = y
        }).call(this, e("buffer").Buffer)
    }, {
        "../address": 1,
        "../crypto/hash": 6,
        "../crypto/signature": 9,
        "../encoding/bufferreader": 12,
        "../encoding/bufferwriter": 13,
        "../errors": 15,
        "../networks": 20,
        "../opcode": 21,
        "../publickey": 23,
        "../util/buffer": 38,
        "../util/js": 39,
        "../util/preconditions": 40,
        buffer: 43,
        lodash: 233
    }],
    27: [function(e, t) {
        t.exports = e("./transaction"), t.exports.Input = e("./input"), t.exports.Output = e("./output"), t.exports.UnspentOutput = e("./unspentoutput")
    }, {
        "./input": 28,
        "./output": 32,
        "./transaction": 34,
        "./unspentoutput": 35
    }],
    28: [function(e, t) {
        t.exports = e("./input"), t.exports.PublicKeyHash = e("./publickeyhash"), t.exports.MultiSigScriptHash = e("./multisigscripthash.js")
    }, {
        "./input": 29,
        "./multisigscripthash.js": 30,
        "./publickeyhash": 31
    }],
    29: [function(e, t) {
        "use strict";

        function r(e) {
            return this instanceof r ? e ? this._fromObject(e) : void 0 : new r(e)
        }
        var n = e("lodash"),
            i = e("../../errors"),
            s = e("../../encoding/bufferwriter"),
            o = e("buffer"),
            a = e("../../util/buffer"),
            f = e("../../util/js"),
            c = e("../../script"),
            u = e("../sighash"),
            d = e("../output");
        Object.defineProperty(r.prototype, "script", {
            configurable: !1,
            writeable: !1,
            enumerable: !0,
            get: function() {
                return this._script || (this._script = new c(this._scriptBuffer)), this._script
            }
        }), r.prototype._fromObject = function(e) {
            if (n.isString(e.prevTxId) && f.isHexa(e.prevTxId) && (e.prevTxId = new o.Buffer(e.prevTxId, "hex")), this.output = e.output ? e.output instanceof d ? e.output : new d(e.output) : void 0, this.prevTxId = e.prevTxId, this.outputIndex = e.outputIndex, this.sequenceNumber = e.sequenceNumber, n.isUndefined(e.script) && n.isUndefined(e.scriptBuffer)) throw new i.Transaction.Input.MissingScript;
            return this.setScript(n.isUndefined(e.script) ? e.scriptBuffer : e.script), this
        }, r.prototype.toObject = function() {
            return {
                prevTxId: this.prevTxId.toString("hex"),
                outputIndex: this.outputIndex,
                sequenceNumber: this.sequenceNumber,
                script: this.script.toString(),
                output: this.output ? this.output.toObject() : void 0
            }
        }, r.prototype.toJSON = function() {
            return JSON.stringify(this.toObject())
        }, r.fromJSON = function(e) {
            return f.isValidJSON(e) && (e = JSON.parse(e)), new r({
                output: e.output ? new d(e.output) : void 0,
                prevTxId: e.prevTxId || e.txidbuf,
                outputIndex: n.isUndefined(e.outputIndex) ? e.txoutnum : e.outputIndex,
                sequenceNumber: e.sequenceNumber || e.seqnum,
                scriptBuffer: new c(e.script, "hex")
            })
        }, r.fromBufferReader = function(e) {
            var t = new r;
            t.prevTxId = e.readReverse(32), t.outputIndex = e.readUInt32LE();
            var n = e.readVarintNum();
            return t._scriptBuffer = n ? e.read(n) : new o.Buffer([]), t.sequenceNumber = e.readUInt32LE(), t
        }, r.prototype.toBufferWriter = function(e) {
            e || (e = new s), e.writeReverse(this.prevTxId), e.writeUInt32LE(this.outputIndex);
            var t = this._scriptBuffer;
            return e.writeVarintNum(t.length), e.write(t), e.writeUInt32LE(this.sequenceNumber), e
        }, r.prototype.setScript = function(e) {
            if (e instanceof c) this._script = e, this._scriptBuffer = e.toBuffer();
            else if (n.isString(e)) this._script = new c(e), this._scriptBuffer = this._script.toBuffer();
            else {
                if (!a.isBuffer(e)) throw new TypeError("Invalid Argument");
                this._script = null, this._scriptBuffer = new o.Buffer(e)
            }
            return this
        }, r.prototype.getSignatures = function() {
            throw new i.AbstractMethodInvoked("Input#getSignatures")
        }, r.prototype.isFullySigned = function() {
            throw new i.AbstractMethodInvoked("Input#isFullySigned")
        }, r.prototype.addSignature = function() {
            throw new i.AbstractMethodInvoked("Input#addSignature")
        }, r.prototype.clearSignatures = function() {
            throw new i.AbstractMethodInvoked("Input#clearSignatures")
        }, r.prototype.isValidSignature = function(e, t) {
            return t.signature.nhashtype = t.sigtype, u.verify(e, t.signature, t.publicKey, t.inputIndex, this.output.script)
        }, r.prototype.isNull = function() {
            return "0000000000000000000000000000000000000000000000000000000000000000" === this.prevTxId.toString("hex") && 4294967295 === this.outputIndex
        }, r.prototype._estimateSize = function() {
            var e = new s;
            return this.toBufferWriter(e), e.toBuffer().length
        }, t.exports = r
    }, {
        "../../encoding/bufferwriter": 13,
        "../../errors": 15,
        "../../script": 24,
        "../../util/buffer": 38,
        "../../util/js": 39,
        "../output": 32,
        "../sighash": 33,
        buffer: 43,
        lodash: 233
    }],
    30: [function(e, t) {
        "use strict";

        function r(e, t, r, i) {
            s.apply(this, arguments);
            var o = this;
            this.publicKeys = n.sortBy(t, function(e) {
                return e.toString("hex")
            }), this.redeemScript = f.buildMultisigOut(this.publicKeys, r), a.checkState(f.buildScriptHashOut(this.redeemScript).equals(this.output.script), "Provided public keys don't hash to the provided output"), this.publicKeyIndex = {}, n.each(this.publicKeys, function(e, t) {
                o.publicKeyIndex[e.toString()] = t
            }), this.threshold = r, this.signatures = i ? this._deserializeSignatures(i) : new Array(this.publicKeys.length)
        }
        var n = e("lodash"),
            i = e("inherits"),
            s = e("./input"),
            o = e("../output"),
            a = e("../../util/preconditions"),
            f = e("../../script"),
            c = e("../../crypto/signature"),
            u = e("../sighash"),
            d = e("../../publickey"),
            h = e("../../util/buffer");
        i(r, s), r.prototype.toObject = function() {
            var e = s.prototype.toObject.apply(this, arguments);
            return e.threshold = this.threshold, e.publicKeys = n.map(this.publicKeys, function(e) {
                return e.toString()
            }), e.signatures = this._serializeSignatures(), e
        }, r.prototype._deserializeSignatures = function(e) {
            return n.map(e, function(e) {
                return e ? {
                    publicKey: new d(e.publicKey),
                    prevTxId: e.txId,
                    outputIndex: e.outputIndex,
                    inputIndex: e.inputIndex,
                    signature: c.fromString(e.signature),
                    sigtype: e.sigtype
                } : void 0
            })
        }, r.prototype._serializeSignatures = function() {
            return n.map(this.signatures, function(e) {
                return e ? {
                    publicKey: e.publicKey.toString(),
                    prevTxId: e.txId,
                    outputIndex: e.outputIndex,
                    inputIndex: e.inputIndex,
                    signature: e.signature.toString(),
                    sigtype: e.sigtype
                } : void 0
            })
        }, r.prototype.getSignatures = function(e, t, r, i) {
            a.checkState(this.output instanceof o), i = i || c.SIGHASH_ALL;
            var s = this,
                f = [];
            return n.each(this.publicKeys, function(n) {
                n.toString() === t.publicKey.toString() && f.push({
                    publicKey: t.publicKey,
                    prevTxId: s.txId,
                    outputIndex: s.outputIndex,
                    inputIndex: r,
                    signature: u.sign(e, t, i, r, s.redeemScript),
                    sigtype: i
                })
            }), f
        }, r.prototype.addSignature = function(e, t) {
            return a.checkState(!this.isFullySigned(), "All needed signatures have already been added"), a.checkArgument(!n.isUndefined(this.publicKeyIndex[t.publicKey.toString()]), "Signature has no matching public key"), a.checkState(this.isValidSignature(e, t)), this.signatures[this.publicKeyIndex[t.publicKey.toString()]] = t, this._updateScript(), this
        }, r.prototype._updateScript = function() {
            return this.setScript(f.buildP2SHMultisigIn(this.publicKeys, this.threshold, this._createSignatures(), {
                cachedMultisig: this.redeemScript
            })), this
        }, r.prototype._createSignatures = function() {
            return n.map(n.filter(this.signatures, function(e) {
                return !n.isUndefined(e)
            }), function(e) {
                return h.concat([e.signature.toDER(), h.integerAsSingleByteBuffer(e.sigtype)])
            })
        }, r.prototype.clearSignatures = function() {
            this.signatures = new Array(this.publicKeys.length), this._updateScript()
        }, r.prototype.isFullySigned = function() {
            return this.countSignatures() === this.threshold
        }, r.prototype.countMissingSignatures = function() {
            return this.threshold - this.countSignatures()
        }, r.prototype.countSignatures = function() {
            return n.reduce(this.signatures, function(e, t) {
                return e + !!t
            }, 0)
        }, r.prototype.publicKeysWithoutSignature = function() {
            var e = this;
            return n.filter(this.publicKeys, function(t) {
                return !e.signatures[e.publicKeyIndex[t.toString()]]
            })
        }, r.prototype.isValidSignature = function(e, t) {
            return t.signature.nhashtype = t.sigtype, u.verify(e, t.signature, t.publicKey, t.inputIndex, this.redeemScript)
        }, r.OPCODES_SIZE = 7, r.SIGNATURE_SIZE = 74, r.PUBKEY_SIZE = 34, r.prototype._estimateSize = function() {
            return r.OPCODES_SIZE + this.threshold * r.SIGNATURE_SIZE + this.publicKeys.length * r.PUBKEY_SIZE
        }, t.exports = r
    }, {
        "../../crypto/signature": 9,
        "../../publickey": 23,
        "../../script": 24,
        "../../util/buffer": 38,
        "../../util/preconditions": 40,
        "../output": 32,
        "../sighash": 33,
        "./input": 29,
        inherits: 232,
        lodash: 233
    }],
    31: [function(e, t) {
        "use strict";

        function r() {
            a.apply(this, arguments)
        }
        var n = e("inherits"),
            i = e("../../util/preconditions"),
            s = e("../../util/buffer"),
            o = e("../../crypto/hash"),
            a = e("./input"),
            f = e("../output"),
            c = e("../sighash"),
            u = e("../../script"),
            d = e("../../crypto/signature");
        n(r, a), r.prototype.getSignatures = function(e, t, r, n, a) {
            return i.checkState(this.output instanceof f), a = a || o.sha256ripemd160(t.publicKey.toBuffer()), n = n || d.SIGHASH_ALL, s.equals(a, this.output.script.getPublicKeyHash()) ? [{
                publicKey: t.publicKey,
                prevTxId: this.txId,
                outputIndex: this.outputIndex,
                inputIndex: r,
                signature: c.sign(e, t, n, r, this.output.script),
                sigtype: n
            }] : []
        }, r.prototype.addSignature = function(e, t) {
            return i.checkState(this.isValidSignature(e, t), "Signature is invalid"), this.setScript(u.buildPublicKeyHashIn(t.publicKey, t.signature.toDER(), t.sigtype)), this
        }, r.prototype.clearSignatures = function() {
            return this.setScript(u.empty()), this
        }, r.prototype.isFullySigned = function() {
            return this.script.isPublicKeyHashIn()
        }, r.SCRIPT_MAX_SIZE = 107, r.prototype._estimateSize = function() {
            return r.SCRIPT_MAX_SIZE
        }, t.exports = r
    }, {
        "../../crypto/hash": 6,
        "../../crypto/signature": 9,
        "../../script": 24,
        "../../util/buffer": 38,
        "../../util/preconditions": 40,
        "../output": 32,
        "../sighash": 33,
        "./input": 29,
        inherits: 232
    }],
    32: [function(e, t) {
        "use strict";

        function r(e) {
            return this instanceof r ? e ? a.isValidJSON(e) ? r.fromJSON(e) : this._fromObject(e) : void 0 : new r(e)
        }
        var n = e("lodash"),
            i = e("../crypto/bn"),
            s = e("buffer"),
            o = e("../util/buffer"),
            a = e("../util/js"),
            f = e("../encoding/bufferwriter"),
            c = e("../script");
        Object.defineProperty(r.prototype, "script", {
            configurable: !1,
            writeable: !1,
            enumerable: !0,
            get: function() {
                return this._script || (this._script = new c(this._scriptBuffer)), this._script
            }
        }), Object.defineProperty(r.prototype, "satoshis", {
            configurable: !1,
            writeable: !0,
            enumerable: !0,
            get: function() {
                return this._satoshis
            },
            set: function(e) {
                e instanceof i ? (this._satoshisBN = e, this._satoshis = e.toNumber()) : (this._satoshisBN = i.fromNumber(e), this._satoshis = e)
            }
        }), r.prototype._fromObject = function(e) {
            return this.satoshis = e.satoshis, (e.script || e.scriptBuffer) && this.setScript(e.script || e.scriptBuffer), this
        }, r.prototype.toObject = function() {
            return {
                satoshis: this.satoshis,
                script: this.script.toString()
            }
        }, r.prototype.toJSON = function() {
            return JSON.stringify(this.toObject())
        }, r.fromJSON = function(e) {
            return a.isValidJSON(e) && (e = JSON.parse(e)), new r({
                satoshis: e.satoshis || - -e.valuebn,
                script: new c(e.script)
            })
        }, r.prototype.setScript = function(e) {
            if (e instanceof c) this._scriptBuffer = e.toBuffer(), this._script = e;
            else if (n.isString(e)) this._script = new c(e), this._scriptBuffer = this._script.toBuffer();
            else {
                if (!o.isBuffer(e)) throw new TypeError("Unrecognized Argument");
                this._scriptBuffer = e, this._script = null
            }
            return this
        }, r.prototype.inspect = function() {
            return "<Output (" + this.satoshis + " sats) " + this.script.inspect() + ">"
        }, r.fromBufferReader = function(e) {
            var t = new r;
            t.satoshis = e.readUInt64LEBN();
            var n = e.readVarintNum();
            return t._scriptBuffer = 0 !== n ? e.read(n) : new s.Buffer([]), t
        }, r.prototype.toBufferWriter = function(e) {
            e || (e = new f), e.writeUInt64LEBN(this._satoshisBN);
            var t = this._scriptBuffer;
            return e.writeVarintNum(t.length), e.write(t), e
        }, t.exports = r
    }, {
        "../crypto/bn": 4,
        "../encoding/bufferwriter": 13,
        "../script": 24,
        "../util/buffer": 38,
        "../util/js": 39,
        buffer: 43,
        lodash: 233
    }],
    33: [function(e, t) {
        (function(r) {
            "use strict";

            function n(e, t, r, n, i) {
                var s = m(e, r, n, i),
                    o = p.sign(s, t, "little").set({
                        nhashtype: r
                    });
                return o
            }

            function i(e, t, r, n, i) {
                l.checkArgument(!b.isUndefined(e)), l.checkArgument(!b.isUndefined(t) && !b.isUndefined(t.nhashtype));
                var s = m(e, t.nhashtype, n, i);
                return p.verify(s, t, r, "little")
            }
            var s = e("buffer"),
                o = e("../crypto/signature"),
                a = e("../script"),
                f = e("./output"),
                c = e("../encoding/bufferreader"),
                u = e("../encoding/bufferwriter"),
                d = e("../crypto/bn"),
                h = e("../crypto/hash"),
                p = e("../crypto/ecdsa"),
                l = e("../util/preconditions"),
                b = e("lodash"),
                g = "0000000000000000000000000000000000000000000000000000000000000001",
                y = "ffffffffffffffff",
                m = function(t, n, i, p) {
                    var l, b = e("./transaction"),
                        m = e("./input"),
                        v = b.shallowCopy(t);
                    for (p = new a(p), p.removeCodeseparators(), l = 0; l < v.inputs.length; l++) v.inputs[l] = new m(v.inputs[l]).setScript(a.empty());
                    if (v.inputs[i] = new m(v.inputs[i]).setScript(p), (31 & n) === o.SIGHASH_NONE || (31 & n) === o.SIGHASH_SINGLE)
                        for (l = 0; l < v.inputs.length; l++) l !== i && (v.inputs[l].sequenceNumber = 0);
                    if ((31 & n) === o.SIGHASH_NONE) v.outputs = [];
                    else if ((31 & n) === o.SIGHASH_SINGLE) {
                        if (i > v.outputs.length - 1) return new r(g, "hex");
                        if (v.outputs.length <= i) throw new Error("Missing output to sign");
                        for (v.outputs.length = i + 1, l = 0; i > l; l++) v.outputs[l] = new f({
                            satoshis: d.fromBuffer(new s.Buffer(y, "hex")),
                            script: a.empty()
                        })
                    }
                    n & o.SIGHASH_ANYONECANPAY && (v.inputs = [v.inputs[i]]);
                    var _ = (new u).write(v.toBuffer()).writeInt32LE(n).toBuffer(),
                        w = h.sha256sha256(_);
                    return w = new c(w).readReverse()
                };
            t.exports = {
                sighash: m,
                sign: n,
                verify: i
            }
        }).call(this, e("buffer").Buffer)
    }, {
        "../crypto/bn": 4,
        "../crypto/ecdsa": 5,
        "../crypto/hash": 6,
        "../crypto/signature": 9,
        "../encoding/bufferreader": 12,
        "../encoding/bufferwriter": 13,
        "../script": 24,
        "../util/preconditions": 40,
        "./input": 28,
        "./output": 32,
        "./transaction": 34,
        buffer: 43,
        lodash: 233
    }],
    34: [function(e, t) {
        "use strict";

        function r(e) {
            if (!(this instanceof r)) return new r(e);
            if (this.inputs = [], this.outputs = [], this._inputAmount = 0, this._outputAmount = 0, e) {
                if (e instanceof r) return r.shallowCopy(e);
                if (a.isHexa(e)) this.fromString(e);
                else if (a.isValidJSON(e)) this.fromJSON(e);
                else if (f.isBuffer(e)) this.fromBuffer(e);
                else {
                    if (!n.isObject(e)) throw new o.InvalidArgument("Must provide an object or string to deserialize a transaction");
                    this.fromObject(e)
                }
            } else this._newTransaction()
        }
        var n = e("lodash"),
            i = e("../util/preconditions"),
            s = e("buffer"),
            o = e("../errors"),
            a = e("../util/js"),
            f = e("../util/buffer"),
            c = e("../util/js"),
            u = e("../encoding/bufferreader"),
            d = e("../encoding/bufferwriter"),
            h = e("../crypto/hash"),
            p = e("../crypto/signature"),
            l = e("./sighash"),
            b = e("../address"),
            g = e("./unspentoutput"),
            y = e("./input"),
            m = y.PublicKeyHash,
            v = y.MultiSigScriptHash,
            _ = e("./output"),
            w = e("../script"),
            S = e("../privatekey"),
            k = e("../block"),
            I = e("../crypto/bn"),
            E = 1,
            A = 0,
            x = 4294967295;
        r.MAX_MONEY = 21e14, r.shallowCopy = function(e) {
            var t = new r(e.toBuffer());
            return t
        };
        var P = {
            configurable: !1,
            writeable: !1,
            enumerable: !0,
            get: function() {
                return new u(this._getHash()).readReverse().toString("hex")
            }
        };
        Object.defineProperty(r.prototype, "hash", P), Object.defineProperty(r.prototype, "id", P), r.prototype._getHash = function() {
            return h.sha256sha256(this.toBuffer())
        }, r.prototype.serialize = function(e) {
            return e ? this.uncheckedSerialize() : this.checkedSerialize()
        }, r.prototype.uncheckedSerialize = r.prototype.toString = function() {
            return this.toBuffer().toString("hex")
        }, r.prototype.checkedSerialize = r.prototype.toString = function() {
            var e = this._validateFees();
            if (e) {
                var t = this._validateChange();
                throw t ? new o.Transaction.ChangeAddressMissing : new o.Transaction.FeeError(e)
            }
            if (this._hasDustOutputs()) throw new o.Transaction.DustOutputs;
            return this.uncheckedSerialize()
        }, r.FEE_SECURITY_MARGIN = 15, r.prototype._validateFees = function() {
            return this._getUnspentValue() > r.FEE_SECURITY_MARGIN * this._estimateFee() ? "Fee is more than " + r.FEE_SECURITY_MARGIN + " times the suggested amount" : void 0
        }, r.prototype._validateChange = function() {
            return this._change ? void 0 : "Missing change address"
        }, r.DUST_AMOUNT = 5460, r.prototype._hasDustOutputs = function() {
            var e;
            for (e in this.outputs)
                if (this.outputs[e].satoshis < r.DUST_AMOUNT) return !0;
            return !1
        }, r.prototype.inspect = function() {
            return "<Transaction: " + this.toString() + ">"
        }, r.prototype.toBuffer = function() {
            var e = new d;
            return this.toBufferWriter(e).toBuffer()
        }, r.prototype.toBufferWriter = function(e) {
            return e.writeUInt32LE(this.version), e.writeVarintNum(this.inputs.length), n.each(this.inputs, function(t) {
                t.toBufferWriter(e)
            }), e.writeVarintNum(this.outputs.length), n.each(this.outputs, function(t) {
                t.toBufferWriter(e)
            }), e.writeUInt32LE(this.nLockTime), e
        }, r.prototype.fromBuffer = function(e) {
            var t = new u(e);
            return this.fromBufferReader(t)
        }, r.prototype.fromBufferReader = function(e) {
            var t, r, n;
            for (this.version = e.readUInt32LE(), r = e.readVarintNum(), t = 0; r > t; t++) {
                var i = y.fromBufferReader(e);
                this.inputs.push(i)
            }
            for (n = e.readVarintNum(), t = 0; n > t; t++) this.outputs.push(_.fromBufferReader(e));
            return this.nLockTime = e.readUInt32LE(), this
        }, r.prototype.fromJSON = function(e) {
            c.isValidJSON(e) && (e = JSON.parse(e));
            var t = this;
            this.inputs = [];
            var r = e.inputs || e.txins;
            r.forEach(function(e) {
                t.inputs.push(y.fromJSON(e))
            }), this.outputs = [];
            var n = e.outputs || e.txouts;
            return n.forEach(function(e) {
                t.outputs.push(_.fromJSON(e))
            }), e.change && this.change(e.change), this.version = e.version, this.nLockTime = e.nLockTime, this
        }, r.prototype.toObject = function() {
            var e = [];
            this.inputs.forEach(function(t) {
                e.push(t.toObject())
            });
            var t = [];
            return this.outputs.forEach(function(e) {
                t.push(e.toObject())
            }), {
                change: this._change ? this._change.toString() : void 0,
                version: this.version,
                inputs: e,
                outputs: t,
                nLockTime: this.nLockTime
            }
        }, r.prototype.fromObject = function(e) {
            var t = this;
            n.each(e.inputs, function(e) {
                if (e.output && e.output.script) {
                    if (e.output.script = new w(e.output.script), e.output.script.isPublicKeyHashOut()) return void t.addInput(new y.PublicKeyHash(e));
                    if (e.output.script.isScriptHashOut() && e.publicKeys && e.threshold) return void t.addInput(new y.MultiSigScriptHash(e, e.publicKeys, e.threshold, e.signatures))
                }
                t.uncheckedAddInput(new y(e))
            }), n.each(e.outputs, function(e) {
                t.addOutput(new _(e))
            }), e.change && this.change(e.change), this.nLockTime = e.nLockTime, this.version = e.version
        }, r.prototype.toJSON = function() {
            return JSON.stringify(this.toObject())
        }, r.prototype.fromString = function(e) {
            this.fromBuffer(new s.Buffer(e, "hex"))
        }, r.prototype._newTransaction = function() {
            this.version = E, this.nLockTime = A
        }, r.prototype.from = function(e, t, r) {
            if (n.isArray(e)) {
                var i = this;
                return n.each(e, function(e) {
                    i.from(e, t, r)
                }), this
            }
            var s = n.any(this.inputs, function(t) {
                return t.prevTxId.toString("hex") === e.txId && t.outputIndex === e.outputIndex
            });
            if (!s) return t && r ? this._fromMultisigUtxo(e, t, r) : this._fromNonP2SH(e), this
        }, r.prototype._fromNonP2SH = function(e) {
            e = new g(e), this.inputs.push(new m({
                output: new _({
                    script: e.script,
                    satoshis: e.satoshis
                }),
                prevTxId: e.txId,
                outputIndex: e.outputIndex,
                sequenceNumber: x,
                script: w.empty()
            })), this._inputAmount += e.satoshis
        }, r.prototype._fromMultisigUtxo = function(e, t, r) {
            e = new g(e), this.addInput(new v({
                output: new _({
                    script: e.script,
                    satoshis: e.satoshis
                }),
                prevTxId: e.txId,
                outputIndex: e.outputIndex,
                sequenceNumber: x,
                script: w.empty()
            }, t, r))
        }, r.prototype.addInput = function(e, t, r) {
            if (i.checkArgumentType(e, y, "input"), !(e.output && (e.output instanceof _ || t || r))) throw new o.Transaction.NeedMoreInfo("Need information about the UTXO script and satoshis");
            return !e.output && t && r && (t = t instanceof w ? t : new w(t), i.checkArgumentType(r, "number", "satoshis"), e.output = new _({
                script: t,
                satoshis: r
            })), this.uncheckedAddInput(e)
        }, r.prototype.uncheckedAddInput = function(e) {
            return i.checkArgumentType(e, y, "input"), this._changeSetup = !1, this.inputs.push(e), e.output && (this._inputAmount += e.output.satoshis), this
        }, r.prototype.hasAllUtxoInfo = function() {
            return n.all(this.inputs.map(function(e) {
                return !!e.output
            }))
        }, r.prototype.fee = function(e) {
            return this._fee = e, this._changeSetup = !1, this
        }, r.prototype.change = function(e) {
            return this._change = new b(e), this._changeSetup = !1, this
        }, r.prototype.to = function(e, t) {
            return this.addOutput(new _({
                script: w(new b(e)),
                satoshis: t
            })), this
        }, r.prototype.addData = function(e) {
            return this.addOutput(new _({
                script: w.buildDataOut(e),
                satoshis: 0
            })), this
        }, r.prototype.addOutput = function(e) {
            i.checkArgumentType(e, _, "output"), this.outputs.push(e), this._changeSetup = !1, this._outputAmount += e.satoshis
        }, r.prototype._updateChangeOutput = function() {
            if (this._change && !this._changeSetup) {
                n.isUndefined(this._changeSetup) || this._clearSignatures(), n.isUndefined(this._changeOutput) || this.removeOutput(this._changeOutput);
                var e = this._getUnspentValue(),
                    t = this.getFee();
                e - t > 0 ? (this._changeOutput = this.outputs.length, this.addOutput(new _({
                    script: w.fromAddress(this._change),
                    satoshis: e - t
                }))) : this._changeOutput = void 0, this._changeSetup = !0
            }
        }, r.prototype.getFee = function() {
            return this._fee || this._estimateFee()
        }, r.prototype._estimateFee = function() {
            var e = this._estimateSize(),
                t = this._getUnspentValue();
            return r._estimateFee(e, t)
        }, r.prototype._getUnspentValue = function() {
            return this._inputAmount - this._outputAmount
        }, r.prototype._clearSignatures = function() {
            n.each(this.inputs, function(e) {
                e.clearSignatures()
            })
        }, r.FEE_PER_KB = 1e4, r.CHANGE_OUTPUT_MAX_SIZE = 62, r._estimateFee = function(e, t) {
            var n = Math.ceil(e / r.FEE_PER_KB);
            return t > n && (e += r.CHANGE_OUTPUT_MAX_SIZE), Math.ceil(e / 1e3) * r.FEE_PER_KB
        }, r.MAXIMUM_EXTRA_SIZE = 26, r.prototype._estimateSize = function() {
            var e = r.MAXIMUM_EXTRA_SIZE;
            return n.each(this.inputs, function(t) {
                e += t._estimateSize()
            }), n.each(this.outputs, function(t) {
                e += t.script.toBuffer().length + 9
            }), e
        }, r.prototype.removeOutput = function(e) {
            var t = this.outputs[e];
            this._outputAmount -= t.satoshis, this.outputs = n.without(this.outputs, this.outputs[this._changeOutput])
        }, r.prototype.sign = function(e, t) {
            i.checkState(this.hasAllUtxoInfo()), this._updateChangeOutput();
            var r = this;
            return n.isArray(e) ? (n.each(e, function(e) {
                r.sign(e, t)
            }), this) : (n.each(this.getSignatures(e, t), function(e) {
                r.applySignature(e)
            }), this)
        }, r.prototype.getSignatures = function(e, t) {
            e = new S(e), t = t || p.SIGHASH_ALL;
            var r = this,
                i = [],
                s = h.sha256ripemd160(e.publicKey.toBuffer());
            return n.each(this.inputs, function(o, a) {
                n.each(o.getSignatures(r, e, a, t, s), function(e) {
                    i.push(e)
                })
            }), i
        }, r.prototype.applySignature = function(e) {
            return this.inputs[e.inputIndex].addSignature(this, e), this
        }, r.prototype.isFullySigned = function() {
            return n.each(this.inputs, function(e) {
                if (e.isFullySigned === y.prototype.isFullySigned) throw new o.Transaction.UnableToVerifySignature("Unrecognized script kind, or not enough information to execute script.This usually happens when creating a transaction from a serialized transaction")
            }), n.all(n.map(this.inputs, function(e) {
                return e.isFullySigned()
            }))
        }, r.prototype.isValidSignature = function(e) {
            var t = this;
            if (this.inputs[e.inputIndex].isValidSignature === y.prototype.isValidSignature) throw new o.Transaction.UnableToVerifySignature("Unrecognized script kind, or not enough information to execute script.This usually happens when creating a transaction from a serialized transaction");
            return this.inputs[e.inputIndex].isValidSignature(t, e)
        }, r.prototype.verifySignature = function(e, t, r, n) {
            return l.verify(this, e, t, r, n)
        }, r.prototype.verify = function() {
            if (0 === this.inputs.length) return "transaction txins empty";
            if (0 === this.outputs.length) return "transaction txouts empty";
            if (this.toBuffer().length > k.MAX_BLOCK_SIZE) return "transaction over the maximum block size";
            for (var e = I(0), t = 0; t < this.outputs.length; t++) {
                var i = this.outputs[t],
                    s = i._satoshisBN;
                if (s.lt(0)) return "transaction txout " + t + " negative";
                if (s.gt(I(r.MAX_MONEY, 10))) return "transaction txout " + t + " greater than MAX_MONEY";
                if (e = e.add(s), e.gt(r.MAX_MONEY)) return "transaction txout " + t + " total output greater than MAX_MONEY"
            }
            var o = {};
            for (t = 0; t < this.inputs.length; t++) {
                var a = this.inputs[t],
                    f = a.prevTxId + ":" + a.outputIndex;
                if (!n.isUndefined(o[f])) return "transaction input " + t + " duplicate input";
                o[f] = !0
            }
            var c = this.isCoinbase();
            if (c) {
                var u = this.inputs[0]._script.toBuffer();
                if (u.length < 2 || u.length > 100) return "coinbase trasaction script size invalid"
            } else
                for (t = 0; t < this.inputs.length; t++)
                    if (this.inputs[t].isNull()) return "tranasction input " + t + " has null input"; return !0
        }, r.prototype.isCoinbase = function() {
            return 1 === this.inputs.length && this.inputs[0].isNull()
        }, t.exports = r
    }, {
        "../address": 1,
        "../block": 2,
        "../crypto/bn": 4,
        "../crypto/hash": 6,
        "../crypto/signature": 9,
        "../encoding/bufferreader": 12,
        "../encoding/bufferwriter": 13,
        "../errors": 15,
        "../privatekey": 22,
        "../script": 24,
        "../util/buffer": 38,
        "../util/js": 39,
        "../util/preconditions": 40,
        "./input": 28,
        "./output": 32,
        "./sighash": 33,
        "./unspentoutput": 35,
        buffer: 43,
        lodash: 233
    }],
    35: [function(e, t) {
        "use strict";

        function r(e) {
            if (!(this instanceof r)) return new r(e);
            i.checkArgument(n.isObject(e), "Must provide an object from where to extract data");
            var t = e.address ? new a(e.address) : void 0,
                c = e.txid ? e.txid : e.txId;
            if (!c || !s.isHexaString(c) || c.length > 64) throw new Error("Invalid TXID in object", e);
            var u = n.isUndefined(e.vout) ? e.outputIndex : e.vout;
            if (!n.isNumber(u)) throw new Error("Invalid outputIndex, received " + u);
            i.checkArgument(e.scriptPubKey || e.script, "Must provide the scriptPubKey for that output!");
            var d = new o(e.scriptPubKey || e.script);
            i.checkArgument(e.amount || e.satoshis, "Must provide the scriptPubKey for that output!");
            var h = e.amount ? new f.fromBTC(e.amount).toSatoshis() : e.satoshis;
            i.checkArgument(n.isNumber(h), "Amount must be a number"), s.defineImmutable(this, {
                address: t,
                txId: c,
                outputIndex: u,
                script: d,
                satoshis: h
            })
        }
        var n = e("lodash"),
            i = e("../util/preconditions"),
            s = e("../util/js"),
            o = e("../script"),
            a = e("../address"),
            f = e("../unit");
        r.prototype.inspect = function() {
            return "<UnspentOutput: " + this.txId + ":" + this.outputIndex + ", satoshis: " + this.satoshis + ", address: " + this.address + ">"
        }, r.prototype.toString = function() {
            return this.txId + ":" + this.outputIndex
        }, r.fromJSON = r.fromObject = function(e) {
            return s.isValidJSON(e) && (e = JSON.parse(e)), new r(e)
        }, r.prototype.toJSON = function() {
            return JSON.stringify(this.toObject())
        }, r.prototype.toObject = function() {
            return {
                address: this.address ? this.address.toString() : void 0,
                txid: this.txId,
                vout: this.outputIndex,
                scriptPubKey: this.script.toBuffer().toString("hex"),
                amount: f.fromSatoshis(this.satoshis).toBTC()
            }
        }, t.exports = r
    }, {
        "../address": 1,
        "../script": 24,
        "../unit": 36,
        "../util/js": 39,
        "../util/preconditions": 40,
        lodash: 233
    }],
    36: [function(e, t) {
        "use strict";

        function r(e, t) {
            if (!(this instanceof r)) return new r(e, t);
            if (n.isNumber(t)) {
                if (0 >= t) throw new i.Unit.InvalidRate(t);
                e /= t, t = r.BTC
            }
            this._value = this._from(e, t);
            var s = this,
                a = function(e) {
                    Object.defineProperty(s, e, {
                        get: function() {
                            return s.to(e)
                        },
                        enumerable: !0
                    })
                };
            Object.keys(o).forEach(a)
        }
        var n = e("lodash"),
            i = e("./errors"),
            s = e("./util/js"),
            o = {
                BTC: [1e8, 8],
                mBTC: [1e5, 5],
                uBTC: [100, 2],
                bits: [100, 2],
                satoshis: [1, 0]
            };
        Object.keys(o).forEach(function(e) {
            r[e] = e
        }), r.fromJSON = function(e) {
            return s.isValidJSON(e) && (e = JSON.parse(e)), new r(e.amount, e.code)
        }, r.fromBTC = function(e) {
            return new r(e, r.BTC)
        }, r.fromMilis = function(e) {
            return new r(e, r.mBTC)
        }, r.fromMicros = r.fromBits = function(e) {
            return new r(e, r.bits)
        }, r.fromSatoshis = function(e) {
            return new r(e, r.satoshis)
        }, r.fromFiat = function(e, t) {
            return new r(e, t)
        }, r.prototype._from = function(e, t) {
            if (!o[t]) throw new i.Unit.UnknownCode(t);
            return parseInt((e * o[t][0]).toFixed())
        }, r.prototype.to = function(e) {
            if (n.isNumber(e)) {
                if (0 >= e) throw new i.Unit.InvalidRate(e);
                return parseFloat((this.BTC * e).toFixed(2))
            }
            if (!o[e]) throw new i.Unit.UnknownCode(e);
            var t = this._value / o[e][0];
            return parseFloat(t.toFixed(o[e][1]))
        }, r.prototype.toBTC = function() {
            return this.to(r.BTC)
        }, r.prototype.toMilis = function() {
            return this.to(r.mBTC)
        }, r.prototype.toMicros = r.prototype.toBits = function() {
            return this.to(r.bits)
        }, r.prototype.toSatoshis = function() {
            return this.to(r.satoshis)
        }, r.prototype.atRate = function(e) {
            return this.to(e)
        }, r.prototype.toString = function() {
            return this.satoshis + " satoshis"
        }, r.prototype.toObject = function() {
            return {
                amount: this.BTC,
                code: r.BTC
            }
        }, r.prototype.toJSON = function() {
            return JSON.stringify(this.toObject())
        }, r.prototype.inspect = function() {
            return "<Unit: " + this.toString() + ">"
        }, t.exports = r
    }, {
        "./errors": 15,
        "./util/js": 39,
        lodash: 233
    }],
    37: [function(e, t) {
        "use strict";
        var r = e("lodash"),
            n = e("url"),
            i = e("./address"),
            s = e("./unit"),
            o = e("./util/js"),
            a = function(e, t) {
                if (!(this instanceof a)) return new a(e, t);
                if (this.extras = {}, this.knownParams = t || [], this.address = this.network = this.amount = this.message = null, "string" == typeof e) {
                    var r = a.parse(e);
                    r.amount && (r.amount = this._parseAmount(r.amount)), this._fromObject(r)
                } else {
                    if ("object" != typeof e) throw new TypeError("Unrecognized data format.");
                    this._fromObject(e)
                }
            };
        a.fromString = function(e) {
            if ("string" != typeof e) throw new TypeError("Expected a string");
            return new a(e)
        }, a.fromJSON = function(e) {
            return o.isValidJSON(e) && (e = JSON.parse(e)), new a(e)
        }, a.isValid = function(e, t) {
            try {
                new a(e, t)
            } catch (r) {
                return !1
            }
            return !0
        }, a.parse = function(e) {
            var t = n.parse(e, !0);
            if ("bitcoin:" !== t.protocol) throw new TypeError("Invalid bitcoin URI");
            var r = /[^:]*:\/?\/?([^?]*)/.exec(e);
            return t.query.address = r && r[1] || void 0, t.query
        }, a.Members = ["address", "amount", "message", "label", "r"], a.prototype._fromObject = function(e) {
            if (!i.isValid(e.address)) throw new TypeError("Invalid bitcoin address");
            this.address = new i(e.address), this.network = this.address.network, this.amount = e.amount;
            for (var t in e)
                if ("address" !== t && "amount" !== t) {
                    if (/^req-/.exec(t) && -1 === this.knownParams.indexOf(t)) throw Error("Unknown required argument " + t);
                    var r = a.Members.indexOf(t) > -1 ? this : this.extras;
                    r[t] = e[t]
                }
        }, a.prototype._parseAmount = function(e) {
            if (e = Number(e), isNaN(e)) throw new TypeError("Invalid amount");
            return s.fromBTC(e).toSatoshis()
        }, a.prototype.toObject = function() {
            for (var e = {}, t = 0; t < a.Members.length; t++) {
                var n = a.Members[t];
                this.hasOwnProperty(n) && "undefined" != typeof this[n] && (e[n] = this[n].toString())
            }
            return r.extend(e, this.extras), e
        }, a.prototype.toJSON = function() {
            return JSON.stringify(this.toObject())
        }, a.prototype.toString = function() {
            var e = {};
            return this.amount && (e.amount = s.fromSatoshis(this.amount).toBTC()), this.message && (e.message = this.message), this.label && (e.label = this.label), this.r && (e.r = this.r), r.extend(e, this.extras), n.format({
                protocol: "bitcoin:",
                host: this.address,
                query: e
            })
        }, a.prototype.inspect = function() {
            return "<URI: " + this.toString() + ">"
        }, t.exports = a
    }, {
        "./address": 1,
        "./unit": 36,
        "./util/js": 39,
        lodash: 233,
        url: 205
    }],
    38: [function(e, t) {
        (function(r) {
            "use strict";

            function n(e, t) {
                if (e.length !== t.length) return !1;
                for (var r = e.length, n = 0; r > n; n++)
                    if (e[n] !== t[n]) return !1;
                return !0
            }
            var i = e("buffer"),
                s = e("assert"),
                o = e("./js"),
                a = e("./preconditions");
            t.exports = {
                fill: function(e, t) {
                    a.checkArgumentType(e, "Buffer", "buffer"), a.checkArgumentType(t, "number", "value");
                    for (var r = e.length, n = 0; r > n; n++) e[n] = t;
                    return e
                },
                isBuffer: function(e) {
                    return i.Buffer.isBuffer(e) || e instanceof Uint8Array
                },
                emptyBuffer: function(e) {
                    a.checkArgumentType(e, "number", "bytes");
                    for (var t = new i.Buffer(e), r = 0; e > r; r++) t.write("\x00", r);
                    return t
                },
                concat: i.Buffer.concat,
                equals: n,
                equal: n,
                integerAsSingleByteBuffer: function(e) {
                    return a.checkArgumentType(e, "number", "integer"), new i.Buffer([255 & e])
                },
                integerAsBuffer: function(e) {
                    a.checkArgumentType(e, "number", "integer");
                    var t = [];
                    return t.push(e >> 24 & 255), t.push(e >> 16 & 255), t.push(e >> 8 & 255), t.push(255 & e), new r(t)
                },
                integerFromBuffer: function(e) {
                    return a.checkArgumentType(e, "Buffer", "buffer"), e[0] << 24 | e[1] << 16 | e[2] << 8 | e[3]
                },
                integerFromSingleByteBuffer: function(e) {
                    return a.checkArgumentType(e, "Buffer", "buffer"), e[0]
                },
                bufferToHex: function(e) {
                    return a.checkArgumentType(e, "Buffer", "buffer"), e.toString("hex")
                },
                reverse: function(e) {
                    a.checkArgumentType(e, "Buffer", "param");
                    for (var t = new i.Buffer(e.length), r = 0; r < e.length; r++) t[r] = e[e.length - r - 1];
                    return t
                },
                hexToBuffer: function(e) {
                    return s(o.isHexa(e)), new i.Buffer(e, "hex")
                }
            }, t.exports.NULL_HASH = t.exports.fill(new r(32), 0), t.exports.EMPTY_BUFFER = new r(0)
        }).call(this, e("buffer").Buffer)
    }, {
        "./js": 39,
        "./preconditions": 40,
        assert: 41,
        buffer: 43
    }],
    39: [function(e, t) {
        "use strict";
        var r = e("lodash"),
            n = function(e) {
                return r.isString(e) ? /^[0-9a-fA-F]+$/.test(e) : !1
            };
        t.exports = {
            isValidJSON: function(e) {
                var t;
                try {
                    t = JSON.parse(e)
                } catch (r) {
                    return !1
                }
                return "object" == typeof t ? !0 : !1
            },
            isHexa: n,
            isHexaString: n,
            cloneArray: function(e) {
                return [].concat(e)
            },
            defineImmutable: function(e, t) {
                return Object.keys(t).forEach(function(r) {
                    Object.defineProperty(e, r, {
                        configurable: !1,
                        enumerable: !0,
                        value: t[r]
                    })
                }), e
            }
        }
    }, {
        lodash: 233
    }],
    40: [function(e, t) {
        "use strict";
        var r = e("../errors"),
            n = e("lodash");
        t.exports = {
            checkState: function(e, t) {
                if (!e) throw new r.InvalidState(t)
            },
            checkArgument: function(e, t, n) {
                if (!e) throw new r.InvalidArgument(t, n)
            },
            checkArgumentType: function(t, i, s) {
                if (s = s || "(unknown name)", n.isString(i)) {
                    if ("Buffer" === i) {
                        var o = e("./buffer");
                        if (!o.isBuffer(t)) throw new r.InvalidArgumentType(t, i, s)
                    } else if (typeof t !== i) throw new r.InvalidArgumentType(t, i, s)
                } else if (!(t instanceof i)) throw new r.InvalidArgumentType(t, i.name, s)
            }
        }
    }, {
        "../errors": 15,
        "./buffer": 38,
        lodash: 233
    }],
    41: [function(e, t) {
        function r(e, t) {
            return h.isUndefined(t) ? "" + t : !h.isNumber(t) || !isNaN(t) && isFinite(t) ? h.isFunction(t) || h.isRegExp(t) ? t.toString() : t : t.toString()
        }

        function n(e, t) {
            return h.isString(e) ? e.length < t ? e : e.slice(0, t) : e
        }

        function i(e) {
            return n(JSON.stringify(e.actual, r), 128) + " " + e.operator + " " + n(JSON.stringify(e.expected, r), 128)
        }

        function s(e, t, r, n, i) {
            throw new b.AssertionError({
                message: r,
                actual: e,
                expected: t,
                operator: n,
                stackStartFunction: i
            })
        }

        function o(e, t) {
            e || s(e, !0, t, "==", b.ok)
        }

        function a(e, t) {
            if (e === t) return !0;
            if (h.isBuffer(e) && h.isBuffer(t)) {
                if (e.length != t.length) return !1;
                for (var r = 0; r < e.length; r++)
                    if (e[r] !== t[r]) return !1;
                return !0
            }
            return h.isDate(e) && h.isDate(t) ? e.getTime() === t.getTime() : h.isRegExp(e) && h.isRegExp(t) ? e.source === t.source && e.global === t.global && e.multiline === t.multiline && e.lastIndex === t.lastIndex && e.ignoreCase === t.ignoreCase : h.isObject(e) || h.isObject(t) ? c(e, t) : e == t
        }

        function f(e) {
            return "[object Arguments]" == Object.prototype.toString.call(e)
        }

        function c(e, t) {
            if (h.isNullOrUndefined(e) || h.isNullOrUndefined(t)) return !1;
            if (e.prototype !== t.prototype) return !1;
            if (f(e)) return f(t) ? (e = p.call(e), t = p.call(t), a(e, t)) : !1;
            try {
                var r, n, i = g(e),
                    s = g(t)
            } catch (o) {
                return !1
            }
            if (i.length != s.length) return !1;
            for (i.sort(), s.sort(), n = i.length - 1; n >= 0; n--)
                if (i[n] != s[n]) return !1;
            for (n = i.length - 1; n >= 0; n--)
                if (r = i[n], !a(e[r], t[r])) return !1;
            return !0
        }

        function u(e, t) {
            return e && t ? "[object RegExp]" == Object.prototype.toString.call(t) ? t.test(e) : e instanceof t ? !0 : t.call({}, e) === !0 ? !0 : !1 : !1
        }

        function d(e, t, r, n) {
            var i;
            h.isString(r) && (n = r, r = null);
            try {
                t()
            } catch (o) {
                i = o
            }
            if (n = (r && r.name ? " (" + r.name + ")." : ".") + (n ? " " + n : "."), e && !i && s(i, r, "Missing expected exception" + n), !e && u(i, r) && s(i, r, "Got unwanted exception" + n), e && i && r && !u(i, r) || !e && i) throw i
        }
        var h = e("util/"),
            p = Array.prototype.slice,
            l = Object.prototype.hasOwnProperty,
            b = t.exports = o;
        b.AssertionError = function(e) {
            this.name = "AssertionError", this.actual = e.actual, this.expected = e.expected, this.operator = e.operator, e.message ? (this.message = e.message, this.generatedMessage = !1) : (this.message = i(this), this.generatedMessage = !0);
            var t = e.stackStartFunction || s;
            if (Error.captureStackTrace) Error.captureStackTrace(this, t);
            else {
                var r = new Error;
                if (r.stack) {
                    var n = r.stack,
                        o = t.name,
                        a = n.indexOf("\n" + o);
                    if (a >= 0) {
                        var f = n.indexOf("\n", a + 1);
                        n = n.substring(f + 1)
                    }
                    this.stack = n
                }
            }
        }, h.inherits(b.AssertionError, Error), b.fail = s, b.ok = o, b.equal = function(e, t, r) {
            e != t && s(e, t, r, "==", b.equal)
        }, b.notEqual = function(e, t, r) {
            e == t && s(e, t, r, "!=", b.notEqual)
        }, b.deepEqual = function(e, t, r) {
            a(e, t) || s(e, t, r, "deepEqual", b.deepEqual)
        }, b.notDeepEqual = function(e, t, r) {
            a(e, t) && s(e, t, r, "notDeepEqual", b.notDeepEqual)
        }, b.strictEqual = function(e, t, r) {
            e !== t && s(e, t, r, "===", b.strictEqual)
        }, b.notStrictEqual = function(e, t, r) {
            e === t && s(e, t, r, "!==", b.notStrictEqual)
        }, b["throws"] = function() {
            d.apply(this, [!0].concat(p.call(arguments)))
        }, b.doesNotThrow = function() {
            d.apply(this, [!1].concat(p.call(arguments)))
        }, b.ifError = function(e) {
            if (e) throw e
        };
        var g = Object.keys || function(e) {
            var t = [];
            for (var r in e) l.call(e, r) && t.push(r);
            return t
        }
    }, {
        "util/": 207
    }],
    42: [function() {}, {}],
    43: [function(e, t, r) {
        function n(e, t, r) {
            if (!(this instanceof n)) return new n(e, t, r);
            var i, s = typeof e;
            if ("number" === s) i = e > 0 ? e >>> 0 : 0;
            else if ("string" === s) "base64" === t && (e = k(e)), i = n.byteLength(e, t);
            else {
                if ("object" !== s || null === e) throw new TypeError("must start with number, buffer, array or string");
                "Buffer" === e.type && C(e.data) && (e = e.data), i = +e.length > 0 ? Math.floor(+e.length) : 0
            }
            if (this.length > M) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + M.toString(16) + " bytes");
            var o;
            n.TYPED_ARRAY_SUPPORT ? o = n._augment(new Uint8Array(i)) : (o = this, o.length = i, o._isBuffer = !0);
            var a;
            if (n.TYPED_ARRAY_SUPPORT && "number" == typeof e.byteLength) o._set(e);
            else if (E(e))
                if (n.isBuffer(e))
                    for (a = 0; i > a; a++) o[a] = e.readUInt8(a);
                else
                    for (a = 0; i > a; a++) o[a] = (e[a] % 256 + 256) % 256;
            else if ("string" === s) o.write(e, 0, t);
            else if ("number" === s && !n.TYPED_ARRAY_SUPPORT && !r)
                for (a = 0; i > a; a++) o[a] = 0;
            return o
        }

        function i(e, t, r, n) {
            r = Number(r) || 0;
            var i = e.length - r;
            n ? (n = Number(n), n > i && (n = i)) : n = i;
            var s = t.length;
            if (s % 2 !== 0) throw new Error("Invalid hex string");
            n > s / 2 && (n = s / 2);
            for (var o = 0; n > o; o++) {
                var a = parseInt(t.substr(2 * o, 2), 16);
                if (isNaN(a)) throw new Error("Invalid hex string");
                e[r + o] = a
            }
            return o
        }

        function s(e, t, r, n) {
            var i = R(x(t), e, r, n);
            return i
        }

        function o(e, t, r, n) {
            var i = R(P(t), e, r, n);
            return i
        }

        function a(e, t, r, n) {
            return o(e, t, r, n)
        }

        function f(e, t, r, n) {
            var i = R(B(t), e, r, n);
            return i
        }

        function c(e, t, r, n) {
            var i = R(O(t), e, r, n, 2);
            return i
        }

        function u(e, t, r) {
            return N.fromByteArray(0 === t && r === e.length ? e : e.slice(t, r))
        }

        function d(e, t, r) {
            var n = "",
                i = "";
            r = Math.min(e.length, r);
            for (var s = t; r > s; s++) e[s] <= 127 ? (n += T(i) + String.fromCharCode(e[s]), i = "") : i += "%" + e[s].toString(16);
            return n + T(i)
        }

        function h(e, t, r) {
            var n = "";
            r = Math.min(e.length, r);
            for (var i = t; r > i; i++) n += String.fromCharCode(e[i]);
            return n
        }

        function p(e, t, r) {
            return h(e, t, r)
        }

        function l(e, t, r) {
            var n = e.length;
            (!t || 0 > t) && (t = 0), (!r || 0 > r || r > n) && (r = n);
            for (var i = "", s = t; r > s; s++) i += A(e[s]);
            return i
        }

        function b(e, t, r) {
            for (var n = e.slice(t, r), i = "", s = 0; s < n.length; s += 2) i += String.fromCharCode(n[s] + 256 * n[s + 1]);
            return i
        }

        function g(e, t, r) {
            if (e % 1 !== 0 || 0 > e) throw new RangeError("offset is not uint");
            if (e + t > r) throw new RangeError("Trying to access beyond buffer length")
        }

        function y(e, t, r, i, s, o) {
            if (!n.isBuffer(e)) throw new TypeError("buffer must be a Buffer instance");
            if (t > s || o > t) throw new TypeError("value is out of bounds");
            if (r + i > e.length) throw new TypeError("index out of range")
        }

        function m(e, t, r, n) {
            0 > t && (t = 65535 + t + 1);
            for (var i = 0, s = Math.min(e.length - r, 2); s > i; i++) e[r + i] = (t & 255 << 8 * (n ? i : 1 - i)) >>> 8 * (n ? i : 1 - i)
        }

        function v(e, t, r, n) {
            0 > t && (t = 4294967295 + t + 1);
            for (var i = 0, s = Math.min(e.length - r, 4); s > i; i++) e[r + i] = t >>> 8 * (n ? i : 3 - i) & 255
        }

        function _(e, t, r, n, i, s) {
            if (t > i || s > t) throw new TypeError("value is out of bounds");
            if (r + n > e.length) throw new TypeError("index out of range")
        }

        function w(e, t, r, n, i) {
            return i || _(e, t, r, 4, 3.4028234663852886e38, -3.4028234663852886e38), j.write(e, t, r, n, 23, 4), r + 4
        }

        function S(e, t, r, n, i) {
            return i || _(e, t, r, 8, 1.7976931348623157e308, -1.7976931348623157e308), j.write(e, t, r, n, 52, 8), r + 8
        }

        function k(e) {
            for (e = I(e).replace(z, ""); e.length % 4 !== 0;) e += "=";
            return e
        }

        function I(e) {
            return e.trim ? e.trim() : e.replace(/^\s+|\s+$/g, "")
        }

        function E(e) {
            return C(e) || n.isBuffer(e) || e && "object" == typeof e && "number" == typeof e.length
        }

        function A(e) {
            return 16 > e ? "0" + e.toString(16) : e.toString(16)
        }

        function x(e) {
            for (var t = [], r = 0; r < e.length; r++) {
                var n = e.charCodeAt(r);
                if (127 >= n) t.push(n);
                else {
                    var i = r;
                    n >= 55296 && 57343 >= n && r++;
                    for (var s = encodeURIComponent(e.slice(i, r + 1)).substr(1).split("%"), o = 0; o < s.length; o++) t.push(parseInt(s[o], 16))
                }
            }
            return t
        }

        function P(e) {
            for (var t = [], r = 0; r < e.length; r++) t.push(255 & e.charCodeAt(r));
            return t
        }

        function O(e) {
            for (var t, r, n, i = [], s = 0; s < e.length; s++) t = e.charCodeAt(s), r = t >> 8, n = t % 256, i.push(n), i.push(r);
            return i
        }

        function B(e) {
            return N.toByteArray(e)
        }

        function R(e, t, r, n, i) {
            i && (n -= n % i);
            for (var s = 0; n > s && !(s + r >= t.length || s >= e.length); s++) t[s + r] = e[s];
            return s
        }

        function T(e) {
            try {
                return decodeURIComponent(e)
            } catch (t) {
                return String.fromCharCode(65533)
            }
        }
        var N = e("base64-js"),
            j = e("ieee754"),
            C = e("is-array");
        r.Buffer = n, r.SlowBuffer = n, r.INSPECT_MAX_BYTES = 50, n.poolSize = 8192;
        var M = 1073741823;
        n.TYPED_ARRAY_SUPPORT = function() {
            try {
                var e = new ArrayBuffer(0),
                    t = new Uint8Array(e);
                return t.foo = function() {
                    return 42
                }, 42 === t.foo() && "function" == typeof t.subarray && 0 === new Uint8Array(1).subarray(1, 1).byteLength
            } catch (r) {
                return !1
            }
        }(), n.isBuffer = function(e) {
            return !(null == e || !e._isBuffer)
        }, n.compare = function(e, t) {
            if (!n.isBuffer(e) || !n.isBuffer(t)) throw new TypeError("Arguments must be Buffers");
            for (var r = e.length, i = t.length, s = 0, o = Math.min(r, i); o > s && e[s] === t[s]; s++);
            return s !== o && (r = e[s], i = t[s]), i > r ? -1 : r > i ? 1 : 0
        }, n.isEncoding = function(e) {
            switch (String(e).toLowerCase()) {
                case "hex":
                case "utf8":
                case "utf-8":
                case "ascii":
                case "binary":
                case "base64":
                case "raw":
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                    return !0;
                default:
                    return !1
            }
        }, n.concat = function(e, t) {
            if (!C(e)) throw new TypeError("Usage: Buffer.concat(list[, length])");
            if (0 === e.length) return new n(0);
            if (1 === e.length) return e[0];
            var r;
            if (void 0 === t)
                for (t = 0, r = 0; r < e.length; r++) t += e[r].length;
            var i = new n(t),
                s = 0;
            for (r = 0; r < e.length; r++) {
                var o = e[r];
                o.copy(i, s), s += o.length
            }
            return i
        }, n.byteLength = function(e, t) {
            var r;
            switch (e += "", t || "utf8") {
                case "ascii":
                case "binary":
                case "raw":
                    r = e.length;
                    break;
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                    r = 2 * e.length;
                    break;
                case "hex":
                    r = e.length >>> 1;
                    break;
                case "utf8":
                case "utf-8":
                    r = x(e).length;
                    break;
                case "base64":
                    r = B(e).length;
                    break;
                default:
                    r = e.length
            }
            return r
        }, n.prototype.length = void 0, n.prototype.parent = void 0, n.prototype.toString = function(e, t, r) {
            var n = !1;
            if (t >>>= 0, r = void 0 === r || 1 / 0 === r ? this.length : r >>> 0, e || (e = "utf8"), 0 > t && (t = 0), r > this.length && (r = this.length), t >= r) return "";
            for (;;) switch (e) {
                case "hex":
                    return l(this, t, r);
                case "utf8":
                case "utf-8":
                    return d(this, t, r);
                case "ascii":
                    return h(this, t, r);
                case "binary":
                    return p(this, t, r);
                case "base64":
                    return u(this, t, r);
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                    return b(this, t, r);
                default:
                    if (n) throw new TypeError("Unknown encoding: " + e);
                    e = (e + "").toLowerCase(), n = !0
            }
        }, n.prototype.equals = function(e) {
            if (!n.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
            return 0 === n.compare(this, e)
        }, n.prototype.inspect = function() {
            var e = "",
                t = r.INSPECT_MAX_BYTES;
            return this.length > 0 && (e = this.toString("hex", 0, t).match(/.{2}/g).join(" "), this.length > t && (e += " ... ")), "<Buffer " + e + ">"
        }, n.prototype.compare = function(e) {
            if (!n.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
            return n.compare(this, e)
        }, n.prototype.get = function(e) {
            return console.log(".get() is deprecated. Access using array indexes instead."), this.readUInt8(e)
        }, n.prototype.set = function(e, t) {
            return console.log(".set() is deprecated. Access using array indexes instead."), this.writeUInt8(e, t)
        }, n.prototype.write = function(e, t, r, n) {
            if (isFinite(t)) isFinite(r) || (n = r, r = void 0);
            else {
                var u = n;
                n = t, t = r, r = u
            }
            t = Number(t) || 0;
            var d = this.length - t;
            r ? (r = Number(r), r > d && (r = d)) : r = d, n = String(n || "utf8").toLowerCase();
            var h;
            switch (n) {
                case "hex":
                    h = i(this, e, t, r);
                    break;
                case "utf8":
                case "utf-8":
                    h = s(this, e, t, r);
                    break;
                case "ascii":
                    h = o(this, e, t, r);
                    break;
                case "binary":
                    h = a(this, e, t, r);
                    break;
                case "base64":
                    h = f(this, e, t, r);
                    break;
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                    h = c(this, e, t, r);
                    break;
                default:
                    throw new TypeError("Unknown encoding: " + n)
            }
            return h
        }, n.prototype.toJSON = function() {
            return {
                type: "Buffer",
                data: Array.prototype.slice.call(this._arr || this, 0)
            }
        }, n.prototype.slice = function(e, t) {
            var r = this.length;
            if (e = ~~e, t = void 0 === t ? r : ~~t, 0 > e ? (e += r, 0 > e && (e = 0)) : e > r && (e = r), 0 > t ? (t += r, 0 > t && (t = 0)) : t > r && (t = r), e > t && (t = e), n.TYPED_ARRAY_SUPPORT) return n._augment(this.subarray(e, t));
            for (var i = t - e, s = new n(i, void 0, !0), o = 0; i > o; o++) s[o] = this[o + e];
            return s
        }, n.prototype.readUInt8 = function(e, t) {
            return t || g(e, 1, this.length), this[e]
        }, n.prototype.readUInt16LE = function(e, t) {
            return t || g(e, 2, this.length), this[e] | this[e + 1] << 8
        }, n.prototype.readUInt16BE = function(e, t) {
            return t || g(e, 2, this.length), this[e] << 8 | this[e + 1]
        }, n.prototype.readUInt32LE = function(e, t) {
            return t || g(e, 4, this.length), (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + 16777216 * this[e + 3]
        }, n.prototype.readUInt32BE = function(e, t) {
            return t || g(e, 4, this.length), 16777216 * this[e] + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3])
        }, n.prototype.readInt8 = function(e, t) {
            return t || g(e, 1, this.length), 128 & this[e] ? -1 * (255 - this[e] + 1) : this[e]
        }, n.prototype.readInt16LE = function(e, t) {
            t || g(e, 2, this.length);
            var r = this[e] | this[e + 1] << 8;
            return 32768 & r ? 4294901760 | r : r
        }, n.prototype.readInt16BE = function(e, t) {
            t || g(e, 2, this.length);
            var r = this[e + 1] | this[e] << 8;
            return 32768 & r ? 4294901760 | r : r
        }, n.prototype.readInt32LE = function(e, t) {
            return t || g(e, 4, this.length), this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24
        }, n.prototype.readInt32BE = function(e, t) {
            return t || g(e, 4, this.length), this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]
        }, n.prototype.readFloatLE = function(e, t) {
            return t || g(e, 4, this.length), j.read(this, e, !0, 23, 4)
        }, n.prototype.readFloatBE = function(e, t) {
            return t || g(e, 4, this.length), j.read(this, e, !1, 23, 4)
        }, n.prototype.readDoubleLE = function(e, t) {
            return t || g(e, 8, this.length), j.read(this, e, !0, 52, 8)
        }, n.prototype.readDoubleBE = function(e, t) {
            return t || g(e, 8, this.length), j.read(this, e, !1, 52, 8)
        }, n.prototype.writeUInt8 = function(e, t, r) {
            return e = +e, t >>>= 0, r || y(this, e, t, 1, 255, 0), n.TYPED_ARRAY_SUPPORT || (e = Math.floor(e)), this[t] = e, t + 1
        }, n.prototype.writeUInt16LE = function(e, t, r) {
            return e = +e, t >>>= 0, r || y(this, e, t, 2, 65535, 0), n.TYPED_ARRAY_SUPPORT ? (this[t] = e, this[t + 1] = e >>> 8) : m(this, e, t, !0), t + 2
        }, n.prototype.writeUInt16BE = function(e, t, r) {
            return e = +e, t >>>= 0, r || y(this, e, t, 2, 65535, 0), n.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 8, this[t + 1] = e) : m(this, e, t, !1), t + 2
        }, n.prototype.writeUInt32LE = function(e, t, r) {
            return e = +e, t >>>= 0, r || y(this, e, t, 4, 4294967295, 0), n.TYPED_ARRAY_SUPPORT ? (this[t + 3] = e >>> 24, this[t + 2] = e >>> 16, this[t + 1] = e >>> 8, this[t] = e) : v(this, e, t, !0), t + 4
        }, n.prototype.writeUInt32BE = function(e, t, r) {
            return e = +e, t >>>= 0, r || y(this, e, t, 4, 4294967295, 0), n.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = e) : v(this, e, t, !1), t + 4
        }, n.prototype.writeInt8 = function(e, t, r) {
            return e = +e, t >>>= 0, r || y(this, e, t, 1, 127, -128), n.TYPED_ARRAY_SUPPORT || (e = Math.floor(e)), 0 > e && (e = 255 + e + 1), this[t] = e, t + 1
        }, n.prototype.writeInt16LE = function(e, t, r) {
            return e = +e, t >>>= 0, r || y(this, e, t, 2, 32767, -32768), n.TYPED_ARRAY_SUPPORT ? (this[t] = e, this[t + 1] = e >>> 8) : m(this, e, t, !0), t + 2
        }, n.prototype.writeInt16BE = function(e, t, r) {
            return e = +e, t >>>= 0, r || y(this, e, t, 2, 32767, -32768), n.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 8, this[t + 1] = e) : m(this, e, t, !1), t + 2
        }, n.prototype.writeInt32LE = function(e, t, r) {
            return e = +e, t >>>= 0, r || y(this, e, t, 4, 2147483647, -2147483648), n.TYPED_ARRAY_SUPPORT ? (this[t] = e, this[t + 1] = e >>> 8, this[t + 2] = e >>> 16, this[t + 3] = e >>> 24) : v(this, e, t, !0), t + 4
        }, n.prototype.writeInt32BE = function(e, t, r) {
            return e = +e, t >>>= 0, r || y(this, e, t, 4, 2147483647, -2147483648), 0 > e && (e = 4294967295 + e + 1), n.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = e) : v(this, e, t, !1), t + 4
        }, n.prototype.writeFloatLE = function(e, t, r) {
            return w(this, e, t, !0, r)
        }, n.prototype.writeFloatBE = function(e, t, r) {
            return w(this, e, t, !1, r)
        }, n.prototype.writeDoubleLE = function(e, t, r) {
            return S(this, e, t, !0, r)
        }, n.prototype.writeDoubleBE = function(e, t, r) {
            return S(this, e, t, !1, r)
        }, n.prototype.copy = function(e, t, r, i) {
            var s = this;
            if (r || (r = 0), i || 0 === i || (i = this.length), t || (t = 0), i !== r && 0 !== e.length && 0 !== s.length) {
                if (r > i) throw new TypeError("sourceEnd < sourceStart");
                if (0 > t || t >= e.length) throw new TypeError("targetStart out of bounds");
                if (0 > r || r >= s.length) throw new TypeError("sourceStart out of bounds");
                if (0 > i || i > s.length) throw new TypeError("sourceEnd out of bounds");
                i > this.length && (i = this.length), e.length - t < i - r && (i = e.length - t + r);
                var o = i - r;
                if (1e3 > o || !n.TYPED_ARRAY_SUPPORT)
                    for (var a = 0; o > a; a++) e[a + t] = this[a + r];
                else e._set(this.subarray(r, r + o), t)
            }
        }, n.prototype.fill = function(e, t, r) {
            if (e || (e = 0), t || (t = 0), r || (r = this.length), t > r) throw new TypeError("end < start");
            if (r !== t && 0 !== this.length) {
                if (0 > t || t >= this.length) throw new TypeError("start out of bounds");
                if (0 > r || r > this.length) throw new TypeError("end out of bounds");
                var n;
                if ("number" == typeof e)
                    for (n = t; r > n; n++) this[n] = e;
                else {
                    var i = x(e.toString()),
                        s = i.length;
                    for (n = t; r > n; n++) this[n] = i[n % s]
                }
                return this
            }
        }, n.prototype.toArrayBuffer = function() {
            if ("undefined" != typeof Uint8Array) {
                if (n.TYPED_ARRAY_SUPPORT) return new n(this).buffer;
                for (var e = new Uint8Array(this.length), t = 0, r = e.length; r > t; t += 1) e[t] = this[t];
                return e.buffer
            }
            throw new TypeError("Buffer.toArrayBuffer not supported in this browser")
        };
        var U = n.prototype;
        n._augment = function(e) {
            return e.constructor = n, e._isBuffer = !0, e._get = e.get, e._set = e.set, e.get = U.get, e.set = U.set, e.write = U.write, e.toString = U.toString, e.toLocaleString = U.toString, e.toJSON = U.toJSON, e.equals = U.equals, e.compare = U.compare, e.copy = U.copy, e.slice = U.slice, e.readUInt8 = U.readUInt8, e.readUInt16LE = U.readUInt16LE, e.readUInt16BE = U.readUInt16BE, e.readUInt32LE = U.readUInt32LE, e.readUInt32BE = U.readUInt32BE, e.readInt8 = U.readInt8, e.readInt16LE = U.readInt16LE, e.readInt16BE = U.readInt16BE, e.readInt32LE = U.readInt32LE, e.readInt32BE = U.readInt32BE, e.readFloatLE = U.readFloatLE, e.readFloatBE = U.readFloatBE, e.readDoubleLE = U.readDoubleLE, e.readDoubleBE = U.readDoubleBE, e.writeUInt8 = U.writeUInt8, e.writeUInt16LE = U.writeUInt16LE, e.writeUInt16BE = U.writeUInt16BE, e.writeUInt32LE = U.writeUInt32LE, e.writeUInt32BE = U.writeUInt32BE, e.writeInt8 = U.writeInt8, e.writeInt16LE = U.writeInt16LE, e.writeInt16BE = U.writeInt16BE, e.writeInt32LE = U.writeInt32LE, e.writeInt32BE = U.writeInt32BE, e.writeFloatLE = U.writeFloatLE, e.writeFloatBE = U.writeFloatBE, e.writeDoubleLE = U.writeDoubleLE, e.writeDoubleBE = U.writeDoubleBE, e.fill = U.fill, e.inspect = U.inspect, e.toArrayBuffer = U.toArrayBuffer, e
        };
        var z = /[^+\/0-9A-z]/g
    }, {
        "base64-js": 44,
        ieee754: 45,
        "is-array": 46
    }],
    44: [function(e, t, r) {
        var n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        ! function(e) {
            "use strict";

            function t(e) {
                var t = e.charCodeAt(0);
                return t === o ? 62 : t === a ? 63 : f > t ? -1 : f + 10 > t ? t - f + 26 + 26 : u + 26 > t ? t - u : c + 26 > t ? t - c + 26 : void 0
            }

            function r(e) {
                function r(e) {
                    c[d++] = e
                }
                var n, i, o, a, f, c;
                if (e.length % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
                var u = e.length;
                f = "=" === e.charAt(u - 2) ? 2 : "=" === e.charAt(u - 1) ? 1 : 0, c = new s(3 * e.length / 4 - f), o = f > 0 ? e.length - 4 : e.length;
                var d = 0;
                for (n = 0, i = 0; o > n; n += 4, i += 3) a = t(e.charAt(n)) << 18 | t(e.charAt(n + 1)) << 12 | t(e.charAt(n + 2)) << 6 | t(e.charAt(n + 3)), r((16711680 & a) >> 16), r((65280 & a) >> 8), r(255 & a);
                return 2 === f ? (a = t(e.charAt(n)) << 2 | t(e.charAt(n + 1)) >> 4, r(255 & a)) : 1 === f && (a = t(e.charAt(n)) << 10 | t(e.charAt(n + 1)) << 4 | t(e.charAt(n + 2)) >> 2, r(a >> 8 & 255), r(255 & a)), c
            }

            function i(e) {
                function t(e) {
                    return n.charAt(e)
                }

                function r(e) {
                    return t(e >> 18 & 63) + t(e >> 12 & 63) + t(e >> 6 & 63) + t(63 & e)
                }
                var i, s, o, a = e.length % 3,
                    f = "";
                for (i = 0, o = e.length - a; o > i; i += 3) s = (e[i] << 16) + (e[i + 1] << 8) + e[i + 2], f += r(s);
                switch (a) {
                    case 1:
                        s = e[e.length - 1], f += t(s >> 2), f += t(s << 4 & 63), f += "==";
                        break;
                    case 2:
                        s = (e[e.length - 2] << 8) + e[e.length - 1], f += t(s >> 10), f += t(s >> 4 & 63), f += t(s << 2 & 63), f += "="
                }
                return f
            }
            var s = "undefined" != typeof Uint8Array ? Uint8Array : Array,
                o = "+".charCodeAt(0),
                a = "/".charCodeAt(0),
                f = "0".charCodeAt(0),
                c = "a".charCodeAt(0),
                u = "A".charCodeAt(0);
            e.toByteArray = r, e.fromByteArray = i
        }("undefined" == typeof r ? this.base64js = {} : r)
    }, {}],
    45: [function(e, t, r) {
        r.read = function(e, t, r, n, i) {
            var s, o, a = 8 * i - n - 1,
                f = (1 << a) - 1,
                c = f >> 1,
                u = -7,
                d = r ? i - 1 : 0,
                h = r ? -1 : 1,
                p = e[t + d];
            for (d += h, s = p & (1 << -u) - 1, p >>= -u, u += a; u > 0; s = 256 * s + e[t + d], d += h, u -= 8);
            for (o = s & (1 << -u) - 1, s >>= -u, u += n; u > 0; o = 256 * o + e[t + d], d += h, u -= 8);
            if (0 === s) s = 1 - c;
            else {
                if (s === f) return o ? 0 / 0 : 1 / 0 * (p ? -1 : 1);
                o += Math.pow(2, n), s -= c
            }
            return (p ? -1 : 1) * o * Math.pow(2, s - n)
        }, r.write = function(e, t, r, n, i, s) {
            var o, a, f, c = 8 * s - i - 1,
                u = (1 << c) - 1,
                d = u >> 1,
                h = 23 === i ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
                p = n ? 0 : s - 1,
                l = n ? 1 : -1,
                b = 0 > t || 0 === t && 0 > 1 / t ? 1 : 0;
            for (t = Math.abs(t), isNaN(t) || 1 / 0 === t ? (a = isNaN(t) ? 1 : 0, o = u) : (o = Math.floor(Math.log(t) / Math.LN2), t * (f = Math.pow(2, -o)) < 1 && (o--, f *= 2), t += o + d >= 1 ? h / f : h * Math.pow(2, 1 - d), t * f >= 2 && (o++, f /= 2), o + d >= u ? (a = 0, o = u) : o + d >= 1 ? (a = (t * f - 1) * Math.pow(2, i), o += d) : (a = t * Math.pow(2, d - 1) * Math.pow(2, i), o = 0)); i >= 8; e[r + p] = 255 & a, p += l, a /= 256, i -= 8);
            for (o = o << i | a, c += i; c > 0; e[r + p] = 255 & o, p += l, o /= 256, c -= 8);
            e[r + p - l] |= 128 * b
        }
    }, {}],
    46: [function(e, t) {
        var r = Array.isArray,
            n = Object.prototype.toString;
        t.exports = r || function(e) {
            return !!e && "[object Array]" == n.call(e)
        }
    }, {}],
    47: [function(e, t, r) {
        "use strict";

        function n() {
            var e = [].slice.call(arguments).join(" ");
            throw new Error([e, "we accept pull requests", "http://github.com/dominictarr/crypto-browserify"].join("\n"))
        }

        function i(e, t) {
            for (var r in e) t(e[r], r)
        }
        r.randomBytes = r.rng = e("randombytes");
        var s = r.prng = e("./prng");
        r.createHash = r.Hash = e("create-hash"), r.createHmac = r.Hmac = e("create-hmac"), r.pseudoRandomBytes = function(e, t) {
            if (!t || !t.call) return s(e);
            var r;
            try {
                r = s(e)
            } catch (n) {
                return t(n)
            }
            t.call(this, void 0, r)
        };
        var o = ["sha1", "sha224", "sha256", "sha384", "sha512", "md5", "rmd160"].concat(Object.keys(e("browserify-sign/algos")));
        r.getHashes = function() {
            return o
        };
        var a = e("./pbkdf2")(r);
        r.pbkdf2 = a.pbkdf2, r.pbkdf2Sync = a.pbkdf2Sync;
        var f = e("browserify-aes");
        ["Cipher", "createCipher", "Cipheriv", "createCipheriv", "Decipher", "createDecipher", "Decipheriv", "createDecipheriv", "getCiphers", "listCiphers"].forEach(function(e) {
            r[e] = f[e]
        }), e("browserify-sign/inject")(t.exports, r), e("diffie-hellman/inject")(r, t.exports), e("create-ecdh/inject")(t.exports, r), e("public-encrypt/inject")(t.exports, r), i(["createCredentials"], function(e) {
            r[e] = function() {
                n("sorry,", e, "is not implemented yet")
            }
        })
    }, {
        "./pbkdf2": 183,
        "./prng": 184,
        "browserify-aes": 51,
        "browserify-sign/algos": 66,
        "browserify-sign/inject": 67,
        "create-ecdh/inject": 113,
        "create-hash": 135,
        "create-hmac": 146,
        "diffie-hellman/inject": 149,
        "public-encrypt/inject": 155,
        randombytes: 182
    }],
    48: [function(e, t) {
        (function(r) {
            function n(e, t, n) {
                r.isBuffer(e) || (e = new r(e, "binary")), t /= 8, n = n || 0;
                for (var s, o, a = 0, f = 0, c = new r(t), u = new r(n), d = 0, h = [];;) {
                    if (d++ > 0 && h.push(s), h.push(e), s = i(r.concat(h)), h = [], o = 0, t > 0)
                        for (;;) {
                            if (0 === t) break;
                            if (o === s.length) break;
                            c[a++] = s[o], t--, o++
                        }
                    if (n > 0 && o !== s.length)
                        for (;;) {
                            if (0 === n) break;
                            if (o === s.length) break;
                            u[f++] = s[o], n--, o++
                        }
                    if (0 === t && 0 === n) break
                }
                for (o = 0; o < s.length; o++) s[o] = 0;
                return {
                    key: c,
                    iv: u
                }
            }
            var i = e("create-hash/md5");
            t.exports = n
        }).call(this, e("buffer").Buffer)
    }, {
        buffer: 43,
        "create-hash/md5": 137
    }],
    49: [function(e, t, r) {
        (function(e) {
            function t(e) {
                var t, r;
                return t = e > a || 0 > e ? (r = Math.abs(e) % a, 0 > e ? a - r : r) : e
            }

            function n(e) {
                var t, r, n;
                for (t = r = 0, n = e.length; n >= 0 ? n > r : r > n; t = n >= 0 ? ++r : --r) e[t] = 0;
                return !1
            }

            function i() {
                var e;
                this.SBOX = [], this.INV_SBOX = [], this.SUB_MIX = function() {
                    var t, r;
                    for (r = [], e = t = 0; 4 > t; e = ++t) r.push([]);
                    return r
                }(), this.INV_SUB_MIX = function() {
                    var t, r;
                    for (r = [], e = t = 0; 4 > t; e = ++t) r.push([]);
                    return r
                }(), this.init(), this.RCON = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54]
            }

            function s(e) {
                for (var t = e.length / 4, r = new Array(t), n = -1; ++n < t;) r[n] = e.readUInt32BE(4 * n);
                return r
            }

            function o(e) {
                this._key = s(e), this._doReset()
            }
            var a = Math.pow(2, 32);
            i.prototype.init = function() {
                var e, t, r, n, i, s, o, a, f, c;
                for (e = function() {
                        var e, r;
                        for (r = [], t = e = 0; 256 > e; t = ++e) r.push(128 > t ? t << 1 : t << 1 ^ 283);
                        return r
                    }(), i = 0, f = 0, t = c = 0; 256 > c; t = ++c) r = f ^ f << 1 ^ f << 2 ^ f << 3 ^ f << 4, r = r >>> 8 ^ 255 & r ^ 99, this.SBOX[i] = r, this.INV_SBOX[r] = i, s = e[i], o = e[s], a = e[o], n = 257 * e[r] ^ 16843008 * r, this.SUB_MIX[0][i] = n << 24 | n >>> 8, this.SUB_MIX[1][i] = n << 16 | n >>> 16, this.SUB_MIX[2][i] = n << 8 | n >>> 24, this.SUB_MIX[3][i] = n, n = 16843009 * a ^ 65537 * o ^ 257 * s ^ 16843008 * i, this.INV_SUB_MIX[0][r] = n << 24 | n >>> 8, this.INV_SUB_MIX[1][r] = n << 16 | n >>> 16, this.INV_SUB_MIX[2][r] = n << 8 | n >>> 24, this.INV_SUB_MIX[3][r] = n, 0 === i ? i = f = 1 : (i = s ^ e[e[e[a ^ s]]], f ^= e[e[f]]);
                return !0
            };
            var f = new i;
            o.blockSize = 16, o.prototype.blockSize = o.blockSize, o.keySize = 32, o.prototype.keySize = o.keySize, o.prototype._doReset = function() {
                var e, t, r, n, i, s, o, a;
                for (r = this._key, t = r.length, this._nRounds = t + 6, i = 4 * (this._nRounds + 1), this._keySchedule = [], n = o = 0; i >= 0 ? i > o : o > i; n = i >= 0 ? ++o : --o) this._keySchedule[n] = t > n ? r[n] : (s = this._keySchedule[n - 1], n % t === 0 ? (s = s << 8 | s >>> 24, s = f.SBOX[s >>> 24] << 24 | f.SBOX[s >>> 16 & 255] << 16 | f.SBOX[s >>> 8 & 255] << 8 | f.SBOX[255 & s], s ^= f.RCON[n / t | 0] << 24) : t > 6 && n % t === 4 ? s = f.SBOX[s >>> 24] << 24 | f.SBOX[s >>> 16 & 255] << 16 | f.SBOX[s >>> 8 & 255] << 8 | f.SBOX[255 & s] : void 0, this._keySchedule[n - t] ^ s);
                for (this._invKeySchedule = [], e = a = 0; i >= 0 ? i > a : a > i; e = i >= 0 ? ++a : --a) n = i - e, s = this._keySchedule[n - (e % 4 ? 0 : 4)], this._invKeySchedule[e] = 4 > e || 4 >= n ? s : f.INV_SUB_MIX[0][f.SBOX[s >>> 24]] ^ f.INV_SUB_MIX[1][f.SBOX[s >>> 16 & 255]] ^ f.INV_SUB_MIX[2][f.SBOX[s >>> 8 & 255]] ^ f.INV_SUB_MIX[3][f.SBOX[255 & s]];
                return !0
            }, o.prototype.encryptBlock = function(t) {
                t = s(new e(t));
                var r = this._doCryptBlock(t, this._keySchedule, f.SUB_MIX, f.SBOX),
                    n = new e(16);
                return n.writeUInt32BE(r[0], 0), n.writeUInt32BE(r[1], 4), n.writeUInt32BE(r[2], 8), n.writeUInt32BE(r[3], 12), n
            }, o.prototype.decryptBlock = function(t) {
                t = s(new e(t));
                var r = [t[3], t[1]];
                t[1] = r[0], t[3] = r[1];
                var n = this._doCryptBlock(t, this._invKeySchedule, f.INV_SUB_MIX, f.INV_SBOX),
                    i = new e(16);
                return i.writeUInt32BE(n[0], 0), i.writeUInt32BE(n[3], 4), i.writeUInt32BE(n[2], 8), i.writeUInt32BE(n[1], 12), i
            }, o.prototype.scrub = function() {
                n(this._keySchedule), n(this._invKeySchedule), n(this._key)
            }, o.prototype._doCryptBlock = function(e, r, n, i) {
                var s, o, a, f, c, u, d, h, p, l, b, g;
                for (a = e[0] ^ r[0], f = e[1] ^ r[1], c = e[2] ^ r[2], u = e[3] ^ r[3], s = 4, o = b = 1, g = this._nRounds; g >= 1 ? g > b : b > g; o = g >= 1 ? ++b : --b) d = n[0][a >>> 24] ^ n[1][f >>> 16 & 255] ^ n[2][c >>> 8 & 255] ^ n[3][255 & u] ^ r[s++], h = n[0][f >>> 24] ^ n[1][c >>> 16 & 255] ^ n[2][u >>> 8 & 255] ^ n[3][255 & a] ^ r[s++], p = n[0][c >>> 24] ^ n[1][u >>> 16 & 255] ^ n[2][a >>> 8 & 255] ^ n[3][255 & f] ^ r[s++], l = n[0][u >>> 24] ^ n[1][a >>> 16 & 255] ^ n[2][f >>> 8 & 255] ^ n[3][255 & c] ^ r[s++], a = d, f = h, c = p, u = l;
                return d = (i[a >>> 24] << 24 | i[f >>> 16 & 255] << 16 | i[c >>> 8 & 255] << 8 | i[255 & u]) ^ r[s++], h = (i[f >>> 24] << 24 | i[c >>> 16 & 255] << 16 | i[u >>> 8 & 255] << 8 | i[255 & a]) ^ r[s++], p = (i[c >>> 24] << 24 | i[u >>> 16 & 255] << 16 | i[a >>> 8 & 255] << 8 | i[255 & f]) ^ r[s++], l = (i[u >>> 24] << 24 | i[a >>> 16 & 255] << 16 | i[f >>> 8 & 255] << 8 | i[255 & c]) ^ r[s++], [t(d), t(h), t(p), t(l)]
            }, r.AES = o
        }).call(this, e("buffer").Buffer)
    }, {
        buffer: 43
    }],
    50: [function(e, t) {
        (function(r) {
            function n(e, t, i, a) {
                if (!(this instanceof n)) return new n(e, t, i);
                o.call(this), this._finID = r.concat([i, new r([0, 0, 0, 1])]), i = r.concat([i, new r([0, 0, 0, 2])]), this._cipher = new s.AES(t), this._prev = new r(i.length), this._cache = new r(""), this._secCache = new r(""), this._decrypt = a, this._alen = 0, this._len = 0, i.copy(this._prev), this._mode = e;
                var c = new r(4);
                c.fill(0), this._ghash = new f(this._cipher.encryptBlock(c)), this._authTag = null, this._called = !1
            }

            function i(e, t) {
                var r = 0;
                e.length !== t.length && r++;
                for (var n = Math.min(e.length, t.length), i = -1; ++i < n;) r += e[i] ^ t[i];
                return r
            }
            var s = e("./aes"),
                o = e("./cipherBase"),
                a = e("inherits"),
                f = e("./ghash"),
                c = e("./xor");
            a(n, o), t.exports = n, n.prototype._update = function(e) {
                if (!this._called && this._alen) {
                    var t = 16 - this._alen % 16;
                    16 > t && (t = new r(t), t.fill(0), this._ghash.update(t))
                }
                this._called = !0;
                var n = this._mode.encrypt(this, e);
                return this._ghash.update(this._decrypt ? e : n), this._len += e.length, n
            }, n.prototype._final = function() {
                if (this._decrypt && !this._authTag) throw new Error("Unsupported state or unable to authenticate data");
                var e = c(this._ghash["final"](8 * this._alen, 8 * this._len), this._cipher.encryptBlock(this._finID));
                if (this._decrypt) {
                    if (i(e, this._authTag)) throw new Error("Unsupported state or unable to authenticate data")
                } else this._authTag = e;
                this._cipher.scrub()
            }, n.prototype.getAuthTag = function() {
                if (!this._decrypt && r.isBuffer(this._authTag)) return this._authTag;
                throw new Error("Attempting to get auth tag in unsupported state")
            }, n.prototype.setAuthTag = function(e) {
                if (!this._decrypt) throw new Error("Attempting to set auth tag in unsupported state");
                this._authTag = e
            }, n.prototype.setAAD = function(e) {
                if (this._called) throw new Error("Attempting to set AAD in unsupported state");
                this._ghash.update(e), this._alen += e.length
            }
        }).call(this, e("buffer").Buffer)
    }, {
        "./aes": 49,
        "./cipherBase": 52,
        "./ghash": 55,
        "./xor": 65,
        buffer: 43,
        inherits: 232
    }],
    51: [function(e, t, r) {
        function n() {
            return Object.keys(o)
        }
        var i = e("./encrypter");
        r.createCipher = r.Cipher = i.createCipher, r.createCipheriv = r.Cipheriv = i.createCipheriv;
        var s = e("./decrypter");
        r.createDecipher = r.Decipher = s.createDecipher, r.createDecipheriv = r.Decipheriv = s.createDecipheriv;
        var o = e("./modes");
        r.listCiphers = r.getCiphers = n
    }, {
        "./decrypter": 53,
        "./encrypter": 54,
        "./modes": 56
    }],
    52: [function(e, t) {
        (function(r) {
            function n() {
                i.call(this)
            }
            var i = e("stream").Transform,
                s = e("inherits");
            t.exports = n, s(n, i), n.prototype.update = function(e, t, n) {
                "string" == typeof e && (e = new r(e, t));
                var i = this._update(e);
                return n && (i = i.toString(n)), i
            }, n.prototype._transform = function(e, t, r) {
                this.push(this._update(e)), r()
            }, n.prototype._flush = function(e) {
                try {
                    this.push(this._final())
                } catch (t) {
                    return e(t)
                }
                e()
            }, n.prototype["final"] = function(e) {
                var t = this._final() || new r("");
                return e && (t = t.toString(e)), t
            }
        }).call(this, e("buffer").Buffer)
    }, {
        buffer: 43,
        inherits: 232,
        stream: 203
    }],
    53: [function(e, t, r) {
        (function(t) {
            function n(e, r, s) {
                return this instanceof n ? (c.call(this), this._cache = new i, this._last = void 0, this._cipher = new f.AES(r), this._prev = new t(s.length), s.copy(this._prev), this._mode = e, void(this._autopadding = !0)) : new n(e, r, s)
            }

            function i() {
                return this instanceof i ? void(this.cache = new t("")) : new i
            }

            function s(e) {
                for (var t = e[15], r = -1; ++r < t;)
                    if (e[r + (16 - t)] !== t) throw new Error("unable to decrypt data");
                return 16 !== t ? e.slice(0, 16 - t) : void 0
            }

            function o(e, r, i) {
                var s = d[e.toLowerCase()];
                if (!s) throw new TypeError("invalid suite type");
                if ("string" == typeof i && (i = new t(i)), "string" == typeof r && (r = new t(r)), r.length !== s.key / 8) throw new TypeError("invalid key length " + r.length);
                if (i.length !== s.iv) throw new TypeError("invalid iv length " + i.length);
                return "stream" === s.type ? new h(b[s.mode], r, i, !0) : "auth" === s.type ? new p(b[s.mode], r, i, !0) : new n(b[s.mode], r, i)
            }

            function a(e, t) {
                var r = d[e.toLowerCase()];
                if (!r) throw new TypeError("invalid suite type");
                var n = l(t, r.key, r.iv);
                return o(e, n.key, n.iv)
            }
            var f = e("./aes"),
                c = e("./cipherBase"),
                u = e("inherits"),
                d = e("./modes"),
                h = e("./streamCipher"),
                p = e("./authCipher"),
                l = e("./EVP_BytesToKey");
            u(n, c), n.prototype._update = function(e) {
                this._cache.add(e);
                for (var r, n, i = []; r = this._cache.get(this._autopadding);) n = this._mode.decrypt(this, r), i.push(n);
                return t.concat(i)
            }, n.prototype._final = function() {
                var e = this._cache.flush();
                if (this._autopadding) return s(this._mode.decrypt(this, e));
                if (e) throw new Error("data not multiple of block length")
            }, n.prototype.setAutoPadding = function(e) {
                this._autopadding = !!e
            }, i.prototype.add = function(e) {
                this.cache = t.concat([this.cache, e])
            }, i.prototype.get = function(e) {
                var t;
                if (e) {
                    if (this.cache.length > 16) return t = this.cache.slice(0, 16), this.cache = this.cache.slice(16), t
                } else if (this.cache.length >= 16) return t = this.cache.slice(0, 16), this.cache = this.cache.slice(16), t;
                return null
            }, i.prototype.flush = function() {
                return this.cache.length ? this.cache : void 0
            };
            var b = {
                ECB: e("./modes/ecb"),
                CBC: e("./modes/cbc"),
                CFB: e("./modes/cfb"),
                CFB8: e("./modes/cfb8"),
                CFB1: e("./modes/cfb1"),
                OFB: e("./modes/ofb"),
                CTR: e("./modes/ctr"),
                GCM: e("./modes/ctr")
            };
            r.createDecipher = a, r.createDecipheriv = o
        }).call(this, e("buffer").Buffer)
    }, {
        "./EVP_BytesToKey": 48,
        "./aes": 49,
        "./authCipher": 50,
        "./cipherBase": 52,
        "./modes": 56,
        "./modes/cbc": 57,
        "./modes/cfb": 58,
        "./modes/cfb1": 59,
        "./modes/cfb8": 60,
        "./modes/ctr": 61,
        "./modes/ecb": 62,
        "./modes/ofb": 63,
        "./streamCipher": 64,
        buffer: 43,
        inherits: 232
    }],
    54: [function(e, t, r) {
        (function(t) {
            function n(e, r, s) {
                return this instanceof n ? (f.call(this), this._cache = new i, this._cipher = new a.AES(r), this._prev = new t(s.length), s.copy(this._prev), this._mode = e, void(this._autopadding = !0)) : new n(e, r, s)
            }

            function i() {
                return this instanceof i ? void(this.cache = new t("")) : new i
            }

            function s(e, r, i) {
                var s = u[e.toLowerCase()];
                if (!s) throw new TypeError("invalid suite type");
                if ("string" == typeof i && (i = new t(i)), "string" == typeof r && (r = new t(r)), r.length !== s.key / 8) throw new TypeError("invalid key length " + r.length);
                if (i.length !== s.iv) throw new TypeError("invalid iv length " + i.length);
                return "stream" === s.type ? new h(l[s.mode], r, i) : "auth" === s.type ? new p(l[s.mode], r, i) : new n(l[s.mode], r, i)
            }

            function o(e, t) {
                var r = u[e.toLowerCase()];
                if (!r) throw new TypeError("invalid suite type");
                var n = d(t, r.key, r.iv);
                return s(e, n.key, n.iv)
            }
            var a = e("./aes"),
                f = e("./cipherBase"),
                c = e("inherits"),
                u = e("./modes"),
                d = e("./EVP_BytesToKey"),
                h = e("./streamCipher"),
                p = e("./authCipher");
            c(n, f), n.prototype._update = function(e) {
                this._cache.add(e);
                for (var r, n, i = []; r = this._cache.get();) n = this._mode.encrypt(this, r), i.push(n);
                return t.concat(i)
            }, n.prototype._final = function() {
                var e = this._cache.flush();
                if (this._autopadding) return e = this._mode.encrypt(this, e), this._cipher.scrub(), e;
                if ("10101010101010101010101010101010" !== e.toString("hex")) throw this._cipher.scrub(), new Error("data not multiple of block length")
            }, n.prototype.setAutoPadding = function(e) {
                this._autopadding = !!e
            }, i.prototype.add = function(e) {
                this.cache = t.concat([this.cache, e])
            }, i.prototype.get = function() {
                if (this.cache.length > 15) {
                    var e = this.cache.slice(0, 16);
                    return this.cache = this.cache.slice(16), e
                }
                return null
            }, i.prototype.flush = function() {
                for (var e = 16 - this.cache.length, r = new t(e), n = -1; ++n < e;) r.writeUInt8(e, n);
                var i = t.concat([this.cache, r]);
                return i
            };
            var l = {
                ECB: e("./modes/ecb"),
                CBC: e("./modes/cbc"),
                CFB: e("./modes/cfb"),
                CFB8: e("./modes/cfb8"),
                CFB1: e("./modes/cfb1"),
                OFB: e("./modes/ofb"),
                CTR: e("./modes/ctr"),
                GCM: e("./modes/ctr")
            };
            r.createCipheriv = s, r.createCipher = o
        }).call(this, e("buffer").Buffer)
    }, {
        "./EVP_BytesToKey": 48,
        "./aes": 49,
        "./authCipher": 50,
        "./cipherBase": 52,
        "./modes": 56,
        "./modes/cbc": 57,
        "./modes/cfb": 58,
        "./modes/cfb1": 59,
        "./modes/cfb8": 60,
        "./modes/ctr": 61,
        "./modes/ecb": 62,
        "./modes/ofb": 63,
        "./streamCipher": 64,
        buffer: 43,
        inherits: 232
    }],
    55: [function(e, t) {
        (function(e) {
            function r(t) {
                this.h = t, this.state = new e(16), this.state.fill(0), this.cache = new e("")
            }

            function n(e) {
                return [e.readUInt32BE(0), e.readUInt32BE(4), e.readUInt32BE(8), e.readUInt32BE(12)]
            }

            function i(t) {
                t = t.map(s);
                var r = new e(16);
                return r.writeUInt32BE(t[0], 0), r.writeUInt32BE(t[1], 4), r.writeUInt32BE(t[2], 8), r.writeUInt32BE(t[3], 12), r
            }

            function s(e) {
                var t, r;
                return t = e > f || 0 > e ? (r = Math.abs(e) % f, 0 > e ? f - r : r) : e
            }

            function o(e, t) {
                return [e[0] ^ t[0], e[1] ^ t[1], e[2] ^ t[2], e[3] ^ t[3]]
            }
            var a = new e(16);
            a.fill(0), t.exports = r, r.prototype.ghash = function(e) {
                for (var t = -1; ++t < e.length;) this.state[t] ^= e[t];
                this._multiply()
            }, r.prototype._multiply = function() {
                for (var e, t, r, s = n(this.h), a = [0, 0, 0, 0], f = -1; ++f < 128;) {
                    for (t = 0 !== (this.state[~~(f / 8)] & 1 << 7 - f % 8), t && (a = o(a, s)), r = 0 !== (1 & s[3]), e = 3; e > 0; e--) s[e] = s[e] >>> 1 | (1 & s[e - 1]) << 31;
                    s[0] = s[0] >>> 1, r && (s[0] = s[0] ^ 225 << 24)
                }
                this.state = i(a)
            }, r.prototype.update = function(t) {
                this.cache = e.concat([this.cache, t]);
                for (var r; this.cache.length >= 16;) r = this.cache.slice(0, 16), this.cache = this.cache.slice(16), this.ghash(r)
            }, r.prototype["final"] = function(t, r) {
                return this.cache.length && this.ghash(e.concat([this.cache, a], 16)), this.ghash(i([0, t, 0, r])), this.state
            };
            var f = Math.pow(2, 32)
        }).call(this, e("buffer").Buffer)
    }, {
        buffer: 43
    }],
    56: [function(e, t, r) {
        r["aes-128-ecb"] = {
            cipher: "AES",
            key: 128,
            iv: 0,
            mode: "ECB",
            type: "block"
        }, r["aes-192-ecb"] = {
            cipher: "AES",
            key: 192,
            iv: 0,
            mode: "ECB",
            type: "block"
        }, r["aes-256-ecb"] = {
            cipher: "AES",
            key: 256,
            iv: 0,
            mode: "ECB",
            type: "block"
        }, r["aes-128-cbc"] = {
            cipher: "AES",
            key: 128,
            iv: 16,
            mode: "CBC",
            type: "block"
        }, r["aes-192-cbc"] = {
            cipher: "AES",
            key: 192,
            iv: 16,
            mode: "CBC",
            type: "block"
        }, r["aes-256-cbc"] = {
            cipher: "AES",
            key: 256,
            iv: 16,
            mode: "CBC",
            type: "block"
        }, r.aes128 = r["aes-128-cbc"], r.aes192 = r["aes-192-cbc"], r.aes256 = r["aes-256-cbc"], r["aes-128-cfb"] = {
            cipher: "AES",
            key: 128,
            iv: 16,
            mode: "CFB",
            type: "stream"
        }, r["aes-192-cfb"] = {
            cipher: "AES",
            key: 192,
            iv: 16,
            mode: "CFB",
            type: "stream"
        }, r["aes-256-cfb"] = {
            cipher: "AES",
            key: 256,
            iv: 16,
            mode: "CFB",
            type: "stream"
        }, r["aes-128-cfb8"] = {
            cipher: "AES",
            key: 128,
            iv: 16,
            mode: "CFB8",
            type: "stream"
        }, r["aes-192-cfb8"] = {
            cipher: "AES",
            key: 192,
            iv: 16,
            mode: "CFB8",
            type: "stream"
        }, r["aes-256-cfb8"] = {
            cipher: "AES",
            key: 256,
            iv: 16,
            mode: "CFB8",
            type: "stream"
        }, r["aes-128-cfb1"] = {
            cipher: "AES",
            key: 128,
            iv: 16,
            mode: "CFB1",
            type: "stream"
        }, r["aes-192-cfb1"] = {
            cipher: "AES",
            key: 192,
            iv: 16,
            mode: "CFB1",
            type: "stream"
        }, r["aes-256-cfb1"] = {
            cipher: "AES",
            key: 256,
            iv: 16,
            mode: "CFB1",
            type: "stream"
        }, r["aes-128-ofb"] = {
            cipher: "AES",
            key: 128,
            iv: 16,
            mode: "OFB",
            type: "stream"
        }, r["aes-192-ofb"] = {
            cipher: "AES",
            key: 192,
            iv: 16,
            mode: "OFB",
            type: "stream"
        }, r["aes-256-ofb"] = {
            cipher: "AES",
            key: 256,
            iv: 16,
            mode: "OFB",
            type: "stream"
        }, r["aes-128-ctr"] = {
            cipher: "AES",
            key: 128,
            iv: 16,
            mode: "CTR",
            type: "stream"
        }, r["aes-192-ctr"] = {
            cipher: "AES",
            key: 192,
            iv: 16,
            mode: "CTR",
            type: "stream"
        }, r["aes-256-ctr"] = {
            cipher: "AES",
            key: 256,
            iv: 16,
            mode: "CTR",
            type: "stream"
        }, r["aes-128-gcm"] = {
            cipher: "AES",
            key: 128,
            iv: 12,
            mode: "GCM",
            type: "auth"
        }, r["aes-192-gcm"] = {
            cipher: "AES",
            key: 192,
            iv: 12,
            mode: "GCM",
            type: "auth"
        }, r["aes-256-gcm"] = {
            cipher: "AES",
            key: 256,
            iv: 12,
            mode: "GCM",
            type: "auth"
        }
    }, {}],
    57: [function(e, t, r) {
        var n = e("../xor");
        r.encrypt = function(e, t) {
            var r = n(t, e._prev);
            return e._prev = e._cipher.encryptBlock(r), e._prev
        }, r.decrypt = function(e, t) {
            var r = e._prev;
            e._prev = t;
            var i = e._cipher.decryptBlock(t);
            return n(i, r)
        }
    }, {
        "../xor": 65
    }],
    58: [function(e, t, r) {
        (function(t) {
            function n(e, r, n) {
                var s = r.length,
                    o = i(r, e._cache);
                return e._cache = e._cache.slice(s), e._prev = t.concat([e._prev, n ? r : o]), o
            }
            var i = e("../xor");
            r.encrypt = function(e, r, i) {
                for (var s, o = new t(""); r.length;) {
                    if (0 === e._cache.length && (e._cache = e._cipher.encryptBlock(e._prev), e._prev = new t("")), !(e._cache.length <= r.length)) {
                        o = t.concat([o, n(e, r, i)]);
                        break
                    }
                    s = e._cache.length, o = t.concat([o, n(e, r.slice(0, s), i)]), r = r.slice(s)
                }
                return o
            }
        }).call(this, e("buffer").Buffer)
    }, {
        "../xor": 65,
        buffer: 43
    }],
    59: [function(e, t, r) {
        (function(e) {
            function t(e, t, r) {
                for (var i, s, o, a = -1, f = 8, c = 0; ++a < f;) i = e._cipher.encryptBlock(e._prev), s = t & 1 << 7 - a ? 128 : 0, o = i[0] ^ s, c += (128 & o) >> a % 8, e._prev = n(e._prev, r ? s : o);
                return c
            }

            function n(t, r) {
                var n = t.length,
                    i = -1,
                    s = new e(t.length);
                for (t = e.concat([t, new e([r])]); ++i < n;) s[i] = t[i] << 1 | t[i + 1] >> 7;
                return s
            }
            r.encrypt = function(r, n, i) {
                for (var s = n.length, o = new e(s), a = -1; ++a < s;) o[a] = t(r, n[a], i);
                return o
            }
        }).call(this, e("buffer").Buffer)
    }, {
        buffer: 43
    }],
    60: [function(e, t, r) {
        (function(e) {
            function t(t, r, n) {
                var i = t._cipher.encryptBlock(t._prev),
                    s = i[0] ^ r;
                return t._prev = e.concat([t._prev.slice(1), new e([n ? r : s])]), s
            }
            r.encrypt = function(r, n, i) {
                for (var s = n.length, o = new e(s), a = -1; ++a < s;) o[a] = t(r, n[a], i);
                return o
            }
        }).call(this, e("buffer").Buffer)
    }, {
        buffer: 43
    }],
    61: [function(e, t, r) {
        (function(t) {
            function n(e) {
                var t = e._cipher.encryptBlock(e._prev);
                return i(e._prev), t
            }

            function i(e) {
                for (var t, r = e.length; r--;) {
                    if (t = e.readUInt8(r), 255 !== t) {
                        t++, e.writeUInt8(t, r);
                        break
                    }
                    e.writeUInt8(0, r)
                }
            }
            var s = e("../xor");
            r.encrypt = function(e, r) {
                for (; e._cache.length < r.length;) e._cache = t.concat([e._cache, n(e)]);
                var i = e._cache.slice(0, r.length);
                return e._cache = e._cache.slice(r.length), s(r, i)
            }
        }).call(this, e("buffer").Buffer)
    }, {
        "../xor": 65,
        buffer: 43
    }],
    62: [function(e, t, r) {
        r.encrypt = function(e, t) {
            return e._cipher.encryptBlock(t)
        }, r.decrypt = function(e, t) {
            return e._cipher.decryptBlock(t)
        }
    }, {}],
    63: [function(e, t, r) {
        (function(t) {
            function n(e) {
                return e._prev = e._cipher.encryptBlock(e._prev), e._prev
            }
            var i = e("../xor");
            r.encrypt = function(e, r) {
                for (; e._cache.length < r.length;) e._cache = t.concat([e._cache, n(e)]);
                var s = e._cache.slice(0, r.length);
                return e._cache = e._cache.slice(r.length), i(r, s)
            }
        }).call(this, e("buffer").Buffer)
    }, {
        "../xor": 65,
        buffer: 43
    }],
    64: [function(e, t) {
        (function(r) {
            function n(e, t, o, a) {
                return this instanceof n ? (s.call(this), this._cipher = new i.AES(t), this._prev = new r(o.length), this._cache = new r(""), this._secCache = new r(""), this._decrypt = a, o.copy(this._prev), void(this._mode = e)) : new n(e, t, o)
            }
            var i = e("./aes"),
                s = e("./cipherBase"),
                o = e("inherits");
            o(n, s), t.exports = n, n.prototype._update = function(e) {
                return this._mode.encrypt(this, e, this._decrypt)
            }, n.prototype._final = function() {
                this._cipher.scrub()
            }
        }).call(this, e("buffer").Buffer)
    }, {
        "./aes": 49,
        "./cipherBase": 52,
        buffer: 43,
        inherits: 232
    }],
    65: [function(e, t) {
        (function(e) {
            function r(t, r) {
                for (var n = Math.min(t.length, r.length), i = new e(n), s = -1; ++s < n;) i.writeUInt8(t[s] ^ r[s], s);
                return i
            }
            t.exports = r
        }).call(this, e("buffer").Buffer)
    }, {
        buffer: 43
    }],
    66: [function(e, t, r) {
        (function(e) {
            r["RSA-SHA224"] = r.sha224WithRSAEncryption = {
                sign: "rsa",
                hash: "sha224",
                id: new e("302d300d06096086480165030402040500041c", "hex")
            }, r["RSA-SHA256"] = r.sha256WithRSAEncryption = {
                sign: "rsa",
                hash: "sha256",
                id: new e("3031300d060960864801650304020105000420", "hex")
            }, r["RSA-SHA384"] = r.sha384WithRSAEncryption = {
                sign: "rsa",
                hash: "sha384",
                id: new e("3041300d060960864801650304020205000430", "hex")
            }, r["RSA-SHA512"] = r.sha512WithRSAEncryption = {
                sign: "rsa",
                hash: "sha512",
                id: new e("3051300d060960864801650304020305000440", "hex")
            }, r["RSA-SHA1"] = {
                sign: "rsa",
                hash: "sha1",
                id: new e("3021300906052b0e03021a05000414", "hex")
            }, r["ecdsa-with-SHA1"] = {
                sign: "ecdsa",
                hash: "sha1",
                id: new e("", "hex")
            }, r.DSA = r["DSA-SHA1"] = r["DSA-SHA"] = {
                sign: "dsa",
                hash: "sha1",
                id: new e("", "hex")
            }, r["DSA-SHA224"] = r["DSA-WITH-SHA224"] = {
                sign: "dsa",
                hash: "sha224",
                id: new e("", "hex")
            }, r["DSA-SHA256"] = r["DSA-WITH-SHA256"] = {
                sign: "dsa",
                hash: "sha256",
                id: new e("", "hex")
            }, r["DSA-SHA384"] = r["DSA-WITH-SHA384"] = {
                sign: "dsa",
                hash: "sha384",
                id: new e("", "hex")
            }, r["DSA-SHA512"] = r["DSA-WITH-SHA512"] = {
                sign: "dsa",
                hash: "sha512",
                id: new e("", "hex")
            }, r["DSA-RIPEMD160"] = {
                sign: "dsa",
                hash: "rmd160",
                id: new e("", "hex")
            }, r["RSA-RIPEMD160"] = r.ripemd160WithRSA = {
                sign: "rsa",
                hash: "rmd160",
                id: new e("3021300906052b2403020105000414", "hex")
            }, r["RSA-MD5"] = r.md5WithRSAEncryption = {
                sign: "rsa",
                hash: "md5",
                id: new e("3020300c06082a864886f70d020505000410", "hex")
            }
        }).call(this, e("buffer").Buffer)
    }, {
        buffer: 43
    }],
    67: [function(e, t) {
        (function(r) {
            function n(e, t) {
                a.Writable.call(this);
                var r = u[e];
                if (!r) throw new Error("Unknown message digest");
                this._hashType = r.hash, this._hash = t.createHash(r.hash), this._tag = r.id, this._crypto = t
            }

            function i(e, t) {
                a.Writable.call(this);
                var r = u[e];
                if (!r) throw new Error("Unknown message digest");
                this._hash = t.createHash(r.hash), this._tag = r.id
            }
            var s = e("./sign"),
                o = e("./verify"),
                a = e("stream"),
                f = e("inherits"),
                c = e("./algos"),
                u = {};
            Object.keys(c).forEach(function(e) {
                u[e] = u[e.toLowerCase()] = c[e]
            }), t.exports = function(e, t) {
                function r(e) {
                    return new n(e, t)
                }

                function s(e) {
                    return new i(e, t)
                }
                e.createSign = e.Sign = r, e.createVerify = e.Verify = s
            }, f(n, a.Writable), n.prototype._write = function(e, t, r) {
                this._hash.update(e), r()
            }, n.prototype.update = function(e) {
                return this.write(e), this
            }, n.prototype.sign = function(e, t) {
                this.end();
                var n = this._hash.digest(),
                    i = s(r.concat([this._tag, n]), e, this._hashType, this._crypto);
                return t && (i = i.toString(t)), i
            }, f(i, a.Writable), i.prototype._write = function(e, t, r) {
                this._hash.update(e), r()
            }, i.prototype.update = function(e) {
                return this.write(e), this
            }, i.prototype.verify = function(e, t, n) {
                this.end();
                var i = this._hash.digest();
                return r.isBuffer(t) || (t = new r(t, n)), o(t, r.concat([this._tag, i]), e)
            }
        }).call(this, e("buffer").Buffer)
    }, {
        "./algos": 66,
        "./sign": 110,
        "./verify": 111,
        buffer: 43,
        inherits: 232,
        stream: 203
    }],
    68: [function(e, t) {
        function r(e, t) {
            if (!e) throw new Error(t || "Assertion failed")
        }

        function n(e, t) {
            e.super_ = t;
            var r = function() {};
            r.prototype = t.prototype, e.prototype = new r, e.prototype.constructor = e
        }

        function i(e, t, r) {
            return null !== e && "object" == typeof e && Array.isArray(e.words) ? e : (this.sign = !1, this.words = null, this.length = 0, this.red = null, ("le" === t || "be" === t) && (r = t, t = 10), void(null !== e && this._init(e || 0, t || 10, r || "be")))
        }

        function s(e, t) {
            this.name = e, this.p = new i(t, 16), this.n = this.p.bitLength(), this.k = new i(1).ishln(this.n).isub(this.p), this.tmp = this._tmp()
        }

        function o() {
            s.call(this, "k256", "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f")
        }

        function a() {
            s.call(this, "p224", "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001")
        }

        function f() {
            s.call(this, "p192", "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff")
        }

        function c() {
            s.call(this, "25519", "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed")
        }

        function u(e) {
            if ("string" == typeof e) {
                var t = i._prime(e);
                this.m = t.p, this.prime = t
            } else this.m = e, this.prime = null
        }

        function d(e) {
            u.call(this, e), this.shift = this.m.bitLength(), this.shift % 26 !== 0 && (this.shift += 26 - this.shift % 26), this.r = new i(1).ishln(this.shift), this.r2 = this.imod(this.r.sqr()), this.rinv = this.r.invm(this.m), this.minv = this.rinv.mul(this.r).sub(new i(1)).div(this.m).neg().mod(this.r)
        }
        "object" == typeof t && (t.exports = i), i.BN = i, i.wordSize = 26, i.prototype._init = function(e, t, n) {
            if ("number" == typeof e) return 0 > e && (this.sign = !0, e = -e), void(67108864 > e ? (this.words = [67108863 & e], this.length = 1) : (this.words = [67108863 & e, e / 67108864 & 67108863], this.length = 2));
            if ("object" == typeof e) return this._initArray(e, t, n);
            "hex" === t && (t = 16), r(t === (0 | t) && t >= 2 && 36 >= t), e = e.toString().replace(/\s+/g, "");
            var i = 0;
            "-" === e[0] && i++, 16 === t ? this._parseHex(e, i) : this._parseBase(e, t, i), "-" === e[0] && (this.sign = !0), this.strip()
        }, i.prototype._initArray = function(e, t, n) {
            r("number" == typeof e.length), this.length = Math.ceil(e.length / 3), this.words = new Array(this.length);
            for (var i = 0; i < this.length; i++) this.words[i] = 0;
            var s = 0;
            if ("be" === n)
                for (var i = e.length - 1, o = 0; i >= 0; i -= 3) {
                    var a = e[i] | e[i - 1] << 8 | e[i - 2] << 16;
                    this.words[o] |= a << s & 67108863, this.words[o + 1] = a >>> 26 - s & 67108863, s += 24, s >= 26 && (s -= 26, o++)
                } else if ("le" === n)
                    for (var i = 0, o = 0; i < e.length; i += 3) {
                        var a = e[i] | e[i + 1] << 8 | e[i + 2] << 16;
                        this.words[o] |= a << s & 67108863, this.words[o + 1] = a >>> 26 - s & 67108863, s += 24, s >= 26 && (s -= 26, o++)
                    }
                return this.strip()
        }, i.prototype._parseHex = function(e, t) {
            this.length = Math.ceil((e.length - t) / 6), this.words = new Array(this.length);
            for (var r = 0; r < this.length; r++) this.words[r] = 0;
            for (var n = 0, r = e.length - 6, i = 0; r >= t; r -= 6) {
                var s = parseInt(e.slice(r, r + 6), 16);
                this.words[i] |= s << n & 67108863, this.words[i + 1] |= s >>> 26 - n & 4194303, n += 24, n >= 26 && (n -= 26, i++)
            }
            if (r + 6 !== t) {
                var s = parseInt(e.slice(t, r + 6), 16);
                this.words[i] |= s << n & 67108863, this.words[i + 1] |= s >>> 26 - n & 4194303
            }
            this.strip()
        }, i.prototype._parseBase = function(e, t, n) {
            this.words = [0], this.length = 1;
            for (var s = 0, o = 1, a = 0, f = null, c = n; c < e.length; c++) {
                var u, d = e[c];
                u = 10 === t || "9" >= d ? 0 | d : d >= "a" ? d.charCodeAt(0) - 97 + 10 : d.charCodeAt(0) - 65 + 10, s *= t, s += u, o *= t, a++, o > 1048575 && (r(67108863 >= o), f || (f = new i(o)), this.mul(f).copy(this), this.iadd(new i(s)), s = 0, o = 1, a = 0)
            }
            0 !== a && (this.mul(new i(o)).copy(this), this.iadd(new i(s)))
        }, i.prototype.copy = function(e) {
            e.words = new Array(this.length);
            for (var t = 0; t < this.length; t++) e.words[t] = this.words[t];
            e.length = this.length, e.sign = this.sign, e.red = this.red
        }, i.prototype.clone = function() {
            var e = new i(null);
            return this.copy(e), e
        }, i.prototype.strip = function() {
            for (; this.length > 1 && 0 === this.words[this.length - 1];) this.length--;
            return this._normSign()
        }, i.prototype._normSign = function() {
            return 1 === this.length && 0 === this.words[0] && (this.sign = !1), this
        }, i.prototype.inspect = function() {
            return (this.red ? "<BN-R: " : "<BN: ") + this.toString(16) + ">"
        };
        var h = ["", "0", "00", "000", "0000", "00000", "000000", "0000000", "00000000", "000000000", "0000000000", "00000000000", "000000000000", "0000000000000", "00000000000000", "000000000000000", "0000000000000000", "00000000000000000", "000000000000000000", "0000000000000000000", "00000000000000000000", "000000000000000000000", "0000000000000000000000", "00000000000000000000000", "000000000000000000000000", "0000000000000000000000000"],
            p = [0, 0, 25, 16, 12, 11, 10, 9, 8, 8, 7, 7, 7, 7, 6, 6, 6, 6, 6, 6, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
            l = [0, 0, 33554432, 43046721, 16777216, 48828125, 60466176, 40353607, 16777216, 43046721, 1e7, 19487171, 35831808, 62748517, 7529536, 11390625, 16777216, 24137569, 34012224, 47045881, 64e6, 4084101, 5153632, 6436343, 7962624, 9765625, 11881376, 14348907, 17210368, 20511149, 243e5, 28629151, 33554432, 39135393, 45435424, 52521875, 60466176];
        i.prototype.toString = function(e, t) {
            if (e = e || 10, 16 === e || "hex" === e) {
                for (var n = "", i = 0, t = 0 | t || 1, s = 0, o = 0; o < this.length; o++) {
                    var a = this.words[o],
                        f = (16777215 & (a << i | s)).toString(16);
                    s = a >>> 24 - i & 16777215, n = 0 !== s || o !== this.length - 1 ? h[6 - f.length] + f + n : f + n, i += 2, i >= 26 && (i -= 26, o--)
                }
                for (0 !== s && (n = s.toString(16) + n); n.length % t !== 0;) n = "0" + n;
                return this.sign && (n = "-" + n), n
            }
            if (e === (0 | e) && e >= 2 && 36 >= e) {
                var c = p[e],
                    u = l[e],
                    n = "",
                    d = this.clone();
                for (d.sign = !1; 0 !== d.cmpn(0);) {
                    var b = d.modn(u).toString(e);
                    d = d.idivn(u), n = 0 !== d.cmpn(0) ? h[c - b.length] + b + n : b + n
                }
                return 0 === this.cmpn(0) && (n = "0" + n), this.sign && (n = "-" + n), n
            }
            r(!1, "Base should be between 2 and 36")
        }, i.prototype.toJSON = function() {
            return this.toString(16)
        }, i.prototype.toArray = function() {
            this.strip();
            var e = new Array(this.byteLength());
            e[0] = 0;
            for (var t = this.clone(), r = 0; 0 !== t.cmpn(0); r++) {
                var n = t.andln(255);
                t.ishrn(8), e[e.length - r - 1] = n
            }
            return e
        }, i.prototype._countBits = function(e) {
            return e >= 33554432 ? 26 : e >= 16777216 ? 25 : e >= 8388608 ? 24 : e >= 4194304 ? 23 : e >= 2097152 ? 22 : e >= 1048576 ? 21 : e >= 524288 ? 20 : e >= 262144 ? 19 : e >= 131072 ? 18 : e >= 65536 ? 17 : e >= 32768 ? 16 : e >= 16384 ? 15 : e >= 8192 ? 14 : e >= 4096 ? 13 : e >= 2048 ? 12 : e >= 1024 ? 11 : e >= 512 ? 10 : e >= 256 ? 9 : e >= 128 ? 8 : e >= 64 ? 7 : e >= 32 ? 6 : e >= 16 ? 5 : e >= 8 ? 4 : e >= 4 ? 3 : e >= 2 ? 2 : e >= 1 ? 1 : 0
        }, i.prototype.bitLength = function() {
            var e = 0,
                t = this.words[this.length - 1],
                e = this._countBits(t);
            return 26 * (this.length - 1) + e
        }, i.prototype.byteLength = function() {
            this.words[this.length - 1];
            return Math.ceil(this.bitLength() / 8)
        }, i.prototype.neg = function() {
            if (0 === this.cmpn(0)) return this.clone();
            var e = this.clone();
            return e.sign = !this.sign, e
        }, i.prototype.iadd = function(e) {
            if (this.sign && !e.sign) {
                this.sign = !1;
                var t = this.isub(e);
                return this.sign = !this.sign, this._normSign()
            }
            if (!this.sign && e.sign) {
                e.sign = !1;
                var t = this.isub(e);
                return e.sign = !0, t._normSign()
            }
            var r, n;
            this.length > e.length ? (r = this, n = e) : (r = e, n = this);
            for (var i = 0, s = 0; s < n.length; s++) {
                var t = r.words[s] + n.words[s] + i;
                this.words[s] = 67108863 & t, i = t >>> 26
            }
            for (; 0 !== i && s < r.length; s++) {
                var t = r.words[s] + i;
                this.words[s] = 67108863 & t, i = t >>> 26
            }
            if (this.length = r.length, 0 !== i) this.words[this.length] = i, this.length++;
            else if (r !== this)
                for (; s < r.length; s++) this.words[s] = r.words[s];
            return this
        }, i.prototype.add = function(e) {
            if (e.sign && !this.sign) {
                e.sign = !1;
                var t = this.sub(e);
                return e.sign = !0, t
            }
            if (!e.sign && this.sign) {
                this.sign = !1;
                var t = e.sub(this);
                return this.sign = !0, t
            }
            return this.length > e.length ? this.clone().iadd(e) : e.clone().iadd(this)
        }, i.prototype.isub = function(e) {
            if (e.sign) {
                e.sign = !1;
                var t = this.iadd(e);
                return e.sign = !0, t._normSign()
            }
            if (this.sign) return this.sign = !1, this.iadd(e), this.sign = !0, this._normSign();
            var r = this.cmp(e);
            if (0 === r) return this.sign = !1, this.length = 1, this.words[0] = 0, this;
            if (r > 0) var n = this,
                i = e;
            else var n = e,
                i = this;
            for (var s = 0, o = 0; o < i.length; o++) {
                var t = n.words[o] - i.words[o] - s;
                0 > t ? (t += 67108864, s = 1) : s = 0, this.words[o] = t
            }
            for (; 0 !== s && o < n.length; o++) {
                var t = n.words[o] - s;
                0 > t ? (t += 67108864, s = 1) : s = 0, this.words[o] = t
            }
            if (0 === s && o < n.length && n !== this)
                for (; o < n.length; o++) this.words[o] = n.words[o];
            return this.length = Math.max(this.length, o), n !== this && (this.sign = !0), this.strip()
        }, i.prototype.sub = function(e) {
            return this.clone().isub(e)
        }, i.prototype._smallMulTo = function(e, t) {
            t.sign = e.sign !== this.sign, t.length = this.length + e.length;
            for (var r = 0, n = 0; n < t.length - 1; n++) {
                for (var i = r >>> 26, s = 67108863 & r, o = Math.min(n, e.length - 1), a = Math.max(0, n - this.length + 1); o >= a; a++) {
                    var f = n - a,
                        c = 0 | this.words[f],
                        u = 0 | e.words[a],
                        d = c * u,
                        h = 67108863 & d;
                    i = i + (d / 67108864 | 0) | 0, h = h + s | 0, s = 67108863 & h, i = i + (h >>> 26) | 0
                }
                t.words[n] = s, r = i
            }
            return 0 !== r ? t.words[n] = r : t.length--, t.strip()
        }, i.prototype._bigMulTo = function(e, t) {
            t.sign = e.sign !== this.sign, t.length = this.length + e.length;
            for (var r = 0, n = 0, i = 0; i < t.length - 1; i++) {
                var s = n;
                n = 0;
                for (var o = 67108863 & r, a = Math.min(i, e.length - 1), f = Math.max(0, i - this.length + 1); a >= f; f++) {
                    var c = i - f,
                        u = 0 | this.words[c],
                        d = 0 | e.words[f],
                        h = u * d,
                        p = 67108863 & h;
                    s = s + (h / 67108864 | 0) | 0, p = p + o | 0, o = 67108863 & p, s = s + (p >>> 26) | 0, n += s >>> 26, s &= 67108863
                }
                t.words[i] = o, r = s, s = n
            }
            return 0 !== r ? t.words[i] = r : t.length--, t.strip()
        }, i.prototype.mulTo = function(e, t) {
            var r;
            return r = this.length + e.length < 63 ? this._smallMulTo(e, t) : this._bigMulTo(e, t)
        }, i.prototype.mul = function(e) {
            var t = new i(null);
            return t.words = new Array(this.length + e.length), this.mulTo(e, t)
        }, i.prototype.imul = function(e) {
            if (0 === this.cmpn(0) || 0 === e.cmpn(0)) return this.words[0] = 0, this.length = 1, this;
            var t = this.length,
                r = e.length;
            this.sign = e.sign !== this.sign, this.length = this.length + e.length, this.words[this.length - 1] = 0;
            for (var n = this.length - 2; n >= 0; n--) {
                for (var i = 0, s = 0, o = Math.min(n, r - 1), a = Math.max(0, n - t + 1); o >= a; a++) {
                    var f = n - a,
                        c = this.words[f],
                        u = e.words[a],
                        d = c * u,
                        h = 67108863 & d;
                    i += d / 67108864 | 0, h += s, s = 67108863 & h, i += h >>> 26
                }
                this.words[n] = s, this.words[n + 1] += i, i = 0
            }
            for (var i = 0, f = 1; f < this.length; f++) {
                var p = this.words[f] + i;
                this.words[f] = 67108863 & p, i = p >>> 26
            }
            return this.strip()
        }, i.prototype.sqr = function() {
            return this.mul(this)
        }, i.prototype.isqr = function() {
            return this.mul(this)
        }, i.prototype.ishln = function(e) {
            r("number" == typeof e && e >= 0); {
                var t = e % 26,
                    n = (e - t) / 26,
                    i = 67108863 >>> 26 - t << 26 - t;
                this.clone()
            }
            if (0 !== t) {
                for (var s = 0, o = 0; o < this.length; o++) {
                    var a = this.words[o] & i,
                        f = this.words[o] - a << t;
                    this.words[o] = f | s, s = a >>> 26 - t
                }
                s && (this.words[o] = s, this.length++)
            }
            if (0 !== n) {
                for (var o = this.length - 1; o >= 0; o--) this.words[o + n] = this.words[o];
                for (var o = 0; n > o; o++) this.words[o] = 0;
                this.length += n
            }
            return this.strip()
        }, i.prototype.ishrn = function(e, t, n) {
            r("number" == typeof e && e >= 0), t = t ? (t - t % 26) / 26 : 0;
            var i = e % 26,
                s = Math.min((e - i) / 26, this.length),
                o = 67108863 ^ 67108863 >>> i << i,
                a = n;
            if (t -= s, t = Math.max(0, t), a) {
                for (var f = 0; s > f; f++) a.words[f] = this.words[f];
                a.length = s
            }
            if (0 === s);
            else if (this.length > s) {
                this.length -= s;
                for (var f = 0; f < this.length; f++) this.words[f] = this.words[f + s]
            } else this.words[0] = 0, this.length = 1;
            for (var c = 0, f = this.length - 1; f >= 0 && (0 !== c || f >= t); f--) {
                var u = this.words[f];
                this.words[f] = c << 26 - i | u >>> i, c = u & o
            }
            return a && 0 !== c && (a.words[a.length++] = c), 0 === this.length && (this.words[0] = 0, this.length = 1), this.strip(), n ? {
                hi: this,
                lo: a
            } : this
        }, i.prototype.shln = function(e) {
            return this.clone().ishln(e)
        }, i.prototype.shrn = function(e) {
            return this.clone().ishrn(e)
        }, i.prototype.testn = function(e) {
            r("number" == typeof e && e >= 0);
            var t = e % 26,
                n = (e - t) / 26,
                i = 1 << t;
            if (this.length <= n) return !1;
            var s = this.words[n];
            return !!(s & i)
        }, i.prototype.imaskn = function(e) {
            r("number" == typeof e && e >= 0);
            var t = e % 26,
                n = (e - t) / 26;
            if (r(!this.sign, "imaskn works only with positive numbers"), 0 !== t && n++, this.length = Math.min(n, this.length), 0 !== t) {
                var i = 67108863 ^ 67108863 >>> t << t;
                this.words[this.length - 1] &= i
            }
            return this.strip()
        }, i.prototype.maskn = function(e) {
            return this.clone().imaskn(e)
        }, i.prototype.iaddn = function(e) {
            if (r("number" == typeof e), 0 > e) return this.isubn(-e);
            if (this.sign) return 1 === this.length && this.words[0] < e ? (this.words[0] = e - this.words[0], this.sign = !1, this) : (this.sign = !1, this.isubn(e), this.sign = !0, this);
            this.words[0] += e;
            for (var t = 0; t < this.length && this.words[t] >= 67108864; t++) this.words[t] -= 67108864, t === this.length - 1 ? this.words[t + 1] = 1 : this.words[t + 1] ++;
            return this.length = Math.max(this.length, t + 1), this
        }, i.prototype.isubn = function(e) {
            if (r("number" == typeof e), 0 > e) return this.iaddn(-e);
            if (this.sign) return this.sign = !1, this.iaddn(e), this.sign = !0, this;
            this.words[0] -= e;
            for (var t = 0; t < this.length && this.words[t] < 0; t++) this.words[t] += 67108864, this.words[t + 1] -= 1;
            return this.strip()
        }, i.prototype.addn = function(e) {
            return this.clone().iaddn(e)
        }, i.prototype.subn = function(e) {
            return this.clone().isubn(e)
        }, i.prototype.iabs = function() {
            return this.sign = !1, this
        }, i.prototype.abs = function() {
            return this.clone().iabs()
        }, i.prototype._wordDiv = function(e, t) {
            for (var r = this.length - e.length, n = this.clone(), s = e, o = "mod" !== t && new i(0); n.length > s.length;) {
                var a = 67108864 * n.words[n.length - 1] + n.words[n.length - 2],
                    f = a / s.words[s.length - 1],
                    c = f / 67108864 | 0,
                    u = 67108863 & f;
                f = new i(null), f.words = [u, c], f.length = 2;
                var r = 26 * (n.length - s.length - 1);
                if (o) {
                    var d = f.shln(r);
                    n.sign ? o.isub(d) : o.iadd(d)
                }
                f = f.mul(s).ishln(r), n.sign ? n.iadd(f) : n.isub(f)
            }
            for (; n.ucmp(s) >= 0;) {
                var a = n.words[n.length - 1],
                    f = new i(a / s.words[s.length - 1] | 0),
                    r = 26 * (n.length - s.length);
                if (o) {
                    var d = f.shln(r);
                    n.sign ? o.isub(d) : o.iadd(d)
                }
                f = f.mul(s).ishln(r), n.sign ? n.iadd(f) : n.isub(f)
            }
            return n.sign && (o && o.isubn(1), n.iadd(s)), {
                div: o ? o : null,
                mod: n
            }
        }, i.prototype.divmod = function(e, t) {
            if (r(0 !== e.cmpn(0)), this.sign && !e.sign) {
                var n, s, o = this.neg().divmod(e, t);
                return "mod" !== t && (n = o.div.neg()), "div" !== t && (s = 0 === o.mod.cmpn(0) ? o.mod : e.sub(o.mod)), {
                    div: n,
                    mod: s
                }
            }
            if (!this.sign && e.sign) {
                var n, o = this.divmod(e.neg(), t);
                return "mod" !== t && (n = o.div.neg()), {
                    div: n,
                    mod: o.mod
                }
            }
            return this.sign && e.sign ? this.neg().divmod(e.neg(), t) : e.length > this.length || this.cmp(e) < 0 ? {
                div: new i(0),
                mod: this
            } : 1 === e.length ? "div" === t ? {
                div: this.divn(e.words[0]),
                mod: null
            } : "mod" === t ? {
                div: null,
                mod: new i(this.modn(e.words[0]))
            } : {
                div: this.divn(e.words[0]),
                mod: new i(this.modn(e.words[0]))
            } : this._wordDiv(e, t)
        }, i.prototype.div = function(e) {
            return this.divmod(e, "div").div
        }, i.prototype.mod = function(e) {
            return this.divmod(e, "mod").mod
        }, i.prototype.divRound = function(e) {
            var t = this.divmod(e);
            if (0 === t.mod.cmpn(0)) return t.div;
            var r = t.div.sign ? t.mod.isub(e) : t.mod,
                n = e.shrn(1),
                i = e.andln(1),
                s = r.cmp(n);
            return 0 > s || 1 === i && 0 === s ? t.div : t.div.sign ? t.div.isubn(1) : t.div.iaddn(1)
        }, i.prototype.modn = function(e) {
            r(67108863 >= e);
            for (var t = (1 << 26) % e, n = 0, i = this.length - 1; i >= 0; i--) n = (t * n + this.words[i]) % e;
            return n
        }, i.prototype.idivn = function(e) {
            r(67108863 >= e);
            for (var t = 0, n = this.length - 1; n >= 0; n--) {
                var i = this.words[n] + 67108864 * t;
                this.words[n] = i / e | 0, t = i % e
            }
            return this.strip()
        }, i.prototype.divn = function(e) {
            return this.clone().idivn(e)
        }, i.prototype._egcd = function(e, t) {
            r(!t.sign), r(0 !== t.cmpn(0));
            var n = this,
                s = t.clone();
            n = n.sign ? n.mod(t) : n.clone();
            for (var o = new i(0); s.isEven();) s.ishrn(1);
            for (var a = s.clone(); n.cmpn(1) > 0 && s.cmpn(1) > 0;) {
                for (; n.isEven();) n.ishrn(1), e.isEven() ? e.ishrn(1) : e.iadd(a).ishrn(1);
                for (; s.isEven();) s.ishrn(1), o.isEven() ? o.ishrn(1) : o.iadd(a).ishrn(1);
                n.cmp(s) >= 0 ? (n.isub(s), e.isub(o)) : (s.isub(n), o.isub(e))
            }
            return 0 === n.cmpn(1) ? e : o
        }, i.prototype.gcd = function(e) {
            if (0 === this.cmpn(0)) return e.clone();
            if (0 === e.cmpn(0)) return this.clone();
            var t = this.clone(),
                r = e.clone();
            t.sign = !1, r.sign = !1;
            for (var n = 0; t.isEven() && r.isEven(); n++) t.ishrn(1), r.ishrn(1);
            for (; t.isEven();) t.ishrn(1);
            do {
                for (; r.isEven();) r.ishrn(1);
                if (t.cmp(r) < 0) {
                    var i = t;
                    t = r, r = i
                }
                t.isub(t.div(r).mul(r))
            } while (0 !== t.cmpn(0) && 0 !== r.cmpn(0));
            return 0 === t.cmpn(0) ? r.ishln(n) : t.ishln(n)
        }, i.prototype.invm = function(e) {
            return this._egcd(new i(1), e).mod(e)
        }, i.prototype.isEven = function() {
            return 0 === (1 & this.words[0])
        }, i.prototype.isOdd = function() {
            return 1 === (1 & this.words[0])
        }, i.prototype.andln = function(e) {
            return this.words[0] & e
        }, i.prototype.bincn = function(e) {
            r("number" == typeof e);
            var t = e % 26,
                n = (e - t) / 26,
                i = 1 << t;
            if (this.length <= n) {
                for (var s = this.length; n + 1 > s; s++) this.words[s] = 0;
                return this.words[n] |= i, this.length = n + 1, this
            }
            for (var o = i, s = n; 0 !== o && s < this.length; s++) {
                var a = this.words[s];
                a += o, o = a >>> 26, a &= 67108863, this.words[s] = a
            }
            return 0 !== o && (this.words[s] = o, this.length++), this
        }, i.prototype.cmpn = function(e) {
            var t = 0 > e;
            if (t && (e = -e), this.sign && !t) return -1;
            if (!this.sign && t) return 1;
            e &= 67108863, this.strip();
            var r;
            if (this.length > 1) r = 1;
            else {
                var n = this.words[0];
                r = n === e ? 0 : e > n ? -1 : 1
            }
            return this.sign && (r = -r), r
        }, i.prototype.cmp = function(e) {
            if (this.sign && !e.sign) return -1;
            if (!this.sign && e.sign) return 1;
            var t = this.ucmp(e);
            return this.sign ? -t : t
        }, i.prototype.ucmp = function(e) {
            if (this.length > e.length) return 1;
            if (this.length < e.length) return -1;
            for (var t = 0, r = this.length - 1; r >= 0; r--) {
                var n = this.words[r],
                    i = e.words[r];
                if (n !== i) {
                    i > n ? t = -1 : n > i && (t = 1);
                    break
                }
            }
            return t
        }, i.red = function(e) {
            return new u(e)
        }, i.prototype.toRed = function(e) {
            return r(!this.red, "Already a number in reduction context"), r(!this.sign, "red works only with positives"), e.convertTo(this)._forceRed(e)
        }, i.prototype.fromRed = function() {
            return r(this.red, "fromRed works only with numbers in reduction context"), this.red.convertFrom(this)
        }, i.prototype._forceRed = function(e) {
            return this.red = e, this
        }, i.prototype.forceRed = function(e) {
            return r(!this.red, "Already a number in reduction context"), this._forceRed(e)
        }, i.prototype.redAdd = function(e) {
            return r(this.red, "redAdd works only with red numbers"), this.red.add(this, e)
        }, i.prototype.redIAdd = function(e) {
            return r(this.red, "redIAdd works only with red numbers"), this.red.iadd(this, e)
        }, i.prototype.redSub = function(e) {
            return r(this.red, "redSub works only with red numbers"), this.red.sub(this, e)
        }, i.prototype.redISub = function(e) {
            return r(this.red, "redISub works only with red numbers"), this.red.isub(this, e)
        }, i.prototype.redShl = function(e) {
            return r(this.red, "redShl works only with red numbers"), this.red.shl(this, e)
        }, i.prototype.redMul = function(e) {
            return r(this.red, "redMul works only with red numbers"), this.red._verify2(this, e), this.red.mul(this, e)
        }, i.prototype.redIMul = function(e) {
            return r(this.red, "redMul works only with red numbers"), this.red._verify2(this, e), this.red.imul(this, e)
        }, i.prototype.redSqr = function() {
            return r(this.red, "redSqr works only with red numbers"), this.red._verify1(this), this.red.sqr(this)
        }, i.prototype.redISqr = function() {
            return r(this.red, "redISqr works only with red numbers"), this.red._verify1(this), this.red.isqr(this)
        }, i.prototype.redSqrt = function() {
            return r(this.red, "redSqrt works only with red numbers"), this.red._verify1(this), this.red.sqrt(this)
        }, i.prototype.redInvm = function() {
            return r(this.red, "redInvm works only with red numbers"), this.red._verify1(this), this.red.invm(this)
        }, i.prototype.redNeg = function() {
            return r(this.red, "redNeg works only with red numbers"), this.red._verify1(this), this.red.neg(this)
        }, i.prototype.redPow = function(e) {
            return r(this.red && !e.red, "redPow(normalNum)"), this.red._verify1(this), this.red.pow(this, e)
        };
        var b = {
            k256: null,
            p224: null,
            p192: null,
            p25519: null
        };
        s.prototype._tmp = function() {
            var e = new i(null);
            return e.words = new Array(Math.ceil(this.n / 13)), e
        }, s.prototype.ireduce = function(e) {
            var t, r = e;
            do {
                var n = r.ishrn(this.n, 0, this.tmp);
                r = this.imulK(n.hi), r = r.iadd(n.lo), t = r.bitLength()
            } while (t > this.n);
            var i = t < this.n ? -1 : r.cmp(this.p);
            return 0 === i ? (r.words[0] = 0, r.length = 1) : i > 0 ? r.isub(this.p) : r.strip(), r
        }, s.prototype.imulK = function(e) {
            return e.imul(this.k)
        }, n(o, s), o.prototype.imulK = function(e) {
            e.words[e.length] = 0, e.words[e.length + 1] = 0, e.length += 2;
            for (var t = 0, r = 0, n = 0, i = 0; i < e.length; i++) {
                var s = e.words[i];
                r += 64 * s, n += 977 * s, r += n / 67108864 | 0, t += r / 67108864 | 0, r &= 67108863, n &= 67108863, e.words[i] = n, n = r, r = t, t = 0
            }
            return 0 === e.words[e.length - 1] && e.length--, 0 === e.words[e.length - 1] && e.length--, e
        }, n(a, s), n(f, s), n(c, s), c.prototype.imulK = function(e) {
            for (var t = 0, r = 0; r < e.length; r++) {
                var n = 19 * e.words[r] + t,
                    i = 67108863 & n;
                n >>>= 26, e.words[r] = i, t = n
            }
            return 0 !== t && (e.words[e.length++] = t), e
        }, i._prime = function g(e) {
            if (b[e]) return b[e];
            var g;
            if ("k256" === e) g = new o;
            else if ("p224" === e) g = new a;
            else if ("p192" === e) g = new f;
            else {
                if ("p25519" !== e) throw new Error("Unknown prime " + e);
                g = new c
            }
            return b[e] = g, g
        }, u.prototype._verify1 = function(e) {
            r(!e.sign, "red works only with positives"), r(e.red, "red works only with red numbers")
        }, u.prototype._verify2 = function(e, t) {
            r(!e.sign && !t.sign, "red works only with positives"), r(e.red && e.red === t.red, "red works only with red numbers")
        }, u.prototype.imod = function(e) {
            return this.prime ? this.prime.ireduce(e)._forceRed(this) : e.mod(this.m)._forceRed(this)
        }, u.prototype.neg = function(e) {
            var t = e.clone();
            return t.sign = !t.sign, t.iadd(this.m)._forceRed(this)
        }, u.prototype.add = function(e, t) {
            this._verify2(e, t);
            var r = e.add(t);
            return r.cmp(this.m) >= 0 && r.isub(this.m), r._forceRed(this)
        }, u.prototype.iadd = function(e, t) {
            this._verify2(e, t);
            var r = e.iadd(t);
            return r.cmp(this.m) >= 0 && r.isub(this.m), r
        }, u.prototype.sub = function(e, t) {
            this._verify2(e, t);
            var r = e.sub(t);
            return r.cmpn(0) < 0 && r.iadd(this.m), r._forceRed(this)
        }, u.prototype.isub = function(e, t) {
            this._verify2(e, t);
            var r = e.isub(t);
            return r.cmpn(0) < 0 && r.iadd(this.m), r
        }, u.prototype.shl = function(e, t) {
            return this._verify1(e), this.imod(e.shln(t))
        }, u.prototype.imul = function(e, t) {
            return this._verify2(e, t), this.imod(e.imul(t))
        }, u.prototype.mul = function(e, t) {
            return this._verify2(e, t), this.imod(e.mul(t))
        }, u.prototype.isqr = function(e) {
            return this.imul(e, e)
        }, u.prototype.sqr = function(e) {
            return this.mul(e, e)
        }, u.prototype.sqrt = function(e) {
            if (0 === e.cmpn(0)) return e.clone();
            var t = this.m.andln(3);
            if (r(t % 2 === 1), 3 === t) {
                var n = this.m.add(new i(1)).ishrn(2),
                    s = this.pow(e, n);
                return s
            }
            for (var o = this.m.subn(1), a = 0; 0 !== o.cmpn(0) && 0 === o.andln(1);) a++, o.ishrn(1);
            r(0 !== o.cmpn(0));
            var f = new i(1).toRed(this),
                c = f.redNeg(),
                u = this.m.subn(1).ishrn(1),
                d = this.m.bitLength();
            for (d = new i(2 * d * d).toRed(this); 0 !== this.pow(d, u).cmp(c);) d.redIAdd(c);
            for (var h = this.pow(d, o), s = this.pow(e, o.addn(1).ishrn(1)), p = this.pow(e, o), l = a; 0 !== p.cmp(f);) {
                for (var b = p, g = 0; 0 !== b.cmp(f); g++) b = b.redSqr();
                r(l > g);
                var y = this.pow(h, new i(1).ishln(l - g - 1));
                s = s.redMul(y), h = y.redSqr(), p = p.redMul(h), l = g
            }
            return s
        }, u.prototype.invm = function(e) {
            var t = e._egcd(new i(1), this.m);
            return t.sign ? (t.sign = !1, this.imod(t).redNeg()) : this.imod(t)
        }, u.prototype.pow = function(e, t) {
            for (var r = [], n = t.clone(); 0 !== n.cmpn(0);) r.push(n.andln(1)), n.ishrn(1);
            for (var i = e, s = 0; s < r.length && 0 === r[s]; s++, i = this.sqr(i));
            if (++s < r.length)
                for (var n = this.sqr(i); s < r.length; s++, n = this.sqr(n)) 0 !== r[s] && (i = this.mul(i, n));
            return i
        }, u.prototype.convertTo = function(e) {
            return e.clone()
        }, u.prototype.convertFrom = function(e) {
            var t = e.clone();
            return t.red = null, t
        }, i.mont = function(e) {
            return new d(e)
        }, n(d, u), d.prototype.convertTo = function(e) {
            return this.imod(e.shln(this.shift))
        }, d.prototype.convertFrom = function(e) {
            var t = this.imod(e.mul(this.rinv));
            return t.red = null, t
        }, d.prototype.imul = function(e, t) {
            if (0 === e.cmpn(0) || 0 === t.cmpn(0)) return e.words[0] = 0, e.length = 1, e;
            var r = e.imul(t),
                n = r.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m),
                i = r.isub(n).ishrn(this.shift),
                s = i;
            return i.cmp(this.m) >= 0 ? s = i.isub(this.m) : i.cmpn(0) < 0 && (s = i.iadd(this.m)), s._forceRed(this)
        }, d.prototype.mul = function(e, t) {
            if (0 === e.cmpn(0) || 0 === t.cmpn(0)) return new i(0)._forceRed(this);
            var r = e.mul(t),
                n = r.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m),
                s = r.isub(n).ishrn(this.shift),
                o = s;
            return s.cmp(this.m) >= 0 ? o = s.isub(this.m) : s.cmpn(0) < 0 && (o = s.iadd(this.m)), o._forceRed(this)
        }, d.prototype.invm = function(e) {
            var t = this.imod(e.invm(this.m).mul(this.r2));
            return t._forceRed(this)
        }
    }, {}],
    69: [function(e, t) {
        (function(r) {
            function n(e, t) {
                var r = s(e, t),
                    n = r.toRed(o.mont(e.modulus)).redPow(new o(e.publicExponent)).fromRed();
                return {
                    blinder: n,
                    unblinder: r.invm(e.modulus)
                }
            }

            function i(e, t, i) {
                var s = n(t, i),
                    a = t.modulus.byteLength(),
                    f = (o.mont(t.modulus), new o(e).mul(s.blinder).mod(t.modulus)),
                    c = f.toRed(o.mont(t.prime1)),
                    u = f.toRed(o.mont(t.prime2)),
                    d = t.coefficient,
                    h = t.prime1,
                    p = t.prime2,
                    l = c.redPow(t.exponent1),
                    b = u.redPow(t.exponent2);
                l = l.fromRed(), b = b.fromRed();
                var g = l.isub(b).imul(d).mod(h);
                g.imul(p), b.iadd(g);
                var y = new r(b.imul(s.unblinder).mod(t.modulus).toArray());
                if (y.length < a) {
                    var m = new r(a - y.length);
                    m.fill(0), y = r.concat([m, y], a)
                }
                return y
            }

            function s(e, t) {
                for (var r = e.modulus.byteLength(), n = new o(t.randomBytes(r)); n.cmp(e.modulus) >= 0 || !n.mod(e.prime1) || !n.mod(e.prime2);) n = new o(t.randomBytes(r));
                return n
            }
            var o = e("bn.js");
            t.exports = i, i.getr = s
        }).call(this, e("buffer").Buffer)
    }, {
        "bn.js": 68,
        buffer: 43
    }],
    70: [function(e, t, r) {
        var n = r;
        n.version = e("../package.json").version, n.utils = e("./elliptic/utils"), n.rand = e("brorand"), n.hmacDRBG = e("./elliptic/hmac-drbg"), n.curve = e("./elliptic/curve"), n.curves = e("./elliptic/curves"), n.ec = e("./elliptic/ec")
    }, {
        "../package.json": 89,
        "./elliptic/curve": 73,
        "./elliptic/curves": 76,
        "./elliptic/ec": 77,
        "./elliptic/hmac-drbg": 80,
        "./elliptic/utils": 81,
        brorand: 82
    }],
    71: [function(e, t) {
        function r(e, t) {
            this.type = e, this.p = new i(t.p, 16), this.red = t.prime ? i.red(t.prime) : i.mont(this.p), this.zero = new i(0).toRed(this.red), this.one = new i(1).toRed(this.red), this.two = new i(2).toRed(this.red), this.n = t.n && new i(t.n, 16), this.g = t.g && this.pointFromJSON(t.g, t.gRed), this._wnafT1 = new Array(4), this._wnafT2 = new Array(4), this._wnafT3 = new Array(4), this._wnafT4 = new Array(4)
        }

        function n(e, t) {
            this.curve = e, this.type = t, this.precomputed = null
        }
        var i = e("bn.js"),
            s = e("../../elliptic"),
            o = s.utils.getNAF,
            a = s.utils.getJSF,
            f = s.utils.assert;
        t.exports = r, r.prototype.point = function() {
            throw new Error("Not implemented")
        }, r.prototype.validate = function() {
            throw new Error("Not implemented")
        }, r.prototype._fixedNafMul = function(e, t) {
            var r = e._getDoubles(),
                n = o(t, 1),
                i = (1 << r.step + 1) - (r.step % 2 === 0 ? 2 : 1);
            i /= 3;
            for (var s = [], a = 0; a < n.length; a += r.step) {
                for (var f = 0, t = a + r.step - 1; t >= a; t--) f = (f << 1) + n[t];
                s.push(f)
            }
            for (var c = this.jpoint(null, null, null), u = this.jpoint(null, null, null), d = i; d > 0; d--) {
                for (var a = 0; a < s.length; a++) {
                    var f = s[a];
                    f === d ? u = u.mixedAdd(r.points[a]) : f === -d && (u = u.mixedAdd(r.points[a].neg()))
                }
                c = c.add(u)
            }
            return c.toP()
        }, r.prototype._wnafMul = function(e, t) {
            var r = 4,
                n = e._getNAFPoints(r);
            r = n.wnd;
            for (var i = n.points, s = o(t, r), a = this.jpoint(null, null, null), c = s.length - 1; c >= 0; c--) {
                for (var t = 0; c >= 0 && 0 === s[c]; c--) t++;
                if (c >= 0 && t++, a = a.dblp(t), 0 > c) break;
                var u = s[c];
                f(0 !== u), a = "affine" === e.type ? a.mixedAdd(u > 0 ? i[u - 1 >> 1] : i[-u - 1 >> 1].neg()) : a.add(u > 0 ? i[u - 1 >> 1] : i[-u - 1 >> 1].neg())
            }
            return "affine" === e.type ? a.toP() : a
        }, r.prototype._wnafMulAdd = function(e, t, r, n) {
            for (var i = this._wnafT1, s = this._wnafT2, f = this._wnafT3, c = 0, u = 0; n > u; u++) {
                var d = t[u],
                    h = d._getNAFPoints(e);
                i[u] = h.wnd, s[u] = h.points
            }
            for (var u = n - 1; u >= 1; u -= 2) {
                var p = u - 1,
                    l = u;
                if (1 === i[p] && 1 === i[l]) {
                    var b = [t[p], null, null, t[l]];
                    0 === t[p].y.cmp(t[l].y) ? (b[1] = t[p].add(t[l]), b[2] = t[p].toJ().mixedAdd(t[l].neg())) : 0 === t[p].y.cmp(t[l].y.redNeg()) ? (b[1] = t[p].toJ().mixedAdd(t[l]), b[2] = t[p].add(t[l].neg())) : (b[1] = t[p].toJ().mixedAdd(t[l]), b[2] = t[p].toJ().mixedAdd(t[l].neg()));
                    var g = [-3, -1, -5, -7, 0, 7, 5, 1, 3],
                        y = a(r[p], r[l]);
                    c = Math.max(y[0].length, c), f[p] = new Array(c), f[l] = new Array(c);
                    for (var m = 0; c > m; m++) {
                        var v = 0 | y[0][m],
                            _ = 0 | y[1][m];
                        f[p][m] = g[3 * (v + 1) + (_ + 1)], f[l][m] = 0, s[p] = b
                    }
                } else f[p] = o(r[p], i[p]), f[l] = o(r[l], i[l]), c = Math.max(f[p].length, c), c = Math.max(f[l].length, c)
            }
            for (var w = this.jpoint(null, null, null), S = this._wnafT4, u = c; u >= 0; u--) {
                for (var k = 0; u >= 0;) {
                    for (var I = !0, m = 0; n > m; m++) S[m] = 0 | f[m][u], 0 !== S[m] && (I = !1);
                    if (!I) break;
                    k++, u--
                }
                if (u >= 0 && k++, w = w.dblp(k), 0 > u) break;
                for (var m = 0; n > m; m++) {
                    var d, E = S[m];
                    0 !== E && (E > 0 ? d = s[m][E - 1 >> 1] : 0 > E && (d = s[m][-E - 1 >> 1].neg()), w = "affine" === d.type ? w.mixedAdd(d) : w.add(d))
                }
            }
            for (var u = 0; n > u; u++) s[u] = null;
            return w.toP()
        }, r.BasePoint = n, n.prototype.validate = function() {
            return this.curve.validate(this)
        }, n.prototype.precompute = function(e) {
            if (this.precomputed) return this;
            var t = {
                doubles: null,
                naf: null,
                beta: null
            };
            return t.naf = this._getNAFPoints(8), t.doubles = this._getDoubles(4, e), t.beta = this._getBeta(), this.precomputed = t, this
        }, n.prototype._getDoubles = function(e, t) {
            if (this.precomputed && this.precomputed.doubles) return this.precomputed.doubles;
            for (var r = [this], n = this, i = 0; t > i; i += e) {
                for (var s = 0; e > s; s++) n = n.dbl();
                r.push(n)
            }
            return {
                step: e,
                points: r
            }
        }, n.prototype._getNAFPoints = function(e) {
            if (this.precomputed && this.precomputed.naf) return this.precomputed.naf;
            for (var t = [this], r = (1 << e) - 1, n = 1 === r ? null : this.dbl(), i = 1; r > i; i++) t[i] = t[i - 1].add(n);
            return {
                wnd: e,
                points: t
            }
        }, n.prototype._getBeta = function() {
            return null
        }, n.prototype.dblp = function(e) {
            for (var t = this, r = 0; e > r; r++) t = t.dbl();
            return t
        }
    }, {
        "../../elliptic": 70,
        "bn.js": 68
    }],
    72: [function(e, t) {
        function r(e) {
            this.twisted = 1 != e.a, this.mOneA = this.twisted && -1 == e.a, this.extended = this.mOneA, f.call(this, "mont", e), this.a = new o(e.a, 16).mod(this.red.m).toRed(this.red), this.c = new o(e.c, 16).toRed(this.red), this.c2 = this.c.redSqr(), this.d = new o(e.d, 16).toRed(this.red), this.dd = this.d.redAdd(this.d), c(!this.twisted || 0 === this.c.fromRed().cmpn(1)), this.oneC = 1 == e.c
        }

        function n(e, t, r, n, i) {
            f.BasePoint.call(this, e, "projective"), null === t && null === r && null === n ? (this.x = this.curve.zero, this.y = this.curve.one, this.z = this.curve.one, this.t = this.curve.zero, this.zOne = !0) : (this.x = new o(t, 16), this.y = new o(r, 16), this.z = n ? new o(n, 16) : this.curve.one, this.t = i && new o(i, 16), this.x.red || (this.x = this.x.toRed(this.curve.red)), this.y.red || (this.y = this.y.toRed(this.curve.red)), this.z.red || (this.z = this.z.toRed(this.curve.red)), this.t && !this.t.red && (this.t = this.t.toRed(this.curve.red)), this.zOne = this.z === this.curve.one, this.curve.extended && !this.t && (this.t = this.x.redMul(this.y), this.zOne || (this.t = this.t.redMul(this.z.redInvm()))))
        }
        var i = e("../curve"),
            s = e("../../elliptic"),
            o = e("bn.js"),
            a = e("inherits"),
            f = i.base,
            c = (s.utils.getNAF, s.utils.assert);
        a(r, f), t.exports = r, r.prototype._mulA = function(e) {
            return this.mOneA ? e.redNeg() : this.a.redMul(e)
        }, r.prototype._mulC = function(e) {
            return this.oneC ? e : this.c.redMul(e)
        }, r.prototype.point = function(e, t, r, i) {
            return new n(this, e, t, r, i)
        }, r.prototype.jpoint = function(e, t, r, n) {
            return this.point(e, t, r, n)
        }, r.prototype.pointFromJSON = function(e) {
            return n.fromJSON(this, e)
        }, r.prototype.pointFromX = function(e, t) {
            t = new o(t, 16), t.red || (t = t.toRed(this.red));
            var r = t.redSqr(),
                n = this.c2.redSub(this.a.redMul(r)),
                s = this.one.redSub(this.c2.redMul(this.d).redMul(r)),
                a = n.redMul(s.redInvm()).redSqrt(),
                f = a.fromRed().isOdd();
            return (e && !f || !e && f) && (a = a.redNeg()), this.point(t, a, i.one)
        }, r.prototype.validate = function(e) {
            if (e.isInfinity()) return !0;
            e.normalize();
            var t = e.x.redSqr(),
                r = e.y.redSqr(),
                n = t.redMul(this.a).redAdd(r),
                i = this.c2.redMul(this.one.redAdd(this.d.redMul(t).redMul(r)));
            return 0 === n.cmp(i)
        }, a(n, f.BasePoint), n.fromJSON = function(e, t) {
            return new n(e, t[0], t[1], t[2])
        }, n.prototype.inspect = function() {
            return this.isInfinity() ? "<EC Point Infinity>" : "<EC Point x: " + this.x.fromRed().toString(16, 2) + " y: " + this.y.fromRed().toString(16, 2) + " z: " + this.z.fromRed().toString(16, 2) + ">"
        }, n.prototype.isInfinity = function() {
            return 0 === this.x.cmpn(0) && 0 === this.y.cmp(this.z)
        }, n.prototype._extDbl = function() {
            var e = this.x.redSqr(),
                t = this.y.redSqr(),
                r = this.z.redSqr();
            r = r.redIAdd(r);
            var n = this.curve._mulA(e),
                i = this.x.redAdd(this.y).redSqr().redISub(e).redISub(t),
                s = n.redAdd(t),
                o = s.redSub(r),
                a = n.redSub(t),
                f = i.redMul(o),
                c = s.redMul(a),
                u = i.redMul(a),
                d = o.redMul(s);
            return this.curve.point(f, c, d, u)
        }, n.prototype._projDbl = function() {
            var e = this.x.redAdd(this.y).redSqr(),
                t = this.x.redSqr(),
                r = this.y.redSqr();
            if (this.curve.twisted) {
                var n = this.curve._mulA(t),
                    i = n.redAdd(r);
                if (this.zOne) var s = e.redSub(t).redSub(r).redMul(i.redSub(this.curve.two)),
                    o = i.redMul(n.redSub(r)),
                    a = i.redSqr().redSub(i).redSub(i);
                else var f = this.z.redSqr(),
                    c = i.redSub(f).redISub(f),
                    s = e.redSub(t).redISub(r).redMul(c),
                    o = i.redMul(n.redSub(r)),
                    a = i.redMul(c)
            } else var n = t.redAdd(r),
                f = this.curve._mulC(redMul(this.z)).redSqr(),
                c = n.redSub(f).redSub(f),
                s = this.curve._mulC(e.redISub(n)).redMul(c),
                o = this.curve._mulC(n).redMul(t.redISub(r)),
                a = n.redMul(c);
            return this.curve.point(s, o, a)
        }, n.prototype.dbl = function() {
            return this.isInfinity() ? this : this.curve.extended ? this._extDbl() : this._projDbl()
        }, n.prototype._extAdd = function(e) {
            var t = this.y.redSub(this.x).redMul(e.y.redSub(e.x)),
                r = this.y.redAdd(this.x).redMul(e.y.redAdd(e.x)),
                n = this.t.redMul(this.curve.dd).redMul(e.t),
                i = this.z.redMul(e.z.redAdd(e.z)),
                s = r.redSub(t),
                o = i.redSub(n),
                a = i.redAdd(n),
                f = r.redAdd(t),
                c = s.redMul(o),
                u = a.redMul(f),
                d = s.redMul(f),
                h = o.redMul(a);
            return this.curve.point(c, u, h, d)
        }, n.prototype._projAdd = function(e) {
            var t = this.z.redMul(e.z),
                r = t.redSqr(),
                n = this.x.redMul(e.x),
                i = this.y.redMul(e.y),
                s = this.curve.d.redMul(n).redMul(i),
                o = r.redSub(s),
                a = r.redAdd(s),
                f = this.x.redAdd(this.y).redMul(e.x.redAdd(e.y)).redISub(n).redISub(i),
                c = t.redMul(o).redMul(f);
            if (this.curve.twisted) var u = t.redMul(a).redMul(i.redSub(this.curve._mulA(n))),
                d = o.redMul(a);
            else var u = t.redMul(a).redMul(i.redSub(n)),
                d = this.curve._mulC(o).redMul(a);
            return this.curve.point(c, u, d)
        }, n.prototype.add = function(e) {
            return this.isInfinity() ? e : e.isInfinity() ? this : this.curve.extended ? this._extAdd(e) : this._projAdd(e)
        }, n.prototype.mul = function(e) {
            return this.precomputed && this.precomputed.doubles ? this.curve._fixedNafMul(this, e) : this.curve._wnafMul(this, e)
        }, n.prototype.mulAdd = function(e, t, r) {
            return this.curve._wnafMulAdd(1, [this, t], [e, r], 2)
        }, n.prototype.normalize = function() {
            if (this.zOne) return this;
            var e = this.z.redInvm();
            return this.x = this.x.redMul(e), this.y = this.y.redMul(e), this.t && (this.t = this.t.redMul(e)), this.z = this.curve.one, this.zOne = !0, this
        }, n.prototype.neg = function() {
            return this.curve.point(this.x.redNeg(), this.y, this.z, this.t && this.t.redNeg())
        }, n.prototype.getX = function() {
            return this.normalize(), this.x.fromRed()
        }, n.prototype.getY = function() {
            return this.normalize(), this.y.fromRed()
        }, n.prototype.toP = n.prototype.normalize, n.prototype.mixedAdd = n.prototype.add
    }, {
        "../../elliptic": 70,
        "../curve": 73,
        "bn.js": 68,
        inherits: 232
    }],
    73: [function(e, t, r) {
        var n = r;
        n.base = e("./base"), n["short"] = e("./short"), n.mont = e("./mont"), n.edwards = e("./edwards")
    }, {
        "./base": 71,
        "./edwards": 72,
        "./mont": 74,
        "./short": 75
    }],
    74: [function(e, t) {
        function r(e) {
            f.call(this, "mont", e), this.a = new o(e.a, 16).toRed(this.red), this.b = new o(e.b, 16).toRed(this.red), this.i4 = new o(4).toRed(this.red).redInvm(), this.two = new o(2).toRed(this.red), this.a24 = this.i4.redMul(this.a.redAdd(this.two))
        }

        function n(e, t, r) {
            f.BasePoint.call(this, e, "projective"), null === t && null === r ? (this.x = this.curve.one, this.z = this.curve.zero) : (this.x = new o(t, 16), this.z = new o(r, 16), this.x.red || (this.x = this.x.toRed(this.curve.red)), this.z.red || (this.z = this.z.toRed(this.curve.red)))
        } {
            var i = e("../curve"),
                s = e("../../elliptic"),
                o = e("bn.js"),
                a = e("inherits"),
                f = i.base;
            s.utils.getNAF, s.utils.assert
        }
        a(r, f), t.exports = r, r.prototype.point = function(e, t) {
            return new n(this, e, t)
        }, r.prototype.pointFromJSON = function(e) {
            return n.fromJSON(this, e)
        }, r.prototype.validate = function(e) {
            var t = e.normalize().x,
                r = t.redSqr(),
                n = r.redMul(t).redAdd(r.redMul(this.a)).redAdd(t),
                i = n.redSqrt();
            return 0 === i.redSqr().cmp(n)
        }, a(n, f.BasePoint), n.prototype.precompute = function() {}, n.fromJSON = function(e, t) {
            return new n(e, t[0], t[1] || e.one)
        }, n.prototype.inspect = function() {
            return this.isInfinity() ? "<EC Point Infinity>" : "<EC Point x: " + this.x.fromRed().toString(16, 2) + " z: " + this.z.fromRed().toString(16, 2) + ">"
        }, n.prototype.isInfinity = function() {
            return 0 === this.z.cmpn(0)
        }, n.prototype.dbl = function() {
            var e = this.x.redAdd(this.z),
                t = e.redSqr(),
                r = this.x.redSub(this.z),
                n = r.redSqr(),
                i = t.redSub(n),
                s = t.redMul(n),
                o = i.redMul(n.redAdd(this.curve.a24.redMul(i)));
            return this.curve.point(s, o)
        }, n.prototype.add = function() {
            throw new Error("Not supported on Montgomery curve")
        }, n.prototype.diffAdd = function(e, t) {
            var r = this.x.redAdd(this.z),
                n = this.x.redSub(this.z),
                i = e.x.redAdd(e.z),
                s = e.x.redSub(e.z),
                o = s.redMul(r),
                a = i.redMul(n),
                f = t.z.redMul(o.redAdd(a).redSqr()),
                c = t.x.redMul(o.redISub(a).redSqr());
            return this.curve.point(f, c)
        }, n.prototype.mul = function(e) {
            for (var t = e.clone(), r = this, n = this.curve.point(null, null), i = this, s = []; 0 !== t.cmpn(0); t.ishrn(1)) s.push(t.andln(1));
            for (var o = s.length - 1; o >= 0; o--) 0 === s[o] ? (r = r.diffAdd(n, i), n = n.dbl()) : (n = r.diffAdd(n, i), r = r.dbl());
            return n
        }, n.prototype.mulAdd = function() {
            throw new Error("Not supported on Montgomery curve")
        }, n.prototype.normalize = function() {
            return this.x = this.x.redMul(this.z.redInvm()), this.z = this.curve.one, this
        }, n.prototype.getX = function() {
            return this.normalize(), this.x.fromRed()
        }
    }, {
        "../../elliptic": 70,
        "../curve": 73,
        "bn.js": 68,
        inherits: 232
    }],
    75: [function(e, t) {
        function r(e) {
            c.call(this, "short", e), this.a = new a(e.a, 16).toRed(this.red), this.b = new a(e.b, 16).toRed(this.red), this.tinv = this.two.redInvm(), this.zeroA = 0 === this.a.fromRed().cmpn(0), this.threeA = 0 === this.a.fromRed().sub(this.p).cmpn(-3), this.endo = this._getEndomorphism(e), this._endoWnafT1 = new Array(4), this._endoWnafT2 = new Array(4)
        }

        function n(e, t, r, n) {
            c.BasePoint.call(this, e, "affine"), null === t && null === r ? (this.x = null, this.y = null, this.inf = !0) : (this.x = new a(t, 16), this.y = new a(r, 16), n && (this.x.forceRed(this.curve.red), this.y.forceRed(this.curve.red)), this.x.red || (this.x = this.x.toRed(this.curve.red)), this.y.red || (this.y = this.y.toRed(this.curve.red)), this.inf = !1)
        }

        function i(e, t, r, n) {
            c.BasePoint.call(this, e, "jacobian"), null === t && null === r && null === n ? (this.x = this.curve.one, this.y = this.curve.one, this.z = new a(0)) : (this.x = new a(t, 16), this.y = new a(r, 16), this.z = new a(n, 16)), this.x.red || (this.x = this.x.toRed(this.curve.red)), this.y.red || (this.y = this.y.toRed(this.curve.red)), this.z.red || (this.z = this.z.toRed(this.curve.red)), this.zOne = this.z === this.curve.one
        }
        var s = e("../curve"),
            o = e("../../elliptic"),
            a = e("bn.js"),
            f = e("inherits"),
            c = s.base,
            u = (o.utils.getNAF, o.utils.assert);
        f(r, c), t.exports = r, r.prototype._getEndomorphism = function(e) {
            if (this.zeroA && this.g && this.n && 1 === this.p.modn(3)) {
                var t, r;
                if (e.beta) t = new a(e.beta, 16).toRed(this.red);
                else {
                    var n = this._getEndoRoots(this.p);
                    t = n[0].cmp(n[1]) < 0 ? n[0] : n[1], t = t.toRed(this.red)
                }
                if (e.lambda) r = new a(e.lambda, 16);
                else {
                    var i = this._getEndoRoots(this.n);
                    0 === this.g.mul(i[0]).x.cmp(this.g.x.redMul(t)) ? r = i[0] : (r = i[1], u(0 === this.g.mul(r).x.cmp(this.g.x.redMul(t))))
                }
                var s;
                return s = e.basis ? e.basis.map(function(e) {
                    return {
                        a: new a(e.a, 16),
                        b: new a(e.b, 16)
                    }
                }) : this._getEndoBasis(r), {
                    beta: t,
                    lambda: r,
                    basis: s
                }
            }
        }, r.prototype._getEndoRoots = function(e) {
            var t = e === this.p ? this.red : a.mont(e),
                r = new a(2).toRed(t).redInvm(),
                n = r.redNeg(),
                i = (new a(1).toRed(t), new a(3).toRed(t).redNeg().redSqrt().redMul(r)),
                s = n.redAdd(i).fromRed(),
                o = n.redSub(i).fromRed();
            return [s, o]
        }, r.prototype._getEndoBasis = function(e) {
            for (var t, r, n, i, s, o, f, c = this.n.shrn(Math.floor(this.n.bitLength() / 2)), u = e, d = this.n.clone(), h = new a(1), p = new a(0), l = new a(0), b = new a(1), g = 0; 0 !== u.cmpn(0);) {
                var y = d.div(u),
                    m = d.sub(y.mul(u)),
                    v = l.sub(y.mul(h)),
                    _ = b.sub(y.mul(p));
                if (!n && m.cmp(c) < 0) t = f.neg(), r = h, n = m.neg(), i = v;
                else if (n && 2 === ++g) break;
                f = m, d = u, u = m, l = h, h = v, b = p, p = _
            }
            s = m.neg(), o = v;
            var w = n.sqr().add(i.sqr()),
                S = s.sqr().add(o.sqr());
            return S.cmp(w) >= 0 && (s = t, o = r), n.sign && (n = n.neg(), i = i.neg()), s.sign && (s = s.neg(), o = o.neg()), [{
                a: n,
                b: i
            }, {
                a: s,
                b: o
            }]
        }, r.prototype._endoSplit = function(e) {
            var t = this.endo.basis,
                r = t[0],
                n = t[1],
                i = n.b.mul(e).divRound(this.n),
                s = r.b.neg().mul(e).divRound(this.n),
                o = i.mul(r.a),
                a = s.mul(n.a),
                f = i.mul(r.b),
                c = s.mul(n.b),
                u = e.sub(o).sub(a),
                d = f.add(c).neg();
            return {
                k1: u,
                k2: d
            }
        }, r.prototype.point = function(e, t, r) {
            return new n(this, e, t, r)
        }, r.prototype.pointFromX = function(e, t) {
            t = new a(t, 16), t.red || (t = t.toRed(this.red));
            var r = t.redSqr().redMul(t).redIAdd(t.redMul(this.a)).redIAdd(this.b),
                n = r.redSqrt(),
                i = n.fromRed().isOdd();
            return (e && !i || !e && i) && (n = n.redNeg()), this.point(t, n)
        }, r.prototype.jpoint = function(e, t, r) {
            return new i(this, e, t, r)
        }, r.prototype.pointFromJSON = function(e, t) {
            return n.fromJSON(this, e, t)
        }, r.prototype.validate = function(e) {
            if (e.inf) return !0;
            var t = e.x,
                r = e.y,
                n = this.a.redMul(t),
                i = t.redSqr().redMul(t).redIAdd(n).redIAdd(this.b);
            return 0 === r.redSqr().redISub(i).cmpn(0)
        }, r.prototype._endoWnafMulAdd = function(e, t) {
            for (var r = this._endoWnafT1, n = this._endoWnafT2, i = 0; i < e.length; i++) {
                var s = this._endoSplit(t[i]),
                    o = e[i],
                    a = o._getBeta();
                s.k1.sign && (s.k1.sign = !s.k1.sign, o = o.neg(!0)), s.k2.sign && (s.k2.sign = !s.k2.sign, a = a.neg(!0)), r[2 * i] = o, r[2 * i + 1] = a, n[2 * i] = s.k1, n[2 * i + 1] = s.k2
            }
            for (var f = this._wnafMulAdd(1, r, n, 2 * i), c = 0; 2 * i > c; c++) r[c] = null, n[c] = null;
            return f
        }, f(n, c.BasePoint), n.prototype._getBeta = function() {
            function e(e) {
                return n.point(e.x.redMul(n.endo.beta), e.y)
            }
            if (this.curve.endo) {
                var t = this.precomputed;
                if (t && t.beta) return t.beta;
                var r = this.curve.point(this.x.redMul(this.curve.endo.beta), this.y);
                if (t) {
                    var n = this.curve;
                    t.beta = r, r.precomputed = {
                        beta: null,
                        naf: t.naf && {
                            wnd: t.naf.wnd,
                            points: t.naf.points.map(e)
                        },
                        doubles: t.doubles && {
                            step: t.doubles.step,
                            points: t.doubles.points.map(e)
                        }
                    }
                }
                return r
            }
        }, n.prototype.toJSON = function() {
            return this.precomputed ? [this.x, this.y, this.precomputed && {
                doubles: this.precomputed.doubles && {
                    step: this.precomputed.doubles.step,
                    points: this.precomputed.doubles.points.slice(1)
                },
                naf: this.precomputed.naf && {
                    wnd: this.precomputed.naf.wnd,
                    points: this.precomputed.naf.points.slice(1)
                }
            }] : [this.x, this.y]
        }, n.fromJSON = function(e, t, r) {
            function n(t) {
                return e.point(t[0], t[1], r)
            }
            "string" == typeof t && (t = JSON.parse(t));
            var i = e.point(t[0], t[1], r);
            if (!t[2]) return i;
            var s = t[2];
            return i.precomputed = {
                beta: null,
                doubles: s.doubles && {
                    step: s.doubles.step,
                    points: [i].concat(s.doubles.points.map(n))
                },
                naf: s.naf && {
                    wnd: s.naf.wnd,
                    points: [i].concat(s.naf.points.map(n))
                }
            }, i
        }, n.prototype.inspect = function() {
            return this.isInfinity() ? "<EC Point Infinity>" : "<EC Point x: " + this.x.fromRed().toString(16, 2) + " y: " + this.y.fromRed().toString(16, 2) + ">"
        }, n.prototype.isInfinity = function() {
            return this.inf
        }, n.prototype.add = function(e) {
            if (this.inf) return e;
            if (e.inf) return this;
            if (this.eq(e)) return this.dbl();
            if (this.neg().eq(e)) return this.curve.point(null, null);
            if (0 === this.x.cmp(e.x)) return this.curve.point(null, null);
            var t = this.y.redSub(e.y);
            0 !== t.cmpn(0) && (t = t.redMul(this.x.redSub(e.x).redInvm()));
            var r = t.redSqr().redISub(this.x).redISub(e.x),
                n = t.redMul(this.x.redSub(r)).redISub(this.y);
            return this.curve.point(r, n)
        }, n.prototype.dbl = function() {
            if (this.inf) return this;
            var e = this.y.redAdd(this.y);
            if (0 === e.cmpn(0)) return this.curve.point(null, null);
            var t = this.curve.a,
                r = this.x.redSqr(),
                n = e.redInvm(),
                i = r.redAdd(r).redIAdd(r).redIAdd(t).redMul(n),
                s = i.redSqr().redISub(this.x.redAdd(this.x)),
                o = i.redMul(this.x.redSub(s)).redISub(this.y);
            return this.curve.point(s, o)
        }, n.prototype.getX = function() {
            return this.x.fromRed()
        }, n.prototype.getY = function() {
            return this.y.fromRed()
        }, n.prototype.mul = function(e) {
            return e = new a(e, 16), this.precomputed && this.precomputed.doubles ? this.curve._fixedNafMul(this, e) : this.curve.endo ? this.curve._endoWnafMulAdd([this], [e]) : this.curve._wnafMul(this, e)
        }, n.prototype.mulAdd = function(e, t, r) {
            var n = [this, t],
                i = [e, r];
            return this.curve.endo ? this.curve._endoWnafMulAdd(n, i) : this.curve._wnafMulAdd(1, n, i, 2)
        }, n.prototype.eq = function(e) {
            return this === e || this.inf === e.inf && (this.inf || 0 === this.x.cmp(e.x) && 0 === this.y.cmp(e.y))
        }, n.prototype.neg = function(e) {
            function t(e) {
                return e.neg()
            }
            if (this.inf) return this;
            var r = this.curve.point(this.x, this.y.redNeg());
            if (e && this.precomputed) {
                var n = this.precomputed;
                r.precomputed = {
                    naf: n.naf && {
                        wnd: n.naf.wnd,
                        points: n.naf.points.map(t)
                    },
                    doubles: n.doubles && {
                        step: n.doubles.step,
                        points: n.doubles.points.map(t)
                    }
                }
            }
            return r
        }, n.prototype.toJ = function() {
            if (this.inf) return this.curve.jpoint(null, null, null);
            var e = this.curve.jpoint(this.x, this.y, this.curve.one);
            return e
        }, f(i, c.BasePoint), i.prototype.toP = function() {
            if (this.isInfinity()) return this.curve.point(null, null);
            var e = this.z.redInvm(),
                t = e.redSqr(),
                r = this.x.redMul(t),
                n = this.y.redMul(t).redMul(e);
            return this.curve.point(r, n)
        }, i.prototype.neg = function() {
            return this.curve.jpoint(this.x, this.y.redNeg(), this.z)
        }, i.prototype.add = function(e) {
            if (this.isInfinity()) return e;
            if (e.isInfinity()) return this;
            var t = e.z.redSqr(),
                r = this.z.redSqr(),
                n = this.x.redMul(t),
                i = e.x.redMul(r),
                s = this.y.redMul(t.redMul(e.z)),
                o = e.y.redMul(r.redMul(this.z)),
                a = n.redSub(i),
                f = s.redSub(o);
            if (0 === a.cmpn(0)) return 0 !== f.cmpn(0) ? this.curve.jpoint(null, null, null) : this.dbl();
            var c = a.redSqr(),
                u = c.redMul(a),
                d = n.redMul(c),
                h = f.redSqr().redIAdd(u).redISub(d).redISub(d),
                p = f.redMul(d.redISub(h)).redISub(s.redMul(u)),
                l = this.z.redMul(e.z).redMul(a);
            return this.curve.jpoint(h, p, l)
        }, i.prototype.mixedAdd = function(e) {
            if (this.isInfinity()) return e.toJ();
            if (e.isInfinity()) return this;
            var t = this.z.redSqr(),
                r = this.x,
                n = e.x.redMul(t),
                i = this.y,
                s = e.y.redMul(t).redMul(this.z),
                o = r.redSub(n),
                a = i.redSub(s);
            if (0 === o.cmpn(0)) return 0 !== a.cmpn(0) ? this.curve.jpoint(null, null, null) : this.dbl();
            var f = o.redSqr(),
                c = f.redMul(o),
                u = r.redMul(f),
                d = a.redSqr().redIAdd(c).redISub(u).redISub(u),
                h = a.redMul(u.redISub(d)).redISub(i.redMul(c)),
                p = this.z.redMul(o);
            return this.curve.jpoint(d, h, p)
        }, i.prototype.dblp = function(e) {
            if (0 === e) return this;
            if (this.isInfinity()) return this;
            if (!e) return this.dbl();
            if (this.curve.zeroA || this.curve.threeA) {
                for (var t = this, r = 0; e > r; r++) t = t.dbl();
                return t
            }
            for (var n = this.curve.a, i = this.curve.tinv, s = this.x, o = this.y, a = this.z, f = a.redSqr().redSqr(), c = o.redAdd(o), r = 0; e > r; r++) {
                var u = s.redSqr(),
                    d = c.redSqr(),
                    h = d.redSqr(),
                    p = u.redAdd(u).redIAdd(u).redIAdd(n.redMul(f)),
                    l = s.redMul(d),
                    b = p.redSqr().redISub(l.redAdd(l)),
                    g = l.redISub(b),
                    y = p.redMul(g);
                y = y.redIAdd(y).redISub(h);
                var m = c.redMul(a);
                e > r + 1 && (f = f.redMul(h)), s = b, a = m, c = y
            }
            return this.curve.jpoint(s, c.redMul(i), a)
        }, i.prototype.dbl = function() {
            return this.isInfinity() ? this : this.curve.zeroA ? this._zeroDbl() : this.curve.threeA ? this._threeDbl() : this._dbl()
        }, i.prototype._zeroDbl = function() {
            if (this.zOne) {
                var e = this.x.redSqr(),
                    t = this.y.redSqr(),
                    r = t.redSqr(),
                    n = this.x.redAdd(t).redSqr().redISub(e).redISub(r);
                n = n.redIAdd(n);
                var i = e.redAdd(e).redIAdd(e),
                    s = i.redSqr().redISub(n).redISub(n),
                    o = r.redIAdd(r);
                o = o.redIAdd(o), o = o.redIAdd(o);
                var a = s,
                    f = i.redMul(n.redISub(s)).redISub(o),
                    c = this.y.redAdd(this.y)
            } else {
                var u = this.x.redSqr(),
                    d = this.y.redSqr(),
                    h = d.redSqr(),
                    p = this.x.redAdd(d).redSqr().redISub(u).redISub(h);
                p = p.redIAdd(p);
                var l = u.redAdd(u).redIAdd(u),
                    b = l.redSqr(),
                    g = h.redIAdd(h);
                g = g.redIAdd(g), g = g.redIAdd(g);
                var a = b.redISub(p).redISub(p),
                    f = l.redMul(p.redISub(a)).redISub(g),
                    c = this.y.redMul(this.z);
                c = c.redIAdd(c)
            }
            return this.curve.jpoint(a, f, c)
        }, i.prototype._threeDbl = function() {
            if (this.zOne) {
                var e = this.x.redSqr(),
                    t = this.y.redSqr(),
                    r = t.redSqr(),
                    n = this.x.redAdd(t).redSqr().redISub(e).redISub(r);
                n = n.redIAdd(n);
                var i = e.redAdd(e).redIAdd(e).redIAdd(this.curve.a),
                    s = i.redSqr().redISub(n).redISub(n),
                    o = s,
                    a = r.redIAdd(r);
                a = a.redIAdd(a), a = a.redIAdd(a);
                var f = i.redMul(n.redISub(s)).redISub(a),
                    c = this.y.redAdd(this.y)
            } else {
                var u = this.z.redSqr(),
                    d = this.y.redSqr(),
                    h = this.x.redMul(d),
                    p = this.x.redSub(u).redMul(this.x.redAdd(u));
                p = p.redAdd(p).redIAdd(p);
                var l = h.redIAdd(h);
                l = l.redIAdd(l);
                var b = l.redAdd(l),
                    o = p.redSqr().redISub(b),
                    c = this.y.redAdd(this.z).redSqr().redISub(d).redISub(u),
                    g = d.redSqr();
                g = g.redIAdd(g), g = g.redIAdd(g), g = g.redIAdd(g);
                var f = p.redMul(l.redISub(o)).redISub(g)
            }
            return this.curve.jpoint(o, f, c)
        }, i.prototype._dbl = function() {
            var e = this.curve.a,
                t = (this.curve.tinv, this.x),
                r = this.y,
                n = this.z,
                i = n.redSqr().redSqr(),
                s = t.redSqr(),
                o = r.redSqr(),
                a = s.redAdd(s).redIAdd(s).redIAdd(e.redMul(i)),
                f = t.redAdd(t);
            f = f.redIAdd(f);
            var c = f.redMul(o),
                u = a.redSqr().redISub(c.redAdd(c)),
                d = c.redISub(u),
                h = o.redSqr();
            h = h.redIAdd(h), h = h.redIAdd(h), h = h.redIAdd(h);
            var p = a.redMul(d).redISub(h),
                l = r.redAdd(r).redMul(n);
            return this.curve.jpoint(u, p, l)
        }, i.prototype.trpl = function() {
            if (!this.curve.zeroA) return this.dbl().add(this);
            var e = this.x.redSqr(),
                t = this.y.redSqr(),
                r = this.z.redSqr(),
                n = t.redSqr(),
                i = e.redAdd(e).redIAdd(e),
                s = i.redSqr(),
                o = this.x.redAdd(t).redSqr().redISub(e).redISub(n);
            o = o.redIAdd(o), o = o.redAdd(o).redIAdd(o), o = o.redISub(s);
            var a = o.redSqr(),
                f = n.redIAdd(n);
            f = f.redIAdd(f), f = f.redIAdd(f), f = f.redIAdd(f);
            var c = i.redIAdd(o).redSqr().redISub(s).redISub(a).redISub(f),
                u = t.redMul(c);
            u = u.redIAdd(u), u = u.redIAdd(u);
            var d = this.x.redMul(a).redISub(u);
            d = d.redIAdd(d), d = d.redIAdd(d);
            var h = this.y.redMul(c.redMul(f.redISub(c)).redISub(o.redMul(a)));
            h = h.redIAdd(h), h = h.redIAdd(h), h = h.redIAdd(h);
            var p = this.z.redAdd(o).redSqr().redISub(r).redISub(a);
            return this.curve.jpoint(d, h, p)
        }, i.prototype.mul = function(e, t) {
            return e = new a(e, t), this.curve._wnafMul(this, e)
        }, i.prototype.eq = function(e) {
            if ("affine" === e.type) return this.eq(e.toJ());
            if (this === e) return !0;
            var t = this.z.redSqr(),
                r = e.z.redSqr();
            if (0 !== this.x.redMul(r).redISub(e.x.redMul(t)).cmpn(0)) return !1;
            var n = t.redMul(this.z),
                i = r.redMul(e.z);
            return 0 === this.y.redMul(i).redISub(e.y.redMul(n)).cmpn(0)
        }, i.prototype.inspect = function() {
            return this.isInfinity() ? "<EC JPoint Infinity>" : "<EC JPoint x: " + this.x.toString(16, 2) + " y: " + this.y.toString(16, 2) + " z: " + this.z.toString(16, 2) + ">"
        }, i.prototype.isInfinity = function() {
            return 0 === this.z.cmpn(0)
        }
    }, {
        "../../elliptic": 70,
        "../curve": 73,
        "bn.js": 68,
        inherits: 232
    }],
    76: [function(e, t, r) {
        function n(e) {
            this.curve = "short" === e.type ? new a.curve["short"](e) : "edwards" === e.type ? new a.curve.edwards(e) : new a.curve.mont(e), this.g = this.curve.g, this.n = this.curve.n, this.hash = e.hash, f(this.g.validate(), "Invalid curve"), f(this.g.mul(this.n).isInfinity(), "Invalid curve, G*N != O")
        }

        function i(e, t) {
            Object.defineProperty(s, e, {
                configurable: !0,
                enumerable: !0,
                get: function() {
                    var r = new n(t);
                    return Object.defineProperty(s, e, {
                        configurable: !0,
                        enumerable: !0,
                        value: r
                    }), r
                }
            })
        }
        var s = r,
            o = e("hash.js"),
            a = (e("bn.js"), e("../elliptic")),
            f = a.utils.assert;
        s.PresetCurve = n, i("p192", {
            type: "short",
            prime: "p192",
            p: "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff",
            a: "ffffffff ffffffff ffffffff fffffffe ffffffff fffffffc",
            b: "64210519 e59c80e7 0fa7e9ab 72243049 feb8deec c146b9b1",
            n: "ffffffff ffffffff ffffffff 99def836 146bc9b1 b4d22831",
            hash: o.sha256,
            gRed: !1,
            g: ["188da80e b03090f6 7cbf20eb 43a18800 f4ff0afd 82ff1012", "07192b95 ffc8da78 631011ed 6b24cdd5 73f977a1 1e794811"]
        }), i("p224", {
            type: "short",
            prime: "p224",
            p: "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001",
            a: "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff fffffffe",
            b: "b4050a85 0c04b3ab f5413256 5044b0b7 d7bfd8ba 270b3943 2355ffb4",
            n: "ffffffff ffffffff ffffffff ffff16a2 e0b8f03e 13dd2945 5c5c2a3d",
            hash: o.sha256,
            gRed: !1,
            g: ["b70e0cbd 6bb4bf7f 321390b9 4a03c1d3 56c21122 343280d6 115c1d21", "bd376388 b5f723fb 4c22dfe6 cd4375a0 5a074764 44d58199 85007e34"]
        }), i("p256", {
            type: "short",
            prime: null,
            p: "ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff ffffffff",
            a: "ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff fffffffc",
            b: "5ac635d8 aa3a93e7 b3ebbd55 769886bc 651d06b0 cc53b0f6 3bce3c3e 27d2604b",
            n: "ffffffff 00000000 ffffffff ffffffff bce6faad a7179e84 f3b9cac2 fc632551",
            hash: o.sha256,
            gRed: !1,
            g: ["6b17d1f2 e12c4247 f8bce6e5 63a440f2 77037d81 2deb33a0 f4a13945 d898c296", "4fe342e2 fe1a7f9b 8ee7eb4a 7c0f9e16 2bce3357 6b315ece cbb64068 37bf51f5"]
        }), i("curve25519", {
            type: "mont",
            prime: "p25519",
            p: "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed",
            a: "76d06",
            b: "0",
            n: "1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed",
            hash: o.sha256,
            gRed: !1,
            g: ["9"]
        }), i("ed25519", {
            type: "edwards",
            prime: "p25519",
            p: "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed",
            a: "-1",
            c: "1",
            d: "52036cee2b6ffe73 8cc740797779e898 00700a4d4141d8ab 75eb4dca135978a3",
            n: "1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed",
            hash: o.sha256,
            gRed: !1,
            g: ["216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a", "6666666666666666666666666666666666666666666666666666666666666658"]
        }), i("secp256k1", {
            type: "short",
            prime: "k256",
            p: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f",
            a: "0",
            b: "7",
            n: "ffffffff ffffffff ffffffff fffffffe baaedce6 af48a03b bfd25e8c d0364141",
            h: "1",
            hash: o.sha256,
            beta: "7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee",
            lambda: "5363ad4cc05c30e0a5261c028812645a122e22ea20816678df02967c1b23bd72",
            basis: [{
                a: "3086d221a7d46bcde86c90e49284eb15",
                b: "-e4437ed6010e88286f547fa90abfe4c3"
            }, {
                a: "114ca50f7a8e2f3f657c1108d9d44cfd8",
                b: "3086d221a7d46bcde86c90e49284eb15"
            }],
            gRed: !1,
            g: ["79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798", "483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8", {
                doubles: {
                    step: 4,
                    points: [
                        ["e60fce93b59e9ec53011aabc21c23e97b2a31369b87a5ae9c44ee89e2a6dec0a", "f7e3507399e595929db99f34f57937101296891e44d23f0be1f32cce69616821"],
                        ["8282263212c609d9ea2a6e3e172de238d8c39cabd5ac1ca10646e23fd5f51508", "11f8a8098557dfe45e8256e830b60ace62d613ac2f7b17bed31b6eaff6e26caf"],
                        ["175e159f728b865a72f99cc6c6fc846de0b93833fd2222ed73fce5b551e5b739", "d3506e0d9e3c79eba4ef97a51ff71f5eacb5955add24345c6efa6ffee9fed695"],
                        ["363d90d447b00c9c99ceac05b6262ee053441c7e55552ffe526bad8f83ff4640", "4e273adfc732221953b445397f3363145b9a89008199ecb62003c7f3bee9de9"],
                        ["8b4b5f165df3c2be8c6244b5b745638843e4a781a15bcd1b69f79a55dffdf80c", "4aad0a6f68d308b4b3fbd7813ab0da04f9e336546162ee56b3eff0c65fd4fd36"],
                        ["723cbaa6e5db996d6bf771c00bd548c7b700dbffa6c0e77bcb6115925232fcda", "96e867b5595cc498a921137488824d6e2660a0653779494801dc069d9eb39f5f"],
                        ["eebfa4d493bebf98ba5feec812c2d3b50947961237a919839a533eca0e7dd7fa", "5d9a8ca3970ef0f269ee7edaf178089d9ae4cdc3a711f712ddfd4fdae1de8999"],
                        ["100f44da696e71672791d0a09b7bde459f1215a29b3c03bfefd7835b39a48db0", "cdd9e13192a00b772ec8f3300c090666b7ff4a18ff5195ac0fbd5cd62bc65a09"],
                        ["e1031be262c7ed1b1dc9227a4a04c017a77f8d4464f3b3852c8acde6e534fd2d", "9d7061928940405e6bb6a4176597535af292dd419e1ced79a44f18f29456a00d"],
                        ["feea6cae46d55b530ac2839f143bd7ec5cf8b266a41d6af52d5e688d9094696d", "e57c6b6c97dce1bab06e4e12bf3ecd5c981c8957cc41442d3155debf18090088"],
                        ["da67a91d91049cdcb367be4be6ffca3cfeed657d808583de33fa978bc1ec6cb1", "9bacaa35481642bc41f463f7ec9780e5dec7adc508f740a17e9ea8e27a68be1d"],
                        ["53904faa0b334cdda6e000935ef22151ec08d0f7bb11069f57545ccc1a37b7c0", "5bc087d0bc80106d88c9eccac20d3c1c13999981e14434699dcb096b022771c8"],
                        ["8e7bcd0bd35983a7719cca7764ca906779b53a043a9b8bcaeff959f43ad86047", "10b7770b2a3da4b3940310420ca9514579e88e2e47fd68b3ea10047e8460372a"],
                        ["385eed34c1cdff21e6d0818689b81bde71a7f4f18397e6690a841e1599c43862", "283bebc3e8ea23f56701de19e9ebf4576b304eec2086dc8cc0458fe5542e5453"],
                        ["6f9d9b803ecf191637c73a4413dfa180fddf84a5947fbc9c606ed86c3fac3a7", "7c80c68e603059ba69b8e2a30e45c4d47ea4dd2f5c281002d86890603a842160"],
                        ["3322d401243c4e2582a2147c104d6ecbf774d163db0f5e5313b7e0e742d0e6bd", "56e70797e9664ef5bfb019bc4ddaf9b72805f63ea2873af624f3a2e96c28b2a0"],
                        ["85672c7d2de0b7da2bd1770d89665868741b3f9af7643397721d74d28134ab83", "7c481b9b5b43b2eb6374049bfa62c2e5e77f17fcc5298f44c8e3094f790313a6"],
                        ["948bf809b1988a46b06c9f1919413b10f9226c60f668832ffd959af60c82a0a", "53a562856dcb6646dc6b74c5d1c3418c6d4dff08c97cd2bed4cb7f88d8c8e589"],
                        ["6260ce7f461801c34f067ce0f02873a8f1b0e44dfc69752accecd819f38fd8e8", "bc2da82b6fa5b571a7f09049776a1ef7ecd292238051c198c1a84e95b2b4ae17"],
                        ["e5037de0afc1d8d43d8348414bbf4103043ec8f575bfdc432953cc8d2037fa2d", "4571534baa94d3b5f9f98d09fb990bddbd5f5b03ec481f10e0e5dc841d755bda"],
                        ["e06372b0f4a207adf5ea905e8f1771b4e7e8dbd1c6a6c5b725866a0ae4fce725", "7a908974bce18cfe12a27bb2ad5a488cd7484a7787104870b27034f94eee31dd"],
                        ["213c7a715cd5d45358d0bbf9dc0ce02204b10bdde2a3f58540ad6908d0559754", "4b6dad0b5ae462507013ad06245ba190bb4850f5f36a7eeddff2c27534b458f2"],
                        ["4e7c272a7af4b34e8dbb9352a5419a87e2838c70adc62cddf0cc3a3b08fbd53c", "17749c766c9d0b18e16fd09f6def681b530b9614bff7dd33e0b3941817dcaae6"],
                        ["fea74e3dbe778b1b10f238ad61686aa5c76e3db2be43057632427e2840fb27b6", "6e0568db9b0b13297cf674deccb6af93126b596b973f7b77701d3db7f23cb96f"],
                        ["76e64113f677cf0e10a2570d599968d31544e179b760432952c02a4417bdde39", "c90ddf8dee4e95cf577066d70681f0d35e2a33d2b56d2032b4b1752d1901ac01"],
                        ["c738c56b03b2abe1e8281baa743f8f9a8f7cc643df26cbee3ab150242bcbb891", "893fb578951ad2537f718f2eacbfbbbb82314eef7880cfe917e735d9699a84c3"],
                        ["d895626548b65b81e264c7637c972877d1d72e5f3a925014372e9f6588f6c14b", "febfaa38f2bc7eae728ec60818c340eb03428d632bb067e179363ed75d7d991f"],
                        ["b8da94032a957518eb0f6433571e8761ceffc73693e84edd49150a564f676e03", "2804dfa44805a1e4d7c99cc9762808b092cc584d95ff3b511488e4e74efdf6e7"],
                        ["e80fea14441fb33a7d8adab9475d7fab2019effb5156a792f1a11778e3c0df5d", "eed1de7f638e00771e89768ca3ca94472d155e80af322ea9fcb4291b6ac9ec78"],
                        ["a301697bdfcd704313ba48e51d567543f2a182031efd6915ddc07bbcc4e16070", "7370f91cfb67e4f5081809fa25d40f9b1735dbf7c0a11a130c0d1a041e177ea1"],
                        ["90ad85b389d6b936463f9d0512678de208cc330b11307fffab7ac63e3fb04ed4", "e507a3620a38261affdcbd9427222b839aefabe1582894d991d4d48cb6ef150"],
                        ["8f68b9d2f63b5f339239c1ad981f162ee88c5678723ea3351b7b444c9ec4c0da", "662a9f2dba063986de1d90c2b6be215dbbea2cfe95510bfdf23cbf79501fff82"],
                        ["e4f3fb0176af85d65ff99ff9198c36091f48e86503681e3e6686fd5053231e11", "1e63633ad0ef4f1c1661a6d0ea02b7286cc7e74ec951d1c9822c38576feb73bc"],
                        ["8c00fa9b18ebf331eb961537a45a4266c7034f2f0d4e1d0716fb6eae20eae29e", "efa47267fea521a1a9dc343a3736c974c2fadafa81e36c54e7d2a4c66702414b"],
                        ["e7a26ce69dd4829f3e10cec0a9e98ed3143d084f308b92c0997fddfc60cb3e41", "2a758e300fa7984b471b006a1aafbb18d0a6b2c0420e83e20e8a9421cf2cfd51"],
                        ["b6459e0ee3662ec8d23540c223bcbdc571cbcb967d79424f3cf29eb3de6b80ef", "67c876d06f3e06de1dadf16e5661db3c4b3ae6d48e35b2ff30bf0b61a71ba45"],
                        ["d68a80c8280bb840793234aa118f06231d6f1fc67e73c5a5deda0f5b496943e8", "db8ba9fff4b586d00c4b1f9177b0e28b5b0e7b8f7845295a294c84266b133120"],
                        ["324aed7df65c804252dc0270907a30b09612aeb973449cea4095980fc28d3d5d", "648a365774b61f2ff130c0c35aec1f4f19213b0c7e332843967224af96ab7c84"],
                        ["4df9c14919cde61f6d51dfdbe5fee5dceec4143ba8d1ca888e8bd373fd054c96", "35ec51092d8728050974c23a1d85d4b5d506cdc288490192ebac06cad10d5d"],
                        ["9c3919a84a474870faed8a9c1cc66021523489054d7f0308cbfc99c8ac1f98cd", "ddb84f0f4a4ddd57584f044bf260e641905326f76c64c8e6be7e5e03d4fc599d"],
                        ["6057170b1dd12fdf8de05f281d8e06bb91e1493a8b91d4cc5a21382120a959e5", "9a1af0b26a6a4807add9a2daf71df262465152bc3ee24c65e899be932385a2a8"],
                        ["a576df8e23a08411421439a4518da31880cef0fba7d4df12b1a6973eecb94266", "40a6bf20e76640b2c92b97afe58cd82c432e10a7f514d9f3ee8be11ae1b28ec8"],
                        ["7778a78c28dec3e30a05fe9629de8c38bb30d1f5cf9a3a208f763889be58ad71", "34626d9ab5a5b22ff7098e12f2ff580087b38411ff24ac563b513fc1fd9f43ac"],
                        ["928955ee637a84463729fd30e7afd2ed5f96274e5ad7e5cb09eda9c06d903ac", "c25621003d3f42a827b78a13093a95eeac3d26efa8a8d83fc5180e935bcd091f"],
                        ["85d0fef3ec6db109399064f3a0e3b2855645b4a907ad354527aae75163d82751", "1f03648413a38c0be29d496e582cf5663e8751e96877331582c237a24eb1f962"],
                        ["ff2b0dce97eece97c1c9b6041798b85dfdfb6d8882da20308f5404824526087e", "493d13fef524ba188af4c4dc54d07936c7b7ed6fb90e2ceb2c951e01f0c29907"],
                        ["827fbbe4b1e880ea9ed2b2e6301b212b57f1ee148cd6dd28780e5e2cf856e241", "c60f9c923c727b0b71bef2c67d1d12687ff7a63186903166d605b68baec293ec"],
                        ["eaa649f21f51bdbae7be4ae34ce6e5217a58fdce7f47f9aa7f3b58fa2120e2b3", "be3279ed5bbbb03ac69a80f89879aa5a01a6b965f13f7e59d47a5305ba5ad93d"],
                        ["e4a42d43c5cf169d9391df6decf42ee541b6d8f0c9a137401e23632dda34d24f", "4d9f92e716d1c73526fc99ccfb8ad34ce886eedfa8d8e4f13a7f7131deba9414"],
                        ["1ec80fef360cbdd954160fadab352b6b92b53576a88fea4947173b9d4300bf19", "aeefe93756b5340d2f3a4958a7abbf5e0146e77f6295a07b671cdc1cc107cefd"],
                        ["146a778c04670c2f91b00af4680dfa8bce3490717d58ba889ddb5928366642be", "b318e0ec3354028add669827f9d4b2870aaa971d2f7e5ed1d0b297483d83efd0"],
                        ["fa50c0f61d22e5f07e3acebb1aa07b128d0012209a28b9776d76a8793180eef9", "6b84c6922397eba9b72cd2872281a68a5e683293a57a213b38cd8d7d3f4f2811"],
                        ["da1d61d0ca721a11b1a5bf6b7d88e8421a288ab5d5bba5220e53d32b5f067ec2", "8157f55a7c99306c79c0766161c91e2966a73899d279b48a655fba0f1ad836f1"],
                        ["a8e282ff0c9706907215ff98e8fd416615311de0446f1e062a73b0610d064e13", "7f97355b8db81c09abfb7f3c5b2515888b679a3e50dd6bd6cef7c73111f4cc0c"],
                        ["174a53b9c9a285872d39e56e6913cab15d59b1fa512508c022f382de8319497c", "ccc9dc37abfc9c1657b4155f2c47f9e6646b3a1d8cb9854383da13ac079afa73"],
                        ["959396981943785c3d3e57edf5018cdbe039e730e4918b3d884fdff09475b7ba", "2e7e552888c331dd8ba0386a4b9cd6849c653f64c8709385e9b8abf87524f2fd"],
                        ["d2a63a50ae401e56d645a1153b109a8fcca0a43d561fba2dbb51340c9d82b151", "e82d86fb6443fcb7565aee58b2948220a70f750af484ca52d4142174dcf89405"],
                        ["64587e2335471eb890ee7896d7cfdc866bacbdbd3839317b3436f9b45617e073", "d99fcdd5bf6902e2ae96dd6447c299a185b90a39133aeab358299e5e9faf6589"],
                        ["8481bde0e4e4d885b3a546d3e549de042f0aa6cea250e7fd358d6c86dd45e458", "38ee7b8cba5404dd84a25bf39cecb2ca900a79c42b262e556d64b1b59779057e"],
                        ["13464a57a78102aa62b6979ae817f4637ffcfed3c4b1ce30bcd6303f6caf666b", "69be159004614580ef7e433453ccb0ca48f300a81d0942e13f495a907f6ecc27"],
                        ["bc4a9df5b713fe2e9aef430bcc1dc97a0cd9ccede2f28588cada3a0d2d83f366", "d3a81ca6e785c06383937adf4b798caa6e8a9fbfa547b16d758d666581f33c1"],
                        ["8c28a97bf8298bc0d23d8c749452a32e694b65e30a9472a3954ab30fe5324caa", "40a30463a3305193378fedf31f7cc0eb7ae784f0451cb9459e71dc73cbef9482"],
                        ["8ea9666139527a8c1dd94ce4f071fd23c8b350c5a4bb33748c4ba111faccae0", "620efabbc8ee2782e24e7c0cfb95c5d735b783be9cf0f8e955af34a30e62b945"],
                        ["dd3625faef5ba06074669716bbd3788d89bdde815959968092f76cc4eb9a9787", "7a188fa3520e30d461da2501045731ca941461982883395937f68d00c644a573"],
                        ["f710d79d9eb962297e4f6232b40e8f7feb2bc63814614d692c12de752408221e", "ea98e67232d3b3295d3b535532115ccac8612c721851617526ae47a9c77bfc82"]
                    ]
                },
                naf: {
                    wnd: 7,
                    points: [
                        ["f9308a019258c31049344f85f89d5229b531c845836f99b08601f113bce036f9", "388f7b0f632de8140fe337e62a37f3566500a99934c2231b6cb9fd7584b8e672"],
                        ["2f8bde4d1a07209355b4a7250a5c5128e88b84bddc619ab7cba8d569b240efe4", "d8ac222636e5e3d6d4dba9dda6c9c426f788271bab0d6840dca87d3aa6ac62d6"],
                        ["5cbdf0646e5db4eaa398f365f2ea7a0e3d419b7e0330e39ce92bddedcac4f9bc", "6aebca40ba255960a3178d6d861a54dba813d0b813fde7b5a5082628087264da"],
                        ["acd484e2f0c7f65309ad178a9f559abde09796974c57e714c35f110dfc27ccbe", "cc338921b0a7d9fd64380971763b61e9add888a4375f8e0f05cc262ac64f9c37"],
                        ["774ae7f858a9411e5ef4246b70c65aac5649980be5c17891bbec17895da008cb", "d984a032eb6b5e190243dd56d7b7b365372db1e2dff9d6a8301d74c9c953c61b"],
                        ["f28773c2d975288bc7d1d205c3748651b075fbc6610e58cddeeddf8f19405aa8", "ab0902e8d880a89758212eb65cdaf473a1a06da521fa91f29b5cb52db03ed81"],
                        ["d7924d4f7d43ea965a465ae3095ff41131e5946f3c85f79e44adbcf8e27e080e", "581e2872a86c72a683842ec228cc6defea40af2bd896d3a5c504dc9ff6a26b58"],
                        ["defdea4cdb677750a420fee807eacf21eb9898ae79b9768766e4faa04a2d4a34", "4211ab0694635168e997b0ead2a93daeced1f4a04a95c0f6cfb199f69e56eb77"],
                        ["2b4ea0a797a443d293ef5cff444f4979f06acfebd7e86d277475656138385b6c", "85e89bc037945d93b343083b5a1c86131a01f60c50269763b570c854e5c09b7a"],
                        ["352bbf4a4cdd12564f93fa332ce333301d9ad40271f8107181340aef25be59d5", "321eb4075348f534d59c18259dda3e1f4a1b3b2e71b1039c67bd3d8bcf81998c"],
                        ["2fa2104d6b38d11b0230010559879124e42ab8dfeff5ff29dc9cdadd4ecacc3f", "2de1068295dd865b64569335bd5dd80181d70ecfc882648423ba76b532b7d67"],
                        ["9248279b09b4d68dab21a9b066edda83263c3d84e09572e269ca0cd7f5453714", "73016f7bf234aade5d1aa71bdea2b1ff3fc0de2a887912ffe54a32ce97cb3402"],
                        ["daed4f2be3a8bf278e70132fb0beb7522f570e144bf615c07e996d443dee8729", "a69dce4a7d6c98e8d4a1aca87ef8d7003f83c230f3afa726ab40e52290be1c55"],
                        ["c44d12c7065d812e8acf28d7cbb19f9011ecd9e9fdf281b0e6a3b5e87d22e7db", "2119a460ce326cdc76c45926c982fdac0e106e861edf61c5a039063f0e0e6482"],
                        ["6a245bf6dc698504c89a20cfded60853152b695336c28063b61c65cbd269e6b4", "e022cf42c2bd4a708b3f5126f16a24ad8b33ba48d0423b6efd5e6348100d8a82"],
                        ["1697ffa6fd9de627c077e3d2fe541084ce13300b0bec1146f95ae57f0d0bd6a5", "b9c398f186806f5d27561506e4557433a2cf15009e498ae7adee9d63d01b2396"],
                        ["605bdb019981718b986d0f07e834cb0d9deb8360ffb7f61df982345ef27a7479", "2972d2de4f8d20681a78d93ec96fe23c26bfae84fb14db43b01e1e9056b8c49"],
                        ["62d14dab4150bf497402fdc45a215e10dcb01c354959b10cfe31c7e9d87ff33d", "80fc06bd8cc5b01098088a1950eed0db01aa132967ab472235f5642483b25eaf"],
                        ["80c60ad0040f27dade5b4b06c408e56b2c50e9f56b9b8b425e555c2f86308b6f", "1c38303f1cc5c30f26e66bad7fe72f70a65eed4cbe7024eb1aa01f56430bd57a"],
                        ["7a9375ad6167ad54aa74c6348cc54d344cc5dc9487d847049d5eabb0fa03c8fb", "d0e3fa9eca8726909559e0d79269046bdc59ea10c70ce2b02d499ec224dc7f7"],
                        ["d528ecd9b696b54c907a9ed045447a79bb408ec39b68df504bb51f459bc3ffc9", "eecf41253136e5f99966f21881fd656ebc4345405c520dbc063465b521409933"],
                        ["49370a4b5f43412ea25f514e8ecdad05266115e4a7ecb1387231808f8b45963", "758f3f41afd6ed428b3081b0512fd62a54c3f3afbb5b6764b653052a12949c9a"],
                        ["77f230936ee88cbbd73df930d64702ef881d811e0e1498e2f1c13eb1fc345d74", "958ef42a7886b6400a08266e9ba1b37896c95330d97077cbbe8eb3c7671c60d6"],
                        ["f2dac991cc4ce4b9ea44887e5c7c0bce58c80074ab9d4dbaeb28531b7739f530", "e0dedc9b3b2f8dad4da1f32dec2531df9eb5fbeb0598e4fd1a117dba703a3c37"],
                        ["463b3d9f662621fb1b4be8fbbe2520125a216cdfc9dae3debcba4850c690d45b", "5ed430d78c296c3543114306dd8622d7c622e27c970a1de31cb377b01af7307e"],
                        ["f16f804244e46e2a09232d4aff3b59976b98fac14328a2d1a32496b49998f247", "cedabd9b82203f7e13d206fcdf4e33d92a6c53c26e5cce26d6579962c4e31df6"],
                        ["caf754272dc84563b0352b7a14311af55d245315ace27c65369e15f7151d41d1", "cb474660ef35f5f2a41b643fa5e460575f4fa9b7962232a5c32f908318a04476"],
                        ["2600ca4b282cb986f85d0f1709979d8b44a09c07cb86d7c124497bc86f082120", "4119b88753c15bd6a693b03fcddbb45d5ac6be74ab5f0ef44b0be9475a7e4b40"],
                        ["7635ca72d7e8432c338ec53cd12220bc01c48685e24f7dc8c602a7746998e435", "91b649609489d613d1d5e590f78e6d74ecfc061d57048bad9e76f302c5b9c61"],
                        ["754e3239f325570cdbbf4a87deee8a66b7f2b33479d468fbc1a50743bf56cc18", "673fb86e5bda30fb3cd0ed304ea49a023ee33d0197a695d0c5d98093c536683"],
                        ["e3e6bd1071a1e96aff57859c82d570f0330800661d1c952f9fe2694691d9b9e8", "59c9e0bba394e76f40c0aa58379a3cb6a5a2283993e90c4167002af4920e37f5"],
                        ["186b483d056a033826ae73d88f732985c4ccb1f32ba35f4b4cc47fdcf04aa6eb", "3b952d32c67cf77e2e17446e204180ab21fb8090895138b4a4a797f86e80888b"],
                        ["df9d70a6b9876ce544c98561f4be4f725442e6d2b737d9c91a8321724ce0963f", "55eb2dafd84d6ccd5f862b785dc39d4ab157222720ef9da217b8c45cf2ba2417"],
                        ["5edd5cc23c51e87a497ca815d5dce0f8ab52554f849ed8995de64c5f34ce7143", "efae9c8dbc14130661e8cec030c89ad0c13c66c0d17a2905cdc706ab7399a868"],
                        ["290798c2b6476830da12fe02287e9e777aa3fba1c355b17a722d362f84614fba", "e38da76dcd440621988d00bcf79af25d5b29c094db2a23146d003afd41943e7a"],
                        ["af3c423a95d9f5b3054754efa150ac39cd29552fe360257362dfdecef4053b45", "f98a3fd831eb2b749a93b0e6f35cfb40c8cd5aa667a15581bc2feded498fd9c6"],
                        ["766dbb24d134e745cccaa28c99bf274906bb66b26dcf98df8d2fed50d884249a", "744b1152eacbe5e38dcc887980da38b897584a65fa06cedd2c924f97cbac5996"],
                        ["59dbf46f8c94759ba21277c33784f41645f7b44f6c596a58ce92e666191abe3e", "c534ad44175fbc300f4ea6ce648309a042ce739a7919798cd85e216c4a307f6e"],
                        ["f13ada95103c4537305e691e74e9a4a8dd647e711a95e73cb62dc6018cfd87b8", "e13817b44ee14de663bf4bc808341f326949e21a6a75c2570778419bdaf5733d"],
                        ["7754b4fa0e8aced06d4167a2c59cca4cda1869c06ebadfb6488550015a88522c", "30e93e864e669d82224b967c3020b8fa8d1e4e350b6cbcc537a48b57841163a2"],
                        ["948dcadf5990e048aa3874d46abef9d701858f95de8041d2a6828c99e2262519", "e491a42537f6e597d5d28a3224b1bc25df9154efbd2ef1d2cbba2cae5347d57e"],
                        ["7962414450c76c1689c7b48f8202ec37fb224cf5ac0bfa1570328a8a3d7c77ab", "100b610ec4ffb4760d5c1fc133ef6f6b12507a051f04ac5760afa5b29db83437"],
                        ["3514087834964b54b15b160644d915485a16977225b8847bb0dd085137ec47ca", "ef0afbb2056205448e1652c48e8127fc6039e77c15c2378b7e7d15a0de293311"],
                        ["d3cc30ad6b483e4bc79ce2c9dd8bc54993e947eb8df787b442943d3f7b527eaf", "8b378a22d827278d89c5e9be8f9508ae3c2ad46290358630afb34db04eede0a4"],
                        ["1624d84780732860ce1c78fcbfefe08b2b29823db913f6493975ba0ff4847610", "68651cf9b6da903e0914448c6cd9d4ca896878f5282be4c8cc06e2a404078575"],
                        ["733ce80da955a8a26902c95633e62a985192474b5af207da6df7b4fd5fc61cd4", "f5435a2bd2badf7d485a4d8b8db9fcce3e1ef8e0201e4578c54673bc1dc5ea1d"],
                        ["15d9441254945064cf1a1c33bbd3b49f8966c5092171e699ef258dfab81c045c", "d56eb30b69463e7234f5137b73b84177434800bacebfc685fc37bbe9efe4070d"],
                        ["a1d0fcf2ec9de675b612136e5ce70d271c21417c9d2b8aaaac138599d0717940", "edd77f50bcb5a3cab2e90737309667f2641462a54070f3d519212d39c197a629"],
                        ["e22fbe15c0af8ccc5780c0735f84dbe9a790badee8245c06c7ca37331cb36980", "a855babad5cd60c88b430a69f53a1a7a38289154964799be43d06d77d31da06"],
                        ["311091dd9860e8e20ee13473c1155f5f69635e394704eaa74009452246cfa9b3", "66db656f87d1f04fffd1f04788c06830871ec5a64feee685bd80f0b1286d8374"],
                        ["34c1fd04d301be89b31c0442d3e6ac24883928b45a9340781867d4232ec2dbdf", "9414685e97b1b5954bd46f730174136d57f1ceeb487443dc5321857ba73abee"],
                        ["f219ea5d6b54701c1c14de5b557eb42a8d13f3abbcd08affcc2a5e6b049b8d63", "4cb95957e83d40b0f73af4544cccf6b1f4b08d3c07b27fb8d8c2962a400766d1"],
                        ["d7b8740f74a8fbaab1f683db8f45de26543a5490bca627087236912469a0b448", "fa77968128d9c92ee1010f337ad4717eff15db5ed3c049b3411e0315eaa4593b"],
                        ["32d31c222f8f6f0ef86f7c98d3a3335ead5bcd32abdd94289fe4d3091aa824bf", "5f3032f5892156e39ccd3d7915b9e1da2e6dac9e6f26e961118d14b8462e1661"],
                        ["7461f371914ab32671045a155d9831ea8793d77cd59592c4340f86cbc18347b5", "8ec0ba238b96bec0cbdddcae0aa442542eee1ff50c986ea6b39847b3cc092ff6"],
                        ["ee079adb1df1860074356a25aa38206a6d716b2c3e67453d287698bad7b2b2d6", "8dc2412aafe3be5c4c5f37e0ecc5f9f6a446989af04c4e25ebaac479ec1c8c1e"],
                        ["16ec93e447ec83f0467b18302ee620f7e65de331874c9dc72bfd8616ba9da6b5", "5e4631150e62fb40d0e8c2a7ca5804a39d58186a50e497139626778e25b0674d"],
                        ["eaa5f980c245f6f038978290afa70b6bd8855897f98b6aa485b96065d537bd99", "f65f5d3e292c2e0819a528391c994624d784869d7e6ea67fb18041024edc07dc"],
                        ["78c9407544ac132692ee1910a02439958ae04877151342ea96c4b6b35a49f51", "f3e0319169eb9b85d5404795539a5e68fa1fbd583c064d2462b675f194a3ddb4"],
                        ["494f4be219a1a77016dcd838431aea0001cdc8ae7a6fc688726578d9702857a5", "42242a969283a5f339ba7f075e36ba2af925ce30d767ed6e55f4b031880d562c"],
                        ["a598a8030da6d86c6bc7f2f5144ea549d28211ea58faa70ebf4c1e665c1fe9b5", "204b5d6f84822c307e4b4a7140737aec23fc63b65b35f86a10026dbd2d864e6b"],
                        ["c41916365abb2b5d09192f5f2dbeafec208f020f12570a184dbadc3e58595997", "4f14351d0087efa49d245b328984989d5caf9450f34bfc0ed16e96b58fa9913"],
                        ["841d6063a586fa475a724604da03bc5b92a2e0d2e0a36acfe4c73a5514742881", "73867f59c0659e81904f9a1c7543698e62562d6744c169ce7a36de01a8d6154"],
                        ["5e95bb399a6971d376026947f89bde2f282b33810928be4ded112ac4d70e20d5", "39f23f366809085beebfc71181313775a99c9aed7d8ba38b161384c746012865"],
                        ["36e4641a53948fd476c39f8a99fd974e5ec07564b5315d8bf99471bca0ef2f66", "d2424b1b1abe4eb8164227b085c9aa9456ea13493fd563e06fd51cf5694c78fc"],
                        ["336581ea7bfbbb290c191a2f507a41cf5643842170e914faeab27c2c579f726", "ead12168595fe1be99252129b6e56b3391f7ab1410cd1e0ef3dcdcabd2fda224"],
                        ["8ab89816dadfd6b6a1f2634fcf00ec8403781025ed6890c4849742706bd43ede", "6fdcef09f2f6d0a044e654aef624136f503d459c3e89845858a47a9129cdd24e"],
                        ["1e33f1a746c9c5778133344d9299fcaa20b0938e8acff2544bb40284b8c5fb94", "60660257dd11b3aa9c8ed618d24edff2306d320f1d03010e33a7d2057f3b3b6"],
                        ["85b7c1dcb3cec1b7ee7f30ded79dd20a0ed1f4cc18cbcfcfa410361fd8f08f31", "3d98a9cdd026dd43f39048f25a8847f4fcafad1895d7a633c6fed3c35e999511"],
                        ["29df9fbd8d9e46509275f4b125d6d45d7fbe9a3b878a7af872a2800661ac5f51", "b4c4fe99c775a606e2d8862179139ffda61dc861c019e55cd2876eb2a27d84b"],
                        ["a0b1cae06b0a847a3fea6e671aaf8adfdfe58ca2f768105c8082b2e449fce252", "ae434102edde0958ec4b19d917a6a28e6b72da1834aff0e650f049503a296cf2"],
                        ["4e8ceafb9b3e9a136dc7ff67e840295b499dfb3b2133e4ba113f2e4c0e121e5", "cf2174118c8b6d7a4b48f6d534ce5c79422c086a63460502b827ce62a326683c"],
                        ["d24a44e047e19b6f5afb81c7ca2f69080a5076689a010919f42725c2b789a33b", "6fb8d5591b466f8fc63db50f1c0f1c69013f996887b8244d2cdec417afea8fa3"],
                        ["ea01606a7a6c9cdd249fdfcfacb99584001edd28abbab77b5104e98e8e3b35d4", "322af4908c7312b0cfbfe369f7a7b3cdb7d4494bc2823700cfd652188a3ea98d"],
                        ["af8addbf2b661c8a6c6328655eb96651252007d8c5ea31be4ad196de8ce2131f", "6749e67c029b85f52a034eafd096836b2520818680e26ac8f3dfbcdb71749700"],
                        ["e3ae1974566ca06cc516d47e0fb165a674a3dabcfca15e722f0e3450f45889", "2aeabe7e4531510116217f07bf4d07300de97e4874f81f533420a72eeb0bd6a4"],
                        ["591ee355313d99721cf6993ffed1e3e301993ff3ed258802075ea8ced397e246", "b0ea558a113c30bea60fc4775460c7901ff0b053d25ca2bdeee98f1a4be5d196"],
                        ["11396d55fda54c49f19aa97318d8da61fa8584e47b084945077cf03255b52984", "998c74a8cd45ac01289d5833a7beb4744ff536b01b257be4c5767bea93ea57a4"],
                        ["3c5d2a1ba39c5a1790000738c9e0c40b8dcdfd5468754b6405540157e017aa7a", "b2284279995a34e2f9d4de7396fc18b80f9b8b9fdd270f6661f79ca4c81bd257"],
                        ["cc8704b8a60a0defa3a99a7299f2e9c3fbc395afb04ac078425ef8a1793cc030", "bdd46039feed17881d1e0862db347f8cf395b74fc4bcdc4e940b74e3ac1f1b13"],
                        ["c533e4f7ea8555aacd9777ac5cad29b97dd4defccc53ee7ea204119b2889b197", "6f0a256bc5efdf429a2fb6242f1a43a2d9b925bb4a4b3a26bb8e0f45eb596096"],
                        ["c14f8f2ccb27d6f109f6d08d03cc96a69ba8c34eec07bbcf566d48e33da6593", "c359d6923bb398f7fd4473e16fe1c28475b740dd098075e6c0e8649113dc3a38"],
                        ["a6cbc3046bc6a450bac24789fa17115a4c9739ed75f8f21ce441f72e0b90e6ef", "21ae7f4680e889bb130619e2c0f95a360ceb573c70603139862afd617fa9b9f"],
                        ["347d6d9a02c48927ebfb86c1359b1caf130a3c0267d11ce6344b39f99d43cc38", "60ea7f61a353524d1c987f6ecec92f086d565ab687870cb12689ff1e31c74448"],
                        ["da6545d2181db8d983f7dcb375ef5866d47c67b1bf31c8cf855ef7437b72656a", "49b96715ab6878a79e78f07ce5680c5d6673051b4935bd897fea824b77dc208a"],
                        ["c40747cc9d012cb1a13b8148309c6de7ec25d6945d657146b9d5994b8feb1111", "5ca560753be2a12fc6de6caf2cb489565db936156b9514e1bb5e83037e0fa2d4"],
                        ["4e42c8ec82c99798ccf3a610be870e78338c7f713348bd34c8203ef4037f3502", "7571d74ee5e0fb92a7a8b33a07783341a5492144cc54bcc40a94473693606437"],
                        ["3775ab7089bc6af823aba2e1af70b236d251cadb0c86743287522a1b3b0dedea", "be52d107bcfa09d8bcb9736a828cfa7fac8db17bf7a76a2c42ad961409018cf7"],
                        ["cee31cbf7e34ec379d94fb814d3d775ad954595d1314ba8846959e3e82f74e26", "8fd64a14c06b589c26b947ae2bcf6bfa0149ef0be14ed4d80f448a01c43b1c6d"],
                        ["b4f9eaea09b6917619f6ea6a4eb5464efddb58fd45b1ebefcdc1a01d08b47986", "39e5c9925b5a54b07433a4f18c61726f8bb131c012ca542eb24a8ac07200682a"],
                        ["d4263dfc3d2df923a0179a48966d30ce84e2515afc3dccc1b77907792ebcc60e", "62dfaf07a0f78feb30e30d6295853ce189e127760ad6cf7fae164e122a208d54"],
                        ["48457524820fa65a4f8d35eb6930857c0032acc0a4a2de422233eeda897612c4", "25a748ab367979d98733c38a1fa1c2e7dc6cc07db2d60a9ae7a76aaa49bd0f77"],
                        ["dfeeef1881101f2cb11644f3a2afdfc2045e19919152923f367a1767c11cceda", "ecfb7056cf1de042f9420bab396793c0c390bde74b4bbdff16a83ae09a9a7517"],
                        ["6d7ef6b17543f8373c573f44e1f389835d89bcbc6062ced36c82df83b8fae859", "cd450ec335438986dfefa10c57fea9bcc521a0959b2d80bbf74b190dca712d10"],
                        ["e75605d59102a5a2684500d3b991f2e3f3c88b93225547035af25af66e04541f", "f5c54754a8f71ee540b9b48728473e314f729ac5308b06938360990e2bfad125"],
                        ["eb98660f4c4dfaa06a2be453d5020bc99a0c2e60abe388457dd43fefb1ed620c", "6cb9a8876d9cb8520609af3add26cd20a0a7cd8a9411131ce85f44100099223e"],
                        ["13e87b027d8514d35939f2e6892b19922154596941888336dc3563e3b8dba942", "fef5a3c68059a6dec5d624114bf1e91aac2b9da568d6abeb2570d55646b8adf1"],
                        ["ee163026e9fd6fe017c38f06a5be6fc125424b371ce2708e7bf4491691e5764a", "1acb250f255dd61c43d94ccc670d0f58f49ae3fa15b96623e5430da0ad6c62b2"],
                        ["b268f5ef9ad51e4d78de3a750c2dc89b1e626d43505867999932e5db33af3d80", "5f310d4b3c99b9ebb19f77d41c1dee018cf0d34fd4191614003e945a1216e423"],
                        ["ff07f3118a9df035e9fad85eb6c7bfe42b02f01ca99ceea3bf7ffdba93c4750d", "438136d603e858a3a5c440c38eccbaddc1d2942114e2eddd4740d098ced1f0d8"],
                        ["8d8b9855c7c052a34146fd20ffb658bea4b9f69e0d825ebec16e8c3ce2b526a1", "cdb559eedc2d79f926baf44fb84ea4d44bcf50fee51d7ceb30e2e7f463036758"],
                        ["52db0b5384dfbf05bfa9d472d7ae26dfe4b851ceca91b1eba54263180da32b63", "c3b997d050ee5d423ebaf66a6db9f57b3180c902875679de924b69d84a7b375"],
                        ["e62f9490d3d51da6395efd24e80919cc7d0f29c3f3fa48c6fff543becbd43352", "6d89ad7ba4876b0b22c2ca280c682862f342c8591f1daf5170e07bfd9ccafa7d"],
                        ["7f30ea2476b399b4957509c88f77d0191afa2ff5cb7b14fd6d8e7d65aaab1193", "ca5ef7d4b231c94c3b15389a5f6311e9daff7bb67b103e9880ef4bff637acaec"],
                        ["5098ff1e1d9f14fb46a210fada6c903fef0fb7b4a1dd1d9ac60a0361800b7a00", "9731141d81fc8f8084d37c6e7542006b3ee1b40d60dfe5362a5b132fd17ddc0"],
                        ["32b78c7de9ee512a72895be6b9cbefa6e2f3c4ccce445c96b9f2c81e2778ad58", "ee1849f513df71e32efc3896ee28260c73bb80547ae2275ba497237794c8753c"],
                        ["e2cb74fddc8e9fbcd076eef2a7c72b0ce37d50f08269dfc074b581550547a4f7", "d3aa2ed71c9dd2247a62df062736eb0baddea9e36122d2be8641abcb005cc4a4"],
                        ["8438447566d4d7bedadc299496ab357426009a35f235cb141be0d99cd10ae3a8", "c4e1020916980a4da5d01ac5e6ad330734ef0d7906631c4f2390426b2edd791f"],
                        ["4162d488b89402039b584c6fc6c308870587d9c46f660b878ab65c82c711d67e", "67163e903236289f776f22c25fb8a3afc1732f2b84b4e95dbda47ae5a0852649"],
                        ["3fad3fa84caf0f34f0f89bfd2dcf54fc175d767aec3e50684f3ba4a4bf5f683d", "cd1bc7cb6cc407bb2f0ca647c718a730cf71872e7d0d2a53fa20efcdfe61826"],
                        ["674f2600a3007a00568c1a7ce05d0816c1fb84bf1370798f1c69532faeb1a86b", "299d21f9413f33b3edf43b257004580b70db57da0b182259e09eecc69e0d38a5"],
                        ["d32f4da54ade74abb81b815ad1fb3b263d82d6c692714bcff87d29bd5ee9f08f", "f9429e738b8e53b968e99016c059707782e14f4535359d582fc416910b3eea87"],
                        ["30e4e670435385556e593657135845d36fbb6931f72b08cb1ed954f1e3ce3ff6", "462f9bce619898638499350113bbc9b10a878d35da70740dc695a559eb88db7b"],
                        ["be2062003c51cc3004682904330e4dee7f3dcd10b01e580bf1971b04d4cad297", "62188bc49d61e5428573d48a74e1c655b1c61090905682a0d5558ed72dccb9bc"],
                        ["93144423ace3451ed29e0fb9ac2af211cb6e84a601df5993c419859fff5df04a", "7c10dfb164c3425f5c71a3f9d7992038f1065224f72bb9d1d902a6d13037b47c"],
                        ["b015f8044f5fcbdcf21ca26d6c34fb8197829205c7b7d2a7cb66418c157b112c", "ab8c1e086d04e813744a655b2df8d5f83b3cdc6faa3088c1d3aea1454e3a1d5f"],
                        ["d5e9e1da649d97d89e4868117a465a3a4f8a18de57a140d36b3f2af341a21b52", "4cb04437f391ed73111a13cc1d4dd0db1693465c2240480d8955e8592f27447a"],
                        ["d3ae41047dd7ca065dbf8ed77b992439983005cd72e16d6f996a5316d36966bb", "bd1aeb21ad22ebb22a10f0303417c6d964f8cdd7df0aca614b10dc14d125ac46"],
                        ["463e2763d885f958fc66cdd22800f0a487197d0a82e377b49f80af87c897b065", "bfefacdb0e5d0fd7df3a311a94de062b26b80c61fbc97508b79992671ef7ca7f"],
                        ["7985fdfd127c0567c6f53ec1bb63ec3158e597c40bfe747c83cddfc910641917", "603c12daf3d9862ef2b25fe1de289aed24ed291e0ec6708703a5bd567f32ed03"],
                        ["74a1ad6b5f76e39db2dd249410eac7f99e74c59cb83d2d0ed5ff1543da7703e9", "cc6157ef18c9c63cd6193d83631bbea0093e0968942e8c33d5737fd790e0db08"],
                        ["30682a50703375f602d416664ba19b7fc9bab42c72747463a71d0896b22f6da3", "553e04f6b018b4fa6c8f39e7f311d3176290d0e0f19ca73f17714d9977a22ff8"],
                        ["9e2158f0d7c0d5f26c3791efefa79597654e7a2b2464f52b1ee6c1347769ef57", "712fcdd1b9053f09003a3481fa7762e9ffd7c8ef35a38509e2fbf2629008373"],
                        ["176e26989a43c9cfeba4029c202538c28172e566e3c4fce7322857f3be327d66", "ed8cc9d04b29eb877d270b4878dc43c19aefd31f4eee09ee7b47834c1fa4b1c3"],
                        ["75d46efea3771e6e68abb89a13ad747ecf1892393dfc4f1b7004788c50374da8", "9852390a99507679fd0b86fd2b39a868d7efc22151346e1a3ca4726586a6bed8"],
                        ["809a20c67d64900ffb698c4c825f6d5f2310fb0451c869345b7319f645605721", "9e994980d9917e22b76b061927fa04143d096ccc54963e6a5ebfa5f3f8e286c1"],
                        ["1b38903a43f7f114ed4500b4eac7083fdefece1cf29c63528d563446f972c180", "4036edc931a60ae889353f77fd53de4a2708b26b6f5da72ad3394119daf408f9"]
                    ]
                }
            }]
        })
    }, {
        "../elliptic": 70,
        "bn.js": 68,
        "hash.js": 83
    }],
    77: [function(e, t) {
        function r(e) {
            return this instanceof r ? ("string" == typeof e && (o(i.curves.hasOwnProperty(e), "Unknown curve " + e), e = i.curves[e]), e instanceof i.curves.PresetCurve && (e = {
                curve: e
            }), this.curve = e.curve.curve, this.n = this.curve.n, this.nh = this.n.shrn(1), this.g = this.curve.g, this.g = e.curve.g, this.g.precompute(e.curve.n.bitLength() + 1), void(this.hash = e.hash || e.curve.hash)) : new r(e)
        }
        var n = e("bn.js"),
            i = e("../../elliptic"),
            s = i.utils,
            o = s.assert,
            a = e("./key"),
            f = e("./signature");
        t.exports = r, r.prototype.keyPair = function(e, t) {
            return new a(this, e, t)
        }, r.prototype.genKeyPair = function(e) {
            e || (e = {});
            for (var t = new i.hmacDRBG({
                    hash: this.hash,
                    pers: e.pers,
                    entropy: e.entropy || i.rand(this.hash.hmacStrength),
                    nonce: this.n.toArray()
                }), r = this.n.byteLength(), s = this.n.sub(new n(2));;) {
                var o = new n(t.generate(r));
                if (!(o.cmp(s) > 0)) return o.iaddn(1), this.keyPair(o)
            }
        }, r.prototype._truncateToN = function(e, t) {
            var r = 8 * e.byteLength() - this.n.bitLength();
            return r > 0 && (e = e.shrn(r)), !t && e.cmp(this.n) >= 0 ? e.sub(this.n) : e
        }, r.prototype.sign = function(e, t, r) {
            t = this.keyPair(t, "hex"), e = this._truncateToN(new n(e, 16)), r || (r = {});
            for (var s = this.n.byteLength(), o = t.getPrivate().toArray(), a = o.length; 21 > a; a++) o.unshift(0);
            for (var c = e.toArray(), a = c.length; s > a; a++) c.unshift(0);
            for (var u = new i.hmacDRBG({
                    hash: this.hash,
                    entropy: o,
                    nonce: c
                }), d = this.n.sub(new n(1));;) {
                var h = new n(u.generate(this.n.byteLength()));
                if (h = this._truncateToN(h, !0), !(h.cmpn(1) <= 0 || h.cmp(d) >= 0)) {
                    var p = this.g.mul(h);
                    if (!p.isInfinity()) {
                        var l = p.getX().mod(this.n);
                        if (0 !== l.cmpn(0)) {
                            var b = h.invm(this.n).mul(l.mul(t.getPrivate()).iadd(e)).mod(this.n);
                            if (0 !== b.cmpn(0)) return r.canonical && b.cmp(this.nh) > 0 && (b = this.n.sub(b)), new f(l, b)
                        }
                    }
                }
            }
        }, r.prototype.verify = function(e, t, r) {
            e = this._truncateToN(new n(e, 16)), r = this.keyPair(r, "hex"), t = new f(t, "hex");
            var i = t.r,
                s = t.s;
            if (i.cmpn(1) < 0 || i.cmp(this.n) >= 0) return !1;
            if (s.cmpn(1) < 0 || s.cmp(this.n) >= 0) return !1;
            var o = s.invm(this.n),
                a = o.mul(e).mod(this.n),
                c = o.mul(i).mod(this.n),
                u = this.g.mulAdd(a, r.getPublic(), c);
            return u.isInfinity() ? !1 : 0 === u.getX().mod(this.n).cmp(i)
        }
    }, {
        "../../elliptic": 70,
        "./key": 78,
        "./signature": 79,
        "bn.js": 68
    }],
    78: [function(e, t) {
        function r(e, t, n) {
            return t instanceof r ? t : n instanceof r ? n : (t || (t = n, n = null), null !== t && "object" == typeof t && (t.x ? (n = t, t = null) : (t.priv || t.pub) && (n = t.pub, t = t.priv)), this.ec = e, this.priv = null, this.pub = null, void(this._importPublicHex(t, n) || ("hex" === n && (n = null), t && this._importPrivate(t), n && this._importPublic(n))))
        } {
            var n = e("bn.js"),
                i = e("../../elliptic"),
                s = i.utils;
            s.assert
        }
        t.exports = r, r.prototype.validate = function() {
            var e = this.getPublic();
            return e.isInfinity() ? {
                result: !1,
                reason: "Invalid public key"
            } : e.validate() ? e.mul(this.ec.curve.n).isInfinity() ? {
                result: !0,
                reason: null
            } : {
                result: !1,
                reason: "Public key * N != O"
            } : {
                result: !1,
                reason: "Public key is not a point"
            }
        }, r.prototype.getPublic = function(e, t) {
            if (this.pub || (this.pub = this.ec.g.mul(this.priv)), "string" == typeof e && (t = e, e = null), !t) return this.pub;
            for (var r = this.ec.curve.p.byteLength(), n = this.pub.getX().toArray(), i = n.length; r > i; i++) n.unshift(0);
            if (e) var o = [this.pub.getY().isEven() ? 2 : 3].concat(n);
            else {
                for (var a = this.pub.getY().toArray(), i = a.length; r > i; i++) a.unshift(0);
                var o = [4].concat(n, a)
            }
            return s.encode(o, t)
        }, r.prototype.getPrivate = function(e) {
            return "hex" === e ? this.priv.toString(16, 2) : this.priv
        }, r.prototype._importPrivate = function(e) {
            this.priv = new n(e, 16), this.priv = this.priv.mod(this.ec.curve.n)
        }, r.prototype._importPublic = function(e) {
            this.pub = this.ec.curve.point(e.x, e.y)
        }, r.prototype._importPublicHex = function(e, t) {
            e = s.toArray(e, t);
            var r = this.ec.curve.p.byteLength();
            if (4 === e[0] && e.length - 1 === 2 * r) this.pub = this.ec.curve.point(e.slice(1, 1 + r), e.slice(1 + r, 1 + 2 * r));
            else {
                if (2 !== e[0] && 3 !== e[0] || e.length - 1 !== r) return !1;
                this.pub = this.ec.curve.pointFromX(3 === e[0], e.slice(1, 1 + r))
            }
            return !0
        }, r.prototype.derive = function(e) {
            return e.mul(this.priv).getX()
        }, r.prototype.sign = function(e) {
            return this.ec.sign(e, this)
        }, r.prototype.verify = function(e, t) {
            return this.ec.verify(e, t, this)
        }, r.prototype.inspect = function() {
            return "<Key priv: " + (this.priv && this.priv.toString(16, 2)) + " pub: " + (this.pub && this.pub.inspect()) + " >"
        }
    }, {
        "../../elliptic": 70,
        "bn.js": 68
    }],
    79: [function(e, t) {
        function r(e, t) {
            return e instanceof r ? e : void(this._importDER(e, t) || (o(e && t, "Signature without r or s"), this.r = new n(e, 16), this.s = new n(t, 16)))
        }
        var n = e("bn.js"),
            i = e("../../elliptic"),
            s = i.utils,
            o = s.assert;
        t.exports = r, r.prototype._importDER = function(e, t) {
            if (e = s.toArray(e, t), e.length < 6 || 48 !== e[0] || 2 !== e[2]) return !1;
            var r = e[1];
            if (1 + r > e.length) return !1;
            var i = e[3];
            if (i >= 128) return !1;
            if (4 + i + 2 >= e.length) return !1;
            if (2 !== e[4 + i]) return !1;
            var o = e[5 + i];
            return o >= 128 ? !1 : 4 + i + 2 + o > e.length ? !1 : (this.r = new n(e.slice(4, 4 + i)), this.s = new n(e.slice(4 + i + 2, 4 + i + 2 + o)), !0)
        }, r.prototype.toDER = function(e) {
            var t = this.r.toArray(),
                r = this.s.toArray();
            128 & t[0] && (t = [0].concat(t)), 128 & r[0] && (r = [0].concat(r));
            var n = t.length + r.length + 4,
                i = [48, n, 2, t.length];
            return i = i.concat(t, [2, r.length], r), s.encode(i, e)
        }
    }, {
        "../../elliptic": 70,
        "bn.js": 68
    }],
    80: [function(e, t) {
        function r(e) {
            if (!(this instanceof r)) return new r(e);
            this.hash = e.hash, this.predResist = !!e.predResist, this.outLen = this.hash.outSize, this.minEntropy = e.minEntropy || this.hash.hmacStrength, this.reseed = null, this.reseedInterval = null, this.K = null, this.V = null;
            var t = s.toArray(e.entropy, e.entropyEnc),
                n = s.toArray(e.nonce, e.nonceEnc),
                i = s.toArray(e.pers, e.persEnc);
            o(t.length >= this.minEntropy / 8, "Not enough entropy. Minimum is: " + this.minEntropy + " bits"), this._init(t, n, i)
        }
        var n = e("hash.js"),
            i = e("../elliptic"),
            s = i.utils,
            o = s.assert;
        t.exports = r, r.prototype._init = function(e, t, r) {
            var n = e.concat(t).concat(r);
            this.K = new Array(this.outLen / 8), this.V = new Array(this.outLen / 8);
            for (var i = 0; i < this.V.length; i++) this.K[i] = 0, this.V[i] = 1;
            this._update(n), this.reseed = 1, this.reseedInterval = 281474976710656
        }, r.prototype._hmac = function() {
            return new n.hmac(this.hash, this.K)
        }, r.prototype._update = function(e) {
            var t = this._hmac().update(this.V).update([0]);
            e && (t = t.update(e)), this.K = t.digest(), this.V = this._hmac().update(this.V).digest(), e && (this.K = this._hmac().update(this.V).update([1]).update(e).digest(), this.V = this._hmac().update(this.V).digest())
        }, r.prototype.reseed = function(e, t, r, n) {
            "string" != typeof t && (n = r, r = t, t = null), e = s.toBuffer(e, t), r = s.toBuffer(r, n), o(e.length >= this.minEntropy / 8, "Not enough entropy. Minimum is: " + this.minEntropy + " bits"), this._update(e.concat(r || [])), this.reseed = 1
        }, r.prototype.generate = function(e, t, r, n) {
            if (this.reseed > this.reseedInterval) throw new Error("Reseed is required");
            "string" != typeof t && (n = r, r = t, t = null), r && (r = s.toArray(r, n), this._update(r));
            for (var i = []; i.length < e;) this.V = this._hmac().update(this.V).digest(), i = i.concat(this.V);
            var o = i.slice(0, e);
            return this._update(r), this.reseed++, s.encode(o, t)
        }
    }, {
        "../elliptic": 70,
        "hash.js": 83
    }],
    81: [function(e, t, r) {
        function n(e, t) {
            if (Array.isArray(e)) return e.slice();
            if (!e) return [];
            var r = [];
            if ("string" == typeof e)
                if (t) {
                    if ("hex" === t) {
                        e = e.replace(/[^a-z0-9]+/gi, ""), e.length % 2 !== 0 && (e = "0" + e);
                        for (var n = 0; n < e.length; n += 2) r.push(parseInt(e[n] + e[n + 1], 16))
                    }
                } else
                    for (var n = 0; n < e.length; n++) {
                        var i = e.charCodeAt(n),
                            s = i >> 8,
                            o = 255 & i;
                        s ? r.push(s, o) : r.push(o)
                    } else
                        for (var n = 0; n < e.length; n++) r[n] = 0 | e[n];
            return r
        }

        function i(e) {
            for (var t = "", r = 0; r < e.length; r++) t += s(e[r].toString(16));
            return t
        }

        function s(e) {
            return 1 === e.length ? "0" + e : e
        }

        function o(e, t) {
            for (var r = [], n = 1 << t + 1, i = e.clone(); i.cmpn(1) >= 0;) {
                var s;
                if (i.isOdd()) {
                    var o = i.andln(n - 1);
                    s = o > (n >> 1) - 1 ? (n >> 1) - o : o, i.isubn(s)
                } else s = 0;
                r.push(s);
                for (var a = 0 !== i.cmpn(0) && 0 === i.andln(n - 1) ? t + 1 : 1, f = 1; a > f; f++) r.push(0);
                i.ishrn(a)
            }
            return r
        }

        function a(e, t) {
            var r = [
                [],
                []
            ];
            e = e.clone(), t = t.clone();
            for (var n = 0, i = 0; e.cmpn(-n) > 0 || t.cmpn(-i) > 0;) {
                var s = e.andln(3) + n & 3,
                    o = t.andln(3) + i & 3;
                3 === s && (s = -1), 3 === o && (o = -1);
                var a;
                if (0 === (1 & s)) a = 0;
                else {
                    var f = e.andln(7) + n & 7;
                    a = 3 !== f && 5 !== f || 2 !== o ? s : -s
                }
                r[0].push(a);
                var c;
                if (0 === (1 & o)) c = 0;
                else {
                    var f = t.andln(7) + i & 7;
                    c = 3 !== f && 5 !== f || 2 !== s ? o : -o
                }
                r[1].push(c), 2 * n === a + 1 && (n = 1 - n), 2 * i === c + 1 && (i = 1 - i), e.ishrn(1), t.ishrn(1)
            }
            return r
        }
        var f = (e("bn.js"), r);
        f.assert = function(e, t) {
            if (!e) throw new Error(t || "Assertion failed")
        }, f.toArray = n, f.toHex = i, f.encode = function(e, t) {
            return "hex" === t ? i(e) : e
        }, f.zero2 = s, f.getNAF = o, f.getJSF = a
    }, {
        "bn.js": 68
    }],
    82: [function(e, t) {
        function r(e) {
            this.rand = e
        }
        var n;
        if (t.exports = function(e) {
                return n || (n = new r(null)), n.generate(e)
            }, t.exports.Rand = r, r.prototype.generate = function(e) {
                return this._rand(e)
            }, "object" == typeof window) r.prototype._rand = window.crypto && window.crypto.getRandomValues ? function(e) {
            var t = new Uint8Array(e);
            return window.crypto.getRandomValues(t), t
        } : window.msCrypto && window.msCrypto.getRandomValues ? function(e) {
            var t = new Uint8Array(e);
            return window.msCrypto.getRandomValues(t), t
        } : function() {
            throw new Error("Not implemented yet")
        };
        else try {
            var i = e("crypto");
            r.prototype._rand = function(e) {
                return i.randomBytes(e)
            }
        } catch (s) {
            r.prototype._rand = function(e) {
                for (var t = new Uint8Array(e), r = 0; r < t.length; r++) t[r] = this.rand.getByte();
                return t
            }
        }
    }, {}],
    83: [function(e, t, r) {
        var n = r;
        n.utils = e("./hash/utils"), n.common = e("./hash/common"), n.sha = e("./hash/sha"), n.ripemd = e("./hash/ripemd"), n.hmac = e("./hash/hmac"), n.sha1 = n.sha.sha1, n.sha256 = n.sha.sha256, n.sha224 = n.sha.sha224, n.sha384 = n.sha.sha384, n.sha512 = n.sha.sha512, n.ripemd160 = n.ripemd.ripemd160
    }, {
        "./hash/common": 84,
        "./hash/hmac": 85,
        "./hash/ripemd": 86,
        "./hash/sha": 87,
        "./hash/utils": 88
    }],
    84: [function(e, t, r) {
        function n() {
            this.pending = null, this.pendingTotal = 0, this.blockSize = this.constructor.blockSize, this.outSize = this.constructor.outSize, this.hmacStrength = this.constructor.hmacStrength, this.padLength = this.constructor.padLength / 8, this.endian = "big", this._delta8 = this.blockSize / 8, this._delta32 = this.blockSize / 32
        }
        var i = e("../hash"),
            s = i.utils,
            o = s.assert;
        r.BlockHash = n, n.prototype.update = function(e, t) {
            if (e = s.toArray(e, t), this.pending = this.pending ? this.pending.concat(e) : e, this.pendingTotal += e.length, this.pending.length >= this._delta8) {
                e = this.pending;
                var r = e.length % this._delta8;
                this.pending = e.slice(e.length - r, e.length), 0 === this.pending.length && (this.pending = null), e = s.join32(e, 0, e.length - r, this.endian);
                for (var n = 0; n < e.length; n += this._delta32) this._update(e, n, n + this._delta32)
            }
            return this
        }, n.prototype.digest = function(e) {
            return this.update(this._pad()), o(null === this.pending), this._digest(e)
        }, n.prototype._pad = function() {
            var e = this.pendingTotal,
                t = this._delta8,
                r = t - (e + this.padLength) % t,
                n = new Array(r + this.padLength);
            n[0] = 128;
            for (var i = 1; r > i; i++) n[i] = 0;
            if (e <<= 3, "big" === this.endian) {
                for (var s = 8; s < this.padLength; s++) n[i++] = 0;
                n[i++] = 0, n[i++] = 0, n[i++] = 0, n[i++] = 0, n[i++] = e >>> 24 & 255, n[i++] = e >>> 16 & 255, n[i++] = e >>> 8 & 255, n[i++] = 255 & e
            } else {
                n[i++] = 255 & e, n[i++] = e >>> 8 & 255, n[i++] = e >>> 16 & 255, n[i++] = e >>> 24 & 255, n[i++] = 0, n[i++] = 0, n[i++] = 0, n[i++] = 0;
                for (var s = 8; s < this.padLength; s++) n[i++] = 0
            }
            return n
        }
    }, {
        "../hash": 83
    }],
    85: [function(e, t, r) {
        function n(e, t, r) {
            return this instanceof n ? (this.Hash = e, this.blockSize = e.blockSize / 8, this.outSize = e.outSize / 8, this.inner = null, this.outer = null, void this._init(s.toArray(t, r))) : new n(e, t, r)
        }
        var i = e("../hash"),
            s = i.utils,
            o = s.assert;
        t.exports = n, n.prototype._init = function(e) {
            e.length > this.blockSize && (e = (new this.Hash).update(e).digest()), o(e.length <= this.blockSize);
            for (var t = e.length; t < this.blockSize; t++) e.push(0);
            for (var t = 0; t < e.length; t++) e[t] ^= 54;
            this.inner = (new this.Hash).update(e);
            for (var t = 0; t < e.length; t++) e[t] ^= 106;
            this.outer = (new this.Hash).update(e)
        }, n.prototype.update = function(e, t) {
            return this.inner.update(e, t), this
        }, n.prototype.digest = function(e) {
            return this.outer.update(this.inner.digest()), this.outer.digest(e)
        }
    }, {
        "../hash": 83
    }],
    86: [function(e, t, r) {
        function n() {
            return this instanceof n ? (p.call(this), this.h = [1732584193, 4023233417, 2562383102, 271733878, 3285377520], void(this.endian = "little")) : new n
        }

        function i(e, t, r, n) {
            return 15 >= e ? t ^ r ^ n : 31 >= e ? t & r | ~t & n : 47 >= e ? (t | ~r) ^ n : 63 >= e ? t & n | r & ~n : t ^ (r | ~n)
        }

        function s(e) {
            return 15 >= e ? 0 : 31 >= e ? 1518500249 : 47 >= e ? 1859775393 : 63 >= e ? 2400959708 : 2840853838
        }

        function o(e) {
            return 15 >= e ? 1352829926 : 31 >= e ? 1548603684 : 47 >= e ? 1836072691 : 63 >= e ? 2053994217 : 0
        }
        var a = e("../hash"),
            f = a.utils,
            c = f.rotl32,
            u = f.sum32,
            d = f.sum32_3,
            h = f.sum32_4,
            p = a.common.BlockHash;
        f.inherits(n, p), r.ripemd160 = n, n.blockSize = 512, n.outSize = 160, n.hmacStrength = 192, n.padLength = 64, n.prototype._update = function(e, t) {
            for (var r = this.h[0], n = this.h[1], a = this.h[2], f = this.h[3], p = this.h[4], m = r, v = n, _ = a, w = f, S = p, k = 0; 80 > k; k++) {
                var I = u(c(h(r, i(k, n, a, f), e[l[k] + t], s(k)), g[k]), p);
                r = p, p = f, f = c(a, 10), a = n, n = I, I = u(c(h(m, i(79 - k, v, _, w), e[b[k] + t], o(k)), y[k]), S), m = S, S = w, w = c(_, 10), _ = v, v = I
            }
            I = d(this.h[1], a, w), this.h[1] = d(this.h[2], f, S), this.h[2] = d(this.h[3], p, m), this.h[3] = d(this.h[4], r, v), this.h[4] = d(this.h[0], n, _), this.h[0] = I
        }, n.prototype._digest = function(e) {
            return "hex" === e ? f.toHex32(this.h, "little") : f.split32(this.h, "little")
        };
        var l = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13],
            b = [5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11],
            g = [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6],
            y = [8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11]
    }, {
        "../hash": 83
    }],
    87: [function(e, t, r) {
        function n() {
            return this instanceof n ? (Y.call(this), this.h = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225], this.k = W, void(this.W = new Array(64))) : new n
        }

        function i() {
            return this instanceof i ? (n.call(this), void(this.h = [3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025, 1694076839, 3204075428])) : new i
        }

        function s() {
            return this instanceof s ? (Y.call(this), this.h = [1779033703, 4089235720, 3144134277, 2227873595, 1013904242, 4271175723, 2773480762, 1595750129, 1359893119, 2917565137, 2600822924, 725511199, 528734635, 4215389547, 1541459225, 327033209], this.k = G, void(this.W = new Array(160))) : new s
        }

        function o() {
            return this instanceof o ? (s.call(this), void(this.h = [3418070365, 3238371032, 1654270250, 914150663, 2438529370, 812702999, 355462360, 4144912697, 1731405415, 4290775857, 2394180231, 1750603025, 3675008525, 1694076839, 1203062813, 3204075428])) : new o
        }

        function a() {
            return this instanceof a ? (Y.call(this), this.h = [1732584193, 4023233417, 2562383102, 271733878, 3285377520], void(this.W = new Array(80))) : new a
        }

        function f(e, t, r) {
            return e & t ^ ~e & r
        }

        function c(e, t, r) {
            return e & t ^ e & r ^ t & r
        }

        function u(e, t, r) {
            return e ^ t ^ r
        }

        function d(e) {
            return R(e, 2) ^ R(e, 13) ^ R(e, 22)
        }

        function h(e) {
            return R(e, 6) ^ R(e, 11) ^ R(e, 25)
        }

        function p(e) {
            return R(e, 7) ^ R(e, 18) ^ e >>> 3
        }

        function l(e) {
            return R(e, 17) ^ R(e, 19) ^ e >>> 10
        }

        function b(e, t, r, n) {
            return 0 === e ? f(t, r, n) : 1 === e || 3 === e ? u(t, r, n) : 2 === e ? c(t, r, n) : void 0
        }

        function g(e, t, r, n, i) {
            var s = e & r ^ ~e & i;
            return 0 > s && (s += 4294967296), s
        }

        function y(e, t, r, n, i, s) {
            var o = t & n ^ ~t & s;
            return 0 > o && (o += 4294967296), o
        }

        function m(e, t, r, n, i) {
            var s = e & r ^ e & i ^ r & i;
            return 0 > s && (s += 4294967296), s
        }

        function v(e, t, r, n, i, s) {
            var o = t & n ^ t & s ^ n & s;
            return 0 > o && (o += 4294967296), o
        }

        function _(e, t) {
            var r = M(e, t, 28),
                n = M(t, e, 2),
                i = M(t, e, 7),
                s = r ^ n ^ i;
            return 0 > s && (s += 4294967296), s
        }

        function w(e, t) {
            var r = U(e, t, 28),
                n = U(t, e, 2),
                i = U(t, e, 7),
                s = r ^ n ^ i;
            return 0 > s && (s += 4294967296), s
        }

        function S(e, t) {
            var r = M(e, t, 14),
                n = M(e, t, 18),
                i = M(t, e, 9),
                s = r ^ n ^ i;
            return 0 > s && (s += 4294967296), s
        }

        function k(e, t) {
            var r = U(e, t, 14),
                n = U(e, t, 18),
                i = U(t, e, 9),
                s = r ^ n ^ i;
            return 0 > s && (s += 4294967296), s
        }

        function I(e, t) {
            var r = M(e, t, 1),
                n = M(e, t, 8),
                i = z(e, t, 7),
                s = r ^ n ^ i;
            return 0 > s && (s += 4294967296), s
        }

        function E(e, t) {
            var r = U(e, t, 1),
                n = U(e, t, 8),
                i = D(e, t, 7),
                s = r ^ n ^ i;
            return 0 > s && (s += 4294967296), s
        }

        function A(e, t) {
            var r = M(e, t, 19),
                n = M(t, e, 29),
                i = z(e, t, 6),
                s = r ^ n ^ i;
            return 0 > s && (s += 4294967296), s
        }

        function x(e, t) {
            var r = U(e, t, 19),
                n = U(t, e, 29),
                i = D(e, t, 6),
                s = r ^ n ^ i;
            return 0 > s && (s += 4294967296), s
        }
        var P = e("../hash"),
            O = P.utils,
            B = O.assert,
            R = O.rotr32,
            T = O.rotl32,
            N = O.sum32,
            j = O.sum32_4,
            C = O.sum32_5,
            M = O.rotr64_hi,
            U = O.rotr64_lo,
            z = O.shr64_hi,
            D = O.shr64_lo,
            L = O.sum64,
            F = O.sum64_hi,
            H = O.sum64_lo,
            K = O.sum64_4_hi,
            q = O.sum64_4_lo,
            V = O.sum64_5_hi,
            J = O.sum64_5_lo,
            Y = P.common.BlockHash,
            W = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298],
            G = [1116352408, 3609767458, 1899447441, 602891725, 3049323471, 3964484399, 3921009573, 2173295548, 961987163, 4081628472, 1508970993, 3053834265, 2453635748, 2937671579, 2870763221, 3664609560, 3624381080, 2734883394, 310598401, 1164996542, 607225278, 1323610764, 1426881987, 3590304994, 1925078388, 4068182383, 2162078206, 991336113, 2614888103, 633803317, 3248222580, 3479774868, 3835390401, 2666613458, 4022224774, 944711139, 264347078, 2341262773, 604807628, 2007800933, 770255983, 1495990901, 1249150122, 1856431235, 1555081692, 3175218132, 1996064986, 2198950837, 2554220882, 3999719339, 2821834349, 766784016, 2952996808, 2566594879, 3210313671, 3203337956, 3336571891, 1034457026, 3584528711, 2466948901, 113926993, 3758326383, 338241895, 168717936, 666307205, 1188179964, 773529912, 1546045734, 1294757372, 1522805485, 1396182291, 2643833823, 1695183700, 2343527390, 1986661051, 1014477480, 2177026350, 1206759142, 2456956037, 344077627, 2730485921, 1290863460, 2820302411, 3158454273, 3259730800, 3505952657, 3345764771, 106217008, 3516065817, 3606008344, 3600352804, 1432725776, 4094571909, 1467031594, 275423344, 851169720, 430227734, 3100823752, 506948616, 1363258195, 659060556, 3750685593, 883997877, 3785050280, 958139571, 3318307427, 1322822218, 3812723403, 1537002063, 2003034995, 1747873779, 3602036899, 1955562222, 1575990012, 2024104815, 1125592928, 2227730452, 2716904306, 2361852424, 442776044, 2428436474, 593698344, 2756734187, 3733110249, 3204031479, 2999351573, 3329325298, 3815920427, 3391569614, 3928383900, 3515267271, 566280711, 3940187606, 3454069534, 4118630271, 4000239992, 116418474, 1914138554, 174292421, 2731055270, 289380356, 3203993006, 460393269, 320620315, 685471733, 587496836, 852142971, 1086792851, 1017036298, 365543100, 1126000580, 2618297676, 1288033470, 3409855158, 1501505948, 4234509866, 1607167915, 987167468, 1816402316, 1246189591],
            X = [1518500249, 1859775393, 2400959708, 3395469782];
        O.inherits(n, Y), r.sha256 = n, n.blockSize = 512, n.outSize = 256, n.hmacStrength = 192, n.padLength = 64, n.prototype._update = function(e, t) {
            for (var r = this.W, n = 0; 16 > n; n++) r[n] = e[t + n];
            for (; n < r.length; n++) r[n] = j(l(r[n - 2]), r[n - 7], p(r[n - 15]), r[n - 16]);
            var i = this.h[0],
                s = this.h[1],
                o = this.h[2],
                a = this.h[3],
                u = this.h[4],
                b = this.h[5],
                g = this.h[6],
                y = this.h[7];
            B(this.k.length === r.length);
            for (var n = 0; n < r.length; n++) {
                var m = C(y, h(u), f(u, b, g), this.k[n], r[n]),
                    v = N(d(i), c(i, s, o));
                y = g, g = b, b = u, u = N(a, m), a = o, o = s, s = i, i = N(m, v)
            }
            this.h[0] = N(this.h[0], i), this.h[1] = N(this.h[1], s), this.h[2] = N(this.h[2], o), this.h[3] = N(this.h[3], a), this.h[4] = N(this.h[4], u), this.h[5] = N(this.h[5], b), this.h[6] = N(this.h[6], g), this.h[7] = N(this.h[7], y)
        }, n.prototype._digest = function(e) {
            return "hex" === e ? O.toHex32(this.h, "big") : O.split32(this.h, "big")
        }, O.inherits(i, n), r.sha224 = i, i.blockSize = 512, i.outSize = 224, i.hmacStrength = 192, i.padLength = 64, i.prototype._digest = function(e) {
            return "hex" === e ? O.toHex32(this.h.slice(0, 7), "big") : O.split32(this.h.slice(0, 7), "big")
        }, O.inherits(s, Y), r.sha512 = s, s.blockSize = 1024, s.outSize = 512, s.hmacStrength = 192, s.padLength = 128, s.prototype._prepareBlock = function(e, t) {
            for (var r = this.W, n = 0; 32 > n; n++) r[n] = e[t + n];
            for (; n < r.length; n += 2) {
                var i = A(r[n - 4], r[n - 3]),
                    s = x(r[n - 4], r[n - 3]),
                    o = r[n - 14],
                    a = r[n - 13],
                    f = I(r[n - 30], r[n - 29]),
                    c = E(r[n - 30], r[n - 29]),
                    u = r[n - 32],
                    d = r[n - 31];
                r[n] = K(i, s, o, a, f, c, u, d), r[n + 1] = q(i, s, o, a, f, c, u, d)
            }
        }, s.prototype._update = function(e, t) {
            this._prepareBlock(e, t);
            var r = this.W,
                n = this.h[0],
                i = this.h[1],
                s = this.h[2],
                o = this.h[3],
                a = this.h[4],
                f = this.h[5],
                c = this.h[6],
                u = this.h[7],
                d = this.h[8],
                h = this.h[9],
                p = this.h[10],
                l = this.h[11],
                b = this.h[12],
                I = this.h[13],
                E = this.h[14],
                A = this.h[15];
            B(this.k.length === r.length);
            for (var x = 0; x < r.length; x += 2) {
                var P = E,
                    O = A,
                    R = S(d, h),
                    T = k(d, h),
                    N = g(d, h, p, l, b, I),
                    j = y(d, h, p, l, b, I),
                    C = this.k[x],
                    M = this.k[x + 1],
                    U = r[x],
                    z = r[x + 1],
                    D = V(P, O, R, T, N, j, C, M, U, z),
                    K = J(P, O, R, T, N, j, C, M, U, z),
                    P = _(n, i),
                    O = w(n, i),
                    R = m(n, i, s, o, a, f),
                    T = v(n, i, s, o, a, f),
                    q = F(P, O, R, T),
                    Y = H(P, O, R, T);
                E = b, A = I, b = p, I = l, p = d, l = h, d = F(c, u, D, K), h = H(u, u, D, K), c = a, u = f, a = s, f = o, s = n, o = i, n = F(D, K, q, Y), i = H(D, K, q, Y)
            }
            L(this.h, 0, n, i), L(this.h, 2, s, o), L(this.h, 4, a, f), L(this.h, 6, c, u), L(this.h, 8, d, h), L(this.h, 10, p, l), L(this.h, 12, b, I), L(this.h, 14, E, A)
        }, s.prototype._digest = function(e) {
            return "hex" === e ? O.toHex32(this.h, "big") : O.split32(this.h, "big")
        }, O.inherits(o, s), r.sha384 = o, o.blockSize = 1024, o.outSize = 384, o.hmacStrength = 192, o.padLength = 128, o.prototype._digest = function(e) {
            return "hex" === e ? O.toHex32(this.h.slice(0, 12), "big") : O.split32(this.h.slice(0, 12), "big")
        }, O.inherits(a, Y), r.sha1 = a, a.blockSize = 512, a.outSize = 160, a.hmacStrength = 80, a.padLength = 64, a.prototype._update = function(e, t) {
            for (var r = this.W, n = 0; 16 > n; n++) r[n] = e[t + n];
            for (; n < r.length; n++) r[n] = T(r[n - 3] ^ r[n - 8] ^ r[n - 14] ^ r[n - 16], 1);
            for (var i = this.h[0], s = this.h[1], o = this.h[2], a = this.h[3], f = this.h[4], n = 0; n < r.length; n++) {
                var c = ~~(n / 20),
                    u = C(T(i, 5), b(c, s, o, a), f, r[n], X[c]);
                f = a, a = o, o = T(s, 30), s = i, i = u
            }
            this.h[0] = N(this.h[0], i), this.h[1] = N(this.h[1], s), this.h[2] = N(this.h[2], o), this.h[3] = N(this.h[3], a), this.h[4] = N(this.h[4], f)
        }, a.prototype._digest = function(e) {
            return "hex" === e ? O.toHex32(this.h, "big") : O.split32(this.h, "big")
        }
    }, {
        "../hash": 83
    }],
    88: [function(e, t, r) {
        function n(e, t) {
            if (Array.isArray(e)) return e.slice();
            if (!e) return [];
            var r = [];
            if ("string" == typeof e)
                if (t) {
                    if ("hex" === t) {
                        e = e.replace(/[^a-z0-9]+/gi, ""), e.length % 2 !== 0 && (e = "0" + e);
                        for (var n = 0; n < e.length; n += 2) r.push(parseInt(e[n] + e[n + 1], 16))
                    }
                } else
                    for (var n = 0; n < e.length; n++) {
                        var i = e.charCodeAt(n),
                            s = i >> 8,
                            o = 255 & i;
                        s ? r.push(s, o) : r.push(o)
                    } else
                        for (var n = 0; n < e.length; n++) r[n] = 0 | e[n];
            return r
        }

        function i(e) {
            for (var t = "", r = 0; r < e.length; r++) t += a(e[r].toString(16));
            return t
        }

        function s(e) {
            var t = e >>> 24 | e >>> 8 & 65280 | e << 8 & 16711680 | (255 & e) << 24;
            return t >>> 0
        }

        function o(e, t) {
            for (var r = "", n = 0; n < e.length; n++) {
                var i = e[n];
                "little" === t && (i = s(i)), r += f(i.toString(16))
            }
            return r
        }

        function a(e) {
            return 1 === e.length ? "0" + e : e
        }

        function f(e) {
            return 7 === e.length ? "0" + e : 6 === e.length ? "00" + e : 5 === e.length ? "000" + e : 4 === e.length ? "0000" + e : 3 === e.length ? "00000" + e : 2 === e.length ? "000000" + e : 1 === e.length ? "0000000" + e : e
        }

        function c(e, t, r, n) {
            var i = r - t;
            y(i % 4 === 0);
            for (var s = new Array(i / 4), o = 0, a = t; o < s.length; o++, a += 4) {
                var f;
                f = "big" === n ? e[a] << 24 | e[a + 1] << 16 | e[a + 2] << 8 | e[a + 3] : e[a + 3] << 24 | e[a + 2] << 16 | e[a + 1] << 8 | e[a], s[o] = f >>> 0
            }
            return s
        }

        function u(e, t) {
            for (var r = new Array(4 * e.length), n = 0, i = 0; n < e.length; n++, i += 4) {
                var s = e[n];
                "big" === t ? (r[i] = s >>> 24, r[i + 1] = s >>> 16 & 255, r[i + 2] = s >>> 8 & 255, r[i + 3] = 255 & s) : (r[i + 3] = s >>> 24, r[i + 2] = s >>> 16 & 255, r[i + 1] = s >>> 8 & 255, r[i] = 255 & s)
            }
            return r
        }

        function d(e, t) {
            return e >>> t | e << 32 - t
        }

        function h(e, t) {
            return e << t | e >>> 32 - t
        }

        function p(e, t) {
            return e + t >>> 0
        }

        function l(e, t, r) {
            return e + t + r >>> 0
        }

        function b(e, t, r, n) {
            return e + t + r + n >>> 0
        }

        function g(e, t, r, n, i) {
            return e + t + r + n + i >>> 0
        }

        function y(e, t) {
            if (!e) throw new Error(t || "Assertion failed")
        }

        function m(e, t, r, n) {
            var i = e[t],
                s = e[t + 1],
                o = n + s >>> 0,
                a = (n > o ? 1 : 0) + r + i;
            e[t] = a >>> 0, e[t + 1] = o
        }

        function v(e, t, r, n) {
            var i = t + n >>> 0,
                s = (t > i ? 1 : 0) + e + r;
            return s >>> 0
        }

        function _(e, t, r, n) {
            var i = t + n;
            return i >>> 0
        }

        function w(e, t, r, n, i, s, o, a) {
            var f = 0,
                c = t;
            c = c + n >>> 0, f += t > c ? 1 : 0, c = c + s >>> 0, f += s > c ? 1 : 0, c = c + a >>> 0, f += a > c ? 1 : 0;
            var u = e + r + i + o + f;
            return u >>> 0
        }

        function S(e, t, r, n, i, s, o, a) {
            var f = t + n + s + a;
            return f >>> 0
        }

        function k(e, t, r, n, i, s, o, a, f, c) {
            var u = 0,
                d = t;
            d = d + n >>> 0, u += t > d ? 1 : 0, d = d + s >>> 0, u += s > d ? 1 : 0, d = d + a >>> 0, u += a > d ? 1 : 0, d = d + c >>> 0, u += c > d ? 1 : 0;
            var h = e + r + i + o + f + u;
            return h >>> 0
        }

        function I(e, t, r, n, i, s, o, a, f, c) {
            var u = t + n + s + a + c;
            return u >>> 0
        }

        function E(e, t, r) {
            var n = t << 32 - r | e >>> r;
            return n >>> 0
        }

        function A(e, t, r) {
            var n = e << 32 - r | t >>> r;
            return n >>> 0
        }

        function x(e, t, r) {
            return e >>> r
        }

        function P(e, t, r) {
            var n = e << 32 - r | t >>> r;
            return n >>> 0
        }
        var O = r,
            B = e("inherits");
        O.toArray = n, O.toHex = i, O.htonl = s, O.toHex32 = o, O.zero2 = a, O.zero8 = f, O.join32 = c, O.split32 = u, O.rotr32 = d, O.rotl32 = h, O.sum32 = p, O.sum32_3 = l, O.sum32_4 = b, O.sum32_5 = g, O.assert = y, O.inherits = B, r.sum64 = m, r.sum64_hi = v, r.sum64_lo = _, r.sum64_4_hi = w, r.sum64_4_lo = S, r.sum64_5_hi = k, r.sum64_5_lo = I, r.rotr64_hi = E, r.rotr64_lo = A, r.shr64_hi = x, r.shr64_lo = P
    }, {
        inherits: 232
    }],
    89: [function(e, t) {
        t.exports = {
            name: "elliptic",
            version: "1.0.1",
            description: "EC cryptography",
            main: "lib/elliptic.js",
            scripts: {
                test: "mocha --reporter=spec test/*-test.js"
            },
            repository: {
                type: "git",
                url: "git@github.com:indutny/elliptic"
            },
            keywords: ["EC", "Elliptic", "curve", "Cryptography"],
            author: {
                name: "Fedor Indutny",
                email: "fedor@indutny.com"
            },
            license: "MIT",
            bugs: {
                url: "https://github.com/indutny/elliptic/issues"
            },
            homepage: "https://github.com/indutny/elliptic",
            devDependencies: {
                browserify: "^3.44.2",
                mocha: "^1.18.2",
                "uglify-js": "^2.4.13"
            },
            dependencies: {
                "bn.js": "^1.0.0",
                brorand: "^1.0.1",
                "hash.js": "^1.0.0",
                inherits: "^2.0.1"
            },
            gitHead: "17dc013761dd1efcfb868e2b06b0b897627b40be",
            _id: "elliptic@1.0.1",
            _shasum: "d180376b66a17d74995c837796362ac4d22aefe3",
            _from: "elliptic@^1.0.0",
            _npmVersion: "1.4.28",
            _npmUser: {
                name: "indutny",
                email: "fedor@indutny.com"
            },
            maintainers: [{
                name: "indutny",
                email: "fedor@indutny.com"
            }],
            dist: {
                shasum: "d180376b66a17d74995c837796362ac4d22aefe3",
                tarball: "http://registry.npmjs.org/elliptic/-/elliptic-1.0.1.tgz"
            },
            directories: {},
            _resolved: "https://registry.npmjs.org/elliptic/-/elliptic-1.0.1.tgz",
            readme: "ERROR: No README data found!"
        }
    }, {}],
    90: [function(e, t) {
        (function(e) {
            t.exports = function(t, r, n, i) {
                i /= 8;
                for (var s, o, a, f = 0, c = new e(i), u = 0;;) {
                    if (s = t.createHash("md5"), u++ > 0 && s.update(o), s.update(r), s.update(n), o = s.digest(), a = 0, i > 0)
                        for (;;) {
                            if (0 === i) break;
                            if (a === o.length) break;
                            c[f++] = o[a++], i--
                        }
                    if (0 === i) break
                }
                for (a = 0; a < o.length; a++) o[a] = 0;
                return c
            }
        }).call(this, e("buffer").Buffer)
    }, {
        buffer: 43
    }],
    91: [function(e, t) {
        t.exports = {
            "2.16.840.1.101.3.4.1.1": "aes-128-ecb",
            "2.16.840.1.101.3.4.1.2": "aes-128-cbc",
            "2.16.840.1.101.3.4.1.3": "aes-128-ofb",
            "2.16.840.1.101.3.4.1.4": "aes-128-cfb",
            "2.16.840.1.101.3.4.1.21": "aes-192-ecb",
            "2.16.840.1.101.3.4.1.22": "aes-192-cbc",
            "2.16.840.1.101.3.4.1.23": "aes-192-ofb",
            "2.16.840.1.101.3.4.1.24": "aes-192-cfb",
            "2.16.840.1.101.3.4.1.41": "aes-256-ecb",
            "2.16.840.1.101.3.4.1.42": "aes-256-cbc",
            "2.16.840.1.101.3.4.1.43": "aes-256-ofb",
            "2.16.840.1.101.3.4.1.44": "aes-256-cfb"
        }
    }, {}],
    92: [function(e, t, r) {
        var n = e("asn1.js"),
            i = e("asn1.js-rfc3280"),
            s = n.define("RSAPrivateKey", function() {
                this.seq().obj(this.key("version")["int"](), this.key("modulus")["int"](), this.key("publicExponent")["int"](), this.key("privateExponent")["int"](), this.key("prime1")["int"](), this.key("prime2")["int"](), this.key("exponent1")["int"](), this.key("exponent2")["int"](), this.key("coefficient")["int"]())
            });
        r.RSAPrivateKey = s;
        var o = n.define("RSAPublicKey", function() {
            this.seq().obj(this.key("modulus")["int"](), this.key("publicExponent")["int"]())
        });
        r.RSAPublicKey = o;
        var a = i.SubjectPublicKeyInfo;
        r.PublicKey = a;
        var f = n.define("ECPublicKey", function() {
            this.seq().obj(this.key("algorithm").seq().obj(this.key("id").objid(), this.key("curve").objid()), this.key("subjectPrivateKey").bitstr())
        });
        r.ECPublicKey = f;
        var c = n.define("ECPrivateWrap", function() {
            this.seq().obj(this.key("version")["int"](), this.key("algorithm").seq().obj(this.key("id").objid(), this.key("curve").objid()), this.key("subjectPrivateKey").octstr())
        });
        r.ECPrivateWrap = c;
        var u = n.define("PrivateKeyInfo", function() {
            this.seq().obj(this.key("version")["int"](), this.key("algorithm").use(i.AlgorithmIdentifier), this.key("subjectPrivateKey").octstr())
        });
        r.PrivateKey = u;
        var d = n.define("EncryptedPrivateKeyInfo", function() {
                this.seq().obj(this.key("algorithm").seq().obj(this.key("id").objid(), this.key("decrypt").seq().obj(this.key("kde").seq().obj(this.key("id").objid(), this.key("kdeparams").seq().obj(this.key("salt").octstr(), this.key("iters")["int"]())), this.key("cipher").seq().obj(this.key("algo").objid(), this.key("iv").octstr()))), this.key("subjectPrivateKey").octstr())
            }),
            h = n.define("dsaParams", function() {
                this.seq().obj(this.key("algorithm").objid(), this.key("parameters").seq().obj(this.key("p")["int"](), this.key("q")["int"](), this.key("g")["int"]()))
            });
        r.EncryptedPrivateKey = d;
        var p = n.define("DSAPublicKey", function() {
            this.seq().obj(this.key("algorithm").use(h), this.key("subjectPublicKey").bitstr())
        });
        r.DSAPublicKey = p;
        var l = n.define("DSAPrivateWrap", function() {
            this.seq().obj(this.key("version")["int"](), this.key("algorithm").seq().obj(this.key("id").objid(), this.key("parameters").seq().obj(this.key("p")["int"](), this.key("q")["int"](), this.key("g")["int"]())), this.key("subjectPrivateKey").octstr())
        });
        r.DSAPrivateWrap = l;
        var b = n.define("DSAPrivateKey", function() {
            this.seq().obj(this.key("version")["int"](), this.key("p")["int"](), this.key("q")["int"](), this.key("g")["int"](), this.key("pub_key")["int"](), this.key("priv_key")["int"]())
        });
        r.DSAPrivateKey = b, r.DSAparam = n.define("DSAparam", function() {
            this["int"]()
        });
        var g = n.define("ECPrivateKey", function() {
            this.seq().obj(this.key("version")["int"](), this.key("privateKey").octstr(), this.key("parameters").optional().explicit(0).use(y), this.key("publicKey").optional().explicit(1).bitstr())
        });
        r.ECPrivateKey = g;
        var y = n.define("ECParameters", function() {
                this.choice({
                    namedCurve: this.objid()
                })
            }),
            m = n.define("ECPrivateKey2", function() {
                this.seq().obj(this.key("version")["int"](), this.key("privateKey").octstr(), this.key("publicKey").seq().obj(this.key("key").bitstr()))
            });
        r.ECPrivateKey2 = m, r.signature = n.define("signature", function() {
            this.seq().obj(this.key("r")["int"](), this.key("s")["int"]())
        })
    }, {
        "asn1.js": 96,
        "asn1.js-rfc3280": 95
    }],
    93: [function(e, t) {
        (function(r) {
            function n(e) {
                for (var t = []; e;) {
                    if (e.length < 64) {
                        t.push(e);
                        break
                    }
                    t.push(e.slice(0, 64)), e = e.slice(64)
                }
                return t.join("\n")
            }
            var i = /Proc-Type: 4,ENCRYPTED\n\r?DEK-Info: AES-((?:128)|(?:192)|(?:256))-CBC,([0-9A-H]+)\n\r?\n\r?([0-9A-z\n\r\+\/\=]+)\n\r?/m,
                s = /^-----BEGIN (.*)-----\n/,
                o = e("./EVP_BytesToKey");
            t.exports = function(e, t, a) {
                var f = e.toString(),
                    c = f.match(i);
                if (!c) return e;
                var u = "aes" + c[1],
                    d = new r(c[2], "hex"),
                    h = new r(c[3].replace(/\n\r?/g, ""), "base64"),
                    p = o(a, t, d.slice(0, 8), parseInt(c[1])),
                    l = [],
                    b = a.createDecipheriv(u, p, d);
                l.push(b.update(h)), l.push(b["final"]());
                var g = r.concat(l).toString("base64"),
                    y = f.match(s)[1];
                return "-----BEGIN " + y + "-----\n" + n(g) + "\n-----END " + y + "-----\n"
            }
        }).call(this, e("buffer").Buffer)
    }, {
        "./EVP_BytesToKey": 90,
        buffer: 43
    }],
    94: [function(e, t) {
        (function(r) {
            function n(e, t) {
                var n;
                "object" != typeof e || r.isBuffer(e) || (n = e.passphrase, e = e.key), "string" == typeof e && (e = new r(e)), n && (e = f(e, n, t));
                var a, c, u = s.strip(e),
                    d = u.tag,
                    h = new r(u.base64, "base64");
                switch (d) {
                    case "PUBLIC KEY":
                        switch (c = o.PublicKey.decode(h, "der"), a = c.algorithm.algorithm.join(".")) {
                            case "1.2.840.113549.1.1.1":
                                return o.RSAPublicKey.decode(c.subjectPublicKey.data, "der");
                            case "1.2.840.10045.2.1":
                                return {
                                    type: "ec",
                                    data: o.ECPublicKey.decode(h, "der")
                                };
                            case "1.2.840.10040.4.1":
                                return c = o.DSAPublicKey.decode(h, "der"), c.algorithm.parameters.pub_key = o.DSAparam.decode(c.subjectPublicKey.data, "der"), {
                                    type: "dsa",
                                    data: c.algorithm.parameters
                                };
                            default:
                                throw new Error("unknown key id " + a)
                        }
                        throw new Error("unknown key type " + d);
                    case "ENCRYPTED PRIVATE KEY":
                        h = o.EncryptedPrivateKey.decode(h, "der"), h = i(t, h, n);
                    case "PRIVATE KEY":
                        switch (c = o.PrivateKey.decode(h, "der"), a = c.algorithm.algorithm.join(".")) {
                            case "1.2.840.113549.1.1.1":
                                return o.RSAPrivateKey.decode(c.subjectPrivateKey, "der");
                            case "1.2.840.10045.2.1":
                                return c = o.ECPrivateWrap.decode(h, "der"), {
                                    curve: c.algorithm.curve,
                                    privateKey: o.ECPrivateKey.decode(c.subjectPrivateKey, "der").privateKey
                                };
                            case "1.2.840.10040.4.1":
                                return c = o.DSAPrivateWrap.decode(h, "der"), c.algorithm.parameters.priv_key = o.DSAparam.decode(c.subjectPrivateKey, "der"), {
                                    type: "dsa",
                                    params: c.algorithm.parameters
                                };
                            default:
                                throw new Error("unknown key id " + a)
                        }
                        throw new Error("unknown key type " + d);
                    case "RSA PUBLIC KEY":
                        return o.RSAPublicKey.decode(h, "der");
                    case "RSA PRIVATE KEY":
                        return o.RSAPrivateKey.decode(h, "der");
                    case "DSA PRIVATE KEY":
                        return {
                            type: "dsa",
                            params: o.DSAPrivateKey.decode(h, "der")
                        };
                    case "EC PRIVATE KEY":
                        return h = o.ECPrivateKey.decode(h, "der"), {
                            curve: h.parameters.value,
                            privateKey: h.privateKey
                        };
                    default:
                        throw new Error("unknown key type " + d)
                }
            }

            function i(e, t, n) {
                var i = t.algorithm.decrypt.kde.kdeparams.salt,
                    s = t.algorithm.decrypt.kde.kdeparams.iters,
                    o = a[t.algorithm.decrypt.cipher.algo.join(".")],
                    f = t.algorithm.decrypt.cipher.iv,
                    c = t.subjectPrivateKey,
                    u = parseInt(o.split("-")[1], 10) / 8,
                    d = e.pbkdf2Sync(n, i, s, u),
                    h = e.createDecipheriv(o, d, f),
                    p = [];
                return p.push(h.update(c)), p.push(h["final"]()), r.concat(p)
            }
            var s = e("pemstrip"),
                o = e("./asn1"),
                a = e("./aesid.json"),
                f = e("./fixProc");
            t.exports = n, n.signature = o.signature
        }).call(this, e("buffer").Buffer)
    }, {
        "./aesid.json": 91,
        "./asn1": 92,
        "./fixProc": 93,
        buffer: 43,
        pemstrip: 109
    }],
    95: [function(e, t, r) {
        try {
            var n = e("asn1.js")
        } catch (i) {
            var n = e("../..")
        }
        var s = n.define("CRLReason", function() {
            this["enum"]({
                0: "unspecified",
                1: "keyCompromise",
                2: "CACompromise",
                3: "affiliationChanged",
                4: "superseded",
                5: "cessationOfOperation",
                6: "certificateHold",
                8: "removeFromCRL",
                9: "privilegeWithdrawn",
                10: "AACompromise"
            })
        });
        r.CRLReason = s;
        var o = n.define("AlgorithmIdentifier", function() {
            this.seq().obj(this.key("algorithm").objid(), this.key("parameters").optional().any())
        });
        r.AlgorithmIdentifier = o;
        var a = n.define("Certificate", function() {
            this.seq().obj(this.key("tbsCertificate").use(f), this.key("signatureAlgorithm").use(o), this.key("signature").bitstr())
        });
        r.Certificate = a;
        var f = n.define("TBSCertificate", function() {
            this.seq().obj(this.key("version").def("v1").explicit(0).use(c), this.key("serialNumber").use(u), this.key("signature").use(o), this.key("issuer").use(y), this.key("validity").use(d), this.key("subject").use(y), this.key("subjectPublicKeyInfo").use(l), this.key("issuerUniqueID").optional().explicit(1).use(p), this.key("subjectUniqueID").optional().explicit(2).use(p), this.key("extensions").optional().explicit(3).use(b))
        });
        r.TBSCertificate = f;
        var c = n.define("Version", function() {
            this["int"]({
                0: "v1",
                1: "v2",
                2: "v3"
            })
        });
        r.Version = c;
        var u = n.define("CertificateSerialNumber", function() {
            this["int"]()
        });
        r.CertificateSerialNumber = u;
        var d = n.define("Validity", function() {
            this.seq().obj(this.key("notBefore").use(h), this.key("notAfter").use(h))
        });
        r.Validity = d;
        var h = n.define("Time", function() {
            this.choice({
                utcTime: this.utctime(),
                genTime: this.gentime()
            })
        });
        r.Time = h;
        var p = n.define("UniqueIdentifier", function() {
            this.bitstr()
        });
        r.UniqueIdentifier = p;
        var l = n.define("SubjectPublicKeyInfo", function() {
            this.seq().obj(this.key("algorithm").use(o), this.key("subjectPublicKey").bitstr())
        });
        r.SubjectPublicKeyInfo = l;
        var b = n.define("Extensions", function() {
            this.seqof(g)
        });
        r.Extensions = b;
        var g = n.define("Extension", function() {
            this.seq().obj(this.key("extnID").objid(), this.key("critical").bool().def(!1), this.key("extnValue").octstr())
        });
        r.Extension = g;
        var y = n.define("Name", function() {
            this.choice({
                rdn: this.use(m)
            })
        });
        r.Name = y;
        var m = n.define("RDNSequence", function() {
            this.seqof(v)
        });
        r.RDNSequence = m;
        var v = n.define("RelativeDistinguishedName", function() {
            this.setof(_)
        });
        r.RelativeDistinguishedName = v;
        var _ = n.define("AttributeTypeAndValue", function() {
            this.seq().obj(this.key("type").use(w), this.key("value").use(S))
        });
        r.AttributeTypeAndValue = _;
        var w = n.define("AttributeType", function() {
            this.objid()
        });
        r.AttributeType = w;
        var S = n.define("AttributeValue", function() {
            this.any()
        });
        r.AttributeValue = S
    }, {
        "asn1.js": 96
    }],
    96: [function(e, t, r) {
        var n = r;
        n.bignum = e("bn.js"), n.define = e("./asn1/api").define, n.base = e("./asn1/base"), n.constants = e("./asn1/constants"), n.decoders = e("./asn1/decoders"), n.encoders = e("./asn1/encoders")
    }, {
        "./asn1/api": 97,
        "./asn1/base": 99,
        "./asn1/constants": 103,
        "./asn1/decoders": 105,
        "./asn1/encoders": 107,
        "bn.js": 68
    }],
    97: [function(e, t, r) {
        function n(e, t) {
            this.name = e, this.body = t, this.decoders = {}, this.encoders = {}
        }
        var i = e("../asn1"),
            s = e("inherits"),
            o = e("vm"),
            a = r;
        a.define = function(e, t) {
            return new n(e, t)
        }, n.prototype._createNamed = function(e) {
            var t = o.runInThisContext("(function " + this.name + "(entity) {\n  this._initNamed(entity);\n})");
            return s(t, e), t.prototype._initNamed = function(t) {
                e.call(this, t)
            }, new t(this)
        }, n.prototype._getDecoder = function(e) {
            return this.decoders.hasOwnProperty(e) || (this.decoders[e] = this._createNamed(i.decoders[e])), this.decoders[e]
        }, n.prototype.decode = function(e, t, r) {
            return this._getDecoder(t).decode(e, r)
        }, n.prototype._getEncoder = function(e) {
            return this.encoders.hasOwnProperty(e) || (this.encoders[e] = this._createNamed(i.encoders[e])), this.encoders[e]
        }, n.prototype.encode = function(e, t, r) {
            return this._getEncoder(t).encode(e, r)
        }
    }, {
        "../asn1": 96,
        inherits: 232,
        vm: 208
    }],
    98: [function(e, t, r) {
        function n(e, t) {
            return o.call(this, t), a.isBuffer(e) ? (this.base = e, this.offset = 0, void(this.length = e.length)) : void this.error("Input not Buffer")
        }

        function i(e, t) {
            if (Array.isArray(e)) this.length = 0, this.value = e.map(function(e) {
                return e instanceof i || (e = new i(e, t)), this.length += e.length, e
            }, this);
            else if ("number" == typeof e) {
                if (!(e >= 0 && 255 >= e)) return t.error("non-byte EncoderBuffer value");
                this.value = e, this.length = 1
            } else if ("string" == typeof e) this.value = e, this.length = a.byteLength(e);
            else {
                if (!a.isBuffer(e)) return t.error("Unsupported type: " + typeof e);
                this.value = e, this.length = e.length
            }
        }
        var s = e("inherits"),
            o = e("../base").Reporter,
            a = e("buffer").Buffer;
        s(n, o), r.DecoderBuffer = n, n.prototype.save = function() {
            return {
                offset: this.offset
            }
        }, n.prototype.restore = function(e) {
            var t = new n(this.base);
            return t.offset = e.offset, t.length = this.offset, this.offset = e.offset, t
        }, n.prototype.isEmpty = function() {
            return this.offset === this.length
        }, n.prototype.readUInt8 = function(e) {
            return this.offset + 1 <= this.length ? this.base.readUInt8(this.offset++, !0) : this.error(e || "DecoderBuffer overrun")
        }, n.prototype.skip = function(e, t) {
            if (!(this.offset + e <= this.length)) return this.error(t || "DecoderBuffer overrun");
            var r = new n(this.base);
            return r._reporterState = this._reporterState, r.offset = this.offset, r.length = this.offset + e, this.offset += e, r
        }, n.prototype.raw = function(e) {
            return this.base.slice(e ? e.offset : this.offset, this.length)
        }, r.EncoderBuffer = i, i.prototype.join = function(e, t) {
            return e || (e = new a(this.length)), t || (t = 0), 0 === this.length ? e : (Array.isArray(this.value) ? this.value.forEach(function(r) {
                r.join(e, t), t += r.length
            }) : ("number" == typeof this.value ? e[t] = this.value : "string" == typeof this.value ? e.write(this.value, t) : a.isBuffer(this.value) && this.value.copy(e, t), t += this.length), e)
        }
    }, {
        "../base": 99,
        buffer: 43,
        inherits: 232
    }],
    99: [function(e, t, r) {
        var n = r;
        n.Reporter = e("./reporter").Reporter, n.DecoderBuffer = e("./buffer").DecoderBuffer, n.EncoderBuffer = e("./buffer").EncoderBuffer, n.Node = e("./node")
    }, {
        "./buffer": 98,
        "./node": 100,
        "./reporter": 101
    }],
    100: [function(e, t) {
        function r(e, t) {
            var r = {};
            this._baseState = r, r.enc = e, r.parent = t || null, r.children = null, r.tag = null, r.args = null, r.reverseArgs = null, r.choice = null, r.optional = !1, r.any = !1, r.obj = !1, r.use = null, r.useDecoder = null, r.key = null, r["default"] = null, r.explicit = null, r.implicit = null, r.parent || (r.children = [], this._wrap())
        }
        var n = e("../base").Reporter,
            i = e("../base").EncoderBuffer,
            s = e("minimalistic-assert"),
            o = ["seq", "seqof", "set", "setof", "octstr", "bitstr", "objid", "bool", "gentime", "utctime", "null_", "enum", "int", "ia5str"],
            a = ["key", "obj", "use", "optional", "explicit", "implicit", "def", "choice", "any"].concat(o),
            f = ["_peekTag", "_decodeTag", "_use", "_decodeStr", "_decodeObjid", "_decodeTime", "_decodeNull", "_decodeInt", "_decodeBool", "_decodeList", "_encodeComposite", "_encodeStr", "_encodeObjid", "_encodeTime", "_encodeNull", "_encodeInt", "_encodeBool"];
        t.exports = r;
        var c = ["enc", "parent", "children", "tag", "args", "reverseArgs", "choice", "optional", "any", "obj", "use", "alteredUse", "key", "default", "explicit", "implicit"];
        r.prototype.clone = function() {
            var e = this._baseState,
                t = {};
            c.forEach(function(r) {
                t[r] = e[r]
            });
            var r = new this.constructor(t.parent);
            return r._baseState = t, r
        }, r.prototype._wrap = function() {
            var e = this._baseState;
            a.forEach(function(t) {
                this[t] = function() {
                    var r = new this.constructor(this);
                    return e.children.push(r), r[t].apply(r, arguments)
                }
            }, this)
        }, r.prototype._init = function(e) {
            var t = this._baseState;
            s(null === t.parent), e.call(this), t.children = t.children.filter(function(e) {
                return e._baseState.parent === this
            }, this), s.equal(t.children.length, 1, "Root node can have only one child")
        }, r.prototype._useArgs = function(e) {
            var t = this._baseState,
                r = e.filter(function(e) {
                    return e instanceof this.constructor
                }, this);
            e = e.filter(function(e) {
                return !(e instanceof this.constructor)
            }, this), 0 !== r.length && (s(null === t.children), t.children = r, r.forEach(function(e) {
                e._baseState.parent = this
            }, this)), 0 !== e.length && (s(null === t.args), t.args = e, t.reverseArgs = e.map(function(e) {
                if ("object" != typeof e || e.constructor !== Object) return e;
                var t = {};
                return Object.keys(e).forEach(function(r) {
                    r == (0 | r) && (r |= 0);
                    var n = e[r];
                    t[n] = r
                }), t
            }))
        }, f.forEach(function(e) {
            r.prototype[e] = function() {
                var t = this._baseState;
                throw new Error(e + " not implemented for encoding: " + t.enc)
            }
        }), o.forEach(function(e) {
            r.prototype[e] = function() {
                var t = this._baseState,
                    r = Array.prototype.slice.call(arguments);
                return s(null === t.tag), t.tag = e, this._useArgs(r), this
            }
        }), r.prototype.use = function(e) {
            var t = this._baseState;
            return s(null === t.use), t.use = e, this
        }, r.prototype.optional = function() {
            var e = this._baseState;
            return e.optional = !0, this
        }, r.prototype.def = function(e) {
            var t = this._baseState;
            return s(null === t["default"]), t["default"] = e, t.optional = !0, this
        }, r.prototype.explicit = function(e) {
            var t = this._baseState;
            return s(null === t.explicit && null === t.implicit), t.explicit = e, this
        }, r.prototype.implicit = function(e) {
            var t = this._baseState;
            return s(null === t.explicit && null === t.implicit), t.implicit = e, this
        }, r.prototype.obj = function() {
            var e = this._baseState,
                t = Array.prototype.slice.call(arguments);
            return e.obj = !0, 0 !== t.length && this._useArgs(t), this
        }, r.prototype.key = function u(u) {
            var e = this._baseState;
            return s(null === e.key), e.key = u, this
        }, r.prototype.any = function() {
            var e = this._baseState;
            return e.any = !0, this
        }, r.prototype.choice = function(e) {
            var t = this._baseState;
            return s(null === t.choice), t.choice = e, this._useArgs(Object.keys(e).map(function(t) {
                return e[t]
            })), this
        }, r.prototype._decode = function(e) {
            var t = this._baseState;
            if (null === t.parent) return e.wrapResult(t.children[0]._decode(e));
            var r, n = t["default"],
                i = !0;
            if (null !== t.key && (r = e.enterKey(t.key)), t.optional && (i = this._peekTag(e, null !== t.explicit ? t.explicit : null !== t.implicit ? t.implicit : t.tag || 0), e.isError(i))) return i;
            var s;
            if (t.obj && i && (s = e.enterObject()), i) {
                if (null !== t.explicit) {
                    var o = this._decodeTag(e, t.explicit);
                    if (e.isError(o)) return o;
                    e = o
                }
                if (null === t.use && null === t.choice) {
                    if (t.any) var a = e.save();
                    var f = this._decodeTag(e, null !== t.implicit ? t.implicit : t.tag, t.any);
                    if (e.isError(f)) return f;
                    t.any ? n = e.raw(a) : e = f
                }
                if (n = t.any ? n : null === t.choice ? this._decodeGeneric(t.tag, e) : this._decodeChoice(e), e.isError(n)) return n;
                if (!t.any && null === t.choice && null !== t.children) {
                    var c = t.children.some(function(t) {
                        t._decode(e)
                    });
                    if (c) return err
                }
            }
            return t.obj && i && (n = e.leaveObject(s)), null === t.key || null === n && i !== !0 || e.leaveKey(r, t.key, n), n
        }, r.prototype._decodeGeneric = function(e, t) {
            var r = this._baseState;
            return "seq" === e || "set" === e ? null : "seqof" === e || "setof" === e ? this._decodeList(t, e, r.args[0]) : "octstr" === e || "bitstr" === e || "ia5str" === e ? this._decodeStr(t, e) : "objid" === e && r.args ? this._decodeObjid(t, r.args[0], r.args[1]) : "objid" === e ? this._decodeObjid(t, null, null) : "gentime" === e || "utctime" === e ? this._decodeTime(t, e) : "null_" === e ? this._decodeNull(t) : "bool" === e ? this._decodeBool(t) : "int" === e || "enum" === e ? this._decodeInt(t, r.args && r.args[0]) : null !== r.use ? this._getUse(r.use, t._reporterState.obj)._decode(t) : t.error("unknown tag: " + e)
        }, r.prototype._getUse = function(e, t) {
            var r = this._baseState;
            return r.useDecoder = this._use(e, t), s(null === r.useDecoder._baseState.parent), r.useDecoder = r.useDecoder._baseState.children[0], r.implicit !== r.useDecoder._baseState.implicit && (r.useDecoder = r.useDecoder.clone(), r.useDecoder._baseState.implicit = r.implicit), r.useDecoder
        }, r.prototype._decodeChoice = function(e) {
            var t = this._baseState,
                r = null,
                n = !1;
            return Object.keys(t.choice).some(function(i) {
                var s = e.save(),
                    o = t.choice[i];
                try {
                    var a = o._decode(e);
                    if (e.isError(a)) return !1;
                    r = {
                        type: i,
                        value: a
                    }, n = !0
                } catch (f) {
                    return e.restore(s), !1
                }
                return !0
            }, this), n ? r : e.error("Choice not matched")
        }, r.prototype._createEncoderBuffer = function(e) {
            return new i(e, this.reporter)
        }, r.prototype._encode = function(e, t, r) {
            var n = this._baseState;
            if (null === n["default"] || n["default"] !== e) {
                var i = this._encodeValue(e, t, r);
                if (void 0 !== i && !this._skipDefault(i, t, r)) return i
            }
        }, r.prototype._encodeValue = function(e, t, r) {
            var i = this._baseState;
            if (null === i.parent) return i.children[0]._encode(e, t || new n);
            var s = null;
            if (this.reporter = t, i.optional && void 0 === e) {
                if (null === i["default"]) return;
                e = i["default"]
            }
            var o = null,
                a = !1;
            if (i.any) s = this._createEncoderBuffer(e);
            else if (i.choice) s = this._encodeChoice(e, t);
            else if (i.children) o = i.children.map(function(r) {
                if ("null_" === r._baseState.tag) return r._encode(null, t, e);
                if (null === r._baseState.key) return t.error("Child should have a key");
                var n = t.enterKey(r._baseState.key);
                if ("object" != typeof e) return t.error("Child expected, but input is not object");
                var i = r._encode(e[r._baseState.key], t, e);
                return t.leaveKey(n), i
            }, this).filter(function(e) {
                return e
            }), o = this._createEncoderBuffer(o);
            else if ("seqof" === i.tag || "setof" === i.tag) {
                if (!i.args || 1 !== i.args.length) return t.error("Too many args for : " + i.tag);
                if (!Array.isArray(e)) return t.error("seqof/setof, but data is not Array");
                var f = this.clone();
                f._baseState.implicit = null, o = this._createEncoderBuffer(e.map(function(r) {
                    var n = this._baseState;
                    return this._getUse(n.args[0], e)._encode(r, t)
                }, f))
            } else null !== i.use ? s = this._getUse(i.use, r)._encode(e, t) : (o = this._encodePrimitive(i.tag, e), a = !0);
            var s;
            if (!i.any && null === i.choice) {
                var c = null !== i.implicit ? i.implicit : i.tag,
                    u = null === i.implicit ? "universal" : "context";
                null === c ? null === i.use && t.error("Tag could be ommited only for .use()") : null === i.use && (s = this._encodeComposite(c, a, u, o))
            }
            return null !== i.explicit && (s = this._encodeComposite(i.explicit, !1, "context", s)), s
        }, r.prototype._encodeChoice = function(e, t) {
            var r = this._baseState,
                n = r.choice[e.type];
            return n || s(!1, e.type + " not found in " + JSON.stringify(Object.keys(r.choice))), n._encode(e.value, t)
        }, r.prototype._encodePrimitive = function(e, t) {
            var r = this._baseState;
            if ("octstr" === e || "bitstr" === e || "ia5str" === e) return this._encodeStr(t, e);
            if ("objid" === e && r.args) return this._encodeObjid(t, r.reverseArgs[0], r.args[1]);
            if ("objid" === e) return this._encodeObjid(t, null, null);
            if ("gentime" === e || "utctime" === e) return this._encodeTime(t, e);
            if ("null_" === e) return this._encodeNull();
            if ("int" === e || "enum" === e) return this._encodeInt(t, r.args && r.reverseArgs[0]);
            if ("bool" === e) return this._encodeBool(t);
            throw new Error("Unsupported tag: " + e)
        }
    }, {
        "../base": 99,
        "minimalistic-assert": 108
    }],
    101: [function(e, t, r) {
        function n(e) {
            this._reporterState = {
                obj: null,
                path: [],
                options: e || {},
                errors: []
            }
        }

        function i(e, t) {
            this.path = e, this.rethrow(t)
        }
        var s = e("inherits");
        r.Reporter = n, n.prototype.isError = function(e) {
            return e instanceof i
        }, n.prototype.enterKey = function(e) {
            return this._reporterState.path.push(e)
        }, n.prototype.leaveKey = function(e, t, r) {
            var n = this._reporterState;
            n.path = n.path.slice(0, e - 1), null !== n.obj && (n.obj[t] = r)
        }, n.prototype.enterObject = function() {
            var e = this._reporterState,
                t = e.obj;
            return e.obj = {}, t
        }, n.prototype.leaveObject = function(e) {
            var t = this._reporterState,
                r = t.obj;
            return t.obj = e, r
        }, n.prototype.error = function(e) {
            var t, r = this._reporterState,
                n = e instanceof i;
            if (t = n ? e : new i(r.path.map(function(e) {
                    return "[" + JSON.stringify(e) + "]"
                }).join(""), e.message || e, e.stack), !r.options.partial) throw t;
            return n || r.errors.push(t), t
        }, n.prototype.wrapResult = function(e) {
            var t = this._reporterState;
            return t.options.partial ? {
                result: this.isError(e) ? null : e,
                errors: t.errors
            } : e
        }, s(i, Error), i.prototype.rethrow = function(e) {
            return this.message = e + " at: " + (this.path || "(shallow)"), Error.captureStackTrace(this, i), this
        }
    }, {
        inherits: 232
    }],
    102: [function(e, t, r) {
        var n = e("../constants");
        r.tagClass = {
            0: "universal",
            1: "application",
            2: "context",
            3: "private"
        }, r.tagClassByName = n._reverse(r.tagClass), r.tag = {
            0: "end",
            1: "bool",
            2: "int",
            3: "bitstr",
            4: "octstr",
            5: "null_",
            6: "objid",
            7: "objDesc",
            8: "external",
            9: "real",
            10: "enum",
            11: "embed",
            12: "utf8str",
            13: "relativeOid",
            16: "seq",
            17: "set",
            18: "numstr",
            19: "printstr",
            20: "t61str",
            21: "videostr",
            22: "ia5str",
            23: "utctime",
            24: "gentime",
            25: "graphstr",
            26: "iso646str",
            27: "genstr",
            28: "unistr",
            29: "charstr",
            30: "bmpstr"
        }, r.tagByName = n._reverse(r.tag)
    }, {
        "../constants": 103
    }],
    103: [function(e, t, r) {
        var n = r;
        n._reverse = function(e) {
            var t = {};
            return Object.keys(e).forEach(function(r) {
                (0 | r) == r && (r = 0 | r);
                var n = e[r];
                t[n] = r
            }), t
        }, n.der = e("./der")
    }, {
        "./der": 102
    }],
    104: [function(e, t) {
        function r(e) {
            this.enc = "der", this.name = e.name, this.entity = e, this.tree = new n, this.tree._init(e.body)
        }

        function n(e) {
            f.Node.call(this, "der", e)
        }

        function i(e, t) {
            var r = e.readUInt8(t);
            if (e.isError(r)) return r;
            var n = u.tagClass[r >> 6],
                i = 0 === (32 & r);
            if (31 === (31 & r)) {
                var s = r;
                for (r = 0; 128 === (128 & s);) {
                    if (s = e.readUInt8(t), e.isError(s)) return s;
                    r <<= 7, r |= 127 & s
                }
            } else r &= 31;
            var o = u.tag[r];
            return {
                cls: n,
                primitive: i,
                tag: r,
                tagStr: o
            }
        }

        function s(e, t, r) {
            var n = e.readUInt8(r);
            if (e.isError(n)) return n;
            if (!t && 128 === n) return null;
            if (0 === (128 & n)) return n;
            var i = 127 & n;
            if (i >= 4) return e.error("length octect is too long");
            n = 0;
            for (var s = 0; i > s; s++) {
                n <<= 8;
                var o = e.readUInt8(r);
                if (e.isError(o)) return o;
                n |= o
            }
            return n
        }
        var o = e("inherits"),
            a = e("../../asn1"),
            f = a.base,
            c = a.bignum,
            u = a.constants.der;
        t.exports = r, r.prototype.decode = function(e, t) {
            return e instanceof f.DecoderBuffer || (e = new f.DecoderBuffer(e, t)), this.tree._decode(e, t)
        }, o(n, f.Node), n.prototype._peekTag = function(e, t) {
            if (e.isEmpty()) return !1;
            var r = e.save(),
                n = i(e, 'Failed to peek tag: "' + t + '"');
            return e.isError(n) ? n : (e.restore(r), n.tag === t || n.tagStr === t)
        }, n.prototype._decodeTag = function(e, t, r) {
            var n = i(e, 'Failed to decode tag of "' + t + '"');
            if (e.isError(n)) return n;
            var o = s(e, n.primitive, 'Failed to get length of "' + t + '"');
            if (e.isError(o)) return o;
            if (!r && n.tag !== t && n.tagStr !== t && n.tagStr + "of" !== t) return e.error('Failed to match tag: "' + t + '"');
            if (n.primitive || null !== o) return e.skip(o, 'Failed to match body of: "' + t + '"');
            var a = e.start(),
                f = this._skipUntilEnd(e, 'Failed to skip indefinite length body: "' + this.tag + '"');
            return e.isError(f) ? f : e.cut(a)
        }, n.prototype._skipUntilEnd = function(e, t) {
            for (;;) {
                var r = i(e, t);
                if (e.isError(r)) return r;
                var n = s(e, r.primitive, t);
                if (e.isError(n)) return n;
                var o;
                if (o = r.primitive || null !== n ? e.skip(n) : this._skipUntilEnd(e, t), e.isError(o)) return o;
                if ("end" === r.tagStr) break
            }
        }, n.prototype._decodeList = function(e, t, r) {
            for (var n = []; !e.isEmpty();) {
                var i = this._peekTag(e, "end");
                if (e.isError(i)) return i;
                var s = r.decode(e, "der");
                if (e.isError(s) && i) break;
                n.push(s)
            }
            return n
        }, n.prototype._decodeStr = function(e, t) {
            if ("octstr" === t) return e.raw();
            if ("bitstr" === t) {
                var r = e.readUInt8();
                return e.isError(r) ? r : {
                    unused: r,
                    data: e.raw()
                }
            }
            return "ia5str" === t ? e.raw().toString() : this.error("Decoding of string type: " + t + " unsupported")
        }, n.prototype._decodeObjid = function(e, t, r) {
            for (var n = [], i = 0; !e.isEmpty();) {
                var s = e.readUInt8();
                i <<= 7, i |= 127 & s, 0 === (128 & s) && (n.push(i), i = 0)
            }
            128 & s && n.push(i);
            var o = n[0] / 40 | 0,
                a = n[0] % 40;
            return result = r ? n : [o, a].concat(n.slice(1)), t && (result = t[result.join(" ")]), result
        }, n.prototype._decodeTime = function(e, t) {
            var r = e.raw().toString();
            if ("gentime" === t) var n = 0 | r.slice(0, 4),
                i = 0 | r.slice(4, 6),
                s = 0 | r.slice(6, 8),
                o = 0 | r.slice(8, 10),
                a = 0 | r.slice(10, 12),
                f = 0 | r.slice(12, 14);
            else {
                if ("utctime" !== t) return this.error("Decoding " + t + " time is not supported yet");
                var n = 0 | r.slice(0, 2),
                    i = 0 | r.slice(2, 4),
                    s = 0 | r.slice(4, 6),
                    o = 0 | r.slice(6, 8),
                    a = 0 | r.slice(8, 10),
                    f = 0 | r.slice(10, 12);
                n = 70 > n ? 2e3 + n : 1900 + n
            }
            return Date.UTC(n, i - 1, s, o, a, f, 0)
        }, n.prototype._decodeNull = function() {
            return null
        }, n.prototype._decodeBool = function(e) {
            var t = e.readUInt8();
            return e.isError(t) ? t : 0 !== t
        }, n.prototype._decodeInt = function(e, t) {
            var r = 0,
                n = e.raw();
            if (n.length > 3) return new c(n);
            for (; !e.isEmpty();) {
                r <<= 8;
                var i = e.readUInt8();
                if (e.isError(i)) return i;
                r |= i
            }
            return t && (r = t[r] || r), r
        }, n.prototype._use = function(e, t) {
            return "function" == typeof e && (e = e(t)), e._getDecoder("der").tree
        }
    }, {
        "../../asn1": 96,
        inherits: 232
    }],
    105: [function(e, t, r) {
        var n = r;
        n.der = e("./der")
    }, {
        "./der": 104
    }],
    106: [function(e, t) {
        function r(e) {
            this.enc = "der", this.name = e.name, this.entity = e, this.tree = new n, this.tree._init(e.body)
        }

        function n(e) {
            c.Node.call(this, "der", e)
        }

        function i(e) {
            return 10 >= e ? "0" + e : e
        }

        function s(e, t, r, n) {
            var i;
            if ("seqof" === e ? e = "seq" : "setof" === e && (e = "set"), d.tagByName.hasOwnProperty(e)) i = d.tagByName[e];
            else {
                if ("number" != typeof e || (0 | e) !== e) return n.error("Unknown tag: " + e);
                i = e
            }
            return i >= 31 ? n.error("Multi-octet tag encoding unsupported") : (t || (i |= 32), i |= d.tagClassByName[r || "universal"] << 6)
        }
        var o = e("inherits"),
            a = e("buffer").Buffer,
            f = e("../../asn1"),
            c = f.base,
            u = f.bignum,
            d = f.constants.der;
        t.exports = r, r.prototype.encode = function(e, t) {
            return this.tree._encode(e, t).join()
        }, o(n, c.Node), n.prototype._encodeComposite = function(e, t, r, n) {
            var i = s(e, t, r, this.reporter);
            if (n.length < 128) {
                var o = new a(2);
                return o[0] = i, o[1] = n.length, this._createEncoderBuffer([o, n])
            }
            for (var f = 1, c = n.length; c >= 256; c >>= 8) f++;
            var o = new a(2 + f);
            o[0] = i, o[1] = 128 | f;
            for (var c = 1 + f, u = n.length; u > 0; c--, u >>= 8) o[c] = 255 & u;
            return this._createEncoderBuffer([o, n])
        }, n.prototype._encodeStr = function(e, t) {
            return "octstr" === t ? this._createEncoderBuffer(e) : "bitstr" === t ? this._createEncoderBuffer([0 | e.unused, e.data]) : "ia5str" === t ? this._createEncoderBuffer(e) : this.reporter.error("Encoding of string type: " + t + " unsupported")
        }, n.prototype._encodeObjid = function(e, t, r) {
            if ("string" == typeof e) {
                if (!t) return this.reporter.error("string objid given, but no values map found");
                if (!t.hasOwnProperty(e)) return this.reporter.error("objid not found in values map");
                e = t[e].split(/\s+/g);
                for (var n = 0; n < e.length; n++) e[n] |= 0
            } else Array.isArray(e) && (e = e.slice());
            if (!Array.isArray(e)) return this.reporter.error("objid() should be either array or string, got: " + JSON.stringify(e));
            if (!r) {
                if (e[1] >= 40) return this.reporter.error("Second objid identifier OOB");
                e.splice(0, 2, 40 * e[0] + e[1])
            }
            for (var i = 0, n = 0; n < e.length; n++) {
                var s = e[n];
                for (i++; s >= 128; s >>= 7) i++
            }
            for (var o = new a(i), f = o.length - 1, n = e.length - 1; n >= 0; n--) {
                var s = e[n];
                for (o[f--] = 127 & s;
                    (s >>= 7) > 0;) o[f--] = 128 | 127 & s
            }
            return this._createEncoderBuffer(o)
        }, n.prototype._encodeTime = function(e, t) {
            var r, n = new Date(e);
            return "gentime" === t ? r = [n.getFullYear(), i(n.getUTCMonth() + 1), i(n.getUTCDate()), i(n.getUTCHours()), i(n.getUTCMinutes()), i(n.getUTCSeconds()), "Z"].join("") : "utctime" === t ? r = [n.getFullYear() % 100, i(n.getUTCMonth() + 1), i(n.getUTCDate()), i(n.getUTCHours()), i(n.getUTCMinutes()), i(n.getUTCSeconds()), "Z"].join("") : this.reporter.error("Encoding " + t + " time is not supported yet"), this._encodeStr(r, "octstr")
        }, n.prototype._encodeNull = function() {
            return this._createEncoderBuffer("")
        }, n.prototype._encodeInt = function(e, t) {
            if ("string" == typeof e) {
                if (!t) return this.reporter.error("String int or enum given, but no values map");
                if (!t.hasOwnProperty(e)) return this.reporter.error("Values map doesn't contain: " + JSON.stringify(e));
                e = t[e]
            }
            if (null !== u && e instanceof u) {
                var r = e.toArray();
                e.sign === !1 && 128 & r[0] && r.unshift(0), e = new a(r)
            }
            if (a.isBuffer(e)) {
                var n = e.length;
                0 === e.length && n++;
                var i = new a(n);
                return e.copy(i), 0 === e.length && (i[0] = 0), this._createEncoderBuffer(i)
            }
            if (128 > e) return this._createEncoderBuffer(e);
            if (256 > e) return this._createEncoderBuffer([0, e]);
            for (var n = 1, s = e; s >= 256; s >>= 8) n++;
            for (var i = new Array(n), s = i.length - 1; s >= 0; s--) i[s] = 255 & e, e >>= 8;
            return 128 & i[0] && i.unshift(0), this._createEncoderBuffer(new a(i))
        }, n.prototype._encodeBool = function(e) {
            return this._createEncoderBuffer(e ? 255 : 0)
        }, n.prototype._use = function(e, t) {
            return "function" == typeof e && (e = e(t)), e._getEncoder("der").tree
        }, n.prototype._skipDefault = function(e, t, r) {
            var n, i = this._baseState;
            if (null === i["default"]) return !1;
            var s = e.join();
            if (void 0 === i.defaultBuffer && (i.defaultBuffer = this._encodeValue(i["default"], t, r).join()), s.length !== i.defaultBuffer.length) return !1;
            for (n = 0; n < s.length; n++)
                if (s[n] !== i.defaultBuffer[n]) return !1;
            return !0
        }
    }, {
        "../../asn1": 96,
        buffer: 43,
        inherits: 232
    }],
    107: [function(e, t, r) {
        var n = r;
        n.der = e("./der")
    }, {
        "./der": 106
    }],
    108: [function(e, t) {
        function r(e, t) {
            if (!e) throw new Error(t || "Assertion failed")
        }
        t.exports = r, r.equal = function(e, t, r) {
            if (e != t) throw new Error(r || "Assertion failed: " + e + " != " + t)
        }
    }, {}],
    109: [function(e, t, r) {
        r.strip = function(e) {
            e = e.toString();
            var t = /^-----BEGIN (.*)-----\n/,
                r = t.exec(e),
                n = r[1],
                i = new RegExp("\n-----END " + n + "-----(\n*)$"),
                s = e.slice(r[0].length).replace(i, "").replace(/\n/g, "");
            return {
                tag: n,
                base64: s
            }
        };
        var n = function(e, t) {
            for (var r = []; e;) {
                if (e.length < t) {
                    r.push(e);
                    break
                }
                r.push(e.substr(0, t)), e = e.substr(t)
            }
            return r.join("\n")
        };
        r.assemble = function(e) {
            var t = e.tag,
                r = e.base64,
                i = "-----BEGIN " + t + "-----",
                s = "-----END " + t + "-----";
            return i + "\n" + n(r, 64) + "\n" + s + "\n"
        }
    }, {}],
    110: [function(e, t) {
        (function(r) {
            function n(e, t, r, n) {
                var o = h(t, n);
                if (o.curve) return i(e, o, n);
                if ("dsa" === o.type) return s(e, o, r, n);
                for (var a = o.modulus.byteLength(), f = [0, 1]; e.length + f.length + 1 < a;) f.push(255);
                f.push(0);
                for (var c = -1; ++c < e.length;) f.push(e[c]);
                var u = b(f, o, n);
                return u
            }

            function i(e, t, n) {
                l.rand = n.randomBytes;
                var i;
                "1.3.132.0.10" === t.curve.join(".") && (i = new l.ec("secp256k1"));
                var s = i.genKeyPair();
                s._importPrivate(t.privateKey);
                var o = s.sign(e);
                return new r(o.toDER())
            }

            function s(e, t, r, n) {
                for (var i, s = t.params.priv_key, c = t.params.p, h = t.params.q, l = (p.mont(h), t.params.g), b = new p(0), g = f(e, h).mod(h), y = !1, m = a(s, h, e, r, n); y === !1;) i = u(h, m, r, n), b = d(l, i, c, h), y = i.invm(h).imul(g.add(s.mul(b))).mod(h), y.cmpn(0) || (y = !1, b = new p(0));
                return o(b, y)
            }

            function o(e, t) {
                e = e.toArray(), t = t.toArray(), 128 & e[0] && (e = [0].concat(e)), 128 & t[0] && (t = [0].concat(t));
                var n = e.length + t.length + 4,
                    i = [48, n, 2, e.length];
                return i = i.concat(e, [2, t.length], t), new r(i)
            }

            function a(e, t, n, i, s) {
                if (e = new r(e.toArray()), e.length < t.byteLength()) {
                    var o = new r(t.byteLength() - e.length);
                    o.fill(0), e = r.concat([o, e])
                }
                var a = n.length,
                    f = c(n, t),
                    u = new r(a);
                u.fill(1);
                var d = new r(a);
                return d.fill(0), d = s.createHmac(i, d).update(u).update(new r([0])).update(e).update(f).digest(), u = s.createHmac(i, d).update(u).digest(), d = s.createHmac(i, d).update(u).update(new r([1])).update(e).update(f).digest(), u = s.createHmac(i, d).update(u).digest(), {
                    k: d,
                    v: u
                }
            }

            function f(e, t) {
                bits = new p(e);
                var r = 8 * e.length - t.bitLength();
                return r > 0 && bits.ishrn(r), bits
            }

            function c(e, t) {
                e = f(e, t), e = e.mod(t);
                var n = new r(e.toArray());
                if (n.length < t.byteLength()) {
                    var i = new r(t.byteLength() - n.length);
                    i.fill(0), n = r.concat([i, n])
                }
                return n
            }

            function u(e, t, n, i) {
                for (var s, o;;) {
                    for (s = new r(""); 8 * s.length < e.bitLength();) t.v = i.createHmac(n, t.k).update(t.v).digest(), s = r.concat([s, t.v]);
                    if (o = f(s, e), t.k = i.createHmac(n, t.k).update(t.v).update(new r([0])).digest(), t.v = i.createHmac(n, t.k).update(t.v).digest(), -1 === o.cmp(e)) return o
                }
            }

            function d(e, t, r, n) {
                return e.toRed(p.mont(r)).redPow(t).fromRed().mod(n)
            }
            var h = e("parse-asn1"),
                p = e("bn.js"),
                l = e("elliptic"),
                b = e("browserify-rsa");
            t.exports = n, t.exports.getKay = a, t.exports.makeKey = u
        }).call(this, e("buffer").Buffer)
    }, {
        "bn.js": 68,
        "browserify-rsa": 69,
        buffer: 43,
        elliptic: 70,
        "parse-asn1": 94
    }],
    111: [function(e, t) {
        (function(r) {
            function n(e, t, n) {
                var o = a(n);
                if ("ec" === o.type) return i(e, t, o);
                if ("dsa" === o.type) return s(e, t, o);
                for (var f = o.modulus.byteLength(), u = [0, 1]; t.length + u.length + 1 < f;) u.push(255);
                u.push(0);
                for (var d = -1; ++d < t.length;) u.push(t[d]);
                u = t;
                var h = c.mont(o.modulus);
                e = new c(e).toRed(h), e = e.redPow(new c(o.publicExponent)), e = new r(e.fromRed().toArray()), e = e.slice(e.length - t.length);
                var p = 0;
                for (f = e.length, d = -1; ++d < f;) p += e[d] ^ t[d];
                return !p
            }

            function i(e, t, r) {
                var n;
                "1.3.132.0.10" === r.data.algorithm.curve.join(".") && (n = new f.ec("secp256k1"));
                var i = r.data.subjectPrivateKey.data;
                return n.verify(t.toString("hex"), e.toString("hex"), i.toString("hex"))
            }

            function s(e, t, r) {
                var n = r.data.p,
                    i = r.data.q,
                    s = r.data.g,
                    f = r.data.pub_key,
                    u = a.signature.decode(e, "der"),
                    d = u.s,
                    h = u.r;
                o(d, i), o(h, i);
                var p = (c.mont(i), c.mont(n)),
                    l = d.invm(i),
                    b = s.toRed(p).redPow(new c(t).mul(l).mod(i)).fromRed().mul(f.toRed(p).redPow(h.mul(l).mod(i)).fromRed()).mod(n).mod(i);
                return !b.cmp(h)
            }

            function o(e, t) {
                if (e.cmpn(0) <= 0) throw new Error("invalid sig");
                if (e.cmp(t) >= t) throw new Error("invalid sig")
            }
            var a = e("parse-asn1"),
                f = e("elliptic"),
                c = e("bn.js");
            t.exports = n
        }).call(this, e("buffer").Buffer)
    }, {
        "bn.js": 68,
        buffer: 43,
        elliptic: 70,
        "parse-asn1": 94
    }],
    112: [function(e, t) {
        (function(r) {
            function n(e, t) {
                s.rand = t.randomBytes, this.curve = new s.ec(e), this.keys = void 0
            }

            function i(e, t) {
                Array.isArray(e) || (e = e.toArray());
                var n = new r(e);
                return t ? n.toString(t) : n
            }
            var s = e("elliptic"),
                o = e("bn.js");
            t.exports = n, n.prototype.generateKeys = function(e, t) {
                return this.keys = this.curve.genKeyPair(), this.getPublicKey(e, t)
            }, n.prototype.computeSecret = function(e, t, n) {
                t = t || "utf8", r.isBuffer(e) || (e = new r(e, t)), e = new o(e), e = e.toString(16);
                var s = this.curve.keyPair(e, "hex").getPublic(),
                    a = s.mul(this.keys.getPrivate()).getX();
                return i(a, n)
            }, n.prototype.getPublicKey = function(e, t) {
                var r = this.keys.getPublic("compressed" === t, !0);
                return "hybrid" === t && (r[0] = r[r.length - 1] % 2 ? 7 : 6), i(r, e)
            }, n.prototype.getPrivateKey = function(e) {
                return i(this.keys.getPrivate(), e)
            }, n.prototype.setPublicKey = function(e, t) {
                t = t || "utf8", r.isBuffer(e) || (e = new r(e, t));
                var n = new o(e);
                n = n.toArray(), this.keys._importPublicHex(n)
            }, n.prototype.setPrivateKey = function(e, t) {
                t = t || "utf8", r.isBuffer(e) || (e = new r(e, t));
                var n = new o(e);
                n = n.toString(16), this.keys._importPrivate(n)
            }
        }).call(this, e("buffer").Buffer)
    }, {
        "bn.js": 114,
        buffer: 43,
        elliptic: 115
    }],
    113: [function(e, t) {
        var r = e("./ecdh");
        t.exports = function(e, t) {
            t.createECDH = function(t) {
                return new r(t, e)
            }
        }
    }, {
        "./ecdh": 112
    }],
    114: [function(e, t) {
        t.exports = e(68)
    }, {
        "/home/maraoz/git/bitcore/node_modules/bitcore-build/node_modules/browserify/node_modules/crypto-browserify/node_modules/browserify-sign/node_modules/bn.js/lib/bn.js": 68
    }],
    115: [function(e, t) {
        t.exports = e(70)
    }, {
        "../package.json": 134,
        "./elliptic/curve": 118,
        "./elliptic/curves": 121,
        "./elliptic/ec": 122,
        "./elliptic/hmac-drbg": 125,
        "./elliptic/utils": 126,
        "/home/maraoz/git/bitcore/node_modules/bitcore-build/node_modules/browserify/node_modules/crypto-browserify/node_modules/browserify-sign/node_modules/elliptic/lib/elliptic.js": 70,
        brorand: 127
    }],
    116: [function(e, t) {
        t.exports = e(71)
    }, {
        "../../elliptic": 115,
        "/home/maraoz/git/bitcore/node_modules/bitcore-build/node_modules/browserify/node_modules/crypto-browserify/node_modules/browserify-sign/node_modules/elliptic/lib/elliptic/curve/base.js": 71,
        "bn.js": 114
    }],
    117: [function(e, t) {
        t.exports = e(72)
    }, {
        "../../elliptic": 115,
        "../curve": 118,
        "/home/maraoz/git/bitcore/node_modules/bitcore-build/node_modules/browserify/node_modules/crypto-browserify/node_modules/browserify-sign/node_modules/elliptic/lib/elliptic/curve/edwards.js": 72,
        "bn.js": 114,
        inherits: 232
    }],
    118: [function(e, t) {
        t.exports = e(73)
    }, {
        "./base": 116,
        "./edwards": 117,
        "./mont": 119,
        "./short": 120,
        "/home/maraoz/git/bitcore/node_modules/bitcore-build/node_modules/browserify/node_modules/crypto-browserify/node_modules/browserify-sign/node_modules/elliptic/lib/elliptic/curve/index.js": 73
    }],
    119: [function(e, t) {
        t.exports = e(74)
    }, {
        "../../elliptic": 115,
        "../curve": 118,
        "/home/maraoz/git/bitcore/node_modules/bitcore-build/node_modules/browserify/node_modules/crypto-browserify/node_modules/browserify-sign/node_modules/elliptic/lib/elliptic/curve/mont.js": 74,
        "bn.js": 114,
        inherits: 232
    }],
    120: [function(e, t) {
        t.exports = e(75)
    }, {
        "../../elliptic": 115,
        "../curve": 118,
        "/home/maraoz/git/bitcore/node_modules/bitcore-build/node_modules/browserify/node_modules/crypto-browserify/node_modules/browserify-sign/node_modules/elliptic/lib/elliptic/curve/short.js": 75,
        "bn.js": 114,
        inherits: 232
    }],
    121: [function(e, t) {
        t.exports = e(76)
    }, {
        "../elliptic": 115,
        "/home/maraoz/git/bitcore/node_modules/bitcore-build/node_modules/browserify/node_modules/crypto-browserify/node_modules/browserify-sign/node_modules/elliptic/lib/elliptic/curves.js": 76,
        "bn.js": 114,
        "hash.js": 128
    }],
    122: [function(e, t) {
        t.exports = e(77)
    }, {
        "../../elliptic": 115,
        "./key": 123,
        "./signature": 124,
        "/home/maraoz/git/bitcore/node_modules/bitcore-build/node_modules/browserify/node_modules/crypto-browserify/node_modules/browserify-sign/node_modules/elliptic/lib/elliptic/ec/index.js": 77,
        "bn.js": 114
    }],
    123: [function(e, t) {
        t.exports = e(78)
    }, {
        "../../elliptic": 115,
        "/home/maraoz/git/bitcore/node_modules/bitcore-build/node_modules/browserify/node_modules/crypto-browserify/node_modules/browserify-sign/node_modules/elliptic/lib/elliptic/ec/key.js": 78,
        "bn.js": 114
    }],
    124: [function(e, t) {
        t.exports = e(79)
    }, {
        "../../elliptic": 115,
        "/home/maraoz/git/bitcore/node_modules/bitcore-build/node_modules/browserify/node_modules/crypto-browserify/node_modules/browserify-sign/node_modules/elliptic/lib/elliptic/ec/signature.js": 79,
        "bn.js": 114
    }],
    125: [function(e, t) {
        t.exports = e(80)
    }, {
        "../elliptic": 115,
        "/home/maraoz/git/bitcore/node_modules/bitcore-build/node_modules/browserify/node_modules/crypto-browserify/node_modules/browserify-sign/node_modules/elliptic/lib/elliptic/hmac-drbg.js": 80,
        "hash.js": 128
    }],
    126: [function(e, t) {
        t.exports = e(81)
    }, {
        "/home/maraoz/git/bitcore/node_modules/bitcore-build/node_modules/browserify/node_modules/crypto-browserify/node_modules/browserify-sign/node_modules/elliptic/lib/elliptic/utils.js": 81,
        "bn.js": 114
    }],
    127: [function(e, t) {
        t.exports = e(82)
    }, {
        "/home/maraoz/git/bitcore/node_modules/bitcore-build/node_modules/browserify/node_modules/crypto-browserify/node_modules/browserify-sign/node_modules/elliptic/node_modules/brorand/index.js": 82
    }],
    128: [function(e, t) {
        t.exports = e(83)
    }, {
        "./hash/common": 129,
        "./hash/hmac": 130,
        "./hash/ripemd": 131,
        "./hash/sha": 132,
        "./hash/utils": 133,
        "/home/maraoz/git/bitcore/node_modules/bitcore-build/node_modules/browserify/node_modules/crypto-browserify/node_modules/browserify-sign/node_modules/elliptic/node_modules/hash.js/lib/hash.js": 83
    }],
    129: [function(e, t) {
        t.exports = e(84)
    }, {
        "../hash": 128,
        "/home/maraoz/git/bitcore/node_modules/bitcore-build/node_modules/browserify/node_modules/crypto-browserify/node_modules/browserify-sign/node_modules/elliptic/node_modules/hash.js/lib/hash/common.js": 84
    }],
    130: [function(e, t) {
        t.exports = e(85)
    }, {
        "../hash": 128,
        "/home/maraoz/git/bitcore/node_modules/bitcore-build/node_modules/browserify/node_modules/crypto-browserify/node_modules/browserify-sign/node_modules/elliptic/node_modules/hash.js/lib/hash/hmac.js": 85
    }],
    131: [function(e, t) {
        t.exports = e(86)
    }, {
        "../hash": 128,
        "/home/maraoz/git/bitcore/node_modules/bitcore-build/node_modules/browserify/node_modules/crypto-browserify/node_modules/browserify-sign/node_modules/elliptic/node_modules/hash.js/lib/hash/ripemd.js": 86
    }],
    132: [function(e, t) {
        t.exports = e(87)
    }, {
        "../hash": 128,
        "/home/maraoz/git/bitcore/node_modules/bitcore-build/node_modules/browserify/node_modules/crypto-browserify/node_modules/browserify-sign/node_modules/elliptic/node_modules/hash.js/lib/hash/sha.js": 87
    }],
    133: [function(e, t) {
        t.exports = e(88)
    }, {
        "/home/maraoz/git/bitcore/node_modules/bitcore-build/node_modules/browserify/node_modules/crypto-browserify/node_modules/browserify-sign/node_modules/elliptic/node_modules/hash.js/lib/hash/utils.js": 88,
        inherits: 232
    }],
    134: [function(e, t) {
        t.exports = e(89)
    }, {
        "/home/maraoz/git/bitcore/node_modules/bitcore-build/node_modules/browserify/node_modules/crypto-browserify/node_modules/browserify-sign/node_modules/elliptic/package.json": 89
    }],
    135: [function(e, t) {
        (function(r) {
            "use strict";

            function n(e) {
                f.call(this), this._hash = e, this.buffers = []
            }

            function i(e) {
                f.call(this), this._hash = e
            }
            var s = e("sha.js"),
                o = e("./md5"),
                a = e("ripemd160"),
                f = e("stream").Transform,
                c = e("inherits");
            t.exports = function(e) {
                return "md5" === e ? new n(o) : "rmd160" === e ? new n(a) : new i(s(e))
            }, c(n, f), n.prototype._transform = function(e, t, r) {
                this.buffers.push(e), r()
            }, n.prototype._flush = function(e) {
                var t = r.concat(this.buffers),
                    n = this._hash(t);
                this.buffers = null, this.push(n), e()
            }, n.prototype.update = function(e, t) {
                return this.write(e, t), this
            }, n.prototype.digest = function(e) {
                this.end();
                for (var t, n = new r(""); t = this.read();) n = r.concat([n, t]);
                return e && (n = n.toString(e)), n
            }, c(i, f), i.prototype._transform = function(e, t, r) {
                this._hash.update(e), r()
            }, i.prototype._flush = function(e) {
                this.push(this._hash.digest()), this._hash = null, e()
            }, i.prototype.update = function(e, t) {
                return this.write(e, t), this
            }, i.prototype.digest = function(e) {
                this.end();
                for (var t, n = new r(""); t = this.read();) n = r.concat([n, t]);
                return e && (n = n.toString(e)), n
            }
        }).call(this, e("buffer").Buffer)
    }, {
        "./md5": 137,
        buffer: 43,
        inherits: 232,
        ripemd160: 138,
        "sha.js": 140,
        stream: 203
    }],
    136: [function(e, t, r) {
        (function(e) {
            "use strict";

            function t(t, r) {
                if (t.length % s !== 0) {
                    var n = t.length + (s - t.length % s);
                    t = e.concat([t, o], n)
                }
                for (var i = [], a = r ? t.readInt32BE : t.readInt32LE, f = 0; f < t.length; f += s) i.push(a.call(t, f));
                return i
            }

            function n(t, r, n) {
                for (var i = new e(r), s = n ? i.writeInt32BE : i.writeInt32LE, o = 0; o < t.length; o++) s.call(i, t[o], 4 * o, !0);
                return i
            }

            function i(r, i, s, o) {
                e.isBuffer(r) || (r = new e(r));
                var f = i(t(r, o), r.length * a);
                return n(f, s, o)
            }
            var s = 4,
                o = new e(s);
            o.fill(0);
            var a = 8;
            r.hash = i
        }).call(this, e("buffer").Buffer)
    }, {
        buffer: 43
    }],
    137: [function(e, t) {
        "use strict";

        function r(e, t) {
            e[t >> 5] |= 128 << t % 32, e[(t + 64 >>> 9 << 4) + 14] = t;
            for (var r = 1732584193, n = -271733879, c = -1732584194, u = 271733878, d = 0; d < e.length; d += 16) {
                var h = r,
                    p = n,
                    l = c,
                    b = u;
                r = i(r, n, c, u, e[d + 0], 7, -680876936), u = i(u, r, n, c, e[d + 1], 12, -389564586), c = i(c, u, r, n, e[d + 2], 17, 606105819), n = i(n, c, u, r, e[d + 3], 22, -1044525330), r = i(r, n, c, u, e[d + 4], 7, -176418897), u = i(u, r, n, c, e[d + 5], 12, 1200080426), c = i(c, u, r, n, e[d + 6], 17, -1473231341), n = i(n, c, u, r, e[d + 7], 22, -45705983), r = i(r, n, c, u, e[d + 8], 7, 1770035416), u = i(u, r, n, c, e[d + 9], 12, -1958414417), c = i(c, u, r, n, e[d + 10], 17, -42063), n = i(n, c, u, r, e[d + 11], 22, -1990404162), r = i(r, n, c, u, e[d + 12], 7, 1804603682), u = i(u, r, n, c, e[d + 13], 12, -40341101), c = i(c, u, r, n, e[d + 14], 17, -1502002290), n = i(n, c, u, r, e[d + 15], 22, 1236535329), r = s(r, n, c, u, e[d + 1], 5, -165796510), u = s(u, r, n, c, e[d + 6], 9, -1069501632), c = s(c, u, r, n, e[d + 11], 14, 643717713), n = s(n, c, u, r, e[d + 0], 20, -373897302), r = s(r, n, c, u, e[d + 5], 5, -701558691), u = s(u, r, n, c, e[d + 10], 9, 38016083), c = s(c, u, r, n, e[d + 15], 14, -660478335), n = s(n, c, u, r, e[d + 4], 20, -405537848), r = s(r, n, c, u, e[d + 9], 5, 568446438), u = s(u, r, n, c, e[d + 14], 9, -1019803690), c = s(c, u, r, n, e[d + 3], 14, -187363961), n = s(n, c, u, r, e[d + 8], 20, 1163531501), r = s(r, n, c, u, e[d + 13], 5, -1444681467), u = s(u, r, n, c, e[d + 2], 9, -51403784), c = s(c, u, r, n, e[d + 7], 14, 1735328473), n = s(n, c, u, r, e[d + 12], 20, -1926607734), r = o(r, n, c, u, e[d + 5], 4, -378558), u = o(u, r, n, c, e[d + 8], 11, -2022574463), c = o(c, u, r, n, e[d + 11], 16, 1839030562), n = o(n, c, u, r, e[d + 14], 23, -35309556), r = o(r, n, c, u, e[d + 1], 4, -1530992060), u = o(u, r, n, c, e[d + 4], 11, 1272893353), c = o(c, u, r, n, e[d + 7], 16, -155497632), n = o(n, c, u, r, e[d + 10], 23, -1094730640), r = o(r, n, c, u, e[d + 13], 4, 681279174), u = o(u, r, n, c, e[d + 0], 11, -358537222), c = o(c, u, r, n, e[d + 3], 16, -722521979), n = o(n, c, u, r, e[d + 6], 23, 76029189), r = o(r, n, c, u, e[d + 9], 4, -640364487), u = o(u, r, n, c, e[d + 12], 11, -421815835), c = o(c, u, r, n, e[d + 15], 16, 530742520), n = o(n, c, u, r, e[d + 2], 23, -995338651), r = a(r, n, c, u, e[d + 0], 6, -198630844), u = a(u, r, n, c, e[d + 7], 10, 1126891415), c = a(c, u, r, n, e[d + 14], 15, -1416354905), n = a(n, c, u, r, e[d + 5], 21, -57434055), r = a(r, n, c, u, e[d + 12], 6, 1700485571), u = a(u, r, n, c, e[d + 3], 10, -1894986606), c = a(c, u, r, n, e[d + 10], 15, -1051523), n = a(n, c, u, r, e[d + 1], 21, -2054922799), r = a(r, n, c, u, e[d + 8], 6, 1873313359), u = a(u, r, n, c, e[d + 15], 10, -30611744), c = a(c, u, r, n, e[d + 6], 15, -1560198380), n = a(n, c, u, r, e[d + 13], 21, 1309151649), r = a(r, n, c, u, e[d + 4], 6, -145523070), u = a(u, r, n, c, e[d + 11], 10, -1120210379), c = a(c, u, r, n, e[d + 2], 15, 718787259), n = a(n, c, u, r, e[d + 9], 21, -343485551), r = f(r, h), n = f(n, p), c = f(c, l), u = f(u, b)
            }
            return Array(r, n, c, u)
        }

        function n(e, t, r, n, i, s) {
            return f(c(f(f(t, e), f(n, s)), i), r)
        }

        function i(e, t, r, i, s, o, a) {
            return n(t & r | ~t & i, e, t, s, o, a)
        }

        function s(e, t, r, i, s, o, a) {
            return n(t & i | r & ~i, e, t, s, o, a)
        }

        function o(e, t, r, i, s, o, a) {
            return n(t ^ r ^ i, e, t, s, o, a)
        }

        function a(e, t, r, i, s, o, a) {
            return n(r ^ (t | ~i), e, t, s, o, a)
        }

        function f(e, t) {
            var r = (65535 & e) + (65535 & t),
                n = (e >> 16) + (t >> 16) + (r >> 16);
            return n << 16 | 65535 & r
        }

        function c(e, t) {
            return e << t | e >>> 32 - t
        }
        var u = e("./helpers");
        t.exports = function(e) {
            return u.hash(e, r, 16)
        }
    }, {
        "./helpers": 136
    }],
    138: [function(e, t) {
        (function(e) {
            function r(e) {
                for (var t = [], r = 0, n = 0; r < e.length; r++, n += 8) t[n >>> 5] |= e[r] << 24 - n % 32;
                return t
            }

            function n(e) {
                for (var t = [], r = 0; r < 32 * e.length; r += 8) t.push(e[r >>> 5] >>> 24 - r % 32 & 255);
                return t
            }

            function i(e, t, r) {
                for (var n = 0; 16 > n; n++) {
                    var i = r + n,
                        d = t[i];
                    t[i] = 16711935 & (d << 8 | d >>> 24) | 4278255360 & (d << 24 | d >>> 8)
                }
                var m, v, _, w, S, k, I, E, A, x;
                k = m = e[0], I = v = e[1], E = _ = e[2], A = w = e[3], x = S = e[4];
                for (var P, n = 0; 80 > n; n += 1) P = m + t[r + h[n]] | 0, P += 16 > n ? s(v, _, w) + g[0] : 32 > n ? o(v, _, w) + g[1] : 48 > n ? a(v, _, w) + g[2] : 64 > n ? f(v, _, w) + g[3] : c(v, _, w) + g[4], P = 0 | P, P = u(P, l[n]), P = P + S | 0, m = S, S = w, w = u(_, 10), _ = v, v = P, P = k + t[r + p[n]] | 0, P += 16 > n ? c(I, E, A) + y[0] : 32 > n ? f(I, E, A) + y[1] : 48 > n ? a(I, E, A) + y[2] : 64 > n ? o(I, E, A) + y[3] : s(I, E, A) + y[4], P = 0 | P, P = u(P, b[n]), P = P + x | 0, k = x, x = A, A = u(E, 10), E = I, I = P;
                P = e[1] + _ + A | 0, e[1] = e[2] + w + x | 0, e[2] = e[3] + S + k | 0, e[3] = e[4] + m + I | 0, e[4] = e[0] + v + E | 0, e[0] = P
            }

            function s(e, t, r) {
                return e ^ t ^ r
            }

            function o(e, t, r) {
                return e & t | ~e & r
            }

            function a(e, t, r) {
                return (e | ~t) ^ r
            }

            function f(e, t, r) {
                return e & r | t & ~r
            }

            function c(e, t, r) {
                return e ^ (t | ~r)
            }

            function u(e, t) {
                return e << t | e >>> 32 - t
            }

            function d(t) {
                var s = [1732584193, 4023233417, 2562383102, 271733878, 3285377520];
                "string" == typeof t && (t = new e(t, "utf8"));
                var o = r(t),
                    a = 8 * t.length,
                    f = 8 * t.length;
                o[a >>> 5] |= 128 << 24 - a % 32, o[(a + 64 >>> 9 << 4) + 14] = 16711935 & (f << 8 | f >>> 24) | 4278255360 & (f << 24 | f >>> 8);
                for (var c = 0; c < o.length; c += 16) i(s, o, c);
                for (var c = 0; 5 > c; c++) {
                    var u = s[c];
                    s[c] = 16711935 & (u << 8 | u >>> 24) | 4278255360 & (u << 24 | u >>> 8)
                }
                var d = n(s);
                return new e(d)
            }
            var h = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13],
                p = [5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11],
                l = [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6],
                b = [8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11],
                g = [0, 1518500249, 1859775393, 2400959708, 2840853838],
                y = [1352829926, 1548603684, 1836072691, 2053994217, 0];
            t.exports = d
        }).call(this, e("buffer").Buffer)
    }, {
        buffer: 43
    }],
    139: [function(e, t) {
        (function(e) {
            function r(t, r) {
                this._block = new e(t), this._finalSize = r, this._blockSize = t, this._len = 0, this._s = 0
            }
            r.prototype.update = function(t, r) {
                "string" == typeof t && (r = r || "utf8", t = new e(t, r));
                for (var n = this._len += t.length, i = this._s || 0, s = 0, o = this._block; n > i;) {
                    for (var a = Math.min(t.length, s + this._blockSize - i % this._blockSize), f = a - s, c = 0; f > c; c++) o[i % this._blockSize + c] = t[c + s];
                    i += f, s += f, i % this._blockSize === 0 && this._update(o)
                }
                return this._s = i, this
            }, r.prototype.digest = function(e) {
                var t = 8 * this._len;
                this._block[this._len % this._blockSize] = 128, this._block.fill(0, this._len % this._blockSize + 1), t % (8 * this._blockSize) >= 8 * this._finalSize && (this._update(this._block), this._block.fill(0)), this._block.writeInt32BE(t, this._blockSize - 4);
                var r = this._update(this._block) || this._hash();
                return e ? r.toString(e) : r
            }, r.prototype._update = function() {
                throw new Error("_update must be implemented by subclass")
            }, t.exports = r
        }).call(this, e("buffer").Buffer)
    }, {
        buffer: 43
    }],
    140: [function(e, t, r) {
        var r = t.exports = function(e) {
            var t = r[e.toLowerCase()];
            if (!t) throw new Error(e + " is not supported (we accept pull requests)");
            return new t
        };
        r.sha1 = e("./sha1"), r.sha224 = e("./sha224"), r.sha256 = e("./sha256"), r.sha384 = e("./sha384"), r.sha512 = e("./sha512")
    }, {
        "./sha1": 141,
        "./sha224": 142,
        "./sha256": 143,
        "./sha384": 144,
        "./sha512": 145
    }],
    141: [function(e, t) {
        (function(r) {
            function n() {
                this.init(), this._w = a, o.call(this, 64, 56)
            }

            function i(e, t) {
                return e << t | e >>> 32 - t
            }
            var s = e("inherits"),
                o = e("./hash"),
                a = new Array(80);
            s(n, o), n.prototype.init = function() {
                return this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878, this._e = 3285377520, this
            }, n.prototype._update = function(e) {
                function t() {
                    return i(s[d - 3] ^ s[d - 8] ^ s[d - 14] ^ s[d - 16], 1)
                }

                function r(e, t) {
                    s[d] = e;
                    var r = i(o, 5) + t + u + e + n;
                    u = c, c = f, f = i(a, 30), a = o, o = r, d++
                }
                var n, s = this._w,
                    o = this._a,
                    a = this._b,
                    f = this._c,
                    c = this._d,
                    u = this._e,
                    d = 0;
                for (n = 1518500249; 16 > d;) r(e.readInt32BE(4 * d), a & f | ~a & c);
                for (; 20 > d;) r(t(), a & f | ~a & c);
                for (n = 1859775393; 40 > d;) r(t(), a ^ f ^ c);
                for (n = -1894007588; 60 > d;) r(t(), a & f | a & c | f & c);
                for (n = -899497514; 80 > d;) r(t(), a ^ f ^ c);
                this._a = o + this._a | 0, this._b = a + this._b | 0, this._c = f + this._c | 0, this._d = c + this._d | 0, this._e = u + this._e | 0
            }, n.prototype._hash = function() {
                var e = new r(20);
                return e.writeInt32BE(0 | this._a, 0), e.writeInt32BE(0 | this._b, 4), e.writeInt32BE(0 | this._c, 8), e.writeInt32BE(0 | this._d, 12), e.writeInt32BE(0 | this._e, 16), e
            }, t.exports = n
        }).call(this, e("buffer").Buffer)
    }, {
        "./hash": 139,
        buffer: 43,
        inherits: 232
    }],
    142: [function(e, t) {
        (function(r) {
            function n() {
                this.init(), this._w = a, o.call(this, 64, 56)
            }
            var i = e("inherits"),
                s = e("./sha256"),
                o = e("./hash"),
                a = new Array(64);
            i(n, s), n.prototype.init = function() {
                return this._a = -1056596264, this._b = 914150663, this._c = 812702999, this._d = -150054599, this._e = -4191439, this._f = 1750603025, this._g = 1694076839, this._h = -1090891868, this
            }, n.prototype._hash = function() {
                var e = new r(28);
                return e.writeInt32BE(this._a, 0), e.writeInt32BE(this._b, 4), e.writeInt32BE(this._c, 8), e.writeInt32BE(this._d, 12), e.writeInt32BE(this._e, 16), e.writeInt32BE(this._f, 20), e.writeInt32BE(this._g, 24), e
            }, t.exports = n
        }).call(this, e("buffer").Buffer)
    }, {
        "./hash": 139,
        "./sha256": 143,
        buffer: 43,
        inherits: 232
    }],
    143: [function(e, t) {
        (function(r) {
            function n() {
                this.init(), this._w = b, p.call(this, 64, 56)
            }

            function i(e, t) {
                return e >>> t | e << 32 - t
            }

            function s(e, t) {
                return e >>> t
            }

            function o(e, t, r) {
                return e & t ^ ~e & r
            }

            function a(e, t, r) {
                return e & t ^ e & r ^ t & r
            }

            function f(e) {
                return i(e, 2) ^ i(e, 13) ^ i(e, 22)
            }

            function c(e) {
                return i(e, 6) ^ i(e, 11) ^ i(e, 25)
            }

            function u(e) {
                return i(e, 7) ^ i(e, 18) ^ s(e, 3)
            }

            function d(e) {
                return i(e, 17) ^ i(e, 19) ^ s(e, 10)
            }
            var h = e("inherits"),
                p = e("./hash"),
                l = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298],
                b = new Array(64);
            h(n, p), n.prototype.init = function() {
                return this._a = 1779033703, this._b = -1150833019, this._c = 1013904242, this._d = -1521486534, this._e = 1359893119, this._f = -1694144372, this._g = 528734635, this._h = 1541459225, this
            }, n.prototype._update = function(e) {
                function t() {
                    return d(n[v - 2]) + n[v - 7] + u(n[v - 15]) + n[v - 16]
                }

                function r(e) {
                    n[v] = e;
                    var t = m + c(b) + o(b, g, y) + l[v] + e,
                        r = f(i) + a(i, s, h);
                    m = y, y = g, g = b, b = p + t, p = h, h = s, s = i, i = t + r, v++
                }
                for (var n = this._w, i = 0 | this._a, s = 0 | this._b, h = 0 | this._c, p = 0 | this._d, b = 0 | this._e, g = 0 | this._f, y = 0 | this._g, m = 0 | this._h, v = 0; 16 > v;) r(e.readInt32BE(4 * v));
                for (; 64 > v;) r(t());
                this._a = i + this._a | 0, this._b = s + this._b | 0, this._c = h + this._c | 0, this._d = p + this._d | 0, this._e = b + this._e | 0, this._f = g + this._f | 0, this._g = y + this._g | 0, this._h = m + this._h | 0
            }, n.prototype._hash = function() {
                var e = new r(32);
                return e.writeInt32BE(this._a, 0), e.writeInt32BE(this._b, 4), e.writeInt32BE(this._c, 8), e.writeInt32BE(this._d, 12), e.writeInt32BE(this._e, 16), e.writeInt32BE(this._f, 20), e.writeInt32BE(this._g, 24), e.writeInt32BE(this._h, 28), e
            }, t.exports = n
        }).call(this, e("buffer").Buffer)
    }, {
        "./hash": 139,
        buffer: 43,
        inherits: 232
    }],
    144: [function(e, t) {
        (function(r) {
            function n() {
                this.init(), this._w = a, o.call(this, 128, 112)
            }
            var i = e("inherits"),
                s = e("./sha512"),
                o = e("./hash"),
                a = new Array(160);
            i(n, s), n.prototype.init = function() {
                return this._a = -876896931, this._b = 1654270250, this._c = -1856437926, this._d = 355462360, this._e = 1731405415, this._f = -1900787065, this._g = -619958771, this._h = 1203062813, this._al = -1056596264, this._bl = 914150663, this._cl = 812702999, this._dl = -150054599, this._el = -4191439, this._fl = 1750603025, this._gl = 1694076839, this._hl = -1090891868, this
            }, n.prototype._hash = function() {
                function e(e, r, n) {
                    t.writeInt32BE(e, n), t.writeInt32BE(r, n + 4)
                }
                var t = new r(48);
                return e(this._a, this._al, 0), e(this._b, this._bl, 8), e(this._c, this._cl, 16), e(this._d, this._dl, 24), e(this._e, this._el, 32), e(this._f, this._fl, 40), t
            }, t.exports = n
        }).call(this, e("buffer").Buffer)
    }, {
        "./hash": 139,
        "./sha512": 145,
        buffer: 43,
        inherits: 232
    }],
    145: [function(e, t) {
        (function(r) {
            function n() {
                this.init(), this._w = u, f.call(this, 128, 112)
            }

            function i(e, t, r) {
                return e >>> r | t << 32 - r
            }

            function s(e, t, r) {
                return e & t ^ ~e & r
            }

            function o(e, t, r) {
                return e & t ^ e & r ^ t & r
            }
            var a = e("inherits"),
                f = e("./hash"),
                c = [1116352408, 3609767458, 1899447441, 602891725, 3049323471, 3964484399, 3921009573, 2173295548, 961987163, 4081628472, 1508970993, 3053834265, 2453635748, 2937671579, 2870763221, 3664609560, 3624381080, 2734883394, 310598401, 1164996542, 607225278, 1323610764, 1426881987, 3590304994, 1925078388, 4068182383, 2162078206, 991336113, 2614888103, 633803317, 3248222580, 3479774868, 3835390401, 2666613458, 4022224774, 944711139, 264347078, 2341262773, 604807628, 2007800933, 770255983, 1495990901, 1249150122, 1856431235, 1555081692, 3175218132, 1996064986, 2198950837, 2554220882, 3999719339, 2821834349, 766784016, 2952996808, 2566594879, 3210313671, 3203337956, 3336571891, 1034457026, 3584528711, 2466948901, 113926993, 3758326383, 338241895, 168717936, 666307205, 1188179964, 773529912, 1546045734, 1294757372, 1522805485, 1396182291, 2643833823, 1695183700, 2343527390, 1986661051, 1014477480, 2177026350, 1206759142, 2456956037, 344077627, 2730485921, 1290863460, 2820302411, 3158454273, 3259730800, 3505952657, 3345764771, 106217008, 3516065817, 3606008344, 3600352804, 1432725776, 4094571909, 1467031594, 275423344, 851169720, 430227734, 3100823752, 506948616, 1363258195, 659060556, 3750685593, 883997877, 3785050280, 958139571, 3318307427, 1322822218, 3812723403, 1537002063, 2003034995, 1747873779, 3602036899, 1955562222, 1575990012, 2024104815, 1125592928, 2227730452, 2716904306, 2361852424, 442776044, 2428436474, 593698344, 2756734187, 3733110249, 3204031479, 2999351573, 3329325298, 3815920427, 3391569614, 3928383900, 3515267271, 566280711, 3940187606, 3454069534, 4118630271, 4000239992, 116418474, 1914138554, 174292421, 2731055270, 289380356, 3203993006, 460393269, 320620315, 685471733, 587496836, 852142971, 1086792851, 1017036298, 365543100, 1126000580, 2618297676, 1288033470, 3409855158, 1501505948, 4234509866, 1607167915, 987167468, 1816402316, 1246189591],
                u = new Array(160);
            a(n, f), n.prototype.init = function() {
                return this._a = 1779033703, this._b = -1150833019, this._c = 1013904242, this._d = -1521486534, this._e = 1359893119, this._f = -1694144372, this._g = 528734635, this._h = 1541459225, this._al = -205731576, this._bl = -2067093701, this._cl = -23791573, this._dl = 1595750129, this._el = -1377402159, this._fl = 725511199, this._gl = -79577749, this._hl = 327033209, this
            }, n.prototype._update = function(e) {
                function t() {
                    var e = f[x - 30],
                        t = f[x - 30 + 1],
                        r = i(e, t, 1) ^ i(e, t, 8) ^ e >>> 7,
                        s = i(t, e, 1) ^ i(t, e, 8) ^ i(t, e, 7);
                    e = f[x - 4], t = f[x - 4 + 1];
                    var o = i(e, t, 19) ^ i(t, e, 29) ^ e >>> 6,
                        c = i(t, e, 19) ^ i(e, t, 29) ^ i(t, e, 6),
                        u = f[x - 14],
                        d = f[x - 14 + 1],
                        h = f[x - 32],
                        p = f[x - 32 + 1];
                    a = s + d, n = r + u + (s >>> 0 > a >>> 0 ? 1 : 0), a += c, n = n + o + (c >>> 0 > a >>> 0 ? 1 : 0), a += p, n = n + h + (p >>> 0 > a >>> 0 ? 1 : 0)
                }

                function r() {
                    f[x] = n, f[x + 1] = a;
                    var e = o(u, d, h),
                        t = o(m, v, _),
                        r = i(u, m, 28) ^ i(m, u, 2) ^ i(m, u, 7),
                        P = i(m, u, 28) ^ i(u, m, 2) ^ i(u, m, 7),
                        O = i(l, S, 14) ^ i(l, S, 18) ^ i(S, l, 9),
                        B = i(S, l, 14) ^ i(S, l, 18) ^ i(l, S, 9),
                        R = c[x],
                        T = c[x + 1],
                        N = s(l, b, g),
                        j = s(S, k, I),
                        C = E + B,
                        M = y + O + (E >>> 0 > C >>> 0 ? 1 : 0);
                    C += j, M = M + N + (j >>> 0 > C >>> 0 ? 1 : 0), C += T, M = M + R + (T >>> 0 > C >>> 0 ? 1 : 0), C += a, M = M + n + (a >>> 0 > C >>> 0 ? 1 : 0);
                    var U = P + t,
                        z = r + e + (P >>> 0 > U >>> 0 ? 1 : 0);
                    y = g, E = I, g = b, I = k, b = l, k = S, S = w + C | 0, l = p + M + (w >>> 0 > S >>> 0 ? 1 : 0) | 0, p = h, w = _, h = d, _ = v, d = u, v = m, m = C + U | 0, u = M + z + (C >>> 0 > m >>> 0 ? 1 : 0) | 0, A++, x += 2
                }
                for (var n, a, f = this._w, u = 0 | this._a, d = 0 | this._b, h = 0 | this._c, p = 0 | this._d, l = 0 | this._e, b = 0 | this._f, g = 0 | this._g, y = 0 | this._h, m = 0 | this._al, v = 0 | this._bl, _ = 0 | this._cl, w = 0 | this._dl, S = 0 | this._el, k = 0 | this._fl, I = 0 | this._gl, E = 0 | this._hl, A = 0, x = 0; 16 > A;) n = e.readInt32BE(4 * x), a = e.readInt32BE(4 * x + 4), r();
                for (; 80 > A;) t(), r();
                this._al = this._al + m | 0, this._bl = this._bl + v | 0, this._cl = this._cl + _ | 0, this._dl = this._dl + w | 0, this._el = this._el + S | 0, this._fl = this._fl + k | 0, this._gl = this._gl + I | 0, this._hl = this._hl + E | 0, this._a = this._a + u + (this._al >>> 0 < m >>> 0 ? 1 : 0) | 0, this._b = this._b + d + (this._bl >>> 0 < v >>> 0 ? 1 : 0) | 0, this._c = this._c + h + (this._cl >>> 0 < _ >>> 0 ? 1 : 0) | 0, this._d = this._d + p + (this._dl >>> 0 < w >>> 0 ? 1 : 0) | 0, this._e = this._e + l + (this._el >>> 0 < S >>> 0 ? 1 : 0) | 0, this._f = this._f + b + (this._fl >>> 0 < k >>> 0 ? 1 : 0) | 0, this._g = this._g + g + (this._gl >>> 0 < I >>> 0 ? 1 : 0) | 0, this._h = this._h + y + (this._hl >>> 0 < E >>> 0 ? 1 : 0) | 0
            }, n.prototype._hash = function() {
                function e(e, r, n) {
                    t.writeInt32BE(e, n), t.writeInt32BE(r, n + 4)
                }
                var t = new r(64);
                return e(this._a, this._al, 0), e(this._b, this._bl, 8), e(this._c, this._cl, 16), e(this._d, this._dl, 24), e(this._e, this._el, 32), e(this._f, this._fl, 40), e(this._g, this._gl, 48), e(this._h, this._hl, 56), t
            }, t.exports = n
        }).call(this, e("buffer").Buffer)
    }, {
        "./hash": 139,
        buffer: 43,
        inherits: 232
    }],
    146: [function(e, t) {
        (function(r) {
            "use strict";

            function n(e, t) {
                if (!(this instanceof n)) return new n(e, t);
                s.call(this), this._opad = c, this._alg = e;
                var o = "sha512" === e || "sha384" === e ? 128 : 64;
                t = this._key = r.isBuffer(t) ? t : new r(t), t.length > o ? t = i(e).update(t).digest() : t.length < o && (t = r.concat([t, a], o));
                for (var f = this._ipad = new r(o), c = this._opad = new r(o), u = 0; o > u; u++) f[u] = 54 ^ t[u], c[u] = 92 ^ t[u];
                this._hash = i(e).update(f)
            }
            var i = e("create-hash/browser"),
                s = e("stream").Transform,
                o = e("inherits"),
                a = new r(128);
            a.fill(0), t.exports = n, o(n, s), n.prototype.update = function(e, t) {
                return this.write(e, t), this
            }, n.prototype._transform = function(e, t, r) {
                this._hash.update(e), r()
            }, n.prototype._flush = function(e) {
                var t = this._hash.digest();
                this.push(i(this._alg).update(this._opad).update(t).digest()), e()
            }, n.prototype.digest = function(e) {
                this.end();
                for (var t, n = new r(""); t = this.read();) n = r.concat([n, t]);
                return e && (n = n.toString(e)), n
            }
        }).call(this, e("buffer").Buffer)
    }, {
        buffer: 43,
        "create-hash/browser": 135,
        inherits: 232,
        stream: 203
    }],
    147: [function(e, t) {
        (function(r) {
            function n(e, t) {
                t = t || "utf8", r.isBuffer(e) || (e = new r(e, t)), this._pub = new c(e)
            }

            function i(e, t) {
                t = t || "utf8", r.isBuffer(e) || (e = new r(e, t)), this._priv = new c(e)
            }

            function s(e, t) {
                var r = t.toString("hex"),
                    n = [r, e.toString(16)].join("_");
                if (n in m) return m[n];
                var i = 0;
                if (e.isEven() || !y.simpleSieve || !y.fermatTest(e) || !d.test(e)) return i += 1, i += "02" === r || "05" === r ? 8 : 4, m[n] = i, i;
                d.test(e.shrn(1)) || (i += 2);
                var s, r = t.toString("hex");
                switch (r) {
                    case "02":
                        e.mod(h).cmp(p) && (i += 8);
                        break;
                    case "05":
                        s = e.mod(l), s.cmp(b) && s.cmp(g) && (i += 8);
                        break;
                    default:
                        i += 4
                }
                return m[n] = i, i
            }

            function o(e, t) {
                try {
                    Object.defineProperty(e, "verifyError", {
                        enumerable: !0,
                        value: t,
                        writable: !1
                    })
                } catch (r) {
                    e.verifyError = t
                }
            }

            function a(e, t, r, a) {
                this.setGenerator(t), this.__prime = new c(e), this._prime = c.mont(this.__prime), this._pub = void 0, this._priv = void 0, a ? (this.setPublicKey = n, this.setPrivateKey = i, o(this, s(this.__prime, t))) : o(this, 8), this._makeNum = function() {
                    return r.randomBytes(e.length)
                }
            }

            function f(e, t) {
                var n = new r(e.toArray());
                return t ? n.toString(t) : n
            }
            var c = e("bn.js"),
                u = e("miller-rabin"),
                d = new u,
                h = new c(24),
                p = new c(11),
                l = new c(10),
                b = new c(3),
                g = new c(7),
                y = e("./generatePrime");
            t.exports = a;
            var m = {};
            a.prototype.generateKeys = function() {
                return this._priv || (this._priv = new c(this._makeNum())), this._pub = this._gen.toRed(this._prime).redPow(this._priv).fromRed(), this.getPublicKey()
            }, a.prototype.computeSecret = function(e) {
                e = new c(e), e = e.toRed(this._prime);
                var t = e.redPow(this._priv).fromRed(),
                    n = new r(t.toArray()),
                    i = this.getPrime();
                if (n.length < i.length) {
                    var s = new r(i.length - n.length);
                    s.fill(0), n = r.concat([s, n])
                }
                return n
            }, a.prototype.getPublicKey = function(e) {
                return f(this._pub, e)
            }, a.prototype.getPrivateKey = function(e) {
                return f(this._priv, e)
            }, a.prototype.getPrime = function(e) {
                return f(this.__prime, e)
            }, a.prototype.getGenerator = function(e) {
                return f(this._gen, e)
            }, a.prototype.setGenerator = function(e, t) {
                t = t || "utf8", r.isBuffer(e) || (e = new r(e, t)), this._gen = new c(e)
            }
        }).call(this, e("buffer").Buffer)
    }, {
        "./generatePrime": 148,
        "bn.js": 150,
        buffer: 43,
        "miller-rabin": 151
    }],
    148: [function(e, t) {
        function r() {
            if (null !== _) return _;
            var e = 1048576,
                t = [];
            t[0] = 2;
            for (var r = 1, n = 3; e > n; n += 2) {
                for (var i = Math.ceil(Math.sqrt(n)), s = 0; r > s && t[s] <= i && n % t[s] !== 0; s++);
                r !== s && t[s] <= i || (t[r++] = n)
            }
            return _ = t, t
        }

        function n(e) {
            for (var t = r(), n = 0; n < t.length; n++)
                if (0 === e.modn(t[n])) return 0 === e.cmpn(t[n]) ? !0 : !1;
            return !0
        }

        function i(e) {
            var t = o.mont(e);
            return 0 === d.toRed(t).redPow(e.subn(1)).fromRed().cmpn(1)
        }

        function s(e, t, r) {
            function s(e) {
                f = -1;
                for (var n = new o(r.randomBytes(Math.ceil(e / 8))); n.bitLength() > e;) n.ishrn(1);
                if (n.isEven() && n.iadd(u), n.testn(1) || n.iadd(d), t.cmp(d))
                    if (t.cmp(h)) _ = {
                        major: [m],
                        minor: [d]
                    };
                    else {
                        for (rem = n.mod(b); rem.cmp(g);) n.iadd(m), rem = n.mod(b);
                        _ = {
                            major: [m, p],
                            minor: [d, l]
                        }
                    } else {
                    for (; n.mod(a).cmp(y);) n.iadd(m);
                    _ = {
                        major: [a],
                        minor: [v]
                    }
                }
                return n
            }
            if (16 > e) return new o(2 === t || 5 === t ? [140, 123] : [140, 39]);
            t = new o(t);
            for (var f, _, w = s(e), S = w.shrn(1);;) {
                for (; w.bitLength() > e;) w = s(e), S = w.shrn(1);
                if (f++, n(S) && n(w) && i(S) && i(w) && c.test(S) && c.test(w)) return w;
                w.iadd(_.major[f % _.major.length]), S.iadd(_.minor[f % _.minor.length])
            }
        }
        t.exports = s, s.simpleSieve = n, s.fermatTest = i;
        var o = e("bn.js"),
            a = new o(24),
            f = e("miller-rabin"),
            c = new f,
            u = new o(1),
            d = new o(2),
            h = new o(5),
            p = new o(16),
            l = new o(8),
            b = new o(10),
            g = new o(3),
            y = (new o(7), new o(11)),
            m = new o(4),
            v = new o(12),
            _ = null
    }, {
        "bn.js": 150,
        "miller-rabin": 151
    }],
    149: [function(e, t) {
        (function(r) {
            var n = e("./primes.json"),
                i = e("./dh"),
                s = e("./generatePrime");
            t.exports = function(e, t) {
                function o(t) {
                    return new i(new r(n[t].prime, "hex"), new r(n[t].gen, "hex"), e)
                }

                function a(t, n, o, a) {
                    return (r.isBuffer(n) || "string" == typeof n && -1 === ["hex", "binary", "base64"].indexOf(n)) && (a = o, o = n, n = void 0), n = n || "binary", a = a || "binary", o = o || new r([2]), r.isBuffer(o) || (o = new r(o, a)), "number" == typeof t ? new i(s(t, o, e), o, e, !0) : (r.isBuffer(t) || (t = new r(t, n)), new i(t, o, e, !0))
                }
                t.DiffieHellmanGroup = t.createDiffieHellmanGroup = t.getDiffieHellman = o, t.createDiffieHellman = t.DiffieHellman = a
            }
        }).call(this, e("buffer").Buffer)
    }, {
        "./dh": 147,
        "./generatePrime": 148,
        "./primes.json": 153,
        buffer: 43
    }],
    150: [function(e, t) {
        t.exports = e(68)
    }, {
        "/home/maraoz/git/bitcore/node_modules/bitcore-build/node_modules/browserify/node_modules/crypto-browserify/node_modules/browserify-sign/node_modules/bn.js/lib/bn.js": 68
    }],
    151: [function(e, t) {
        function r(e) {
            this.rand = e || new i.Rand
        }
        var n = e("bn.js"),
            i = e("brorand");
        t.exports = r, r.create = function(e) {
            return new r(e)
        }, r.prototype._rand = function(e) {
            var t = e.bitLength(),
                r = this.rand.generate(Math.ceil(t / 8));
            r[0] |= 3;
            var i = 7 & t;
            return 0 !== i && (r[r.length - 1] >>= 7 - i), new n(r)
        }, r.prototype.test = function(e, t, r) {
            var i = e.bitLength(),
                s = n.mont(e),
                o = new n(1).toRed(s);
            t || (t = Math.max(1, i / 48 | 0));
            for (var a = e.subn(1), f = a.subn(1), c = 0; !a.testn(c); c++);
            for (var u = e.shrn(c), d = a.toRed(s), h = !0; t > 0; t--) {
                var p = this._rand(f);
                r && r(p);
                var l = p.toRed(s).redPow(u);
                if (0 !== l.cmp(o) && 0 !== l.cmp(d)) {
                    for (var b = 1; c > b; b++) {
                        if (l = l.redSqr(), 0 === l.cmp(o)) return !1;
                        if (0 === l.cmp(d)) break
                    }
                    if (b === c) return !1
                }
            }
            return h
        }, r.prototype.getDivisor = function(e, t) {
            var r = e.bitLength(),
                i = n.mont(e),
                s = new n(1).toRed(i);
            t || (t = Math.max(1, r / 48 | 0));
            for (var o = e.subn(1), a = o.subn(1), f = 0; !o.testn(f); f++);
            for (var c = e.shrn(f), u = o.toRed(i), d = !0; t > 0; t--) {
                var h = this._rand(a),
                    p = e.gcd(h);
                if (0 !== p.cmpn(1)) return p;
                var l = h.toRed(i).redPow(c);
                if (0 !== l.cmp(s) && 0 !== l.cmp(u)) {
                    for (var b = 1; f > b; b++) {
                        if (l = l.redSqr(), 0 === l.cmp(s)) return l.fromRed().subn(1).gcd(e);
                        if (0 === l.cmp(u)) break
                    }
                    if (b === f) return l = l.redSqr(), l.fromRed().subn(1).gcd(e)
                }
            }
            return d
        }
    }, {
        "bn.js": 150,
        brorand: 152
    }],
    152: [function(e, t) {
        t.exports = e(82)
    }, {
        "/home/maraoz/git/bitcore/node_modules/bitcore-build/node_modules/browserify/node_modules/crypto-browserify/node_modules/browserify-sign/node_modules/elliptic/node_modules/brorand/index.js": 82
    }],
    153: [function(e, t) {
        t.exports = {
            modp1: {
                gen: "02",
                prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a63a3620ffffffffffffffff"
            },
            modp2: {
                gen: "02",
                prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece65381ffffffffffffffff"
            },
            modp5: {
                gen: "02",
                prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca237327ffffffffffffffff"
            },
            modp14: {
                gen: "02",
                prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aacaa68ffffffffffffffff"
            },
            modp15: {
                gen: "02",
                prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a93ad2caffffffffffffffff"
            },
            modp16: {
                gen: "02",
                prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a92108011a723c12a787e6d788719a10bdba5b2699c327186af4e23c1a946834b6150bda2583e9ca2ad44ce8dbbbc2db04de8ef92e8efc141fbecaa6287c59474e6bc05d99b2964fa090c3a2233ba186515be7ed1f612970cee2d7afb81bdd762170481cd0069127d5b05aa993b4ea988d8fddc186ffb7dc90a6c08f4df435c934063199ffffffffffffffff"
            },
            modp17: {
                gen: "02",
                prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a92108011a723c12a787e6d788719a10bdba5b2699c327186af4e23c1a946834b6150bda2583e9ca2ad44ce8dbbbc2db04de8ef92e8efc141fbecaa6287c59474e6bc05d99b2964fa090c3a2233ba186515be7ed1f612970cee2d7afb81bdd762170481cd0069127d5b05aa993b4ea988d8fddc186ffb7dc90a6c08f4df435c93402849236c3fab4d27c7026c1d4dcb2602646dec9751e763dba37bdf8ff9406ad9e530ee5db382f413001aeb06a53ed9027d831179727b0865a8918da3edbebcf9b14ed44ce6cbaced4bb1bdb7f1447e6cc254b332051512bd7af426fb8f401378cd2bf5983ca01c64b92ecf032ea15d1721d03f482d7ce6e74fef6d55e702f46980c82b5a84031900b1c9e59e7c97fbec7e8f323a97a7e36cc88be0f1d45b7ff585ac54bd407b22b4154aacc8f6d7ebf48e1d814cc5ed20f8037e0a79715eef29be32806a1d58bb7c5da76f550aa3d8a1fbff0eb19ccb1a313d55cda56c9ec2ef29632387fe8d76e3c0468043e8f663f4860ee12bf2d5b0b7474d6e694f91e6dcc4024ffffffffffffffff"
            },
            modp18: {
                gen: "02",
                prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a92108011a723c12a787e6d788719a10bdba5b2699c327186af4e23c1a946834b6150bda2583e9ca2ad44ce8dbbbc2db04de8ef92e8efc141fbecaa6287c59474e6bc05d99b2964fa090c3a2233ba186515be7ed1f612970cee2d7afb81bdd762170481cd0069127d5b05aa993b4ea988d8fddc186ffb7dc90a6c08f4df435c93402849236c3fab4d27c7026c1d4dcb2602646dec9751e763dba37bdf8ff9406ad9e530ee5db382f413001aeb06a53ed9027d831179727b0865a8918da3edbebcf9b14ed44ce6cbaced4bb1bdb7f1447e6cc254b332051512bd7af426fb8f401378cd2bf5983ca01c64b92ecf032ea15d1721d03f482d7ce6e74fef6d55e702f46980c82b5a84031900b1c9e59e7c97fbec7e8f323a97a7e36cc88be0f1d45b7ff585ac54bd407b22b4154aacc8f6d7ebf48e1d814cc5ed20f8037e0a79715eef29be32806a1d58bb7c5da76f550aa3d8a1fbff0eb19ccb1a313d55cda56c9ec2ef29632387fe8d76e3c0468043e8f663f4860ee12bf2d5b0b7474d6e694f91e6dbe115974a3926f12fee5e438777cb6a932df8cd8bec4d073b931ba3bc832b68d9dd300741fa7bf8afc47ed2576f6936ba424663aab639c5ae4f5683423b4742bf1c978238f16cbe39d652de3fdb8befc848ad922222e04a4037c0713eb57a81a23f0c73473fc646cea306b4bcbc8862f8385ddfa9d4b7fa2c087e879683303ed5bdd3a062b3cf5b3a278a66d2a13f83f44f82ddf310ee074ab6a364597e899a0255dc164f31cc50846851df9ab48195ded7ea1b1d510bd7ee74d73faf36bc31ecfa268359046f4eb879f924009438b481c6cd7889a002ed5ee382bc9190da6fc026e479558e4475677e9aa9e3050e2765694dfc81f56e880b96e7160c980dd98edd3dfffffffffffffffff"
            }
        }
    }, {}],
    154: [function(e, t) {
        (function(e) {
            t.exports = function(t) {
                function r(e, t, r, i, s, o) {
                    if ("function" == typeof s && (o = s, s = void 0), "function" != typeof o) throw new Error("No callback provided to pbkdf2");
                    setTimeout(function() {
                        var a;
                        try {
                            a = n(e, t, r, i, s)
                        } catch (f) {
                            return o(f)
                        }
                        o(void 0, a)
                    })
                }

                function n(r, n, i, s, o) {
                    if ("number" != typeof i) throw new TypeError("Iterations not a number");
                    if (0 > i) throw new TypeError("Bad iterations");
                    if ("number" != typeof s) throw new TypeError("Key length not a number");
                    if (0 > s) throw new TypeError("Bad key length");
                    o = o || "sha1", e.isBuffer(r) || (r = new e(r)), e.isBuffer(n) || (n = new e(n));
                    var a, f, c, u = 1,
                        d = new e(s),
                        h = new e(n.length + 4);
                    n.copy(h, 0, 0, n.length);
                    for (var p = 1; u >= p; p++) {
                        h.writeUInt32BE(p, n.length);
                        var l = t.createHmac(o, r).update(h).digest();
                        if (!a && (a = l.length, c = new e(a), u = Math.ceil(s / a), f = s - (u - 1) * a, s > (Math.pow(2, 32) - 1) * a)) throw new TypeError("keylen exceeds maximum length");
                        l.copy(c, 0, 0, a);
                        for (var b = 1; i > b; b++) {
                            l = t.createHmac(o, r).update(l).digest();
                            for (var g = 0; a > g; g++) c[g] ^= l[g]
                        }
                        var y = (p - 1) * a,
                            m = p == u ? f : a;
                        c.copy(d, y, 0, m)
                    }
                    return d
                }
                return {
                    pbkdf2: r,
                    pbkdf2Sync: n
                }
            }
        }).call(this, e("buffer").Buffer)
    }, {
        buffer: 43
    }],
    155: [function(e, t) {
        t.exports = function(t, r) {
            t.publicEncrypt = e("./publicEncrypt")(r), t.privateDecrypt = e("./privateDecrypt")(r)
        }
    }, {
        "./privateDecrypt": 179,
        "./publicEncrypt": 180
    }],
    156: [function(e, t) {
        (function(e) {
            function r(t) {
                var r = new e(4);
                return r.writeUInt32BE(t, 0), r
            }
            t.exports = function(t, n, i) {
                for (var s, o = new e(""), a = 0; o.length < n;) s = r(a++), o = e.concat([o, i.createHash("sha1").update(t).update(s).digest()]);
                return o.slice(0, n)
            }
        }).call(this, e("buffer").Buffer)
    }, {
        buffer: 43
    }],
    157: [function(e, t) {
        t.exports = e(68)
    }, {
        "/home/maraoz/git/bitcore/node_modules/bitcore-build/node_modules/browserify/node_modules/crypto-browserify/node_modules/browserify-sign/node_modules/bn.js/lib/bn.js": 68
    }],
    158: [function(e, t) {
        t.exports = e(69)
    }, {
        "/home/maraoz/git/bitcore/node_modules/bitcore-build/node_modules/browserify/node_modules/crypto-browserify/node_modules/browserify-sign/node_modules/browserify-rsa/index.js": 69,
        "bn.js": 157,
        buffer: 43
    }],
    159: [function(e, t) {
        t.exports = e(90)
    }, {
        "/home/maraoz/git/bitcore/node_modules/bitcore-build/node_modules/browserify/node_modules/crypto-browserify/node_modules/browserify-sign/node_modules/parse-asn1/EVP_BytesToKey.js": 90,
        buffer: 43
    }],
    160: [function(e, t) {
        t.exports = e(91)
    }, {
        "/home/maraoz/git/bitcore/node_modules/bitcore-build/node_modules/browserify/node_modules/crypto-browserify/node_modules/browserify-sign/node_modules/parse-asn1/aesid.json": 91
    }],
    161: [function(e, t) {
        t.exports = e(92)
    }, {
        "/home/maraoz/git/bitcore/node_modules/bitcore-build/node_modules/browserify/node_modules/crypto-browserify/node_modules/browserify-sign/node_modules/parse-asn1/asn1.js": 92,
        "asn1.js": 165,
        "asn1.js-rfc3280": 164
    }],
    162: [function(e, t) {
        t.exports = e(93)
    }, {
        "./EVP_BytesToKey": 159,
        "/home/maraoz/git/bitcore/node_modules/bitcore-build/node_modules/browserify/node_modules/crypto-browserify/node_modules/browserify-sign/node_modules/parse-asn1/fixProc.js": 93,
        buffer: 43
    }],
    163: [function(e, t) {
        t.exports = e(94)
    }, {
        "./aesid.json": 160,
        "./asn1": 161,
        "./fixProc": 162,
        "/home/maraoz/git/bitcore/node_modules/bitcore-build/node_modules/browserify/node_modules/crypto-browserify/node_modules/browserify-sign/node_modules/parse-asn1/index.js": 94,
        buffer: 43,
        pemstrip: 178
    }],
    164: [function(e, t) {
        t.exports = e(95)
    }, {
        "/home/maraoz/git/bitcore/node_modules/bitcore-build/node_modules/browserify/node_modules/crypto-browserify/node_modules/browserify-sign/node_modules/parse-asn1/node_modules/asn1.js-rfc3280/index.js": 95,
        "asn1.js": 165
    }],
    165: [function(e, t) {
        t.exports = e(96)
    }, {
        "./asn1/api": 166,
        "./asn1/base": 168,
        "./asn1/constants": 172,
        "./asn1/decoders": 174,
        "./asn1/encoders": 176,
        "/home/maraoz/git/bitcore/node_modules/bitcore-build/node_modules/browserify/node_modules/crypto-browserify/node_modules/browserify-sign/node_modules/parse-asn1/node_modules/asn1.js/lib/asn1.js": 96,
        "bn.js": 157
    }],
    166: [function(e, t) {
        t.exports = e(97)
    }, {
        "../asn1": 165,
        "/home/maraoz/git/bitcore/node_modules/bitcore-build/node_modules/browserify/node_modules/crypto-browserify/node_modules/browserify-sign/node_modules/parse-asn1/node_modules/asn1.js/lib/asn1/api.js": 97,
        inherits: 232,
        vm: 208
    }],
    167: [function(e, t) {
        t.exports = e(98)
    }, {
        "../base": 168,
        "/home/maraoz/git/bitcore/node_modules/bitcore-build/node_modules/browserify/node_modules/crypto-browserify/node_modules/browserify-sign/node_modules/parse-asn1/node_modules/asn1.js/lib/asn1/base/buffer.js": 98,
        buffer: 43,
        inherits: 232
    }],
    168: [function(e, t) {
        t.exports = e(99)
    }, {
        "./buffer": 167,
        "./node": 169,
        "./reporter": 170,
        "/home/maraoz/git/bitcore/node_modules/bitcore-build/node_modules/browserify/node_modules/crypto-browserify/node_modules/browserify-sign/node_modules/parse-asn1/node_modules/asn1.js/lib/asn1/base/index.js": 99
    }],
    169: [function(e, t) {
        t.exports = e(100)
    }, {
        "../base": 168,
        "/home/maraoz/git/bitcore/node_modules/bitcore-build/node_modules/browserify/node_modules/crypto-browserify/node_modules/browserify-sign/node_modules/parse-asn1/node_modules/asn1.js/lib/asn1/base/node.js": 100,
        "minimalistic-assert": 177
    }],
    170: [function(e, t) {
        t.exports = e(101)
    }, {
        "/home/maraoz/git/bitcore/node_modules/bitcore-build/node_modules/browserify/node_modules/crypto-browserify/node_modules/browserify-sign/node_modules/parse-asn1/node_modules/asn1.js/lib/asn1/base/reporter.js": 101,
        inherits: 232
    }],
    171: [function(e, t) {
        t.exports = e(102)
    }, {
        "../constants": 172,
        "/home/maraoz/git/bitcore/node_modules/bitcore-build/node_modules/browserify/node_modules/crypto-browserify/node_modules/browserify-sign/node_modules/parse-asn1/node_modules/asn1.js/lib/asn1/constants/der.js": 102
    }],
    172: [function(e, t) {
        t.exports = e(103)
    }, {
        "./der": 171,
        "/home/maraoz/git/bitcore/node_modules/bitcore-build/node_modules/browserify/node_modules/crypto-browserify/node_modules/browserify-sign/node_modules/parse-asn1/node_modules/asn1.js/lib/asn1/constants/index.js": 103
    }],
    173: [function(e, t) {
        t.exports = e(104)
    }, {
        "../../asn1": 165,
        "/home/maraoz/git/bitcore/node_modules/bitcore-build/node_modules/browserify/node_modules/crypto-browserify/node_modules/browserify-sign/node_modules/parse-asn1/node_modules/asn1.js/lib/asn1/decoders/der.js": 104,
        inherits: 232
    }],
    174: [function(e, t) {
        t.exports = e(105)
    }, {
        "./der": 173,
        "/home/maraoz/git/bitcore/node_modules/bitcore-build/node_modules/browserify/node_modules/crypto-browserify/node_modules/browserify-sign/node_modules/parse-asn1/node_modules/asn1.js/lib/asn1/decoders/index.js": 105
    }],
    175: [function(e, t) {
        t.exports = e(106)
    }, {
        "../../asn1": 165,
        "/home/maraoz/git/bitcore/node_modules/bitcore-build/node_modules/browserify/node_modules/crypto-browserify/node_modules/browserify-sign/node_modules/parse-asn1/node_modules/asn1.js/lib/asn1/encoders/der.js": 106,
        buffer: 43,
        inherits: 232
    }],
    176: [function(e, t) {
        t.exports = e(107)
    }, {
        "./der": 175,
        "/home/maraoz/git/bitcore/node_modules/bitcore-build/node_modules/browserify/node_modules/crypto-browserify/node_modules/browserify-sign/node_modules/parse-asn1/node_modules/asn1.js/lib/asn1/encoders/index.js": 107
    }],
    177: [function(e, t) {
        t.exports = e(108)
    }, {
        "/home/maraoz/git/bitcore/node_modules/bitcore-build/node_modules/browserify/node_modules/crypto-browserify/node_modules/browserify-sign/node_modules/parse-asn1/node_modules/asn1.js/node_modules/minimalistic-assert/index.js": 108
    }],
    178: [function(e, t) {
        t.exports = e(109)
    }, {
        "/home/maraoz/git/bitcore/node_modules/bitcore-build/node_modules/browserify/node_modules/crypto-browserify/node_modules/browserify-sign/node_modules/parse-asn1/node_modules/pemstrip/index.js": 109
    }],
    179: [function(e, t) {
        (function(r) {
            function n(e, t, n) {
                var i = (e.modulus, e.modulus.byteLength()),
                    o = (t.length, n.createHash("sha1").update(new r("")).digest()),
                    c = o.length;
                if (0 !== t[0]) throw new Error("decryption error");
                var u = t.slice(1, c + 1),
                    d = t.slice(c + 1),
                    h = f(u, a(d, c, n)),
                    p = f(d, a(h, i - c - 1, n));
                if (s(o, p.slice(0, c))) throw new Error("decryption error");
                for (var l = c; 0 === p[l];) l++;
                if (1 !== p[l++]) throw new Error("decryption error");
                return p.slice(l)
            }

            function i(e, t) {
                for (var r = t.slice(0, 2), n = 2, i = 0; 0 !== t[n++];)
                    if (n >= t.length) {
                        i++;
                        break
                    } {
                        var s = t.slice(2, n - 1);
                        t.slice(n - 1, n)
                    }
                return "0002" !== r.toString("hex") && i++, s.length < 8 && i++, t.slice(n)
            }

            function s(e, t) {
                var r = 0,
                    n = e.length;
                e.length !== t.length && (r++, n = Math.min(e.length, t.length));
                for (var i = -1; ++i < n;) r += e[i] ^ t[i];
                return r
            }
            var o = e("parse-asn1"),
                a = e("./mgf"),
                f = e("./xor"),
                c = e("bn.js"),
                u = e("browserify-rsa");
            t.exports = function(e) {
                function t(t, s) {
                    var a;
                    a = t.padding ? t.padding : 4;
                    var f = o(t, e),
                        d = f.modulus.byteLength();
                    if (s.length > d || new c(s).cmp(f.modulus) >= 0) throw new Error("decryption error");
                    var h = u(s, f, e),
                        p = new r(d - h.length);
                    if (p.fill(0), h = r.concat([p, h], d), 4 === a) return n(f, h, e);
                    if (1 === a) return i(f, h, e);
                    if (3 === a) return h;
                    throw new Error("unknown padding")
                }
                return t
            }
        }).call(this, e("buffer").Buffer)
    }, {
        "./mgf": 156,
        "./xor": 181,
        "bn.js": 157,
        "browserify-rsa": 158,
        buffer: 43,
        "parse-asn1": 163
    }],
    180: [function(e, t) {
        (function(r) {
            function n(e, t, n) {
                var i = e.modulus.byteLength(),
                    s = t.length,
                    o = n.createHash("sha1").update(new r("")).digest(),
                    u = o.length,
                    d = 2 * u;
                if (s > i - d - 2) throw new Error("message too long");
                var h = new r(i - s - d - 2);
                h.fill(0);
                var p = i - u - 1,
                    l = n.randomBytes(u),
                    b = f(r.concat([o, h, new r([1]), t], p), a(l, p, n)),
                    g = f(l, a(b, u, n));
                return new c(r.concat([new r([0]), g, b], i))
            }

            function i(e, t, n) {
                var i = t.length,
                    o = e.modulus.byteLength();
                if (i > o - 11) throw new Error("message too long");
                var a = s(o - i - 3, n);
                return new c(r.concat([new r([0, 2]), a, new r([0]), t], o))
            }

            function s(e, t) {
                for (var n, i = new r(e), s = 0, o = t.randomBytes(2 * e), a = 0; e > s;) a === o.length && (o = t.randomBytes(2 * e), a = 0), n = o[a++], n && (i[s++] = n);
                return i
            }
            var o = e("parse-asn1"),
                a = e("./mgf"),
                f = e("./xor"),
                c = e("bn.js");
            t.exports = function(e) {
                function t(t, s) {
                    var a;
                    a = t.padding ? t.padding : 4;
                    var f, u = o(t);
                    if (4 === a) f = n(u, s, e);
                    else if (1 === a) f = i(u, s, e);
                    else {
                        if (3 !== a) throw new Error("unknown padding");
                        if (f = new c(s), f.cmp(u.modulus) >= 0) throw new Error("data too long for modulus")
                    }
                    var d = f.toRed(c.mont(u.modulus)).redPow(new c(u.publicExponent)).fromRed().toArray();
                    return new r(d)
                }
                return t
            }
        }).call(this, e("buffer").Buffer)
    }, {
        "./mgf": 156,
        "./xor": 181,
        "bn.js": 157,
        buffer: 43,
        "parse-asn1": 163
    }],
    181: [function(e, t) {
        t.exports = function(e, t) {
            for (var r = e.length, n = -1; ++n < r;) e[n] ^= t[n];
            return e
        }
    }, {}],
    182: [function(e, t) {
        (function(e, r, n) {
            "use strict";

            function i(t, r) {
                var i = new n(t);
                return o.getRandomValues(i), "function" == typeof r ? e.nextTick(function() {
                    r(null, i)
                }) : i
            }

            function s() {
                throw new Error("secure random number generation not supported by this browser\nuse chrome, FireFox or Internet Explorer 11")
            }
            var o = r.crypto || r.msCrypto;
            t.exports = o && o.getRandomValues ? i : s
        }).call(this, e("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, e("buffer").Buffer)
    }, {
        _process: 187,
        buffer: 43
    }],
    183: [function(e, t) {
        "use strict";
        var r = e("pbkdf2-compat/pbkdf2");
        t.exports = function(e, t) {
            t = t || {};
            var n = r(e);
            return t.pbkdf2 = n.pbkdf2, t.pbkdf2Sync = n.pbkdf2Sync, t
        }
    }, {
        "pbkdf2-compat/pbkdf2": 154
    }],
    184: [function(e, t) {
        (function(r, n) {
            "use strict";
            ! function() {
                var i = ("undefined" == typeof window ? r : window) || {},
                    s = i.crypto || i.msCrypto || e("crypto");
                t.exports = function(e) {
                    if (s.getRandomValues) {
                        var t = new n(e);
                        return s.getRandomValues(t), t
                    }
                    if (s.pseudoRandomBytes) return s.pseudoRandomBytes(e);
                    throw new Error("pseudo random number generation not yet implemented for this browser\nuse chrome, FireFox or Internet Explorer 11")
                }
            }()
        }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, e("buffer").Buffer)
    }, {
        buffer: 43,
        crypto: 42
    }],
    185: [function(e, t) {
        function r() {
            this._events = this._events || {}, this._maxListeners = this._maxListeners || void 0
        }

        function n(e) {
            return "function" == typeof e
        }

        function i(e) {
            return "number" == typeof e
        }

        function s(e) {
            return "object" == typeof e && null !== e
        }

        function o(e) {
            return void 0 === e
        }
        t.exports = r, r.EventEmitter = r, r.prototype._events = void 0, r.prototype._maxListeners = void 0, r.defaultMaxListeners = 10, r.prototype.setMaxListeners = function(e) {
            if (!i(e) || 0 > e || isNaN(e)) throw TypeError("n must be a positive number");
            return this._maxListeners = e, this
        }, r.prototype.emit = function(e) {
            var t, r, i, a, f, c;
            if (this._events || (this._events = {}), "error" === e && (!this._events.error || s(this._events.error) && !this._events.error.length)) {
                if (t = arguments[1], t instanceof Error) throw t;
                throw TypeError('Uncaught, unspecified "error" event.')
            }
            if (r = this._events[e], o(r)) return !1;
            if (n(r)) switch (arguments.length) {
                case 1:
                    r.call(this);
                    break;
                case 2:
                    r.call(this, arguments[1]);
                    break;
                case 3:
                    r.call(this, arguments[1], arguments[2]);
                    break;
                default:
                    for (i = arguments.length, a = new Array(i - 1), f = 1; i > f; f++) a[f - 1] = arguments[f];
                    r.apply(this, a)
            } else if (s(r)) {
                for (i = arguments.length, a = new Array(i - 1), f = 1; i > f; f++) a[f - 1] = arguments[f];
                for (c = r.slice(), i = c.length, f = 0; i > f; f++) c[f].apply(this, a)
            }
            return !0
        }, r.prototype.addListener = function(e, t) {
            var i;
            if (!n(t)) throw TypeError("listener must be a function");
            if (this._events || (this._events = {}), this._events.newListener && this.emit("newListener", e, n(t.listener) ? t.listener : t), this._events[e] ? s(this._events[e]) ? this._events[e].push(t) : this._events[e] = [this._events[e], t] : this._events[e] = t, s(this._events[e]) && !this._events[e].warned) {
                var i;
                i = o(this._maxListeners) ? r.defaultMaxListeners : this._maxListeners, i && i > 0 && this._events[e].length > i && (this._events[e].warned = !0, console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.", this._events[e].length), "function" == typeof console.trace && console.trace())
            }
            return this
        }, r.prototype.on = r.prototype.addListener, r.prototype.once = function(e, t) {
            function r() {
                this.removeListener(e, r), i || (i = !0, t.apply(this, arguments))
            }
            if (!n(t)) throw TypeError("listener must be a function");
            var i = !1;
            return r.listener = t, this.on(e, r), this
        }, r.prototype.removeListener = function(e, t) {
            var r, i, o, a;
            if (!n(t)) throw TypeError("listener must be a function");
            if (!this._events || !this._events[e]) return this;
            if (r = this._events[e], o = r.length, i = -1, r === t || n(r.listener) && r.listener === t) delete this._events[e], this._events.removeListener && this.emit("removeListener", e, t);
            else if (s(r)) {
                for (a = o; a-- > 0;)
                    if (r[a] === t || r[a].listener && r[a].listener === t) {
                        i = a;
                        break
                    }
                if (0 > i) return this;
                1 === r.length ? (r.length = 0, delete this._events[e]) : r.splice(i, 1), this._events.removeListener && this.emit("removeListener", e, t)
            }
            return this
        }, r.prototype.removeAllListeners = function(e) {
            var t, r;
            if (!this._events) return this;
            if (!this._events.removeListener) return 0 === arguments.length ? this._events = {} : this._events[e] && delete this._events[e], this;
            if (0 === arguments.length) {
                for (t in this._events) "removeListener" !== t && this.removeAllListeners(t);
                return this.removeAllListeners("removeListener"), this._events = {}, this
            }
            if (r = this._events[e], n(r)) this.removeListener(e, r);
            else
                for (; r.length;) this.removeListener(e, r[r.length - 1]);
            return delete this._events[e], this
        }, r.prototype.listeners = function(e) {
            var t;
            return t = this._events && this._events[e] ? n(this._events[e]) ? [this._events[e]] : this._events[e].slice() : []
        }, r.listenerCount = function(e, t) {
            var r;
            return r = e._events && e._events[t] ? n(e._events[t]) ? 1 : e._events[t].length : 0
        }
    }, {}],
    186: [function(e, t) {
        t.exports = Array.isArray || function(e) {
            return "[object Array]" == Object.prototype.toString.call(e)
        }
    }, {}],
    187: [function(e, t) {
        function r() {}
        var n = t.exports = {};
        n.nextTick = function() {
            var e = "undefined" != typeof window && window.setImmediate,
                t = "undefined" != typeof window && window.MutationObserver,
                r = "undefined" != typeof window && window.postMessage && window.addEventListener;
            if (e) return function(e) {
                return window.setImmediate(e)
            };
            var n = [];
            if (t) {
                var i = document.createElement("div"),
                    s = new MutationObserver(function() {
                        var e = n.slice();
                        n.length = 0, e.forEach(function(e) {
                            e()
                        })
                    });
                return s.observe(i, {
                        attributes: !0
                    }),
                    function(e) {
                        n.length || i.setAttribute("yes", "no"), n.push(e)
                    }
            }
            return r ? (window.addEventListener("message", function(e) {
                var t = e.source;
                if ((t === window || null === t) && "process-tick" === e.data && (e.stopPropagation(), n.length > 0)) {
                    var r = n.shift();
                    r()
                }
            }, !0), function(e) {
                n.push(e), window.postMessage("process-tick", "*")
            }) : function(e) {
                setTimeout(e, 0)
            }
        }(), n.title = "browser", n.browser = !0, n.env = {}, n.argv = [], n.on = r, n.addListener = r, n.once = r, n.off = r, n.removeListener = r, n.removeAllListeners = r, n.emit = r, n.binding = function() {
            throw new Error("process.binding is not supported")
        }, n.cwd = function() {
            return "/"
        }, n.chdir = function() {
            throw new Error("process.chdir is not supported")
        }
    }, {}],
    188: [function(e, t, r) {
        (function(e) {
            ! function(n) {
                function i(e) {
                    throw RangeError(N[e])
                }

                function s(e, t) {
                    for (var r = e.length; r--;) e[r] = t(e[r]);
                    return e
                }

                function o(e, t) {
                    return s(e.split(T), t).join(".")
                }

                function a(e) {
                    for (var t, r, n = [], i = 0, s = e.length; s > i;) t = e.charCodeAt(i++), t >= 55296 && 56319 >= t && s > i ? (r = e.charCodeAt(i++), 56320 == (64512 & r) ? n.push(((1023 & t) << 10) + (1023 & r) + 65536) : (n.push(t), i--)) : n.push(t);
                    return n
                }

                function f(e) {
                    return s(e, function(e) {
                        var t = "";
                        return e > 65535 && (e -= 65536, t += M(e >>> 10 & 1023 | 55296), e = 56320 | 1023 & e), t += M(e)
                    }).join("")
                }

                function c(e) {
                    return 10 > e - 48 ? e - 22 : 26 > e - 65 ? e - 65 : 26 > e - 97 ? e - 97 : S
                }

                function u(e, t) {
                    return e + 22 + 75 * (26 > e) - ((0 != t) << 5)
                }

                function d(e, t, r) {
                    var n = 0;
                    for (e = r ? C(e / A) : e >> 1, e += C(e / t); e > j * I >> 1; n += S) e = C(e / j);
                    return C(n + (j + 1) * e / (e + E))
                }

                function h(e) {
                    var t, r, n, s, o, a, u, h, p, l, b = [],
                        g = e.length,
                        y = 0,
                        m = P,
                        v = x;
                    for (r = e.lastIndexOf(O), 0 > r && (r = 0), n = 0; r > n; ++n) e.charCodeAt(n) >= 128 && i("not-basic"), b.push(e.charCodeAt(n));
                    for (s = r > 0 ? r + 1 : 0; g > s;) {
                        for (o = y, a = 1, u = S; s >= g && i("invalid-input"), h = c(e.charCodeAt(s++)), (h >= S || h > C((w - y) / a)) && i("overflow"), y += h * a, p = v >= u ? k : u >= v + I ? I : u - v, !(p > h); u += S) l = S - p, a > C(w / l) && i("overflow"), a *= l;
                        t = b.length + 1, v = d(y - o, t, 0 == o), C(y / t) > w - m && i("overflow"), m += C(y / t), y %= t, b.splice(y++, 0, m)
                    }
                    return f(b)
                }

                function p(e) {
                    var t, r, n, s, o, f, c, h, p, l, b, g, y, m, v, _ = [];
                    for (e = a(e), g = e.length, t = P, r = 0, o = x, f = 0; g > f; ++f) b = e[f], 128 > b && _.push(M(b));
                    for (n = s = _.length, s && _.push(O); g > n;) {
                        for (c = w, f = 0; g > f; ++f) b = e[f], b >= t && c > b && (c = b);
                        for (y = n + 1, c - t > C((w - r) / y) && i("overflow"), r += (c - t) * y, t = c, f = 0; g > f; ++f)
                            if (b = e[f], t > b && ++r > w && i("overflow"), b == t) {
                                for (h = r, p = S; l = o >= p ? k : p >= o + I ? I : p - o, !(l > h); p += S) v = h - l, m = S - l, _.push(M(u(l + v % m, 0))), h = C(v / m);
                                _.push(M(u(h, 0))), o = d(r, y, n == s), r = 0, ++n
                            }++r, ++t
                    }
                    return _.join("")
                }

                function l(e) {
                    return o(e, function(e) {
                        return B.test(e) ? h(e.slice(4).toLowerCase()) : e
                    })
                }

                function b(e) {
                    return o(e, function(e) {
                        return R.test(e) ? "xn--" + p(e) : e
                    })
                }
                var g = "object" == typeof r && r,
                    y = "object" == typeof t && t && t.exports == g && t,
                    m = "object" == typeof e && e;
                (m.global === m || m.window === m) && (n = m);
                var v, _, w = 2147483647,
                    S = 36,
                    k = 1,
                    I = 26,
                    E = 38,
                    A = 700,
                    x = 72,
                    P = 128,
                    O = "-",
                    B = /^xn--/,
                    R = /[^ -~]/,
                    T = /\x2E|\u3002|\uFF0E|\uFF61/g,
                    N = {
                        overflow: "Overflow: input needs wider integers to process",
                        "not-basic": "Illegal input >= 0x80 (not a basic code point)",
                        "invalid-input": "Invalid input"
                    },
                    j = S - k,
                    C = Math.floor,
                    M = String.fromCharCode;
                if (v = {
                        version: "1.2.4",
                        ucs2: {
                            decode: a,
                            encode: f
                        },
                        decode: h,
                        encode: p,
                        toASCII: b,
                        toUnicode: l
                    }, "function" == typeof define && "object" == typeof define.amd && define.amd) define("punycode", function() {
                    return v
                });
                else if (g && !g.nodeType)
                    if (y) y.exports = v;
                    else
                        for (_ in v) v.hasOwnProperty(_) && (g[_] = v[_]);
                else n.punycode = v
            }(this)
        }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {}],
    189: [function(e, t) {
        "use strict";

        function r(e, t) {
            return Object.prototype.hasOwnProperty.call(e, t)
        }
        t.exports = function(e, t, i, s) {
            t = t || "&", i = i || "=";
            var o = {};
            if ("string" != typeof e || 0 === e.length) return o;
            var a = /\+/g;
            e = e.split(t);
            var f = 1e3;
            s && "number" == typeof s.maxKeys && (f = s.maxKeys);
            var c = e.length;
            f > 0 && c > f && (c = f);
            for (var u = 0; c > u; ++u) {
                var d, h, p, l, b = e[u].replace(a, "%20"),
                    g = b.indexOf(i);
                g >= 0 ? (d = b.substr(0, g), h = b.substr(g + 1)) : (d = b, h = ""), p = decodeURIComponent(d), l = decodeURIComponent(h), r(o, p) ? n(o[p]) ? o[p].push(l) : o[p] = [o[p], l] : o[p] = l
            }
            return o
        };
        var n = Array.isArray || function(e) {
            return "[object Array]" === Object.prototype.toString.call(e)
        }
    }, {}],
    190: [function(e, t) {
        "use strict";

        function r(e, t) {
            if (e.map) return e.map(t);
            for (var r = [], n = 0; n < e.length; n++) r.push(t(e[n], n));
            return r
        }
        var n = function(e) {
            switch (typeof e) {
                case "string":
                    return e;
                case "boolean":
                    return e ? "true" : "false";
                case "number":
                    return isFinite(e) ? e : "";
                default:
                    return ""
            }
        };
        t.exports = function(e, t, o, a) {
            return t = t || "&", o = o || "=", null === e && (e = void 0), "object" == typeof e ? r(s(e), function(s) {
                var a = encodeURIComponent(n(s)) + o;
                return i(e[s]) ? r(e[s], function(e) {
                    return a + encodeURIComponent(n(e))
                }).join(t) : a + encodeURIComponent(n(e[s]))
            }).join(t) : a ? encodeURIComponent(n(a)) + o + encodeURIComponent(n(e)) : ""
        };
        var i = Array.isArray || function(e) {
                return "[object Array]" === Object.prototype.toString.call(e)
            },
            s = Object.keys || function(e) {
                var t = [];
                for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && t.push(r);
                return t
            }
    }, {}],
    191: [function(e, t, r) {
        "use strict";
        r.decode = r.parse = e("./decode"), r.encode = r.stringify = e("./encode")
    }, {
        "./decode": 189,
        "./encode": 190
    }],
    192: [function(e, t) {
        t.exports = e("./lib/_stream_duplex.js")
    }, {
        "./lib/_stream_duplex.js": 193
    }],
    193: [function(e, t) {
        (function(r) {
            function n(e) {
                return this instanceof n ? (f.call(this, e), c.call(this, e), e && e.readable === !1 && (this.readable = !1), e && e.writable === !1 && (this.writable = !1), this.allowHalfOpen = !0, e && e.allowHalfOpen === !1 && (this.allowHalfOpen = !1), void this.once("end", i)) : new n(e)
            }

            function i() {
                this.allowHalfOpen || this._writableState.ended || r.nextTick(this.end.bind(this))
            }

            function s(e, t) {
                for (var r = 0, n = e.length; n > r; r++) t(e[r], r)
            }
            t.exports = n;
            var o = Object.keys || function(e) {
                    var t = [];
                    for (var r in e) t.push(r);
                    return t
                },
                a = e("core-util-is");
            a.inherits = e("inherits");
            var f = e("./_stream_readable"),
                c = e("./_stream_writable");
            a.inherits(n, f), s(o(c.prototype), function(e) {
                n.prototype[e] || (n.prototype[e] = c.prototype[e])
            })
        }).call(this, e("_process"))
    }, {
        "./_stream_readable": 195,
        "./_stream_writable": 197,
        _process: 187,
        "core-util-is": 198,
        inherits: 232
    }],
    194: [function(e, t) {
        function r(e) {
            return this instanceof r ? void n.call(this, e) : new r(e)
        }
        t.exports = r;
        var n = e("./_stream_transform"),
            i = e("core-util-is");
        i.inherits = e("inherits"), i.inherits(r, n), r.prototype._transform = function(e, t, r) {
            r(null, e)
        }
    }, {
        "./_stream_transform": 196,
        "core-util-is": 198,
        inherits: 232
    }],
    195: [function(e, t) {
        (function(r) {
            function n(t) {
                t = t || {};
                var r = t.highWaterMark;
                this.highWaterMark = r || 0 === r ? r : 16384, this.highWaterMark = ~~this.highWaterMark, this.buffer = [], this.length = 0, this.pipes = null, this.pipesCount = 0, this.flowing = !1, this.ended = !1, this.endEmitted = !1, this.reading = !1, this.calledRead = !1, this.sync = !0, this.needReadable = !1, this.emittedReadable = !1, this.readableListening = !1, this.objectMode = !!t.objectMode, this.defaultEncoding = t.defaultEncoding || "utf8", this.ranOut = !1, this.awaitDrain = 0, this.readingMore = !1, this.decoder = null, this.encoding = null, t.encoding && (P || (P = e("string_decoder/").StringDecoder), this.decoder = new P(t.encoding), this.encoding = t.encoding)
            }

            function i(e) {
                return this instanceof i ? (this._readableState = new n(e, this), this.readable = !0, void A.call(this)) : new i(e)
            }

            function s(e, t, r, n, i) {
                var s = c(t, r);
                if (s) e.emit("error", s);
                else if (null === r || void 0 === r) t.reading = !1, t.ended || u(e, t);
                else if (t.objectMode || r && r.length > 0)
                    if (t.ended && !i) {
                        var a = new Error("stream.push() after EOF");
                        e.emit("error", a)
                    } else if (t.endEmitted && i) {
                    var a = new Error("stream.unshift() after end event");
                    e.emit("error", a)
                } else !t.decoder || i || n || (r = t.decoder.write(r)), t.length += t.objectMode ? 1 : r.length, i ? t.buffer.unshift(r) : (t.reading = !1, t.buffer.push(r)), t.needReadable && d(e), p(e, t);
                else i || (t.reading = !1);
                return o(t)
            }

            function o(e) {
                return !e.ended && (e.needReadable || e.length < e.highWaterMark || 0 === e.length)
            }

            function a(e) {
                if (e >= O) e = O;
                else {
                    e--;
                    for (var t = 1; 32 > t; t <<= 1) e |= e >> t;
                    e++
                }
                return e
            }

            function f(e, t) {
                return 0 === t.length && t.ended ? 0 : t.objectMode ? 0 === e ? 0 : 1 : null === e || isNaN(e) ? t.flowing && t.buffer.length ? t.buffer[0].length : t.length : 0 >= e ? 0 : (e > t.highWaterMark && (t.highWaterMark = a(e)), e > t.length ? t.ended ? t.length : (t.needReadable = !0, 0) : e)
            }

            function c(e, t) {
                var r = null;
                return I.isBuffer(t) || "string" == typeof t || null === t || void 0 === t || e.objectMode || (r = new TypeError("Invalid non-string/buffer chunk")), r
            }

            function u(e, t) {
                if (t.decoder && !t.ended) {
                    var r = t.decoder.end();
                    r && r.length && (t.buffer.push(r), t.length += t.objectMode ? 1 : r.length)
                }
                t.ended = !0, t.length > 0 ? d(e) : _(e)
            }

            function d(e) {
                var t = e._readableState;
                t.needReadable = !1, t.emittedReadable || (t.emittedReadable = !0, t.sync ? r.nextTick(function() {
                    h(e)
                }) : h(e))
            }

            function h(e) {
                e.emit("readable")
            }

            function p(e, t) {
                t.readingMore || (t.readingMore = !0, r.nextTick(function() {
                    l(e, t)
                }))
            }

            function l(e, t) {
                for (var r = t.length; !t.reading && !t.flowing && !t.ended && t.length < t.highWaterMark && (e.read(0), r !== t.length);) r = t.length;
                t.readingMore = !1
            }

            function b(e) {
                return function() {
                    var t = e._readableState;
                    t.awaitDrain--, 0 === t.awaitDrain && g(e)
                }
            }

            function g(e) {
                function t(e) {
                    var t = e.write(r);
                    !1 === t && n.awaitDrain++
                }
                var r, n = e._readableState;
                for (n.awaitDrain = 0; n.pipesCount && null !== (r = e.read());)
                    if (1 === n.pipesCount ? t(n.pipes, 0, null) : w(n.pipes, t), e.emit("data", r), n.awaitDrain > 0) return;
                return 0 === n.pipesCount ? (n.flowing = !1, void(E.listenerCount(e, "data") > 0 && m(e))) : void(n.ranOut = !0)
            }

            function y() {
                this._readableState.ranOut && (this._readableState.ranOut = !1, g(this))
            }

            function m(e, t) {
                var n = e._readableState;
                if (n.flowing) throw new Error("Cannot switch to old mode now.");
                var i = t || !1,
                    s = !1;
                e.readable = !0, e.pipe = A.prototype.pipe, e.on = e.addListener = A.prototype.on, e.on("readable", function() {
                    s = !0;
                    for (var t; !i && null !== (t = e.read());) e.emit("data", t);
                    null === t && (s = !1, e._readableState.needReadable = !0)
                }), e.pause = function() {
                    i = !0, this.emit("pause")
                }, e.resume = function() {
                    i = !1, s ? r.nextTick(function() {
                        e.emit("readable")
                    }) : this.read(0), this.emit("resume")
                }, e.emit("readable")
            }

            function v(e, t) {
                var r, n = t.buffer,
                    i = t.length,
                    s = !!t.decoder,
                    o = !!t.objectMode;
                if (0 === n.length) return null;
                if (0 === i) r = null;
                else if (o) r = n.shift();
                else if (!e || e >= i) r = s ? n.join("") : I.concat(n, i), n.length = 0;
                else if (e < n[0].length) {
                    var a = n[0];
                    r = a.slice(0, e), n[0] = a.slice(e)
                } else if (e === n[0].length) r = n.shift();
                else {
                    r = s ? "" : new I(e);
                    for (var f = 0, c = 0, u = n.length; u > c && e > f; c++) {
                        var a = n[0],
                            d = Math.min(e - f, a.length);
                        s ? r += a.slice(0, d) : a.copy(r, f, 0, d), d < a.length ? n[0] = a.slice(d) : n.shift(), f += d
                    }
                }
                return r
            }

            function _(e) {
                var t = e._readableState;
                if (t.length > 0) throw new Error("endReadable called on non-empty stream");
                !t.endEmitted && t.calledRead && (t.ended = !0, r.nextTick(function() {
                    t.endEmitted || 0 !== t.length || (t.endEmitted = !0, e.readable = !1, e.emit("end"))
                }))
            }

            function w(e, t) {
                for (var r = 0, n = e.length; n > r; r++) t(e[r], r)
            }

            function S(e, t) {
                for (var r = 0, n = e.length; n > r; r++)
                    if (e[r] === t) return r;
                return -1
            }
            t.exports = i;
            var k = e("isarray"),
                I = e("buffer").Buffer;
            i.ReadableState = n;
            var E = e("events").EventEmitter;
            E.listenerCount || (E.listenerCount = function(e, t) {
                return e.listeners(t).length
            });
            var A = e("stream"),
                x = e("core-util-is");
            x.inherits = e("inherits");
            var P;
            x.inherits(i, A), i.prototype.push = function(e, t) {
                var r = this._readableState;
                return "string" != typeof e || r.objectMode || (t = t || r.defaultEncoding, t !== r.encoding && (e = new I(e, t), t = "")), s(this, r, e, t, !1)
            }, i.prototype.unshift = function(e) {
                var t = this._readableState;
                return s(this, t, e, "", !0)
            }, i.prototype.setEncoding = function(t) {
                P || (P = e("string_decoder/").StringDecoder), this._readableState.decoder = new P(t), this._readableState.encoding = t
            };
            var O = 8388608;
            i.prototype.read = function(e) {
                var t = this._readableState;
                t.calledRead = !0;
                var r, n = e;
                if (("number" != typeof e || e > 0) && (t.emittedReadable = !1), 0 === e && t.needReadable && (t.length >= t.highWaterMark || t.ended)) return d(this), null;
                if (e = f(e, t), 0 === e && t.ended) return r = null, t.length > 0 && t.decoder && (r = v(e, t), t.length -= r.length), 0 === t.length && _(this), r;
                var i = t.needReadable;
                return t.length - e <= t.highWaterMark && (i = !0), (t.ended || t.reading) && (i = !1), i && (t.reading = !0, t.sync = !0, 0 === t.length && (t.needReadable = !0), this._read(t.highWaterMark), t.sync = !1), i && !t.reading && (e = f(n, t)), r = e > 0 ? v(e, t) : null, null === r && (t.needReadable = !0, e = 0), t.length -= e, 0 !== t.length || t.ended || (t.needReadable = !0), t.ended && !t.endEmitted && 0 === t.length && _(this), r
            }, i.prototype._read = function() {
                this.emit("error", new Error("not implemented"))
            }, i.prototype.pipe = function(e, t) {
                function n(e) {
                    e === u && s()
                }

                function i() {
                    e.end()
                }

                function s() {
                    e.removeListener("close", a), e.removeListener("finish", f), e.removeListener("drain", l), e.removeListener("error", o), e.removeListener("unpipe", n), u.removeListener("end", i), u.removeListener("end", s), (!e._writableState || e._writableState.needDrain) && l()
                }

                function o(t) {
                    c(), e.removeListener("error", o), 0 === E.listenerCount(e, "error") && e.emit("error", t)
                }

                function a() {
                    e.removeListener("finish", f), c()
                }

                function f() {
                    e.removeListener("close", a), c()
                }

                function c() {
                    u.unpipe(e)
                }
                var u = this,
                    d = this._readableState;
                switch (d.pipesCount) {
                    case 0:
                        d.pipes = e;
                        break;
                    case 1:
                        d.pipes = [d.pipes, e];
                        break;
                    default:
                        d.pipes.push(e)
                }
                d.pipesCount += 1;
                var h = (!t || t.end !== !1) && e !== r.stdout && e !== r.stderr,
                    p = h ? i : s;
                d.endEmitted ? r.nextTick(p) : u.once("end", p), e.on("unpipe", n);
                var l = b(u);
                return e.on("drain", l), e._events && e._events.error ? k(e._events.error) ? e._events.error.unshift(o) : e._events.error = [o, e._events.error] : e.on("error", o), e.once("close", a), e.once("finish", f), e.emit("pipe", u), d.flowing || (this.on("readable", y), d.flowing = !0, r.nextTick(function() {
                    g(u)
                })), e
            }, i.prototype.unpipe = function(e) {
                var t = this._readableState;
                if (0 === t.pipesCount) return this;
                if (1 === t.pipesCount) return e && e !== t.pipes ? this : (e || (e = t.pipes), t.pipes = null, t.pipesCount = 0, this.removeListener("readable", y), t.flowing = !1, e && e.emit("unpipe", this), this);
                if (!e) {
                    var r = t.pipes,
                        n = t.pipesCount;
                    t.pipes = null, t.pipesCount = 0, this.removeListener("readable", y), t.flowing = !1;
                    for (var i = 0; n > i; i++) r[i].emit("unpipe", this);
                    return this
                }
                var i = S(t.pipes, e);
                return -1 === i ? this : (t.pipes.splice(i, 1), t.pipesCount -= 1, 1 === t.pipesCount && (t.pipes = t.pipes[0]), e.emit("unpipe", this), this)
            }, i.prototype.on = function(e, t) {
                var r = A.prototype.on.call(this, e, t);
                if ("data" !== e || this._readableState.flowing || m(this), "readable" === e && this.readable) {
                    var n = this._readableState;
                    n.readableListening || (n.readableListening = !0, n.emittedReadable = !1, n.needReadable = !0, n.reading ? n.length && d(this, n) : this.read(0))
                }
                return r
            }, i.prototype.addListener = i.prototype.on, i.prototype.resume = function() {
                m(this), this.read(0), this.emit("resume")
            }, i.prototype.pause = function() {
                m(this, !0), this.emit("pause")
            }, i.prototype.wrap = function(e) {
                var t = this._readableState,
                    r = !1,
                    n = this;
                e.on("end", function() {
                    if (t.decoder && !t.ended) {
                        var e = t.decoder.end();
                        e && e.length && n.push(e)
                    }
                    n.push(null)
                }), e.on("data", function(i) {
                    if (t.decoder && (i = t.decoder.write(i)), (!t.objectMode || null !== i && void 0 !== i) && (t.objectMode || i && i.length)) {
                        var s = n.push(i);
                        s || (r = !0, e.pause())
                    }
                });
                for (var i in e) "function" == typeof e[i] && "undefined" == typeof this[i] && (this[i] = function(t) {
                    return function() {
                        return e[t].apply(e, arguments)
                    }
                }(i));
                var s = ["error", "close", "destroy", "pause", "resume"];
                return w(s, function(t) {
                    e.on(t, n.emit.bind(n, t))
                }), n._read = function() {
                    r && (r = !1, e.resume())
                }, n
            }, i._fromList = v
        }).call(this, e("_process"))
    }, {
        _process: 187,
        buffer: 43,
        "core-util-is": 198,
        events: 185,
        inherits: 232,
        isarray: 186,
        stream: 203,
        "string_decoder/": 204
    }],
    196: [function(e, t) {
        function r(e, t) {
            this.afterTransform = function(e, r) {
                return n(t, e, r)
            }, this.needTransform = !1, this.transforming = !1, this.writecb = null, this.writechunk = null
        }

        function n(e, t, r) {
            var n = e._transformState;
            n.transforming = !1;
            var i = n.writecb;
            if (!i) return e.emit("error", new Error("no writecb in Transform class"));
            n.writechunk = null, n.writecb = null, null !== r && void 0 !== r && e.push(r), i && i(t);
            var s = e._readableState;
            s.reading = !1, (s.needReadable || s.length < s.highWaterMark) && e._read(s.highWaterMark)
        }

        function i(e) {
            if (!(this instanceof i)) return new i(e);
            o.call(this, e);
            var t = (this._transformState = new r(e, this), this);
            this._readableState.needReadable = !0, this._readableState.sync = !1, this.once("finish", function() {
                "function" == typeof this._flush ? this._flush(function(e) {
                    s(t, e)
                }) : s(t)
            })
        }

        function s(e, t) {
            if (t) return e.emit("error", t);
            var r = e._writableState,
                n = (e._readableState, e._transformState);
            if (r.length) throw new Error("calling transform done when ws.length != 0");
            if (n.transforming) throw new Error("calling transform done when still transforming");
            return e.push(null)
        }
        t.exports = i;
        var o = e("./_stream_duplex"),
            a = e("core-util-is");
        a.inherits = e("inherits"), a.inherits(i, o), i.prototype.push = function(e, t) {
            return this._transformState.needTransform = !1, o.prototype.push.call(this, e, t)
        }, i.prototype._transform = function() {
            throw new Error("not implemented")
        }, i.prototype._write = function(e, t, r) {
            var n = this._transformState;
            if (n.writecb = r, n.writechunk = e, n.writeencoding = t, !n.transforming) {
                var i = this._readableState;
                (n.needTransform || i.needReadable || i.length < i.highWaterMark) && this._read(i.highWaterMark)
            }
        }, i.prototype._read = function() {
            var e = this._transformState;
            null !== e.writechunk && e.writecb && !e.transforming ? (e.transforming = !0, this._transform(e.writechunk, e.writeencoding, e.afterTransform)) : e.needTransform = !0
        }
    }, {
        "./_stream_duplex": 193,
        "core-util-is": 198,
        inherits: 232
    }],
    197: [function(e, t) {
        (function(r) {
            function n(e, t, r) {
                this.chunk = e, this.encoding = t, this.callback = r
            }

            function i(e, t) {
                e = e || {};
                var r = e.highWaterMark;
                this.highWaterMark = r || 0 === r ? r : 16384, this.objectMode = !!e.objectMode, this.highWaterMark = ~~this.highWaterMark, this.needDrain = !1, this.ending = !1, this.ended = !1, this.finished = !1;
                var n = e.decodeStrings === !1;
                this.decodeStrings = !n, this.defaultEncoding = e.defaultEncoding || "utf8", this.length = 0, this.writing = !1, this.sync = !0, this.bufferProcessing = !1, this.onwrite = function(e) {
                    p(t, e)
                }, this.writecb = null, this.writelen = 0, this.buffer = [], this.errorEmitted = !1
            }

            function s(t) {
                var r = e("./_stream_duplex");
                return this instanceof s || this instanceof r ? (this._writableState = new i(t, this), this.writable = !0, void S.call(this)) : new s(t)
            }

            function o(e, t, n) {
                var i = new Error("write after end");
                e.emit("error", i), r.nextTick(function() {
                    n(i)
                })
            }

            function a(e, t, n, i) {
                var s = !0;
                if (!_.isBuffer(n) && "string" != typeof n && null !== n && void 0 !== n && !t.objectMode) {
                    var o = new TypeError("Invalid non-string/buffer chunk");
                    e.emit("error", o), r.nextTick(function() {
                        i(o)
                    }), s = !1
                }
                return s
            }

            function f(e, t, r) {
                return e.objectMode || e.decodeStrings === !1 || "string" != typeof t || (t = new _(t, r)), t
            }

            function c(e, t, r, i, s) {
                r = f(t, r, i), _.isBuffer(r) && (i = "buffer");
                var o = t.objectMode ? 1 : r.length;
                t.length += o;
                var a = t.length < t.highWaterMark;
                return a || (t.needDrain = !0), t.writing ? t.buffer.push(new n(r, i, s)) : u(e, t, o, r, i, s), a
            }

            function u(e, t, r, n, i, s) {
                t.writelen = r, t.writecb = s, t.writing = !0, t.sync = !0, e._write(n, i, t.onwrite), t.sync = !1
            }

            function d(e, t, n, i, s) {
                n ? r.nextTick(function() {
                    s(i)
                }) : s(i), e._writableState.errorEmitted = !0, e.emit("error", i)
            }

            function h(e) {
                e.writing = !1, e.writecb = null, e.length -= e.writelen, e.writelen = 0
            }

            function p(e, t) {
                var n = e._writableState,
                    i = n.sync,
                    s = n.writecb;
                if (h(n), t) d(e, n, i, t, s);
                else {
                    var o = y(e, n);
                    o || n.bufferProcessing || !n.buffer.length || g(e, n), i ? r.nextTick(function() {
                        l(e, n, o, s)
                    }) : l(e, n, o, s)
                }
            }

            function l(e, t, r, n) {
                r || b(e, t), n(), r && m(e, t)
            }

            function b(e, t) {
                0 === t.length && t.needDrain && (t.needDrain = !1, e.emit("drain"))
            }

            function g(e, t) {
                t.bufferProcessing = !0;
                for (var r = 0; r < t.buffer.length; r++) {
                    var n = t.buffer[r],
                        i = n.chunk,
                        s = n.encoding,
                        o = n.callback,
                        a = t.objectMode ? 1 : i.length;
                    if (u(e, t, a, i, s, o), t.writing) {
                        r++;
                        break
                    }
                }
                t.bufferProcessing = !1, r < t.buffer.length ? t.buffer = t.buffer.slice(r) : t.buffer.length = 0
            }

            function y(e, t) {
                return t.ending && 0 === t.length && !t.finished && !t.writing
            }

            function m(e, t) {
                var r = y(e, t);
                return r && (t.finished = !0, e.emit("finish")), r
            }

            function v(e, t, n) {
                t.ending = !0, m(e, t), n && (t.finished ? r.nextTick(n) : e.once("finish", n)), t.ended = !0
            }
            t.exports = s;
            var _ = e("buffer").Buffer;
            s.WritableState = i;
            var w = e("core-util-is");
            w.inherits = e("inherits");
            var S = e("stream");
            w.inherits(s, S), s.prototype.pipe = function() {
                this.emit("error", new Error("Cannot pipe. Not readable."))
            }, s.prototype.write = function(e, t, r) {
                var n = this._writableState,
                    i = !1;
                return "function" == typeof t && (r = t, t = null), _.isBuffer(e) ? t = "buffer" : t || (t = n.defaultEncoding), "function" != typeof r && (r = function() {}), n.ended ? o(this, n, r) : a(this, n, e, r) && (i = c(this, n, e, t, r)), i
            }, s.prototype._write = function(e, t, r) {
                r(new Error("not implemented"))
            }, s.prototype.end = function(e, t, r) {
                var n = this._writableState;
                "function" == typeof e ? (r = e, e = null, t = null) : "function" == typeof t && (r = t, t = null), "undefined" != typeof e && null !== e && this.write(e, t), n.ending || n.finished || v(this, n, r)
            }
        }).call(this, e("_process"))
    }, {
        "./_stream_duplex": 193,
        _process: 187,
        buffer: 43,
        "core-util-is": 198,
        inherits: 232,
        stream: 203
    }],
    198: [function(e, t, r) {
        (function(e) {
            function t(e) {
                return Array.isArray(e)
            }

            function n(e) {
                return "boolean" == typeof e
            }

            function i(e) {
                return null === e
            }

            function s(e) {
                return null == e
            }

            function o(e) {
                return "number" == typeof e
            }

            function a(e) {
                return "string" == typeof e
            }

            function f(e) {
                return "symbol" == typeof e
            }

            function c(e) {
                return void 0 === e
            }

            function u(e) {
                return d(e) && "[object RegExp]" === y(e)
            }

            function d(e) {
                return "object" == typeof e && null !== e
            }

            function h(e) {
                return d(e) && "[object Date]" === y(e)
            }

            function p(e) {
                return d(e) && ("[object Error]" === y(e) || e instanceof Error)
            }

            function l(e) {
                return "function" == typeof e
            }

            function b(e) {
                return null === e || "boolean" == typeof e || "number" == typeof e || "string" == typeof e || "symbol" == typeof e || "undefined" == typeof e
            }

            function g(t) {
                return e.isBuffer(t)
            }

            function y(e) {
                return Object.prototype.toString.call(e)
            }
            r.isArray = t, r.isBoolean = n, r.isNull = i, r.isNullOrUndefined = s, r.isNumber = o, r.isString = a, r.isSymbol = f, r.isUndefined = c, r.isRegExp = u, r.isObject = d, r.isDate = h, r.isError = p, r.isFunction = l, r.isPrimitive = b, r.isBuffer = g
        }).call(this, e("buffer").Buffer)
    }, {
        buffer: 43
    }],
    199: [function(e, t) {
        t.exports = e("./lib/_stream_passthrough.js")
    }, {
        "./lib/_stream_passthrough.js": 194
    }],
    200: [function(e, t, r) {
        var n = e("stream");
        r = t.exports = e("./lib/_stream_readable.js"), r.Stream = n, r.Readable = r, r.Writable = e("./lib/_stream_writable.js"), r.Duplex = e("./lib/_stream_duplex.js"), r.Transform = e("./lib/_stream_transform.js"), r.PassThrough = e("./lib/_stream_passthrough.js")
    }, {
        "./lib/_stream_duplex.js": 193,
        "./lib/_stream_passthrough.js": 194,
        "./lib/_stream_readable.js": 195,
        "./lib/_stream_transform.js": 196,
        "./lib/_stream_writable.js": 197,
        stream: 203
    }],
    201: [function(e, t) {
        t.exports = e("./lib/_stream_transform.js")
    }, {
        "./lib/_stream_transform.js": 196
    }],
    202: [function(e, t) {
        t.exports = e("./lib/_stream_writable.js")
    }, {
        "./lib/_stream_writable.js": 197
    }],
    203: [function(e, t) {
        function r() {
            n.call(this)
        }
        t.exports = r;
        var n = e("events").EventEmitter,
            i = e("inherits");
        i(r, n), r.Readable = e("readable-stream/readable.js"), r.Writable = e("readable-stream/writable.js"), r.Duplex = e("readable-stream/duplex.js"), r.Transform = e("readable-stream/transform.js"), r.PassThrough = e("readable-stream/passthrough.js"), r.Stream = r, r.prototype.pipe = function(e, t) {
            function r(t) {
                e.writable && !1 === e.write(t) && c.pause && c.pause()
            }

            function i() {
                c.readable && c.resume && c.resume()
            }

            function s() {
                u || (u = !0, e.end())
            }

            function o() {
                u || (u = !0, "function" == typeof e.destroy && e.destroy())
            }

            function a(e) {
                if (f(), 0 === n.listenerCount(this, "error")) throw e
            }

            function f() {
                c.removeListener("data", r), e.removeListener("drain", i), c.removeListener("end", s), c.removeListener("close", o), c.removeListener("error", a), e.removeListener("error", a), c.removeListener("end", f), c.removeListener("close", f), e.removeListener("close", f)
            }
            var c = this;
            c.on("data", r), e.on("drain", i), e._isStdio || t && t.end === !1 || (c.on("end", s), c.on("close", o));
            var u = !1;
            return c.on("error", a), e.on("error", a), c.on("end", f), c.on("close", f), e.on("close", f), e.emit("pipe", c), e
        }
    }, {
        events: 185,
        inherits: 232,
        "readable-stream/duplex.js": 192,
        "readable-stream/passthrough.js": 199,
        "readable-stream/readable.js": 200,
        "readable-stream/transform.js": 201,
        "readable-stream/writable.js": 202
    }],
    204: [function(e, t, r) {
        function n(e) {
            if (e && !f(e)) throw new Error("Unknown encoding: " + e)
        }

        function i(e) {
            return e.toString(this.encoding)
        }

        function s(e) {
            this.charReceived = e.length % 2, this.charLength = this.charReceived ? 2 : 0
        }

        function o(e) {
            this.charReceived = e.length % 3, this.charLength = this.charReceived ? 3 : 0
        }
        var a = e("buffer").Buffer,
            f = a.isEncoding || function(e) {
                switch (e && e.toLowerCase()) {
                    case "hex":
                    case "utf8":
                    case "utf-8":
                    case "ascii":
                    case "binary":
                    case "base64":
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                    case "raw":
                        return !0;
                    default:
                        return !1
                }
            },
            c = r.StringDecoder = function(e) {
                switch (this.encoding = (e || "utf8").toLowerCase().replace(/[-_]/, ""), n(e), this.encoding) {
                    case "utf8":
                        this.surrogateSize = 3;
                        break;
                    case "ucs2":
                    case "utf16le":
                        this.surrogateSize = 2, this.detectIncompleteChar = s;
                        break;
                    case "base64":
                        this.surrogateSize = 3, this.detectIncompleteChar = o;
                        break;
                    default:
                        return void(this.write = i)
                }
                this.charBuffer = new a(6), this.charReceived = 0, this.charLength = 0
            };
        c.prototype.write = function(e) {
            for (var t = ""; this.charLength;) {
                var r = e.length >= this.charLength - this.charReceived ? this.charLength - this.charReceived : e.length;
                if (e.copy(this.charBuffer, this.charReceived, 0, r), this.charReceived += r, this.charReceived < this.charLength) return "";
                e = e.slice(r, e.length), t = this.charBuffer.slice(0, this.charLength).toString(this.encoding);
                var n = t.charCodeAt(t.length - 1);
                if (!(n >= 55296 && 56319 >= n)) {
                    if (this.charReceived = this.charLength = 0, 0 === e.length) return t;
                    break
                }
                this.charLength += this.surrogateSize, t = ""
            }
            this.detectIncompleteChar(e);
            var i = e.length;
            this.charLength && (e.copy(this.charBuffer, 0, e.length - this.charReceived, i), i -= this.charReceived), t += e.toString(this.encoding, 0, i);
            var i = t.length - 1,
                n = t.charCodeAt(i);
            if (n >= 55296 && 56319 >= n) {
                var s = this.surrogateSize;
                return this.charLength += s, this.charReceived += s, this.charBuffer.copy(this.charBuffer, s, 0, s), e.copy(this.charBuffer, 0, 0, s), t.substring(0, i)
            }
            return t
        }, c.prototype.detectIncompleteChar = function(e) {
            for (var t = e.length >= 3 ? 3 : e.length; t > 0; t--) {
                var r = e[e.length - t];
                if (1 == t && r >> 5 == 6) {
                    this.charLength = 2;
                    break
                }
                if (2 >= t && r >> 4 == 14) {
                    this.charLength = 3;
                    break
                }
                if (3 >= t && r >> 3 == 30) {
                    this.charLength = 4;
                    break
                }
            }
            this.charReceived = t
        }, c.prototype.end = function(e) {
            var t = "";
            if (e && e.length && (t = this.write(e)), this.charReceived) {
                var r = this.charReceived,
                    n = this.charBuffer,
                    i = this.encoding;
                t += n.slice(0, r).toString(i)
            }
            return t
        }
    }, {
        buffer: 43
    }],
    205: [function(e, t, r) {
        function n() {
            this.protocol = null, this.slashes = null, this.auth = null, this.host = null, this.port = null, this.hostname = null, this.hash = null, this.search = null, this.query = null, this.pathname = null, this.path = null, this.href = null
        }

        function i(e, t, r) {
            if (e && c(e) && e instanceof n) return e;
            var i = new n;
            return i.parse(e, t, r), i
        }

        function s(e) {
            return f(e) && (e = i(e)), e instanceof n ? e.format() : n.prototype.format.call(e)
        }

        function o(e, t) {
            return i(e, !1, !0).resolve(t)
        }

        function a(e, t) {
            return e ? i(e, !1, !0).resolveObject(t) : t
        }

        function f(e) {
            return "string" == typeof e
        }

        function c(e) {
            return "object" == typeof e && null !== e
        }

        function u(e) {
            return null === e
        }

        function d(e) {
            return null == e
        }
        var h = e("punycode");
        r.parse = i, r.resolve = o, r.resolveObject = a, r.format = s, r.Url = n;
        var p = /^([a-z0-9.+-]+:)/i,
            l = /:[0-9]*$/,
            b = ["<", ">", '"', "`", " ", "\r", "\n", " "],
            g = ["{", "}", "|", "\\", "^", "`"].concat(b),
            y = ["'"].concat(g),
            m = ["%", "/", "?", ";", "#"].concat(y),
            v = ["/", "?", "#"],
            _ = 255,
            w = /^[a-z0-9A-Z_-]{0,63}$/,
            S = /^([a-z0-9A-Z_-]{0,63})(.*)$/,
            k = {
                javascript: !0,
                "javascript:": !0
            },
            I = {
                javascript: !0,
                "javascript:": !0
            },
            E = {
                http: !0,
                https: !0,
                ftp: !0,
                gopher: !0,
                file: !0,
                "http:": !0,
                "https:": !0,
                "ftp:": !0,
                "gopher:": !0,
                "file:": !0
            },
            A = e("querystring");
        n.prototype.parse = function(e, t, r) {
            if (!f(e)) throw new TypeError("Parameter 'url' must be a string, not " + typeof e);
            var n = e;
            n = n.trim();
            var i = p.exec(n);
            if (i) {
                i = i[0];
                var s = i.toLowerCase();
                this.protocol = s, n = n.substr(i.length)
            }
            if (r || i || n.match(/^\/\/[^@\/]+@[^@\/]+/)) {
                var o = "//" === n.substr(0, 2);
                !o || i && I[i] || (n = n.substr(2), this.slashes = !0)
            }
            if (!I[i] && (o || i && !E[i])) {
                for (var a = -1, c = 0; c < v.length; c++) {
                    var u = n.indexOf(v[c]); - 1 !== u && (-1 === a || a > u) && (a = u)
                }
                var d, l;
                l = -1 === a ? n.lastIndexOf("@") : n.lastIndexOf("@", a), -1 !== l && (d = n.slice(0, l), n = n.slice(l + 1), this.auth = decodeURIComponent(d)), a = -1;
                for (var c = 0; c < m.length; c++) {
                    var u = n.indexOf(m[c]); - 1 !== u && (-1 === a || a > u) && (a = u)
                } - 1 === a && (a = n.length), this.host = n.slice(0, a), n = n.slice(a), this.parseHost(), this.hostname = this.hostname || "";
                var b = "[" === this.hostname[0] && "]" === this.hostname[this.hostname.length - 1];
                if (!b)
                    for (var g = this.hostname.split(/\./), c = 0, x = g.length; x > c; c++) {
                        var P = g[c];
                        if (P && !P.match(w)) {
                            for (var O = "", B = 0, R = P.length; R > B; B++) O += P.charCodeAt(B) > 127 ? "x" : P[B];
                            if (!O.match(w)) {
                                var T = g.slice(0, c),
                                    N = g.slice(c + 1),
                                    j = P.match(S);
                                j && (T.push(j[1]), N.unshift(j[2])), N.length && (n = "/" + N.join(".") + n), this.hostname = T.join(".");
                                break
                            }
                        }
                    }
                if (this.hostname = this.hostname.length > _ ? "" : this.hostname.toLowerCase(), !b) {
                    for (var C = this.hostname.split("."), M = [], c = 0; c < C.length; ++c) {
                        var U = C[c];
                        M.push(U.match(/[^A-Za-z0-9_-]/) ? "xn--" + h.encode(U) : U)
                    }
                    this.hostname = M.join(".")
                }
                var z = this.port ? ":" + this.port : "",
                    D = this.hostname || "";
                this.host = D + z, this.href += this.host, b && (this.hostname = this.hostname.substr(1, this.hostname.length - 2), "/" !== n[0] && (n = "/" + n))
            }
            if (!k[s])
                for (var c = 0, x = y.length; x > c; c++) {
                    var L = y[c],
                        F = encodeURIComponent(L);
                    F === L && (F = escape(L)), n = n.split(L).join(F)
                }
            var H = n.indexOf("#"); - 1 !== H && (this.hash = n.substr(H), n = n.slice(0, H));
            var K = n.indexOf("?");
            if (-1 !== K ? (this.search = n.substr(K), this.query = n.substr(K + 1), t && (this.query = A.parse(this.query)), n = n.slice(0, K)) : t && (this.search = "", this.query = {}), n && (this.pathname = n), E[s] && this.hostname && !this.pathname && (this.pathname = "/"), this.pathname || this.search) {
                var z = this.pathname || "",
                    U = this.search || "";
                this.path = z + U
            }
            return this.href = this.format(), this
        }, n.prototype.format = function() {
            var e = this.auth || "";
            e && (e = encodeURIComponent(e), e = e.replace(/%3A/i, ":"), e += "@");
            var t = this.protocol || "",
                r = this.pathname || "",
                n = this.hash || "",
                i = !1,
                s = "";
            this.host ? i = e + this.host : this.hostname && (i = e + (-1 === this.hostname.indexOf(":") ? this.hostname : "[" + this.hostname + "]"), this.port && (i += ":" + this.port)), this.query && c(this.query) && Object.keys(this.query).length && (s = A.stringify(this.query));
            var o = this.search || s && "?" + s || "";
            return t && ":" !== t.substr(-1) && (t += ":"), this.slashes || (!t || E[t]) && i !== !1 ? (i = "//" + (i || ""), r && "/" !== r.charAt(0) && (r = "/" + r)) : i || (i = ""), n && "#" !== n.charAt(0) && (n = "#" + n), o && "?" !== o.charAt(0) && (o = "?" + o), r = r.replace(/[?#]/g, function(e) {
                return encodeURIComponent(e)
            }), o = o.replace("#", "%23"), t + i + r + o + n
        }, n.prototype.resolve = function(e) {
            return this.resolveObject(i(e, !1, !0)).format()
        }, n.prototype.resolveObject = function(e) {
            if (f(e)) {
                var t = new n;
                t.parse(e, !1, !0), e = t
            }
            var r = new n;
            if (Object.keys(this).forEach(function(e) {
                    r[e] = this[e]
                }, this), r.hash = e.hash, "" === e.href) return r.href = r.format(), r;
            if (e.slashes && !e.protocol) return Object.keys(e).forEach(function(t) {
                "protocol" !== t && (r[t] = e[t])
            }), E[r.protocol] && r.hostname && !r.pathname && (r.path = r.pathname = "/"), r.href = r.format(), r;
            if (e.protocol && e.protocol !== r.protocol) {
                if (!E[e.protocol]) return Object.keys(e).forEach(function(t) {
                    r[t] = e[t]
                }), r.href = r.format(), r;
                if (r.protocol = e.protocol, e.host || I[e.protocol]) r.pathname = e.pathname;
                else {
                    for (var i = (e.pathname || "").split("/"); i.length && !(e.host = i.shift()););
                    e.host || (e.host = ""), e.hostname || (e.hostname = ""), "" !== i[0] && i.unshift(""), i.length < 2 && i.unshift(""), r.pathname = i.join("/")
                }
                if (r.search = e.search, r.query = e.query, r.host = e.host || "", r.auth = e.auth, r.hostname = e.hostname || e.host, r.port = e.port, r.pathname || r.search) {
                    var s = r.pathname || "",
                        o = r.search || "";
                    r.path = s + o
                }
                return r.slashes = r.slashes || e.slashes, r.href = r.format(), r
            }
            var a = r.pathname && "/" === r.pathname.charAt(0),
                c = e.host || e.pathname && "/" === e.pathname.charAt(0),
                h = c || a || r.host && e.pathname,
                p = h,
                l = r.pathname && r.pathname.split("/") || [],
                i = e.pathname && e.pathname.split("/") || [],
                b = r.protocol && !E[r.protocol];
            if (b && (r.hostname = "", r.port = null, r.host && ("" === l[0] ? l[0] = r.host : l.unshift(r.host)), r.host = "", e.protocol && (e.hostname = null, e.port = null, e.host && ("" === i[0] ? i[0] = e.host : i.unshift(e.host)), e.host = null), h = h && ("" === i[0] || "" === l[0])), c) r.host = e.host || "" === e.host ? e.host : r.host, r.hostname = e.hostname || "" === e.hostname ? e.hostname : r.hostname, r.search = e.search, r.query = e.query, l = i;
            else if (i.length) l || (l = []), l.pop(), l = l.concat(i), r.search = e.search, r.query = e.query;
            else if (!d(e.search)) {
                if (b) {
                    r.hostname = r.host = l.shift();
                    var g = r.host && r.host.indexOf("@") > 0 ? r.host.split("@") : !1;
                    g && (r.auth = g.shift(), r.host = r.hostname = g.shift())
                }
                return r.search = e.search, r.query = e.query, u(r.pathname) && u(r.search) || (r.path = (r.pathname ? r.pathname : "") + (r.search ? r.search : "")), r.href = r.format(), r
            }
            if (!l.length) return r.pathname = null, r.path = r.search ? "/" + r.search : null, r.href = r.format(), r;
            for (var y = l.slice(-1)[0], m = (r.host || e.host) && ("." === y || ".." === y) || "" === y, v = 0, _ = l.length; _ >= 0; _--) y = l[_], "." == y ? l.splice(_, 1) : ".." === y ? (l.splice(_, 1), v++) : v && (l.splice(_, 1), v--);
            if (!h && !p)
                for (; v--; v) l.unshift("..");
            !h || "" === l[0] || l[0] && "/" === l[0].charAt(0) || l.unshift(""), m && "/" !== l.join("/").substr(-1) && l.push("");
            var w = "" === l[0] || l[0] && "/" === l[0].charAt(0);
            if (b) {
                r.hostname = r.host = w ? "" : l.length ? l.shift() : "";
                var g = r.host && r.host.indexOf("@") > 0 ? r.host.split("@") : !1;
                g && (r.auth = g.shift(), r.host = r.hostname = g.shift())
            }
            return h = h || r.host && l.length, h && !w && l.unshift(""), l.length ? r.pathname = l.join("/") : (r.pathname = null, r.path = null), u(r.pathname) && u(r.search) || (r.path = (r.pathname ? r.pathname : "") + (r.search ? r.search : "")), r.auth = e.auth || r.auth, r.slashes = r.slashes || e.slashes, r.href = r.format(), r
        }, n.prototype.parseHost = function() {
            var e = this.host,
                t = l.exec(e);
            t && (t = t[0], ":" !== t && (this.port = t.substr(1)), e = e.substr(0, e.length - t.length)), e && (this.hostname = e)
        }
    }, {
        punycode: 188,
        querystring: 191
    }],
    206: [function(e, t) {
        t.exports = function(e) {
            return e && "object" == typeof e && "function" == typeof e.copy && "function" == typeof e.fill && "function" == typeof e.readUInt8
        }
    }, {}],
    207: [function(e, t, r) {
        (function(t, n) {
            function i(e, t) {
                var n = {
                    seen: [],
                    stylize: o
                };
                return arguments.length >= 3 && (n.depth = arguments[2]), arguments.length >= 4 && (n.colors = arguments[3]), b(t) ? n.showHidden = t : t && r._extend(n, t), w(n.showHidden) && (n.showHidden = !1), w(n.depth) && (n.depth = 2), w(n.colors) && (n.colors = !1), w(n.customInspect) && (n.customInspect = !0), n.colors && (n.stylize = s), f(n, e, n.depth)
            }

            function s(e, t) {
                var r = i.styles[t];
                return r ? "[" + i.colors[r][0] + "m" + e + "[" + i.colors[r][1] + "m" : e
            }

            function o(e) {
                return e
            }

            function a(e) {
                var t = {};
                return e.forEach(function(e) {
                    t[e] = !0
                }), t
            }

            function f(e, t, n) {
                if (e.customInspect && t && A(t.inspect) && t.inspect !== r.inspect && (!t.constructor || t.constructor.prototype !== t)) {
                    var i = t.inspect(n, e);
                    return v(i) || (i = f(e, i, n)), i
                }
                var s = c(e, t);
                if (s) return s;
                var o = Object.keys(t),
                    b = a(o);
                if (e.showHidden && (o = Object.getOwnPropertyNames(t)), E(t) && (o.indexOf("message") >= 0 || o.indexOf("description") >= 0)) return u(t);
                if (0 === o.length) {
                    if (A(t)) {
                        var g = t.name ? ": " + t.name : "";
                        return e.stylize("[Function" + g + "]", "special")
                    }
                    if (S(t)) return e.stylize(RegExp.prototype.toString.call(t), "regexp");
                    if (I(t)) return e.stylize(Date.prototype.toString.call(t), "date");
                    if (E(t)) return u(t)
                }
                var y = "",
                    m = !1,
                    _ = ["{", "}"];
                if (l(t) && (m = !0, _ = ["[", "]"]), A(t)) {
                    var w = t.name ? ": " + t.name : "";
                    y = " [Function" + w + "]"
                }
                if (S(t) && (y = " " + RegExp.prototype.toString.call(t)), I(t) && (y = " " + Date.prototype.toUTCString.call(t)), E(t) && (y = " " + u(t)), 0 === o.length && (!m || 0 == t.length)) return _[0] + y + _[1];
                if (0 > n) return S(t) ? e.stylize(RegExp.prototype.toString.call(t), "regexp") : e.stylize("[Object]", "special");
                e.seen.push(t);
                var k;
                return k = m ? d(e, t, n, b, o) : o.map(function(r) {
                    return h(e, t, n, b, r, m)
                }), e.seen.pop(), p(k, y, _)
            }

            function c(e, t) {
                if (w(t)) return e.stylize("undefined", "undefined");
                if (v(t)) {
                    var r = "'" + JSON.stringify(t).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
                    return e.stylize(r, "string")
                }
                return m(t) ? e.stylize("" + t, "number") : b(t) ? e.stylize("" + t, "boolean") : g(t) ? e.stylize("null", "null") : void 0
            }

            function u(e) {
                return "[" + Error.prototype.toString.call(e) + "]"
            }

            function d(e, t, r, n, i) {
                for (var s = [], o = 0, a = t.length; a > o; ++o) s.push(R(t, String(o)) ? h(e, t, r, n, String(o), !0) : "");
                return i.forEach(function(i) {
                    i.match(/^\d+$/) || s.push(h(e, t, r, n, i, !0))
                }), s
            }

            function h(e, t, r, n, i, s) {
                var o, a, c;
                if (c = Object.getOwnPropertyDescriptor(t, i) || {
                        value: t[i]
                    }, c.get ? a = c.set ? e.stylize("[Getter/Setter]", "special") : e.stylize("[Getter]", "special") : c.set && (a = e.stylize("[Setter]", "special")), R(n, i) || (o = "[" + i + "]"), a || (e.seen.indexOf(c.value) < 0 ? (a = g(r) ? f(e, c.value, null) : f(e, c.value, r - 1), a.indexOf("\n") > -1 && (a = s ? a.split("\n").map(function(e) {
                        return "  " + e
                    }).join("\n").substr(2) : "\n" + a.split("\n").map(function(e) {
                        return "   " + e
                    }).join("\n"))) : a = e.stylize("[Circular]", "special")), w(o)) {
                    if (s && i.match(/^\d+$/)) return a;
                    o = JSON.stringify("" + i), o.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/) ? (o = o.substr(1, o.length - 2), o = e.stylize(o, "name")) : (o = o.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'"), o = e.stylize(o, "string"))
                }
                return o + ": " + a
            }

            function p(e, t, r) {
                var n = 0,
                    i = e.reduce(function(e, t) {
                        return n++, t.indexOf("\n") >= 0 && n++, e + t.replace(/\u001b\[\d\d?m/g, "").length + 1
                    }, 0);
                return i > 60 ? r[0] + ("" === t ? "" : t + "\n ") + " " + e.join(",\n  ") + " " + r[1] : r[0] + t + " " + e.join(", ") + " " + r[1]
            }

            function l(e) {
                return Array.isArray(e)
            }

            function b(e) {
                return "boolean" == typeof e
            }

            function g(e) {
                return null === e
            }

            function y(e) {
                return null == e
            }

            function m(e) {
                return "number" == typeof e
            }

            function v(e) {
                return "string" == typeof e
            }

            function _(e) {
                return "symbol" == typeof e
            }

            function w(e) {
                return void 0 === e
            }

            function S(e) {
                return k(e) && "[object RegExp]" === P(e)
            }

            function k(e) {
                return "object" == typeof e && null !== e
            }

            function I(e) {
                return k(e) && "[object Date]" === P(e)
            }

            function E(e) {
                return k(e) && ("[object Error]" === P(e) || e instanceof Error)
            }

            function A(e) {
                return "function" == typeof e
            }

            function x(e) {
                return null === e || "boolean" == typeof e || "number" == typeof e || "string" == typeof e || "symbol" == typeof e || "undefined" == typeof e
            }

            function P(e) {
                return Object.prototype.toString.call(e)
            }

            function O(e) {
                return 10 > e ? "0" + e.toString(10) : e.toString(10)
            }

            function B() {
                var e = new Date,
                    t = [O(e.getHours()), O(e.getMinutes()), O(e.getSeconds())].join(":");
                return [e.getDate(), C[e.getMonth()], t].join(" ")
            }

            function R(e, t) {
                return Object.prototype.hasOwnProperty.call(e, t)
            }
            var T = /%[sdj%]/g;
            r.format = function(e) {
                if (!v(e)) {
                    for (var t = [], r = 0; r < arguments.length; r++) t.push(i(arguments[r]));
                    return t.join(" ")
                }
                for (var r = 1, n = arguments, s = n.length, o = String(e).replace(T, function(e) {
                        if ("%" === e) return "%";
                        if (r >= s) return e;
                        switch (e) {
                            case "%s":
                                return String(n[r++]);
                            case "%d":
                                return Number(n[r++]);
                            case "%j":
                                try {
                                    return JSON.stringify(n[r++])
                                } catch (t) {
                                    return "[Circular]"
                                }
                            default:
                                return e
                        }
                    }), a = n[r]; s > r; a = n[++r]) o += g(a) || !k(a) ? " " + a : " " + i(a);
                return o
            }, r.deprecate = function(e, i) {
                function s() {
                    if (!o) {
                        if (t.throwDeprecation) throw new Error(i);
                        t.traceDeprecation ? console.trace(i) : console.error(i), o = !0
                    }
                    return e.apply(this, arguments)
                }
                if (w(n.process)) return function() {
                    return r.deprecate(e, i).apply(this, arguments)
                };
                if (t.noDeprecation === !0) return e;
                var o = !1;
                return s
            };
            var N, j = {};
            r.debuglog = function(e) {
                if (w(N) && (N = t.env.NODE_DEBUG || ""), e = e.toUpperCase(), !j[e])
                    if (new RegExp("\\b" + e + "\\b", "i").test(N)) {
                        var n = t.pid;
                        j[e] = function() {
                            var t = r.format.apply(r, arguments);
                            console.error("%s %d: %s", e, n, t)
                        }
                    } else j[e] = function() {};
                return j[e]
            }, r.inspect = i, i.colors = {
                bold: [1, 22],
                italic: [3, 23],
                underline: [4, 24],
                inverse: [7, 27],
                white: [37, 39],
                grey: [90, 39],
                black: [30, 39],
                blue: [34, 39],
                cyan: [36, 39],
                green: [32, 39],
                magenta: [35, 39],
                red: [31, 39],
                yellow: [33, 39]
            }, i.styles = {
                special: "cyan",
                number: "yellow",
                "boolean": "yellow",
                undefined: "grey",
                "null": "bold",
                string: "green",
                date: "magenta",
                regexp: "red"
            }, r.isArray = l, r.isBoolean = b, r.isNull = g, r.isNullOrUndefined = y, r.isNumber = m, r.isString = v, r.isSymbol = _, r.isUndefined = w, r.isRegExp = S, r.isObject = k, r.isDate = I, r.isError = E, r.isFunction = A, r.isPrimitive = x, r.isBuffer = e("./support/isBuffer");
            var C = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            r.log = function() {
                console.log("%s - %s", B(), r.format.apply(r, arguments))
            }, r.inherits = e("inherits"), r._extend = function(e, t) {
                if (!t || !k(t)) return e;
                for (var r = Object.keys(t), n = r.length; n--;) e[r[n]] = t[r[n]];
                return e
            }
        }).call(this, e("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {
        "./support/isBuffer": 206,
        _process: 187,
        inherits: 232
    }],
    208: [function(required, module, exports) {
        function Context() {}
        var indexOf = required("indexof"),
            Object_keys = function(e) {
                if (Object.keys) return Object.keys(e);
                var t = [];
                for (var r in e) t.push(r);
                return t
            },
            forEach = function(e, t) {
                if (e.forEach) return e.forEach(t);
                for (var r = 0; r < e.length; r++) t(e[r], r, e)
            },
            defineProp = function() {
                try {
                    return Object.defineProperty({}, "_", {}),
                        function(e, t, r) {
                            Object.defineProperty(e, t, {
                                writable: !0,
                                enumerable: !1,
                                configurable: !0,
                                value: r
                            })
                        }
                } catch (e) {
                    return function(e, t, r) {
                        e[t] = r
                    }
                }
            }(),
            globals = ["Array", "Boolean", "Date", "Error", "EvalError", "Function", "Infinity", "JSON", "Math", "NaN", "Number", "Object", "RangeError", "ReferenceError", "RegExp", "String", "SyntaxError", "TypeError", "URIError", "decodeURI", "decodeURIComponent", "encodeURI", "encodeURIComponent", "escape", "eval", "isFinite", "isNaN", "parseFloat", "parseInt", "undefined", "unescape"];
        Context.prototype = {};
        var Script = exports.Script = function(e) {
            return this instanceof Script ? void(this.code = e) : new Script(e)
        };
        Script.prototype.runInContext = function(e) {
            if (!(e instanceof Context)) throw new TypeError("needs a 'context' argument.");
            var t = document.createElement("iframe");
            t.style || (t.style = {}), t.style.display = "none", document.body.appendChild(t);
            var r = t.contentWindow,
                n = r.eval,
                i = r.execScript;
            !n && i && (i.call(r, "null"), n = r.eval), forEach(Object_keys(e), function(t) {
                r[t] = e[t]
            }), forEach(globals, function(t) {
                e[t] && (r[t] = e[t])
            });
            var s = Object_keys(r),
                o = n.call(r, this.code);
            return forEach(Object_keys(r), function(t) {
                (t in e || -1 === indexOf(s, t)) && (e[t] = r[t])
            }), forEach(globals, function(t) {
                t in e || defineProp(e, t, r[t])
            }), document.body.removeChild(t), o
        }, Script.prototype.runInThisContext = function() {
            return eval(this.code)
        }, Script.prototype.runInNewContext = function(e) {
            var t = Script.createContext(e),
                r = this.runInContext(t);
            return forEach(Object_keys(t), function(r) {
                e[r] = t[r]
            }), r
        }, forEach(Object_keys(Script.prototype), function(e) {
            exports[e] = Script[e] = function(t) {
                var r = Script(t);
                return r[e].apply(r, [].slice.call(arguments, 1))
            }
        }), exports.createScript = function(e) {
            return exports.Script(e)
        }, exports.createContext = Script.createContext = function(e) {
            var t = new Context;
            return "object" == typeof e && forEach(Object_keys(e), function(r) {
                t[r] = e[r]
            }), t
        }
    }, {
        "indexof": 209
    }],
    209: [function(e, t) {
        var r = [].indexOf;
        t.exports = function(e, t) {
            if (r) return e.indexOf(t);
            for (var n = 0; n < e.length; ++n)
                if (e[n] === t) return n;
            return -1
        }
    }, {}],
    210: [function(e, t) {
        t.exports = e(68)
    }, {
        "/home/maraoz/git/bitcore/node_modules/bitcore-build/node_modules/browserify/node_modules/crypto-browserify/node_modules/browserify-sign/node_modules/bn.js/lib/bn.js": 68
    }],
    211: [function(e, t) {
        function r(e) {
            if (0 === e.length) return "";
            var t, r, n = [0];
            for (t = 0; t < e.length; t++) {
                for (r = 0; r < n.length; r++) n[r] <<= 8;
                n[0] += e[t];
                var s = 0;
                for (r = 0; r < n.length; ++r) n[r] += s, s = n[r] / a | 0, n[r] %= a;
                for (; s;) n.push(s % a), s = s / a | 0
            }
            for (t = 0; 0 === e[t] && t < e.length - 1; t++) n.push(0);
            return n.reverse().map(function(e) {
                return i[e]
            }).join("")
        }

        function n(e) {
            if (0 === e.length) return [];
            var t, r, n = [0];
            for (t = 0; t < e.length; t++) {
                var i = e[t];
                if (!(i in s)) throw new Error("Non-base58 character");
                for (r = 0; r < n.length; r++) n[r] *= a;
                n[0] += s[i];
                var o = 0;
                for (r = 0; r < n.length; ++r) n[r] += o, o = n[r] >> 8, n[r] &= 255;
                for (; o;) n.push(255 & o), o >>= 8
            }
            for (t = 0;
                "1" === e[t] && t < e.length - 1; t++) n.push(0);
            return n.reverse()
        }
        for (var i = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz", s = {}, o = 0; o < i.length; o++) s[i.charAt(o)] = o;
        var a = 58;
        t.exports = {
            encode: r,
            decode: n
        }
    }, {}],
    212: [function(e, t, r) {
        arguments[4][70][0].apply(r, arguments)
    }, {
        "../package.json": 225,
        "./elliptic/curve": 215,
        "./elliptic/curves": 218,
        "./elliptic/ec": 219,
        "./elliptic/hmac-drbg": 222,
        "./elliptic/utils": 223,
        "/home/maraoz/git/bitcore/node_modules/bitcore-build/node_modules/browserify/node_modules/crypto-browserify/node_modules/browserify-sign/node_modules/elliptic/lib/elliptic.js": 70,
        brorand: 224
    }],
    213: [function(e, t) {
        function r(e, t) {
            this.type = e, this.p = new s(t.p, 16), this.red = t.prime ? s.red(t.prime) : s.mont(this.p), this.zero = new s(0).toRed(this.red), this.one = new s(1).toRed(this.red), this.two = new s(2).toRed(this.red), this.n = t.n && new s(t.n, 16), this.g = t.g && this.pointFromJSON(t.g, t.gRed), this._wnafT1 = new Array(4), this._wnafT2 = new Array(4), this._wnafT3 = new Array(4), this._wnafT4 = new Array(4)
        }

        function n(e, t) {
            this.curve = e, this.type = t, this.precomputed = null
        }
        var i = e("assert"),
            s = e("bn.js"),
            o = e("../../elliptic"),
            a = o.utils.getNAF,
            f = o.utils.getJSF;
        t.exports = r, r.prototype.point = function() {
            throw new Error("Not implemented")
        }, r.prototype.validate = function() {
            throw new Error("Not implemented")
        }, r.prototype._fixedNafMul = function(e, t) {
            var r = e._getDoubles(),
                n = a(t, 1),
                i = (1 << r.step + 1) - (r.step % 2 === 0 ? 2 : 1);
            i /= 3;
            for (var s = [], o = 0; o < n.length; o += r.step) {
                for (var f = 0, t = o + r.step - 1; t >= o; t--) f = (f << 1) + n[t];
                s.push(f)
            }
            for (var c = this.jpoint(null, null, null), u = this.jpoint(null, null, null), d = i; d > 0; d--) {
                for (var o = 0; o < s.length; o++) {
                    var f = s[o];
                    f === d ? u = u.mixedAdd(r.points[o]) : f === -d && (u = u.mixedAdd(r.points[o].neg()))
                }
                c = c.add(u)
            }
            return c.toP()
        }, r.prototype._wnafMul = function(e, t) {
            var r = 4,
                n = e._getNAFPoints(r);
            r = n.wnd;
            for (var s = n.points, o = a(t, r), f = this.jpoint(null, null, null), c = o.length - 1; c >= 0; c--) {
                for (var t = 0; c >= 0 && 0 === o[c]; c--) t++;
                if (c >= 0 && t++, f = f.dblp(t), 0 > c) break;
                var u = o[c];
                i(0 !== u), f = "affine" === e.type ? f.mixedAdd(u > 0 ? s[u - 1 >> 1] : s[-u - 1 >> 1].neg()) : f.add(u > 0 ? s[u - 1 >> 1] : s[-u - 1 >> 1].neg())
            }
            return "affine" === e.type ? f.toP() : f
        }, r.prototype._wnafMulAdd = function(e, t, r, n) {
            for (var i = this._wnafT1, s = this._wnafT2, o = this._wnafT3, c = 0, u = 0; n > u; u++) {
                var d = t[u],
                    h = d._getNAFPoints(e);
                i[u] = h.wnd, s[u] = h.points
            }
            for (var u = n - 1; u >= 1; u -= 2) {
                var p = u - 1,
                    l = u;
                if (1 === i[p] && 1 === i[l]) {
                    var b = [t[p], null, null, t[l]];
                    0 === t[p].y.cmp(t[l].y) ? (b[1] = t[p].add(t[l]), b[2] = t[p].toJ().mixedAdd(t[l].neg())) : 0 === t[p].y.cmp(t[l].y.redNeg()) ? (b[1] = t[p].toJ().mixedAdd(t[l]), b[2] = t[p].add(t[l].neg())) : (b[1] = t[p].toJ().mixedAdd(t[l]), b[2] = t[p].toJ().mixedAdd(t[l].neg()));
                    var g = [-3, -1, -5, -7, 0, 7, 5, 1, 3],
                        y = f(r[p], r[l]);
                    c = Math.max(y[0].length, c), o[p] = new Array(c), o[l] = new Array(c);
                    for (var m = 0; c > m; m++) {
                        var v = 0 | y[0][m],
                            _ = 0 | y[1][m];
                        o[p][m] = g[3 * (v + 1) + (_ + 1)], o[l][m] = 0, s[p] = b
                    }
                } else o[p] = a(r[p], i[p]), o[l] = a(r[l], i[l]), c = Math.max(o[p].length, c), c = Math.max(o[l].length, c)
            }
            for (var w = this.jpoint(null, null, null), S = this._wnafT4, u = c; u >= 0; u--) {
                for (var k = 0; u >= 0;) {
                    for (var I = !0, m = 0; n > m; m++) S[m] = 0 | o[m][u], 0 !== S[m] && (I = !1);
                    if (!I) break;
                    k++, u--
                }
                if (u >= 0 && k++, w = w.dblp(k), 0 > u) break;
                for (var m = 0; n > m; m++) {
                    var d, E = S[m];
                    0 !== E && (E > 0 ? d = s[m][E - 1 >> 1] : 0 > E && (d = s[m][-E - 1 >> 1].neg()), w = "affine" === d.type ? w.mixedAdd(d) : w.add(d))
                }
            }
            for (var u = 0; n > u; u++) s[u] = null;
            return w.toP()
        }, r.BasePoint = n, n.prototype.validate = function() {
            return this.curve.validate(this)
        }, n.prototype.precompute = function(e) {
            if (this.precomputed) return this;
            var t = {
                doubles: null,
                naf: null,
                beta: null
            };
            return t.naf = this._getNAFPoints(8), t.doubles = this._getDoubles(4, e), t.beta = this._getBeta(), this.precomputed = t, this
        }, n.prototype._getDoubles = function(e, t) {
            if (this.precomputed && this.precomputed.doubles) return this.precomputed.doubles;
            for (var r = [this], n = this, i = 0; t > i; i += e) {
                for (var s = 0; e > s; s++) n = n.dbl();
                r.push(n)
            }
            return {
                step: e,
                points: r
            }
        }, n.prototype._getNAFPoints = function(e) {
            if (this.precomputed && this.precomputed.naf) return this.precomputed.naf;
            for (var t = [this], r = (1 << e) - 1, n = 1 === r ? null : this.dbl(), i = 1; r > i; i++) t[i] = t[i - 1].add(n);
            return {
                wnd: e,
                points: t
            }
        }, n.prototype._getBeta = function() {
            return null
        }, n.prototype.dblp = function(e) {
            for (var t = this, r = 0; e > r; r++) t = t.dbl();
            return t
        }
    }, {
        "../../elliptic": 212,
        assert: 41,
        "bn.js": 210
    }],
    214: [function(e, t) {
        function r(e) {
            this.twisted = 1 != e.a, this.mOneA = this.twisted && -1 == e.a, this.extended = this.mOneA, c.call(this, "mont", e), this.a = new a(e.a, 16).mod(this.red.m).toRed(this.red), this.c = new a(e.c, 16).toRed(this.red), this.c2 = this.c.redSqr(), this.d = new a(e.d, 16).toRed(this.red), this.dd = this.d.redAdd(this.d), i(!this.twisted || 0 === this.c.fromRed().cmpn(1)), this.oneC = 1 == e.c
        }

        function n(e, t, r, n, i) {
            c.BasePoint.call(this, e, "projective"), null === t && null === r && null === n ? (this.x = this.curve.zero, this.y = this.curve.one, this.z = this.curve.one, this.t = this.curve.zero, this.zOne = !0) : (this.x = new a(t, 16), this.y = new a(r, 16), this.z = n ? new a(n, 16) : this.curve.one, this.t = i && new a(i, 16), this.x.red || (this.x = this.x.toRed(this.curve.red)), this.y.red || (this.y = this.y.toRed(this.curve.red)), this.z.red || (this.z = this.z.toRed(this.curve.red)), this.t && !this.t.red && (this.t = this.t.toRed(this.curve.red)), this.zOne = this.z === this.curve.one, this.curve.extended && !this.t && (this.t = this.x.redMul(this.y), this.zOne || (this.t = this.t.redMul(this.z.redInvm()))))
        } {
            var i = e("assert"),
                s = e("../curve"),
                o = e("../../elliptic"),
                a = e("bn.js"),
                f = e("inherits"),
                c = s.base;
            o.utils.getNAF
        }
        f(r, c), t.exports = r, r.prototype._mulA = function(e) {
            return this.mOneA ? e.redNeg() : this.a.redMul(e)
        }, r.prototype._mulC = function(e) {
            return this.oneC ? e : this.c.redMul(e)
        }, r.prototype.point = function(e, t, r, i) {
            return new n(this, e, t, r, i)
        }, r.prototype.jpoint = function(e, t, r, n) {
            return this.point(e, t, r, n)
        }, r.prototype.pointFromJSON = function(e) {
            return n.fromJSON(this, e)
        }, r.prototype.pointFromX = function(e, t) {
            t = new a(t, 16), t.red || (t = t.toRed(this.red));
            var r = t.redSqr(),
                n = this.c2.redSub(this.a.redMul(r)),
                i = this.one.redSub(this.c2.redMul(this.d).redMul(r)),
                o = n.redMul(i.redInvm()).redSqrt(),
                f = o.fromRed().isOdd();
            return (e && !f || !e && f) && (o = o.redNeg()), this.point(t, o, s.one)
        }, r.prototype.validate = function(e) {
            if (e.isInfinity()) return !0;
            e.normalize();
            var t = e.x.redSqr(),
                r = e.y.redSqr(),
                n = t.redMul(this.a).redAdd(r),
                i = this.c2.redMul(this.one.redAdd(this.d.redMul(t).redMul(r)));
            return 0 === n.cmp(i)
        }, f(n, c.BasePoint), n.fromJSON = function(e, t) {
            return new n(e, t[0], t[1], t[2])
        }, n.prototype.inspect = function() {
            return this.isInfinity() ? "<EC Point Infinity>" : "<EC Point x: " + this.x.fromRed().toString(16, 2) + " y: " + this.y.fromRed().toString(16, 2) + " z: " + this.z.fromRed().toString(16, 2) + ">"
        }, n.prototype.isInfinity = function() {
            return 0 === this.x.cmpn(0) && 0 === this.y.cmp(this.z)
        }, n.prototype._extDbl = function() {
            var e = this.x.redSqr(),
                t = this.y.redSqr(),
                r = this.z.redSqr();
            r = r.redIAdd(r);
            var n = this.curve._mulA(e),
                i = this.x.redAdd(this.y).redSqr().redISub(e).redISub(t),
                s = n.redAdd(t),
                o = s.redSub(r),
                a = n.redSub(t),
                f = i.redMul(o),
                c = s.redMul(a),
                u = i.redMul(a),
                d = o.redMul(s);
            return this.curve.point(f, c, d, u)
        }, n.prototype._projDbl = function() {
            var e = this.x.redAdd(this.y).redSqr(),
                t = this.x.redSqr(),
                r = this.y.redSqr();
            if (this.curve.twisted) {
                var n = this.curve._mulA(t),
                    i = n.redAdd(r);
                if (this.zOne) var s = e.redSub(t).redSub(r).redMul(i.redSub(this.curve.two)),
                    o = i.redMul(n.redSub(r)),
                    a = i.redSqr().redSub(i).redSub(i);
                else var f = this.z.redSqr(),
                    c = i.redSub(f).redISub(f),
                    s = e.redSub(t).redISub(r).redMul(c),
                    o = i.redMul(n.redSub(r)),
                    a = i.redMul(c)
            } else var n = t.redAdd(r),
                f = this.curve._mulC(redMul(this.z)).redSqr(),
                c = n.redSub(f).redSub(f),
                s = this.curve._mulC(e.redISub(n)).redMul(c),
                o = this.curve._mulC(n).redMul(t.redISub(r)),
                a = n.redMul(c);
            return this.curve.point(s, o, a)
        }, n.prototype.dbl = function() {
            return this.isInfinity() ? this : this.curve.extended ? this._extDbl() : this._projDbl()
        }, n.prototype._extAdd = function(e) {
            var t = this.y.redSub(this.x).redMul(e.y.redSub(e.x)),
                r = this.y.redAdd(this.x).redMul(e.y.redAdd(e.x)),
                n = this.t.redMul(this.curve.dd).redMul(e.t),
                i = this.z.redMul(e.z.redAdd(e.z)),
                s = r.redSub(t),
                o = i.redSub(n),
                a = i.redAdd(n),
                f = r.redAdd(t),
                c = s.redMul(o),
                u = a.redMul(f),
                d = s.redMul(f),
                h = o.redMul(a);
            return this.curve.point(c, u, h, d)
        }, n.prototype._projAdd = function(e) {
            var t = this.z.redMul(e.z),
                r = t.redSqr(),
                n = this.x.redMul(e.x),
                i = this.y.redMul(e.y),
                s = this.curve.d.redMul(n).redMul(i),
                o = r.redSub(s),
                a = r.redAdd(s),
                f = this.x.redAdd(this.y).redMul(e.x.redAdd(e.y)).redISub(n).redISub(i),
                c = t.redMul(o).redMul(f);
            if (this.curve.twisted) var u = t.redMul(a).redMul(i.redSub(this.curve._mulA(n))),
                d = o.redMul(a);
            else var u = t.redMul(a).redMul(i.redSub(n)),
                d = this.curve._mulC(o).redMul(a);
            return this.curve.point(c, u, d)
        }, n.prototype.add = function(e) {
            return this.isInfinity() ? e : e.isInfinity() ? this : this.curve.extended ? this._extAdd(e) : this._projAdd(e)
        }, n.prototype.mul = function(e) {
            return this.precomputed && this.precomputed.doubles ? this.curve._fixedNafMul(this, e) : this.curve._wnafMul(this, e)
        }, n.prototype.mulAdd = function(e, t, r) {
            return this.curve._wnafMulAdd(1, [this, t], [e, r], 2)
        }, n.prototype.normalize = function() {
            if (this.zOne) return this;
            var e = this.z.redInvm();
            return this.x = this.x.redMul(e), this.y = this.y.redMul(e), this.t && (this.t = this.t.redMul(e)), this.z = this.curve.one, this.zOne = !0, this
        }, n.prototype.neg = function() {
            return this.curve.point(this.x.redNeg(), this.y, this.z, this.t && this.t.redNeg())
        }, n.prototype.getX = function() {
            return this.normalize(), this.x.fromRed()
        }, n.prototype.getY = function() {
            return this.normalize(), this.y.fromRed()
        }, n.prototype.toP = n.prototype.normalize, n.prototype.mixedAdd = n.prototype.add
    }, {
        "../../elliptic": 212,
        "../curve": 215,
        assert: 41,
        "bn.js": 210,
        inherits: 232
    }],
    215: [function(e, t, r) {
        arguments[4][73][0].apply(r, arguments)
    }, {
        "./base": 213,
        "./edwards": 214,
        "./mont": 216,
        "./short": 217,
        "/home/maraoz/git/bitcore/node_modules/bitcore-build/node_modules/browserify/node_modules/crypto-browserify/node_modules/browserify-sign/node_modules/elliptic/lib/elliptic/curve/index.js": 73
    }],
    216: [function(e, t) {
        function r(e) {
            f.call(this, "mont", e), this.a = new o(e.a, 16).toRed(this.red), this.b = new o(e.b, 16).toRed(this.red), this.i4 = new o(4).toRed(this.red).redInvm(), this.two = new o(2).toRed(this.red), this.a24 = this.i4.redMul(this.a.redAdd(this.two))
        }

        function n(e, t, r) {
            f.BasePoint.call(this, e, "projective"), null === t && null === r ? (this.x = this.curve.one, this.z = this.curve.zero) : (this.x = new o(t, 16), this.z = new o(r, 16), this.x.red || (this.x = this.x.toRed(this.curve.red)), this.z.red || (this.z = this.z.toRed(this.curve.red)))
        } {
            var i = (e("assert"), e("../curve")),
                s = e("../../elliptic"),
                o = e("bn.js"),
                a = e("inherits"),
                f = i.base;
            s.utils.getNAF
        }
        a(r, f), t.exports = r, r.prototype.point = function(e, t) {
            return new n(this, e, t)
        }, r.prototype.pointFromJSON = function(e) {
            return n.fromJSON(this, e)
        }, r.prototype.validate = function(e) {
            var t = e.normalize().x,
                r = t.redSqr(),
                n = r.redMul(t).redAdd(r.redMul(this.a)).redAdd(t),
                i = n.redSqrt();
            return 0 === i.redSqr().cmp(n)
        }, a(n, f.BasePoint), n.prototype.precompute = function() {}, n.fromJSON = function(e, t) {
            return new n(e, t[0], t[1] || e.one)
        }, n.prototype.inspect = function() {
            return this.isInfinity() ? "<EC Point Infinity>" : "<EC Point x: " + this.x.fromRed().toString(16, 2) + " z: " + this.z.fromRed().toString(16, 2) + ">"
        }, n.prototype.isInfinity = function() {
            return 0 === this.z.cmpn(0)
        }, n.prototype.dbl = function() {
            var e = this.x.redAdd(this.z),
                t = e.redSqr(),
                r = this.x.redSub(this.z),
                n = r.redSqr(),
                i = t.redSub(n),
                s = t.redMul(n),
                o = i.redMul(n.redAdd(this.curve.a24.redMul(i)));
            return this.curve.point(s, o)
        }, n.prototype.add = function() {
            throw new Error("Not supported on Montgomery curve")
        }, n.prototype.diffAdd = function(e, t) {
            var r = this.x.redAdd(this.z),
                n = this.x.redSub(this.z),
                i = e.x.redAdd(e.z),
                s = e.x.redSub(e.z),
                o = s.redMul(r),
                a = i.redMul(n),
                f = t.z.redMul(o.redAdd(a).redSqr()),
                c = t.x.redMul(o.redISub(a).redSqr());
            return this.curve.point(f, c)
        }, n.prototype.mul = function(e) {
            for (var t = e.clone(), r = this, n = this.curve.point(null, null), i = this, s = []; 0 !== t.cmpn(0); t.ishrn(1)) s.push(t.andln(1));
            for (var o = s.length - 1; o >= 0; o--) 0 === s[o] ? (r = r.diffAdd(n, i), n = n.dbl()) : (n = r.diffAdd(n, i), r = r.dbl());
            return n
        }, n.prototype.mulAdd = function() {
            throw new Error("Not supported on Montgomery curve")
        }, n.prototype.normalize = function() {
            return this.x = this.x.redMul(this.z.redInvm()), this.z = this.curve.one, this
        }, n.prototype.getX = function() {
            return this.normalize(), this.x.fromRed()
        }
    }, {
        "../../elliptic": 212,
        "../curve": 215,
        assert: 41,
        "bn.js": 210,
        inherits: 232
    }],
    217: [function(e, t) {
        function r(e) {
            u.call(this, "short", e), this.a = new f(e.a, 16).toRed(this.red), this.b = new f(e.b, 16).toRed(this.red), this.tinv = this.two.redInvm(), this.zeroA = 0 === this.a.fromRed().cmpn(0), this.threeA = 0 === this.a.fromRed().sub(this.p).cmpn(-3), this.endo = this._getEndomorphism(e), this._endoWnafT1 = new Array(4), this._endoWnafT2 = new Array(4)
        }

        function n(e, t, r, n) {
            u.BasePoint.call(this, e, "affine"), null === t && null === r ? (this.x = null, this.y = null, this.inf = !0) : (this.x = new f(t, 16), this.y = new f(r, 16), n && (this.x.forceRed(this.curve.red), this.y.forceRed(this.curve.red)), this.x.red || (this.x = this.x.toRed(this.curve.red)), this.y.red || (this.y = this.y.toRed(this.curve.red)), this.inf = !1)
        }

        function i(e, t, r, n) {
            u.BasePoint.call(this, e, "jacobian"), null === t && null === r && null === n ? (this.x = this.curve.one, this.y = this.curve.one, this.z = new f(0)) : (this.x = new f(t, 16), this.y = new f(r, 16), this.z = new f(n, 16)), this.x.red || (this.x = this.x.toRed(this.curve.red)), this.y.red || (this.y = this.y.toRed(this.curve.red)), this.z.red || (this.z = this.z.toRed(this.curve.red)), this.zOne = this.z === this.curve.one
        } {
            var s = e("assert"),
                o = e("../curve"),
                a = e("../../elliptic"),
                f = e("bn.js"),
                c = e("inherits"),
                u = o.base;
            a.utils.getNAF
        }
        c(r, u), t.exports = r, r.prototype._getEndomorphism = function(e) {
            if (this.zeroA && this.g && this.n && 1 === this.p.modn(3)) {
                var t, r;
                if (e.beta) t = new f(e.beta, 16).toRed(this.red);
                else {
                    var n = this._getEndoRoots(this.p);
                    t = n[0].cmp(n[1]) < 0 ? n[0] : n[1], t = t.toRed(this.red)
                }
                if (e.lambda) r = new f(e.lambda, 16);
                else {
                    var i = this._getEndoRoots(this.n);
                    0 === this.g.mul(i[0]).x.cmp(this.g.x.redMul(t)) ? r = i[0] : (r = i[1], s(0 === this.g.mul(r).x.cmp(this.g.x.redMul(t))))
                }
                var o;
                return o = e.basis ? e.basis.map(function(e) {
                    return {
                        a: new f(e.a, 16),
                        b: new f(e.b, 16)
                    }
                }) : this._getEndoBasis(r), {
                    beta: t,
                    lambda: r,
                    basis: o
                }
            }
        }, r.prototype._getEndoRoots = function(e) {
            var t = e === this.p ? this.red : f.mont(e),
                r = new f(2).toRed(t).redInvm(),
                n = r.redNeg(),
                i = (new f(1).toRed(t), new f(3).toRed(t).redNeg().redSqrt().redMul(r)),
                s = n.redAdd(i).fromRed(),
                o = n.redSub(i).fromRed();
            return [s, o]
        }, r.prototype._getEndoBasis = function(e) {
            for (var t, r, n, i, s, o, a, c = this.n.shrn(Math.floor(this.n.bitLength() / 2)), u = e, d = this.n.clone(), h = new f(1), p = new f(0), l = new f(0), b = new f(1), g = 0; 0 !== u.cmpn(0);) {
                var y = d.div(u),
                    m = d.sub(y.mul(u)),
                    v = l.sub(y.mul(h)),
                    _ = b.sub(y.mul(p));
                if (!n && m.cmp(c) < 0) t = a.neg(), r = h, n = m.neg(), i = v;
                else if (n && 2 === ++g) break;
                a = m, d = u, u = m, l = h, h = v, b = p, p = _
            }
            s = m.neg(), o = v;
            var w = n.sqr().add(i.sqr()),
                S = s.sqr().add(o.sqr());
            return S.cmp(w) >= 0 && (s = t, o = r), n.sign && (n = n.neg(), i = i.neg()), s.sign && (s = s.neg(), o = o.neg()), [{
                a: n,
                b: i
            }, {
                a: s,
                b: o
            }]
        }, r.prototype._endoSplit = function(e) {
            var t = this.endo.basis,
                r = t[0],
                n = t[1],
                i = n.b.mul(e).divRound(this.n),
                s = r.b.neg().mul(e).divRound(this.n),
                o = i.mul(r.a),
                a = s.mul(n.a),
                f = i.mul(r.b),
                c = s.mul(n.b),
                u = e.sub(o).sub(a),
                d = f.add(c).neg();
            return {
                k1: u,
                k2: d
            }
        }, r.prototype.point = function(e, t, r) {
            return new n(this, e, t, r)
        }, r.prototype.pointFromX = function(e, t) {
            t = new f(t, 16), t.red || (t = t.toRed(this.red));
            var r = t.redSqr().redMul(t).redIAdd(t.redMul(this.a)).redIAdd(this.b),
                n = r.redSqrt(),
                i = n.fromRed().isOdd();
            return (e && !i || !e && i) && (n = n.redNeg()), this.point(t, n)
        }, r.prototype.jpoint = function(e, t, r) {
            return new i(this, e, t, r)
        }, r.prototype.pointFromJSON = function(e, t) {
            return n.fromJSON(this, e, t)
        }, r.prototype.validate = function(e) {
            if (e.inf) return !0;
            var t = e.x,
                r = e.y,
                n = this.a.redMul(t),
                i = t.redSqr().redMul(t).redIAdd(n).redIAdd(this.b);
            return 0 === r.redSqr().redISub(i).cmpn(0)
        }, r.prototype._endoWnafMulAdd = function(e, t) {
            for (var r = this._endoWnafT1, n = this._endoWnafT2, i = 0; i < e.length; i++) {
                var s = this._endoSplit(t[i]),
                    o = e[i],
                    a = o._getBeta();
                s.k1.sign && (s.k1.sign = !s.k1.sign, o = o.neg(!0)), s.k2.sign && (s.k2.sign = !s.k2.sign, a = a.neg(!0)), r[2 * i] = o, r[2 * i + 1] = a, n[2 * i] = s.k1, n[2 * i + 1] = s.k2
            }
            for (var f = this._wnafMulAdd(1, r, n, 2 * i), c = 0; 2 * i > c; c++) r[c] = null, n[c] = null;
            return f
        }, c(n, u.BasePoint), n.prototype._getBeta = function() {
            function e(e) {
                return n.point(e.x.redMul(n.endo.beta), e.y)
            }
            if (this.curve.endo) {
                var t = this.precomputed;
                if (t && t.beta) return t.beta;
                var r = this.curve.point(this.x.redMul(this.curve.endo.beta), this.y);
                if (t) {
                    var n = this.curve;
                    t.beta = r, r.precomputed = {
                        beta: null,
                        naf: t.naf && {
                            wnd: t.naf.wnd,
                            points: t.naf.points.map(e)
                        },
                        doubles: t.doubles && {
                            step: t.doubles.step,
                            points: t.doubles.points.map(e)
                        }
                    }
                }
                return r
            }
        }, n.prototype.toJSON = function() {
            return this.precomputed ? [this.x, this.y, this.precomputed && {
                doubles: this.precomputed.doubles && {
                    step: this.precomputed.doubles.step,
                    points: this.precomputed.doubles.points.slice(1)
                },
                naf: this.precomputed.naf && {
                    wnd: this.precomputed.naf.wnd,
                    points: this.precomputed.naf.points.slice(1)
                }
            }] : [this.x, this.y]
        }, n.fromJSON = function(e, t, r) {
            function n(t) {
                return e.point(t[0], t[1], r)
            }
            "string" == typeof t && (t = JSON.parse(t));
            var i = e.point(t[0], t[1], r);
            if (!t[2]) return i;
            var s = t[2];
            return i.precomputed = {
                beta: null,
                doubles: s.doubles && {
                    step: s.doubles.step,
                    points: [i].concat(s.doubles.points.map(n))
                },
                naf: s.naf && {
                    wnd: s.naf.wnd,
                    points: [i].concat(s.naf.points.map(n))
                }
            }, i
        }, n.prototype.inspect = function() {
            return this.isInfinity() ? "<EC Point Infinity>" : "<EC Point x: " + this.x.fromRed().toString(16, 2) + " y: " + this.y.fromRed().toString(16, 2) + ">"
        }, n.prototype.isInfinity = function() {
            return this.inf
        }, n.prototype.add = function(e) {
            if (this.inf) return e;
            if (e.inf) return this;
            if (this.eq(e)) return this.dbl();
            if (this.neg().eq(e)) return this.curve.point(null, null);
            if (0 === this.x.cmp(e.x)) return this.curve.point(null, null);
            var t = this.y.redSub(e.y);
            0 !== t.cmpn(0) && (t = t.redMul(this.x.redSub(e.x).redInvm()));
            var r = t.redSqr().redISub(this.x).redISub(e.x),
                n = t.redMul(this.x.redSub(r)).redISub(this.y);
            return this.curve.point(r, n)
        }, n.prototype.dbl = function() {
            if (this.inf) return this;
            var e = this.y.redAdd(this.y);
            if (0 === e.cmpn(0)) return this.curve.point(null, null);
            var t = this.curve.a,
                r = this.x.redSqr(),
                n = e.redInvm(),
                i = r.redAdd(r).redIAdd(r).redIAdd(t).redMul(n),
                s = i.redSqr().redISub(this.x.redAdd(this.x)),
                o = i.redMul(this.x.redSub(s)).redISub(this.y);
            return this.curve.point(s, o)
        }, n.prototype.getX = function() {
            return this.x.fromRed()
        }, n.prototype.getY = function() {
            return this.y.fromRed()
        }, n.prototype.mul = function(e) {
            return e = new f(e, 16), this.precomputed && this.precomputed.doubles ? this.curve._fixedNafMul(this, e) : this.curve.endo ? this.curve._endoWnafMulAdd([this], [e]) : this.curve._wnafMul(this, e)
        }, n.prototype.mulAdd = function(e, t, r) {
            var n = [this, t],
                i = [e, r];
            return this.curve.endo ? this.curve._endoWnafMulAdd(n, i) : this.curve._wnafMulAdd(1, n, i, 2)
        }, n.prototype.eq = function(e) {
            return this === e || this.inf === e.inf && (this.inf || 0 === this.x.cmp(e.x) && 0 === this.y.cmp(e.y))
        }, n.prototype.neg = function(e) {
            function t(e) {
                return e.neg()
            }
            if (this.inf) return this;
            var r = this.curve.point(this.x, this.y.redNeg());
            if (e && this.precomputed) {
                var n = this.precomputed;
                r.precomputed = {
                    naf: n.naf && {
                        wnd: n.naf.wnd,
                        points: n.naf.points.map(t)
                    },
                    doubles: n.doubles && {
                        step: n.doubles.step,
                        points: n.doubles.points.map(t)
                    }
                }
            }
            return r
        }, n.prototype.toJ = function() {
            if (this.inf) return this.curve.jpoint(null, null, null);
            var e = this.curve.jpoint(this.x, this.y, this.curve.one);
            return e
        }, c(i, u.BasePoint), i.prototype.toP = function() {
            if (this.isInfinity()) return this.curve.point(null, null);
            var e = this.z.redInvm(),
                t = e.redSqr(),
                r = this.x.redMul(t),
                n = this.y.redMul(t).redMul(e);
            return this.curve.point(r, n)
        }, i.prototype.neg = function() {
            return this.curve.jpoint(this.x, this.y.redNeg(), this.z)
        }, i.prototype.add = function(e) {
            if (this.isInfinity()) return e;
            if (e.isInfinity()) return this;
            var t = e.z.redSqr(),
                r = this.z.redSqr(),
                n = this.x.redMul(t),
                i = e.x.redMul(r),
                s = this.y.redMul(t.redMul(e.z)),
                o = e.y.redMul(r.redMul(this.z)),
                a = n.redSub(i),
                f = s.redSub(o);
            if (0 === a.cmpn(0)) return 0 !== f.cmpn(0) ? this.curve.jpoint(null, null, null) : this.dbl();
            var c = a.redSqr(),
                u = c.redMul(a),
                d = n.redMul(c),
                h = f.redSqr().redIAdd(u).redISub(d).redISub(d),
                p = f.redMul(d.redISub(h)).redISub(s.redMul(u)),
                l = this.z.redMul(e.z).redMul(a);
            return this.curve.jpoint(h, p, l)
        }, i.prototype.mixedAdd = function(e) {
            if (this.isInfinity()) return e.toJ();
            if (e.isInfinity()) return this;
            var t = this.z.redSqr(),
                r = this.x,
                n = e.x.redMul(t),
                i = this.y,
                s = e.y.redMul(t).redMul(this.z),
                o = r.redSub(n),
                a = i.redSub(s);
            if (0 === o.cmpn(0)) return 0 !== a.cmpn(0) ? this.curve.jpoint(null, null, null) : this.dbl();
            var f = o.redSqr(),
                c = f.redMul(o),
                u = r.redMul(f),
                d = a.redSqr().redIAdd(c).redISub(u).redISub(u),
                h = a.redMul(u.redISub(d)).redISub(i.redMul(c)),
                p = this.z.redMul(o);
            return this.curve.jpoint(d, h, p)
        }, i.prototype.dblp = function(e) {
            if (0 === e) return this;
            if (this.isInfinity()) return this;
            if (!e) return this.dbl();
            if (this.curve.zeroA || this.curve.threeA) {
                for (var t = this, r = 0; e > r; r++) t = t.dbl();
                return t
            }
            for (var n = this.curve.a, i = this.curve.tinv, s = this.x, o = this.y, a = this.z, f = a.redSqr().redSqr(), c = o.redAdd(o), r = 0; e > r; r++) {
                var u = s.redSqr(),
                    d = c.redSqr(),
                    h = d.redSqr(),
                    p = u.redAdd(u).redIAdd(u).redIAdd(n.redMul(f)),
                    l = s.redMul(d),
                    b = p.redSqr().redISub(l.redAdd(l)),
                    g = l.redISub(b),
                    y = p.redMul(g);
                y = y.redIAdd(y).redISub(h);
                var m = c.redMul(a);
                e > r + 1 && (f = f.redMul(h)), s = b, a = m, c = y
            }
            return this.curve.jpoint(s, c.redMul(i), a)
        }, i.prototype.dbl = function() {
            return this.isInfinity() ? this : this.curve.zeroA ? this._zeroDbl() : this.curve.threeA ? this._threeDbl() : this._dbl()
        }, i.prototype._zeroDbl = function() {
            if (this.zOne) {
                var e = this.x.redSqr(),
                    t = this.y.redSqr(),
                    r = t.redSqr(),
                    n = this.x.redAdd(t).redSqr().redISub(e).redISub(r);
                n = n.redIAdd(n);
                var i = e.redAdd(e).redIAdd(e),
                    s = i.redSqr().redISub(n).redISub(n),
                    o = r.redIAdd(r);
                o = o.redIAdd(o), o = o.redIAdd(o);
                var a = s,
                    f = i.redMul(n.redISub(s)).redISub(o),
                    c = this.y.redAdd(this.y)
            } else {
                var u = this.x.redSqr(),
                    d = this.y.redSqr(),
                    h = d.redSqr(),
                    p = this.x.redAdd(d).redSqr().redISub(u).redISub(h);
                p = p.redIAdd(p);
                var l = u.redAdd(u).redIAdd(u),
                    b = l.redSqr(),
                    g = h.redIAdd(h);
                g = g.redIAdd(g), g = g.redIAdd(g);
                var a = b.redISub(p).redISub(p),
                    f = l.redMul(p.redISub(a)).redISub(g),
                    c = this.y.redMul(this.z);
                c = c.redIAdd(c)
            }
            return this.curve.jpoint(a, f, c)
        }, i.prototype._threeDbl = function() {
            if (this.zOne) {
                var e = this.x.redSqr(),
                    t = this.y.redSqr(),
                    r = t.redSqr(),
                    n = this.x.redAdd(t).redSqr().redISub(e).redISub(r);
                n = n.redIAdd(n);
                var i = e.redAdd(e).redIAdd(e).redIAdd(this.curve.a),
                    s = i.redSqr().redISub(n).redISub(n),
                    o = s,
                    a = r.redIAdd(r);
                a = a.redIAdd(a), a = a.redIAdd(a);
                var f = i.redMul(n.redISub(s)).redISub(a),
                    c = this.y.redAdd(this.y)
            } else {
                var u = this.z.redSqr(),
                    d = this.y.redSqr(),
                    h = this.x.redMul(d),
                    p = this.x.redSub(u).redMul(this.x.redAdd(u));
                p = p.redAdd(p).redIAdd(p);
                var l = h.redIAdd(h);
                l = l.redIAdd(l);
                var b = l.redAdd(l),
                    o = p.redSqr().redISub(b),
                    c = this.y.redAdd(this.z).redSqr().redISub(d).redISub(u),
                    g = d.redSqr();
                g = g.redIAdd(g), g = g.redIAdd(g), g = g.redIAdd(g);
                var f = p.redMul(l.redISub(o)).redISub(g)
            }
            return this.curve.jpoint(o, f, c)
        }, i.prototype._dbl = function() {
            var e = this.curve.a,
                t = (this.curve.tinv, this.x),
                r = this.y,
                n = this.z,
                i = n.redSqr().redSqr(),
                s = t.redSqr(),
                o = r.redSqr(),
                a = s.redAdd(s).redIAdd(s).redIAdd(e.redMul(i)),
                f = t.redAdd(t);
            f = f.redIAdd(f);
            var c = f.redMul(o),
                u = a.redSqr().redISub(c.redAdd(c)),
                d = c.redISub(u),
                h = o.redSqr();
            h = h.redIAdd(h), h = h.redIAdd(h), h = h.redIAdd(h);
            var p = a.redMul(d).redISub(h),
                l = r.redAdd(r).redMul(n);
            return this.curve.jpoint(u, p, l)
        }, i.prototype.trpl = function() {
            if (!this.curve.zeroA) return this.dbl().add(this);
            var e = this.x.redSqr(),
                t = this.y.redSqr(),
                r = this.z.redSqr(),
                n = t.redSqr(),
                i = e.redAdd(e).redIAdd(e),
                s = i.redSqr(),
                o = this.x.redAdd(t).redSqr().redISub(e).redISub(n);
            o = o.redIAdd(o), o = o.redAdd(o).redIAdd(o), o = o.redISub(s);
            var a = o.redSqr(),
                f = n.redIAdd(n);
            f = f.redIAdd(f), f = f.redIAdd(f), f = f.redIAdd(f);
            var c = i.redIAdd(o).redSqr().redISub(s).redISub(a).redISub(f),
                u = t.redMul(c);
            u = u.redIAdd(u), u = u.redIAdd(u);
            var d = this.x.redMul(a).redISub(u);
            d = d.redIAdd(d), d = d.redIAdd(d);
            var h = this.y.redMul(c.redMul(f.redISub(c)).redISub(o.redMul(a)));
            h = h.redIAdd(h), h = h.redIAdd(h), h = h.redIAdd(h);
            var p = this.z.redAdd(o).redSqr().redISub(r).redISub(a);
            return this.curve.jpoint(d, h, p)
        }, i.prototype.mul = function(e, t) {
            return e = new f(e, t), this.curve._wnafMul(this, e)
        }, i.prototype.eq = function(e) {
            if ("affine" === e.type) return this.eq(e.toJ());
            if (this === e) return !0;
            var t = this.z.redSqr(),
                r = e.z.redSqr();
            if (0 !== this.x.redMul(r).redISub(e.x.redMul(t)).cmpn(0)) return !1;
            var n = t.redMul(this.z),
                i = r.redMul(e.z);
            return 0 === this.y.redMul(i).redISub(e.y.redMul(n)).cmpn(0)
        }, i.prototype.inspect = function() {
            return this.isInfinity() ? "<EC JPoint Infinity>" : "<EC JPoint x: " + this.x.toString(16, 2) + " y: " + this.y.toString(16, 2) + " z: " + this.z.toString(16, 2) + ">"
        }, i.prototype.isInfinity = function() {
            return 0 === this.z.cmpn(0)
        }
    }, {
        "../../elliptic": 212,
        "../curve": 215,
        assert: 41,
        "bn.js": 210,
        inherits: 232
    }],
    218: [function(e, t, r) {
        function n(e) {
            this.curve = "short" === e.type ? new f.curve["short"](e) : "edwards" === e.type ? new f.curve.edwards(e) : new f.curve.mont(e), this.g = this.curve.g, this.n = this.curve.n, this.hash = e.hash, o(this.g.validate(), "Invalid curve"), o(this.g.mul(this.n).isInfinity(), "Invalid curve, G*N != O")
        }

        function i(e, t) {
            Object.defineProperty(s, e, {
                configurable: !0,
                enumerable: !0,
                get: function() {
                    var r = new n(t);
                    return Object.defineProperty(s, e, {
                        configurable: !0,
                        enumerable: !0,
                        value: r
                    }), r
                }
            })
        }
        var s = r,
            o = e("assert"),
            a = e("hash.js"),
            f = (e("bn.js"), e("../elliptic"));
        s.PresetCurve = n, i("p192", {
            type: "short",
            prime: "p192",
            p: "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff",
            a: "ffffffff ffffffff ffffffff fffffffe ffffffff fffffffc",
            b: "64210519 e59c80e7 0fa7e9ab 72243049 feb8deec c146b9b1",
            n: "ffffffff ffffffff ffffffff 99def836 146bc9b1 b4d22831",
            hash: a.sha256,
            gRed: !1,
            g: ["188da80e b03090f6 7cbf20eb 43a18800 f4ff0afd 82ff1012", "07192b95 ffc8da78 631011ed 6b24cdd5 73f977a1 1e794811"]
        }), i("p224", {
            type: "short",
            prime: "p224",
            p: "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001",
            a: "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff fffffffe",
            b: "b4050a85 0c04b3ab f5413256 5044b0b7 d7bfd8ba 270b3943 2355ffb4",
            n: "ffffffff ffffffff ffffffff ffff16a2 e0b8f03e 13dd2945 5c5c2a3d",
            hash: a.sha256,
            gRed: !1,
            g: ["b70e0cbd 6bb4bf7f 321390b9 4a03c1d3 56c21122 343280d6 115c1d21", "bd376388 b5f723fb 4c22dfe6 cd4375a0 5a074764 44d58199 85007e34"]
        }), i("p256", {
            type: "short",
            prime: null,
            p: "ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff ffffffff",
            a: "ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff fffffffc",
            b: "5ac635d8 aa3a93e7 b3ebbd55 769886bc 651d06b0 cc53b0f6 3bce3c3e 27d2604b",
            n: "ffffffff 00000000 ffffffff ffffffff bce6faad a7179e84 f3b9cac2 fc632551",
            hash: a.sha256,
            gRed: !1,
            g: ["6b17d1f2 e12c4247 f8bce6e5 63a440f2 77037d81 2deb33a0 f4a13945 d898c296", "4fe342e2 fe1a7f9b 8ee7eb4a 7c0f9e16 2bce3357 6b315ece cbb64068 37bf51f5"]
        }), i("curve25519", {
            type: "mont",
            prime: "p25519",
            p: "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed",
            a: "76d06",
            b: "0",
            n: "1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed",
            hash: a.sha256,
            gRed: !1,
            g: ["9"]
        }), i("ed25519", {
            type: "edwards",
            prime: "p25519",
            p: "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed",
            a: "-1",
            c: "1",
            d: "52036cee2b6ffe73 8cc740797779e898 00700a4d4141d8ab 75eb4dca135978a3",
            n: "1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed",
            hash: a.sha256,
            gRed: !1,
            g: ["216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a", "6666666666666666666666666666666666666666666666666666666666666658"]
        }), i("secp256k1", {
            type: "short",
            prime: "k256",
            p: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f",
            a: "0",
            b: "7",
            n: "ffffffff ffffffff ffffffff fffffffe baaedce6 af48a03b bfd25e8c d0364141",
            h: "1",
            hash: a.sha256,
            beta: "7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee",
            lambda: "5363ad4cc05c30e0a5261c028812645a122e22ea20816678df02967c1b23bd72",
            basis: [{
                a: "3086d221a7d46bcde86c90e49284eb15",
                b: "-e4437ed6010e88286f547fa90abfe4c3"
            }, {
                a: "114ca50f7a8e2f3f657c1108d9d44cfd8",
                b: "3086d221a7d46bcde86c90e49284eb15"
            }],
            gRed: !1,
            g: ["79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798", "483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8", {
                doubles: {
                    step: 4,
                    points: [
                        ["e60fce93b59e9ec53011aabc21c23e97b2a31369b87a5ae9c44ee89e2a6dec0a", "f7e3507399e595929db99f34f57937101296891e44d23f0be1f32cce69616821"],
                        ["8282263212c609d9ea2a6e3e172de238d8c39cabd5ac1ca10646e23fd5f51508", "11f8a8098557dfe45e8256e830b60ace62d613ac2f7b17bed31b6eaff6e26caf"],
                        ["175e159f728b865a72f99cc6c6fc846de0b93833fd2222ed73fce5b551e5b739", "d3506e0d9e3c79eba4ef97a51ff71f5eacb5955add24345c6efa6ffee9fed695"],
                        ["363d90d447b00c9c99ceac05b6262ee053441c7e55552ffe526bad8f83ff4640", "4e273adfc732221953b445397f3363145b9a89008199ecb62003c7f3bee9de9"],
                        ["8b4b5f165df3c2be8c6244b5b745638843e4a781a15bcd1b69f79a55dffdf80c", "4aad0a6f68d308b4b3fbd7813ab0da04f9e336546162ee56b3eff0c65fd4fd36"],
                        ["723cbaa6e5db996d6bf771c00bd548c7b700dbffa6c0e77bcb6115925232fcda", "96e867b5595cc498a921137488824d6e2660a0653779494801dc069d9eb39f5f"],
                        ["eebfa4d493bebf98ba5feec812c2d3b50947961237a919839a533eca0e7dd7fa", "5d9a8ca3970ef0f269ee7edaf178089d9ae4cdc3a711f712ddfd4fdae1de8999"],
                        ["100f44da696e71672791d0a09b7bde459f1215a29b3c03bfefd7835b39a48db0", "cdd9e13192a00b772ec8f3300c090666b7ff4a18ff5195ac0fbd5cd62bc65a09"],
                        ["e1031be262c7ed1b1dc9227a4a04c017a77f8d4464f3b3852c8acde6e534fd2d", "9d7061928940405e6bb6a4176597535af292dd419e1ced79a44f18f29456a00d"],
                        ["feea6cae46d55b530ac2839f143bd7ec5cf8b266a41d6af52d5e688d9094696d", "e57c6b6c97dce1bab06e4e12bf3ecd5c981c8957cc41442d3155debf18090088"],
                        ["da67a91d91049cdcb367be4be6ffca3cfeed657d808583de33fa978bc1ec6cb1", "9bacaa35481642bc41f463f7ec9780e5dec7adc508f740a17e9ea8e27a68be1d"],
                        ["53904faa0b334cdda6e000935ef22151ec08d0f7bb11069f57545ccc1a37b7c0", "5bc087d0bc80106d88c9eccac20d3c1c13999981e14434699dcb096b022771c8"],
                        ["8e7bcd0bd35983a7719cca7764ca906779b53a043a9b8bcaeff959f43ad86047", "10b7770b2a3da4b3940310420ca9514579e88e2e47fd68b3ea10047e8460372a"],
                        ["385eed34c1cdff21e6d0818689b81bde71a7f4f18397e6690a841e1599c43862", "283bebc3e8ea23f56701de19e9ebf4576b304eec2086dc8cc0458fe5542e5453"],
                        ["6f9d9b803ecf191637c73a4413dfa180fddf84a5947fbc9c606ed86c3fac3a7", "7c80c68e603059ba69b8e2a30e45c4d47ea4dd2f5c281002d86890603a842160"],
                        ["3322d401243c4e2582a2147c104d6ecbf774d163db0f5e5313b7e0e742d0e6bd", "56e70797e9664ef5bfb019bc4ddaf9b72805f63ea2873af624f3a2e96c28b2a0"],
                        ["85672c7d2de0b7da2bd1770d89665868741b3f9af7643397721d74d28134ab83", "7c481b9b5b43b2eb6374049bfa62c2e5e77f17fcc5298f44c8e3094f790313a6"],
                        ["948bf809b1988a46b06c9f1919413b10f9226c60f668832ffd959af60c82a0a", "53a562856dcb6646dc6b74c5d1c3418c6d4dff08c97cd2bed4cb7f88d8c8e589"],
                        ["6260ce7f461801c34f067ce0f02873a8f1b0e44dfc69752accecd819f38fd8e8", "bc2da82b6fa5b571a7f09049776a1ef7ecd292238051c198c1a84e95b2b4ae17"],
                        ["e5037de0afc1d8d43d8348414bbf4103043ec8f575bfdc432953cc8d2037fa2d", "4571534baa94d3b5f9f98d09fb990bddbd5f5b03ec481f10e0e5dc841d755bda"],
                        ["e06372b0f4a207adf5ea905e8f1771b4e7e8dbd1c6a6c5b725866a0ae4fce725", "7a908974bce18cfe12a27bb2ad5a488cd7484a7787104870b27034f94eee31dd"],
                        ["213c7a715cd5d45358d0bbf9dc0ce02204b10bdde2a3f58540ad6908d0559754", "4b6dad0b5ae462507013ad06245ba190bb4850f5f36a7eeddff2c27534b458f2"],
                        ["4e7c272a7af4b34e8dbb9352a5419a87e2838c70adc62cddf0cc3a3b08fbd53c", "17749c766c9d0b18e16fd09f6def681b530b9614bff7dd33e0b3941817dcaae6"],
                        ["fea74e3dbe778b1b10f238ad61686aa5c76e3db2be43057632427e2840fb27b6", "6e0568db9b0b13297cf674deccb6af93126b596b973f7b77701d3db7f23cb96f"],
                        ["76e64113f677cf0e10a2570d599968d31544e179b760432952c02a4417bdde39", "c90ddf8dee4e95cf577066d70681f0d35e2a33d2b56d2032b4b1752d1901ac01"],
                        ["c738c56b03b2abe1e8281baa743f8f9a8f7cc643df26cbee3ab150242bcbb891", "893fb578951ad2537f718f2eacbfbbbb82314eef7880cfe917e735d9699a84c3"],
                        ["d895626548b65b81e264c7637c972877d1d72e5f3a925014372e9f6588f6c14b", "febfaa38f2bc7eae728ec60818c340eb03428d632bb067e179363ed75d7d991f"],
                        ["b8da94032a957518eb0f6433571e8761ceffc73693e84edd49150a564f676e03", "2804dfa44805a1e4d7c99cc9762808b092cc584d95ff3b511488e4e74efdf6e7"],
                        ["e80fea14441fb33a7d8adab9475d7fab2019effb5156a792f1a11778e3c0df5d", "eed1de7f638e00771e89768ca3ca94472d155e80af322ea9fcb4291b6ac9ec78"],
                        ["a301697bdfcd704313ba48e51d567543f2a182031efd6915ddc07bbcc4e16070", "7370f91cfb67e4f5081809fa25d40f9b1735dbf7c0a11a130c0d1a041e177ea1"],
                        ["90ad85b389d6b936463f9d0512678de208cc330b11307fffab7ac63e3fb04ed4", "e507a3620a38261affdcbd9427222b839aefabe1582894d991d4d48cb6ef150"],
                        ["8f68b9d2f63b5f339239c1ad981f162ee88c5678723ea3351b7b444c9ec4c0da", "662a9f2dba063986de1d90c2b6be215dbbea2cfe95510bfdf23cbf79501fff82"],
                        ["e4f3fb0176af85d65ff99ff9198c36091f48e86503681e3e6686fd5053231e11", "1e63633ad0ef4f1c1661a6d0ea02b7286cc7e74ec951d1c9822c38576feb73bc"],
                        ["8c00fa9b18ebf331eb961537a45a4266c7034f2f0d4e1d0716fb6eae20eae29e", "efa47267fea521a1a9dc343a3736c974c2fadafa81e36c54e7d2a4c66702414b"],
                        ["e7a26ce69dd4829f3e10cec0a9e98ed3143d084f308b92c0997fddfc60cb3e41", "2a758e300fa7984b471b006a1aafbb18d0a6b2c0420e83e20e8a9421cf2cfd51"],
                        ["b6459e0ee3662ec8d23540c223bcbdc571cbcb967d79424f3cf29eb3de6b80ef", "67c876d06f3e06de1dadf16e5661db3c4b3ae6d48e35b2ff30bf0b61a71ba45"],
                        ["d68a80c8280bb840793234aa118f06231d6f1fc67e73c5a5deda0f5b496943e8", "db8ba9fff4b586d00c4b1f9177b0e28b5b0e7b8f7845295a294c84266b133120"],
                        ["324aed7df65c804252dc0270907a30b09612aeb973449cea4095980fc28d3d5d", "648a365774b61f2ff130c0c35aec1f4f19213b0c7e332843967224af96ab7c84"],
                        ["4df9c14919cde61f6d51dfdbe5fee5dceec4143ba8d1ca888e8bd373fd054c96", "35ec51092d8728050974c23a1d85d4b5d506cdc288490192ebac06cad10d5d"],
                        ["9c3919a84a474870faed8a9c1cc66021523489054d7f0308cbfc99c8ac1f98cd", "ddb84f0f4a4ddd57584f044bf260e641905326f76c64c8e6be7e5e03d4fc599d"],
                        ["6057170b1dd12fdf8de05f281d8e06bb91e1493a8b91d4cc5a21382120a959e5", "9a1af0b26a6a4807add9a2daf71df262465152bc3ee24c65e899be932385a2a8"],
                        ["a576df8e23a08411421439a4518da31880cef0fba7d4df12b1a6973eecb94266", "40a6bf20e76640b2c92b97afe58cd82c432e10a7f514d9f3ee8be11ae1b28ec8"],
                        ["7778a78c28dec3e30a05fe9629de8c38bb30d1f5cf9a3a208f763889be58ad71", "34626d9ab5a5b22ff7098e12f2ff580087b38411ff24ac563b513fc1fd9f43ac"],
                        ["928955ee637a84463729fd30e7afd2ed5f96274e5ad7e5cb09eda9c06d903ac", "c25621003d3f42a827b78a13093a95eeac3d26efa8a8d83fc5180e935bcd091f"],
                        ["85d0fef3ec6db109399064f3a0e3b2855645b4a907ad354527aae75163d82751", "1f03648413a38c0be29d496e582cf5663e8751e96877331582c237a24eb1f962"],
                        ["ff2b0dce97eece97c1c9b6041798b85dfdfb6d8882da20308f5404824526087e", "493d13fef524ba188af4c4dc54d07936c7b7ed6fb90e2ceb2c951e01f0c29907"],
                        ["827fbbe4b1e880ea9ed2b2e6301b212b57f1ee148cd6dd28780e5e2cf856e241", "c60f9c923c727b0b71bef2c67d1d12687ff7a63186903166d605b68baec293ec"],
                        ["eaa649f21f51bdbae7be4ae34ce6e5217a58fdce7f47f9aa7f3b58fa2120e2b3", "be3279ed5bbbb03ac69a80f89879aa5a01a6b965f13f7e59d47a5305ba5ad93d"],
                        ["e4a42d43c5cf169d9391df6decf42ee541b6d8f0c9a137401e23632dda34d24f", "4d9f92e716d1c73526fc99ccfb8ad34ce886eedfa8d8e4f13a7f7131deba9414"],
                        ["1ec80fef360cbdd954160fadab352b6b92b53576a88fea4947173b9d4300bf19", "aeefe93756b5340d2f3a4958a7abbf5e0146e77f6295a07b671cdc1cc107cefd"],
                        ["146a778c04670c2f91b00af4680dfa8bce3490717d58ba889ddb5928366642be", "b318e0ec3354028add669827f9d4b2870aaa971d2f7e5ed1d0b297483d83efd0"],
                        ["fa50c0f61d22e5f07e3acebb1aa07b128d0012209a28b9776d76a8793180eef9", "6b84c6922397eba9b72cd2872281a68a5e683293a57a213b38cd8d7d3f4f2811"],
                        ["da1d61d0ca721a11b1a5bf6b7d88e8421a288ab5d5bba5220e53d32b5f067ec2", "8157f55a7c99306c79c0766161c91e2966a73899d279b48a655fba0f1ad836f1"],
                        ["a8e282ff0c9706907215ff98e8fd416615311de0446f1e062a73b0610d064e13", "7f97355b8db81c09abfb7f3c5b2515888b679a3e50dd6bd6cef7c73111f4cc0c"],
                        ["174a53b9c9a285872d39e56e6913cab15d59b1fa512508c022f382de8319497c", "ccc9dc37abfc9c1657b4155f2c47f9e6646b3a1d8cb9854383da13ac079afa73"],
                        ["959396981943785c3d3e57edf5018cdbe039e730e4918b3d884fdff09475b7ba", "2e7e552888c331dd8ba0386a4b9cd6849c653f64c8709385e9b8abf87524f2fd"],
                        ["d2a63a50ae401e56d645a1153b109a8fcca0a43d561fba2dbb51340c9d82b151", "e82d86fb6443fcb7565aee58b2948220a70f750af484ca52d4142174dcf89405"],
                        ["64587e2335471eb890ee7896d7cfdc866bacbdbd3839317b3436f9b45617e073", "d99fcdd5bf6902e2ae96dd6447c299a185b90a39133aeab358299e5e9faf6589"],
                        ["8481bde0e4e4d885b3a546d3e549de042f0aa6cea250e7fd358d6c86dd45e458", "38ee7b8cba5404dd84a25bf39cecb2ca900a79c42b262e556d64b1b59779057e"],
                        ["13464a57a78102aa62b6979ae817f4637ffcfed3c4b1ce30bcd6303f6caf666b", "69be159004614580ef7e433453ccb0ca48f300a81d0942e13f495a907f6ecc27"],
                        ["bc4a9df5b713fe2e9aef430bcc1dc97a0cd9ccede2f28588cada3a0d2d83f366", "d3a81ca6e785c06383937adf4b798caa6e8a9fbfa547b16d758d666581f33c1"],
                        ["8c28a97bf8298bc0d23d8c749452a32e694b65e30a9472a3954ab30fe5324caa", "40a30463a3305193378fedf31f7cc0eb7ae784f0451cb9459e71dc73cbef9482"],
                        ["8ea9666139527a8c1dd94ce4f071fd23c8b350c5a4bb33748c4ba111faccae0", "620efabbc8ee2782e24e7c0cfb95c5d735b783be9cf0f8e955af34a30e62b945"],
                        ["dd3625faef5ba06074669716bbd3788d89bdde815959968092f76cc4eb9a9787", "7a188fa3520e30d461da2501045731ca941461982883395937f68d00c644a573"],
                        ["f710d79d9eb962297e4f6232b40e8f7feb2bc63814614d692c12de752408221e", "ea98e67232d3b3295d3b535532115ccac8612c721851617526ae47a9c77bfc82"]
                    ]
                },
                naf: {
                    wnd: 7,
                    points: [
                        ["f9308a019258c31049344f85f89d5229b531c845836f99b08601f113bce036f9", "388f7b0f632de8140fe337e62a37f3566500a99934c2231b6cb9fd7584b8e672"],
                        ["2f8bde4d1a07209355b4a7250a5c5128e88b84bddc619ab7cba8d569b240efe4", "d8ac222636e5e3d6d4dba9dda6c9c426f788271bab0d6840dca87d3aa6ac62d6"],
                        ["5cbdf0646e5db4eaa398f365f2ea7a0e3d419b7e0330e39ce92bddedcac4f9bc", "6aebca40ba255960a3178d6d861a54dba813d0b813fde7b5a5082628087264da"],
                        ["acd484e2f0c7f65309ad178a9f559abde09796974c57e714c35f110dfc27ccbe", "cc338921b0a7d9fd64380971763b61e9add888a4375f8e0f05cc262ac64f9c37"],
                        ["774ae7f858a9411e5ef4246b70c65aac5649980be5c17891bbec17895da008cb", "d984a032eb6b5e190243dd56d7b7b365372db1e2dff9d6a8301d74c9c953c61b"],
                        ["f28773c2d975288bc7d1d205c3748651b075fbc6610e58cddeeddf8f19405aa8", "ab0902e8d880a89758212eb65cdaf473a1a06da521fa91f29b5cb52db03ed81"],
                        ["d7924d4f7d43ea965a465ae3095ff41131e5946f3c85f79e44adbcf8e27e080e", "581e2872a86c72a683842ec228cc6defea40af2bd896d3a5c504dc9ff6a26b58"],
                        ["defdea4cdb677750a420fee807eacf21eb9898ae79b9768766e4faa04a2d4a34", "4211ab0694635168e997b0ead2a93daeced1f4a04a95c0f6cfb199f69e56eb77"],
                        ["2b4ea0a797a443d293ef5cff444f4979f06acfebd7e86d277475656138385b6c", "85e89bc037945d93b343083b5a1c86131a01f60c50269763b570c854e5c09b7a"],
                        ["352bbf4a4cdd12564f93fa332ce333301d9ad40271f8107181340aef25be59d5", "321eb4075348f534d59c18259dda3e1f4a1b3b2e71b1039c67bd3d8bcf81998c"],
                        ["2fa2104d6b38d11b0230010559879124e42ab8dfeff5ff29dc9cdadd4ecacc3f", "2de1068295dd865b64569335bd5dd80181d70ecfc882648423ba76b532b7d67"],
                        ["9248279b09b4d68dab21a9b066edda83263c3d84e09572e269ca0cd7f5453714", "73016f7bf234aade5d1aa71bdea2b1ff3fc0de2a887912ffe54a32ce97cb3402"],
                        ["daed4f2be3a8bf278e70132fb0beb7522f570e144bf615c07e996d443dee8729", "a69dce4a7d6c98e8d4a1aca87ef8d7003f83c230f3afa726ab40e52290be1c55"],
                        ["c44d12c7065d812e8acf28d7cbb19f9011ecd9e9fdf281b0e6a3b5e87d22e7db", "2119a460ce326cdc76c45926c982fdac0e106e861edf61c5a039063f0e0e6482"],
                        ["6a245bf6dc698504c89a20cfded60853152b695336c28063b61c65cbd269e6b4", "e022cf42c2bd4a708b3f5126f16a24ad8b33ba48d0423b6efd5e6348100d8a82"],
                        ["1697ffa6fd9de627c077e3d2fe541084ce13300b0bec1146f95ae57f0d0bd6a5", "b9c398f186806f5d27561506e4557433a2cf15009e498ae7adee9d63d01b2396"],
                        ["605bdb019981718b986d0f07e834cb0d9deb8360ffb7f61df982345ef27a7479", "2972d2de4f8d20681a78d93ec96fe23c26bfae84fb14db43b01e1e9056b8c49"],
                        ["62d14dab4150bf497402fdc45a215e10dcb01c354959b10cfe31c7e9d87ff33d", "80fc06bd8cc5b01098088a1950eed0db01aa132967ab472235f5642483b25eaf"],
                        ["80c60ad0040f27dade5b4b06c408e56b2c50e9f56b9b8b425e555c2f86308b6f", "1c38303f1cc5c30f26e66bad7fe72f70a65eed4cbe7024eb1aa01f56430bd57a"],
                        ["7a9375ad6167ad54aa74c6348cc54d344cc5dc9487d847049d5eabb0fa03c8fb", "d0e3fa9eca8726909559e0d79269046bdc59ea10c70ce2b02d499ec224dc7f7"],
                        ["d528ecd9b696b54c907a9ed045447a79bb408ec39b68df504bb51f459bc3ffc9", "eecf41253136e5f99966f21881fd656ebc4345405c520dbc063465b521409933"],
                        ["49370a4b5f43412ea25f514e8ecdad05266115e4a7ecb1387231808f8b45963", "758f3f41afd6ed428b3081b0512fd62a54c3f3afbb5b6764b653052a12949c9a"],
                        ["77f230936ee88cbbd73df930d64702ef881d811e0e1498e2f1c13eb1fc345d74", "958ef42a7886b6400a08266e9ba1b37896c95330d97077cbbe8eb3c7671c60d6"],
                        ["f2dac991cc4ce4b9ea44887e5c7c0bce58c80074ab9d4dbaeb28531b7739f530", "e0dedc9b3b2f8dad4da1f32dec2531df9eb5fbeb0598e4fd1a117dba703a3c37"],
                        ["463b3d9f662621fb1b4be8fbbe2520125a216cdfc9dae3debcba4850c690d45b", "5ed430d78c296c3543114306dd8622d7c622e27c970a1de31cb377b01af7307e"],
                        ["f16f804244e46e2a09232d4aff3b59976b98fac14328a2d1a32496b49998f247", "cedabd9b82203f7e13d206fcdf4e33d92a6c53c26e5cce26d6579962c4e31df6"],
                        ["caf754272dc84563b0352b7a14311af55d245315ace27c65369e15f7151d41d1", "cb474660ef35f5f2a41b643fa5e460575f4fa9b7962232a5c32f908318a04476"],
                        ["2600ca4b282cb986f85d0f1709979d8b44a09c07cb86d7c124497bc86f082120", "4119b88753c15bd6a693b03fcddbb45d5ac6be74ab5f0ef44b0be9475a7e4b40"],
                        ["7635ca72d7e8432c338ec53cd12220bc01c48685e24f7dc8c602a7746998e435", "91b649609489d613d1d5e590f78e6d74ecfc061d57048bad9e76f302c5b9c61"],
                        ["754e3239f325570cdbbf4a87deee8a66b7f2b33479d468fbc1a50743bf56cc18", "673fb86e5bda30fb3cd0ed304ea49a023ee33d0197a695d0c5d98093c536683"],
                        ["e3e6bd1071a1e96aff57859c82d570f0330800661d1c952f9fe2694691d9b9e8", "59c9e0bba394e76f40c0aa58379a3cb6a5a2283993e90c4167002af4920e37f5"],
                        ["186b483d056a033826ae73d88f732985c4ccb1f32ba35f4b4cc47fdcf04aa6eb", "3b952d32c67cf77e2e17446e204180ab21fb8090895138b4a4a797f86e80888b"],
                        ["df9d70a6b9876ce544c98561f4be4f725442e6d2b737d9c91a8321724ce0963f", "55eb2dafd84d6ccd5f862b785dc39d4ab157222720ef9da217b8c45cf2ba2417"],
                        ["5edd5cc23c51e87a497ca815d5dce0f8ab52554f849ed8995de64c5f34ce7143", "efae9c8dbc14130661e8cec030c89ad0c13c66c0d17a2905cdc706ab7399a868"],
                        ["290798c2b6476830da12fe02287e9e777aa3fba1c355b17a722d362f84614fba", "e38da76dcd440621988d00bcf79af25d5b29c094db2a23146d003afd41943e7a"],
                        ["af3c423a95d9f5b3054754efa150ac39cd29552fe360257362dfdecef4053b45", "f98a3fd831eb2b749a93b0e6f35cfb40c8cd5aa667a15581bc2feded498fd9c6"],
                        ["766dbb24d134e745cccaa28c99bf274906bb66b26dcf98df8d2fed50d884249a", "744b1152eacbe5e38dcc887980da38b897584a65fa06cedd2c924f97cbac5996"],
                        ["59dbf46f8c94759ba21277c33784f41645f7b44f6c596a58ce92e666191abe3e", "c534ad44175fbc300f4ea6ce648309a042ce739a7919798cd85e216c4a307f6e"],
                        ["f13ada95103c4537305e691e74e9a4a8dd647e711a95e73cb62dc6018cfd87b8", "e13817b44ee14de663bf4bc808341f326949e21a6a75c2570778419bdaf5733d"],
                        ["7754b4fa0e8aced06d4167a2c59cca4cda1869c06ebadfb6488550015a88522c", "30e93e864e669d82224b967c3020b8fa8d1e4e350b6cbcc537a48b57841163a2"],
                        ["948dcadf5990e048aa3874d46abef9d701858f95de8041d2a6828c99e2262519", "e491a42537f6e597d5d28a3224b1bc25df9154efbd2ef1d2cbba2cae5347d57e"],
                        ["7962414450c76c1689c7b48f8202ec37fb224cf5ac0bfa1570328a8a3d7c77ab", "100b610ec4ffb4760d5c1fc133ef6f6b12507a051f04ac5760afa5b29db83437"],
                        ["3514087834964b54b15b160644d915485a16977225b8847bb0dd085137ec47ca", "ef0afbb2056205448e1652c48e8127fc6039e77c15c2378b7e7d15a0de293311"],
                        ["d3cc30ad6b483e4bc79ce2c9dd8bc54993e947eb8df787b442943d3f7b527eaf", "8b378a22d827278d89c5e9be8f9508ae3c2ad46290358630afb34db04eede0a4"],
                        ["1624d84780732860ce1c78fcbfefe08b2b29823db913f6493975ba0ff4847610", "68651cf9b6da903e0914448c6cd9d4ca896878f5282be4c8cc06e2a404078575"],
                        ["733ce80da955a8a26902c95633e62a985192474b5af207da6df7b4fd5fc61cd4", "f5435a2bd2badf7d485a4d8b8db9fcce3e1ef8e0201e4578c54673bc1dc5ea1d"],
                        ["15d9441254945064cf1a1c33bbd3b49f8966c5092171e699ef258dfab81c045c", "d56eb30b69463e7234f5137b73b84177434800bacebfc685fc37bbe9efe4070d"],
                        ["a1d0fcf2ec9de675b612136e5ce70d271c21417c9d2b8aaaac138599d0717940", "edd77f50bcb5a3cab2e90737309667f2641462a54070f3d519212d39c197a629"],
                        ["e22fbe15c0af8ccc5780c0735f84dbe9a790badee8245c06c7ca37331cb36980", "a855babad5cd60c88b430a69f53a1a7a38289154964799be43d06d77d31da06"],
                        ["311091dd9860e8e20ee13473c1155f5f69635e394704eaa74009452246cfa9b3", "66db656f87d1f04fffd1f04788c06830871ec5a64feee685bd80f0b1286d8374"],
                        ["34c1fd04d301be89b31c0442d3e6ac24883928b45a9340781867d4232ec2dbdf", "9414685e97b1b5954bd46f730174136d57f1ceeb487443dc5321857ba73abee"],
                        ["f219ea5d6b54701c1c14de5b557eb42a8d13f3abbcd08affcc2a5e6b049b8d63", "4cb95957e83d40b0f73af4544cccf6b1f4b08d3c07b27fb8d8c2962a400766d1"],
                        ["d7b8740f74a8fbaab1f683db8f45de26543a5490bca627087236912469a0b448", "fa77968128d9c92ee1010f337ad4717eff15db5ed3c049b3411e0315eaa4593b"],
                        ["32d31c222f8f6f0ef86f7c98d3a3335ead5bcd32abdd94289fe4d3091aa824bf", "5f3032f5892156e39ccd3d7915b9e1da2e6dac9e6f26e961118d14b8462e1661"],
                        ["7461f371914ab32671045a155d9831ea8793d77cd59592c4340f86cbc18347b5", "8ec0ba238b96bec0cbdddcae0aa442542eee1ff50c986ea6b39847b3cc092ff6"],
                        ["ee079adb1df1860074356a25aa38206a6d716b2c3e67453d287698bad7b2b2d6", "8dc2412aafe3be5c4c5f37e0ecc5f9f6a446989af04c4e25ebaac479ec1c8c1e"],
                        ["16ec93e447ec83f0467b18302ee620f7e65de331874c9dc72bfd8616ba9da6b5", "5e4631150e62fb40d0e8c2a7ca5804a39d58186a50e497139626778e25b0674d"],
                        ["eaa5f980c245f6f038978290afa70b6bd8855897f98b6aa485b96065d537bd99", "f65f5d3e292c2e0819a528391c994624d784869d7e6ea67fb18041024edc07dc"],
                        ["78c9407544ac132692ee1910a02439958ae04877151342ea96c4b6b35a49f51", "f3e0319169eb9b85d5404795539a5e68fa1fbd583c064d2462b675f194a3ddb4"],
                        ["494f4be219a1a77016dcd838431aea0001cdc8ae7a6fc688726578d9702857a5", "42242a969283a5f339ba7f075e36ba2af925ce30d767ed6e55f4b031880d562c"],
                        ["a598a8030da6d86c6bc7f2f5144ea549d28211ea58faa70ebf4c1e665c1fe9b5", "204b5d6f84822c307e4b4a7140737aec23fc63b65b35f86a10026dbd2d864e6b"],
                        ["c41916365abb2b5d09192f5f2dbeafec208f020f12570a184dbadc3e58595997", "4f14351d0087efa49d245b328984989d5caf9450f34bfc0ed16e96b58fa9913"],
                        ["841d6063a586fa475a724604da03bc5b92a2e0d2e0a36acfe4c73a5514742881", "73867f59c0659e81904f9a1c7543698e62562d6744c169ce7a36de01a8d6154"],
                        ["5e95bb399a6971d376026947f89bde2f282b33810928be4ded112ac4d70e20d5", "39f23f366809085beebfc71181313775a99c9aed7d8ba38b161384c746012865"],
                        ["36e4641a53948fd476c39f8a99fd974e5ec07564b5315d8bf99471bca0ef2f66", "d2424b1b1abe4eb8164227b085c9aa9456ea13493fd563e06fd51cf5694c78fc"],
                        ["336581ea7bfbbb290c191a2f507a41cf5643842170e914faeab27c2c579f726", "ead12168595fe1be99252129b6e56b3391f7ab1410cd1e0ef3dcdcabd2fda224"],
                        ["8ab89816dadfd6b6a1f2634fcf00ec8403781025ed6890c4849742706bd43ede", "6fdcef09f2f6d0a044e654aef624136f503d459c3e89845858a47a9129cdd24e"],
                        ["1e33f1a746c9c5778133344d9299fcaa20b0938e8acff2544bb40284b8c5fb94", "60660257dd11b3aa9c8ed618d24edff2306d320f1d03010e33a7d2057f3b3b6"],
                        ["85b7c1dcb3cec1b7ee7f30ded79dd20a0ed1f4cc18cbcfcfa410361fd8f08f31", "3d98a9cdd026dd43f39048f25a8847f4fcafad1895d7a633c6fed3c35e999511"],
                        ["29df9fbd8d9e46509275f4b125d6d45d7fbe9a3b878a7af872a2800661ac5f51", "b4c4fe99c775a606e2d8862179139ffda61dc861c019e55cd2876eb2a27d84b"],
                        ["a0b1cae06b0a847a3fea6e671aaf8adfdfe58ca2f768105c8082b2e449fce252", "ae434102edde0958ec4b19d917a6a28e6b72da1834aff0e650f049503a296cf2"],
                        ["4e8ceafb9b3e9a136dc7ff67e840295b499dfb3b2133e4ba113f2e4c0e121e5", "cf2174118c8b6d7a4b48f6d534ce5c79422c086a63460502b827ce62a326683c"],
                        ["d24a44e047e19b6f5afb81c7ca2f69080a5076689a010919f42725c2b789a33b", "6fb8d5591b466f8fc63db50f1c0f1c69013f996887b8244d2cdec417afea8fa3"],
                        ["ea01606a7a6c9cdd249fdfcfacb99584001edd28abbab77b5104e98e8e3b35d4", "322af4908c7312b0cfbfe369f7a7b3cdb7d4494bc2823700cfd652188a3ea98d"],
                        ["af8addbf2b661c8a6c6328655eb96651252007d8c5ea31be4ad196de8ce2131f", "6749e67c029b85f52a034eafd096836b2520818680e26ac8f3dfbcdb71749700"],
                        ["e3ae1974566ca06cc516d47e0fb165a674a3dabcfca15e722f0e3450f45889", "2aeabe7e4531510116217f07bf4d07300de97e4874f81f533420a72eeb0bd6a4"],
                        ["591ee355313d99721cf6993ffed1e3e301993ff3ed258802075ea8ced397e246", "b0ea558a113c30bea60fc4775460c7901ff0b053d25ca2bdeee98f1a4be5d196"],
                        ["11396d55fda54c49f19aa97318d8da61fa8584e47b084945077cf03255b52984", "998c74a8cd45ac01289d5833a7beb4744ff536b01b257be4c5767bea93ea57a4"],
                        ["3c5d2a1ba39c5a1790000738c9e0c40b8dcdfd5468754b6405540157e017aa7a", "b2284279995a34e2f9d4de7396fc18b80f9b8b9fdd270f6661f79ca4c81bd257"],
                        ["cc8704b8a60a0defa3a99a7299f2e9c3fbc395afb04ac078425ef8a1793cc030", "bdd46039feed17881d1e0862db347f8cf395b74fc4bcdc4e940b74e3ac1f1b13"],
                        ["c533e4f7ea8555aacd9777ac5cad29b97dd4defccc53ee7ea204119b2889b197", "6f0a256bc5efdf429a2fb6242f1a43a2d9b925bb4a4b3a26bb8e0f45eb596096"],
                        ["c14f8f2ccb27d6f109f6d08d03cc96a69ba8c34eec07bbcf566d48e33da6593", "c359d6923bb398f7fd4473e16fe1c28475b740dd098075e6c0e8649113dc3a38"],
                        ["a6cbc3046bc6a450bac24789fa17115a4c9739ed75f8f21ce441f72e0b90e6ef", "21ae7f4680e889bb130619e2c0f95a360ceb573c70603139862afd617fa9b9f"],
                        ["347d6d9a02c48927ebfb86c1359b1caf130a3c0267d11ce6344b39f99d43cc38", "60ea7f61a353524d1c987f6ecec92f086d565ab687870cb12689ff1e31c74448"],
                        ["da6545d2181db8d983f7dcb375ef5866d47c67b1bf31c8cf855ef7437b72656a", "49b96715ab6878a79e78f07ce5680c5d6673051b4935bd897fea824b77dc208a"],
                        ["c40747cc9d012cb1a13b8148309c6de7ec25d6945d657146b9d5994b8feb1111", "5ca560753be2a12fc6de6caf2cb489565db936156b9514e1bb5e83037e0fa2d4"],
                        ["4e42c8ec82c99798ccf3a610be870e78338c7f713348bd34c8203ef4037f3502", "7571d74ee5e0fb92a7a8b33a07783341a5492144cc54bcc40a94473693606437"],
                        ["3775ab7089bc6af823aba2e1af70b236d251cadb0c86743287522a1b3b0dedea", "be52d107bcfa09d8bcb9736a828cfa7fac8db17bf7a76a2c42ad961409018cf7"],
                        ["cee31cbf7e34ec379d94fb814d3d775ad954595d1314ba8846959e3e82f74e26", "8fd64a14c06b589c26b947ae2bcf6bfa0149ef0be14ed4d80f448a01c43b1c6d"],
                        ["b4f9eaea09b6917619f6ea6a4eb5464efddb58fd45b1ebefcdc1a01d08b47986", "39e5c9925b5a54b07433a4f18c61726f8bb131c012ca542eb24a8ac07200682a"],
                        ["d4263dfc3d2df923a0179a48966d30ce84e2515afc3dccc1b77907792ebcc60e", "62dfaf07a0f78feb30e30d6295853ce189e127760ad6cf7fae164e122a208d54"],
                        ["48457524820fa65a4f8d35eb6930857c0032acc0a4a2de422233eeda897612c4", "25a748ab367979d98733c38a1fa1c2e7dc6cc07db2d60a9ae7a76aaa49bd0f77"],
                        ["dfeeef1881101f2cb11644f3a2afdfc2045e19919152923f367a1767c11cceda", "ecfb7056cf1de042f9420bab396793c0c390bde74b4bbdff16a83ae09a9a7517"],
                        ["6d7ef6b17543f8373c573f44e1f389835d89bcbc6062ced36c82df83b8fae859", "cd450ec335438986dfefa10c57fea9bcc521a0959b2d80bbf74b190dca712d10"],
                        ["e75605d59102a5a2684500d3b991f2e3f3c88b93225547035af25af66e04541f", "f5c54754a8f71ee540b9b48728473e314f729ac5308b06938360990e2bfad125"],
                        ["eb98660f4c4dfaa06a2be453d5020bc99a0c2e60abe388457dd43fefb1ed620c", "6cb9a8876d9cb8520609af3add26cd20a0a7cd8a9411131ce85f44100099223e"],
                        ["13e87b027d8514d35939f2e6892b19922154596941888336dc3563e3b8dba942", "fef5a3c68059a6dec5d624114bf1e91aac2b9da568d6abeb2570d55646b8adf1"],
                        ["ee163026e9fd6fe017c38f06a5be6fc125424b371ce2708e7bf4491691e5764a", "1acb250f255dd61c43d94ccc670d0f58f49ae3fa15b96623e5430da0ad6c62b2"],
                        ["b268f5ef9ad51e4d78de3a750c2dc89b1e626d43505867999932e5db33af3d80", "5f310d4b3c99b9ebb19f77d41c1dee018cf0d34fd4191614003e945a1216e423"],
                        ["ff07f3118a9df035e9fad85eb6c7bfe42b02f01ca99ceea3bf7ffdba93c4750d", "438136d603e858a3a5c440c38eccbaddc1d2942114e2eddd4740d098ced1f0d8"],
                        ["8d8b9855c7c052a34146fd20ffb658bea4b9f69e0d825ebec16e8c3ce2b526a1", "cdb559eedc2d79f926baf44fb84ea4d44bcf50fee51d7ceb30e2e7f463036758"],
                        ["52db0b5384dfbf05bfa9d472d7ae26dfe4b851ceca91b1eba54263180da32b63", "c3b997d050ee5d423ebaf66a6db9f57b3180c902875679de924b69d84a7b375"],
                        ["e62f9490d3d51da6395efd24e80919cc7d0f29c3f3fa48c6fff543becbd43352", "6d89ad7ba4876b0b22c2ca280c682862f342c8591f1daf5170e07bfd9ccafa7d"],
                        ["7f30ea2476b399b4957509c88f77d0191afa2ff5cb7b14fd6d8e7d65aaab1193", "ca5ef7d4b231c94c3b15389a5f6311e9daff7bb67b103e9880ef4bff637acaec"],
                        ["5098ff1e1d9f14fb46a210fada6c903fef0fb7b4a1dd1d9ac60a0361800b7a00", "9731141d81fc8f8084d37c6e7542006b3ee1b40d60dfe5362a5b132fd17ddc0"],
                        ["32b78c7de9ee512a72895be6b9cbefa6e2f3c4ccce445c96b9f2c81e2778ad58", "ee1849f513df71e32efc3896ee28260c73bb80547ae2275ba497237794c8753c"],
                        ["e2cb74fddc8e9fbcd076eef2a7c72b0ce37d50f08269dfc074b581550547a4f7", "d3aa2ed71c9dd2247a62df062736eb0baddea9e36122d2be8641abcb005cc4a4"],
                        ["8438447566d4d7bedadc299496ab357426009a35f235cb141be0d99cd10ae3a8", "c4e1020916980a4da5d01ac5e6ad330734ef0d7906631c4f2390426b2edd791f"],
                        ["4162d488b89402039b584c6fc6c308870587d9c46f660b878ab65c82c711d67e", "67163e903236289f776f22c25fb8a3afc1732f2b84b4e95dbda47ae5a0852649"],
                        ["3fad3fa84caf0f34f0f89bfd2dcf54fc175d767aec3e50684f3ba4a4bf5f683d", "cd1bc7cb6cc407bb2f0ca647c718a730cf71872e7d0d2a53fa20efcdfe61826"],
                        ["674f2600a3007a00568c1a7ce05d0816c1fb84bf1370798f1c69532faeb1a86b", "299d21f9413f33b3edf43b257004580b70db57da0b182259e09eecc69e0d38a5"],
                        ["d32f4da54ade74abb81b815ad1fb3b263d82d6c692714bcff87d29bd5ee9f08f", "f9429e738b8e53b968e99016c059707782e14f4535359d582fc416910b3eea87"],
                        ["30e4e670435385556e593657135845d36fbb6931f72b08cb1ed954f1e3ce3ff6", "462f9bce619898638499350113bbc9b10a878d35da70740dc695a559eb88db7b"],
                        ["be2062003c51cc3004682904330e4dee7f3dcd10b01e580bf1971b04d4cad297", "62188bc49d61e5428573d48a74e1c655b1c61090905682a0d5558ed72dccb9bc"],
                        ["93144423ace3451ed29e0fb9ac2af211cb6e84a601df5993c419859fff5df04a", "7c10dfb164c3425f5c71a3f9d7992038f1065224f72bb9d1d902a6d13037b47c"],
                        ["b015f8044f5fcbdcf21ca26d6c34fb8197829205c7b7d2a7cb66418c157b112c", "ab8c1e086d04e813744a655b2df8d5f83b3cdc6faa3088c1d3aea1454e3a1d5f"],
                        ["d5e9e1da649d97d89e4868117a465a3a4f8a18de57a140d36b3f2af341a21b52", "4cb04437f391ed73111a13cc1d4dd0db1693465c2240480d8955e8592f27447a"],
                        ["d3ae41047dd7ca065dbf8ed77b992439983005cd72e16d6f996a5316d36966bb", "bd1aeb21ad22ebb22a10f0303417c6d964f8cdd7df0aca614b10dc14d125ac46"],
                        ["463e2763d885f958fc66cdd22800f0a487197d0a82e377b49f80af87c897b065", "bfefacdb0e5d0fd7df3a311a94de062b26b80c61fbc97508b79992671ef7ca7f"],
                        ["7985fdfd127c0567c6f53ec1bb63ec3158e597c40bfe747c83cddfc910641917", "603c12daf3d9862ef2b25fe1de289aed24ed291e0ec6708703a5bd567f32ed03"],
                        ["74a1ad6b5f76e39db2dd249410eac7f99e74c59cb83d2d0ed5ff1543da7703e9", "cc6157ef18c9c63cd6193d83631bbea0093e0968942e8c33d5737fd790e0db08"],
                        ["30682a50703375f602d416664ba19b7fc9bab42c72747463a71d0896b22f6da3", "553e04f6b018b4fa6c8f39e7f311d3176290d0e0f19ca73f17714d9977a22ff8"],
                        ["9e2158f0d7c0d5f26c3791efefa79597654e7a2b2464f52b1ee6c1347769ef57", "712fcdd1b9053f09003a3481fa7762e9ffd7c8ef35a38509e2fbf2629008373"],
                        ["176e26989a43c9cfeba4029c202538c28172e566e3c4fce7322857f3be327d66", "ed8cc9d04b29eb877d270b4878dc43c19aefd31f4eee09ee7b47834c1fa4b1c3"],
                        ["75d46efea3771e6e68abb89a13ad747ecf1892393dfc4f1b7004788c50374da8", "9852390a99507679fd0b86fd2b39a868d7efc22151346e1a3ca4726586a6bed8"],
                        ["809a20c67d64900ffb698c4c825f6d5f2310fb0451c869345b7319f645605721", "9e994980d9917e22b76b061927fa04143d096ccc54963e6a5ebfa5f3f8e286c1"],
                        ["1b38903a43f7f114ed4500b4eac7083fdefece1cf29c63528d563446f972c180", "4036edc931a60ae889353f77fd53de4a2708b26b6f5da72ad3394119daf408f9"]
                    ]
                }
            }]
        })
    }, {
        "../elliptic": 212,
        assert: 41,
        "bn.js": 210,
        "hash.js": 226
    }],
    219: [function(e, t) {
        function r(e) {
            return this instanceof r ? ("string" == typeof e && (n(s.curves.hasOwnProperty(e), "Unknown curve " + e), e = s.curves[e]), e instanceof s.curves.PresetCurve && (e = {
                curve: e
            }), this.curve = e.curve.curve, this.n = this.curve.n, this.nh = this.n.shrn(1), this.g = this.curve.g, this.g = e.curve.g, this.g.precompute(e.curve.n.bitLength() + 1), void(this.hash = e.hash || e.curve.hash)) : new r(e)
        }
        var n = e("assert"),
            i = e("bn.js"),
            s = e("../../elliptic"),
            o = (s.utils, e("./key")),
            a = e("./signature");
        t.exports = r, r.prototype.keyPair = function(e, t) {
            return new o(this, e, t)
        }, r.prototype.genKeyPair = function(e) {
            e || (e = {});
            for (var t = new s.hmacDRBG({
                    hash: this.hash,
                    pers: e.pers,
                    entropy: e.entropy || s.rand(this.hash.hmacStrength),
                    nonce: this.n.toArray()
                }), r = this.n.byteLength(), n = this.n.sub(new i(2));;) {
                var o = new i(t.generate(r));
                if (!(o.cmp(n) > 0)) return o.iaddn(1), this.keyPair(o)
            }
        }, r.prototype._truncateToN = function(e, t) {
            var r = 8 * e.byteLength() - this.n.bitLength();
            return r > 0 && (e = e.shrn(r)), !t && e.cmp(this.n) >= 0 ? e.sub(this.n) : e
        }, r.prototype.sign = function(e, t, r) {
            t = this.keyPair(t, "hex"), e = this._truncateToN(new i(e, 16)), r || (r = {});
            for (var n = this.n.byteLength(), o = t.getPrivate().toArray(), f = o.length; 21 > f; f++) o.unshift(0);
            for (var c = e.toArray(), f = c.length; n > f; f++) c.unshift(0);
            for (var u = new s.hmacDRBG({
                    hash: this.hash,
                    entropy: o,
                    nonce: c
                }), d = this.n.sub(new i(1));;) {
                var h = new i(u.generate(this.n.byteLength()));
                if (h = this._truncateToN(h, !0), !(h.cmpn(1) <= 0 || h.cmp(d) >= 0)) {
                    var p = this.g.mul(h);
                    if (!p.isInfinity()) {
                        var l = p.getX().mod(this.n);
                        if (0 !== l.cmpn(0)) {
                            var b = h.invm(this.n).mul(l.mul(t.getPrivate()).iadd(e)).mod(this.n);
                            if (0 !== b.cmpn(0)) return r.canonical && b.cmp(this.nh) > 0 && (b = this.n.sub(b)), new a(l, b)
                        }
                    }
                }
            }
        }, r.prototype.verify = function(e, t, r) {
            e = this._truncateToN(new i(e, 16)), r = this.keyPair(r, "hex"), t = new a(t, "hex");
            var n = t.r,
                s = t.s;
            if (n.cmpn(1) < 0 || n.cmp(this.n) >= 0) return !1;
            if (s.cmpn(1) < 0 || s.cmp(this.n) >= 0) return !1;
            var o = s.invm(this.n),
                f = o.mul(e).mod(this.n),
                c = o.mul(n).mod(this.n),
                u = this.g.mulAdd(f, r.getPublic(), c);
            return u.isInfinity() ? !1 : 0 === u.getX().mod(this.n).cmp(n)
        }
    }, {
        "../../elliptic": 212,
        "./key": 220,
        "./signature": 221,
        assert: 41,
        "bn.js": 210
    }],
    220: [function(e, t) {
        function r(e, t, n) {
            return t instanceof r ? t : n instanceof r ? n : (t || (t = n, n = null), null !== t && "object" == typeof t && (t.x ? (n = t, t = null) : (t.priv || t.pub) && (n = t.pub, t = t.priv)), this.ec = e, this.priv = null, this.pub = null, void(this._importPublicHex(t, n) || ("hex" === n && (n = null), t && this._importPrivate(t), n && this._importPublic(n))))
        }
        var n = (e("assert"), e("bn.js")),
            i = e("../../elliptic"),
            s = i.utils;
        t.exports = r, r.prototype.validate = function() {
            var e = this.getPublic();
            return e.isInfinity() ? {
                result: !1,
                reason: "Invalid public key"
            } : e.validate() ? e.mul(this.ec.curve.n).isInfinity() ? {
                result: !0,
                reason: null
            } : {
                result: !1,
                reason: "Public key * N != O"
            } : {
                result: !1,
                reason: "Public key is not a point"
            }
        }, r.prototype.getPublic = function(e, t) {
            if (this.pub || (this.pub = this.ec.g.mul(this.priv)), "string" == typeof e && (t = e, e = null), !t) return this.pub;
            for (var r = this.ec.curve.p.byteLength(), n = this.pub.getX().toArray(), i = n.length; r > i; i++) n.unshift(0);
            if (e) var o = [this.pub.getY().isEven() ? 2 : 3].concat(n);
            else {
                for (var a = this.pub.getY().toArray(), i = a.length; r > i; i++) a.unshift(0);
                var o = [4].concat(n, a)
            }
            return s.encode(o, t)
        }, r.prototype.getPrivate = function(e) {
            return "hex" === e ? this.priv.toString(16, 2) : this.priv
        }, r.prototype._importPrivate = function(e) {
            this.priv = new n(e, 16), this.priv = this.priv.mod(this.ec.curve.n)
        }, r.prototype._importPublic = function(e) {
            this.pub = this.ec.curve.point(e.x, e.y)
        }, r.prototype._importPublicHex = function(e, t) {
            e = s.toArray(e, t);
            var r = this.ec.curve.p.byteLength();
            if (4 === e[0] && e.length - 1 === 2 * r) this.pub = this.ec.curve.point(e.slice(1, 1 + r), e.slice(1 + r, 1 + 2 * r));
            else {
                if (2 !== e[0] && 3 !== e[0] || e.length - 1 !== r) return !1;
                this.pub = this.ec.curve.pointFromX(3 === e[0], e.slice(1, 1 + r))
            }
            return !0
        }, r.prototype.derive = function(e) {
            return e.mul(this.priv).getX()
        }, r.prototype.sign = function(e) {
            return this.ec.sign(e, this)
        }, r.prototype.verify = function(e, t) {
            return this.ec.verify(e, t, this)
        }, r.prototype.inspect = function() {
            return "<Key priv: " + (this.priv && this.priv.toString(16, 2)) + " pub: " + (this.pub && this.pub.inspect()) + " >"
        }
    }, {
        "../../elliptic": 212,
        assert: 41,
        "bn.js": 210
    }],
    221: [function(e, t) {
        function r(e, t) {
            return e instanceof r ? e : void(this._importDER(e, t) || (n(e && t, "Signature without r or s"), this.r = new i(e, 16), this.s = new i(t, 16)))
        }
        var n = e("assert"),
            i = e("bn.js"),
            s = e("../../elliptic"),
            o = s.utils;
        t.exports = r, r.prototype._importDER = function(e, t) {
            if (e = o.toArray(e, t), e.length < 6 || 48 !== e[0] || 2 !== e[2]) return !1;
            var r = e[1];
            if (1 + r > e.length) return !1;
            var n = e[3];
            if (n >= 128) return !1;
            if (4 + n + 2 >= e.length) return !1;
            if (2 !== e[4 + n]) return !1;
            var s = e[5 + n];
            return s >= 128 ? !1 : 4 + n + 2 + s > e.length ? !1 : (this.r = new i(e.slice(4, 4 + n)), this.s = new i(e.slice(4 + n + 2, 4 + n + 2 + s)), !0)
        }, r.prototype.toDER = function(e) {
            var t = this.r.toArray(),
                r = this.s.toArray();
            128 & t[0] && (t = [0].concat(t)), 128 & r[0] && (r = [0].concat(r));
            var n = t.length + r.length + 4,
                i = [48, n, 2, t.length];
            return i = i.concat(t, [2, r.length], r), o.encode(i, e)
        }
    }, {
        "../../elliptic": 212,
        assert: 41,
        "bn.js": 210
    }],
    222: [function(e, t) {
        function r(e) {
            if (!(this instanceof r)) return new r(e);
            this.hash = e.hash, this.predResist = !!e.predResist, this.outLen = this.hash.outSize, this.minEntropy = e.minEntropy || this.hash.hmacStrength, this.reseed = null, this.reseedInterval = null, this.K = null, this.V = null;
            var t = o.toArray(e.entropy, e.entropyEnc),
                i = o.toArray(e.nonce, e.nonceEnc),
                s = o.toArray(e.pers, e.persEnc);
            n(t.length >= this.minEntropy / 8, "Not enough entropy. Minimum is: " + this.minEntropy + " bits"), this._init(t, i, s)
        }
        var n = e("assert"),
            i = e("hash.js"),
            s = e("../elliptic"),
            o = s.utils;
        t.exports = r, r.prototype._init = function(e, t, r) {
            var n = e.concat(t).concat(r);
            this.K = new Array(this.outLen / 8), this.V = new Array(this.outLen / 8);
            for (var i = 0; i < this.V.length; i++) this.K[i] = 0, this.V[i] = 1;
            this._update(n), this.reseed = 1, this.reseedInterval = 281474976710656
        }, r.prototype._hmac = function() {
            return new i.hmac(this.hash, this.K)
        }, r.prototype._update = function(e) {
            var t = this._hmac().update(this.V).update([0]);
            e && (t = t.update(e)), this.K = t.digest(), this.V = this._hmac().update(this.V).digest(), e && (this.K = this._hmac().update(this.V).update([1]).update(e).digest(), this.V = this._hmac().update(this.V).digest())
        }, r.prototype.reseed = function(e, t, r, i) {
            "string" != typeof t && (i = r, r = t, t = null), e = o.toBuffer(e, t), r = o.toBuffer(r, i), n(e.length >= this.minEntropy / 8, "Not enough entropy. Minimum is: " + this.minEntropy + " bits"), this._update(e.concat(r || [])), this.reseed = 1
        }, r.prototype.generate = function(e, t, r, n) {
            if (this.reseed > this.reseedInterval) throw new Error("Reseed is required");
            "string" != typeof t && (n = r, r = t, t = null), r && (r = o.toArray(r, n), this._update(r));
            for (var i = []; i.length < e;) this.V = this._hmac().update(this.V).digest(), i = i.concat(this.V);
            var s = i.slice(0, e);
            return this._update(r), this.reseed++, o.encode(s, t)
        }
    }, {
        "../elliptic": 212,
        assert: 41,
        "hash.js": 226
    }],
    223: [function(e, t, r) {
        function n(e, t) {
            if (Array.isArray(e)) return e.slice();
            if (!e) return [];
            var r = [];
            if ("string" == typeof e)
                if (t) {
                    if ("hex" === t) {
                        e = e.replace(/[^a-z0-9]+/gi, ""), e.length % 2 !== 0 && (e = "0" + e);
                        for (var n = 0; n < e.length; n += 2) r.push(parseInt(e[n] + e[n + 1], 16))
                    }
                } else
                    for (var n = 0; n < e.length; n++) {
                        var i = e.charCodeAt(n),
                            s = i >> 8,
                            o = 255 & i;
                        s ? r.push(s, o) : r.push(o)
                    } else
                        for (var n = 0; n < e.length; n++) r[n] = 0 | e[n];
            return r
        }

        function i(e) {
            for (var t = "", r = 0; r < e.length; r++) t += s(e[r].toString(16));
            return t
        }

        function s(e) {
            return 1 === e.length ? "0" + e : e
        }

        function o(e, t) {
            for (var r = [], n = 1 << t + 1, i = e.clone(); i.cmpn(1) >= 0;) {
                var s;
                if (i.isOdd()) {
                    var o = i.andln(n - 1);
                    s = o > (n >> 1) - 1 ? (n >> 1) - o : o, i.isubn(s)
                } else s = 0;
                r.push(s);
                for (var a = 0 !== i.cmpn(0) && 0 === i.andln(n - 1) ? t + 1 : 1, f = 1; a > f; f++) r.push(0);
                i.ishrn(a)
            }
            return r
        }

        function a(e, t) {
            var r = [
                [],
                []
            ];
            e = e.clone(), t = t.clone();
            for (var n = 0, i = 0; e.cmpn(-n) > 0 || t.cmpn(-i) > 0;) {
                var s = e.andln(3) + n & 3,
                    o = t.andln(3) + i & 3;
                3 === s && (s = -1), 3 === o && (o = -1);
                var a;
                if (0 === (1 & s)) a = 0;
                else {
                    var f = e.andln(7) + n & 7;
                    a = 3 !== f && 5 !== f || 2 !== o ? s : -s
                }
                r[0].push(a);
                var c;
                if (0 === (1 & o)) c = 0;
                else {
                    var f = t.andln(7) + i & 7;
                    c = 3 !== f && 5 !== f || 2 !== s ? o : -o
                }
                r[1].push(c), 2 * n === a + 1 && (n = 1 - n), 2 * i === c + 1 && (i = 1 - i), e.ishrn(1), t.ishrn(1)
            }
            return r
        }
        var f = (e("assert"), e("bn.js"), r);
        f.toArray = n, f.toHex = i, f.encode = function(e, t) {
            return "hex" === t ? i(e) : e
        }, f.zero2 = s, f.getNAF = o, f.getJSF = a
    }, {
        assert: 41,
        "bn.js": 210
    }],
    224: [function(e, t) {
        function r() {}
        var n;
        if (t.exports = function(e) {
                return n || (n = new r), n.generate(e)
            }, r.prototype.generate = function(e) {
                return this._rand(e)
            }, "object" == typeof window) r.prototype._rand = window.crypto && window.crypto.getRandomValues ? function(e) {
            var t = new Uint8Array(e);
            return window.crypto.getRandomValues(t), t
        } : window.msCrypto && window.msCrypto.getRandomValues ? function(e) {
            var t = new Uint8Array(e);
            return window.msCrypto.getRandomValues(t), t
        } : function() {
            throw new Error("Not implemented yet")
        };
        else {
            var i;
            r.prototype._rand = function(t) {
                return i || (i = e("crypto")), i.randomBytes(t)
            }
        }
    }, {}],
    225: [function(e, t) {
        t.exports = {
            name: "elliptic",
            version: "0.16.0",
            description: "EC cryptography",
            main: "lib/elliptic.js",
            scripts: {
                test: "mocha --reporter=spec test/*-test.js"
            },
            repository: {
                type: "git",
                url: "git@github.com:indutny/elliptic"
            },
            keywords: ["EC", "Elliptic", "curve", "Cryptography"],
            author: {
                name: "Fedor Indutny",
                email: "fedor@indutny.com"
            },
            license: "MIT",
            bugs: {
                url: "https://github.com/indutny/elliptic/issues"
            },
            homepage: "https://github.com/indutny/elliptic",
            devDependencies: {
                browserify: "^3.44.2",
                mocha: "^1.18.2",
                "uglify-js": "^2.4.13"
            },
            dependencies: {
                "bn.js": "^0.16.0",
                brorand: "^1.0.1",
                "hash.js": "^0.3.2",
                inherits: "^2.0.1"
            },
            readme: "# Elliptic [![Build Status](https://secure.travis-ci.org/indutny/elliptic.png)](http://travis-ci.org/indutny/elliptic)\n\nFast elliptic-curve cryptography in a plain javascript implementation.\n\nNOTE: Please take a look at http://safecurves.cr.yp.to/ before choosing a curve\nfor your cryptography operations.\n\n## Incentive\n\nECC is much slower than regular RSA cryptography, the JS implementations are\neven more slower.\n\n## Benchmarks\n\n```bash\n$ node benchmarks/index.js\nBenchmarking: sign\nelliptic#sign x 262 ops/sec ±0.51% (177 runs sampled)\neccjs#sign x 55.91 ops/sec ±0.90% (144 runs sampled)\n------------------------\nFastest is elliptic#sign\n========================\nBenchmarking: verify\nelliptic#verify x 113 ops/sec ±0.50% (166 runs sampled)\neccjs#verify x 48.56 ops/sec ±0.36% (125 runs sampled)\n------------------------\nFastest is elliptic#verify\n========================\nBenchmarking: gen\nelliptic#gen x 294 ops/sec ±0.43% (176 runs sampled)\neccjs#gen x 62.25 ops/sec ±0.63% (129 runs sampled)\n------------------------\nFastest is elliptic#gen\n========================\nBenchmarking: ecdh\nelliptic#ecdh x 136 ops/sec ±0.85% (156 runs sampled)\n------------------------\nFastest is elliptic#ecdh\n========================\n```\n\n## API\n\n### ECDSA\n\n```javascript\nvar EC = required('elliptic').ec;\n\n// Create and initialize EC context\n// (better do it once and reuse it)\nvar ec = new EC('secp256k1');\n\n// Generate keys\nvar key = ec.genKeyPair();\n\n// Sign message (must be an array, or it'll be treated as a hex sequence)\nvar msg = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];\nvar signature = key.sign(msg);\n\n// Export DER encoded signature in Array\nvar derSign = signature.toDER();\n\n// Verify signature\nconsole.log(key.verify(msg, derSign));\n```\n\n### ECDH\n\n```javascript\n// Generate keys\nvar key1 = ec.genKeyPair();\nvar key2 = ec.genKeyPair();\n\nvar shared1 = key1.derive(key2.getPublic());\nvar shared2 = key2.derive(key1.getPublic());\n\nconsole.log('Both shared secrets are BN instances');\nconsole.log(shared1.toString(16));\nconsole.log(shared2.toString(16));\n```\n\nNOTE: `.derive()` returns a [BN][1] instance.\n\n## Supported curves\n\nElliptic.js support following curve types:\n\n* Short Weierstrass\n* Montgomery\n* Edwards\n* Twisted Edwards\n\nFollowing curve 'presets' are embedded into the library:\n\n* `secp256k1`\n* `p192`\n* `p224`\n* `p256`\n* `curve25519`\n* `ed25519`\n\nNOTE: That `curve25519` could not be used for ECDSA, use `ed25519` instead.\n\n### Implementation details\n\nECDSA is using deterministic `k` value generation as per [RFC6979][0]. Most of\nthe curve operations are performed on non-affine coordinates (either projective\nor extended), various windowing techniques are used for different cases.\n\nAll operations are performed in reduction context using [bn.js][1], hashing is\nprovided by [hash.js][2]\n\n#### LICENSE\n\nThis software is licensed under the MIT License.\n\nCopyright Fedor Indutny, 2014.\n\nPermission is hereby granted, free of charge, to any person obtaining a\ncopy of this software and associated documentation files (the\n\"Software\"), to deal in the Software without restriction, including\nwithout limitation the rights to use, copy, modify, merge, publish,\ndistribute, sublicense, and/or sell copies of the Software, and to permit\npersons to whom the Software is furnished to do so, subject to the\nfollowing conditions:\n\nThe above copyright notice and this permission notice shall be included\nin all copies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS\nOR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF\nMERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN\nNO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,\nDAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR\nOTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE\nUSE OR OTHER DEALINGS IN THE SOFTWARE.\n\n[0]: http://tools.ietf.org/html/rfc6979\n[1]: https://github.com/indutny/bn.js\n[2]: https://github.com/indutny/hash.js\n",
            readmeFilename: "README.md",
            _id: "elliptic@0.16.0",
            _shasum: "9bc84e75ccd97e3e452c97371726c535314d1a57",
            _from: "https://registry.npmjs.org/elliptic/-/elliptic-0.16.0.tgz",
            _resolved: "https://registry.npmjs.org/elliptic/-/elliptic-0.16.0.tgz"
        }
    }, {}],
    226: [function(e, t, r) {
        var n = r;
        n.utils = e("./hash/utils"), n.common = e("./hash/common"), n.sha = e("./hash/sha"), n.ripemd = e("./hash/ripemd"), n.hmac = e("./hash/hmac"), n.sha1 = n.sha.sha1, n.sha256 = n.sha.sha256, n.sha224 = n.sha.sha224, n.ripemd160 = n.ripemd.ripemd160
    }, {
        "./hash/common": 227,
        "./hash/hmac": 228,
        "./hash/ripemd": 229,
        "./hash/sha": 230,
        "./hash/utils": 231
    }],
    227: [function(e, t, r) {
        function n() {
            this.pending = null, this.pendingTotal = 0, this.blockSize = this.constructor.blockSize, this.outSize = this.constructor.outSize, this.hmacStrength = this.constructor.hmacStrength, this.endian = "big", this._delta8 = this.blockSize / 8, this._delta32 = this.blockSize / 32
        }
        var i = e("../hash"),
            s = i.utils,
            o = s.assert;
        r.BlockHash = n, n.prototype.update = function(e, t) {
            if (e = s.toArray(e, t), this.pending = this.pending ? this.pending.concat(e) : e, this.pendingTotal += e.length, this.pending.length >= this._delta8) {
                e = this.pending;
                var r = e.length % this._delta8;
                this.pending = e.slice(e.length - r, e.length), 0 === this.pending.length && (this.pending = null), e = s.join32(e, 0, e.length - r, this.endian);
                for (var n = 0; n < e.length; n += this._delta32) this._update(e, n, n + this._delta32)
            }
            return this
        }, n.prototype.digest = function(e) {
            return this.update(this._pad()), o(null === this.pending), this._digest(e)
        }, n.prototype._pad = function() {
            var e = this.pendingTotal,
                t = this._delta8,
                r = t - (e + 8) % t,
                n = new Array(r + 8);
            n[0] = 128;
            for (var i = 1; r > i; i++) n[i] = 0;
            return e <<= 3, "big" === this.endian ? (n[i++] = 0, n[i++] = 0, n[i++] = 0, n[i++] = 0, n[i++] = e >>> 24 & 255, n[i++] = e >>> 16 & 255, n[i++] = e >>> 8 & 255, n[i++] = 255 & e) : (n[i++] = 255 & e, n[i++] = e >>> 8 & 255, n[i++] = e >>> 16 & 255, n[i++] = e >>> 24 & 255, n[i++] = 0, n[i++] = 0, n[i++] = 0, n[i++] = 0), n
        }
    }, {
        "../hash": 226
    }],
    228: [function(e, t, r) {
        arguments[4][85][0].apply(r, arguments)
    }, {
        "../hash": 226,
        "/home/maraoz/git/bitcore/node_modules/bitcore-build/node_modules/browserify/node_modules/crypto-browserify/node_modules/browserify-sign/node_modules/elliptic/node_modules/hash.js/lib/hash/hmac.js": 85
    }],
    229: [function(e, t, r) {
        function n() {
            return this instanceof n ? (p.call(this), this.h = [1732584193, 4023233417, 2562383102, 271733878, 3285377520], void(this.endian = "little")) : new n
        }

        function i(e, t, r, n) {
            return 15 >= e ? t ^ r ^ n : 31 >= e ? t & r | ~t & n : 47 >= e ? (t | ~r) ^ n : 63 >= e ? t & n | r & ~n : t ^ (r | ~n)
        }

        function s(e) {
            return 15 >= e ? 0 : 31 >= e ? 1518500249 : 47 >= e ? 1859775393 : 63 >= e ? 2400959708 : 2840853838
        }

        function o(e) {
            return 15 >= e ? 1352829926 : 31 >= e ? 1548603684 : 47 >= e ? 1836072691 : 63 >= e ? 2053994217 : 0
        }
        var a = e("../hash"),
            f = a.utils,
            c = f.rotl32,
            u = f.sum32,
            d = f.sum32_3,
            h = f.sum32_4,
            p = a.common.BlockHash;
        f.inherits(n, p), r.ripemd160 = n, n.blockSize = 512, n.outSize = 160, n.hmacStrength = 192, n.prototype._update = function(e, t) {
            for (var r = this.h[0], n = this.h[1], a = this.h[2], f = this.h[3], p = this.h[4], m = r, v = n, _ = a, w = f, S = p, k = 0; 80 > k; k++) {
                var I = u(c(h(r, i(k, n, a, f), e[l[k] + t], s(k)), g[k]), p);
                r = p, p = f, f = c(a, 10), a = n, n = I, I = u(c(h(m, i(79 - k, v, _, w), e[b[k] + t], o(k)), y[k]), S), m = S, S = w, w = c(_, 10), _ = v, v = I
            }
            I = d(this.h[1], a, w), this.h[1] = d(this.h[2], f, S), this.h[2] = d(this.h[3], p, m), this.h[3] = d(this.h[4], r, v), this.h[4] = d(this.h[0], n, _), this.h[0] = I
        }, n.prototype._digest = function(e) {
            return "hex" === e ? f.toHex32(this.h, "little") : f.split32(this.h, "little")
        };
        var l = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13],
            b = [5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11],
            g = [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6],
            y = [8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11]
    }, {
        "../hash": 226
    }],
    230: [function(e, t, r) {
        function n() {
            return this instanceof n ? (S.call(this), this.h = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225], this.k = k, void(this.W = new Array(64))) : new n
        }

        function i() {
            return this instanceof i ? (n.call(this), void(this.h = [3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025, 1694076839, 3204075428])) : new i
        }

        function s() {
            return this instanceof s ? (S.call(this), this.h = [1732584193, 4023233417, 2562383102, 271733878, 3285377520], void(this.W = new Array(80))) : new s
        }

        function o(e, t, r) {
            return e & t ^ ~e & r
        }

        function a(e, t, r) {
            return e & t ^ e & r ^ t & r
        }

        function f(e, t, r) {
            return e ^ t ^ r
        }

        function c(e) {
            return y(e, 2) ^ y(e, 13) ^ y(e, 22)
        }

        function u(e) {
            return y(e, 6) ^ y(e, 11) ^ y(e, 25)
        }

        function d(e) {
            return y(e, 7) ^ y(e, 18) ^ e >>> 3
        }

        function h(e) {
            return y(e, 17) ^ y(e, 19) ^ e >>> 10
        }

        function p(e, t, r, n) {
            return 0 === e ? o(t, r, n) : 1 === e || 3 === e ? f(t, r, n) : 2 === e ? a(t, r, n) : void 0
        }
        var l = e("../hash"),
            b = l.utils,
            g = b.assert,
            y = b.rotr32,
            m = b.rotl32,
            v = b.sum32,
            _ = b.sum32_4,
            w = b.sum32_5,
            S = l.common.BlockHash,
            k = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298],
            I = [1518500249, 1859775393, 2400959708, 3395469782];
        b.inherits(n, S), r.sha256 = n, n.blockSize = 512, n.outSize = 256, n.hmacStrength = 192, n.prototype._update = function(e, t) {
            for (var r = this.W, n = 0; 16 > n; n++) r[n] = e[t + n];
            for (; n < r.length; n++) r[n] = _(h(r[n - 2]), r[n - 7], d(r[n - 15]), r[n - 16]);
            var i = this.h[0],
                s = this.h[1],
                f = this.h[2],
                p = this.h[3],
                l = this.h[4],
                b = this.h[5],
                y = this.h[6],
                m = this.h[7];
            g(this.k.length === r.length);
            for (var n = 0; n < r.length; n++) {
                var S = w(m, u(l), o(l, b, y), this.k[n], r[n]),
                    k = v(c(i), a(i, s, f));
                m = y, y = b, b = l, l = v(p, S), p = f, f = s, s = i, i = v(S, k)
            }
            this.h[0] = v(this.h[0], i), this.h[1] = v(this.h[1], s), this.h[2] = v(this.h[2], f), this.h[3] = v(this.h[3], p), this.h[4] = v(this.h[4], l), this.h[5] = v(this.h[5], b), this.h[6] = v(this.h[6], y), this.h[7] = v(this.h[7], m)
        }, n.prototype._digest = function(e) {
            return "hex" === e ? b.toHex32(this.h, "big") : b.split32(this.h, "big")
        }, b.inherits(i, n), r.sha224 = i, i.blockSize = 512, i.outSize = 224, i.hmacStrength = 192, i.prototype._digest = function(e) {
            return "hex" === e ? b.toHex32(this.h.slice(0, 7), "big") : b.split32(this.h.slice(0, 7), "big")
        }, b.inherits(s, S), r.sha1 = s, s.blockSize = 512, s.outSize = 160, s.hmacStrength = 80, s.prototype._update = function(e, t) {
            for (var r = this.W, n = 0; 16 > n; n++) r[n] = e[t + n];
            for (; n < r.length; n++) r[n] = m(r[n - 3] ^ r[n - 8] ^ r[n - 14] ^ r[n - 16], 1);
            for (var i = this.h[0], s = this.h[1], o = this.h[2], a = this.h[3], f = this.h[4], n = 0; n < r.length; n++) {
                var c = ~~(n / 20),
                    u = w(m(i, 5), p(c, s, o, a), f, r[n], I[c]);
                f = a, a = o, o = m(s, 30), s = i, i = u
            }
            this.h[0] = v(this.h[0], i), this.h[1] = v(this.h[1], s), this.h[2] = v(this.h[2], o), this.h[3] = v(this.h[3], a), this.h[4] = v(this.h[4], f)
        }, s.prototype._digest = function(e) {
            return "hex" === e ? b.toHex32(this.h, "big") : b.split32(this.h, "big")
        }
    }, {
        "../hash": 226
    }],
    231: [function(e, t, r) {
        function n(e, t) {
            if (Array.isArray(e)) return e.slice();
            if (!e) return [];
            var r = [];
            if ("string" == typeof e)
                if (t) {
                    if ("hex" === t) {
                        e = e.replace(/[^a-z0-9]+/gi, ""), e.length % 2 != 0 && (e = "0" + e);
                        for (var n = 0; n < e.length; n += 2) r.push(parseInt(e[n] + e[n + 1], 16))
                    }
                } else
                    for (var n = 0; n < e.length; n++) {
                        var i = e.charCodeAt(n),
                            s = i >> 8,
                            o = 255 & i;
                        s ? r.push(s, o) : r.push(o)
                    } else
                        for (var n = 0; n < e.length; n++) r[n] = 0 | e[n];
            return r
        }

        function i(e) {
            for (var t = "", r = 0; r < e.length; r++) t += o(e[r].toString(16));
            return t
        }

        function s(e, t) {
            for (var r = "", n = 0; n < e.length; n++) {
                var i = e[n];
                "little" === t && (i = i >>> 24 | i >>> 8 & 65280 | i << 8 & 16711680 | (255 & i) << 24, 0 > i && (i += 4294967296)), r += a(i.toString(16))
            }
            return r
        }

        function o(e) {
            return 1 === e.length ? "0" + e : e
        }

        function a(e) {
            return 7 === e.length ? "0" + e : 6 === e.length ? "00" + e : 5 === e.length ? "000" + e : 4 === e.length ? "0000" + e : 3 === e.length ? "00000" + e : 2 === e.length ? "000000" + e : 1 === e.length ? "0000000" + e : e
        }

        function f(e, t, r, n) {
            var i = r - t;
            g(i % 4 === 0);
            for (var s = new Array(i / 4), o = 0, a = t; o < s.length; o++, a += 4) {
                var f;
                f = "big" === n ? e[a] << 24 | e[a + 1] << 16 | e[a + 2] << 8 | e[a + 3] : e[a + 3] << 24 | e[a + 2] << 16 | e[a + 1] << 8 | e[a], 0 > f && (f += 4294967296), s[o] = f
            }
            return s
        }

        function c(e, t) {
            for (var r = new Array(4 * e.length), n = 0, i = 0; n < e.length; n++, i += 4) {
                var s = e[n];
                "big" === t ? (r[i] = s >>> 24, r[i + 1] = s >>> 16 & 255, r[i + 2] = s >>> 8 & 255, r[i + 3] = 255 & s) : (r[i + 3] = s >>> 24, r[i + 2] = s >>> 16 & 255, r[i + 1] = s >>> 8 & 255, r[i] = 255 & s)
            }
            return r
        }

        function u(e, t) {
            return e >>> t | e << 32 - t
        }

        function d(e, t) {
            return e << t | e >>> 32 - t
        }

        function h(e, t) {
            var r = e + t & 4294967295;
            return 0 > r && (r += 4294967296), r
        }

        function p(e, t, r) {
            var n = e + t + r & 4294967295;
            return 0 > n && (n += 4294967296), n
        }

        function l(e, t, r, n) {
            var i = e + t + r + n & 4294967295;
            return 0 > i && (i += 4294967296), i
        }

        function b(e, t, r, n, i) {
            var s = e + t + r + n + i & 4294967295;
            return 0 > s && (s += 4294967296), s
        }

        function g(e, t) {
            if (!e) throw new Error(t || "Assertion failed")
        }
        var y = r,
            m = e("inherits");
        y.toArray = n, y.toHex = i, y.toHex32 = s, y.zero2 = o, y.zero8 = a, y.join32 = f, y.split32 = c, y.rotr32 = u, y.rotl32 = d, y.sum32 = h, y.sum32_3 = p, y.sum32_4 = l, y.sum32_5 = b, y.assert = g, y.inherits = m
    }, {
        inherits: 232
    }],
    232: [function(e, t) {
        t.exports = "function" == typeof Object.create ? function(e, t) {
            e.super_ = t, e.prototype = Object.create(t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            })
        } : function(e, t) {
            e.super_ = t;
            var r = function() {};
            r.prototype = t.prototype, e.prototype = new r, e.prototype.constructor = e
        }
    }, {}],
    233: [function(e, t, r) {
        (function(e) {
            (function() {
                function n(e, t, r) {
                    for (var n = (r || 0) - 1, i = e ? e.length : 0; ++n < i;)
                        if (e[n] === t) return n;
                    return -1
                }

                function i(e, t) {
                    var r = typeof t;
                    if (e = e.cache, "boolean" == r || null == t) return e[t] ? 0 : -1;
                    "number" != r && "string" != r && (r = "object");
                    var i = "number" == r ? t : _ + t;
                    return e = (e = e[r]) && e[i], "object" == r ? e && n(e, t) > -1 ? 0 : -1 : e ? 0 : -1
                }

                function s(e) {
                    var t = this.cache,
                        r = typeof e;
                    if ("boolean" == r || null == e) t[e] = !0;
                    else {
                        "number" != r && "string" != r && (r = "object");
                        var n = "number" == r ? e : _ + e,
                            i = t[r] || (t[r] = {});
                        "object" == r ? (i[n] || (i[n] = [])).push(e) : i[n] = !0
                    }
                }

                function o(e) {
                    return e.charCodeAt(0)
                }

                function a(e, t) {
                    for (var r = e.criteria, n = t.criteria, i = -1, s = r.length; ++i < s;) {
                        var o = r[i],
                            a = n[i];
                        if (o !== a) {
                            if (o > a || "undefined" == typeof o) return 1;
                            if (a > o || "undefined" == typeof a) return -1
                        }
                    }
                    return e.index - t.index
                }

                function f(e) {
                    var t = -1,
                        r = e.length,
                        n = e[0],
                        i = e[r / 2 | 0],
                        o = e[r - 1];
                    if (n && "object" == typeof n && i && "object" == typeof i && o && "object" == typeof o) return !1;
                    var a = d();
                    a["false"] = a["null"] = a["true"] = a.undefined = !1;
                    var f = d();
                    for (f.array = e, f.cache = a, f.push = s; ++t < r;) f.push(e[t]);
                    return f
                }

                function c(e) {
                    return "\\" + X[e]
                }

                function u() {
                    return y.pop() || []
                }

                function d() {
                    return m.pop() || {
                        array: null,
                        cache: null,
                        criteria: null,
                        "false": !1,
                        index: 0,
                        "null": !1,
                        number: null,
                        object: null,
                        push: null,
                        string: null,
                        "true": !1,
                        undefined: !1,
                        value: null
                    }
                }

                function h(e) {
                    e.length = 0, y.length < S && y.push(e)
                }

                function p(e) {
                    var t = e.cache;
                    t && p(t), e.array = e.cache = e.criteria = e.object = e.number = e.string = e.value = null, m.length < S && m.push(e)
                }

                function l(e, t, r) {
                    t || (t = 0), "undefined" == typeof r && (r = e ? e.length : 0);
                    for (var n = -1, i = r - t || 0, s = Array(0 > i ? 0 : i); ++n < i;) s[n] = e[t + n];
                    return s
                }

                function b(e) {
                    function t(e) {
                        return e && "object" == typeof e && !Zn(e) && jn.call(e, "__wrapped__") ? e : new r(e)
                    }

                    function r(e, t) {
                        this.__chain__ = !!t, this.__wrapped__ = e
                    }

                    function s(e) {
                        function t() {
                            if (n) {
                                var e = l(n);
                                Cn.apply(e, arguments)
                            }
                            if (this instanceof t) {
                                var s = m(r.prototype),
                                    o = r.apply(s, e || arguments);
                                return Bt(o) ? o : s
                            }
                            return r.apply(i, e || arguments)
                        }
                        var r = e[0],
                            n = e[2],
                            i = e[4];
                        return Qn(t, e), t
                    }

                    function y(e, t, r, n, i) {
                        if (r) {
                            var s = r(e);
                            if ("undefined" != typeof s) return s
                        }
                        var o = Bt(e);
                        if (!o) return e;
                        var a = xn.call(e);
                        if (!J[a]) return e;
                        var f = Gn[a];
                        switch (a) {
                            case D:
                            case L:
                                return new f(+e);
                            case H:
                            case V:
                                return new f(e);
                            case q:
                                return s = f(e.source, P.exec(e)), s.lastIndex = e.lastIndex, s
                        }
                        var c = Zn(e);
                        if (t) {
                            var d = !n;
                            n || (n = u()), i || (i = u());
                            for (var p = n.length; p--;)
                                if (n[p] == e) return i[p];
                            s = c ? f(e.length) : {}
                        } else s = c ? l(e) : si({}, e);
                        return c && (jn.call(e, "index") && (s.index = e.index), jn.call(e, "input") && (s.input = e.input)), t ? (n.push(e), i.push(s), (c ? Xt : fi)(e, function(e, o) {
                            s[o] = y(e, t, r, n, i)
                        }), d && (h(n), h(i)), s) : s
                    }

                    function m(e) {
                        return Bt(e) ? Ln(e) : {}
                    }

                    function S(e, t, r) {
                        if ("function" != typeof e) return Qr;
                        if ("undefined" == typeof t || !("prototype" in e)) return e;
                        var n = e.__bindData__;
                        if ("undefined" == typeof n && (Xn.funcNames && (n = !e.name), n = n || !Xn.funcDecomp, !n)) {
                            var i = Tn.call(e);
                            Xn.funcNames || (n = !O.test(i)), n || (n = N.test(i), Qn(e, n))
                        }
                        if (n === !1 || n !== !0 && 1 & n[1]) return e;
                        switch (r) {
                            case 1:
                                return function(r) {
                                    return e.call(t, r)
                                };
                            case 2:
                                return function(r, n) {
                                    return e.call(t, r, n)
                                };
                            case 3:
                                return function(r, n, i) {
                                    return e.call(t, r, n, i)
                                };
                            case 4:
                                return function(r, n, i, s) {
                                    return e.call(t, r, n, i, s)
                                }
                        }
                        return jr(e, t)
                    }

                    function X(e) {
                        function t() {
                            var e = f ? o : this;
                            if (i) {
                                var p = l(i);
                                Cn.apply(p, arguments)
                            }
                            if ((s || u) && (p || (p = l(arguments)), s && Cn.apply(p, s), u && p.length < a)) return n |= 16, X([r, d ? n : -4 & n, p, null, o, a]);
                            if (p || (p = arguments), c && (r = e[h]), this instanceof t) {
                                e = m(r.prototype);
                                var b = r.apply(e, p);
                                return Bt(b) ? b : e
                            }
                            return r.apply(e, p)
                        }
                        var r = e[0],
                            n = e[1],
                            i = e[2],
                            s = e[3],
                            o = e[4],
                            a = e[5],
                            f = 1 & n,
                            c = 2 & n,
                            u = 4 & n,
                            d = 8 & n,
                            h = r;
                        return Qn(t, e), t
                    }

                    function Z(e, t) {
                        var r = -1,
                            s = ft(),
                            o = e ? e.length : 0,
                            a = o >= w && s === n,
                            c = [];
                        if (a) {
                            var u = f(t);
                            u ? (s = i, t = u) : a = !1
                        }
                        for (; ++r < o;) {
                            var d = e[r];
                            s(t, d) < 0 && c.push(d)
                        }
                        return a && p(t), c
                    }

                    function $(e, t, r, n) {
                        for (var i = (n || 0) - 1, s = e ? e.length : 0, o = []; ++i < s;) {
                            var a = e[i];
                            if (a && "object" == typeof a && "number" == typeof a.length && (Zn(a) || ht(a))) {
                                t || (a = $(a, t, r));
                                var f = -1,
                                    c = a.length,
                                    u = o.length;
                                for (o.length += c; ++f < c;) o[u++] = a[f]
                            } else r || o.push(a)
                        }
                        return o
                    }

                    function et(e, t, r, n, i, s) {
                        if (r) {
                            var o = r(e, t);
                            if ("undefined" != typeof o) return !!o
                        }
                        if (e === t) return 0 !== e || 1 / e == 1 / t;
                        var a = typeof e,
                            f = typeof t;
                        if (!(e !== e || e && G[a] || t && G[f])) return !1;
                        if (null == e || null == t) return e === t;
                        var c = xn.call(e),
                            d = xn.call(t);
                        if (c == U && (c = K), d == U && (d = K), c != d) return !1;
                        switch (c) {
                            case D:
                            case L:
                                return +e == +t;
                            case H:
                                return e != +e ? t != +t : 0 == e ? 1 / e == 1 / t : e == +t;
                            case q:
                            case V:
                                return e == Sn(t)
                        }
                        var p = c == z;
                        if (!p) {
                            var l = jn.call(e, "__wrapped__"),
                                b = jn.call(t, "__wrapped__");
                            if (l || b) return et(l ? e.__wrapped__ : e, b ? t.__wrapped__ : t, r, n, i, s);
                            if (c != K) return !1;
                            var g = e.constructor,
                                y = t.constructor;
                            if (g != y && !(Ot(g) && g instanceof g && Ot(y) && y instanceof y) && "constructor" in e && "constructor" in t) return !1
                        }
                        var m = !i;
                        i || (i = u()), s || (s = u());
                        for (var v = i.length; v--;)
                            if (i[v] == e) return s[v] == t;
                        var _ = 0;
                        if (o = !0, i.push(e), s.push(t), p) {
                            if (v = e.length, _ = t.length, o = _ == v, o || n)
                                for (; _--;) {
                                    var w = v,
                                        S = t[_];
                                    if (n)
                                        for (; w-- && !(o = et(e[w], S, r, n, i, s)););
                                    else if (!(o = et(e[_], S, r, n, i, s))) break
                                }
                        } else ai(t, function(t, a, f) {
                            return jn.call(f, a) ? (_++, o = jn.call(e, a) && et(e[a], t, r, n, i, s)) : void 0
                        }), o && !n && ai(e, function(e, t, r) {
                            return jn.call(r, t) ? o = --_ > -1 : void 0
                        });
                        return i.pop(), s.pop(), m && (h(i), h(s)), o
                    }

                    function tt(e, t, r, n, i) {
                        (Zn(t) ? Xt : fi)(t, function(t, s) {
                            var o, a, f = t,
                                c = e[s];
                            if (t && ((a = Zn(t)) || ci(t))) {
                                for (var u = n.length; u--;)
                                    if (o = n[u] == t) {
                                        c = i[u];
                                        break
                                    }
                                if (!o) {
                                    var d;
                                    r && (f = r(c, t), (d = "undefined" != typeof f) && (c = f)), d || (c = a ? Zn(c) ? c : [] : ci(c) ? c : {}), n.push(t), i.push(c), d || tt(c, t, r, n, i)
                                }
                            } else r && (f = r(c, t), "undefined" == typeof f && (f = t)), "undefined" != typeof f && (c = f);
                            e[s] = c
                        })
                    }

                    function nt(e, t) {
                        return e + Rn(Wn() * (t - e + 1))
                    }

                    function it(e, t, r) {
                        var s = -1,
                            o = ft(),
                            a = e ? e.length : 0,
                            c = [],
                            d = !t && a >= w && o === n,
                            l = r || d ? u() : c;
                        if (d) {
                            var b = f(l);
                            o = i, l = b
                        }
                        for (; ++s < a;) {
                            var g = e[s],
                                y = r ? r(g, s, e) : g;
                            (t ? !s || l[l.length - 1] !== y : o(l, y) < 0) && ((r || d) && l.push(y), c.push(g))
                        }
                        return d ? (h(l.array), p(l)) : r && h(l), c
                    }

                    function st(e) {
                        return function(r, n, i) {
                            var s = {};
                            n = t.createCallback(n, i, 3);
                            var o = -1,
                                a = r ? r.length : 0;
                            if ("number" == typeof a)
                                for (; ++o < a;) {
                                    var f = r[o];
                                    e(s, f, n(f, o, r), r)
                                } else fi(r, function(t, r, i) {
                                    e(s, t, n(t, r, i), i)
                                });
                            return s
                        }
                    }

                    function ot(e, t, r, n, i, o) {
                        var a = 1 & t,
                            f = 2 & t,
                            c = 4 & t,
                            u = 16 & t,
                            d = 32 & t;
                        if (!f && !Ot(e)) throw new kn;
                        u && !r.length && (t &= -17, u = r = !1), d && !n.length && (t &= -33, d = n = !1);
                        var h = e && e.__bindData__;
                        if (h && h !== !0) return h = l(h), h[2] && (h[2] = l(h[2])), h[3] && (h[3] = l(h[3])), !a || 1 & h[1] || (h[4] = i), !a && 1 & h[1] && (t |= 8), !c || 4 & h[1] || (h[5] = o), u && Cn.apply(h[2] || (h[2] = []), r), d && zn.apply(h[3] || (h[3] = []), n), h[1] |= t, ot.apply(null, h);
                        var p = 1 == t || 17 === t ? s : X;
                        return p([e, t, r, n, i, o])
                    }

                    function at(e) {
                        return ti[e]
                    }

                    function ft() {
                        var e = (e = t.indexOf) === yr ? n : e;
                        return e
                    }

                    function ct(e) {
                        return "function" == typeof e && Pn.test(e)
                    }

                    function ut(e) {
                        var t, r;
                        return e && xn.call(e) == K && (t = e.constructor, !Ot(t) || t instanceof t) ? (ai(e, function(e, t) {
                            r = t
                        }), "undefined" == typeof r || jn.call(e, r)) : !1
                    }

                    function dt(e) {
                        return ri[e]
                    }

                    function ht(e) {
                        return e && "object" == typeof e && "number" == typeof e.length && xn.call(e) == U || !1
                    }

                    function pt(e, t, r, n) {
                        return "boolean" != typeof t && null != t && (n = r, r = t, t = !1), y(e, t, "function" == typeof r && S(r, n, 1))
                    }

                    function lt(e, t, r) {
                        return y(e, !0, "function" == typeof t && S(t, r, 1))
                    }

                    function bt(e, t) {
                        var r = m(e);
                        return t ? si(r, t) : r
                    }

                    function gt(e, r, n) {
                        var i;
                        return r = t.createCallback(r, n, 3), fi(e, function(e, t, n) {
                            return r(e, t, n) ? (i = t, !1) : void 0
                        }), i
                    }

                    function yt(e, r, n) {
                        var i;
                        return r = t.createCallback(r, n, 3), vt(e, function(e, t, n) {
                            return r(e, t, n) ? (i = t, !1) : void 0
                        }), i
                    }

                    function mt(e, t, r) {
                        var n = [];
                        ai(e, function(e, t) {
                            n.push(t, e)
                        });
                        var i = n.length;
                        for (t = S(t, r, 3); i-- && t(n[i--], n[i], e) !== !1;);
                        return e
                    }

                    function vt(e, t, r) {
                        var n = ei(e),
                            i = n.length;
                        for (t = S(t, r, 3); i--;) {
                            var s = n[i];
                            if (t(e[s], s, e) === !1) break
                        }
                        return e
                    }

                    function _t(e) {
                        var t = [];
                        return ai(e, function(e, r) {
                            Ot(e) && t.push(r)
                        }), t.sort()
                    }

                    function wt(e, t) {
                        return e ? jn.call(e, t) : !1
                    }

                    function St(e) {
                        for (var t = -1, r = ei(e), n = r.length, i = {}; ++t < n;) {
                            var s = r[t];
                            i[e[s]] = s
                        }
                        return i
                    }

                    function kt(e) {
                        return e === !0 || e === !1 || e && "object" == typeof e && xn.call(e) == D || !1
                    }

                    function It(e) {
                        return e && "object" == typeof e && xn.call(e) == L || !1
                    }

                    function Et(e) {
                        return e && 1 === e.nodeType || !1
                    }

                    function At(e) {
                        var t = !0;
                        if (!e) return t;
                        var r = xn.call(e),
                            n = e.length;
                        return r == z || r == V || r == U || r == K && "number" == typeof n && Ot(e.splice) ? !n : (fi(e, function() {
                            return t = !1
                        }), t)
                    }

                    function xt(e, t, r, n) {
                        return et(e, t, "function" == typeof r && S(r, n, 2))
                    }

                    function Pt(e) {
                        return Hn(e) && !Kn(parseFloat(e))
                    }

                    function Ot(e) {
                        return "function" == typeof e
                    }

                    function Bt(e) {
                        return !(!e || !G[typeof e])
                    }

                    function Rt(e) {
                        return Nt(e) && e != +e
                    }

                    function Tt(e) {
                        return null === e
                    }

                    function Nt(e) {
                        return "number" == typeof e || e && "object" == typeof e && xn.call(e) == H || !1
                    }

                    function jt(e) {
                        return e && "object" == typeof e && xn.call(e) == q || !1
                    }

                    function Ct(e) {
                        return "string" == typeof e || e && "object" == typeof e && xn.call(e) == V || !1
                    }

                    function Mt(e) {
                        return "undefined" == typeof e
                    }

                    function Ut(e, r, n) {
                        var i = {};
                        return r = t.createCallback(r, n, 3), fi(e, function(e, t, n) {
                            i[t] = r(e, t, n)
                        }), i
                    }

                    function zt(e) {
                        var t = arguments,
                            r = 2;
                        if (!Bt(e)) return e;
                        if ("number" != typeof t[2] && (r = t.length), r > 3 && "function" == typeof t[r - 2]) var n = S(t[--r - 1], t[r--], 2);
                        else r > 2 && "function" == typeof t[r - 1] && (n = t[--r]);
                        for (var i = l(arguments, 1, r), s = -1, o = u(), a = u(); ++s < r;) tt(e, i[s], n, o, a);
                        return h(o), h(a), e
                    }

                    function Dt(e, r, n) {
                        var i = {};
                        if ("function" != typeof r) {
                            var s = [];
                            ai(e, function(e, t) {
                                s.push(t)
                            }), s = Z(s, $(arguments, !0, !1, 1));
                            for (var o = -1, a = s.length; ++o < a;) {
                                var f = s[o];
                                i[f] = e[f]
                            }
                        } else r = t.createCallback(r, n, 3), ai(e, function(e, t, n) {
                            r(e, t, n) || (i[t] = e)
                        });
                        return i
                    }

                    function Lt(e) {
                        for (var t = -1, r = ei(e), n = r.length, i = ln(n); ++t < n;) {
                            var s = r[t];
                            i[t] = [s, e[s]]
                        }
                        return i
                    }

                    function Ft(e, r, n) {
                        var i = {};
                        if ("function" != typeof r)
                            for (var s = -1, o = $(arguments, !0, !1, 1), a = Bt(e) ? o.length : 0; ++s < a;) {
                                var f = o[s];
                                f in e && (i[f] = e[f])
                            } else r = t.createCallback(r, n, 3), ai(e, function(e, t, n) {
                                r(e, t, n) && (i[t] = e)
                            });
                        return i
                    }

                    function Ht(e, r, n, i) {
                        var s = Zn(e);
                        if (null == n)
                            if (s) n = [];
                            else {
                                var o = e && e.constructor,
                                    a = o && o.prototype;
                                n = m(a)
                            }
                        return r && (r = t.createCallback(r, i, 4), (s ? Xt : fi)(e, function(e, t, i) {
                            return r(n, e, t, i)
                        })), n
                    }

                    function Kt(e) {
                        for (var t = -1, r = ei(e), n = r.length, i = ln(n); ++t < n;) i[t] = e[r[t]];
                        return i
                    }

                    function qt(e) {
                        for (var t = arguments, r = -1, n = $(t, !0, !1, 1), i = t[2] && t[2][t[1]] === e ? 1 : n.length, s = ln(i); ++r < i;) s[r] = e[n[r]];
                        return s
                    }

                    function Vt(e, t, r) {
                        var n = -1,
                            i = ft(),
                            s = e ? e.length : 0,
                            o = !1;
                        return r = (0 > r ? Vn(0, s + r) : r) || 0, Zn(e) ? o = i(e, t, r) > -1 : "number" == typeof s ? o = (Ct(e) ? e.indexOf(t, r) : i(e, t, r)) > -1 : fi(e, function(e) {
                            return ++n >= r ? !(o = e === t) : void 0
                        }), o
                    }

                    function Jt(e, r, n) {
                        var i = !0;
                        r = t.createCallback(r, n, 3);
                        var s = -1,
                            o = e ? e.length : 0;
                        if ("number" == typeof o)
                            for (; ++s < o && (i = !!r(e[s], s, e)););
                        else fi(e, function(e, t, n) {
                            return i = !!r(e, t, n)
                        });
                        return i
                    }

                    function Yt(e, r, n) {
                        var i = [];
                        r = t.createCallback(r, n, 3);
                        var s = -1,
                            o = e ? e.length : 0;
                        if ("number" == typeof o)
                            for (; ++s < o;) {
                                var a = e[s];
                                r(a, s, e) && i.push(a)
                            } else fi(e, function(e, t, n) {
                                r(e, t, n) && i.push(e)
                            });
                        return i
                    }

                    function Wt(e, r, n) {
                        r = t.createCallback(r, n, 3);
                        var i = -1,
                            s = e ? e.length : 0;
                        if ("number" != typeof s) {
                            var o;
                            return fi(e, function(e, t, n) {
                                return r(e, t, n) ? (o = e, !1) : void 0
                            }), o
                        }
                        for (; ++i < s;) {
                            var a = e[i];
                            if (r(a, i, e)) return a
                        }
                    }

                    function Gt(e, r, n) {
                        var i;
                        return r = t.createCallback(r, n, 3), Qt(e, function(e, t, n) {
                            return r(e, t, n) ? (i = e, !1) : void 0
                        }), i
                    }

                    function Xt(e, t, r) {
                        var n = -1,
                            i = e ? e.length : 0;
                        if (t = t && "undefined" == typeof r ? t : S(t, r, 3), "number" == typeof i)
                            for (; ++n < i && t(e[n], n, e) !== !1;);
                        else fi(e, t);
                        return e
                    }

                    function Qt(e, t, r) {
                        var n = e ? e.length : 0;
                        if (t = t && "undefined" == typeof r ? t : S(t, r, 3), "number" == typeof n)
                            for (; n-- && t(e[n], n, e) !== !1;);
                        else {
                            var i = ei(e);
                            n = i.length, fi(e, function(e, r, s) {
                                return r = i ? i[--n] : --n, t(s[r], r, s)
                            })
                        }
                        return e
                    }

                    function Zt(e, t) {
                        var r = l(arguments, 2),
                            n = -1,
                            i = "function" == typeof t,
                            s = e ? e.length : 0,
                            o = ln("number" == typeof s ? s : 0);
                        return Xt(e, function(e) {
                            o[++n] = (i ? t : e[t]).apply(e, r)
                        }), o
                    }

                    function $t(e, r, n) {
                        var i = -1,
                            s = e ? e.length : 0;
                        if (r = t.createCallback(r, n, 3), "number" == typeof s)
                            for (var o = ln(s); ++i < s;) o[i] = r(e[i], i, e);
                        else o = [], fi(e, function(e, t, n) {
                            o[++i] = r(e, t, n)
                        });
                        return o
                    }

                    function er(e, r, n) {
                        var i = -1 / 0,
                            s = i;
                        if ("function" != typeof r && n && n[r] === e && (r = null), null == r && Zn(e))
                            for (var a = -1, f = e.length; ++a < f;) {
                                var c = e[a];
                                c > s && (s = c)
                            } else r = null == r && Ct(e) ? o : t.createCallback(r, n, 3), Xt(e, function(e, t, n) {
                                var o = r(e, t, n);
                                o > i && (i = o, s = e)
                            });
                        return s
                    }

                    function tr(e, r, n) {
                        var i = 1 / 0,
                            s = i;
                        if ("function" != typeof r && n && n[r] === e && (r = null), null == r && Zn(e))
                            for (var a = -1, f = e.length; ++a < f;) {
                                var c = e[a];
                                s > c && (s = c)
                            } else r = null == r && Ct(e) ? o : t.createCallback(r, n, 3), Xt(e, function(e, t, n) {
                                var o = r(e, t, n);
                                i > o && (i = o, s = e)
                            });
                        return s
                    }

                    function rr(e, r, n, i) {
                        if (!e) return n;
                        var s = arguments.length < 3;
                        r = t.createCallback(r, i, 4);
                        var o = -1,
                            a = e.length;
                        if ("number" == typeof a)
                            for (s && (n = e[++o]); ++o < a;) n = r(n, e[o], o, e);
                        else fi(e, function(e, t, i) {
                            n = s ? (s = !1, e) : r(n, e, t, i)
                        });
                        return n
                    }

                    function nr(e, r, n, i) {
                        var s = arguments.length < 3;
                        return r = t.createCallback(r, i, 4), Qt(e, function(e, t, i) {
                            n = s ? (s = !1, e) : r(n, e, t, i)
                        }), n
                    }

                    function ir(e, r, n) {
                        return r = t.createCallback(r, n, 3), Yt(e, function(e, t, n) {
                            return !r(e, t, n)
                        })
                    }

                    function sr(e, t, r) {
                        if (e && "number" != typeof e.length && (e = Kt(e)), null == t || r) return e ? e[nt(0, e.length - 1)] : g;
                        var n = or(e);
                        return n.length = Jn(Vn(0, t), n.length), n
                    }

                    function or(e) {
                        var t = -1,
                            r = e ? e.length : 0,
                            n = ln("number" == typeof r ? r : 0);
                        return Xt(e, function(e) {
                            var r = nt(0, ++t);
                            n[t] = n[r], n[r] = e
                        }), n
                    }

                    function ar(e) {
                        var t = e ? e.length : 0;
                        return "number" == typeof t ? t : ei(e).length
                    }

                    function fr(e, r, n) {
                        var i;
                        r = t.createCallback(r, n, 3);
                        var s = -1,
                            o = e ? e.length : 0;
                        if ("number" == typeof o)
                            for (; ++s < o && !(i = r(e[s], s, e)););
                        else fi(e, function(e, t, n) {
                            return !(i = r(e, t, n))
                        });
                        return !!i
                    }

                    function cr(e, r, n) {
                        var i = -1,
                            s = Zn(r),
                            o = e ? e.length : 0,
                            f = ln("number" == typeof o ? o : 0);
                        for (s || (r = t.createCallback(r, n, 3)), Xt(e, function(e, t, n) {
                                var o = f[++i] = d();
                                s ? o.criteria = $t(r, function(t) {
                                    return e[t]
                                }) : (o.criteria = u())[0] = r(e, t, n), o.index = i, o.value = e
                            }), o = f.length, f.sort(a); o--;) {
                            var c = f[o];
                            f[o] = c.value, s || h(c.criteria), p(c)
                        }
                        return f
                    }

                    function ur(e) {
                        return e && "number" == typeof e.length ? l(e) : Kt(e)
                    }

                    function dr(e) {
                        for (var t = -1, r = e ? e.length : 0, n = []; ++t < r;) {
                            var i = e[t];
                            i && n.push(i)
                        }
                        return n
                    }

                    function hr(e) {
                        return Z(e, $(arguments, !0, !0, 1))
                    }

                    function pr(e, r, n) {
                        var i = -1,
                            s = e ? e.length : 0;
                        for (r = t.createCallback(r, n, 3); ++i < s;)
                            if (r(e[i], i, e)) return i;
                        return -1
                    }

                    function lr(e, r, n) {
                        var i = e ? e.length : 0;
                        for (r = t.createCallback(r, n, 3); i--;)
                            if (r(e[i], i, e)) return i;
                        return -1
                    }

                    function br(e, r, n) {
                        var i = 0,
                            s = e ? e.length : 0;
                        if ("number" != typeof r && null != r) {
                            var o = -1;
                            for (r = t.createCallback(r, n, 3); ++o < s && r(e[o], o, e);) i++
                        } else if (i = r, null == i || n) return e ? e[0] : g;
                        return l(e, 0, Jn(Vn(0, i), s))
                    }

                    function gr(e, t, r, n) {
                        return "boolean" != typeof t && null != t && (n = r, r = "function" != typeof t && n && n[t] === e ? null : t, t = !1), null != r && (e = $t(e, r, n)), $(e, t)
                    }

                    function yr(e, t, r) {
                        if ("number" == typeof r) {
                            var i = e ? e.length : 0;
                            r = 0 > r ? Vn(0, i + r) : r || 0
                        } else if (r) {
                            var s = Ar(e, t);
                            return e[s] === t ? s : -1
                        }
                        return n(e, t, r)
                    }

                    function mr(e, r, n) {
                        var i = 0,
                            s = e ? e.length : 0;
                        if ("number" != typeof r && null != r) {
                            var o = s;
                            for (r = t.createCallback(r, n, 3); o-- && r(e[o], o, e);) i++
                        } else i = null == r || n ? 1 : r || i;
                        return l(e, 0, Jn(Vn(0, s - i), s))
                    }

                    function vr() {
                        for (var e = [], t = -1, r = arguments.length, s = u(), o = ft(), a = o === n, c = u(); ++t < r;) {
                            var d = arguments[t];
                            (Zn(d) || ht(d)) && (e.push(d), s.push(a && d.length >= w && f(t ? e[t] : c)))
                        }
                        var l = e[0],
                            b = -1,
                            g = l ? l.length : 0,
                            y = [];
                        e: for (; ++b < g;) {
                            var m = s[0];
                            if (d = l[b], (m ? i(m, d) : o(c, d)) < 0) {
                                for (t = r, (m || c).push(d); --t;)
                                    if (m = s[t], (m ? i(m, d) : o(e[t], d)) < 0) continue e;
                                y.push(d)
                            }
                        }
                        for (; r--;) m = s[r], m && p(m);
                        return h(s), h(c), y
                    }

                    function _r(e, r, n) {
                        var i = 0,
                            s = e ? e.length : 0;
                        if ("number" != typeof r && null != r) {
                            var o = s;
                            for (r = t.createCallback(r, n, 3); o-- && r(e[o], o, e);) i++
                        } else if (i = r, null == i || n) return e ? e[s - 1] : g;
                        return l(e, Vn(0, s - i))
                    }

                    function wr(e, t, r) {
                        var n = e ? e.length : 0;
                        for ("number" == typeof r && (n = (0 > r ? Vn(0, n + r) : Jn(r, n - 1)) + 1); n--;)
                            if (e[n] === t) return n;
                        return -1
                    }

                    function Sr(e) {
                        for (var t = arguments, r = 0, n = t.length, i = e ? e.length : 0; ++r < n;)
                            for (var s = -1, o = t[r]; ++s < i;) e[s] === o && (Un.call(e, s--, 1), i--);
                        return e
                    }

                    function kr(e, t, r) {
                        e = +e || 0, r = "number" == typeof r ? r : +r || 1, null == t && (t = e, e = 0);
                        for (var n = -1, i = Vn(0, On((t - e) / (r || 1))), s = ln(i); ++n < i;) s[n] = e, e += r;
                        return s
                    }

                    function Ir(e, r, n) {
                        var i = -1,
                            s = e ? e.length : 0,
                            o = [];
                        for (r = t.createCallback(r, n, 3); ++i < s;) {
                            var a = e[i];
                            r(a, i, e) && (o.push(a), Un.call(e, i--, 1), s--)
                        }
                        return o
                    }

                    function Er(e, r, n) {
                        if ("number" != typeof r && null != r) {
                            var i = 0,
                                s = -1,
                                o = e ? e.length : 0;
                            for (r = t.createCallback(r, n, 3); ++s < o && r(e[s], s, e);) i++
                        } else i = null == r || n ? 1 : Vn(0, r);
                        return l(e, i)
                    }

                    function Ar(e, r, n, i) {
                        var s = 0,
                            o = e ? e.length : s;
                        for (n = n ? t.createCallback(n, i, 1) : Qr, r = n(r); o > s;) {
                            var a = s + o >>> 1;
                            n(e[a]) < r ? s = a + 1 : o = a
                        }
                        return s
                    }

                    function xr() {
                        return it($(arguments, !0, !0))
                    }

                    function Pr(e, r, n, i) {
                        return "boolean" != typeof r && null != r && (i = n, n = "function" != typeof r && i && i[r] === e ? null : r, r = !1), null != n && (n = t.createCallback(n, i, 3)), it(e, r, n)
                    }

                    function Or(e) {
                        return Z(e, l(arguments, 1))
                    }

                    function Br() {
                        for (var e = -1, t = arguments.length; ++e < t;) {
                            var r = arguments[e];
                            if (Zn(r) || ht(r)) var n = n ? it(Z(n, r).concat(Z(r, n))) : r
                        }
                        return n || []
                    }

                    function Rr() {
                        for (var e = arguments.length > 1 ? arguments : arguments[0], t = -1, r = e ? er(pi(e, "length")) : 0, n = ln(0 > r ? 0 : r); ++t < r;) n[t] = pi(e, t);
                        return n
                    }

                    function Tr(e, t) {
                        var r = -1,
                            n = e ? e.length : 0,
                            i = {};
                        for (t || !n || Zn(e[0]) || (t = []); ++r < n;) {
                            var s = e[r];
                            t ? i[s] = t[r] : s && (i[s[0]] = s[1])
                        }
                        return i
                    }

                    function Nr(e, t) {
                        if (!Ot(t)) throw new kn;
                        return function() {
                            return --e < 1 ? t.apply(this, arguments) : void 0
                        }
                    }

                    function jr(e, t) {
                        return arguments.length > 2 ? ot(e, 17, l(arguments, 2), null, t) : ot(e, 1, null, null, t)
                    }

                    function Cr(e) {
                        for (var t = arguments.length > 1 ? $(arguments, !0, !1, 1) : _t(e), r = -1, n = t.length; ++r < n;) {
                            var i = t[r];
                            e[i] = ot(e[i], 1, null, null, e)
                        }
                        return e
                    }

                    function Mr(e, t) {
                        return arguments.length > 2 ? ot(t, 19, l(arguments, 2), null, e) : ot(t, 3, null, null, e)
                    }

                    function Ur() {
                        for (var e = arguments, t = e.length; t--;)
                            if (!Ot(e[t])) throw new kn;
                        return function() {
                            for (var t = arguments, r = e.length; r--;) t = [e[r].apply(this, t)];
                            return t[0]
                        }
                    }

                    function zr(e, t) {
                        return t = "number" == typeof t ? t : +t || e.length, ot(e, 4, null, null, null, t)
                    }

                    function Dr(e, t, r) {
                        var n, i, s, o, a, f, c, u = 0,
                            d = !1,
                            h = !0;
                        if (!Ot(e)) throw new kn;
                        if (t = Vn(0, t) || 0, r === !0) {
                            var p = !0;
                            h = !1
                        } else Bt(r) && (p = r.leading, d = "maxWait" in r && (Vn(t, r.maxWait) || 0), h = "trailing" in r ? r.trailing : h);
                        var l = function() {
                                var r = t - (bi() - o);
                                if (0 >= r) {
                                    i && Bn(i);
                                    var d = c;
                                    i = f = c = g, d && (u = bi(), s = e.apply(a, n), f || i || (n = a = null))
                                } else f = Mn(l, r)
                            },
                            b = function() {
                                f && Bn(f), i = f = c = g, (h || d !== t) && (u = bi(), s = e.apply(a, n), f || i || (n = a = null))
                            };
                        return function() {
                            if (n = arguments, o = bi(), a = this, c = h && (f || !p), d === !1) var r = p && !f;
                            else {
                                i || p || (u = o);
                                var g = d - (o - u),
                                    y = 0 >= g;
                                y ? (i && (i = Bn(i)), u = o, s = e.apply(a, n)) : i || (i = Mn(b, g))
                            }
                            return y && f ? f = Bn(f) : f || t === d || (f = Mn(l, t)), r && (y = !0, s = e.apply(a, n)), !y || f || i || (n = a = null), s
                        }
                    }

                    function Lr(e) {
                        if (!Ot(e)) throw new kn;
                        var t = l(arguments, 1);
                        return Mn(function() {
                            e.apply(g, t)
                        }, 1)
                    }

                    function Fr(e, t) {
                        if (!Ot(e)) throw new kn;
                        var r = l(arguments, 2);
                        return Mn(function() {
                            e.apply(g, r)
                        }, t)
                    }

                    function Hr(e, t) {
                        if (!Ot(e)) throw new kn;
                        var r = function() {
                            var n = r.cache,
                                i = t ? t.apply(this, arguments) : _ + arguments[0];
                            return jn.call(n, i) ? n[i] : n[i] = e.apply(this, arguments)
                        };
                        return r.cache = {}, r
                    }

                    function Kr(e) {
                        var t, r;
                        if (!Ot(e)) throw new kn;
                        return function() {
                            return t ? r : (t = !0, r = e.apply(this, arguments), e = null, r)
                        }
                    }

                    function qr(e) {
                        return ot(e, 16, l(arguments, 1))
                    }

                    function Vr(e) {
                        return ot(e, 32, null, l(arguments, 1))
                    }

                    function Jr(e, t, r) {
                        var n = !0,
                            i = !0;
                        if (!Ot(e)) throw new kn;
                        return r === !1 ? n = !1 : Bt(r) && (n = "leading" in r ? r.leading : n, i = "trailing" in r ? r.trailing : i), Y.leading = n, Y.maxWait = t, Y.trailing = i, Dr(e, t, Y)
                    }

                    function Yr(e, t) {
                        return ot(t, 16, [e])
                    }

                    function Wr(e) {
                        return function() {
                            return e
                        }
                    }

                    function Gr(e, t, r) {
                        var n = typeof e;
                        if (null == e || "function" == n) return S(e, t, r);
                        if ("object" != n) return tn(e);
                        var i = ei(e),
                            s = i[0],
                            o = e[s];
                        return 1 != i.length || o !== o || Bt(o) ? function(t) {
                            for (var r = i.length, n = !1; r-- && (n = et(t[i[r]], e[i[r]], null, !0)););
                            return n
                        } : function(e) {
                            var t = e[s];
                            return o === t && (0 !== o || 1 / o == 1 / t)
                        }
                    }

                    function Xr(e) {
                        return null == e ? "" : Sn(e).replace(ii, at)
                    }

                    function Qr(e) {
                        return e
                    }

                    function Zr(e, n, i) {
                        var s = !0,
                            o = n && _t(n);
                        n && (i || o.length) || (null == i && (i = n), a = r, n = e, e = t, o = _t(n)), i === !1 ? s = !1 : Bt(i) && "chain" in i && (s = i.chain);
                        var a = e,
                            f = Ot(a);
                        Xt(o, function(t) {
                            var r = e[t] = n[t];
                            f && (a.prototype[t] = function() {
                                var t = this.__chain__,
                                    n = this.__wrapped__,
                                    i = [n];
                                Cn.apply(i, arguments);
                                var o = r.apply(e, i);
                                if (s || t) {
                                    if (n === o && Bt(o)) return this;
                                    o = new a(o), o.__chain__ = t
                                }
                                return o
                            })
                        })
                    }

                    function $r() {
                        return e._ = An, this
                    }

                    function en() {}

                    function tn(e) {
                        return function(t) {
                            return t[e]
                        }
                    }

                    function rn(e, t, r) {
                        var n = null == e,
                            i = null == t;
                        if (null == r && ("boolean" == typeof e && i ? (r = e, e = 1) : i || "boolean" != typeof t || (r = t, i = !0)), n && i && (t = 1), e = +e || 0, i ? (t = e, e = 0) : t = +t || 0, r || e % 1 || t % 1) {
                            var s = Wn();
                            return Jn(e + s * (t - e + parseFloat("1e-" + ((s + "").length - 1))), t)
                        }
                        return nt(e, t)
                    }

                    function nn(e, t) {
                        if (e) {
                            var r = e[t];
                            return Ot(r) ? e[t]() : r
                        }
                    }

                    function sn(e, r, n) {
                        var i = t.templateSettings;
                        e = Sn(e || ""), n = oi({}, n, i);
                        var s, o = oi({}, n.imports, i.imports),
                            a = ei(o),
                            f = Kt(o),
                            u = 0,
                            d = n.interpolate || T,
                            h = "__p += '",
                            p = wn((n.escape || T).source + "|" + d.source + "|" + (d === B ? x : T).source + "|" + (n.evaluate || T).source + "|$", "g");
                        e.replace(p, function(t, r, n, i, o, a) {
                            return n || (n = i), h += e.slice(u, a).replace(j, c), r && (h += "' +\n__e(" + r + ") +\n'"), o && (s = !0, h += "';\n" + o + ";\n__p += '"), n && (h += "' +\n((__t = (" + n + ")) == null ? '' : __t) +\n'"), u = a + t.length, t
                        }), h += "';\n";
                        var l = n.variable,
                            b = l;
                        b || (l = "obj", h = "with (" + l + ") {\n" + h + "\n}\n"), h = (s ? h.replace(I, "") : h).replace(E, "$1").replace(A, "$1;"), h = "function(" + l + ") {\n" + (b ? "" : l + " || (" + l + " = {});\n") + "var __t, __p = '', __e = _.escape" + (s ? ", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n" : ";\n") + h + "return __p\n}";
                        var y = "\n/*\n//# sourceURL=" + (n.sourceURL || "/lodash/template/source[" + M++ +"]") + "\n*/";
                        try {
                            var m = yn(a, "return " + h + y).apply(g, f)
                        } catch (v) {
                            throw v.source = h, v
                        }
                        return r ? m(r) : (m.source = h, m)
                    }

                    function on(e, t, r) {
                        e = (e = +e) > -1 ? e : 0;
                        var n = -1,
                            i = ln(e);
                        for (t = S(t, r, 1); ++n < e;) i[n] = t(n);
                        return i
                    }

                    function an(e) {
                        return null == e ? "" : Sn(e).replace(ni, dt)
                    }

                    function fn(e) {
                        var t = ++v;
                        return Sn(null == e ? "" : e) + t
                    }

                    function cn(e) {
                        return e = new r(e), e.__chain__ = !0, e
                    }

                    function un(e, t) {
                        return t(e), e
                    }

                    function dn() {
                        return this.__chain__ = !0, this
                    }

                    function hn() {
                        return Sn(this.__wrapped__)
                    }

                    function pn() {
                        return this.__wrapped__
                    }
                    e = e ? rt.defaults(Q.Object(), e, rt.pick(Q, C)) : Q;
                    var ln = e.Array,
                        bn = e.Boolean,
                        gn = e.Date,
                        yn = e.Function,
                        mn = e.Math,
                        vn = e.Number,
                        _n = e.Object,
                        wn = e.RegExp,
                        Sn = e.String,
                        kn = e.TypeError,
                        In = [],
                        En = _n.prototype,
                        An = e._,
                        xn = En.toString,
                        Pn = wn("^" + Sn(xn).replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/toString| for [^\]]+/g, ".*?") + "$"),
                        On = mn.ceil,
                        Bn = e.clearTimeout,
                        Rn = mn.floor,
                        Tn = yn.prototype.toString,
                        Nn = ct(Nn = _n.getPrototypeOf) && Nn,
                        jn = En.hasOwnProperty,
                        Cn = In.push,
                        Mn = e.setTimeout,
                        Un = In.splice,
                        zn = In.unshift,
                        Dn = function() {
                            try {
                                var e = {},
                                    t = ct(t = _n.defineProperty) && t,
                                    r = t(e, e, e) && t
                            } catch (n) {}
                            return r
                        }(),
                        Ln = ct(Ln = _n.create) && Ln,
                        Fn = ct(Fn = ln.isArray) && Fn,
                        Hn = e.isFinite,
                        Kn = e.isNaN,
                        qn = ct(qn = _n.keys) && qn,
                        Vn = mn.max,
                        Jn = mn.min,
                        Yn = e.parseInt,
                        Wn = mn.random,
                        Gn = {};
                    Gn[z] = ln, Gn[D] = bn, Gn[L] = gn, Gn[F] = yn, Gn[K] = _n, Gn[H] = vn, Gn[q] = wn, Gn[V] = Sn, r.prototype = t.prototype;
                    var Xn = t.support = {};
                    Xn.funcDecomp = !ct(e.WinRTError) && N.test(b), Xn.funcNames = "string" == typeof yn.name, t.templateSettings = {
                        escape: /<%-([\s\S]+?)%>/g,
                        evaluate: /<%([\s\S]+?)%>/g,
                        interpolate: B,
                        variable: "",
                        imports: {
                            _: t
                        }
                    }, Ln || (m = function() {
                        function t() {}
                        return function(r) {
                            if (Bt(r)) {
                                t.prototype = r;
                                var n = new t;
                                t.prototype = null
                            }
                            return n || e.Object()
                        }
                    }());
                    var Qn = Dn ? function(e, t) {
                            W.value = t, Dn(e, "__bindData__", W)
                        } : en,
                        Zn = Fn || function(e) {
                            return e && "object" == typeof e && "number" == typeof e.length && xn.call(e) == z || !1
                        },
                        $n = function(e) {
                            var t, r = e,
                                n = [];
                            if (!r) return n;
                            if (!G[typeof e]) return n;
                            for (t in r) jn.call(r, t) && n.push(t);
                            return n
                        },
                        ei = qn ? function(e) {
                            return Bt(e) ? qn(e) : []
                        } : $n,
                        ti = {
                            "&": "&amp;",
                            "<": "&lt;",
                            ">": "&gt;",
                            '"': "&quot;",
                            "'": "&#39;"
                        },
                        ri = St(ti),
                        ni = wn("(" + ei(ri).join("|") + ")", "g"),
                        ii = wn("[" + ei(ti).join("") + "]", "g"),
                        si = function(e, t, r) {
                            var n, i = e,
                                s = i;
                            if (!i) return s;
                            var o = arguments,
                                a = 0,
                                f = "number" == typeof r ? 2 : o.length;
                            if (f > 3 && "function" == typeof o[f - 2]) var c = S(o[--f - 1], o[f--], 2);
                            else f > 2 && "function" == typeof o[f - 1] && (c = o[--f]);
                            for (; ++a < f;)
                                if (i = o[a], i && G[typeof i])
                                    for (var u = -1, d = G[typeof i] && ei(i), h = d ? d.length : 0; ++u < h;) n = d[u], s[n] = c ? c(s[n], i[n]) : i[n];
                            return s
                        },
                        oi = function(e, t, r) {
                            var n, i = e,
                                s = i;
                            if (!i) return s;
                            for (var o = arguments, a = 0, f = "number" == typeof r ? 2 : o.length; ++a < f;)
                                if (i = o[a], i && G[typeof i])
                                    for (var c = -1, u = G[typeof i] && ei(i), d = u ? u.length : 0; ++c < d;) n = u[c], "undefined" == typeof s[n] && (s[n] = i[n]);
                            return s
                        },
                        ai = function(e, t, r) {
                            var n, i = e,
                                s = i;
                            if (!i) return s;
                            if (!G[typeof i]) return s;
                            t = t && "undefined" == typeof r ? t : S(t, r, 3);
                            for (n in i)
                                if (t(i[n], n, e) === !1) return s;
                            return s
                        },
                        fi = function(e, t, r) {
                            var n, i = e,
                                s = i;
                            if (!i) return s;
                            if (!G[typeof i]) return s;
                            t = t && "undefined" == typeof r ? t : S(t, r, 3);
                            for (var o = -1, a = G[typeof i] && ei(i), f = a ? a.length : 0; ++o < f;)
                                if (n = a[o], t(i[n], n, e) === !1) return s;
                            return s
                        },
                        ci = Nn ? function(e) {
                            if (!e || xn.call(e) != K) return !1;
                            var t = e.valueOf,
                                r = ct(t) && (r = Nn(t)) && Nn(r);
                            return r ? e == r || Nn(e) == r : ut(e)
                        } : ut,
                        ui = st(function(e, t, r) {
                            jn.call(e, r) ? e[r] ++ : e[r] = 1
                        }),
                        di = st(function(e, t, r) {
                            (jn.call(e, r) ? e[r] : e[r] = []).push(t)
                        }),
                        hi = st(function(e, t, r) {
                            e[r] = t
                        }),
                        pi = $t,
                        li = Yt,
                        bi = ct(bi = gn.now) && bi || function() {
                            return (new gn).getTime()
                        },
                        gi = 8 == Yn(k + "08") ? Yn : function(e, t) {
                            return Yn(Ct(e) ? e.replace(R, "") : e, t || 0)
                        };
                    return t.after = Nr, t.assign = si, t.at = qt, t.bind = jr, t.bindAll = Cr, t.bindKey = Mr, t.chain = cn, t.compact = dr, t.compose = Ur, t.constant = Wr, t.countBy = ui, t.create = bt, t.createCallback = Gr, t.curry = zr, t.debounce = Dr, t.defaults = oi, t.defer = Lr, t.delay = Fr, t.difference = hr, t.filter = Yt, t.flatten = gr, t.forEach = Xt, t.forEachRight = Qt, t.forIn = ai, t.forInRight = mt, t.forOwn = fi, t.forOwnRight = vt, t.functions = _t, t.groupBy = di, t.indexBy = hi, t.initial = mr, t.intersection = vr, t.invert = St, t.invoke = Zt, t.keys = ei, t.map = $t, t.mapValues = Ut, t.max = er, t.memoize = Hr, t.merge = zt, t.min = tr, t.omit = Dt, t.once = Kr, t.pairs = Lt, t.partial = qr, t.partialRight = Vr, t.pick = Ft, t.pluck = pi, t.property = tn, t.pull = Sr, t.range = kr, t.reject = ir, t.remove = Ir, t.rest = Er, t.shuffle = or, t.sortBy = cr, t.tap = un, t.throttle = Jr, t.times = on, t.toArray = ur, t.transform = Ht, t.union = xr, t.uniq = Pr, t.values = Kt, t.where = li, t.without = Or, t.wrap = Yr, t.xor = Br, t.zip = Rr, t.zipObject = Tr, t.collect = $t, t.drop = Er, t.each = Xt, t.eachRight = Qt, t.extend = si, t.methods = _t, t.object = Tr, t.select = Yt, t.tail = Er, t.unique = Pr, t.unzip = Rr, Zr(t), t.clone = pt, t.cloneDeep = lt, t.contains = Vt, t.escape = Xr, t.every = Jt, t.find = Wt, t.findIndex = pr, t.findKey = gt, t.findLast = Gt, t.findLastIndex = lr, t.findLastKey = yt, t.has = wt, t.identity = Qr, t.indexOf = yr, t.isArguments = ht, t.isArray = Zn, t.isBoolean = kt, t.isDate = It, t.isElement = Et, t.isEmpty = At, t.isEqual = xt, t.isFinite = Pt, t.isFunction = Ot, t.isNaN = Rt, t.isNull = Tt, t.isNumber = Nt, t.isObject = Bt, t.isPlainObject = ci, t.isRegExp = jt, t.isString = Ct, t.isUndefined = Mt, t.lastIndexOf = wr, t.mixin = Zr, t.noConflict = $r, t.noop = en, t.now = bi, t.parseInt = gi, t.random = rn, t.reduce = rr, t.reduceRight = nr, t.result = nn, t.runInContext = b, t.size = ar, t.some = fr, t.sortedIndex = Ar, t.template = sn, t.unescape = an, t.uniqueId = fn, t.all = Jt, t.any = fr, t.detect = Wt, t.findWhere = Wt, t.foldl = rr, t.foldr = nr, t.include = Vt, t.inject = rr, Zr(function() {
                        var e = {};
                        return fi(t, function(r, n) {
                            t.prototype[n] || (e[n] = r)
                        }), e
                    }(), !1), t.first = br, t.last = _r, t.sample = sr, t.take = br, t.head = br, fi(t, function(e, n) {
                        var i = "sample" !== n;
                        t.prototype[n] || (t.prototype[n] = function(t, n) {
                            var s = this.__chain__,
                                o = e(this.__wrapped__, t, n);
                            return s || null != t && (!n || i && "function" == typeof t) ? new r(o, s) : o
                        })
                    }), t.VERSION = "2.4.1", t.prototype.chain = dn, t.prototype.toString = hn, t.prototype.value = pn, t.prototype.valueOf = pn, Xt(["join", "pop", "shift"], function(e) {
                        var n = In[e];
                        t.prototype[e] = function() {
                            var e = this.__chain__,
                                t = n.apply(this.__wrapped__, arguments);
                            return e ? new r(t, e) : t
                        }
                    }), Xt(["push", "reverse", "sort", "unshift"], function(e) {
                        var r = In[e];
                        t.prototype[e] = function() {
                            return r.apply(this.__wrapped__, arguments), this
                        }
                    }), Xt(["concat", "slice", "splice"], function(e) {
                        var n = In[e];
                        t.prototype[e] = function() {
                            return new r(n.apply(this.__wrapped__, arguments), this.__chain__)
                        }
                    }), t
                }
                var g, y = [],
                    m = [],
                    v = 0,
                    _ = +new Date + "",
                    w = 75,
                    S = 40,
                    k = "   \f ﻿\n\r\u2028\u2029 ᠎             　",
                    I = /\b__p \+= '';/g,
                    E = /\b(__p \+=) '' \+/g,
                    A = /(__e\(.*?\)|\b__t\)) \+\n'';/g,
                    x = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,
                    P = /\w*$/,
                    O = /^\s*function[ \n\r\t]+\w/,
                    B = /<%=([\s\S]+?)%>/g,
                    R = RegExp("^[" + k + "]*0+(?=.$)"),
                    T = /($^)/,
                    N = /\bthis\b/,
                    j = /['\n\r\t\u2028\u2029\\]/g,
                    C = ["Array", "Boolean", "Date", "Function", "Math", "Number", "Object", "RegExp", "String", "_", "attachEvent", "clearTimeout", "isFinite", "isNaN", "parseInt", "setTimeout"],
                    M = 0,
                    U = "[object Arguments]",
                    z = "[object Array]",
                    D = "[object Boolean]",
                    L = "[object Date]",
                    F = "[object Function]",
                    H = "[object Number]",
                    K = "[object Object]",
                    q = "[object RegExp]",
                    V = "[object String]",
                    J = {};
                J[F] = !1, J[U] = J[z] = J[D] = J[L] = J[H] = J[K] = J[q] = J[V] = !0;
                var Y = {
                        leading: !1,
                        maxWait: 0,
                        trailing: !1
                    },
                    W = {
                        configurable: !1,
                        enumerable: !1,
                        value: null,
                        writable: !1
                    },
                    G = {
                        "boolean": !1,
                        "function": !0,
                        object: !0,
                        number: !1,
                        string: !1,
                        undefined: !1
                    },
                    X = {
                        "\\": "\\",
                        "'": "'",
                        "\n": "n",
                        "\r": "r",
                        " ": "t",
                        "\u2028": "u2028",
                        "\u2029": "u2029"
                    },
                    Q = G[typeof window] && window || this,
                    Z = G[typeof r] && r && !r.nodeType && r,
                    $ = G[typeof t] && t && !t.nodeType && t,
                    et = $ && $.exports === Z && Z,
                    tt = G[typeof e] && e;
                !tt || tt.global !== tt && tt.window !== tt || (Q = tt);
                var rt = b();
                "function" == typeof define && "object" == typeof define.amd && define.amd ? (Q._ = rt, define(function() {
                    return rt
                })) : Z && $ ? et ? ($.exports = rt)._ = rt : Z._ = rt : Q._ = rt
            }).call(this)
        }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {}],
    234: [function(e, t) {
        (function(r) {
            var n = e("./word-array"),
                i = function() {
                    function e() {}
                    return {
                        extend: function(t) {
                            e.prototype = this;
                            var r = new e;
                            return t && r.mixIn(t), r.hasOwnProperty("init") || (r.init = function() {
                                r.$super.init.apply(this, arguments)
                            }), r.init.prototype = r, r.$super = this, r
                        },
                        create: function() {
                            var e = this.extend();
                            return e.init.apply(e, arguments), e
                        },
                        init: function() {},
                        mixIn: function(e) {
                            for (var t in e) e.hasOwnProperty(t) && (this[t] = e[t]);
                            e.hasOwnProperty("toString") && (this.toString = e.toString)
                        },
                        clone: function() {
                            return this.init.prototype.extend(this)
                        }
                    }
                }(),
                s = i.extend({
                    reset: function() {
                        this._data = new n, this._nDataBytes = 0
                    },
                    _append: function(e) {
                        r.isBuffer(e) && (e = n.fromBuffer(e)), this._data.concat(e), this._nDataBytes += e.sigBytes
                    },
                    _process: function(e) {
                        var t = this._data,
                            r = t.words,
                            i = t.sigBytes,
                            s = this.blockSize,
                            o = 4 * s,
                            a = i / o;
                        a = e ? Math.ceil(a) : Math.max((0 | a) - this._minBufferSize, 0);
                        var f = a * s,
                            c = Math.min(4 * f, i);
                        if (f) {
                            for (var u = 0; f > u; u += s) this._doProcessBlock(r, u);
                            var d = r.splice(0, f);
                            t.sigBytes -= c
                        }
                        return new n(d, c)
                    },
                    clone: function() {
                        var e = i.clone.call(this);
                        return e._data = this._data.clone(), e
                    },
                    _minBufferSize: 0
                }),
                o = s.extend({
                    cfg: i.extend(),
                    init: function(e) {
                        this.cfg = this.cfg.extend(e), this.reset()
                    },
                    reset: function() {
                        s.reset.call(this), this._doReset()
                    },
                    update: function(e) {
                        return "string" == typeof e && (e = n.fromBuffer(new r(e, "utf8"))), r.isBuffer(e) && (e = n.fromBuffer(e)), this._append(e), this._process(), this
                    },
                    finalize: function(e) {
                        "string" == typeof e && (e = n.fromBuffer(new r(e, "utf8"))), r.isBuffer(e) && (e = n.fromBuffer(e)), e && this._append(e);
                        var t = this._doFinalize();
                        return t.toBuffer()
                    },
                    blockSize: 16,
                    _createHelper: function(e) {
                        return function(t, r) {
                            return new e.init(r).finalize(t)
                        }
                    }
                });
            t.exports.Hasher = o
        }).call(this, e("buffer").Buffer)
    }, {
        "./word-array": 238,
        buffer: 43
    }],
    235: [function(e, t) {
        (function(r) {
            function n(e) {
                if (!(this instanceof n)) return new n(e);
                var t = this._hasher = new i.init;
                "string" == typeof e && (e = s.fromBuffer(new r(e, "utf8"))), r.isBuffer(e) && (e = s.fromBuffer(e));
                var o = t.blockSize,
                    a = 4 * o;
                e.sigBytes > a && (e = t.finalize(e)), e.clamp();
                for (var f = this._oKey = e.clone(), c = this._iKey = e.clone(), u = f.words, d = c.words, h = 0; o > h; h++) u[h] ^= 1549556828, d[h] ^= 909522486;
                f.sigBytes = c.sigBytes = a, this.reset()
            }
            var i = e("./sha512").sha512,
                s = e("./word-array");
            n.prototype.reset = function() {
                var e = this._hasher;
                e.reset(), e.update(this._iKey)
            }, n.prototype.update = function(e) {
                return "string" == typeof e && (e = s.fromBuffer(new r(e, "utf8"))), r.isBuffer(e) && (e = s.fromBuffer(e)), this._hasher.update(e), this
            }, n.prototype.finalize = function(e) {
                "string" == typeof e && (e = s.fromBuffer(new r(e, "utf8"))), r.isBuffer(e) && (e = s.fromBuffer(e));
                var t = this._hasher,
                    n = t.finalize(e);
                t.reset();
                var i = t.finalize(this._oKey.clone().concat(n));
                return i
            }, t.exports = n
        }).call(this, e("buffer").Buffer)
    }, {
        "./sha512": 237,
        "./word-array": 238,
        buffer: 43
    }],
    236: [function(e, t) {
        t.exports = e("./sha512"), t.exports.hmac = e("./hmac")
    }, {
        "./hmac": 235,
        "./sha512": 237
    }],
    237: [function(e, t) {
        var r = e("./cryptojs").Hasher,
            n = e("./x64"),
            i = n.Word,
            s = n.WordArray,
            o = [i(1116352408, 3609767458), i(1899447441, 602891725), i(3049323471, 3964484399), i(3921009573, 2173295548), i(961987163, 4081628472), i(1508970993, 3053834265), i(2453635748, 2937671579), i(2870763221, 3664609560), i(3624381080, 2734883394), i(310598401, 1164996542), i(607225278, 1323610764), i(1426881987, 3590304994), i(1925078388, 4068182383), i(2162078206, 991336113), i(2614888103, 633803317), i(3248222580, 3479774868), i(3835390401, 2666613458), i(4022224774, 944711139), i(264347078, 2341262773), i(604807628, 2007800933), i(770255983, 1495990901), i(1249150122, 1856431235), i(1555081692, 3175218132), i(1996064986, 2198950837), i(2554220882, 3999719339), i(2821834349, 766784016), i(2952996808, 2566594879), i(3210313671, 3203337956), i(3336571891, 1034457026), i(3584528711, 2466948901), i(113926993, 3758326383), i(338241895, 168717936), i(666307205, 1188179964), i(773529912, 1546045734), i(1294757372, 1522805485), i(1396182291, 2643833823), i(1695183700, 2343527390), i(1986661051, 1014477480), i(2177026350, 1206759142), i(2456956037, 344077627), i(2730485921, 1290863460), i(2820302411, 3158454273), i(3259730800, 3505952657), i(3345764771, 106217008), i(3516065817, 3606008344), i(3600352804, 1432725776), i(4094571909, 1467031594), i(275423344, 851169720), i(430227734, 3100823752), i(506948616, 1363258195), i(659060556, 3750685593), i(883997877, 3785050280), i(958139571, 3318307427), i(1322822218, 3812723403), i(1537002063, 2003034995), i(1747873779, 3602036899), i(1955562222, 1575990012), i(2024104815, 1125592928), i(2227730452, 2716904306), i(2361852424, 442776044), i(2428436474, 593698344), i(2756734187, 3733110249), i(3204031479, 2999351573), i(3329325298, 3815920427), i(3391569614, 3928383900), i(3515267271, 566280711), i(3940187606, 3454069534), i(4118630271, 4000239992), i(116418474, 1914138554), i(174292421, 2731055270), i(289380356, 3203993006), i(460393269, 320620315), i(685471733, 587496836), i(852142971, 1086792851), i(1017036298, 365543100), i(1126000580, 2618297676), i(1288033470, 3409855158), i(1501505948, 4234509866), i(1607167915, 987167468), i(1816402316, 1246189591)],
            a = [];
        ! function() {
            for (var e = 0; 80 > e; e++) a[e] = i()
        }();
        var f = r.extend({
            _doReset: function() {
                this._hash = new s([i(1779033703, 4089235720), i(3144134277, 2227873595), i(1013904242, 4271175723), i(2773480762, 1595750129), i(1359893119, 2917565137), i(2600822924, 725511199), i(528734635, 4215389547), i(1541459225, 327033209)])
            },
            _doProcessBlock: function(e, t) {
                for (var r = this._hash.words, n = r[0], i = r[1], s = r[2], f = r[3], c = r[4], u = r[5], d = r[6], h = r[7], p = n.high, l = n.low, b = i.high, g = i.low, y = s.high, m = s.low, v = f.high, _ = f.low, w = c.high, S = c.low, k = u.high, I = u.low, E = d.high, A = d.low, x = h.high, P = h.low, O = p, B = l, R = b, T = g, N = y, j = m, C = v, M = _, U = w, z = S, D = k, L = I, F = E, H = A, K = x, q = P, V = 0; 80 > V; V++) {
                    var J = a[V];
                    if (16 > V) var Y = J.high = 0 | e[t + 2 * V],
                        W = J.low = 0 | e[t + 2 * V + 1];
                    else {
                        var G = a[V - 15],
                            X = G.high,
                            Q = G.low,
                            Z = (X >>> 1 | Q << 31) ^ (X >>> 8 | Q << 24) ^ X >>> 7,
                            $ = (Q >>> 1 | X << 31) ^ (Q >>> 8 | X << 24) ^ (Q >>> 7 | X << 25),
                            et = a[V - 2],
                            tt = et.high,
                            rt = et.low,
                            nt = (tt >>> 19 | rt << 13) ^ (tt << 3 | rt >>> 29) ^ tt >>> 6,
                            it = (rt >>> 19 | tt << 13) ^ (rt << 3 | tt >>> 29) ^ (rt >>> 6 | tt << 26),
                            st = a[V - 7],
                            ot = st.high,
                            at = st.low,
                            ft = a[V - 16],
                            ct = ft.high,
                            ut = ft.low,
                            W = $ + at,
                            Y = Z + ot + ($ >>> 0 > W >>> 0 ? 1 : 0),
                            W = W + it,
                            Y = Y + nt + (it >>> 0 > W >>> 0 ? 1 : 0),
                            W = W + ut,
                            Y = Y + ct + (ut >>> 0 > W >>> 0 ? 1 : 0);
                        J.high = Y, J.low = W
                    }
                    var dt = U & D ^ ~U & F,
                        ht = z & L ^ ~z & H,
                        pt = O & R ^ O & N ^ R & N,
                        lt = B & T ^ B & j ^ T & j,
                        bt = (O >>> 28 | B << 4) ^ (O << 30 | B >>> 2) ^ (O << 25 | B >>> 7),
                        gt = (B >>> 28 | O << 4) ^ (B << 30 | O >>> 2) ^ (B << 25 | O >>> 7),
                        yt = (U >>> 14 | z << 18) ^ (U >>> 18 | z << 14) ^ (U << 23 | z >>> 9),
                        mt = (z >>> 14 | U << 18) ^ (z >>> 18 | U << 14) ^ (z << 23 | U >>> 9),
                        vt = o[V],
                        _t = vt.high,
                        wt = vt.low,
                        St = q + mt,
                        kt = K + yt + (q >>> 0 > St >>> 0 ? 1 : 0),
                        St = St + ht,
                        kt = kt + dt + (ht >>> 0 > St >>> 0 ? 1 : 0),
                        St = St + wt,
                        kt = kt + _t + (wt >>> 0 > St >>> 0 ? 1 : 0),
                        St = St + W,
                        kt = kt + Y + (W >>> 0 > St >>> 0 ? 1 : 0),
                        It = gt + lt,
                        Et = bt + pt + (gt >>> 0 > It >>> 0 ? 1 : 0);
                    K = F, q = H, F = D, H = L, D = U, L = z, z = M + St | 0, U = C + kt + (M >>> 0 > z >>> 0 ? 1 : 0) | 0, C = N, M = j, N = R, j = T, R = O, T = B, B = St + It | 0, O = kt + Et + (St >>> 0 > B >>> 0 ? 1 : 0) | 0
                }
                l = n.low = l + B, n.high = p + O + (B >>> 0 > l >>> 0 ? 1 : 0), g = i.low = g + T, i.high = b + R + (T >>> 0 > g >>> 0 ? 1 : 0), m = s.low = m + j, s.high = y + N + (j >>> 0 > m >>> 0 ? 1 : 0), _ = f.low = _ + M, f.high = v + C + (M >>> 0 > _ >>> 0 ? 1 : 0), S = c.low = S + z, c.high = w + U + (z >>> 0 > S >>> 0 ? 1 : 0), I = u.low = I + L, u.high = k + D + (L >>> 0 > I >>> 0 ? 1 : 0), A = d.low = A + H, d.high = E + F + (H >>> 0 > A >>> 0 ? 1 : 0), P = h.low = P + q, h.high = x + K + (q >>> 0 > P >>> 0 ? 1 : 0)
            },
            _doFinalize: function() {
                var e = this._data,
                    t = e.words,
                    r = 8 * this._nDataBytes,
                    n = 8 * e.sigBytes;
                t[n >>> 5] |= 128 << 24 - n % 32, t[(n + 128 >>> 10 << 5) + 30] = Math.floor(r / 4294967296), t[(n + 128 >>> 10 << 5) + 31] = r, e.sigBytes = 4 * t.length, this._process();
                var i = this._hash.toX32();
                return i
            },
            clone: function() {
                var e = r.clone.call(this);
                return e._hash = this._hash.clone(), e
            },
            blockSize: 32
        });
        t.exports = r._createHelper(f), t.exports.sha512 = f
    }, {
        "./cryptojs": 234,
        "./x64": 239
    }],
    238: [function(e, t) {
        (function(e, r) {
            function n(e, t) {
                this.words = e || [], this.sigBytes = void 0 != t ? t : 4 * this.words.length
            }
            t.exports = n, n.prototype.concat = function(e) {
                r.isBuffer(e) && (e = n.fromBuffer(e));
                var t = this.words,
                    i = e.words,
                    s = this.sigBytes,
                    o = e.sigBytes;
                if (this.clamp(), s % 4)
                    for (var a = 0; o > a; a++) {
                        var f = i[a >>> 2] >>> 24 - a % 4 * 8 & 255;
                        t[s + a >>> 2] |= f << 24 - (s + a) % 4 * 8
                    } else if (i.length > 65535)
                        for (var a = 0; o > a; a += 4) t[s + a >>> 2] = i[a >>> 2];
                    else t.push.apply(t, i);
                return this.sigBytes += o, this
            }, n.prototype.clamp = function() {
                var e = this.words,
                    t = this.sigBytes;
                e[t >>> 2] &= 4294967295 << 32 - t % 4 * 8, e.length = Math.ceil(t / 4)
            }, n.prototype.clone = function() {
                var e = new n(this.words.slice(0));
                return e
            }, n.prototype.toBuffer = function() {
                for (var e = new r(4 * this.words.length), t = 0; t < this.words.length; ++t) {
                    var n = this.words[t];
                    e.writeUInt32BE(n, 4 * t, !0)
                }
                return e
            }, n.fromBuffer = function(t) {
                var r = t.length,
                    i = r % 4,
                    s = [];
                if (e.browser) {
                    for (var o = 0; r - i > o; o += 4) {
                        var a = t.readUInt32BE(o);
                        s.push(a)
                    }
                    for (var f = 0, c = r - i, u = 0; i > u; u += 1) f |= t.readUInt8(c + u) << 8 * (3 - u);
                    return i > 0 && s.push(f), new n(s, t.length)
                }
                for (var o = 0; r > o; o += 4) {
                    var a = t.readUInt32BE(o, !0);
                    s.push(a)
                }
                return new n(s, t.length)
            }
        }).call(this, e("_process"), e("buffer").Buffer)
    }, {
        _process: 187,
        buffer: 43
    }],
    239: [function(e, t) {
        function r(e, t) {
            return this instanceof r ? (this.high = e, void(this.low = t)) : new r(e, t)
        }

        function n(e) {
            this.words = e || []
        }
        var i = e("./word-array");
        n.prototype.toX32 = function() {
            for (var e = this.words, t = e.length, r = [], n = 0; t > n; n++) {
                var s = e[n];
                r.push(s.high), r.push(s.low)
            }
            return new i(r, this.sigBytes)
        }, t.exports.Word = r, t.exports.WordArray = n
    }, {
        "./word-array": 238
    }],
    240: [function(e, t) {
        t.exports = {
            name: "bitcore",
            version: "0.9.2",
            description: "A pure and powerful JavaScript Bitcoin library.",
            author: "BitPay <dev@bitpay.com>",
            main: "index.js",
            scripts: {
                lint: "gulp lint",
                test: "gulp test",
                coverage: "gulp coverage",
                build: "gulp"
            },
            contributors: [{
                name: "Daniel Cousens",
                email: "bitcoin@dcousens.com"
            }, {
                name: "Esteban Ordano",
                email: "eordano@gmail.com"
            }, {
                name: "Gordon Hall",
                email: "gordon@bitpay.com"
            }, {
                name: "Jeff Garzik",
                email: "jgarzik@bitpay.com"
            }, {
                name: "Kyle Drake",
                email: "kyle@kyledrake.net"
            }, {
                name: "Manuel Araoz",
                email: "manuelaraoz@gmail.com"
            }, {
                name: "Matias Alejo Garcia",
                email: "ematiu@gmail.com"
            }, {
                name: "Ryan X. Charles",
                email: "ryanxcharles@gmail.com"
            }, {
                name: "Stefan Thomas",
                email: "moon@justmoon.net"
            }, {
                name: "Stephen Pair",
                email: "stephen@bitpay.com"
            }, {
                name: "Wei Lu",
                email: "luwei.here@gmail.com"
            }],
            keywords: ["bitcoin", "bip32", "bip37", "bip70", "merge", "multisig"],
            repository: {
                type: "git",
                url: "https://github.com/bitpay/bitcore.git"
            },
            browser: {
                request: "browser-request"
            },
            dependencies: {
                "bn.js": "=0.16.1",
                bs58: "=2.0.0",
                elliptic: "=0.16.0",
                "hash.js": "=0.3.2",
                inherits: "=2.0.1",
                lodash: "=2.4.1",
                sha512: "=0.0.1"
            },
            devDependencies: {
                "bitcore-build": "git://github.com/bitpay/bitcore-build.git",
                brfs: "^1.2.0",
                chai: "^1.10.0",
                gulp: "^3.8.10"
            },
            license: "MIT"
        }
    }, {}],
    bitcore: [function(e, t) {
        (function(r) {
            var n = t.exports;
            n.crypto = {}, n.crypto.BN = e("./lib/crypto/bn"), n.crypto.ECDSA = e("./lib/crypto/ecdsa"), n.crypto.Hash = e("./lib/crypto/hash"), n.crypto.Random = e("./lib/crypto/random"), n.crypto.Point = e("./lib/crypto/point"), n.crypto.Signature = e("./lib/crypto/signature"), n.encoding = {}, n.encoding.Base58 = e("./lib/encoding/base58"), n.encoding.Base58Check = e("./lib/encoding/base58check"), n.encoding.BufferReader = e("./lib/encoding/bufferreader"), n.encoding.BufferWriter = e("./lib/encoding/bufferwriter"), n.encoding.Varint = e("./lib/encoding/varint"), n.util = {}, n.util.buffer = e("./lib/util/buffer"), n.util.js = e("./lib/util/js"), n.util.preconditions = e("./lib/util/preconditions"), n.errors = e("./lib/errors"), n.Address = e("./lib/address"), n.Block = e("./lib/block"), n.BlockHeader = e("./lib/blockheader"), n.HDPrivateKey = e("./lib/hdprivatekey.js"), n.HDPublicKey = e("./lib/hdpublickey.js"), n.Networks = e("./lib/networks"), n.Opcode = e("./lib/opcode"), n.PrivateKey = e("./lib/privatekey"), n.PublicKey = e("./lib/publickey"), n.Script = e("./lib/script"), n.Transaction = e("./lib/transaction"), n.URI = e("./lib/uri"), n.Unit = e("./lib/unit"), n.deps = {}, n.deps.bnjs = e("bn.js"), n.deps.bs58 = e("bs58"), n.deps.Buffer = r, n.deps.elliptic = e("elliptic"), n._HDKeyCache = e("./lib/hdkeycache"), n.version = "v" + e("./package.json").version
        }).call(this, e("buffer").Buffer)
    }, {
        "./lib/address": 1,
        "./lib/block": 2,
        "./lib/blockheader": 3,
        "./lib/crypto/bn": 4,
        "./lib/crypto/ecdsa": 5,
        "./lib/crypto/hash": 6,
        "./lib/crypto/point": 7,
        "./lib/crypto/random": 8,
        "./lib/crypto/signature": 9,
        "./lib/encoding/base58": 10,
        "./lib/encoding/base58check": 11,
        "./lib/encoding/bufferreader": 12,
        "./lib/encoding/bufferwriter": 13,
        "./lib/encoding/varint": 14,
        "./lib/errors": 15,
        "./lib/hdkeycache": 17,
        "./lib/hdprivatekey.js": 18,
        "./lib/hdpublickey.js": 19,
        "./lib/networks": 20,
        "./lib/opcode": 21,
        "./lib/privatekey": 22,
        "./lib/publickey": 23,
        "./lib/script": 24,
        "./lib/transaction": 27,
        "./lib/unit": 36,
        "./lib/uri": 37,
        "./lib/util/buffer": 38,
        "./lib/util/js": 39,
        "./lib/util/preconditions": 40,
        "./package.json": 240,
        "bn.js": 210,
        bs58: 211,
        buffer: 43,
        elliptic: 212
    }]
}, {}, []);

module.exports = required;
