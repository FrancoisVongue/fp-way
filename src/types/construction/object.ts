export const ObjectFromEntries = entries => {
    const result = {};
    for(let entry of entries) {
        const prop = entry[0];
        result[prop] = entry[1];
    }
    return result;
}
