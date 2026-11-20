
variable "aws_region" {
  description = "Regiao AWS utilizada pelo projeto"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Nome utilizado na identificacao dos recursos"
  type        = string
  default     = "cloud-devops-aws"
}

variable "instance_type" {
  description = "Tipo da instancia EC2"
  type        = string
  default     = "t3.small"
}

variable "ssh_allowed_cidr" {
  description = "Endereco IPv4 autorizado a acessar a EC2 por SSH"
  type        = string

  validation {
    condition = (
      can(cidrnetmask(var.ssh_allowed_cidr)) &&
      var.ssh_allowed_cidr != "0.0.0.0/0"
    )
    error_message = "Informe um CIDR IPv4 valido e nao permita SSH para toda a internet."
  }
}

