"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "./page.module.css";

interface Item {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  // Fetch items
  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch("/api/items");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setItems(data);
    } catch (error) {
      console.error("Failed to load items:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Create item
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || submitting) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: input.trim() }),
      });
      if (!res.ok) throw new Error("Failed to create");
      const item = await res.json();
      setItems((prev) => [item, ...prev]);
      setInput("");
    } catch (error) {
      console.error("Failed to create:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // Delete item
  const deleteItem = async (id: string) => {
    try {
      const res = await fetch(`/api/items/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      setItems((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  // Start editing
  const startEdit = (item: Item) => {
    setEditingId(Number(item.id));
    setEditValue(item.name);
  };

  // Save edited item
  const saveEdit = async (id: string) => {
    if (!editValue.trim()) return;
    try {
      const res = await fetch(`/api/items/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editValue.trim() }),
      });
      if (!res.ok) throw new Error("Failed to update");
      const updated = await res.json();
      setItems((prev) => prev.map((t) => (t.id === id ? updated : t)));
      setEditingId(null);
    } catch (error) {
      console.error("Failed to update:", error);
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };

  if (loading) {
    return (
      <main className={styles.container}>
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1>📱 PWA CRUD POC</h1>
        <p>Simple Next.js + PWA Demo</p>
      </header>

      <form className={styles.createForm} onSubmit={handleCreate}>
        <input
          className={styles.input}
          type="text"
          placeholder="Add an item..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className={styles.addButton}
          type="submit"
          disabled={!input.trim() || submitting}
        >
          {submitting ? "..." : "Add"}
        </button>
      </form>

      <div className={styles.taskList}>
        {items.length === 0 ? (
          <p className={styles.emptyState}>No items yet. Add one above!</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className={styles.taskCard}>
              <div className={styles.taskContent}>
                {editingId === Number(item.id) ? (
                  <input
                    type="text"
                    className={styles.input}
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    autoFocus
                  />
                ) : (
                  <>
                    <h3 className={styles.taskTitle}>{item.name}</h3>
                    <p className={styles.taskDate}>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </>
                )}
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                {editingId === Number(item.id) ? (
                  <>
                    <button
                      className={styles.iconButton}
                      onClick={() => saveEdit(item.id)}
                      style={{ backgroundColor: "#4CAF50", color: "white" }}
                    >
                      ✓
                    </button>
                    <button
                      className={styles.iconButton}
                      onClick={cancelEdit}
                      style={{ backgroundColor: "#999", color: "white" }}
                    >
                      ✕
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className={styles.iconButton}
                      onClick={() => startEdit(item)}
                      style={{ backgroundColor: "#2196F3", color: "white" }}
                    >
                      ✎
                    </button>
                    <button
                      className={styles.iconButton}
                      onClick={() => deleteItem(item.id)}
                    >
                      ✕
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
