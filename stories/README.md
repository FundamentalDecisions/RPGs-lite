# Stories Directory

This folder contains all RPG story scenarios. Each story is defined in its own JSON file.

## Adding a New Story

To add a new story to the RPG collection:

### 1. Create a new JSON file

Create a new file in this directory with the naming pattern: `DRPG{number}-{story-name}.json`

Example: `DRPG2-Leadership-Crisis.json`

### 2. Define the story structure

Use this template structure for your story JSON:

```json
{
  "metadata": {
    "uid": "DRPG2-Leadership-Crisis",
    "title": "Your Story Title",
    "subtitle": "Story Category",
    "description": "Brief description of the story (2-3 sentences)",
    "hint": "What dimensions this tests",
    "difficulty": "Easy|Medium|Hard",
    "duration": "5-7 minutes",
    "color": "#38bdf8"
  },
  "dimensions": [
    {
      "key": "dimension1",
      "label": "Display Name",
      "description": "What this dimension measures",
      "maxValue": 15
    }
  ],
  "scenes": [
    {
      "id": "scene1",
      "label": "Scene 1",
      "title": "Scene title",
      "tag": "Scene theme",
      "body": "Scene description with <span class=\"highlight\">highlights</span>",
      "tip": "Contextual hint for the player",
      "options": [
        {
          "code": "1A",
          "label": "A",
          "main": "Choice text",
          "desc": "What this choice represents",
          "deltas": { "dimension1": 2, "dimension2": -1 }
        }
      ]
    }
  ],
  "archetypeSystem": {
    "archetypes": [
      {
        "id": "archetype-id",
        "label": "The Archetype Name",
        "condition": "dimension1 >= 5 && dimension2 >= 5"
      }
    ]
  },
  "growthSuggestions": [
    {
      "condition": "dimension1 < 4 && dimension2 > 5",
      "text": "Growth advice based on this score pattern"
    }
  ]
}
```

### 3. Key Requirements

- **Dimensions**: Define at least 2-4 unique dimensions for your story
- **Scenes**: Create exactly 7 scenes (or adjust as needed)
- **Options**: Each scene should have 2-4 choice options
- **Deltas**: Each option must have deltas for all dimensions
- **Last scene**: Mark the final scene's options with `"end": true`
- **Archetypes**: Define 4-6 archetypes based on dimension combinations
- **Growth suggestions**: Provide 3-5 conditional growth suggestions

### 4. Update the manifest

Add your story UID to `manifest.json`:

```json
{
  "stories": [
    "DRPG1-Project-at-the-Edge",
    "DRPG2-Your-New-Story"
  ]
}
```

### 5. Test your story

Open the app in a browser and verify:
- Your story appears in the selection screen
- All dimensions are displayed correctly
- All scenes load properly
- Scoring works as expected
- Report generates correctly

## Tips for Story Design

### Dimension Design
- Choose dimensions that test different aspects of workplace mindset
- Use clear, descriptive labels (e.g., "Communication", "Adaptability")
- Set appropriate maxValues based on how many points are available across scenes

### Scene Design
- Create realistic workplace scenarios
- Use the `highlight` class for emphasis
- Keep scenes focused on one decision moment
- Provide meaningful choice diversity

### Scoring Strategy
- Balance positive and negative deltas across choices
- Ensure no "obviously correct" answers
- Design choices that reveal authentic preferences

### Archetype Conditions
- Use JavaScript expressions (e.g., `dimension1 >= 5 && dimension2 < 3`)
- Order from most specific to most general
- Always include a catch-all archetype with `"condition": "true"`

### Growth Suggestions
- Write actionable, specific advice
- Order from most specific to most general
- Always include a default suggestion with `"condition": "true"`

## File Naming Convention

`DRPG{number}-{story-name}.json`

- DRPG = Decision RPG
- Number = Sequential identifier
- Story name = Kebab-case story identifier

Examples:
- `DRPG1-Project-at-the-Edge.json`
- `DRPG2-Team-Conflict.json`
- `DRPG3-Budget-Crisis.json`
