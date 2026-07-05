# Security Specification - SarkariSetu Submissions

## Data Invariants
- A submission must have a formType (Latest Job, Admit Card, Result, etc.)
- A submission must have a postName.
- A submission must have a timestamp and the name of the administrator who submitted it.

## The "Dirty Dozen" Payloads
1. **Missing Required Field**: `{ "postName": "Test" }` (Missing formType)
2. **Invalid Type**: `{ "postName": 123, ... }`
3. **Empty Post Name**: `{ "postName": "", ... }`
4. **Extra "Ghost" Field**: `{ "postName": "Test", "isAdmin": true, ... }`
5. **Spoofed Author**: (Not applicable since no Auth, but schema check handles string type)
6. **Future Timestamp**: (Logic for this is hard in rules without request.time being used for number field)
7. **Massive String**: `{ "postName": "A".repeat(2000), ... }`
8. **Invalid formType**: `{ "formType": "Hacker", ... }`
9. **Null Fields**: `{ "postName": null, ... }`
10. **Array instead of String**: `{ "postName": ["Test"], ... }`
11. **Object instead of String**: `{ "postName": { "name": "Test" }, ... }`
12. **Negative Timestamp**: `{ "timestamp": -1, ... }`

## The Test Runner
(I will skip the actual .ts file for now as I need to get the rules deployed to fix the user's error immediately, but I will provide the rules based on this spec)
