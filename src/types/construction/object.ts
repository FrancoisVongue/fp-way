export const objectFromEntries = entries => {
    const result = {};
    for(let i = 0; i < entries.length; i++ ) {
        result[entries[i][0]] = entries[i][1];
    }
    return result;
}
