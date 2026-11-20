
terraform {
  backend "s3" {
    bucket       = "cloud-devops-tfstate-578530885674"
    key          = "cloud-devops-aws/terraform.tfstate"
    region       = "us-east-1"
    profile      = "devops-terraform"
    encrypt      = true
    use_lockfile = true
  }
}
