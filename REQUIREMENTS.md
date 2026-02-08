I want to implement new page to see and trace all the workflow record from an entity to the root parents. I added one endpoint to get all the anchestor and its workflow record.

Endpoint: `GET /entities/{id}/workflow-history`

Response:

```json
{
    "success": true,
    "message": "Workflow history retrieved successfully",
    "data": [
        {
            "entity": {
                "id": "46eebc99-9c0b-4ef8-bb6d-6bb9bd380a76",
                "code": "SEED-0004",
                "name": "High-Oil Content Seed Line HOC-42"
            },
            "entity_type": {
                "id": "13eebc99-9c0b-4ef8-bb6d-6bb9bd380a43",
                "name": "Palm Seed",
                "description": "",
                "prefix": "SEED",
                "metadata_schema": null,
                "color": "Pink",
                "icon": "flower",
                "workflow_ids": null,
                "created_at": "0001-01-01T00:00:00Z",
                "updated_at": "0001-01-01T00:00:00Z"
            },
            "workflows": [
                {
                    "id": "e9eebc99-9c0b-4ef8-bb6d-6bb9bd380f1a",
                    "workflow_id": "72eebc99-9c0b-4ef8-bb6d-6bb9bd380c03",
                    "workflow": {
                        "id": "72eebc99-9c0b-4ef8-bb6d-6bb9bd380c03",
                        "name": "Genetic Quality Certification",
                        "is_loopable": false,
                        "is_auto_start": true,
                        "step_count": 0
                    },
                    "status": "in_progress",
                    "current_step_id": "89eebc99-9c0b-4ef8-bb6d-6bb9bd380d0a",
                    "steps": [
                        {
                            "id": "87eebc99-9c0b-4ef8-bb6d-6bb9bd380d08",
                            "name": "Certification Application",
                            "order_index": 0,
                            "requires_approval": true,
                            "form": {
                                "id": "69eebc99-9c0b-4ef8-bb6d-6bb9bd380b0a",
                                "name": "Genetic Certification Application",
                                "schema": {
                                    "type": "object",
                                    "required": [
                                        "certification_type",
                                        "genetic_profile_verified",
                                        "documentation_complete",
                                        "application_date"
                                    ],
                                    "properties": {
                                        "fees_paid": {
                                            "type": "boolean"
                                        },
                                        "application_date": {
                                            "type": "string",
                                            "format": "date"
                                        },
                                        "certification_type": {
                                            "type": "string"
                                        },
                                        "documentation_complete": {
                                            "type": "boolean"
                                        },
                                        "genetic_profile_verified": {
                                            "type": "boolean"
                                        }
                                    }
                                }
                            },
                            "submission_count": 1
                        },
                        {
                            "id": "88eebc99-9c0b-4ef8-bb6d-6bb9bd380d09",
                            "name": "Genetic Profile Self-Assessment",
                            "order_index": 1,
                            "requires_approval": false,
                            "form": {
                                "id": "6aeebc99-9c0b-4ef8-bb6d-6bb9bd380b0b",
                                "name": "Genetic Profile Assessment",
                                "schema": {
                                    "type": "object",
                                    "required": [
                                        "genetic_markers_confirmed",
                                        "assessment_date"
                                    ],
                                    "properties": {
                                        "assessment_date": {
                                            "type": "string",
                                            "format": "date"
                                        },
                                        "quality_standards_met": {
                                            "type": "array",
                                            "items": {
                                                "type": "string"
                                            }
                                        },
                                        "breeding_goals_aligned": {
                                            "type": "array",
                                            "items": {
                                                "type": "string"
                                            }
                                        },
                                        "genetic_markers_confirmed": {
                                            "type": "array",
                                            "items": {
                                                "type": "string"
                                            }
                                        }
                                    }
                                }
                            },
                            "submission_count": 1
                        },
                        {
                            "id": "89eebc99-9c0b-4ef8-bb6d-6bb9bd380d0a",
                            "name": "Field Verification Survey",
                            "order_index": 2,
                            "requires_approval": true,
                            "form": {
                                "id": "62eebc99-9c0b-4ef8-bb6d-6bb9bd380b03",
                                "name": "Field Condition Assessment",
                                "schema": {
                                    "type": "object",
                                    "required": [
                                        "soil_ph",
                                        "pest_presence",
                                        "irrigation_functioning",
                                        "field_rating",
                                        "assessment_date"
                                    ],
                                    "properties": {
                                        "soil_ph": {
                                            "type": "number",
                                            "maximum": 14,
                                            "minimum": 0
                                        },
                                        "field_rating": {
                                            "enum": [
                                                "excellent",
                                                "good",
                                                "fair",
                                                "poor"
                                            ],
                                            "type": "string"
                                        },
                                        "pest_presence": {
                                            "type": "boolean"
                                        },
                                        "soil_moisture": {
                                            "enum": [
                                                "dry",
                                                "optimal",
                                                "wet",
                                                "flooded"
                                            ],
                                            "type": "string"
                                        },
                                        "assessment_date": {
                                            "type": "string",
                                            "format": "date"
                                        },
                                        "disease_symptoms": {
                                            "type": "array",
                                            "items": {
                                                "type": "string"
                                            }
                                        },
                                        "irrigation_functioning": {
                                            "type": "boolean"
                                        }
                                    }
                                }
                            },
                            "submission_count": 1
                        },
                        {
                            "id": "8aeebc99-9c0b-4ef8-bb6d-6bb9bd380d0b",
                            "name": "Scientific Peer Review",
                            "order_index": 3,
                            "requires_approval": false,
                            "form": {
                                "id": "6beebc99-9c0b-4ef8-bb6d-6bb9bd380b0c",
                                "name": "Scientific Review Report",
                                "schema": {
                                    "type": "object",
                                    "required": [
                                        "reviewer_name",
                                        "research_findings",
                                        "review_date"
                                    ],
                                    "properties": {
                                        "review_date": {
                                            "type": "string",
                                            "format": "date"
                                        },
                                        "quality_score": {
                                            "type": "number",
                                            "maximum": 100,
                                            "minimum": 0
                                        },
                                        "reviewer_name": {
                                            "type": "string"
                                        },
                                        "recommendations": {
                                            "type": "array",
                                            "items": {
                                                "type": "string"
                                            }
                                        },
                                        "research_findings": {
                                            "type": "string"
                                        }
                                    }
                                }
                            },
                            "submission_count": 0
                        },
                        {
                            "id": "8beebc99-9c0b-4ef8-bb6d-6bb9bd380d0c",
                            "name": "Certification Decision",
                            "order_index": 4,
                            "requires_approval": true,
                            "form": {
                                "id": "6ceebc99-9c0b-4ef8-bb6d-6bb9bd380b0d",
                                "name": "Certification Decision",
                                "schema": {
                                    "type": "object",
                                    "required": [
                                        "certification_granted",
                                        "certification_level",
                                        "decision_date"
                                    ],
                                    "properties": {
                                        "conditions": {
                                            "type": "array",
                                            "items": {
                                                "type": "string"
                                            }
                                        },
                                        "valid_until": {
                                            "type": "string",
                                            "format": "date"
                                        },
                                        "decision_date": {
                                            "type": "string",
                                            "format": "date"
                                        },
                                        "certification_level": {
                                            "enum": [
                                                "full",
                                                "provisional",
                                                "denied"
                                            ],
                                            "type": "string"
                                        },
                                        "certification_granted": {
                                            "type": "boolean"
                                        }
                                    }
                                }
                            },
                            "submission_count": 0
                        }
                    ],
                    "started_at": "2025-11-18T10:29:49.048311+07:00",
                    "created_at": "2025-11-18T10:29:49.048311+07:00",
                    "updated_at": "2025-12-17T10:29:49.048311+07:00"
                },
                {
                    "id": "32f7efb3-f52d-4bb9-98bb-ec65dddce07b",
                    "workflow_id": "57491d63-6510-4ba0-a60b-f9a230438aec",
                    "workflow": {
                        "id": "57491d63-6510-4ba0-a60b-f9a230438aec",
                        "name": "Workflow For All",
                        "is_loopable": true,
                        "is_auto_start": false,
                        "step_count": 0
                    },
                    "status": "not_started",
                    "steps": [
                        {
                            "id": "41fa9c7f-8341-4353-90f0-b7df343a75b5",
                            "name": "First Step",
                            "order_index": 0,
                            "requires_approval": true,
                            "form": {
                                "id": "e1ab228f-1a92-4950-860c-adef6228f8a1",
                                "name": "First Form",
                                "schema": {
                                    "type": "object",
                                    "required": [
                                        "firstField"
                                    ],
                                    "properties": {
                                        "firstField": {
                                            "type": "integer",
                                            "title": "FirstField"
                                        },
                                        "secondFIeld": {
                                            "type": "number",
                                            "title": "Second"
                                        }
                                    }
                                }
                            },
                            "submission_count": 0
                        },
                        {
                            "id": "e58b7cb6-ad36-44a8-a3d0-56209a1bcccc",
                            "name": "Second Step",
                            "order_index": 1,
                            "requires_approval": false,
                            "form": {
                                "id": "91420451-1e17-4dd6-a5b2-f60b8e1ce020",
                                "name": "Second Form",
                                "schema": {
                                    "type": "object",
                                    "required": [
                                        "third"
                                    ],
                                    "properties": {
                                        "third": {
                                            "type": "integer",
                                            "title": "Third"
                                        }
                                    }
                                }
                            },
                            "submission_count": 0
                        }
                    ],
                    "started_at": "2026-01-02T17:20:16.040692+07:00",
                    "created_at": "2026-01-02T17:20:16.040692+07:00",
                    "updated_at": "2026-01-02T17:20:16.040692+07:00"
                }
            ]
        },
        {
            "entity": {
                "id": "8de73af2-a1ce-43a4-babb-0427ccca341d",
                "code": "POLN-0011",
                "name": "Pollen GuliGulinggg"
            },
            "entity_type": {
                "id": "12eebc99-9c0b-4ef8-bb6d-6bb9bd380a42",
                "name": "Pollen Sample",
                "description": "",
                "prefix": "POLN",
                "metadata_schema": null,
                "color": "green",
                "icon": "trees",
                "workflow_ids": null,
                "created_at": "0001-01-01T00:00:00Z",
                "updated_at": "0001-01-01T00:00:00Z"
            },
            "workflows": [
                {
                    "id": "a93418e0-aab9-48ae-ba89-58b8df7dda9f",
                    "workflow_id": "78eebc99-9c0b-4ef8-bb6d-6bb9bd380c09",
                    "workflow": {
                        "id": "78eebc99-9c0b-4ef8-bb6d-6bb9bd380c09",
                        "name": "Laboratory Equipment Calibration",
                        "is_loopable": true,
                        "is_auto_start": true,
                        "step_count": 0
                    },
                    "status": "in_progress",
                    "current_step_id": "9ceebc99-9c0b-4ef8-bb6d-6bb9bd380d1d",
                    "steps": [
                        {
                            "id": "9ceebc99-9c0b-4ef8-bb6d-6bb9bd380d1d",
                            "name": "Calibration Records Review",
                            "order_index": 0,
                            "requires_approval": false,
                            "form": {
                                "id": "61eebc99-9c0b-4ef8-bb6d-6bb9bd380b02",
                                "name": "Growth Data Collection Form",
                                "schema": {
                                    "type": "object",
                                    "required": [
                                        "current_height_cm",
                                        "trunk_diameter_cm",
                                        "frond_count",
                                        "health_status"
                                    ],
                                    "properties": {
                                        "frond_count": {
                                            "type": "number",
                                            "minimum": 0
                                        },
                                        "health_status": {
                                            "enum": [
                                                "excellent",
                                                "good",
                                                "fair",
                                                "poor"
                                            ],
                                            "type": "string"
                                        },
                                        "photos_attached": {
                                            "type": "boolean"
                                        },
                                        "current_height_cm": {
                                            "type": "number",
                                            "minimum": 0
                                        },
                                        "observation_notes": {
                                            "type": "string"
                                        },
                                        "trunk_diameter_cm": {
                                            "type": "number",
                                            "minimum": 0
                                        }
                                    }
                                }
                            },
                            "submission_count": 0
                        },
                        {
                            "id": "9deebc99-9c0b-4ef8-bb6d-6bb9bd380d1e",
                            "name": "Equipment Performance Verification",
                            "order_index": 1,
                            "requires_approval": false,
                            "form": {
                                "id": "62eebc99-9c0b-4ef8-bb6d-6bb9bd380b03",
                                "name": "Field Condition Assessment",
                                "schema": {
                                    "type": "object",
                                    "required": [
                                        "soil_ph",
                                        "pest_presence",
                                        "irrigation_functioning",
                                        "field_rating",
                                        "assessment_date"
                                    ],
                                    "properties": {
                                        "soil_ph": {
                                            "type": "number",
                                            "maximum": 14,
                                            "minimum": 0
                                        },
                                        "field_rating": {
                                            "enum": [
                                                "excellent",
                                                "good",
                                                "fair",
                                                "poor"
                                            ],
                                            "type": "string"
                                        },
                                        "pest_presence": {
                                            "type": "boolean"
                                        },
                                        "soil_moisture": {
                                            "enum": [
                                                "dry",
                                                "optimal",
                                                "wet",
                                                "flooded"
                                            ],
                                            "type": "string"
                                        },
                                        "assessment_date": {
                                            "type": "string",
                                            "format": "date"
                                        },
                                        "disease_symptoms": {
                                            "type": "array",
                                            "items": {
                                                "type": "string"
                                            }
                                        },
                                        "irrigation_functioning": {
                                            "type": "boolean"
                                        }
                                    }
                                }
                            },
                            "submission_count": 0
                        }
                    ],
                    "started_at": "2025-12-26T10:31:11.922278+07:00",
                    "created_at": "2025-12-26T10:31:11.922278+07:00",
                    "updated_at": "2025-12-26T10:31:11.922278+07:00"
                },
                {
                    "id": "a404dd08-1666-4831-b945-b4efb411baa1",
                    "workflow_id": "70eebc99-9c0b-4ef8-bb6d-6bb9bd380c01",
                    "workflow": {
                        "id": "70eebc99-9c0b-4ef8-bb6d-6bb9bd380c01",
                        "name": "Palm Tree Registration & Initial Assessment",
                        "is_loopable": true,
                        "is_auto_start": true,
                        "step_count": 0
                    },
                    "status": "in_progress",
                    "current_step_id": "80eebc99-9c0b-4ef8-bb6d-6bb9bd380d01",
                    "steps": [
                        {
                            "id": "80eebc99-9c0b-4ef8-bb6d-6bb9bd380d01",
                            "name": "Tree Tagging & GPS Mapping",
                            "order_index": 0,
                            "requires_approval": true,
                            "form": {
                                "id": "60eebc99-9c0b-4ef8-bb6d-6bb9bd380b01",
                                "name": "Tree Registration Form",
                                "schema": {
                                    "type": "object",
                                    "required": [
                                        "tree_id",
                                        "variety",
                                        "gps_location",
                                        "planting_date",
                                        "registered_by"
                                    ],
                                    "properties": {
                                        "tree_id": {
                                            "type": "string",
                                            "title": "Tree ID"
                                        },
                                        "variety": {
                                            "enum": [
                                                "Dura",
                                                "Pisifera",
                                                "Tenera"
                                            ],
                                            "type": "string"
                                        },
                                        "gps_location": {
                                            "type": "object",
                                            "properties": {
                                                "latitude": {
                                                    "type": "number"
                                                },
                                                "longitude": {
                                                    "type": "number"
                                                }
                                            }
                                        },
                                        "planting_date": {
                                            "type": "string",
                                            "format": "date"
                                        },
                                        "registered_by": {
                                            "type": "string"
                                        },
                                        "initial_height_cm": {
                                            "type": "number",
                                            "minimum": 0
                                        }
                                    }
                                }
                            },
                            "submission_count": 0
                        },
                        {
                            "id": "81eebc99-9c0b-4ef8-bb6d-6bb9bd380d02",
                            "name": "Genetic Background Documentation",
                            "order_index": 1,
                            "requires_approval": false,
                            "form": {
                                "id": "61eebc99-9c0b-4ef8-bb6d-6bb9bd380b02",
                                "name": "Growth Data Collection Form",
                                "schema": {
                                    "type": "object",
                                    "required": [
                                        "current_height_cm",
                                        "trunk_diameter_cm",
                                        "frond_count",
                                        "health_status"
                                    ],
                                    "properties": {
                                        "frond_count": {
                                            "type": "number",
                                            "minimum": 0
                                        },
                                        "health_status": {
                                            "enum": [
                                                "excellent",
                                                "good",
                                                "fair",
                                                "poor"
                                            ],
                                            "type": "string"
                                        },
                                        "photos_attached": {
                                            "type": "boolean"
                                        },
                                        "current_height_cm": {
                                            "type": "number",
                                            "minimum": 0
                                        },
                                        "observation_notes": {
                                            "type": "string"
                                        },
                                        "trunk_diameter_cm": {
                                            "type": "number",
                                            "minimum": 0
                                        }
                                    }
                                }
                            },
                            "submission_count": 0
                        },
                        {
                            "id": "82eebc99-9c0b-4ef8-bb6d-6bb9bd380d03",
                            "name": "Field Condition Assessment",
                            "order_index": 2,
                            "requires_approval": true,
                            "form": {
                                "id": "62eebc99-9c0b-4ef8-bb6d-6bb9bd380b03",
                                "name": "Field Condition Assessment",
                                "schema": {
                                    "type": "object",
                                    "required": [
                                        "soil_ph",
                                        "pest_presence",
                                        "irrigation_functioning",
                                        "field_rating",
                                        "assessment_date"
                                    ],
                                    "properties": {
                                        "soil_ph": {
                                            "type": "number",
                                            "maximum": 14,
                                            "minimum": 0
                                        },
                                        "field_rating": {
                                            "enum": [
                                                "excellent",
                                                "good",
                                                "fair",
                                                "poor"
                                            ],
                                            "type": "string"
                                        },
                                        "pest_presence": {
                                            "type": "boolean"
                                        },
                                        "soil_moisture": {
                                            "enum": [
                                                "dry",
                                                "optimal",
                                                "wet",
                                                "flooded"
                                            ],
                                            "type": "string"
                                        },
                                        "assessment_date": {
                                            "type": "string",
                                            "format": "date"
                                        },
                                        "disease_symptoms": {
                                            "type": "array",
                                            "items": {
                                                "type": "string"
                                            }
                                        },
                                        "irrigation_functioning": {
                                            "type": "boolean"
                                        }
                                    }
                                }
                            },
                            "submission_count": 0
                        },
                        {
                            "id": "83eebc99-9c0b-4ef8-bb6d-6bb9bd380d04",
                            "name": "Registration Completion",
                            "order_index": 3,
                            "requires_approval": false,
                            "form": {
                                "id": "63eebc99-9c0b-4ef8-bb6d-6bb9bd380b04",
                                "name": "Registration Approval Form",
                                "schema": {
                                    "type": "object",
                                    "required": [
                                        "approved",
                                        "registration_date",
                                        "reviewer_name",
                                        "tree_tag_number"
                                    ],
                                    "properties": {
                                        "approved": {
                                            "type": "boolean"
                                        },
                                        "reviewer_name": {
                                            "type": "string"
                                        },
                                        "tree_tag_number": {
                                            "type": "string"
                                        },
                                        "registration_date": {
                                            "type": "string",
                                            "format": "date"
                                        },
                                        "quality_checks_passed": {
                                            "type": "array",
                                            "items": {
                                                "type": "string"
                                            }
                                        }
                                    }
                                }
                            },
                            "submission_count": 0
                        }
                    ],
                    "started_at": "2025-12-26T10:31:11.922278+07:00",
                    "created_at": "2025-12-26T10:31:11.922278+07:00",
                    "updated_at": "2025-12-26T10:31:11.922278+07:00"
                },
                {
                    "id": "6754b153-e08f-4dd8-9e94-0544209a2438",
                    "workflow_id": "74eebc99-9c0b-4ef8-bb6d-6bb9bd380c05",
                    "workflow": {
                        "id": "74eebc99-9c0b-4ef8-bb6d-6bb9bd380c05",
                        "name": "Research Plot Compliance Audit",
                        "is_loopable": true,
                        "is_auto_start": true,
                        "step_count": 0
                    },
                    "status": "in_progress",
                    "current_step_id": "8feebc99-9c0b-4ef8-bb6d-6bb9bd380d10",
                    "steps": [
                        {
                            "id": "8feebc99-9c0b-4ef8-bb6d-6bb9bd380d10",
                            "name": "Research Data Review",
                            "order_index": 0,
                            "requires_approval": false,
                            "form": {
                                "id": "61eebc99-9c0b-4ef8-bb6d-6bb9bd380b02",
                                "name": "Growth Data Collection Form",
                                "schema": {
                                    "type": "object",
                                    "required": [
                                        "current_height_cm",
                                        "trunk_diameter_cm",
                                        "frond_count",
                                        "health_status"
                                    ],
                                    "properties": {
                                        "frond_count": {
                                            "type": "number",
                                            "minimum": 0
                                        },
                                        "health_status": {
                                            "enum": [
                                                "excellent",
                                                "good",
                                                "fair",
                                                "poor"
                                            ],
                                            "type": "string"
                                        },
                                        "photos_attached": {
                                            "type": "boolean"
                                        },
                                        "current_height_cm": {
                                            "type": "number",
                                            "minimum": 0
                                        },
                                        "observation_notes": {
                                            "type": "string"
                                        },
                                        "trunk_diameter_cm": {
                                            "type": "number",
                                            "minimum": 0
                                        }
                                    }
                                }
                            },
                            "submission_count": 0
                        },
                        {
                            "id": "90eebc99-9c0b-4ef8-bb6d-6bb9bd380d11",
                            "name": "Plot Compliance Assessment",
                            "order_index": 1,
                            "requires_approval": false,
                            "form": {
                                "id": "64eebc99-9c0b-4ef8-bb6d-6bb9bd380b05",
                                "name": "Annual Growth Metrics",
                                "schema": {
                                    "type": "object",
                                    "required": [
                                        "height_increase_cm",
                                        "frond_production",
                                        "health_maintained",
                                        "measurement_date"
                                    ],
                                    "properties": {
                                        "fruiting_status": {
                                            "type": "boolean"
                                        },
                                        "frond_production": {
                                            "type": "number",
                                            "minimum": 0
                                        },
                                        "measurement_date": {
                                            "type": "string",
                                            "format": "date"
                                        },
                                        "health_maintained": {
                                            "type": "boolean"
                                        },
                                        "flowering_observed": {
                                            "type": "boolean"
                                        },
                                        "height_increase_cm": {
                                            "type": "number",
                                            "minimum": 0
                                        }
                                    }
                                }
                            },
                            "submission_count": 0
                        },
                        {
                            "id": "91eebc99-9c0b-4ef8-bb6d-6bb9bd380d12",
                            "name": "Research Intervention Plan",
                            "order_index": 2,
                            "requires_approval": false,
                            "form": {
                                "id": "67eebc99-9c0b-4ef8-bb6d-6bb9bd380b08",
                                "name": "Research Intervention Plan",
                                "schema": {
                                    "type": "object",
                                    "required": [
                                        "issue_description",
                                        "proposed_intervention",
                                        "implementation_timeline",
                                        "responsible_researcher"
                                    ],
                                    "properties": {
                                        "completion_date": {
                                            "type": "string",
                                            "format": "date"
                                        },
                                        "issue_description": {
                                            "type": "string"
                                        },
                                        "proposed_intervention": {
                                            "type": "string"
                                        },
                                        "responsible_researcher": {
                                            "type": "string"
                                        },
                                        "implementation_timeline": {
                                            "type": "string"
                                        }
                                    }
                                }
                            },
                            "submission_count": 0
                        },
                        {
                            "id": "92eebc99-9c0b-4ef8-bb6d-6bb9bd380d13",
                            "name": "Follow-up Assessment",
                            "order_index": 3,
                            "requires_approval": false,
                            "form": {
                                "id": "68eebc99-9c0b-4ef8-bb6d-6bb9bd380b09",
                                "name": "Follow-up Field Assessment",
                                "schema": {
                                    "type": "object",
                                    "required": [
                                        "previous_issues_resolved",
                                        "assessment_outcome"
                                    ],
                                    "properties": {
                                        "inspector_notes": {
                                            "type": "string"
                                        },
                                        "new_issues_found": {
                                            "type": "array",
                                            "items": {
                                                "type": "string"
                                            }
                                        },
                                        "assessment_outcome": {
                                            "enum": [
                                                "passed",
                                                "conditional_pass",
                                                "failed"
                                            ],
                                            "type": "string"
                                        },
                                        "follow_up_required": {
                                            "type": "boolean"
                                        },
                                        "previous_issues_resolved": {
                                            "type": "boolean"
                                        }
                                    }
                                }
                            },
                            "submission_count": 0
                        }
                    ],
                    "started_at": "2025-12-26T10:31:11.922278+07:00",
                    "created_at": "2025-12-26T10:31:11.922278+07:00",
                    "updated_at": "2025-12-26T10:31:11.922278+07:00"
                },
                {
                    "id": "125f9de2-5f93-4ae2-910d-5792feff8ce7",
                    "workflow_id": "77eebc99-9c0b-4ef8-bb6d-6bb9bd380c08",
                    "workflow": {
                        "id": "77eebc99-9c0b-4ef8-bb6d-6bb9bd380c08",
                        "name": "Controlled Pollination Certification",
                        "is_loopable": false,
                        "is_auto_start": false,
                        "step_count": 0
                    },
                    "status": "in_progress",
                    "current_step_id": "99eebc99-9c0b-4ef8-bb6d-6bb9bd380d1a",
                    "steps": [
                        {
                            "id": "99eebc99-9c0b-4ef8-bb6d-6bb9bd380d1a",
                            "name": "Technique Application Review",
                            "order_index": 0,
                            "requires_approval": false,
                            "form": {
                                "id": "60eebc99-9c0b-4ef8-bb6d-6bb9bd380b01",
                                "name": "Tree Registration Form",
                                "schema": {
                                    "type": "object",
                                    "required": [
                                        "tree_id",
                                        "variety",
                                        "gps_location",
                                        "planting_date",
                                        "registered_by"
                                    ],
                                    "properties": {
                                        "tree_id": {
                                            "type": "string",
                                            "title": "Tree ID"
                                        },
                                        "variety": {
                                            "enum": [
                                                "Dura",
                                                "Pisifera",
                                                "Tenera"
                                            ],
                                            "type": "string"
                                        },
                                        "gps_location": {
                                            "type": "object",
                                            "properties": {
                                                "latitude": {
                                                    "type": "number"
                                                },
                                                "longitude": {
                                                    "type": "number"
                                                }
                                            }
                                        },
                                        "planting_date": {
                                            "type": "string",
                                            "format": "date"
                                        },
                                        "registered_by": {
                                            "type": "string"
                                        },
                                        "initial_height_cm": {
                                            "type": "number",
                                            "minimum": 0
                                        }
                                    }
                                }
                            },
                            "submission_count": 0
                        },
                        {
                            "id": "9aeebc99-9c0b-4ef8-bb6d-6bb9bd380d1b",
                            "name": "Skills Proficiency Assessment",
                            "order_index": 1,
                            "requires_approval": true,
                            "form": {
                                "id": "6aeebc99-9c0b-4ef8-bb6d-6bb9bd380b0b",
                                "name": "Genetic Profile Assessment",
                                "schema": {
                                    "type": "object",
                                    "required": [
                                        "genetic_markers_confirmed",
                                        "assessment_date"
                                    ],
                                    "properties": {
                                        "assessment_date": {
                                            "type": "string",
                                            "format": "date"
                                        },
                                        "quality_standards_met": {
                                            "type": "array",
                                            "items": {
                                                "type": "string"
                                            }
                                        },
                                        "breeding_goals_aligned": {
                                            "type": "array",
                                            "items": {
                                                "type": "string"
                                            }
                                        },
                                        "genetic_markers_confirmed": {
                                            "type": "array",
                                            "items": {
                                                "type": "string"
                                            }
                                        }
                                    }
                                }
                            },
                            "submission_count": 0
                        },
                        {
                            "id": "9beebc99-9c0b-4ef8-bb6d-6bb9bd380d1c",
                            "name": "Certification Approval",
                            "order_index": 2,
                            "requires_approval": false,
                            "form": {
                                "id": "63eebc99-9c0b-4ef8-bb6d-6bb9bd380b04",
                                "name": "Registration Approval Form",
                                "schema": {
                                    "type": "object",
                                    "required": [
                                        "approved",
                                        "registration_date",
                                        "reviewer_name",
                                        "tree_tag_number"
                                    ],
                                    "properties": {
                                        "approved": {
                                            "type": "boolean"
                                        },
                                        "reviewer_name": {
                                            "type": "string"
                                        },
                                        "tree_tag_number": {
                                            "type": "string"
                                        },
                                        "registration_date": {
                                            "type": "string",
                                            "format": "date"
                                        },
                                        "quality_checks_passed": {
                                            "type": "array",
                                            "items": {
                                                "type": "string"
                                            }
                                        }
                                    }
                                }
                            },
                            "submission_count": 0
                        }
                    ],
                    "started_at": "2025-12-26T10:31:11.922278+07:00",
                    "created_at": "2025-12-26T10:31:11.922278+07:00",
                    "updated_at": "2026-01-02T16:23:35.149371+07:00"
                },
                {
                    "id": "63a5f932-bf2a-4c90-ab18-6c816c642999",
                    "workflow_id": "73eebc99-9c0b-4ef8-bb6d-6bb9bd380c04",
                    "workflow": {
                        "id": "73eebc99-9c0b-4ef8-bb6d-6bb9bd380c04",
                        "name": "Genetic Purity Verification",
                        "is_loopable": false,
                        "is_auto_start": false,
                        "step_count": 0
                    },
                    "status": "in_progress",
                    "current_step_id": "8ceebc99-9c0b-4ef8-bb6d-6bb9bd380d0d",
                    "steps": [
                        {
                            "id": "8ceebc99-9c0b-4ef8-bb6d-6bb9bd380d0d",
                            "name": "Purity Verification Application",
                            "order_index": 0,
                            "requires_approval": false,
                            "form": {
                                "id": "6deebc99-9c0b-4ef8-bb6d-6bb9bd380b0e",
                                "name": "Purity Verification Application",
                                "schema": {
                                    "type": "object",
                                    "required": [
                                        "current_certification_id",
                                        "genetic_tests_completed",
                                        "application_date"
                                    ],
                                    "properties": {
                                        "application_date": {
                                            "type": "string",
                                            "format": "date"
                                        },
                                        "no_contamination": {
                                            "type": "boolean"
                                        },
                                        "genetic_tests_completed": {
                                            "type": "boolean"
                                        },
                                        "current_certification_id": {
                                            "type": "string"
                                        }
                                    }
                                }
                            },
                            "submission_count": 0
                        },
                        {
                            "id": "8deebc99-9c0b-4ef8-bb6d-6bb9bd380d0e",
                            "name": "Genetic Testing & Analysis",
                            "order_index": 1,
                            "requires_approval": true,
                            "form": {
                                "id": "64eebc99-9c0b-4ef8-bb6d-6bb9bd380b05",
                                "name": "Annual Growth Metrics",
                                "schema": {
                                    "type": "object",
                                    "required": [
                                        "height_increase_cm",
                                        "frond_production",
                                        "health_maintained",
                                        "measurement_date"
                                    ],
                                    "properties": {
                                        "fruiting_status": {
                                            "type": "boolean"
                                        },
                                        "frond_production": {
                                            "type": "number",
                                            "minimum": 0
                                        },
                                        "measurement_date": {
                                            "type": "string",
                                            "format": "date"
                                        },
                                        "health_maintained": {
                                            "type": "boolean"
                                        },
                                        "flowering_observed": {
                                            "type": "boolean"
                                        },
                                        "height_increase_cm": {
                                            "type": "number",
                                            "minimum": 0
                                        }
                                    }
                                }
                            },
                            "submission_count": 0
                        },
                        {
                            "id": "8eeebc99-9c0b-4ef8-bb6d-6bb9bd380d0f",
                            "name": "Verification Approval",
                            "order_index": 2,
                            "requires_approval": false,
                            "form": {
                                "id": "6eeebc99-9c0b-4ef8-bb6d-6bb9bd380b0f",
                                "name": "Purity Verification Approval",
                                "schema": {
                                    "type": "object",
                                    "required": [
                                        "verification_approved",
                                        "approval_date"
                                    ],
                                    "properties": {
                                        "valid_from": {
                                            "type": "string",
                                            "format": "date"
                                        },
                                        "valid_until": {
                                            "type": "string",
                                            "format": "date"
                                        },
                                        "approval_date": {
                                            "type": "string",
                                            "format": "date"
                                        },
                                        "new_certificate_id": {
                                            "type": "string"
                                        },
                                        "verification_approved": {
                                            "type": "boolean"
                                        }
                                    }
                                }
                            },
                            "submission_count": 0
                        }
                    ],
                    "started_at": "2025-12-26T10:31:11.922278+07:00",
                    "created_at": "2025-12-26T10:31:11.922278+07:00",
                    "updated_at": "2026-01-02T16:23:39.811879+07:00"
                },
                {
                    "id": "1f2c4ca7-e996-4e43-a78e-6ccf8aa0e83c",
                    "workflow_id": "57491d63-6510-4ba0-a60b-f9a230438aec",
                    "workflow": {
                        "id": "57491d63-6510-4ba0-a60b-f9a230438aec",
                        "name": "Workflow For All",
                        "is_loopable": true,
                        "is_auto_start": false,
                        "step_count": 0
                    },
                    "status": "not_started",
                    "steps": [
                        {
                            "id": "41fa9c7f-8341-4353-90f0-b7df343a75b5",
                            "name": "First Step",
                            "order_index": 0,
                            "requires_approval": true,
                            "form": {
                                "id": "e1ab228f-1a92-4950-860c-adef6228f8a1",
                                "name": "First Form",
                                "schema": {
                                    "type": "object",
                                    "required": [
                                        "firstField"
                                    ],
                                    "properties": {
                                        "firstField": {
                                            "type": "integer",
                                            "title": "FirstField"
                                        },
                                        "secondFIeld": {
                                            "type": "number",
                                            "title": "Second"
                                        }
                                    }
                                }
                            },
                            "submission_count": 0
                        },
                        {
                            "id": "e58b7cb6-ad36-44a8-a3d0-56209a1bcccc",
                            "name": "Second Step",
                            "order_index": 1,
                            "requires_approval": false,
                            "form": {
                                "id": "91420451-1e17-4dd6-a5b2-f60b8e1ce020",
                                "name": "Second Form",
                                "schema": {
                                    "type": "object",
                                    "required": [
                                        "third"
                                    ],
                                    "properties": {
                                        "third": {
                                            "type": "integer",
                                            "title": "Third"
                                        }
                                    }
                                }
                            },
                            "submission_count": 0
                        }
                    ],
                    "started_at": "2026-01-02T17:20:16.040692+07:00",
                    "created_at": "2026-01-02T17:20:16.040692+07:00",
                    "updated_at": "2026-01-02T17:20:16.040692+07:00"
                }
            ]
        }
    ]
}
```

It usually pretty much the same with the `GET /entities/{entity_id}/workflows` but that one is only for the single entity.

So, I need you to add new page for this. This will be navigated from the entity detail page to see the track or history of it. I dont have any specific design but make sure it is user friendly and easy to understand. It also easy to see the history and track of the workflow of each entity and parents. Please be mindful and focus on necessary changes.
