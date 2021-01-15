resource "aws_api_gateway_rest_api" "serverless_api" {
  name = "employees"
}

resource "aws_api_gateway_resource" "employees" {
  path_part   = "employees"
  parent_id   = aws_api_gateway_rest_api.serverless_api.root_resource_id
  rest_api_id = aws_api_gateway_rest_api.serverless_api.id
}

resource "aws_api_gateway_resource" "employeeId" {
  path_part   = "{id}"
  parent_id   = aws_api_gateway_resource.employees.id
  rest_api_id = aws_api_gateway_rest_api.serverless_api.id
}

resource "aws_lambda_permission" "employees" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.employees.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_api_gateway_rest_api.serverless_api.execution_arn}/*/*/*"
}