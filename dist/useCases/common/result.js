"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ok = ok;
exports.err = err;
function ok(value) {
    return new Ok(value);
}
function err(error) {
    return new Err(error);
}
class Ok {
    constructor(value) {
        this.value = value;
    }
    isOk() {
        return true;
    }
    isErr() {
        return false;
    }
    ok() {
        return this.value;
    }
    err() {
        return null;
    }
    unwrap() {
        return this.value;
    }
    unwrapErr() {
        throw new Error('Tried to unwrapErr() from Ok');
    }
}
class Err {
    constructor(error) {
        this.error = error;
    }
    isOk() {
        return false;
    }
    isErr() {
        return true;
    }
    ok() {
        return null;
    }
    err() {
        return this.error;
    }
    unwrap() {
        throw new Error('Tried to unwrap() from Err');
    }
    unwrapErr() {
        return this.error;
    }
}
//# sourceMappingURL=result.js.map