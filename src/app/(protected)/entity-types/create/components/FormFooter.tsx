import { Button } from "@/components/ui/button";

interface FormFooterProps {
  onCancel: () => void;
  isLoading?: boolean;
  isEditing?: boolean;
}

export function FormFooter({
  onCancel,
  isLoading,
  isEditing,
}: FormFooterProps) {
  return (
    <>
      <div className="h-20" />
      <div className="bg-background fixed right-0 bottom-0 left-64 z-50 flex items-center justify-end gap-3 border-t p-4 shadow-sm transition-all duration-300">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? "Saving..."
            : isEditing
              ? "Update Entity Type"
              : "Create Entity Type"}
        </Button>
      </div>
    </>
  );
}
