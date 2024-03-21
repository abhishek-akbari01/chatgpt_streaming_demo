const express =  require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const getStreamingCompletion = require("./openAI");

const app = express();
const port = 2000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.get("/", (req, res) => {
  return res.json({ data: "success" });
});

app.post("/aiCompletion", async (req, res) => {
    const data = req.body;
    let starttime = Date.now();
    const stream = await getStreamingCompletion({ userPrompt: data?.userPrompt });
    for await (const part of stream) {
      // here express will stream the response
      res.write(part.choices[0]?.delta.content || "");
    }
    // here express sends the closing/done/end signal for the stream consumer
    res.end();
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});