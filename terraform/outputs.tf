
output "ec2_public_ip" {
  description = "IP publico da nova instancia EC2"
  value       = aws_eip.devops.public_ip
}

output "ec2_instance_id" {
  description = "ID da nova instancia EC2"
  value       = aws_instance.devops.id
}
