# Business-Specific MCP Agent Templates

This document provides templates for adapting the MCP to Autonomous Agent communication pattern for different business domains. These templates can be used as starting points for your other projects.

## E-Commerce Business Template

```
# Task Execution Prompt: [Task ID] - [Task Title]

## Project Context
- Project: [E-Commerce Project Name]
- Domain: Online Retail/E-Commerce
- Core Features: Product catalog, shopping cart, checkout, user accounts, order management
- Tech Stack: [Your tech stack, e.g., React, Node.js, MongoDB, Stripe]
- Design Philosophy: [Your design philosophy, e.g., Clean, minimalist with focus on product imagery]

## Task Details
- ID: [task-id]
- Title: [task-title]
- Type: [feature/bug/content/testing]
- Priority: [high/medium/low]
- Assigned Agent: [FrontendAgent/BackendAgent/DataAgent/ContentAgent/TestAgent]
- Required MCP Servers: [list of required MCP servers]
- Dependencies: [list of dependent task IDs]
- Estimated Effort: [small/medium/large]

## Task Description
[Detailed description of the e-commerce task to be performed]

## Acceptance Criteria
- [E-commerce specific criterion 1]
- [E-commerce specific criterion 2]
- [Additional criteria as needed]

## Technical Requirements
- [E-commerce specific technical requirement 1]
- [E-commerce specific technical requirement 2]
- [Additional technical requirements as needed]

## Design Guidelines
- Follow the brand color scheme of [primary/secondary/accent colors]
- Ensure product images are prominently displayed
- Optimize for conversion with clear CTAs
- Ensure mobile-first responsive design
- Implement accessibility standards for e-commerce (WCAG 2.1 AA)

## Implementation Approach
1. [E-commerce specific implementation step 1]
2. [E-commerce specific implementation step 2]
3. [Additional steps as needed]

## Code Structure
- File Location: [path to file(s) to be created or modified]
- Component Structure: [description of component structure]
- State Management: [description of cart/product state management]
- API Integration: [description of product/payment API integration]

## Related Resources
- Product API Documentation: [links to product API docs]
- Payment Gateway Documentation: [links to payment gateway docs]
- Existing Components: [links to existing e-commerce components]
- Analytics Requirements: [links to analytics requirements]

## Constraints and Considerations
- Performance: Ensure fast product loading and checkout process
- Security: Implement secure payment processing standards
- Inventory Management: Handle out-of-stock scenarios gracefully
- User Experience: Minimize friction in the purchase flow

## Testing Requirements
- Unit Tests: [description of unit tests]
- Integration Tests: [description of integration tests]
- Payment Flow Tests: [description of payment testing]
- Performance Tests: [description of performance tests]

## MCP Server Utilization
- MCP-Commerce-Stripe: Use for payment processing patterns
- MCP-React-UI: Use for e-commerce component patterns
- [Additional MCP servers as needed]

## Authorization
This task is authorized for autonomous execution within the defined scope.
- Task Priority: [priority]
- Time Allocation: [time allocation]
- Resource Limits: [resource limits]
- Approval Chain: [approval chain]
```

## SaaS Business Template

```
# Task Execution Prompt: [Task ID] - [Task Title]

## Project Context
- Project: [SaaS Project Name]
- Domain: [Specific SaaS domain, e.g., Project Management, CRM, Marketing Automation]
- Core Features: User management, subscription billing, dashboard, reporting, integrations
- Tech Stack: [Your tech stack, e.g., React, Node.js, PostgreSQL, Auth0]
- Design Philosophy: [Your design philosophy, e.g., Professional, data-focused UI with clear hierarchy]

## Task Details
- ID: [task-id]
- Title: [task-title]
- Type: [feature/bug/content/testing]
- Priority: [high/medium/low]
- Assigned Agent: [FrontendAgent/BackendAgent/DataAgent/IntegrationAgent/TestAgent]
- Required MCP Servers: [list of required MCP servers]
- Dependencies: [list of dependent task IDs]
- Estimated Effort: [small/medium/large]

## Task Description
[Detailed description of the SaaS task to be performed]

## Acceptance Criteria
- [SaaS specific criterion 1]
- [SaaS specific criterion 2]
- [Additional criteria as needed]

## Technical Requirements
- [SaaS specific technical requirement 1]
- [SaaS specific technical requirement 2]
- [Additional technical requirements as needed]

## Design Guidelines
- Follow the SaaS application design system
- Ensure consistent navigation and information architecture
- Optimize for efficiency and reduced cognitive load
- Support both light and dark themes
- Implement responsive design for all device sizes

## Implementation Approach
1. [SaaS specific implementation step 1]
2. [SaaS specific implementation step 2]
3. [Additional steps as needed]

## Code Structure
- File Location: [path to file(s) to be created or modified]
- Component Structure: [description of component structure]
- State Management: [description of application state management]
- API Integration: [description of API integration]

## Related Resources
- Authentication Documentation: [links to auth documentation]
- Subscription Management: [links to subscription management docs]
- Existing Components: [links to existing SaaS components]
- Analytics Requirements: [links to analytics requirements]

## Constraints and Considerations
- Multi-tenancy: Ensure proper data isolation between customers
- Scalability: Design for high user concurrency
- Security: Implement proper authentication and authorization
- Performance: Optimize for quick data loading and rendering

## Testing Requirements
- Unit Tests: [description of unit tests]
- Integration Tests: [description of integration tests]
- Subscription Flow Tests: [description of subscription testing]
- Performance Tests: [description of performance tests]

## MCP Server Utilization
- MCP-Fullstack-Turbo: Use for authentication and data management
- MCP-React-UI: Use for dashboard and data visualization components
- [Additional MCP servers as needed]

## Authorization
This task is authorized for autonomous execution within the defined scope.
- Task Priority: [priority]
- Time Allocation: [time allocation]
- Resource Limits: [resource limits]
- Approval Chain: [approval chain]
```

## Content/Media Business Template

```
# Task Execution Prompt: [Task ID] - [Task Title]

## Project Context
- Project: [Content/Media Project Name]
- Domain: [Specific content domain, e.g., Blog Platform, Media Streaming, Digital Publishing]
- Core Features: Content management, media delivery, user subscriptions, recommendations
- Tech Stack: [Your tech stack, e.g., Next.js, GraphQL, Contentful, AWS Media Services]
- Design Philosophy: [Your design philosophy, e.g., Content-first, immersive experience]

## Task Details
- ID: [task-id]
- Title: [task-title]
- Type: [feature/bug/content/testing]
- Priority: [high/medium/low]
- Assigned Agent: [FrontendAgent/ContentAgent/MediaAgent/AnalyticsAgent/TestAgent]
- Required MCP Servers: [list of required MCP servers]
- Dependencies: [list of dependent task IDs]
- Estimated Effort: [small/medium/large]

## Task Description
[Detailed description of the content/media task to be performed]

## Acceptance Criteria
- [Content/media specific criterion 1]
- [Content/media specific criterion 2]
- [Additional criteria as needed]

## Technical Requirements
- [Content/media specific technical requirement 1]
- [Content/media specific technical requirement 2]
- [Additional technical requirements as needed]

## Design Guidelines
- Prioritize content readability and media viewing experience
- Implement progressive loading for media content
- Ensure consistent typography and visual hierarchy
- Support both light and dark reading modes
- Optimize for various screen sizes and orientations

## Implementation Approach
1. [Content/media specific implementation step 1]
2. [Content/media specific implementation step 2]
3. [Additional steps as needed]

## Code Structure
- File Location: [path to file(s) to be created or modified]
- Component Structure: [description of component structure]
- Content Management: [description of CMS integration]
- Media Delivery: [description of media delivery approach]

## Related Resources
- Content API Documentation: [links to content API docs]
- Media Encoding Standards: [links to media encoding standards]
- Existing Components: [links to existing content components]
- Analytics Requirements: [links to analytics requirements]

## Constraints and Considerations
- Performance: Optimize for fast content loading and media playback
- SEO: Implement proper metadata and structured data
- Accessibility: Ensure content is accessible to all users
- Content Rights: Handle proper attribution and rights management

## Testing Requirements
- Unit Tests: [description of unit tests]
- Integration Tests: [description of integration tests]
- Media Playback Tests: [description of media testing]
- Performance Tests: [description of performance tests]

## MCP Server Utilization
- MCP-CMS-Headless: Use for content management integration
- MCP-React-UI: Use for media player and content display components
- [Additional MCP servers as needed]

## Authorization
This task is authorized for autonomous execution within the defined scope.
- Task Priority: [priority]
- Time Allocation: [time allocation]
- Resource Limits: [resource limits]
- Approval Chain: [approval chain]
```

## Healthcare/Wellness Business Template

```
# Task Execution Prompt: [Task ID] - [Task Title]

## Project Context
- Project: [Healthcare/Wellness Project Name]
- Domain: [Specific healthcare domain, e.g., Telemedicine, Fitness Tracking, Mental Health]
- Core Features: User health profiles, appointment scheduling, health tracking, secure messaging
- Tech Stack: [Your tech stack, e.g., React Native, Node.js, FHIR API, HIPAA-compliant storage]
- Design Philosophy: [Your design philosophy, e.g., Calming, trustworthy interface with clear information]

## Task Details
- ID: [task-id]
- Title: [task-title]
- Type: [feature/bug/content/testing]
- Priority: [high/medium/low]
- Assigned Agent: [FrontendAgent/BackendAgent/HealthDataAgent/SecurityAgent/TestAgent]
- Required MCP Servers: [list of required MCP servers]
- Dependencies: [list of dependent task IDs]
- Estimated Effort: [small/medium/large]

## Task Description
[Detailed description of the healthcare/wellness task to be performed]

## Acceptance Criteria
- [Healthcare specific criterion 1]
- [Healthcare specific criterion 2]
- [Additional criteria as needed]

## Technical Requirements
- [Healthcare specific technical requirement 1]
- [Healthcare specific technical requirement 2]
- [Additional technical requirements as needed]

## Design Guidelines
- Use calming color palette appropriate for healthcare
- Ensure clear information hierarchy for health data
- Implement accessible design for all users
- Design for emotional sensitivity and reduced anxiety
- Support both light and dark themes

## Implementation Approach
1. [Healthcare specific implementation step 1]
2. [Healthcare specific implementation step 2]
3. [Additional steps as needed]

## Code Structure
- File Location: [path to file(s) to be created or modified]
- Component Structure: [description of component structure]
- Health Data Management: [description of health data handling]
- Security Implementation: [description of security measures]

## Related Resources
- HIPAA Compliance Guidelines: [links to compliance documentation]
- Health Data Standards: [links to relevant health data standards]
- Existing Components: [links to existing healthcare components]
- Accessibility Requirements: [links to healthcare accessibility guidelines]

## Constraints and Considerations
- Privacy: Ensure strict adherence to healthcare privacy regulations
- Security: Implement proper encryption and access controls
- Accessibility: Ensure usability for users with various abilities
- Data Accuracy: Validate health data inputs and calculations

## Testing Requirements
- Unit Tests: [description of unit tests]
- Integration Tests: [description of integration tests]
- Security Tests: [description of security testing]
- Compliance Tests: [description of compliance testing]

## MCP Server Utilization
- MCP-Fullstack-Turbo: Use for secure data management
- MCP-React-UI: Use for accessible healthcare components
- [Additional MCP servers as needed]

## Authorization
This task is authorized for autonomous execution within the defined scope.
- Task Priority: [priority]
- Time Allocation: [time allocation]
- Resource Limits: [resource limits]
- Approval Chain: [approval chain]
```

## Fintech/Financial Services Template

```
# Task Execution Prompt: [Task ID] - [Task Title]

## Project Context
- Project: [Fintech Project Name]
- Domain: [Specific fintech domain, e.g., Payment Processing, Investment Platform, Banking]
- Core Features: Account management, transactions, financial reporting, security features
- Tech Stack: [Your tech stack, e.g., React, Node.js, PostgreSQL, Plaid API]
- Design Philosophy: [Your design philosophy, e.g., Trustworthy, precise interface with clear data visualization]

## Task Details
- ID: [task-id]
- Title: [task-title]
- Type: [feature/bug/content/testing]
- Priority: [high/medium/low]
- Assigned Agent: [FrontendAgent/BackendAgent/FinanceDataAgent/SecurityAgent/TestAgent]
- Required MCP Servers: [list of required MCP servers]
- Dependencies: [list of dependent task IDs]
- Estimated Effort: [small/medium/large]

## Task Description
[Detailed description of the fintech task to be performed]

## Acceptance Criteria
- [Fintech specific criterion 1]
- [Fintech specific criterion 2]
- [Additional criteria as needed]

## Technical Requirements
- [Fintech specific technical requirement 1]
- [Fintech specific technical requirement 2]
- [Additional technical requirements as needed]

## Design Guidelines
- Use professional color palette appropriate for financial services
- Ensure precise data visualization for financial information
- Implement clear hierarchy for transaction information
- Design for trust and security perception
- Support both light and dark themes

## Implementation Approach
1. [Fintech specific implementation step 1]
2. [Fintech specific implementation step 2]
3. [Additional steps as needed]

## Code Structure
- File Location: [path to file(s) to be created or modified]
- Component Structure: [description of component structure]
- Financial Data Management: [description of financial data handling]
- Security Implementation: [description of security measures]

## Related Resources
- Financial API Documentation: [links to financial API docs]
- Compliance Guidelines: [links to relevant financial regulations]
- Existing Components: [links to existing fintech components]
- Security Standards: [links to financial security standards]

## Constraints and Considerations
- Security: Implement financial-grade security measures
- Accuracy: Ensure precise calculations for financial data
- Compliance: Adhere to relevant financial regulations
- Performance: Optimize for real-time financial data processing

## Testing Requirements
- Unit Tests: [description of unit tests]
- Integration Tests: [description of integration tests]
- Security Tests: [description of security testing]
- Financial Calculation Tests: [description of calculation testing]

## MCP Server Utilization
- MCP-Commerce-Stripe: Use for payment processing patterns
- MCP-Fullstack-Turbo: Use for secure financial data management
- [Additional MCP servers as needed]

## Authorization
This task is authorized for autonomous execution within the defined scope.
- Task Priority: [priority]
- Time Allocation: [time allocation]
- Resource Limits: [resource limits]
- Approval Chain: [approval chain]
```

## Educational Technology Template

```
# Task Execution Prompt: [Task ID] - [Task Title]

## Project Context
- Project: [EdTech Project Name]
- Domain: [Specific edtech domain, e.g., Learning Management, Online Courses, Educational Games]
- Core Features: Course management, student progress tracking, assessment tools, interactive content
- Tech Stack: [Your tech stack, e.g., React, Node.js, MongoDB, WebRTC]
- Design Philosophy: [Your design philosophy, e.g., Engaging, accessible interface with focus on learning experience]

## Task Details
- ID: [task-id]
- Title: [task-title]
- Type: [feature/bug/content/testing]
- Priority: [high/medium/low]
- Assigned Agent: [FrontendAgent/BackendAgent/ContentAgent/LearningAgent/TestAgent]
- Required MCP Servers: [list of required MCP servers]
- Dependencies: [list of dependent task IDs]
- Estimated Effort: [small/medium/large]

## Task Description
[Detailed description of the edtech task to be performed]

## Acceptance Criteria
- [EdTech specific criterion 1]
- [EdTech specific criterion 2]
- [Additional criteria as needed]

## Technical Requirements
- [EdTech specific technical requirement 1]
- [EdTech specific technical requirement 2]
- [Additional technical requirements as needed]

## Design Guidelines
- Use engaging color palette appropriate for learning
- Ensure clear navigation and learning pathways
- Implement accessible design for all learners
- Design for different learning styles and preferences
- Support both light and dark themes

## Implementation Approach
1. [EdTech specific implementation step 1]
2. [EdTech specific implementation step 2]
3. [Additional steps as needed]

## Code Structure
- File Location: [path to file(s) to be created or modified]
- Component Structure: [description of component structure]
- Learning Content Management: [description of content handling]
- Assessment Implementation: [description of assessment features]

## Related Resources
- Learning Standards: [links to relevant learning standards]
- Accessibility Guidelines: [links to educational accessibility guidelines]
- Existing Components: [links to existing edtech components]
- Content Structure: [links to learning content structure]

## Constraints and Considerations
- Accessibility: Ensure learning content is accessible to all users
- Engagement: Optimize for student engagement and retention
- Assessment: Implement valid and reliable assessment methods
- Performance: Support concurrent usage by multiple students

## Testing Requirements
- Unit Tests: [description of unit tests]
- Integration Tests: [description of integration tests]
- Accessibility Tests: [description of accessibility testing]
- Learning Outcome Tests: [description of educational effectiveness testing]

## MCP Server Utilization
- MCP-CMS-Headless: Use for educational content management
- MCP-React-UI: Use for interactive learning components
- [Additional MCP servers as needed]

## Authorization
This task is authorized for autonomous execution within the defined scope.
- Task Priority: [priority]
- Time Allocation: [time allocation]
- Resource Limits: [resource limits]
- Approval Chain: [approval chain]
```

## Adapting These Templates

To adapt these templates for your specific business:

1. **Identify Your Domain**:
   - Select the template closest to your business domain
   - Customize the project context to reflect your specific niche
   - Adjust core features to match your product offerings

2. **Customize Technical Details**:
   - Update the tech stack to match your development environment
   - Modify file paths to reflect your project structure
   - Adjust code structure to align with your architecture

3. **Refine Design Guidelines**:
   - Update color references to match your brand palette
   - Modify UX principles to align with your user experience goals
   - Customize accessibility requirements for your target audience

4. **Adjust Domain-Specific Considerations**:
   - Update compliance and regulatory references for your industry
   - Modify security considerations based on your data sensitivity
   - Customize performance requirements for your use cases

5. **Update MCP Server References**:
   - Replace MCP server references with those relevant to your project
   - Customize server utilization descriptions for your specific needs
   - Add or remove servers based on your implementation requirements

By tailoring these templates to your specific business domain, you can create effective communication channels between MCP servers and autonomous agents for any project.
