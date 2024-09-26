import { test, expect } from 'playwright-test-coverage';

test('home page', async ({ page }) => {
    await page.goto('/');

    expect(await page.title()).toBe('JWT Pizza');
});

// test('buy pizza with login', async ({ page }) => {
//     await page.goto('http://localhost:5173/');
//     await page.getByRole('button', { name: 'Order now' }).click();
//     await page.getByRole('combobox').selectOption('2');
//     await page.getByRole('link', { name: 'Image Description Veggie A' }).click();
//     await page.getByRole('link', { name: 'Image Description Pepperoni' }).click();
//     await page.getByRole('link', { name: 'Image Description Margarita' }).click();
//     await page.getByRole('link', { name: 'Image Description Chared' }).click();
//     await page.getByRole('link', { name: 'Image Description Flat' }).click();
//     await page.getByRole('link', { name: 'Image Description Crusty A' }).click();
//     await page.getByRole('button', { name: 'Checkout' }).click();
//     await page.getByRole('main').getByText('Register').click();
//     await page.getByPlaceholder('Full name').fill('j');
//     await page.getByPlaceholder('Full name').press('Tab');
//     await page.getByPlaceholder('Email address').fill('j');
//     await page.getByPlaceholder('Email address').press('Tab');
//     await page.getByPlaceholder('Password').fill('j');
//     await page.getByRole('button', { name: 'Register' }).click();
//     await page.getByPlaceholder('Email address').fill('j@j.com');
//     await page.locator('div').filter({ hasText: /^Email addressPasswordRegisterAlready have an account\? Login instead\.$/ }).first().click();
//     await page.getByRole('button', { name: 'Register' }).click();
//     await page.getByRole('button', { name: 'Pay now' }).click();
//     await page.getByRole('button', { name: 'Verify' }).click();
//     await page.getByRole('button', { name: 'Verify' }).click();
//     await page.goto('http://localhost:5173/'); test('buy pizza with login', async ({ page }) => { });
// });

test('buy pizza with login', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByRole('button', { name: 'Order now' }).click();
    await expect(page.locator('h2')).toContainText('Awesome is a click away');
    await page.getByRole('combobox').selectOption('1');
    await page.getByRole('link', { name: 'Image Description Veggie A' }).click();
    await page.getByRole('link', { name: 'Image Description Pepperoni' }).click();
    await expect(page.locator('form')).toContainText('Selected pizzas: 2');
    await page.getByRole('button', { name: 'Checkout' }).click();
    await page.getByPlaceholder('Email address').click();
    await page.getByPlaceholder('Email address').fill('d@jwt.com');
    await page.getByPlaceholder('Email address').press('Tab');
    await page.getByPlaceholder('Password').fill('a');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByRole('main')).toContainText('Send me those 2 pizzas right now!');
    await expect(page.locator('tbody')).toContainText('Veggie');
    await page.getByRole('button', { name: 'Pay now' }).click();
    await expect(page.getByRole('main')).toContainText('0.008 ₿');
});