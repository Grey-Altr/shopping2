const SUPABASE_URL = 'https://pwsxvrnlhooihwcxftvf.supabase.co';
const SUPABASE_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3c3h2cm5saG9vaWh3Y3hmdHZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjgxMDg2MzQsImV4cCI6MTk4MzY4NDYzNH0.ITSI6KK7aGizRAaYZ1zCgnyVWSXCZKMfeSCKISd7IXg';
const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/* Auth related functions */

export function getUser() {
    return client.auth.user();
}

export async function signUpUser(email, password) {
    return await client.auth.signUp({
        email,
        password,
    });
}

export async function signInUser(email, password) {
    return await client.auth.signIn({
        email,
        password,
    });
}

export async function signOutUser() {
    return await client.auth.signOut();
}

/* Data functions */

function checkError({ data, error }) {
    // eslint-disable-next-line no-console
    return error ? console.error(error) : data;
}

export async function fetchItems() {
    const response = await client.from('shoplist').select().match({ user_id: getUser().id });

    return checkError(response);
}

export async function createListItem(quantity, item) {
    const response = await client
        .from('shoplist')
        .insert({ quantity, item, user_id: client.auth.user().id });
    return response.data;
}

export async function getListItems() {
    const response = await client.from('shoplist').select().match({ user_id: getUser().id });
    if (response.error) {
        console.error(response.error.message);
    } else {
        return response.data;
    }
}

export async function deleteAllItems() {
    const response = await client.from('shoplist').delete().match({ user_id: getUser().id });
    return checkError(response);
}

export async function buyItem(id) {
    const response = await client.from('shoplist').update({ complete: true }).match({ id: id });

    return checkError(response);
}
