# TODO

## @product/api

- [ ] Update error handler to return in API response format
- [ ] Implement a reusable pagination solution using ODP Offset pagination format
- [ ] Find a solution for easily filtering and managing json files in js - something like jq to make filtering and searching easier in controllers
- [ ] Add ajv + ajv-formats or zod to ensure output json is valid
- [ ] Add in ODP types
- [ ] Create demo data for each example in the ODP repo to be returned
- [ ] Implement GET `/api/@next/public/planning_application/search`
- [ ] Implement GET `/api/@next/public/planning_application/{reference}`
- [ ] Implement GET `/api/@next/public/planning_application/{reference}/documents`
- [ ] Implement GET `/api/@next/public/planning_application/{reference}/comments/public`
- [ ] Implement GET `/api/@next/public/planning_application/{reference}/comments/specialist`
- [ ] Implement POST `/api/@next/planning_application/{reference}/comments/public`
- [ ] Add docker container for deployment [Outpost API](https://github.com/wearefuturegov/outpost-api-service) is a good reference for container
