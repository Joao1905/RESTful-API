resource "aws_api_gateway_method" "postEmployees" {
  rest_api_id   = aws_api_gateway_rest_api.serverless_api.id
  resource_id   = aws_api_gateway_resource.employees.id
  http_method   = "POST"
  authorization = "NONE"
}


resource "aws_api_gateway_integration" "postEmployees" {
  rest_api_id             = aws_api_gateway_rest_api.serverless_api.id
  resource_id             = aws_api_gateway_resource.employees.id
  http_method             = aws_api_gateway_method.postEmployees.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.employees.invoke_arn
}


resource "aws_api_gateway_deployment" "postEmployees" {
  rest_api_id = aws_api_gateway_rest_api.serverless_api.id
  stage_name = "api"

  triggers = {
    redeployment = sha1(join(",", list(
      jsonencode(aws_api_gateway_integration.postEmployees),
    )))
  }
}
