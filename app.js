/* Imports */
// this will check if we have a user and set signout link if it exists
import './auth/user.js';
import { buyItem, createListItem, getListItems, deleteAllItems } from './fetch-utils.js';

/* Get DOM Elements */
const form = document.querySelector('.create-form');
const deleteBtn = document.querySelector('#delete-btn');
const listEl = document.querySelector('.list');
const error = document.querySelector('#error');

/* State */

/* Events */
window.addEventListener('load', async () => {
    await fetchAndDisplayList();
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const quantity = data.get('quantity');
    const item = data.get('item');

    form.reset();

    const newItem = await createListItem(quantity, item);
    if (newItem) {
        fetchAndDisplayList();
    } else {
        error.textContent = 'Warning! An error has occurred while updating your shopping list';
    }

    fetchAndDisplayList();
});

deleteBtn.addEventListener('click', async () => {
    await deleteAllItems();
    await fetchAndDisplayList();
});

/* Display Functions */
async function fetchAndDisplayList() {
    const list = await getListItems();
    listEl.textContent = '';

    for (let item of list) {
        const listItemEl = document.createElement('p');
        listItemEl.classList.add('list-item');
        listItemEl.textContent = `${item.quantity}: ${item.item}`;

        if (item.complete) {
            listItemEl.classList.add('bought');
        } else {
            listItemEl.classList.add('not-bought');
            listItemEl.addEventListener('click', async () => {
                await buyItem(item.id);

                fetchAndDisplayList();
            });
        }
        listEl.append(listItemEl);
    }
}
