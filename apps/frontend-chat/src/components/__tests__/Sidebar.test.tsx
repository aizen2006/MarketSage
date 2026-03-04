import { render, screen, fireEvent } from "@testing-library/react";
import { Sidebar } from "../Sidebar";
import type { Conversation } from "../../types/chat";

const conversations: Conversation[] = [
  {
    id: "1",
    title: "BTC Market Analysis",
    lastMessagePreview: "Support near 64,200…",
    updatedAt: new Date().toISOString(),
    unreadCount: 2,
  },
  {
    id: "2",
    title: "Portfolio Rebalance",
    lastMessagePreview: "Quarterly adjustment strategy…",
    updatedAt: new Date().toISOString(),
    unreadCount: 0,
  },
];

describe("Sidebar", () => {
  it("renders conversations and highlights active one", () => {
    const handleSelect = jest.fn();
    render(
      <Sidebar
        conversations={conversations}
        activeId="1"
        onSelectConversation={handleSelect}
        onCreateConversation={jest.fn()}
        onRenameConversation={jest.fn()}
        onDeleteConversation={jest.fn()}
      />,
    );

    expect(screen.getByText("BTC Market Analysis")).toBeInTheDocument();
    expect(screen.getByText("Portfolio Rebalance")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Portfolio Rebalance"));
    expect(handleSelect).toHaveBeenCalledWith("2");
  });

  it("filters conversations by search input", () => {
    render(
      <Sidebar
        conversations={conversations}
        activeId="1"
        onSelectConversation={jest.fn()}
        onCreateConversation={jest.fn()}
        onRenameConversation={jest.fn()}
        onDeleteConversation={jest.fn()}
      />,
    );

    const search = screen.getByPlaceholderText("Search conversations...");
    fireEvent.change(search, { target: { value: "rebalance" } });

    expect(screen.getByText("Portfolio Rebalance")).toBeInTheDocument();
    expect(screen.queryByText("BTC Market Analysis")).not.toBeInTheDocument();
  });
});

