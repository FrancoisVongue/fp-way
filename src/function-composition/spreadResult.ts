export function spreadResult(fns, arg) {
    const resultArr = [];

    for(let i = 0; i < fns.length; i++) {
        resultArr.push(fns[i](arg));
    }

    return resultArr;
}
