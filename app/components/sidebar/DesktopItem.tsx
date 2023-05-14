"use client"

import { FC } from "react"
import clsx from "clsx"
import Link from "next/link"

interface DesktopItemProps {
  label: string
  icon: any
  href: string
  onClick?: () => void
  active?: boolean
}

const DesktopItem: FC<DesktopItemProps> = ({
  label,
  icon: Icon,
  href,
  active,
  onClick,
}) => {
  // const handleClick = () => {
  //   if (onClick) {
  //     return onClick
  //   }
  // }

  return (
    <li onClick={onClick}>
      <Link
        href={href}
        className={clsx(
          `
        group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold text-gray-500 hover:text-black hover:bg-gray-100`,
          active && "bg-gray-100 text-black"
        )}
      >
        <Icon className="h-6 w-6 shrink-0" aria-hidden="true" />
        <span className="sr-only">{label}</span>
      </Link>
    </li>
  )
}
export default DesktopItem