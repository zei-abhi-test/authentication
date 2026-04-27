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

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)

    await user.type(emailInput, "test@example.com")
    await user.type(passwordInput, "123456")

    expect(emailInput).toHaveValue("test@example.com")
    expect(passwordInput).toHaveValue("123456")
  })

  it("calls submit handler with correct data", async () => {
    const user = userEvent.setup()
    const mockSubmit = jest.fn()

    renderWithRouter(<Login onSubmit={mockSubmit} />)

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const button = screen.getByRole("button", { name: /login/i })

    await user.type(emailInput, "test@example.com")
    await user.type(passwordInput, "123456")
    await user.click(button)

    expect(mockSubmit).toHaveBeenCalledTimes(1)
    expect(mockSubmit).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "123456",
    })
  })

  it("shows error and does not submit if fields are empty", async () => {
    const user = userEvent.setup()
    const mockSubmit = jest.fn()

    renderWithRouter(<Login onSubmit={mockSubmit} />)

    const button = screen.getByRole("button", { name: /login/i })

    await user.click(button)

    expect(screen.getByRole("alert")).toBeInTheDocument()
    expect(mockSubmit).not.toHaveBeenCalled()
  })

})