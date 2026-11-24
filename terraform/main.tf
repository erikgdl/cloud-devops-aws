
# Identificar a VPC padrao da AWS
data "aws_vpc" "default" {
  default = true
}

# Consultar as subnets da VPC
data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

# Buscar a imagem oficial Ubuntu Server 24.04
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"]

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# Security Group exclusivo do novo projeto
resource "aws_security_group" "devops" {
  name        = "${var.project_name}-sg"
  description = "Acesso HTTP e SSH ao Cloud DevOps"
  vpc_id      = data.aws_vpc.default.id

  tags = {
    Name    = "${var.project_name}-sg"
    Project = var.project_name
  }
}

# Liberar HTTP
resource "aws_vpc_security_group_ingress_rule" "http" {
  security_group_id = aws_security_group.devops.id

  cidr_ipv4   = "0.0.0.0/0"
  from_port   = 80
  to_port     = 80
  ip_protocol = "tcp"
}

# Liberar HTTPS
resource "aws_vpc_security_group_ingress_rule" "https" {
  security_group_id = aws_security_group.devops.id

  cidr_ipv4   = "0.0.0.0/0"
  from_port   = 443
  to_port     = 443
  ip_protocol = "tcp"
}

# SSH somente pelo IP autorizado
resource "aws_vpc_security_group_ingress_rule" "ssh" {
  security_group_id = aws_security_group.devops.id

  cidr_ipv4   = var.ssh_allowed_cidr
  from_port   = 22
  to_port     = 22
  ip_protocol = "tcp"
}

# Permitir conexoes de saida
resource "aws_vpc_security_group_egress_rule" "outbound" {
  security_group_id = aws_security_group.devops.id

  cidr_ipv4   = "0.0.0.0/0"
  ip_protocol = "-1"
}

# Registrar a chave SSH publica
resource "aws_key_pair" "devops" {
  key_name   = "${var.project_name}-key"
  public_key = file(pathexpand(var.ssh_public_key_path))

  tags = {
    Project = var.project_name
  }
}

# Criar a nova instancia EC2
resource "aws_instance" "devops" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = var.instance_type

  subnet_id            = sort(data.aws_subnets.default.ids)[0]
  iam_instance_profile = aws_iam_instance_profile.ec2_ssm.name

  vpc_security_group_ids = [
    aws_security_group.devops.id
  ]

  key_name = aws_key_pair.devops.key_name

  root_block_device {
    volume_size = 30
    volume_type = "gp3"
    encrypted   = true
  }

  metadata_options {
    http_tokens = "required"
  }

  tags = {
    Name    = "${var.project_name}-ec2"
    Project = var.project_name
  }
}

# Elastic IP exclusivo da nova EC2
resource "aws_eip" "devops" {
  domain   = "vpc"
  instance = aws_instance.devops.id

  tags = {
    Name    = "${var.project_name}-eip"
    Project = var.project_name
  }
}

