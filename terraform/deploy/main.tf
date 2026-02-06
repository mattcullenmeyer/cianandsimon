module "deploy" {
  source           = "../resources"
  domain_name      = "cianandsimon.xyz"
  hosted_zone_name = "cianandsimon.xyz"
  name             = "cianandsimon"
}
