variable "hosted_zone_name" { type = string }
variable "domain_name" { type = string }
variable "default_name" { type = string }
variable "frontend_domain" { type = string }
variable "jwt_secret" {
  type      = string
  sensitive = true
}
