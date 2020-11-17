export const ArrayOf = (...v) => [...v];
export const ArrayOfLength = (n, v=0) => (new Array(n)).map(v => v);
export const ArrayOfRange = (start, finish) => {
    const newArr = [];
    const orderIsNegative = finish < start;
    const length = Math.abs(start - finish) + 1;
    const incBy = orderIsNegative ? -1 : 1;

    for(let i = 0; i < length; i++) {
        newArr.push(start + incBy);
    }

    return newArr;
};
