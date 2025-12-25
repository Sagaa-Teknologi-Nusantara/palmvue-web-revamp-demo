import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import { getFieldConfig, getFieldTypeFromSchema } from "@/lib/field-types";
import type { JSONSchema, PropertySchema } from "@/types";

interface MetadataSchemaDisplayProps {
  schema: JSONSchema;
}

export function MetadataSchemaDisplay({ schema }: MetadataSchemaDisplayProps) {
  if (!schema.properties || Object.keys(schema.properties).length === 0) {
    return (
      <div className="text-muted-foreground bg-muted/20 flex flex-col items-center justify-center rounded-lg border border-dashed py-8 text-center">
        <p>No metadata fields defined.</p>
      </div>
    );
  }

  const requiredFields = schema.required || [];

  return (
    <div className="grid grid-cols-1 gap-3">
      {Object.entries(schema.properties).map(([fieldName, prop]) => {
        const fieldType = getFieldTypeFromSchema(prop as PropertySchema);
        const config = getFieldConfig(fieldType);
        const Icon = config.icon;
        const isRequired = requiredFields.includes(fieldName);

        return (
          <div
            key={fieldName}
            className="group bg-card hover:border-primary/50 relative overflow-hidden rounded-lg border p-3 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">
                    {(prop as PropertySchema).title || fieldName}
                  </span>
                  {isRequired && (
                    <span
                      title="Required"
                      className="text-destructive text-xs font-bold"
                    >
                      *
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <code className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 font-mono text-[10px]">
                    {fieldName}
                  </code>
                </div>
              </div>
              <Badge
                variant="secondary"
                className={cn(
                  "flex shrink-0 items-center gap-1.5 px-2 py-0.5 text-[10px] font-medium transition-colors",
                  config.badgeColor,
                )}
              >
                <Icon className="h-3 w-3" />
                {config.label}
              </Badge>
            </div>

            {(prop as PropertySchema).description && (
              <p className="text-muted-foreground mt-2 text-xs">
                {(prop as PropertySchema).description}
              </p>
            )}

            {(prop as PropertySchema).enum &&
              (prop as PropertySchema).enum!.length > 0 && (
                <div className="mt-3">
                  <p className="text-muted-foreground mb-1.5 text-[10px] font-medium tracking-wider uppercase">
                    Options
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {(prop as PropertySchema).enum!.map((option) => (
                      <span
                        key={option}
                        className="bg-muted/50 text-muted-foreground rounded border px-1.5 py-0.5 text-[10px]"
                      >
                        {option}
                      </span>
                    ))}
                  </div>
                </div>
              )}
          </div>
        );
      })}
    </div>
  );
}
