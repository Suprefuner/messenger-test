import getCurrentUser from "@/app/actions/getCurrentUser"
import { NextResponse } from "next/server"
import prisma from "@/app/libs/prismaDB"

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser()
    const body = await req.json()

    const { name, image } = body

    if (!currentUser?.id) {
      return new NextResponse(`UNAUTHORIZED`, { status: 401 })
    }

    const updatedUser = await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        name,
        image,
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error: any) {
    console.log(error, `ERROR_SETTINGS`)
    return new NextResponse(`INTERNAL ERROR`, { status: 500 })
  }
}
