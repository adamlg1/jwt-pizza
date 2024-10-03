import { test, expect } from 'playwright-test-coverage';

test('home page', async ({ page }) => {
    await page.goto('/');

    expect(await page.title()).toBe('JWT Pizza');
});

test('purchase with login', async ({ page }) => {
    await page.route('*/**/api/order/menu', async (route) => {
        const menuRes = [
            { id: 1, title: 'Veggie', image: 'pizza1.png', price: 0.0038, description: 'A garden of delight' },
            { id: 2, title: 'Pepperoni', image: 'pizza2.png', price: 0.0042, description: 'Spicy treat' },
        ];
        expect(route.request().method()).toBe('GET');
        await route.fulfill({ json: menuRes });
    });

    await page.route('*/**/api/franchise', async (route) => {
        const franchiseRes = [
            {
                id: 2,
                name: 'LotaPizza',
                stores: [
                    { id: 4, name: 'Lehi' },
                    { id: 5, name: 'Springville' },
                    { id: 6, name: 'American Fork' },
                ],
            },
            { id: 3, name: 'PizzaCorp', stores: [{ id: 7, name: 'Spanish Fork' }] },
            { id: 4, name: 'topSpot', stores: [] },
        ];
        expect(route.request().method()).toBe('GET');
        await route.fulfill({ json: franchiseRes });
    });

    await page.route('*/**/api/auth', async (route) => {
        const loginReq = { email: 'd@jwt.com', password: 'a' };
        const loginRes = { user: { id: 3, name: 'Kai Chen', email: 'd@jwt.com', roles: [{ role: 'diner' }] }, token: 'abcdef' };
        expect(route.request().method()).toBe('PUT');
        expect(route.request().postDataJSON()).toMatchObject(loginReq);
        await route.fulfill({ json: loginRes });
    });

    await page.route('*/**/api/order', async (route) => {
        const orderReq = {
            items: [
                { menuId: 1, description: 'Veggie', price: 0.0038 },
                { menuId: 2, description: 'Pepperoni', price: 0.0042 },
            ],
            storeId: '4',
            franchiseId: 2,
        };
        const orderRes = {
            order: {
                items: [
                    { menuId: 1, description: 'Veggie', price: 0.0038 },
                    { menuId: 2, description: 'Pepperoni', price: 0.0042 },
                ],
                storeId: '4',
                franchiseId: 2,
                id: 23,
            },
            jwt: 'eyJpYXQ',
        };
        expect(route.request().method()).toBe('POST');
        expect(route.request().postDataJSON()).toMatchObject(orderReq);
        await route.fulfill({ json: orderRes });
    });

    await page.goto('http://localhost:5173/');

    // Go to order page
    await page.getByRole('button', { name: 'Order now' }).click();

    // Create order
    await expect(page.locator('h2')).toContainText('Awesome is a click away');
    await page.getByRole('combobox').selectOption('4');
    await page.getByRole('link', { name: 'Image Description Veggie A' }).click();
    await page.getByRole('link', { name: 'Image Description Pepperoni' }).click();
    await expect(page.locator('form')).toContainText('Selected pizzas: 2');
    await page.getByRole('button', { name: 'Checkout' }).click();

    // Login
    await page.getByPlaceholder('Email address').click();
    await page.getByPlaceholder('Email address').fill('d@jwt.com');
    await page.getByPlaceholder('Email address').press('Tab');
    await page.getByPlaceholder('Password').fill('a');
    await page.getByRole('button', { name: 'Login' }).click();

    // Pay
    await expect(page.getByRole('main')).toContainText('Send me those 2 pizzas right now!');
    await expect(page.locator('tbody')).toContainText('Veggie');
    await expect(page.locator('tbody')).toContainText('Pepperoni');
    await expect(page.locator('tfoot')).toContainText('0.008 ₿');
    await page.getByRole('button', { name: 'Pay now' }).click();

    // Check balance
    await expect(page.getByText('0.008')).toBeVisible();
});

test('register', async ({ page }) => {
    await page.route('*/**/api/auth', async (route) => {
        const registerReq = { name: 'joe', email: 'joe@joe.com', password: 'joe' };
        const registerRes = { user: { id: 3, name: 'joe', email: 'joe@joe.com', roles: [{ role: 'diner' }] } };
        expect(route.request().method()).toBe('POST');
        expect(route.request().postDataJSON()).toMatchObject(registerReq);
        await route.fulfill({ json: registerRes });
    });
    await page.goto('http://localhost:5173/');
    await expect(page.getByRole('main')).toContainText('Pizza is an absolute delight that brings joy to people of all ages. The perfect combination of crispy crust, savory sauce, and gooey cheese makes pizza an irresistible treat. At JWT Pizza, we take pride in serving the web\'s best pizza, crafted with love and passion. Our skilled chefs use only the finest ingredients to create mouthwatering pizzas that will leave you craving for more. Whether you prefer classic flavors or adventurous toppings, our diverse menu has something for everyone. So why wait? Indulge in the pizza experience of a lifetime and visit JWT Pizza today!');
    await expect(page.getByRole('heading')).toContainText('The web\'s best pizza');
    await expect(page.getByLabel('Global').locator('span')).toContainText('JWT Pizza');
    await expect(page.locator('#navbar-dark')).toContainText('Login');
    await page.getByRole('link', { name: 'Login' }).click();
    await expect(page.getByRole('heading')).toContainText('Welcome back');
    await expect(page.locator('form')).toContainText('Are you new? Register instead.');
    await page.getByPlaceholder('Email address').click();
    await page.getByRole('main').getByText('Register').click();
    await page.getByPlaceholder('Full name').fill('joe');
    await page.getByPlaceholder('Email address').click();
    const email = `joe@joe.com`;
    await page.getByPlaceholder('Email address').fill(email);
    // await page.getByPlaceholder('Email address').fill('joe@joe.com');
    await page.getByPlaceholder('Password').click();
    await page.getByPlaceholder('Password').fill('joe');
    await expect(page.getByRole('button', { name: 'Register' })).toBeVisible();
    await expect(page.getByRole('heading')).toContainText('Welcome to the party');
    await page.getByRole('button', { name: 'Register' }).click();
})


test('logout', async ({ page }) => {
    await page.route('*/**/api/auth', async (route) => {
        const loginReq = { email: 'joe@joe.com', password: 'joe' };
        const loginRes = { user: { id: 2, name: 'ingles', email: 'joe@joe.com', roles: [{ role: 'diner' }] } };
        if (route.request().method() === 'PUT') {
            expect(route.request().method()).toBe('PUT');
            expect(route.request().postDataJSON()).toMatchObject(loginReq);
            await route.fulfill({ json: loginRes });
        }
        else if (route.request().method() === 'DELETE') {
            const logoutRes = { message: 'logout successful' };
            expect(route.request().method()).toBe('DELETE');
            await route.fulfill({ json: logoutRes });
        }

    });
    await page.goto('http://localhost:5173/');
    await expect(page.locator('#navbar-dark')).toContainText('Login');
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByPlaceholder('Email address').fill('joe@joe.com');
    await page.getByPlaceholder('Password').click();
    await page.getByPlaceholder('Password').fill('joe');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.locator('#navbar-dark')).toContainText('Logout');
    await page.getByRole('link', { name: 'Logout' }).click();
});

test('failed login', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByPlaceholder('Email address').click();
    await page.getByPlaceholder('Email address').fill('admin');
    await page.getByPlaceholder('Email address').press('Tab');
    await page.getByPlaceholder('Password').fill('admin');
    await page.getByPlaceholder('Password').press('Enter');
    await page.getByPlaceholder('Email address').fill('admin@notadmin.com');
    await page.getByPlaceholder('Email address').press('Enter');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByRole('main')).toContainText('{"code":404,"message":"unknown user"}');
})


test('special franchise screen', async ({ page }) => {
    await page.route('*/**/api/auth', async (route) => {
        const loginReq = { email: 'j@jwt.com', password: 'a' };
        const loginRes = { user: { id: 3, name: 'Kai Chen', email: 'j@jwt.com', roles: [{ role: 'franchisee' }] } };
        expect(route.request().method()).toBe('PUT');
        expect(route.request().postDataJSON()).toMatchObject(loginReq);
        await route.fulfill({ json: loginRes });
    });
    await page.route('*/**/api/franchise', async (route) => {
        const franchiseRes = {
            id: 2,
            name: 'pizzaPlanet',
            admins:
            {
                id: 3,
                name: 'Kai Chen',
                email: 'j@jwt.com',
            },
            stores:
            {
                id: 37,
                name: "Provo",
                totalRevenue: 0.00000005,
            },
        };
        expect(route.request().method()).toBe('GET');
        await route.fulfill({ json: franchiseRes });
    })
    await page.route('*/**/api/frachise/2/store', async (route) => {
        const storeReq = { name: 'Lehi' };
        const storeRes = { id: 21, franchiseId: 2, name: 'Lehi' };
        expect(route.request().method()).toBe('POST');
        expect(route.request().postDataJSON()).toMatchObject(storeReq);
        await route.fulfill({ json: storeRes });
    })

    await page.goto('http://localhost:5173/');
    await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
    await page.getByRole('link', { name: 'login', exact: true }).click();
    await page.getByPlaceholder('Email address').click();
    await page.getByPlaceholder('Email address').fill('j@jwt.com');
    await page.getByPlaceholder('Password').click();
    await page.getByPlaceholder('Password').fill('a');
    await page.getByRole('button', { name: 'Login' }).click();

});


test('fake page', async ({ page }) => {
    await page.goto('http://localhost:5173/thisisnotarealpagelol');
    await expect(page.getByRole('main')).toContainText('It looks like we have dropped a pizza on the floor. Please try another page.');
    await expect(page.getByRole('heading')).toContainText('Oops');
});

test('about page', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await expect(page.getByRole('contentinfo')).toContainText('About');
    await expect(page.getByRole('link', { name: 'About' })).toBeVisible();
    await page.getByRole('link', { name: 'About' }).click();
    await expect(page.getByRole('main')).toContainText('The secret sauce');
    await expect(page.getByRole('main').getByRole('img').first()).toBeVisible();
    await expect(page.getByRole('main')).toContainText('Our talented employees at JWT Pizza are true artisans. They pour their heart and soul into every pizza they create, striving for perfection in every aspect. From hand-stretching the dough to carefully layering the toppings, they take pride in their work and are constantly seeking ways to elevate the pizza-making process. Their creativity and expertise shine through in every slice, resulting in a pizza that is not only delicious but also a work of art. We are grateful for our dedicated team and their unwavering commitment to delivering the most flavorful and satisfying pizzas to our valued customers.');
});

test('history page', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await expect(page.getByRole('link', { name: 'History' })).toBeVisible();
    await expect(page.getByRole('contentinfo')).toContainText('History');
    await page.getByRole('link', { name: 'History' }).click();
    await expect(page.getByRole('heading')).toContainText('Mama Rucci, my my');
    await expect(page.getByRole('main').getByRole('img')).toBeVisible();
});

test('docs page', async ({ page }) => {
    await page.goto('http://localhost:5173/docs');
    await expect(page.getByRole('main')).toContainText('JWT Pizza API');
    await expect(page.getByText('{ "user": { "id": 2, "name')).toBeVisible();
    await expect(page.getByText('{ "user": { "id": 1, "name')).toBeVisible();
    await expect(page.getByText('{ "id": 1, "name": "常用名字", "').nth(1)).toBeVisible();
    await expect(page.getByRole('main')).toContainText('curl localhost:3000/api/order/menu');
});