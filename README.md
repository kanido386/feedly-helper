# feedly-helper

### To Do
- Refresh feedlyToken with [Amazon EventBridge](https://aws.amazon.com/tw/blogs/compute/using-api-destinations-with-amazon-eventbridge/)
- Tidy up the code
- [AWS Lambda Layer] Try to do something like [this](https://github.com/aws-samples/aws-lambda-layer-node-puppeteer-headless-chromium/tree/main/src)
- Integrate "get feedlyToken" mechanism with the service
- Find out why "Copy to clipboard"(?) can't work with phone
  - Maybe can try the code in: https://stackoverflow.com/a/34046084
- Error handling for encrypt and decrypt
- Express error handling middleware

### ✅ Done
- Can modify environment variables of the lambda in the lambda
- Found payload format to invoke serverless-http lambda
  ```json
  {
    "httpMethod": "POST",
    "path": "/encrypt",
    "body": "{\"plainText\":\"abc123\"}",
    "headers": {
      "Content-Type": "application/json"
    }
  }
  ```
- [@sparticuz/chromium](https://github.com/Sparticuz/chromium/releases/tag/v121.0.0) as a layer in AWS Lambda
- Can get feedlyToken from localStorage with Puppeteer
- Use workaround to build an MVP
- sweetalert2-react-content
- Copy to clipboard
- Create API to do what I want to do about the Feedly itself
- Maybe can utilize GitHub Pages as FE, and try to call Lambda API
- Find a way to encrypt and decrypt the token
  - Try out first, might not use this mechanism
- Make sure deploying with .env works fine
- (express + serverless-http) + AWS Lambda Function URL → a very simple API which can respond something to the caller
- Can deploy with node-lambda
- Figure it out why current user is `terraform-user`
  - Can get the information from the command `aws iam get-user`
  - It seems like we can reset it by `aws configure`
  - Or by using environment variables like `AWS_SECRET_ACCESS_KEY` (command: `aws sts assume-role`)
  - Maybe can create a new role(?) for this project
- `npm run deploy` script needs to add `-o`
