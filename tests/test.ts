import { expect, test } from '@playwright/test';

test('footer visible on main screen', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByText('Steven Harder 2023')).toBeVisible();
});

test('footer visible on layout screen', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByText('Steven Harder 2023')).toBeVisible();
});

test('footer visible on ratioizer screen', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByText('Steven Harder 2023')).toBeVisible();
});
