# MCP to Autonomous Agent Prompt Template

This document provides a comprehensive prompt template for communication between MCP servers and autonomous agents, specifically tailored for the Mystic Arcana project but adaptable to other projects.

## Full-Scale Prompt Template

```
# Task Execution Prompt: [Task ID] - [Task Title]

## Project Context
- Project: Mystic Arcana
- Domain: Spiritual/Mystical Web Application
- Core Features: Tarot readings, astrology charts, personalized content
- Tech Stack: React, TypeScript, Next.js, Tailwind CSS, Netlify, Supabase
- Design Philosophy: Mystical, ethereal aesthetic with cosmic themes

## Task Details
- ID: [task-id]
- Title: [task-title]
- Type: [feature/bug/content/testing]
- Priority: [high/medium/low]
- Assigned Agent: [CodeAgent/DesignAgent/APIAgent/ContentAgent/TestAgent]
- Required MCP Servers: [list of required MCP servers]
- Dependencies: [list of dependent task IDs]
- Estimated Effort: [small/medium/large]

## Task Description
[Detailed description of the task to be performed]

## Acceptance Criteria
- [Criterion 1]
- [Criterion 2]
- [Criterion 3]
- [Additional criteria as needed]

## Technical Requirements
- [Specific technical requirement 1]
- [Specific technical requirement 2]
- [Additional technical requirements as needed]

## Design Guidelines
- Follow the cosmic/mystical aesthetic with deep purples, blues, and gold accents
- Use subtle animations for transitions and interactions
- Ensure responsive design for all screen sizes
- Maintain accessibility standards (WCAG 2.1 AA)
- Implement dark mode by default

## Implementation Approach
1. [Step 1 of implementation]
2. [Step 2 of implementation]
3. [Step 3 of implementation]
4. [Additional steps as needed]

## Code Structure
- File Location: [path to file(s) to be created or modified]
- Component Structure: [description of component structure]
- State Management: [description of state management approach]
- API Integration: [description of API integration]

## Related Resources
- Design References: [links to design references]
- API Documentation: [links to API documentation]
- Existing Components: [links to existing components]
- Documentation: [links to relevant documentation]

## Constraints and Considerations
- Performance: [performance considerations]
- Security: [security considerations]
- Scalability: [scalability considerations]
- Browser Compatibility: [browser compatibility requirements]

## Testing Requirements
- Unit Tests: [description of unit tests]
- Integration Tests: [description of integration tests]
- Accessibility Tests: [description of accessibility tests]
- Performance Tests: [description of performance tests]

## Documentation Requirements
- Code Comments: [requirements for code comments]
- README Updates: [requirements for README updates]
- API Documentation: [requirements for API documentation]
- User Documentation: [requirements for user documentation]

## Delivery Format
- Pull Request: [PR requirements]
- Code Review: [code review requirements]
- Demo: [demo requirements]

## Success Metrics
- [Metric 1 for measuring success]
- [Metric 2 for measuring success]
- [Additional metrics as needed]

## Additional Context
[Any additional context or information that would be helpful for the agent]

## Agent Instructions
1. Analyze the task requirements thoroughly
2. Break down the implementation into manageable steps
3. Leverage the specified MCP servers for optimal code generation
4. Follow the project's coding standards and design guidelines
5. Implement the solution according to the acceptance criteria
6. Write tests to verify the implementation
7. Document the implementation as required
8. Submit the completed work for review
9. Respond to feedback and make necessary adjustments

## MCP Server Utilization
- [MCP Server 1]: Use for [specific purpose]
- [MCP Server 2]: Use for [specific purpose]
- [Additional MCP servers as needed]

## Feedback Loop
- Report progress at [interval]
- Flag blockers immediately
- Request clarification when requirements are ambiguous
- Suggest improvements when appropriate

## Authorization
This task is authorized for autonomous execution within the defined scope.
- Task Priority: [priority]
- Time Allocation: [time allocation]
- Resource Limits: [resource limits]
- Approval Chain: [approval chain]
```

## Example: Tarot Card Component Implementation

```
# Task Execution Prompt: task-001 - Implement Basic Tarot Card Component

## Project Context
- Project: Mystic Arcana
- Domain: Spiritual/Mystical Web Application
- Core Features: Tarot readings, astrology charts, personalized content
- Tech Stack: React, TypeScript, Next.js, Tailwind CSS, Netlify, Supabase
- Design Philosophy: Mystical, ethereal aesthetic with cosmic themes

## Task Details
- ID: task-001
- Title: Implement Basic Tarot Card Component
- Type: feature
- Priority: high
- Assigned Agent: CodeAgent
- Required MCP Servers: react-ui, design-system-tailwind
- Dependencies: none
- Estimated Effort: medium

## Task Description
Create a reusable tarot card component that displays both front and back faces of a tarot card. The component should support flipping animation, custom card images, and responsive sizing. It should be accessible and follow the project's mystical design aesthetic.

## Acceptance Criteria
- Component renders card front and back faces
- Supports custom images for both front and back
- Implements responsive sizing for different screen sizes
- Includes proper accessibility attributes
- Supports flipping animation when clicked
- Follows the project's mystical design aesthetic
- Works in all modern browsers

## Technical Requirements
- Use React with TypeScript
- Implement with Tailwind CSS for styling
- Use Framer Motion for animations
- Ensure proper type definitions
- Support both controlled and uncontrolled usage
- Optimize images for performance
- Ensure keyboard accessibility

## Design Guidelines
- Card should have a subtle glow effect in the mystical purple/blue palette
- Back of card should feature a cosmic/starfield pattern
- Front of card should clearly display the tarot image
- Card should have a golden border that intensifies on hover
- Animation should be smooth and not too fast (300-500ms)
- Include subtle particle effects around the card on hover
- Maintain 5:3 aspect ratio for cards

## Implementation Approach
1. Create the basic component structure with TypeScript props interface
2. Implement the card front and back faces with proper styling
3. Add the flip animation using Framer Motion
4. Implement responsive sizing and layout
5. Add accessibility attributes and keyboard navigation
6. Optimize performance and handle edge cases
7. Write comprehensive tests

## Code Structure
- File Location: client/src/components/ui/tarot-card.tsx
- Component Structure:
  - TarotCard: Main component
  - TarotCardFront: Front face subcomponent
  - TarotCardBack: Back face subcomponent
  - useTarotCard: Custom hook for card state management
- Props Interface:
  - frontImage: string (URL to card front image)
  - backImage?: string (URL to card back image, with default)
  - alt: string (Accessible description of the card)
  - isFlipped?: boolean (Controlled flipped state)
  - onFlip?: () => void (Callback when card is flipped)
  - size?: 'sm' | 'md' | 'lg' | 'xl' (Card size)
  - className?: string (Additional CSS classes)

## Related Resources
- Design References: client/src/styles/theme.css (color variables)
- Existing Components: client/src/components/ui/card.tsx (base card component)
- Animation Examples: client/src/components/ui/animated-icon.tsx (animation patterns)
- Documentation: https://www.framer.com/motion/ (Framer Motion docs)

## Constraints and Considerations
- Performance: Optimize animations for 60fps, even on mobile devices
- Accessibility: Ensure keyboard navigation and screen reader support
- Browser Compatibility: Support latest 2 versions of major browsers
- Mobile Support: Ensure touch interactions work properly

## Testing Requirements
- Unit Tests: Test component rendering, props, and state changes
- Interaction Tests: Test click/touch interactions and animations
- Accessibility Tests: Verify keyboard navigation and screen reader support
- Responsive Tests: Verify component works at all screen sizes

## Documentation Requirements
- Code Comments: Document complex logic and component API
- Storybook: Create stories for different card states and sizes
- Props Documentation: Document all props with TypeScript JSDoc comments
- Usage Examples: Provide examples of common usage patterns

## Delivery Format
- Component Implementation: Complete TypeScript React component
- Tests: Jest/React Testing Library tests
- Storybook Stories: Visual test cases for the component
- Documentation: Inline comments and README updates

## Success Metrics
- Component passes all tests
- Animation runs at 60fps on target devices
- Accessibility score of 100 in Lighthouse
- Code review approval from at least one team member

## Additional Context
This component will be a foundational element for the tarot reading feature. It will be used in various contexts, including the daily card draw, full spreads, and the card explorer. The component should be flexible enough to work in all these contexts while maintaining consistent behavior and appearance.

## Agent Instructions
1. Analyze the task requirements thoroughly
2. Break down the implementation into manageable steps
3. Leverage MCP-React-UI for component patterns and MCP-Design-System-Tailwind for styling
4. Follow the project's coding standards and design guidelines
5. Implement the solution according to the acceptance criteria
6. Write tests to verify the implementation
7. Document the implementation as required
8. Submit the completed work for review
9. Respond to feedback and make necessary adjustments

## MCP Server Utilization
- MCP-React-UI: Use for component architecture, hooks patterns, and accessibility best practices
- MCP-Design-System-Tailwind: Use for styling, animations, and responsive design patterns

## Feedback Loop
- Report progress after completing each implementation step
- Flag blockers immediately, especially for design clarifications
- Request clarification if animation specifications are ambiguous
- Suggest improvements for card interaction patterns if appropriate

## Authorization
This task is authorized for autonomous execution within the defined scope.
- Task Priority: High
- Time Allocation: Up to 4 hours
- Resource Limits: Standard compute resources
- Approval Chain: CodeReview → DesignReview → Merge
```

## Example: Astrology API Implementation

```
# Task Execution Prompt: task-009 - Create Astrology Calculation API

## Project Context
- Project: Mystic Arcana
- Domain: Spiritual/Mystical Web Application
- Core Features: Tarot readings, astrology charts, personalized content
- Tech Stack: React, TypeScript, Next.js, Tailwind CSS, Netlify, Supabase
- Design Philosophy: Mystical, ethereal aesthetic with cosmic themes

## Task Details
- ID: task-009
- Title: Create Astrology Calculation API
- Type: feature
- Priority: medium
- Assigned Agent: APIAgent
- Required MCP Servers: netlify-edge, ai-function-pack
- Dependencies: none
- Estimated Effort: large

## Task Description
Implement a serverless function that calculates planetary positions and generates astrological chart data based on birth date, time, and location. The API should return formatted data suitable for visualization in the frontend astrology chart component.

## Acceptance Criteria
- API accepts birth date, time, and location parameters
- Calculates accurate planetary positions using Swiss Ephemeris
- Determines houses and aspects between planets
- Returns properly formatted chart data for frontend visualization
- Handles errors gracefully with informative messages
- Includes proper TypeScript type definitions
- Optimizes performance with appropriate caching

## Technical Requirements
- Implement as a Netlify Function
- Use Swiss Ephemeris library for calculations
- Implement proper error handling and validation
- Create TypeScript interfaces for request/response
- Implement caching for repeated calculations
- Ensure secure parameter handling
- Optimize for performance and low latency

## Implementation Approach
1. Set up the Netlify Function with TypeScript
2. Integrate Swiss Ephemeris library for calculations
3. Implement input validation and parameter parsing
4. Create core calculation logic for planetary positions
5. Implement house system calculations
6. Calculate aspects between planets
7. Format response data for frontend consumption
8. Implement caching for performance optimization
9. Add comprehensive error handling
10. Write tests to verify accuracy and performance

## Code Structure
- File Location: netlify/functions/astrology-chart.ts
- Helper Modules:
  - ephemeris.ts: Swiss Ephemeris wrapper
  - validation.ts: Input validation functions
  - formatting.ts: Response formatting utilities
  - caching.ts: Calculation caching utilities
- Type Definitions:
  - types/astrology.ts: Shared type definitions

## Related Resources
- API Documentation: https://www.astro.com/swisseph/ (Swiss Ephemeris)
- Calculation Reference: docs/astrology-calculations.md
- Frontend Component: client/src/components/astrology/chart.tsx
- Type Definitions: shared/types/astrology.ts

## Constraints and Considerations
- Performance: Calculations should complete in under 500ms
- Security: Validate and sanitize all input parameters
- Caching: Cache results to avoid redundant calculations
- Error Handling: Provide clear error messages for invalid inputs
- Rate Limiting: Implement basic rate limiting to prevent abuse

## Testing Requirements
- Unit Tests: Test calculation accuracy with known examples
- Integration Tests: Test end-to-end API functionality
- Performance Tests: Verify response times meet requirements
- Edge Cases: Test invalid inputs and error handling

## Documentation Requirements
- Code Comments: Document calculation algorithms and logic
- API Documentation: Document endpoint parameters and response format
- Type Definitions: Document all TypeScript interfaces
- Usage Examples: Provide example requests and responses

## Delivery Format
- Function Implementation: Complete TypeScript Netlify Function
- Tests: Jest tests for the function
- Documentation: Inline comments and README updates
- Type Definitions: Shared TypeScript interfaces

## Success Metrics
- Function passes all tests
- Calculations match reference examples
- Response time under 500ms for typical requests
- Successful integration with frontend chart component

## Additional Context
This API will power the astrology chart feature, which is a core component of the user's personalized experience. The calculations need to be accurate according to standard astrological practices, and the response format needs to be optimized for the frontend visualization component.

## Agent Instructions
1. Analyze the task requirements thoroughly
2. Research Swiss Ephemeris integration best practices
3. Leverage MCP-Netlify-EdgeDocs for serverless function patterns
4. Leverage MCP-AI-FunctionPack for astrological calculation algorithms
5. Implement the solution according to the acceptance criteria
6. Write tests to verify calculation accuracy and performance
7. Document the implementation as required
8. Submit the completed work for review
9. Respond to feedback and make necessary adjustments

## MCP Server Utilization
- MCP-Netlify-EdgeDocs: Use for serverless function patterns, caching strategies, and performance optimization
- MCP-AI-FunctionPack: Use for astrological calculation algorithms and data formatting

## Feedback Loop
- Report progress after completing each implementation step
- Flag blockers immediately, especially for calculation clarifications
- Request clarification if astrological methodology is ambiguous
- Suggest improvements for calculation accuracy or performance if appropriate

## Authorization
This task is authorized for autonomous execution within the defined scope.
- Task Priority: Medium
- Time Allocation: Up to 8 hours
- Resource Limits: Standard compute resources
- Approval Chain: CodeReview → AstrologyExpertReview → Merge
```

## Example: Content Generation Task

```
# Task Execution Prompt: task-003 - Generate Major Arcana Card Descriptions

## Project Context
- Project: Mystic Arcana
- Domain: Spiritual/Mystical Web Application
- Core Features: Tarot readings, astrology charts, personalized content
- Tech Stack: React, TypeScript, Next.js, Tailwind CSS, Netlify, Supabase
- Design Philosophy: Mystical, ethereal aesthetic with cosmic themes

## Task Details
- ID: task-003
- Title: Generate Major Arcana Card Descriptions
- Type: content
- Priority: medium
- Assigned Agent: ContentAgent
- Required MCP Servers: ai-function-pack, cms-headless
- Dependencies: none
- Estimated Effort: large

## Task Description
Create detailed, engaging descriptions for all 22 Major Arcana tarot cards. Each description should include upright and reversed meanings, symbolism explanations, practical interpretations, and guidance. The content should follow a consistent structure while maintaining a mystical, insightful tone that aligns with the Mystic Arcana brand.

## Acceptance Criteria
- Create descriptions for all 22 Major Arcana cards
- Include both upright and reversed meanings for each card
- Explain key symbols and imagery in each card
- Provide practical interpretations for different contexts (relationships, career, spiritual growth)
- Maintain consistent structure across all descriptions
- Use engaging, mystical language that resonates with the target audience
- Ensure content is original and not directly copied from existing sources
- Format content for easy integration into the application

## Content Structure
For each card, include:
1. **Card Name and Number**: Title and numerical designation
2. **Brief Overview**: 2-3 sentence summary of the card's essence
3. **Key Symbols**: Explanation of 3-5 primary symbols in the card
4. **Upright Meaning**: 150-200 words on the card's upright interpretation
5. **Reversed Meaning**: 150-200 words on the card's reversed interpretation
6. **In Relationships**: 75-100 words on romantic/relationship context
7. **In Career**: 75-100 words on professional/career context
8. **In Spiritual Growth**: 75-100 words on spiritual development context
9. **Key Questions**: 3-5 reflective questions the card invites
10. **Affirmation**: A positive affirmation related to the card's energy

## Tone and Style Guidelines
- Use second-person perspective to directly address the reader
- Balance mystical/spiritual language with practical insights
- Avoid overly academic or technical jargon
- Maintain an encouraging, empowering tone
- Use vivid, sensory language to evoke the card's energy
- Include occasional metaphors and poetic elements
- Ensure content is inclusive and applicable to diverse audiences
- Avoid absolute predictions or deterministic language

## Implementation Approach
1. Research traditional and modern interpretations of each Major Arcana card
2. Create a consistent template structure for all descriptions
3. Draft content for each card following the defined structure
4. Review and refine language for consistency and brand alignment
5. Format content in Markdown for easy integration
6. Organize files in a logical directory structure
7. Create metadata for each card (keywords, elements, etc.)

## Delivery Format
- File Location: content/tarot/major-arcana/
- File Format: Markdown files with YAML frontmatter
- Naming Convention: [card-number]-[card-name-kebab-case].md
- Metadata: Include keywords, elements, planets, and related cards

## Related Resources
- Brand Voice Guide: docs/brand/voice-and-tone.md
- Tarot Reference: docs/tarot/major-arcana-reference.md
- Content Examples: content/examples/tarot-description-example.md
- Image Assets: public/images/tarot/major-arcana/

## Success Metrics
- Content passes plagiarism check
- Descriptions maintain consistent structure and depth
- Language aligns with brand voice and tone
- Content is engaging and provides valuable insights
- Descriptions are accurate according to tarot tradition while offering fresh perspectives

## Additional Context
These descriptions will serve as the foundation for the tarot reading feature. They will be displayed when users view individual cards and will inform the AI-generated readings. The content should be both educational for beginners and insightful for experienced tarot enthusiasts.

## Agent Instructions
1. Analyze the content requirements thoroughly
2. Research traditional and modern tarot interpretations
3. Leverage MCP-AI-FunctionPack for content generation
4. Leverage MCP-CMS-Headless for content structuring and metadata
5. Create content according to the acceptance criteria and structure
6. Review content for consistency, originality, and brand alignment
7. Format content as specified
8. Submit the completed work for review
9. Respond to feedback and make necessary adjustments

## MCP Server Utilization
- MCP-AI-FunctionPack: Use for generating insightful, original card interpretations
- MCP-CMS-Headless: Use for content structuring, metadata, and formatting

## Feedback Loop
- Report progress after completing each set of 5-7 cards
- Flag blockers immediately, especially for interpretation questions
- Request clarification if content direction is ambiguous
- Suggest improvements for content structure or depth if appropriate

## Authorization
This task is authorized for autonomous execution within the defined scope.
- Task Priority: Medium
- Time Allocation: Up to 12 hours
- Resource Limits: Standard compute resources
- Approval Chain: ContentReview → TarotExpertReview → Merge
```

## Adapting This Template for Other Projects

To adapt this template for other projects:

1. **Update Project Context**:
   - Replace project name, domain, and core features
   - Update tech stack and design philosophy
   - Adjust to reflect your project's specific context

2. **Modify Task Types**:
   - Customize task types to match your project's needs
   - Adjust agent types to reflect your team structure
   - Update MCP server references to match your configuration

3. **Customize Design Guidelines**:
   - Replace mystical/cosmic aesthetic with your project's design language
   - Update color references and animation guidelines
   - Adjust accessibility and responsive design requirements

4. **Adjust Implementation Details**:
   - Update file paths to match your project structure
   - Modify component/code structure to align with your architecture
   - Customize testing and documentation requirements

5. **Refine Content Guidelines**:
   - Update tone and style guidelines to match your brand voice
   - Adjust content structure to fit your project's needs
   - Customize delivery format and metadata requirements

By customizing these elements, you can create task prompts that are specifically tailored to your project's domain, technology stack, and requirements while maintaining the structured approach that enables autonomous agents to work effectively with MCP servers.
