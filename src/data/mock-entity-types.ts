import type { EntityType } from '@/types';

export const mockEntityTypes: EntityType[] = [
  {
    id: 'et-palm-tree',
    name: 'Palm Tree',
    description: 'Represents a palm tree asset in the plantation',
    prefix: 'TREE',
    metadata_schema: {
      type: 'object',
      properties: {
        height: { type: 'number', title: 'Height (meters)' },
        species: { type: 'string', title: 'Species' },
        plantedDate: { type: 'string', format: 'date', title: 'Planted Date' },
        healthStatus: {
          type: 'string',
          enum: ['healthy', 'needs_attention', 'critical'],
          title: 'Health Status',
        },
      },
      required: ['species', 'plantedDate'],
    },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'et-plot',
    name: 'Plot',
    description: 'A plot of land containing multiple trees',
    prefix: 'PLOT',
    metadata_schema: {
      type: 'object',
      properties: {
        area: { type: 'number', title: 'Area (hectares)' },
        soilType: { type: 'string', title: 'Soil Type' },
        irrigationType: {
          type: 'string',
          enum: ['drip', 'sprinkler', 'flood', 'none'],
          title: 'Irrigation Type',
        },
      },
      required: ['area'],
    },
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
  },
  {
    id: 'et-worker',
    name: 'Worker',
    description: 'Plantation worker profile',
    prefix: 'WRK',
    metadata_schema: {
      type: 'object',
      properties: {
        employeeId: { type: 'string', title: 'Employee ID' },
        department: { type: 'string', title: 'Department' },
        hireDate: { type: 'string', format: 'date', title: 'Hire Date' },
        certifications: { type: 'string', title: 'Certifications' },
      },
      required: ['employeeId', 'department'],
    },
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-03T00:00:00Z',
  },
  {
    id: 'et-equipment',
    name: 'Equipment',
    description: 'Machinery and equipment',
    prefix: 'EQUIP',
    metadata_schema: {
      type: 'object',
      properties: {
        serialNumber: { type: 'string', title: 'Serial Number' },
        manufacturer: { type: 'string', title: 'Manufacturer' },
        purchaseDate: { type: 'string', format: 'date', title: 'Purchase Date' },
        status: {
          type: 'string',
          enum: ['operational', 'maintenance', 'retired'],
          title: 'Status',
        },
      },
      required: ['serialNumber', 'status'],
    },
    created_at: '2024-01-04T00:00:00Z',
    updated_at: '2024-01-04T00:00:00Z',
  },
];
