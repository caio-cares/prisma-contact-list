"use client";
import { useState, useEffect } from "react";

type Contact = {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
};

export default function Home() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [addingNew, setAddingNew] = useState(false);
  const [isEditing, setIsEditing] = useState<number | null>(null);

  const [formValues, setFormValues] = useState<Omit<Contact, "id">>({
    name: "",
    email: "",
    phone: "",
    company: "",
  });

  const handleFetchContacts = async () => {
    const res = await fetch("/api/contacts");
    const data = await res.json();

    if (data) {
      setContacts(data);
    }
  };

  const handleUpdateContact = async () => {
    const res = await fetch("/api/contacts", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formValues, id: isEditing }),
    });
    await handleFetchContacts();
    setIsEditing(null);
    setFormValues({ name: "", email: "", phone: "", company: "" });
  };

  const handleCreateContact = async () => {
    const res = await fetch("/api/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formValues),
    });
    await handleFetchContacts();
    setFormValues({ name: "", email: "", phone: "", company: "" });
  };

  const handleDeleteContact = async (id: number) => {
    const res = await fetch("/api/contacts", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await handleFetchContacts();
  };

  useEffect(() => {
    handleFetchContacts();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center p-24 gap-6">
      <div className="flex flex-col justify-center items-center gap-4">
        <h2 className="text-5xl text-white font-bold w-full flex">
          Lista de contatos
        </h2>
        <button
          onClick={() => {
            setAddingNew((prevState) => !prevState);
            setFormValues({ name: "", email: "", phone: "", company: "" });
            setIsEditing(null);
          }}
          type="button"
          className="py-2.5 px-2 m-auto text-sm font-medium focus:outline-none rounded-lg border  focus:z-10 focus:ring- focus:ring-gray-700 bg-gray-800 text-gray-400 border-gray-600 hover:text-white hover:bg-gray-700 self-start"
        >
          Adicionar novo
        </button>
      </div>
      {(addingNew || isEditing) && (
        <form className="max-w-sm mx-auto flex gap-4 flex-col">
          <div className="flex gap-4">
            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Nome
              </label>
              <input
                type="text"
                id="name"
                className="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                required
                onChange={(e) =>
                  setFormValues({ ...formValues, name: e.target.value })
                }
                value={formValues.name}
              />
            </div>
            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Telefone
              </label>
              <input
                type="text"
                id="phone"
                className="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                required
                onChange={(e) =>
                  setFormValues({ ...formValues, phone: e.target.value })
                }
                value={formValues.phone}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                required
                onChange={(e) =>
                  setFormValues({ ...formValues, email: e.target.value })
                }
                value={formValues.email}
              />
            </div>
            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Empresa
              </label>
              <input
                type="text"
                id="company"
                className="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) =>
                  setFormValues({ ...formValues, company: e.target.value })
                }
                value={formValues.company}
              />
            </div>
          </div>
          {isEditing ? (
            <button
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              onClick={handleUpdateContact}
            >
              Editar
            </button>
          ) : (
            <button
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              onClick={handleCreateContact}
            >
              Criar
            </button>
          )}
        </form>
      )}

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-400">
          <thead className="text-xs text-gray-400 uppercase bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3">
                Nome
              </th>
              <th scope="col" className="px-6 py-3">
                Telefone
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Empresa
              </th>
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">Editar</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {contacts?.map((contact, index) => (
              <tr
                className="border-b bg-gray-800 border-gray-700 hover:bg-gray-600"
                key={index}
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium whitespace-nowrap text-white"
                >
                  {contact.name}
                </th>
                <td className="px-6 py-4">{contact.phone}</td>
                <td className="px-6 py-4">{contact.email}</td>
                <td className="px-6 py-4">{contact.company}</td>
                <td className="px-6 py-4 text-right flex gap-4">
                  <a
                    onClick={() => {
                      setIsEditing(contact.id);
                      setFormValues({
                        name: contact.name,
                        email: contact.email,
                        phone: contact.phone,
                        company: contact.company,
                      });
                    }}
                    className="font-medium text-tertiary hover:underline"
                  >
                    Editar
                  </a>

                  <a
                    onClick={() => {
                      setIsEditing(null);
                      setFormValues({
                        name: contact.name,
                        email: contact.email,
                        phone: contact.phone,
                        company: contact.company,
                      });
                      handleDeleteContact(contact.id);
                    }}
                    className="font-medium text-tertiary hover:underline"
                  >
                    Excluir
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
