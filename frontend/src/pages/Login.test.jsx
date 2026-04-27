/* eslint-disable no-undef */
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import Login from "./Login"

const renderWithRouter = (ui) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>)
}

describe("Login Component", () => {

  it("renders login form elements", () => {
    renderWithRouter(<Login />)

    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument()
  })

  it("allows user to type in inputs", async () => {
    renderWithRouter(<Login />)

    const emailInput = screen.getByPlaceholderText(/email/i)
    const passwordInput = screen.getByPlaceholderText(/password/i)

    await userEvent.type(emailInput, "test@example.com")
    await userEvent.type(passwordInput, "123456")

    expect(emailInput).toHaveValue("test@example.com")
    expect(passwordInput).toHaveValue("123456")
  })

  it("submits form when button is clicked", async () => {
    renderWithRouter(<Login />)

    const button = screen.getByRole("button", { name: /login/i })

    await userEvent.click(button)

    expect(button).toBeInTheDocument()
  })

})