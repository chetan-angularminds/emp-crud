interface ConfirmationDialogProps {
    message: string
    onConfirm: () => void
    onCancel: () => void
  }
  
  export default function ConfirmationDialog({ message, onConfirm, onCancel }: ConfirmationDialogProps) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">Confirm Action</h2>
          <p className="mb-6">{message}</p>
          <div className="flex justify-end space-x-4">
            <button onClick={onCancel} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400">
              Cancel
            </button>
            <button onClick={onConfirm} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
              Confirm
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  