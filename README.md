# feedly-helper

### To Do
- Find a way to encode and decode the token
  - Try out first, might not use this mechanism
- Maybe can utilize GitHub Pages as FE, and try to call Lambda API
- Create API to do what I want to do about the Feedly itself

### ✅ Done
- Make sure deploying with .env works fine
- (express + serverless-http) + AWS Lambda Function URL → a very simple API which can respond something to the caller
- Can deploy with node-lambda
- Figure it out why current user is `terraform-user`
  - Can get the information from the command `aws iam get-user`
  - It seems like we can reset it by `aws configure`
  - Or by using environment variables like `AWS_SECRET_ACCESS_KEY` (command: `aws sts assume-role`)
  - Maybe can create a new role(?) for this project
- `npm run deploy` script needs to add `-o`
