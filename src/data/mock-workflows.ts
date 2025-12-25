import type { Workflow } from "@/types";

export const mockWorkflows: Workflow[] = [
  {
    id: "wf-tree-assessment",
    name: "Palm Tree Assessment",
    is_loopable: false,
    is_auto_start: false,
    steps: [
      {
        id: "step-initial-check",
        name: "Initial Check",
        order_index: 0,
        requires_approval: false,
        form: {
          id: "form-initial-check",
          name: "Initial Check Form",
          schema: {
            type: "object",
            properties: {
              condition: {
                type: "string",
                enum: ["good", "fair", "poor"],
                title: "Overall Condition",
              },
              visualIssues: { type: "string", title: "Visual Issues Observed" },
              notes: { type: "string", title: "Notes" },
            },
            required: ["condition"],
          },
        },
      },
      {
        id: "step-detailed-assessment",
        name: "Detailed Assessment",
        order_index: 1,
        requires_approval: false,
        form: {
          id: "form-detailed-assessment",
          name: "Detailed Assessment Form",
          schema: {
            type: "object",
            properties: {
              trunkCondition: {
                type: "string",
                enum: ["healthy", "damaged", "diseased"],
                title: "Trunk Condition",
              },
              crownCondition: {
                type: "string",
                enum: ["healthy", "sparse", "damaged"],
                title: "Crown Condition",
              },
              pestPresence: { type: "boolean", title: "Pest Presence" },
              estimatedYield: { type: "number", title: "Estimated Yield (kg)" },
            },
            required: ["trunkCondition", "crownCondition"],
          },
        },
      },
      {
        id: "step-final-review",
        name: "Final Review",
        order_index: 2,
        requires_approval: true,
        form: {
          id: "form-final-review",
          name: "Final Review Form",
          schema: {
            type: "object",
            properties: {
              recommendation: {
                type: "string",
                enum: [
                  "no_action",
                  "treatment_needed",
                  "monitoring",
                  "removal",
                ],
                title: "Recommendation",
              },
              priority: {
                type: "string",
                enum: ["low", "medium", "high"],
                title: "Priority",
              },
              followUpDate: {
                type: "string",
                format: "date",
                title: "Follow-up Date",
              },
              summary: { type: "string", title: "Assessment Summary" },
            },
            required: ["recommendation", "priority"],
          },
        },
      },
    ],
    created_at: "2024-01-10T00:00:00Z",
    updated_at: "2024-01-10T00:00:00Z",
  },
  {
    id: "wf-equipment-maintenance",
    name: "Equipment Maintenance",
    is_loopable: false,
    is_auto_start: false,
    steps: [
      {
        id: "step-pre-inspection",
        name: "Pre-Inspection",
        order_index: 0,
        requires_approval: false,
        form: {
          id: "form-pre-inspection",
          name: "Pre-Inspection Form",
          schema: {
            type: "object",
            properties: {
              operatingHours: { type: "number", title: "Operating Hours" },
              visualCondition: {
                type: "string",
                enum: ["good", "wear", "damaged"],
                title: "Visual Condition",
              },
              fluidLevels: {
                type: "string",
                enum: ["ok", "low", "critical"],
                title: "Fluid Levels",
              },
            },
            required: ["operatingHours", "visualCondition"],
          },
        },
      },
      {
        id: "step-maintenance-work",
        name: "Maintenance Work",
        order_index: 1,
        requires_approval: false,
        form: {
          id: "form-maintenance-work",
          name: "Maintenance Work Form",
          schema: {
            type: "object",
            properties: {
              workPerformed: { type: "string", title: "Work Performed" },
              partsReplaced: { type: "string", title: "Parts Replaced" },
              laborHours: { type: "number", title: "Labor Hours" },
            },
            required: ["workPerformed"],
          },
        },
      },
      {
        id: "step-post-inspection",
        name: "Post-Inspection",
        order_index: 2,
        requires_approval: true,
        form: {
          id: "form-post-inspection",
          name: "Post-Inspection Form",
          schema: {
            type: "object",
            properties: {
              testResults: {
                type: "string",
                enum: ["pass", "fail"],
                title: "Test Results",
              },
              returnToService: { type: "boolean", title: "Return to Service" },
              notes: { type: "string", title: "Final Notes" },
            },
            required: ["testResults", "returnToService"],
          },
        },
      },
    ],
    created_at: "2024-01-15T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z",
  },
  {
    id: "wf-plot-inspection",
    name: "Plot Inspection",
    is_loopable: true,
    is_auto_start: false,
    steps: [
      {
        id: "step-boundary-check",
        name: "Boundary Check",
        order_index: 0,
        requires_approval: false,
        form: {
          id: "form-boundary-check",
          name: "Boundary Check Form",
          schema: {
            type: "object",
            properties: {
              boundaryIntact: { type: "boolean", title: "Boundary Intact" },
              fencingCondition: {
                type: "string",
                enum: ["good", "needs_repair", "missing"],
                title: "Fencing Condition",
              },
              accessPoints: {
                type: "number",
                title: "Number of Access Points",
              },
            },
            required: ["boundaryIntact"],
          },
        },
      },
      {
        id: "step-soil-analysis",
        name: "Soil Analysis",
        order_index: 1,
        requires_approval: false,
        form: {
          id: "form-soil-analysis",
          name: "Soil Analysis Form",
          schema: {
            type: "object",
            properties: {
              phLevel: { type: "number", title: "pH Level" },
              moistureLevel: {
                type: "string",
                enum: ["dry", "optimal", "wet"],
                title: "Moisture Level",
              },
              nutrientStatus: {
                type: "string",
                enum: ["deficient", "adequate", "rich"],
                title: "Nutrient Status",
              },
            },
            required: ["moistureLevel"],
          },
        },
      },
      {
        id: "step-vegetation-survey",
        name: "Vegetation Survey",
        order_index: 2,
        requires_approval: false,
        form: {
          id: "form-vegetation-survey",
          name: "Vegetation Survey Form",
          schema: {
            type: "object",
            properties: {
              treeCount: { type: "integer", title: "Tree Count" },
              weedPresence: {
                type: "string",
                enum: ["none", "light", "moderate", "heavy"],
                title: "Weed Presence",
              },
              diseaseIndicators: {
                type: "boolean",
                title: "Disease Indicators",
              },
            },
            required: ["treeCount"],
          },
        },
      },
      {
        id: "step-report-generation",
        name: "Report Generation",
        order_index: 3,
        requires_approval: true,
        form: {
          id: "form-report-generation",
          name: "Report Generation Form",
          schema: {
            type: "object",
            properties: {
              overallRating: {
                type: "string",
                enum: ["excellent", "good", "fair", "poor"],
                title: "Overall Rating",
              },
              recommendations: { type: "string", title: "Recommendations" },
              nextInspectionDate: {
                type: "string",
                format: "date",
                title: "Next Inspection Date",
              },
            },
            required: ["overallRating"],
          },
        },
      },
    ],
    created_at: "2024-01-20T00:00:00Z",
    updated_at: "2024-01-20T00:00:00Z",
  },
  {
    id: "wf-harvest-cycle",
    name: "Harvest Cycle",
    is_loopable: true,
    is_auto_start: true,
    steps: [
      {
        id: "step-pre-harvest-check",
        name: "Pre-Harvest Check",
        order_index: 0,
        requires_approval: false,
        form: {
          id: "form-pre-harvest-check",
          name: "Pre-Harvest Checklist",
          schema: {
            type: "object",
            properties: {
              ripenessLevel: {
                type: "string",
                enum: ["underripe", "optimal", "overripe"],
                title: "Average Ripeness Level",
              },
              weatherConditions: {
                type: "string",
                enum: ["sunny", "cloudy", "rainy"],
                title: "Weather Conditions",
              },
              accessClear: { type: "boolean", title: "Access Paths Clear?" },
            },
            required: ["ripenessLevel", "accessClear"],
          },
        },
      },
      {
        id: "step-harvesting",
        name: "Harvesting",
        order_index: 1,
        requires_approval: false,
        form: {
          id: "form-harvesting",
          name: "Harvest Log",
          schema: {
            type: "object",
            properties: {
              bunchesHarvested: { type: "integer", title: "Bunches Harvested" },
              workersCount: { type: "integer", title: "Number of Workers" },
              startTime: { type: "string", title: "Start Time" },
              endTime: { type: "string", title: "End Time" },
            },
            required: ["bunchesHarvested", "workersCount"],
          },
        },
      },
      {
        id: "step-yield-recording",
        name: "Yield Recording",
        order_index: 2,
        requires_approval: true,
        form: {
          id: "form-yield-recording",
          name: "Yield Record",
          schema: {
            type: "object",
            properties: {
              totalWeight: { type: "number", title: "Total Weight (kg)" },
              qualityGrade: {
                type: "string",
                enum: ["A", "B", "C", "rejected"],
                title: "Quality Grade",
              },
              transportVehicleId: {
                type: "string",
                title: "Transport Vehicle ID",
              },
            },
            required: ["totalWeight", "qualityGrade"],
          },
        },
      },
    ],
    created_at: "2024-02-01T00:00:00Z",
    updated_at: "2024-02-01T00:00:00Z",
  },
  {
    id: "wf-safety-training",
    name: "Safety Training Log",
    is_loopable: false,
    is_auto_start: false,
    steps: [
      {
        id: "step-training-session",
        name: "Training Session",
        order_index: 0,
        requires_approval: false,
        form: {
          id: "form-training-session",
          name: "Training Details",
          schema: {
            type: "object",
            properties: {
              moduleName: { type: "string", title: "Training Module Name" },
              trainerName: { type: "string", title: "Trainer Name" },
              durationHours: { type: "number", title: "Duration (Hours)" },
              dateConducted: {
                type: "string",
                format: "date",
                title: "Date Conducted",
              },
            },
            required: ["moduleName", "dateConducted"],
          },
        },
      },
      {
        id: "step-quiz",
        name: "Quiz / Assessment",
        order_index: 1,
        requires_approval: false,
        form: {
          id: "form-quiz",
          name: "Assessment Results",
          schema: {
            type: "object",
            properties: {
              score: { type: "number", title: "Quiz Score (%)" },
              passed: { type: "boolean", title: "Passed?" },
              areasForImprovement: {
                type: "string",
                title: "Areas for Improvement",
              },
            },
            required: ["score", "passed"],
          },
        },
      },
      {
        id: "step-certification",
        name: "Certification Issuance",
        order_index: 2,
        requires_approval: true,
        form: {
          id: "form-certification",
          name: "Certificate Details",
          schema: {
            type: "object",
            properties: {
              certificateId: { type: "string", title: "Certificate ID" },
              expiryDate: {
                type: "string",
                format: "date",
                title: "Expiry Date",
              },
              issuedBy: { type: "string", title: "Issued By" },
            },
            required: ["certificateId"],
          },
        },
      },
    ],
    created_at: "2024-02-05T00:00:00Z",
    updated_at: "2024-02-05T00:00:00Z",
  },
  {
    id: "wf-pest-control",
    name: "Pest Control",
    is_loopable: true,
    is_auto_start: false,
    steps: [
      {
        id: "step-pest-inspection",
        name: "Pest Inspection",
        order_index: 0,
        requires_approval: false,
        form: {
          id: "form-pest-inspection",
          name: "Pest Inspection Form",
          schema: {
            type: "object",
            properties: {
              pestType: { type: "string", title: "Pest Type Identified" },
              infestationLevel: {
                type: "string",
                enum: ["none", "low", "moderate", "severe"],
                title: "Infestation Level",
              },
            },
            required: ["infestationLevel"],
          },
        },
      },
    ],
    created_at: "2024-02-10T00:00:00Z",
    updated_at: "2024-02-10T00:00:00Z",
  },
  {
    id: "wf-fertilizer-application",
    name: "Fertilizer Application",
    is_loopable: true,
    is_auto_start: false,
    steps: [
      {
        id: "step-soil-test",
        name: "Soil Testing",
        order_index: 0,
        requires_approval: false,
        form: {
          id: "form-soil-test",
          name: "Soil Test Form",
          schema: {
            type: "object",
            properties: {
              phLevel: { type: "number", title: "pH Level" },
              nitrogenLevel: {
                type: "string",
                enum: ["low", "medium", "high"],
                title: "Nitrogen Level",
              },
            },
            required: ["nitrogenLevel"],
          },
        },
      },
      {
        id: "step-apply-fertilizer",
        name: "Apply Fertilizer",
        order_index: 1,
        requires_approval: true,
        form: {
          id: "form-apply-fertilizer",
          name: "Application Log",
          schema: {
            type: "object",
            properties: {
              fertilizerType: { type: "string", title: "Fertilizer Type" },
              quantityKg: { type: "number", title: "Quantity (kg)" },
              applicationDate: {
                type: "string",
                format: "date",
                title: "Application Date",
              },
            },
            required: ["fertilizerType", "quantityKg"],
          },
        },
      },
    ],
    created_at: "2024-02-15T00:00:00Z",
    updated_at: "2024-02-15T00:00:00Z",
  },
  {
    id: "wf-new-planting",
    name: "New Planting",
    is_loopable: false,
    is_auto_start: true,
    steps: [
      {
        id: "step-site-prep",
        name: "Site Preparation",
        order_index: 0,
        requires_approval: false,
        form: {
          id: "form-site-prep",
          name: "Site Prep Form",
          schema: {
            type: "object",
            properties: {
              cleared: { type: "boolean", title: "Site Cleared?" },
              soilPrepared: { type: "boolean", title: "Soil Prepared?" },
            },
            required: ["cleared"],
          },
        },
      },
      {
        id: "step-hole-digging",
        name: "Hole Digging",
        order_index: 1,
        requires_approval: false,
        form: {
          id: "form-hole-digging",
          name: "Hole Digging Log",
          schema: {
            type: "object",
            properties: {
              holesCount: { type: "integer", title: "Number of Holes Dug" },
              depthCm: { type: "number", title: "Depth (cm)" },
            },
            required: ["holesCount"],
          },
        },
      },
      {
        id: "step-seedling-plant",
        name: "Seedling Planting",
        order_index: 2,
        requires_approval: false,
        form: {
          id: "form-seedling-plant",
          name: "Planting Log",
          schema: {
            type: "object",
            properties: {
              seedlingsPlanted: { type: "integer", title: "Seedlings Planted" },
              variety: { type: "string", title: "Variety" },
            },
            required: ["seedlingsPlanted"],
          },
        },
      },
      {
        id: "step-initial-watering",
        name: "Initial Watering",
        order_index: 3,
        requires_approval: true,
        form: {
          id: "form-initial-watering",
          name: "Watering Log",
          schema: {
            type: "object",
            properties: {
              waterLiters: { type: "number", title: "Water Used (Liters)" },
              mulchApplied: { type: "boolean", title: "Mulch Applied?" },
            },
            required: ["waterLiters"],
          },
        },
      },
    ],
    created_at: "2024-02-20T00:00:00Z",
    updated_at: "2024-02-20T00:00:00Z",
  },
  {
    id: "wf-worker-onboarding",
    name: "Worker Onboarding",
    is_loopable: false,
    is_auto_start: true,
    steps: [
      {
        id: "step-document-check",
        name: "Document Verification",
        order_index: 0,
        requires_approval: false,
        form: {
          id: "form-document-check",
          name: "Document Check Form",
          schema: {
            type: "object",
            properties: {
              idVerified: { type: "boolean", title: "ID Verified?" },
              contractSigned: { type: "boolean", title: "Contract Signed?" },
            },
            required: ["idVerified", "contractSigned"],
          },
        },
      },
      {
        id: "step-orientation",
        name: "Orientation Session",
        order_index: 1,
        requires_approval: false,
        form: {
          id: "form-orientation",
          name: "Orientation Form",
          schema: {
            type: "object",
            properties: {
              attendedOrientation: {
                type: "boolean",
                title: "Attended Orientation?",
              },
              receivedHandbook: {
                type: "boolean",
                title: "Received Handbook?",
              },
            },
            required: ["attendedOrientation"],
          },
        },
      },
      {
        id: "step-ppe-issuance",
        name: "PPE Issuance",
        order_index: 2,
        requires_approval: false,
        form: {
          id: "form-ppe-issuance",
          name: "PPE Issuance Form",
          schema: {
            type: "object",
            properties: {
              helmet: { type: "boolean", title: "Helmet Issued?" },
              gloves: { type: "boolean", title: "Gloves Issued?" },
              boots: { type: "boolean", title: "Boots Issued?" },
            },
            required: ["helmet", "gloves", "boots"],
          },
        },
      },
      {
        id: "step-field-intro",
        name: "Field Introduction",
        order_index: 3,
        requires_approval: false,
        form: {
          id: "form-field-intro",
          name: "Field Intro Form",
          schema: {
            type: "object",
            properties: {
              supervisorMet: { type: "boolean", title: "Met Supervisor?" },
              assignedArea: { type: "string", title: "Assigned Area" },
            },
            required: ["supervisorMet"],
          },
        },
      },
      {
        id: "step-final-checklist",
        name: "Final Checklist",
        order_index: 4,
        requires_approval: true,
        form: {
          id: "form-final-checklist",
          name: "Final Checklist Form",
          schema: {
            type: "object",
            properties: {
              allTasksComplete: {
                type: "boolean",
                title: "All Tasks Complete?",
              },
              readyForWork: { type: "boolean", title: "Ready for Work?" },
              comments: { type: "string", title: "Comments" },
            },
            required: ["allTasksComplete", "readyForWork"],
          },
        },
      },
    ],
    created_at: "2024-02-25T00:00:00Z",
    updated_at: "2024-02-25T00:00:00Z",
  },
];
