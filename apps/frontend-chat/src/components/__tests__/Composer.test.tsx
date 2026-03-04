import { render, screen, fireEvent } from "@testing-library/react";
import { Composer } from "../Composer";

describe("Composer", () => {
  it("calls onSend when Enter is pressed without Shift", () => {
    const handleSend = jest.fn();
    render(<Composer onSend={handleSend} />);

    const textarea = screen.getByLabelText("Type your financial query");
    fireEvent.change(textarea, { target: { value: "Test message" } });
    fireEvent.keyDown(textarea, { key: "Enter", shiftKey: false });

    expect(handleSend).toHaveBeenCalledWith("Test message");
  });

  it("allows multiline input with Shift+Enter", () => {
    const handleSend = jest.fn();
    render(<Composer onSend={handleSend} />);

    const textarea = screen.getByLabelText("Type your financial query");
    fireEvent.change(textarea, { target: { value: "Line 1" } });
    fireEvent.keyDown(textarea, { key: "Enter", shiftKey: true });

    expect(handleSend).not.toHaveBeenCalled();
  });

  it("shows suggestions when typing", () => {
    const handleSend = jest.fn();
    render(<Composer onSend={handleSend} />);

    const textarea = screen.getByLabelText("Type your financial query");
    fireEvent.focus(textarea);
    fireEvent.change(textarea, { target: { value: "portfolio" } });

    expect(screen.getByRole("listbox", { name: /smart suggestions/i })).toBeInTheDocument();
  });
});

