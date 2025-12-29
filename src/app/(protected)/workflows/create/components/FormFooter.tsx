import { Button } from "@/components/ui/button";

interface FormFooterProps {
  onCancel: () => void;
  isLoading?: boolean;
  isDisabled?: boolean;
}

export function FormFooter({
  onCancel,
  isLoading,
  isDisabled,
}: FormFooterProps) {
  return (
    <>
      <div className="h-20" />
      <div className="bg-background fixed right-0 bottom-0 left-64 z-50 flex items-center justify-end gap-3 border-t p-4 shadow-sm transition-all duration-300">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading || isDisabled}>
          {isLoading ? "Saving..." : "Create Workflow"}
        </Button>
      </div>
    </>
  );
}
