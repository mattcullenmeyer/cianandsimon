variable "hosted_zone_name" {
  type        = string
  description = "Name of hosted zone"
}

variable "domain_name" {
  type        = string
  description = "Exact domain or subdomain for routing and SSL"
}

variable "name" {
  type        = string
  description = "Name of the deployment"
}
