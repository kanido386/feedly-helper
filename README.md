# feedly-helper

### To Do
- Integrate "get feedlyToken" mechanism with the service
- Find out why "Copy to clipboard"(?) can't work with phone
  - Maybe can try the code in: https://stackoverflow.com/a/34046084
- Error handling for encrypt and decrypt
- Express error handling middleware

### ✅ Done
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
