import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import AdminLayout from "../../components/admin/AdminLayout";
import SEO from "../../components/seo/SEO";

const iconOptions = [
  "siren",
  "phone",
  "recycle",
  "alert-triangle",
  "repeat",
  "trash",
  "home",
  "heart-handshake",
  "mail",
  "users",
];

const defaultCategory = {
  name: "",
  description: "",
  sort_order: 0,
};

const defaultCard = {
  category_id: "",
  title: "",
  icon: "phone",
  color: "text-indigo-600 bg-indigo-50",
  sort_order: 0,
};

const defaultLink = {
  card_id: "",
  label: "",
  link_type: "website",
  url: "",
  phone_number: "",
  email_address: "",
  sort_order: 0,
};

export default function UsefulInfoAdmin() {
  const [categories, setCategories] = useState([]);
  const [cards, setCards] = useState([]);
  const [links, setLinks] = useState([]);

  const [categoryForm, setCategoryForm] = useState(defaultCategory);
  const [cardForm, setCardForm] = useState(defaultCard);
  const [linkForm, setLinkForm] = useState(defaultLink);

  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingCardId, setEditingCardId] = useState(null);
  const [editingLinkId, setEditingLinkId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const { data: categoryData } = await supabase
      .from("useful_info_categories")
      .select("*")
      .order("sort_order");

    const { data: cardData } = await supabase
      .from("useful_info_cards")
      .select("*")
      .order("sort_order");

    const { data: linkData } = await supabase
      .from("useful_info_links")
      .select("*")
      .order("sort_order");

    setCategories(categoryData || []);
    setCards(cardData || []);
    setLinks(linkData || []);
  }

  async function saveCategory(e) {
    e.preventDefault();

    if (editingCategoryId) {
      await supabase
        .from("useful_info_categories")
        .update(categoryForm)
        .eq("id", editingCategoryId);
    } else {
      await supabase.from("useful_info_categories").insert(categoryForm);
    }

    setCategoryForm(defaultCategory);
    setEditingCategoryId(null);
    loadData();
  }

  async function saveCard(e) {
    e.preventDefault();

    if (editingCardId) {
      await supabase
        .from("useful_info_cards")
        .update(cardForm)
        .eq("id", editingCardId);
    } else {
      await supabase.from("useful_info_cards").insert(cardForm);
    }

    setCardForm(defaultCard);
    setEditingCardId(null);
    loadData();
  }

  async function saveLink(e) {
    e.preventDefault();

    let finalUrl = null;

    if (linkForm.link_type === "website") {
      finalUrl = linkForm.url || null;
    }

    if (linkForm.link_type === "phone") {
      finalUrl = linkForm.phone_number
        ? `tel:${linkForm.phone_number.replace(/\s+/g, "")}`
        : null;
    }

    if (linkForm.link_type === "email") {
      finalUrl = linkForm.email_address
        ? `mailto:${linkForm.email_address}`
        : null;
    }

    const payload = {
      card_id: linkForm.card_id,
      label: linkForm.label,
      link_type: linkForm.link_type,
      url: finalUrl,
      phone_number:
        linkForm.link_type === "phone" ? linkForm.phone_number : null,
      email_address:
        linkForm.link_type === "email" ? linkForm.email_address : null,
      sort_order: linkForm.sort_order,
    };

    if (editingLinkId) {
      await supabase
        .from("useful_info_links")
        .update(payload)
        .eq("id", editingLinkId);
    } else {
      await supabase.from("useful_info_links").insert(payload);
    }

    setLinkForm(defaultLink);
    setEditingLinkId(null);
    loadData();
  }

  function editCategory(category) {
    setEditingCategoryId(category.id);
    setCategoryForm({
      name: category.name,
      description: category.description || "",
      sort_order: category.sort_order || 0,
    });
  }

  function editCard(card) {
    setEditingCardId(card.id);
    setCardForm({
      category_id: card.category_id,
      title: card.title,
      icon: card.icon,
      color: card.color || "text-indigo-600 bg-indigo-50",
      sort_order: card.sort_order || 0,
    });
  }

  function editLink(link) {
    setEditingLinkId(link.id);

    setLinkForm({
      card_id: link.card_id,
      label: link.label,
      link_type: link.link_type || "website",
      url: link.link_type === "website" ? link.url || "" : "",
      phone_number: link.phone_number || "",
      email_address: link.email_address || "",
      sort_order: link.sort_order || 0,
    });
  }

  async function toggleActive(table, item) {
    await supabase
      .from(table)
      .update({ is_active: !item.is_active })
      .eq("id", item.id);

    loadData();
  }

  async function deleteItem(table, id) {
    if (!window.confirm("Delete this item?")) return;

    await supabase.from(table).delete().eq("id", id);
    loadData();
  }

  async function createUsefulNumbersSection() {
    const { data: existing } = await supabase
      .from("useful_info_categories")
      .select("*")
      .ilike("name", "Useful Numbers")
      .maybeSingle();

    if (existing) {
      alert("Useful Numbers section already exists.");
      return;
    }

    await supabase.from("useful_info_categories").insert({
      name: "Useful Numbers",
      description:
        "Quick access to important council and local service phone numbers.",
      sort_order: categories.length + 1,
      is_active: true,
    });

    loadData();
  }

  return (
    <AdminLayout>
      <SEO title="Manage useful Info admin" noindex />
    <div className="min-h-screen bg-[#faf8ff] px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-[#171717]">
              Useful Information Admin
            </h1>
            <p className="mt-2 text-gray-600">
              Manage website links, contacts and useful numbers.
            </p>
          </div>

          <button
            type="button"
            onClick={createUsefulNumbersSection}
            className="rounded-xl bg-[#ff914d] px-5 py-3 font-bold text-[#171717]"
          >
            Add Useful Numbers Section
          </button>
        </div>

        <section className="mb-10 rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-2xl font-black">
            {editingCategoryId ? "Edit Section" : "Add Section"}
          </h2>

          <form onSubmit={saveCategory} className="grid gap-4 md:grid-cols-3">
            <input
              className="rounded-xl border p-3"
              placeholder="Section name"
              value={categoryForm.name}
              onChange={(e) =>
                setCategoryForm({ ...categoryForm, name: e.target.value })
              }
              required
            />

            <input
              className="rounded-xl border p-3"
              placeholder="Description"
              value={categoryForm.description}
              onChange={(e) =>
                setCategoryForm({
                  ...categoryForm,
                  description: e.target.value,
                })
              }
            />

            <input
              className="rounded-xl border p-3"
              type="number"
              placeholder="Sort order"
              value={categoryForm.sort_order}
              onChange={(e) =>
                setCategoryForm({
                  ...categoryForm,
                  sort_order: Number(e.target.value),
                })
              }
            />

            <button className="rounded-xl bg-[#5e17eb] px-5 py-3 font-bold text-white">
              {editingCategoryId ? "Update Section" : "Add Section"}
            </button>
          </form>
        </section>

        <section className="mb-10 rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-2xl font-black">
            {editingCardId ? "Edit Card" : "Add Card"}
          </h2>

          <form onSubmit={saveCard} className="grid gap-4 md:grid-cols-3">
            <select
              className="rounded-xl border p-3"
              value={cardForm.category_id}
              onChange={(e) =>
                setCardForm({ ...cardForm, category_id: e.target.value })
              }
              required
            >
              <option value="">Select section</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <input
              className="rounded-xl border p-3"
              placeholder="Card title"
              value={cardForm.title}
              onChange={(e) =>
                setCardForm({ ...cardForm, title: e.target.value })
              }
              required
            />

            <select
              className="rounded-xl border p-3"
              value={cardForm.icon}
              onChange={(e) =>
                setCardForm({ ...cardForm, icon: e.target.value })
              }
            >
              {iconOptions.map((icon) => (
                <option key={icon} value={icon}>
                  {icon}
                </option>
              ))}
            </select>

            <input
              className="rounded-xl border p-3"
              placeholder="Colour classes"
              value={cardForm.color}
              onChange={(e) =>
                setCardForm({ ...cardForm, color: e.target.value })
              }
            />

            <input
              className="rounded-xl border p-3"
              type="number"
              placeholder="Sort order"
              value={cardForm.sort_order}
              onChange={(e) =>
                setCardForm({
                  ...cardForm,
                  sort_order: Number(e.target.value),
                })
              }
            />

            <button className="rounded-xl bg-[#5e17eb] px-5 py-3 font-bold text-white">
              {editingCardId ? "Update Card" : "Add Card"}
            </button>
          </form>
        </section>

        <section className="mb-10 rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-2xl font-black">
            {editingLinkId ? "Edit Link / Number" : "Add Link / Number"}
          </h2>

          <form onSubmit={saveLink} className="grid gap-4 md:grid-cols-3">
            <select
              className="rounded-xl border p-3"
              value={linkForm.card_id}
              onChange={(e) =>
                setLinkForm({ ...linkForm, card_id: e.target.value })
              }
              required
            >
              <option value="">Select card</option>
              {cards.map((card) => (
                <option key={card.id} value={card.id}>
                  {card.title}
                </option>
              ))}
            </select>

            <select
              className="rounded-xl border p-3"
              value={linkForm.link_type}
              onChange={(e) =>
                setLinkForm({
                  ...linkForm,
                  link_type: e.target.value,
                  url: "",
                  phone_number: "",
                  email_address: "",
                })
              }
            >
              <option value="website">Website</option>
              <option value="phone">Phone number</option>
              <option value="email">Email</option>
              <option value="text">Plain text</option>
            </select>

            <input
              className="rounded-xl border p-3"
              placeholder="Label"
              value={linkForm.label}
              onChange={(e) =>
                setLinkForm({ ...linkForm, label: e.target.value })
              }
              required
            />

            {linkForm.link_type === "website" && (
              <input
                className="rounded-xl border p-3"
                placeholder="Website URL"
                value={linkForm.url}
                onChange={(e) =>
                  setLinkForm({ ...linkForm, url: e.target.value })
                }
                required
              />
            )}

            {linkForm.link_type === "phone" && (
              <input
                className="rounded-xl border p-3"
                placeholder="Phone number"
                value={linkForm.phone_number}
                onChange={(e) =>
                  setLinkForm({ ...linkForm, phone_number: e.target.value })
                }
                required
              />
            )}

            {linkForm.link_type === "email" && (
              <input
                className="rounded-xl border p-3"
                placeholder="Email address"
                value={linkForm.email_address}
                onChange={(e) =>
                  setLinkForm({ ...linkForm, email_address: e.target.value })
                }
                required
              />
            )}

            <input
              className="rounded-xl border p-3"
              type="number"
              placeholder="Sort order"
              value={linkForm.sort_order}
              onChange={(e) =>
                setLinkForm({
                  ...linkForm,
                  sort_order: Number(e.target.value),
                })
              }
            />

            <button className="rounded-xl bg-[#5e17eb] px-5 py-3 font-bold text-white">
              {editingLinkId ? "Update" : "Add"}
            </button>
          </form>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-2xl font-black">Current Content</h2>

          <div className="space-y-10">
            {categories.map((category) => (
              <div key={category.id} className="border-b pb-8">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-black">{category.name}</h3>
                    <p className="text-gray-600">{category.description}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => editCategory(category)}
                      className="rounded-lg border px-3 py-2 text-sm"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        toggleActive("useful_info_categories", category)
                      }
                      className="rounded-lg border px-3 py-2 text-sm"
                    >
                      {category.is_active ? "Hide" : "Show"}
                    </button>

                    <button
                      onClick={() =>
                        deleteItem("useful_info_categories", category.id)
                      }
                      className="rounded-lg bg-red-600 px-3 py-2 text-sm text-white"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {cards
                    .filter((card) => card.category_id === category.id)
                    .map((card) => (
                      <div key={card.id} className="rounded-2xl border p-4">
                        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <h4 className="font-black">{card.title}</h4>
                            <p className="text-sm text-gray-500">
                              Icon: {card.icon}
                            </p>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => editCard(card)}
                              className="rounded-lg border px-2 py-1 text-xs"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() =>
                                toggleActive("useful_info_cards", card)
                              }
                              className="rounded-lg border px-2 py-1 text-xs"
                            >
                              {card.is_active ? "Hide" : "Show"}
                            </button>

                            <button
                              onClick={() =>
                                deleteItem("useful_info_cards", card.id)
                              }
                              className="rounded-lg bg-red-600 px-2 py-1 text-xs text-white"
                            >
                              Delete
                            </button>
                          </div>
                        </div>

                        <ul className="space-y-2">
                          {links
                            .filter((link) => link.card_id === card.id)
                            .map((link) => (
                              <li
                                key={link.id}
                                className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-gray-50 p-3 text-sm"
                              >
                                <div>
                                  <p className="font-semibold">
                                    {link.label}
                                  </p>

                                  <p className="text-xs uppercase tracking-wide text-gray-400">
                                    {link.link_type || "website"}
                                  </p>

                                  {link.phone_number && (
                                    <p className="text-xs text-gray-500">
                                      Phone: {link.phone_number}
                                    </p>
                                  )}

                                  {link.email_address && (
                                    <p className="text-xs text-gray-500">
                                      Email: {link.email_address}
                                    </p>
                                  )}

                                  {link.url && (
                                    <p className="break-all text-xs text-gray-500">
                                      URL: {link.url}
                                    </p>
                                  )}
                                </div>

                                <div className="flex gap-2">
                                  <button
                                    onClick={() => editLink(link)}
                                    className="rounded-lg border px-2 py-1 text-xs"
                                  >
                                    Edit
                                  </button>

                                  <button
                                    onClick={() =>
                                      toggleActive("useful_info_links", link)
                                    }
                                    className="rounded-lg border px-2 py-1 text-xs"
                                  >
                                    {link.is_active ? "Hide" : "Show"}
                                  </button>

                                  <button
                                    onClick={() =>
                                      deleteItem("useful_info_links", link.id)
                                    }
                                    className="rounded-lg bg-red-600 px-2 py-1 text-xs text-white"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </li>
                            ))}
                        </ul>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
    </AdminLayout>
  );
}