module "deploy" {
  source           = "../resources"
  hosted_zone_name = "cianandsimon.xyz"
  domain_name      = "api.cianandsimon.xyz"
  default_name     = "cianandsimon"
  frontend_domain  = "https://cianandsimon.xyz"
  jwt_secret       = var.jwt_secret
}

variable "jwt_secret" {
  type      = string
  sensitive = true
}
