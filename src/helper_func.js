export function sortItems(itemList, sortMethod){
    switch (sortMethod) {
        case 'az':
            return itemList.sort((a, b) => a.name.localeCompare(b.name));
        case 'za':
            return itemList.sort((a, b) => b.name.localeCompare(a.name));
        case 'lohi':
            return itemList.sort((a, b) => a.price - b.price);
        case 'hilo':
            return itemList.sort((a, b) => b.price - a.price);
        default:
            return itemList;
    }
}

export function calculateRandomIndexItems(amount){
    let selectIndexItems= new Set([]);
    while (selectIndexItems.size < amount) {
        const randomIndex = Math.floor(Math.random() * amount);
        selectIndexItems.add(randomIndex);
    }
    return Array.from(selectIndexItems);
}
export async function getItemsListData(items) {
    return Promise.all(items.map(async (item) => {
        const name = await item.locator('.inventory_item_name').textContent();
        const description = await item.locator('.inventory_item_desc').textContent();
        let price = await item.locator('.inventory_item_price').textContent();
        price = price.replace('$', '');
        return {
            name,
            description,
            price,
        };
    }));
}