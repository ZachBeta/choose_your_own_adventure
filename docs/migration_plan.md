# Migration Plan: Dialog System to Experience Nodes

## Current System Analysis

### Backend (Core: ~500-600 lines)
- `dialogService.ts` (159 lines)
  - Scene management
  - LLM interaction
  - Player state handling
- `llmClient.ts` (75 lines)
  - LLM API integration
  - Response handling
- Data Model:
  - Scene/dialog based
  - Monologues and thought cabinet
  - Skill checks
  - Dialog options

### Frontend (Core: ~400 lines)
- `App.tsx` (199 lines)
  - Main application logic
  - State management
  - Player interaction
- `ConsciousPanel.tsx` (123 lines)
- `SubconsciousPanel.tsx` (63 lines)
- Current Features:
  - Dialog streaming
  - Choice handling
  - History display

## New System Design

### Core Concepts
- Experience Nodes with:
  - Scene descriptions
  - Sensory information
  - Internal voices
  - Choices with difficulty
- Rolling history window (10 nodes)
- No complex ID system
- Plain language difficulty and voice strength

### Components to Preserve
1. Project Structure
   - TypeScript configuration
   - Build setup
   - Directory organization

2. Core Infrastructure
   - LLM client integration
   - Basic API structure
   - Logging system

3. UI Foundation
   - Split panel layout
   - Styling framework
   - Animation system

4. Development Tools
   - Testing framework
   - Build pipeline
   - Docker setup

## Implementation Plan

### Phase 1: New Foundation
1. Create new branch `feature/experience-nodes`
2. Implement core types:
   - Experience node interfaces
   - Request/response types
   - History tracking

### Phase 2: Backend Implementation
1. Create new services:
   - ExperienceService
   - PromptBuilder
   - Response parser
2. Set up new API endpoints
3. Implement history management

### Phase 3: Frontend Implementation
1. Create new components:
   - ExperienceDisplay
   - SensoryPanel
   - VoicesPanel
   - ChoiceSelector
2. Implement state management
3. Add new UI interactions

### Phase 4: Testing & Validation
1. Unit tests for new components
2. Integration tests
3. LLM response validation
4. UI/UX testing

## Migration Strategy

### For New Users
- Direct to new experience-based system
- No migration needed

### For Existing Users (If Needed)
- Read-only access to old dialog history
- Fresh start with new experience system
- No complex state migration needed

## Development Guidelines

### Code Organization
- Keep shared types in `shared/types`
- Maintain clear service boundaries
- Use consistent naming conventions

### Testing Requirements
- Unit tests for all new components
- Integration tests for LLM interaction
- UI component testing
- Prompt/response validation

### Documentation Needs
- API documentation
- Component documentation
- Example flows
- Development setup guide

## Timeline

1. **Week 1**: Foundation
   - Set up new branch
   - Implement core types
   - Basic service structure

2. **Week 2**: Backend
   - Experience service
   - API endpoints
   - LLM integration

3. **Week 3**: Frontend
   - New components
   - State management
   - Basic UI

4. **Week 4**: Polish
   - Testing
   - Documentation
   - Bug fixes

## Success Criteria

1. **Technical**
   - Clean implementation of experience node model
   - Robust error handling
   - Good test coverage
   - Type safety throughout

2. **User Experience**
   - Smooth narrative flow
   - Intuitive UI
   - Responsive interaction
   - Clear feedback

3. **Development**
   - Maintainable codebase
   - Clear documentation
   - Easy onboarding
   - Testable components

## Next Steps

1. Create new feature branch
2. Set up core type definitions
3. Begin backend service implementation
4. Start frontend component development

## Notes
- Focus on clean implementation over migration
- Preserve useful infrastructure
- Maintain consistent documentation
- Regular testing throughout development 