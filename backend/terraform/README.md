# Terraform

`terraform version`  
`brew install tfenv`  
`tfenv install latest`  
`tfenv use <version>`

`cd terraform/deploy`  
`terraform init`  
`terraform fmt`  
`terraform validate`  
`terraform plan -out=tfplan`  
`terraform apply tfplan`

Run `pnpm build` and `pnpm zip` before planning/applying

Lambda test event JSON:

```json
{
  "httpMethod": "GET",
  "path": "/health",
  "resource": "/{proxy+}",
  "pathParameters": { "proxy": "health" },
  "headers": {
    "Content-Type": "application/json"
  },
  "queryStringParameters": null,
  "body": null,
  "requestContext": {
    "resourceId": "test",
    "resourcePath": "/{proxy+}",
    "httpMethod": "GET",
    "path": "/stage/health"
  }
}
```
