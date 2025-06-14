import { useToast } from "../../hooks/use-toast";
import { X } from "lucide-react";

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed top-20 right-4 z-[9999] flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`relative p-4 rounded-md shadow-lg bg-white border transition-all duration-300 transform ${
            toast.open ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"
          } ${
            toast.variant === "destructive"
              ? "border-red-200 bg-red-50 text-red-800"
              : "border-green-200 bg-green-50 text-green-800"
          }`}
        >
          <button
            onClick={() => dismiss(toast.id)}
            className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200 transition-colors"
          >
            <X size={14} />
          </button>
          <div className="font-semibold pr-6">{toast.title}</div>
          {toast.description && <div className="text-sm mt-1 pr-6">{toast.description}</div>}

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 h-1 bg-gray-200 w-full rounded-b-md overflow-hidden">
            <div
              className={`h-full toast-progress ${
                toast.variant === "destructive" ? "bg-red-400" : "bg-green-400"
              }`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
