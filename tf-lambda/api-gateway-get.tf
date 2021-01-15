resource "aws_api_gateway_method" "getEmployees" {
  rest_api_id   = aws_api_gateway_rest_api.serverless_api.id
  resource_id   = aws_api_gateway_resource.employees.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "getEmployees" {
  rest_api_id             = aws_api_gateway_rest_api.serverless_api.id
  resource_id             = aws_api_gateway_resource.employees.id
  http_method             = aws_api_gateway_method.getEmployees.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.employees.invoke_arn
}

resource "aws_api_gateway_deployment" "getEmployees" {
  rest_api_id = aws_api_gateway_rest_api.serverless_api.id
  stage_name = "api"

  triggers = {
    redeployment = sha1(join(",", list(
      jsonencode(aws_api_gateway_integration.getEmployees),
    )))
  }
}



resource "aws_api_gateway_method" "getEmployeeById" {
  rest_api_id   = aws_api_gateway_rest_api.serverless_api.id
  resource_id   = aws_api_gateway_resource.employeeId.id
  http_method   = "GET"
  authorization = "NONE"

  request_parameters = {
    "method.request.path.id" = true
  }
}

resource "aws_api_gateway_integration" "getEmployeeById" {
    rest_api_id             = aws_api_gateway_rest_api.serverless_api.id
    resource_id             = aws_api_gateway_resource.employeeId.id
    http_method             = aws_api_gateway_method.getEmployeeById.http_method
    type                    = "AWS_PROXY"
    integration_http_method = "POST"
    uri                     = aws_lambda_function.employees.invoke_arn
    passthrough_behavior    = "WHEN_NO_MATCH"

    request_parameters = {
        "integration.request.path.id" = "method.request.path.id"
    }
}

resource "aws_api_gateway_deployment" "getEmployeeById" {
  rest_api_id = aws_api_gateway_rest_api.serverless_api.id
  stage_name = "api"

  triggers = {
    redeployment = sha1(join(",", list(
      jsonencode(aws_api_gateway_integration.getEmployeeById),
    )))
  }
}


