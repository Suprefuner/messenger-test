"use client"

import axios from "axios"
import { FC, useState } from "react"
import Modal from "@/app/components/Modal"
import { User } from "@prisma/client"
import { useRouter } from "next/navigation"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import { toast } from "react-hot-toast"

import Input from "@/app/components/inputs/Input"
import Select from "@/app/components/inputs/Select"
import Button from "@/app/components/Button"

interface GroupChatModalProps {
  isOpen?: boolean
  onClose: () => void
  users: User[]
}

const GroupChatModal: FC<GroupChatModalProps> = ({
  isOpen,
  onClose,
  users,
}) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "Group",
      members: [],
    },
  })

  const members = watch("members")

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true)
    try {
      axios.post(`/api/conversations`, {
        ...data,
        isGroup: true,
      })

      router.refresh()
      onClose()
    } catch (error: any) {
      toast.error("something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Create a group chat
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Create a chat with more than 2 people
            </p>
            <div className="mt-10 flex flex-col gap-y-8">
              <Input
                id="name"
                label="Name"
                // FIXME TYPESCRIPT ERROR
                register={register}
                required
                disabled={isLoading}
                errors={errors}
              />
              <Select
                label="Members"
                disabled={isLoading}
                options={users.map((user) => ({
                  value: user.id,
                  label: user.name,
                }))}
                // FIXME TYPESCRIPT ERROR
                onChange={(val) =>
                  setValue("members", val, {
                    shouldValidate: true,
                  })
                }
                value={members}
              />
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <Button
            disabled={isLoading}
            onClick={onClose}
            type="button"
            secondary
          >
            Cancel
          </Button>
          <Button disabled={isLoading} onClick={onClose} type="submit">
            Create
          </Button>
        </div>
      </form>
    </Modal>
  )
}
export default GroupChatModal
