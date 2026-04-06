module "deploy" {
  source           = "../../resources"
  hosted_zone_name = var.hosted_zone_name
  domain_name      = var.domain_name
  default_name     = var.default_name
  frontend_domain  = var.frontend_domain
  jwt_secret       = var.jwt_secret
}
