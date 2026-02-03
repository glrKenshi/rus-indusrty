import { test, expect } from "@playwright/test";

test.describe("Чат-виджет", () => {
  test("открыть чат, ввести сообщение, отправить — сообщение появляется (offline-friendly)", async ({
    page,
  }) => {
    await page.goto("/");

    await page.getByTestId("chat-open").click();
    await page.getByRole("button", { name: /Инженер/ }).click();

    await expect(page.getByTestId("chat-input")).toBeVisible();
    const testMessage = "e2e-chat-test-" + Date.now();
    await page.getByTestId("chat-input").fill(testMessage);
    await page.getByTestId("chat-send").click();

    await expect(
      page.getByTestId("chat-messages").getByText(testMessage)
    ).toBeVisible();
  });
});
