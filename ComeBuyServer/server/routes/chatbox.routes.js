module.exports = (app) => {
  const dialogflow = require("dialogflow");
  var router = require("express").Router();
  // Create a new product image
  const projectId = process.env.GOOGLE_PROJECT_ID;
  const sessionId = process.env.DIALOGFLOW_SESION_ID;
  const languageCode = process.env.DIALOGFLOW_LANGUAGE_CODE;

  const sessionClient = new dialogflow.SessionsClient();
  const sessionPath = sessionClient.sessionPath(projectId, sessionId);

  router.post("/textQuery", async (req, res) => {
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: req.body.text,
          languageCode: languageCode,
        },
      },
    };
    // Send request and log result
    const responses = await sessionClient.detectIntent(request);
    console.log("Detected intent");
    const result = responses[0].queryResult;
    console.log(`Query: ${result.queryText}`);
    console.log(`Response: ${result.fulfillmentText}`);
    res.send(result);
  });

  app.use("/api/chatbot", router);
};
