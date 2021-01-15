locals{
    lambda_zip_location = "outputs/employees.zip"
}

data "archive_file" "employees" {
  type        = "zip"
  source_dir = "../backend"
  output_path = local.lambda_zip_location
}

resource "aws_lambda_function" "employees" {
  filename      = local.lambda_zip_location
  function_name = "employees"
  role          = aws_iam_role.lambda_role.arn
  handler       = "app.handler"

  source_code_hash = filebase64sha256(local.lambda_zip_location)

  runtime = "nodejs12.x"

  environment {
    variables = {
      PORT = "5000"
    }
  }
}