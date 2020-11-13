export const toString = v => JSON.stringify(v);
export const occurrencesOf = (unvalidatedRegex, str) => {
    const regex = new RegExp(unvalidatedRegex as RegExp, 'g');
    return (str as string).match(regex);
};