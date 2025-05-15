import { useToast } from "../../hooks/use-toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`p-4 rounded-md shadow-md bg-white border transition-opacity ${
            toast.open ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="font-semibold">{toast.title}</div>
          {toast.description && <div className="text-sm">{toast.description}</div>}
        </div>
      ))}
    </div>
  );
}
