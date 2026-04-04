# README

`cd backend && docker compose up` to start DynamoDB container  
`cd backend && nvm use && pnpm dev`  
`cd frontend && nvm use && pnpm dev`

# TODO

- [ ] Parent's dashboard should include outstanding chores (all chores due with completion status), pending verifications (chores waiting for parental approval), chores (set up chores and associated point values), kids (adding/configuring kids)
- [ ] Use TTLs for chores that expire; need to filter out expired chores from active assignments; need to remove TTL once chore is completed and pending approval
- [ ] Chore template should include ID, title, subtasks, point value, cron/schedule expression (eg, `0 7 ? * MON-FRI *` for every weekday at 7am), and ARN of EventBridge Scheduler rule
- [ ] Need an endpoint for EventBridge to call to create chore assignments (will need to pass the template ID; all relevant info should be in the template)
- [ ] aws_acm_certificate_validation.main is missing validation_record_fqdns = [for record in aws_route53_record.certificate_validation : record.fqdn]. Without it, Terraform won't wait for the DNS records to propagate before attempting to validate the certificate, which can cause flaky applies.
