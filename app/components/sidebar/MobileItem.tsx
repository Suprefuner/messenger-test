"use client"

import { FC } from "react"
import Link from "next/link"
import clsx from "clsx"
import { signOut } from "next-auth/react"

interface MobileItemProps {
  href: string
  icon: any
  active?: boolean
  onClick?: () => void
}

const MobileItem: FC<MobileItemProps> = ({
  href,
  icon: Icon,
  active,
  onClick,
}) => {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={clsx(
        `
      group flex gap-x-3 leading-6 font-semibold w-full justify-center p-4 text-gray-500 hover:text-black hover:bg-gray-100`,
        active && "bg-gray-100 text-black"
      )}
    >
      <Icon className="h-6 w-6" />
    </Link>
  )
}
export default MobileItem
