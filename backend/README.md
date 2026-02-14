# Backend

`docker compose up`

```bash
aws dynamodb list-tables --endpoint-url http://localhost:8000
```

```bash
aws dynamodb create-table \
  --table-name cianandsimon \
  --attribute-definitions \
    AttributeName=PK,AttributeType=S \
    AttributeName=SK,AttributeType=S \
  --key-schema \
    AttributeName=PK,KeyType=HASH \
    AttributeName=SK,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST \
  --endpoint-url http://localhost:8000
```

```bash
aws dynamodb get-item \
  --table-name cianandsimon \
  --key '{"PK": {"S": "NAME#Cian"}, "SK": {"S": "BALANCE#Cian"}}' \
  --endpoint-url http://localhost:8000
```

```bash
aws dynamodb query \
  --endpoint-url http://localhost:8000 \
  --table-name cianandsimon \
  --key-condition-expression "PK = :pk AND begins_with(SK, :sk)" \
  --expression-attribute-values '{":pk": {"S": "NAME#Cian"}, ":sk": {"S": "TRANSACTION#"}}' \
  --scan-index-forward false
```
