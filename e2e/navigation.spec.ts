import { test, expect } from "@playwright/test";

test.describe("Навигация", () => {
  test("переход по роутам: главная, equipment, honest-mark", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: /Оборудование/ })
    ).toBeVisible();

    await page.goto("/equipment");
    await expect(
      page.getByRole("heading", { name: /Оборудование для цифровых/ })
    ).toBeVisible();

    await page.goto("/honest-mark");
    await expect(
      page.getByText(/Маркировка товаров.*Честный знак/)
    ).toBeVisible();
  });
});
