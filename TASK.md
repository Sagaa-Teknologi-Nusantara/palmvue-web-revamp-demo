I want to refactor the entity types list page (src/app/entity-types/page.tsx) to use card list instead of table. You can refer to the entity list page (src/app/entities/page.tsx) for the card implementation. Each card should have these information as the minimum:

- Icon (with the background color and foreground color for the icon color), it should be based on the entity type name but for now just use dummy icon and same for all entity type
- Name
- Prefix
- Description
- Updated At
- Schema properties (show the first 3 properties and can be expanded to show all properties)
- Actions (edit)
  You can add more information if you think it's necessary. The page also dont need pagination since it's not a lot of data. Please be concise and mindful in the implementation.
