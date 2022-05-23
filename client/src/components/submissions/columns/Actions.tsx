import { Fragment, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { useMutation, useQueryClient } from "react-query"
import toast from "react-hot-toast"

/**
 * Import Components
 */
import { TrashIcon } from "@/components/Icons"

/**
 * Import helpers
 */
import { deleteSubmission } from "@/api/submissions"

/**
 * Import Types / Interfaces
 */
import { Cell } from "react-table"
import { Submission } from "@/types/Submission"
import { AxiosError } from "axios"

interface Practice {
  submissions: Submission[]
}

const Actions = (cell: Cell<Submission>) => {
  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = useState(false)

  /**
   * Delete submission
   */
  const { mutate } = useMutation((id) => deleteSubmission(id), {
    onSuccess: () => {
      setIsOpen(false)
      const practice: Practice | undefined =
        queryClient.getQueryData("practice")
      /**
       * Update the state by removing the submission with the id
       */
      queryClient.setQueryData("practice", {
        submissions: practice?.submissions.filter(
          (el: Submission) => el.id !== cell.row.original.id
        ),
      })
      /**
       * Show toast message
       */
      toast.success("Problem deleted", { className: "toast" })
    },
    onError: (err: AxiosError) => {
      setIsOpen(false)
      /**
       * Show toast message
       */
      toast.error(err.response?.data.message, { className: "toast" })
    },
  })

  return (
    <div className="flex space-x-4">
      <button onClick={() => setIsOpen(true)} type="button">
        <TrashIcon
          className="w-[22px] h-[22px] text-red-500"
          aria-hidden="true"
        />
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-40 overflow-y-auto"
          onClose={() => {}}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-100"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black/60" />
            </Transition.Child>

            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow shadow-primary/10 rounded-xl">
                <Dialog.Title
                  as="h3"
                  className="text-xl font-semibold leading-6 text-dark"
                >
                  Delete Submission
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-gray-600">
                    Are you sure you want to delete this submission?
                  </p>
                </div>

                <div className="flex justify-end mt-12 space-x-4">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-600 border border-transparent rounded-md bg-gray-200/75 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-[#d11a2a]/75 border border-transparent rounded-md hover:bg-[#d11a2a] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
                    onClick={() => mutate(cell.value)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  )
}

export default Actions
