import prisma from "@/app/libs/prismaDB"
import getCurrentUser from "./getCurrentUser"

const getConversationById = async (conversationId: string) => {
  try {
    const user = await getCurrentUser()

    if (!user?.email) return null

    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        users: true,
      },
    })

    return conversation
  } catch (error: any) {
    return null
  }
}
export default getConversationById
