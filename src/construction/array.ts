export const ArrayOf = (...v) => [...v];
export const ArrayOfLength = (n, filler = 0) => Array(n).fill(filler);
export const ArrayOfRange = (start, finish) => {
    const orderIsNegative = finish < start;
    const direction = orderIsNegative ? -1 : 1;
    const length = Math.abs(start - finish) + 1;

    return ArrayOfLength(length).map((v, i) => i * direction + start)
};
