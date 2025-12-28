import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/cn";
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
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-[550px]">
        <DialogHeader className="border-b bg-gray-50/50 px-6 py-5">
          <div className="mr-6 flex items-center justify-between">
            <div className="space-y-1">
              <DialogTitle className="text-xl leading-none font-semibold">
                {step.name}
              </DialogTitle>
              <DialogDescription className="text-xs font-medium">
                Step {step.order_index + 1}
              </DialogDescription>
            </div>
            <Badge
              variant={step.requires_approval ? "warning" : "success"}
              className="capitalize"
            >
              {step.requires_approval ? "Requires Approval" : "Auto Approved"}
            </Badge>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="p-6">
            {hasFields ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b pb-2">
                  <h4 className="text-primary text-sm font-semibold tracking-tight">
                    Field Definitions
                  </h4>
                  <Badge
                    variant="outline"
                    className="h-5 px-1.5 text-[10px] font-normal"
                  >
                    {Object.keys(schema.properties!).length} fields
                  </Badge>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {Object.entries(schema.properties!).map(([key, prop]) => {
                    const typedProp = prop as PropertySchema;
                    const fieldType = getFieldTypeFromSchema(typedProp);
                    const fieldConfig = getFieldConfig(fieldType);
                    const isRequired = schema.required?.includes(key);

                    return (
                      <div
                        key={key}
                        className="group flex flex-col gap-2 rounded-lg border p-3 transition-colors hover:bg-gray-50/50"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-foreground text-sm font-medium">
                                {typedProp.title || key}
                              </span>
                              {isRequired && (
                                <Badge
                                  variant="destructive"
                                  className="h-4 px-1 text-[10px] uppercase"
                                >
                                  Required
                                </Badge>
                              )}
                            </div>
                            <p className="text-muted-foreground font-mono text-xs">
                              Key: {key}
                            </p>
                          </div>
                          <Badge
                            variant="secondary"
                            className={cn(
                              "shrink-0 text-[10px] font-medium tracking-wider uppercase",
                              fieldConfig.badgeColor,
                            )}
                          >
                            {fieldConfig.label}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-muted-foreground flex flex-col items-center justify-center py-10 text-center">
                <p className="font-medium">No fields defined</p>
                <p className="mt-1 text-sm">
                  This step has no associated form fields.
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
