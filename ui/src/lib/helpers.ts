
export const nthFlatten = (original: string[], chunkSize = 2) => {
    const start = [...original]
    const final = [];
    for (let i = 0; i < start.length; i += chunkSize) {
        if (!start[i + (chunkSize-1)])
            break;
        final.push(`${start[i]} ${start[i + 1]}`);
    }
    return final
}