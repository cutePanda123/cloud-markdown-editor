export const flattenArray = (array) => {
    return array.reduce((map, item) => {
        map[item.id] = item;
        return map;
    }, {});
};

export const objToArray = (obj) => {
    return Object.keys(obj).map(key => obj[key]);
};

export const getParentDomNode = (node, parentClassName) => {
    let current = node;
    while (current !== null) {
        if (current.classList.contains(parentClassName)) {
            return current;
        }
        current = current.parentNode;
    }
    return false;
};

export const formatTimeString = (time) => {
    const date = new Date(time);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
};