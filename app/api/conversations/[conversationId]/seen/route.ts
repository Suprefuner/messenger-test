import getCurrentUser from "@/app/actions/getCurrentUser"
import { NextResponse } from "next/server"
import prisma from "@/app/libs/prismaDB"
import { pusherServer } from "@/app/libs/pusher"

interface IParams {
  conversationId?: string
}

export async function POST(req: Request, { params }: { params: IParams }) {
  try {
    const currentUser = await getCurrentUser()
    const { conversationId } = params

    if (!currentUser?.email || !currentUser?.id) {
      return new NextResponse("UNAUTHORIZED", { status: 401 })
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          include: { seen: true },
        },
        users: true,
      },
    })

    if (!conversation) {
      return new NextResponse("INVALID ID", { status: 400 })
    }

    const lastMessage = conversation.messages.at(-1)

    if (!lastMessage) {
      return NextResponse.json(conversation)
    }

    const updatedMessage = await prisma.message.update({
      where: {
        id: lastMessage.id,
      },
      include: {
        sender: true,
        seen: true,
      },
      data: {
        seen: {
          connect: {
            id: currentUser.id,
          },
        },
      },
    })

    await pusherServer.trigger(currentUser.email, "conversation:update", {
      id: conversationId,
      messages: [updatedMessage],
    })

    if (lastMessage.seenIds.indexOf(currentUser.id) !== -1) {
      return NextResponse.json(conversation)
    }

    await pusherServer.trigger(
      conversationId!,
      "message:update",
      updatedMessage
    )

    return NextResponse.json(updatedMessage)
  } catch (error: any) {
    console.log(error, "ERROR_MESSAGES_SEEN")
    return new NextResponse("INTERNAL ERROR", { status: 500 })
  }
}
