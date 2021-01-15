resource "aws_api_gateway_method" "putEmployeeById" {
  rest_api_id   = aws_api_gateway_rest_api.serverless_api.id
  resource_id   = aws_api_gateway_resource.employeeId.id
  http_method   = "PUT"
  authorization = "NONE"

  request_parameters = {
    "method.request.path.id" = true
  }
}


resource "aws_api_gateway_integration" "putEmployeeById" {
    rest_api_id             = aws_api_gateway_rest_api.serverless_api.id
    resource_id             = aws_api_gateway_resource.employeeId.id
    http_method             = aws_api_gateway_method.putEmployeeById.http_method
    type                    = "AWS_PROXY"
    integration_http_method = "POST"
    uri                     = aws_lambda_function.employees.invoke_arn
    passthrough_behavior    = "WHEN_NO_MATCH"

    request_parameters = {
        "integration.request.path.id" = "method.request.path.id"
    }
}

resource "aws_api_gateway_deployment" "putEmployeeById" {
  rest_api_id = aws_api_gateway_rest_api.serverless_api.id
  stage_name = "api"

  triggers = {
    redeployment = sha1(join(",", list(
      jsonencode(aws_api_gateway_integration.putEmployeeById),
    )))
  }
}