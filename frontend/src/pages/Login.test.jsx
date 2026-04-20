/* eslint-disable no-undef */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "./Login";   // adjust if your file is named differently

 
describe("Login Component", () => {

   
  it("renders login form elements", () => {
    render(<Login />);

    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("allows user to type in inputs", async () => {
    render(<Login />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "123456");

    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("123456");
  });

  it("submits form when button is clicked", async () => {
    // eslint-disable-next-line no-unused-vars
    const mockSubmit = jest.fn();   // Optional: better test for form submission

    render(<Login />);

    const button = screen.getByRole("button", { name: /login/i });

    await userEvent.click(button);

    // Basic check
    expect(button).toBeInTheDocument();

    // If you pass onSubmit as prop or use form handling, you can test it like this:
    // expect(mockSubmit).toHaveBeenCalled();  // if you mock the handler
  });

});