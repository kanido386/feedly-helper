# feedly-helper

### To Do
- (express + serverless-http) + AWS Lambda Function URL → a very simple API which can respond something to the caller

### ✅ Done
- Can deploy with node-lambda
- Figure it out why current user is `terraform-user`
  - Can get the information from the command `aws iam get-user`
  - It seems like we can reset it by `aws configure`
  - Or by using environment variables like `AWS_SECRET_ACCESS_KEY` (command: `aws sts assume-role`)
  - Maybe can create a new role(?) for this project
- `npm run deploy` script needs to add `-o`
