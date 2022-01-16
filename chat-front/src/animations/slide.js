export const slide = (node, { duration }) => {
    return {
        duration,
        css: (t, u) => {
            return `
                transform:translateY(${u * -20}px);
                opacity:${t}
            `
        }
    }
}
