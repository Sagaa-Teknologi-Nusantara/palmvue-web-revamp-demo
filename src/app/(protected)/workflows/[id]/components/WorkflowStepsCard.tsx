import {
  Calendar,
  CheckCircle2,
  FileText,
  Hash,
  List,
  ShieldCheck,
  Split,
  Type,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/cn";
import type { JSONSchema, PropertySchema, WorkflowStep } from "@/types";

const FIELD_TYPE_CONFIG: Record<
  string,
  { label: string; color: string; icon: React.ElementType }
> = {
  string: {
    label: "Text",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",
    icon: Type,
  },
  number: {
    label: "Number",
    color:
      "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400",
    icon: Hash,
  },
  integer: {
    label: "Integer",
    color:
      "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400",
    icon: Hash,
  },
  boolean: {
    label: "Boolean",
    color:
      "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400",
    icon: CheckCircle2,
  },
  date: {
    label: "Date",
    color:
      "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400",
    icon: Calendar,
  },
  dropdown: {
    label: "Dropdown",
    color: "bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-400",
    icon: List,
  },
};

function getFieldType(prop: PropertySchema): string {
  if (prop.enum) return "dropdown";
  if (prop.format === "date") return "date";
  return prop.type || "string";
}

interface WorkflowStepsCardProps {
  steps: WorkflowStep[];
}

export function WorkflowStepsCard({ steps }: WorkflowStepsCardProps) {
  const sortedSteps = [...steps].sort((a, b) => a.order_index - b.order_index);

  return (
    <Card className="md:bg-card h-full border-none bg-transparent shadow-none md:border md:shadow-sm">
      <CardHeader className="px-0 md:px-6">
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="bg-primary/10 text-primary rounded-md p-1.5">
            <Split className="h-4 w-4" />
          </span>
          Workflow Steps
        </CardTitle>
        <CardDescription>
          Execution order and form configuration
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 md:px-6">
        <div className="space-y-6">
          {sortedSteps.map((step, index) => (
            <div key={step.id} className="group relative flex gap-4">
              {/* Timeline Line */}
              {index !== sortedSteps.length - 1 && (
                <div className="bg-border absolute top-10 -bottom-6 left-[1.15rem] w-0.5" />
              )}

              {/* Number Bubble */}
              <div className="border-background bg-muted text-muted-foreground group-hover:border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 text-sm font-bold shadow-sm transition-colors">
                {index + 1}
              </div>

              {/* Step Content */}
              <div className="bg-card w-full rounded-lg border p-4 shadow-sm transition-all hover:shadow-md">
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-semibold">{step.name}</h3>
                    <div className="text-muted-foreground mt-0.5 flex items-center gap-1.5 text-xs">
                      <FileText className="h-3 w-3" />
                      Form:{" "}
                      <span className="text-foreground font-medium">
                        {step.form.name}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {step.requires_approval && (
                      <Badge
                        variant="secondary"
                        className="bg-amber-100 text-[10px] text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"
                      >
                        <ShieldCheck className="mr-1 h-3 w-3" />
                        Approval
                      </Badge>
                    )}
                    <Badge variant="secondary" className="text-[10px]">
                      Step {index + 1}
                    </Badge>
                  </div>
                </div>

                <div className="bg-muted/30 rounded-md border border-dashed p-3">
                  <p className="text-muted-foreground mb-3 text-[10px] font-medium tracking-wider uppercase">
                    Form Fields
                  </p>
                  <FormSchemaDisplay schema={step.form.schema} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function FormSchemaDisplay({ schema }: { schema: JSONSchema }) {
  if (!schema.properties || Object.keys(schema.properties).length === 0) {
    return (
      <div className="text-muted-foreground bg-muted/20 flex flex-col items-center justify-center rounded-lg border border-dashed py-4 text-center">
        <p className="text-xs">No fields defined.</p>
      </div>
    );
  }

  const requiredFields = schema.required || [];

  return (
    <div className="space-y-2">
      {Object.entries(schema.properties).map(([fieldName, prop]) => {
        const fieldType = getFieldType(prop);
        const config = FIELD_TYPE_CONFIG[fieldType] || FIELD_TYPE_CONFIG.string;
        const Icon = config.icon;
        const isRequired = requiredFields.includes(fieldName);

        return (
          <div
            key={fieldName}
            className="group bg-card hover:border-primary/50 relative overflow-hidden rounded-md border p-2.5 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {prop.title || fieldName}
                </span>
                {isRequired && (
                  <span
                    title="Required"
                    className="text-destructive text-xs font-bold"
                  >
                    *
                  </span>
                )}
                <code className="bg-muted text-muted-foreground rounded px-1 py-0.5 font-mono text-[10px]">
                  {fieldName}
                </code>
              </div>
              <Badge
                variant="secondary"
                className={cn(
                  "flex shrink-0 items-center gap-1 px-1.5 py-0 text-[10px] font-medium transition-colors",
                  config.color,
                )}
              >
                <Icon className="h-3 w-3" />
                {config.label}
              </Badge>
            </div>
            {prop.description && (
              <p className="text-muted-foreground mt-1 text-[10px]">
                {prop.description}
              </p>
            )}
            {prop.enum && prop.enum.length > 0 && (
              <div className="mt-1.5 flex flex-wrap gap-1">
                {prop.enum.map((option) => (
                  <span
                    key={option}
                    className="bg-muted/50 text-muted-foreground rounded border px-1 py-0.5 text-[10px]"
                  >
                    {option}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
