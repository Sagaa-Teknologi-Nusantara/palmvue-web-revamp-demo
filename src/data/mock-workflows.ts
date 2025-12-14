import type { Workflow } from '@/types';

export const mockWorkflows: Workflow[] = [
  {
    id: 'wf-tree-assessment',
    name: 'Palm Tree Assessment',
    steps: [
      {
        id: 'step-initial-check',
        name: 'Initial Check',
        order_index: 0,
        form: {
          id: 'form-initial-check',
          name: 'Initial Check Form',
          schema: {
            type: 'object',
            properties: {
              condition: {
                type: 'string',
                enum: ['good', 'fair', 'poor'],
                title: 'Overall Condition',
              },
              visualIssues: { type: 'string', title: 'Visual Issues Observed' },
              notes: { type: 'string', title: 'Notes' },
            },
            required: ['condition'],
          },
        },
      },
      {
        id: 'step-detailed-assessment',
        name: 'Detailed Assessment',
        order_index: 1,
        form: {
          id: 'form-detailed-assessment',
          name: 'Detailed Assessment Form',
          schema: {
            type: 'object',
            properties: {
              trunkCondition: {
                type: 'string',
                enum: ['healthy', 'damaged', 'diseased'],
                title: 'Trunk Condition',
              },
              crownCondition: {
                type: 'string',
                enum: ['healthy', 'sparse', 'damaged'],
                title: 'Crown Condition',
              },
              pestPresence: { type: 'boolean', title: 'Pest Presence' },
              estimatedYield: { type: 'number', title: 'Estimated Yield (kg)' },
            },
            required: ['trunkCondition', 'crownCondition'],
          },
        },
      },
      {
        id: 'step-final-review',
        name: 'Final Review',
        order_index: 2,
        form: {
          id: 'form-final-review',
          name: 'Final Review Form',
          schema: {
            type: 'object',
            properties: {
              recommendation: {
                type: 'string',
                enum: ['no_action', 'treatment_needed', 'monitoring', 'removal'],
                title: 'Recommendation',
              },
              priority: {
                type: 'string',
                enum: ['low', 'medium', 'high'],
                title: 'Priority',
              },
              followUpDate: { type: 'string', format: 'date', title: 'Follow-up Date' },
              summary: { type: 'string', title: 'Assessment Summary' },
            },
            required: ['recommendation', 'priority'],
          },
        },
      },
    ],
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z',
  },
  {
    id: 'wf-equipment-maintenance',
    name: 'Equipment Maintenance',
    steps: [
      {
        id: 'step-pre-inspection',
        name: 'Pre-Inspection',
        order_index: 0,
        form: {
          id: 'form-pre-inspection',
          name: 'Pre-Inspection Form',
          schema: {
            type: 'object',
            properties: {
              operatingHours: { type: 'number', title: 'Operating Hours' },
              visualCondition: {
                type: 'string',
                enum: ['good', 'wear', 'damaged'],
                title: 'Visual Condition',
              },
              fluidLevels: {
                type: 'string',
                enum: ['ok', 'low', 'critical'],
                title: 'Fluid Levels',
              },
            },
            required: ['operatingHours', 'visualCondition'],
          },
        },
      },
      {
        id: 'step-maintenance-work',
        name: 'Maintenance Work',
        order_index: 1,
        form: {
          id: 'form-maintenance-work',
          name: 'Maintenance Work Form',
          schema: {
            type: 'object',
            properties: {
              workPerformed: { type: 'string', title: 'Work Performed' },
              partsReplaced: { type: 'string', title: 'Parts Replaced' },
              laborHours: { type: 'number', title: 'Labor Hours' },
            },
            required: ['workPerformed'],
          },
        },
      },
      {
        id: 'step-post-inspection',
        name: 'Post-Inspection',
        order_index: 2,
        form: {
          id: 'form-post-inspection',
          name: 'Post-Inspection Form',
          schema: {
            type: 'object',
            properties: {
              testResults: {
                type: 'string',
                enum: ['pass', 'fail'],
                title: 'Test Results',
              },
              returnToService: { type: 'boolean', title: 'Return to Service' },
              notes: { type: 'string', title: 'Final Notes' },
            },
            required: ['testResults', 'returnToService'],
          },
        },
      },
    ],
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'wf-plot-inspection',
    name: 'Plot Inspection',
    steps: [
      {
        id: 'step-boundary-check',
        name: 'Boundary Check',
        order_index: 0,
        form: {
          id: 'form-boundary-check',
          name: 'Boundary Check Form',
          schema: {
            type: 'object',
            properties: {
              boundaryIntact: { type: 'boolean', title: 'Boundary Intact' },
              fencingCondition: {
                type: 'string',
                enum: ['good', 'needs_repair', 'missing'],
                title: 'Fencing Condition',
              },
              accessPoints: { type: 'number', title: 'Number of Access Points' },
            },
            required: ['boundaryIntact'],
          },
        },
      },
      {
        id: 'step-soil-analysis',
        name: 'Soil Analysis',
        order_index: 1,
        form: {
          id: 'form-soil-analysis',
          name: 'Soil Analysis Form',
          schema: {
            type: 'object',
            properties: {
              phLevel: { type: 'number', title: 'pH Level' },
              moistureLevel: {
                type: 'string',
                enum: ['dry', 'optimal', 'wet'],
                title: 'Moisture Level',
              },
              nutrientStatus: {
                type: 'string',
                enum: ['deficient', 'adequate', 'rich'],
                title: 'Nutrient Status',
              },
            },
            required: ['moistureLevel'],
          },
        },
      },
      {
        id: 'step-vegetation-survey',
        name: 'Vegetation Survey',
        order_index: 2,
        form: {
          id: 'form-vegetation-survey',
          name: 'Vegetation Survey Form',
          schema: {
            type: 'object',
            properties: {
              treeCount: { type: 'integer', title: 'Tree Count' },
              weedPresence: {
                type: 'string',
                enum: ['none', 'light', 'moderate', 'heavy'],
                title: 'Weed Presence',
              },
              diseaseIndicators: { type: 'boolean', title: 'Disease Indicators' },
            },
            required: ['treeCount'],
          },
        },
      },
      {
        id: 'step-report-generation',
        name: 'Report Generation',
        order_index: 3,
        form: {
          id: 'form-report-generation',
          name: 'Report Generation Form',
          schema: {
            type: 'object',
            properties: {
              overallRating: {
                type: 'string',
                enum: ['excellent', 'good', 'fair', 'poor'],
                title: 'Overall Rating',
              },
              recommendations: { type: 'string', title: 'Recommendations' },
              nextInspectionDate: {
                type: 'string',
                format: 'date',
                title: 'Next Inspection Date',
              },
            },
            required: ['overallRating'],
          },
        },
      },
    ],
    created_at: '2024-01-20T00:00:00Z',
    updated_at: '2024-01-20T00:00:00Z',
  },
];
