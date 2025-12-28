import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { getFieldConfig, getFieldTypeFromSchema } from "@/lib/field-types";
import type { EntityWorkflowStep, PropertySchema } from "@/types";

interface FormSchemaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  step: EntityWorkflowStep;
}

export function FormSchemaModal({
  open,
  onOpenChange,
  step,
}: FormSchemaModalProps) {
  const schema = step.form.schema;
  const hasFields =
    schema.properties && Object.keys(schema.properties).length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">{step.name}</DialogTitle>
          <DialogDescription className="mt-1.5">
            Step {step.order_index + 1} •{" "}
            {step.requires_approval ? "Requires approval" : "Auto-approved"}
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6 py-4">
            {hasFields ? (
              <div className="space-y-3">
                <h4 className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
                  Form Fields
                </h4>
                <div className="space-y-2">
                  {Object.entries(schema.properties!).map(([key, prop]) => {
                    const typedProp = prop as PropertySchema;
                    const fieldType = getFieldTypeFromSchema(typedProp);
                    const fieldConfig = getFieldConfig(fieldType);
                    const isRequired = schema.required?.includes(key);

                    return (
                      <div
                        key={key}
                        className="bg-muted/20 border-border flex items-center justify-between rounded border p-2.5"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {typedProp.title || key}
                          </span>
                          {isRequired && (
                            <span
                              className="text-destructive text-xs"
                              title="Required"
                            >
                              *
                            </span>
                          )}
                        </div>
                        <Badge
                          variant="secondary"
                          className={`text-xs ${fieldConfig.badgeColor}`}
                        >
                          {fieldConfig.label}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                No form fields defined for this step.
              </p>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
