/* eslint-disable no-undef */
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import Login from "./Login"

const renderWithRouter = (ui) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>)
}

describe("Login Form Interaction Tests", () => {

  it("allows user to type email and password", async () => {
    const user = userEvent.setup()
    renderWithRouter(<Login onSubmit={jest.fn()} />)

    const emailInput = screen.getByPlaceholderText(/email/i)
    const passwordInput = screen.getByPlaceholderText(/password/i)

    await user.type(emailInput, "test@example.com")
    await user.type(passwordInput, "123456")

    expect(emailInput).toHaveValue("test@example.com")
    expect(passwordInput).toHaveValue("123456")
  })

  it("submits form successfully", async () => {
    const user = userEvent.setup()
    const mockSubmit = jest.fn()

    renderWithRouter(<Login onSubmit={mockSubmit} />)

    const emailInput = screen.getByPlaceholderText(/email/i)
    const passwordInput = screen.getByPlaceholderText(/password/i)
    const button = screen.getByRole("button", { name: /login/i })

    await user.type(emailInput, "test@example.com")
    await user.type(passwordInput, "123456")
    await user.click(button)
    expect(screen.getByRole("button", { name: /logging in/i })).toBeInTheDocument()
  })

  it("does not submit if fields are empty", async () => {
    const user = userEvent.setup()
    const mockSubmit = jest.fn()

    renderWithRouter(<Login onSubmit={mockSubmit} />)

    const button = screen.getByRole("button", { name: /login/i })

    await user.click(button)

    expect(mockSubmit).not.toHaveBeenCalled()
  })

})