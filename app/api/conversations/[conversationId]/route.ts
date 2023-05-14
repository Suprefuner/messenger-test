import getCurrentUser from "@/app/actions/getCurrentUser"
import { NextResponse } from "next/server"
import prisma from "@/app/libs/prismaDB"
import { pusherServer } from "@/app/libs/pusher"

interface IParams {
  conversationId?: string
}

export async function DELETE(req: Request, { params }: { params: IParams }) {
  try {
    const { conversationId } = params
    const currentUser = await getCurrentUser()

    if (!currentUser?.id) {
      return new NextResponse("UNAUTHORIZED", { status: 401 })
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { users: true },
    })

    if (!conversation) {
      return new NextResponse("INVALID ID", { status: 400 })
    }

    const deletedConversation = await prisma.conversation.deleteMany({
      where: {
        id: conversationId,
        userIds: {
          hasSome: [currentUser.id],
        },
      },
    })

    conversation.users.forEach((user) => {
      if (user.email) {
        pusherServer.trigger(user.email, "conversation:remove", conversation)
      }
    })

    return NextResponse.json(deletedConversation)
  } catch (error: any) {
    console.log(error, `ERROR_CONVERSATION_DELETE`)
    return new NextResponse("INTERNAL ERROR", { status: 500 })
  }
}
