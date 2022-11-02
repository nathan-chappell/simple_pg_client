let root = document.querySelector('#PROTOCOL-MESSAGE-FORMATS div.variableList dl')
let getDeflist = parent => {
    const result = [];
    const children = [...parent.children].filter(e => e.tagName == 'DD' || e.tagName == 'DT')
    for (let i = 0; i < children.length - 1; i += 2) {
        const dt = children[i];
        const dd = children[i+1];
        const title = dt.innerText;
        const next = dd.querySelector('dl');
        const definition = next === null ? dd.innerText : getDeflist(next);
        result.push({title, definition});
    }
    return result
}

getDeflist(root)