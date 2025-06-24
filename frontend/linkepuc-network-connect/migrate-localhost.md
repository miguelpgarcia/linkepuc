# 🚀 Localhost Migration Guide

## Files with localhost references that need to be migrated:

### ✅ **COMPLETED:**
- `src/hooks/use-static-data.ts` (3 references)
- `src/pages/Login.tsx` (1 reference) 
- `src/pages/ProfessorLogin.tsx` (1 reference)

### 🔄 **IN PROGRESS:**
- `src/pages/Register.tsx` (3 references)
- `src/pages/ProfessorRegister.tsx` (2 references)
- `src/pages/VerifyEmail.tsx` (1 reference)

### ⏳ **TODO - Authentication & Core:**
- `src/pages/Profile.tsx` (4 references)
- `src/pages/ProfessorProfile.tsx` (4 references)
- `src/pages/ImportCurriculum.tsx` (1 reference)

### ⏳ **TODO - API Hooks:**
- `src/hooks/use-recommendations.ts` (5 references)
- `src/hooks/use-professor-opportunity.ts` (2 references)
- `src/hooks/use-professor-opportunities.ts` (5 references)
- `src/hooks/use-opportunity.ts` (1 reference)
- `src/hooks/use-curriculum-status.ts` (1 reference)
- `src/hooks/use-curriculum-data.ts` (1 reference)
- `src/hooks/use-candidaturas.ts` (4 references)
- `src/hooks/use-messages.tsx` (1 reference)
- `src/hooks/use-conversations.tsx` (1 reference)

### ⏳ **TODO - Pages:**
- `src/pages/Opportunities.tsx` (1 reference)
- `src/pages/Messages.tsx` (2 references)
- `src/pages/ProfessorMessages.tsx` (2 references)

### ⏳ **TODO - Components:**
- `src/components/professor/OpportunityActions.tsx` (2 references)
- `src/components/opportunity/OpportunityForm.tsx` (1 reference)
- `src/components/opportunity/InterestsSelector.tsx` (1 reference)
- `src/components/layout/Header.tsx` (1 reference)
- `src/components/layout/ProfessorHeader.tsx` (1 reference)
- `src/components/InterestsEditor.tsx` (3 references)
- `src/App.tsx` (2 references)

## Pattern to Follow:

### 1. Add import:
```typescript
import { API_ENDPOINTS } from "@/config/api";
```

### 2. Replace hardcoded URLs:
```typescript
// ❌ Before
const response = await fetch("http://localhost:8000/users/login");

// ✅ After  
const response = await fetch(API_ENDPOINTS.AUTH.LOGIN);
```

### 3. For dynamic URLs:
```typescript
// ❌ Before
const response = await fetch(`http://localhost:8000/users/${userId}`);

// ✅ After
const response = await fetch(API_ENDPOINTS.USERS.BY_ID(userId));
```

## Total Progress: 5/53+ files migrated (9%) 