import { Transition } from "@headlessui/react"
import { ClipboardDocumentIcon, ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/20/solid'
import { CheckCircleIcon } from "@heroicons/react/24/outline"
import { Fragment, useState } from "react"
import useTimeout from "../../hooks/useTimeout"

const Notification = ({ notification, deleteNotification }) => {
    const [show, setShow] = useState(true)

    function handleNotification() {
        deleteNotification(notification?.id)
        setShow(false)
    }

    useTimeout(handleNotification, 3500)

    return (
        <>
            <Transition
                show={show}
                as={Fragment}
                enter="transform ease-out duration-300 transition"
                enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
                enterTo="translate-y-0 opacity-100 sm:translate-x-0"
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div className={`pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg shadow-lg ring-1 bg-white ring-black ring-opacity-5`}>
                    <div className="p-4">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                {notification?.type === "success" ? (
                                    <CheckCircleIcon
                                        className="h-6 w-6 text-green-400"
                                        aria-hidden="true"
                                    />
                                ) : (
                                    notification?.type === "clipboard" ? (
                                        <ClipboardDocumentIcon
                                            className="h-6 w-6 text-blue-400"
                                            aria-hidden="true"
                                        />
                                    ) : (
                                        <ExclamationTriangleIcon
                                            className="h-6 w-6 text-red-400"
                                            aria-hidden="true"
                                        />
                                    )
                                )}
                            </div>
                            <div className="ml-3 w-0 flex-1 pt-0.5">
                                <p className="text-sm font-medium text-gray-900">
                                    {notification?.type === "success"
                                        ? "Successfully saved!"
                                        : notification?.type === "clipboard"
                                            ? "Clipboard" : "Something's wrong!"}
                                </p>
                                <p className="mt-1 text-sm text-gray-500">
                                    {notification?.message}
                                </p>
                            </div>
                            <div className="ml-4 flex flex-shrink-0">
                                <button
                                    type="button"
                                    className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                                    onClick={() => {
                                        handleNotification()
                                    }}
                                >
                                    <span className="sr-only">Close</span>
                                    <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Transition>
        </>
    )
}

export default Notification