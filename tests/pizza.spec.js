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
    const randomString = Math.random().toString(36).substring(2, 7);
    const email = `user_${randomString}@email.com`;
    await page.getByPlaceholder('Email address').fill(email);
    // await page.getByPlaceholder('Email address').fill('joe@joe.com');
    await page.getByPlaceholder('Password').click();
    await page.getByPlaceholder('Password').fill('joe');
    await expect(page.getByRole('button', { name: 'Register' })).toBeVisible();
    await expect(page.getByRole('heading')).toContainText('Welcome to the party');
    await page.getByRole('button', { name: 'Register' }).click();
})

test('franchise page', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
    await page.getByText('Call now800-555-').click();
    await expect(page.getByRole('main')).toContainText('Call now800-555-5555');
    await expect(page.getByRole('main')).toContainText('So you want a piece of the pie?');
    await expect(page.getByRole('main').locator('img')).toBeVisible();
    await page.getByRole('link', { name: 'History' }).click();
    await expect(page.getByRole('heading')).toContainText('Mama Rucci, my my');
    await expect(page.getByRole('contentinfo')).toContainText('Franchise');
    await expect(page.getByRole('contentinfo').getByRole('link', { name: 'Franchise' })).toBeVisible();
    await page.getByRole('contentinfo').getByRole('link', { name: 'Franchise' }).click();
    await page.getByLabel('Global').getByRole('img').click();
    await page.getByText('JWT Pizza', { exact: true }).click();
    await page.getByRole('link', { name: 'home' }).click();
})

// test('logout', async ({ page }) => {
//     await page.goto('http://localhost:5173/');
//     await page.getByRole('link', { name: 'Login' }).click();
//     await page.getByPlaceholder('Email address').click();
//     await page.getByPlaceholder('Email address').fill('joe@joe.com');
//     await page.getByPlaceholder('Email address').press('Tab');
//     await page.getByPlaceholder('Password').fill('joe');
//     await page.getByPlaceholder('Password').press('Enter');
//     // await expect(page.getByRole('link', { name: 'Logout' })).toBeVisible();
//     await expect(page.locator('#navbar-dark')).toContainText('Logout');
//     await page.getByRole('link', { name: 'Logout' }).click();
//     await page.getByRole('link', { name: 'Login' }).click();
//     await page.getByPlaceholder('Email address').fill('joe@joe.com');
//     await page.getByPlaceholder('Email address').press('Tab');
//     await page.getByPlaceholder('Password').fill('joe');
//     await page.getByPlaceholder('Password').press('Enter');
//     await page.getByRole('link', { name: 'Logout' }).click();
// })

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
    await page.getByRole('button', { name: 'Login' }).click();
    // await expect(page.getByRole('main')).toContainText('{"code":404,"message":"unknown user"}');
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


})
