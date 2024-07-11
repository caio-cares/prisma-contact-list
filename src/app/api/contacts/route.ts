import { PrismaClient } from "@prisma/client";

export const config = {
  api: {
    bodyParser: false,
  },
};

const prisma = new PrismaClient();

export async function GET() {
  try {
    const contacts = await prisma.contact.findMany();
    return Response.json(contacts);
  } catch (error) {
    return Response.json({ error: "Erro ao obter contatos" });
  }
}

export async function POST(req: Request) {
  try {
    const { name, email, phone, company } = await req.json();

    const newContact = await prisma.contact.create({
      data: { name, email, phone, company },
    });
    return Response.json(newContact);
  } catch (error) {
    return Response.json({ error: "Erro ao criar contato" });
  }
}

export async function PUT(req: Request) {
  try {
    const { name, email, phone, company, id } = await req.json();

    const updatedContact = await prisma.contact.update({
      where: { id: Number(id) },
      data: { name, email, phone, company },
    });

    return Response.json(updatedContact);
  } catch (error) {
    return Response.json({ error: "Erro ao atualizar contato" });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    await prisma.contact.delete({
      where: { id: Number(id) },
    });

    return Response.json({ status: true });
  } catch (error) {
    return Response.json({ error: "Erro ao deletar contato" });
  }
}
