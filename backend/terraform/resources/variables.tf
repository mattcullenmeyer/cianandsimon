variable "hosted_zone_name" {
  type        = string
  description = "Name of hosted zone (eg zendog.site)"
}

variable "domain_name" {
  type        = string
  description = "Exact domain or subdomain for routing and SSL (eg api.zendog.site)"
}

variable "default_name" {
  type        = string
  description = "Default name to use for resources (eg zendog)"
}

variable "frontend_domain" {
  type        = string
  description = "Root domain of frontend site"
}
