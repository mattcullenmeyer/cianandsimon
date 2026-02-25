module "deploy" {
  source           = "../resources"
  hosted_zone_name = "cianandsimon.xyz"
  domain_name      = "api.cianandsimon.xyz"
  default_name     = "cianandsimon"
  frontend_domain  = "https://cianandsimon.xyz"
}
