import { expect, test } from "@playwright/test";

test("onboarding flow renders and starts tracking", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "MindBloom" })).toBeVisible();
  await page.getByLabel("Your name").fill("Test Student");
  await page.getByRole("button", { name: "Start tracking" }).click();
  await expect(page.getByText(/Hi Test Student/i)).toBeVisible();
});
