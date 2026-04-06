# Terraform

`terraform version`  
`brew install tfenv`  
`tfenv install latest`  
`tfenv use <version>`

`cd terraform/deploy/{environment}`  
`terraform init`  
`terraform fmt`  
`terraform validate`  
`terraform plan -out=tfplan`  
`terraform apply tfplan`

Run `pnpm build` before planning and applying changes

Use `openssl rand -base64 48` to generate a new JWT secret for each environment

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
