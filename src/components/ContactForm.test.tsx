import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ContactForm from "./ContactForm";
import { Toaster } from "./ui/toaster";

const renderWithToaster = () =>
  render(
    <>
      <ContactForm />
      <Toaster />
    </>
  );

describe("ContactForm", () => {
  it("renders form with required fields", () => {
    renderWithToaster();
    expect(screen.getByLabelText(/Ваше имя/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Название компании/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Отправить заявку" })
    ).toBeInTheDocument();
  });

  it("shows toast on submit", async () => {
    const user = userEvent.setup();
    renderWithToaster();

    await user.type(screen.getByLabelText(/Ваше имя/), "Тест");
    await user.type(screen.getByLabelText(/Название компании/), "ООО Тест");
    await user.type(screen.getByLabelText(/Email/), "test@test.ru");
    await user.click(screen.getByRole("button", { name: "Отправить заявку" }));

    await expect(
      screen.findByText("Заявка отправлена")
    ).resolves.toBeInTheDocument();
  });
});
