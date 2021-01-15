resource "aws_dynamodb_table" "employeesTable" {
  name           = "Employees"
  billing_mode   = "PROVISIONED"
  read_capacity  = 20
  write_capacity = 20
  hash_key       = "employee_id"

  attribute {
    name = "employee_id"
    type = "S"
  }
}