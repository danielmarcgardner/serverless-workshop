/* run step function */
const AWS = require('aws-sdk')
const STATE_MACHINE_ARN = process.env.STATE_MACHINE_ARN
const stepfunctions = new AWS.StepFunctions()

module.exports.startStateMachine = (event, context, callback) => {
  const body = JSON.parse(event.body)
  const taskName = body.taskName
  const startAt = body.startAt

  const params = {
    name: taskName, // taskID and user id?
    stateMachineArn: STATE_MACHINE_ARN,
    input: JSON.stringify({
      // The timestamp must conform to the RFC3339 profile of ISO 8601
      // 1331209044000 to toISOString
      // unix * 1000 => new Date(unix * 1000).toISOString()
      trigger_date: new Date(startAt).toISOString()
      // "trigger_date": "2017-10-15T23:51:09.000Z"
    })
  }
  // start step function
  stepfunctions.startExecution(params, (err, data) => {
    if (err) {
      console.log(err, err.stack) // an error occurred
      return callback(err)
    }
    console.log(data) // successful response
    console.log(data.executionArn) // needed for cancels
    console.log(data.startDate)
    const response = {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Started the step function. View the scheduled step function in aws console.',
        params: params
      }),
    };
    return callback(null, response)
  })
}


module.exports.sendEmail = (event, context, callback) => {
  const time = new Date()
  console.log(`send email triggered at ${time}`)

  // Implement email sending functionality here
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
    }),
  };

  return callback(null, response);
};
