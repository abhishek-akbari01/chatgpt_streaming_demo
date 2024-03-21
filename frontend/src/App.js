import React, { useState, useEffect } from "react";
import "./App.css";
import lens from "./assets/lens.png";
import loadingGif from "./assets/loading.gif";

function App() {
  const [prompt, updatePrompt] = useState();
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    if (prompt != null && prompt.trim() === "") {
      setAnswer("");
    }
  }, [prompt]);

  const sendPrompt = async (event) => {
    if (event.key !== "Enter") {
      return;
    }

    try {
      setLoading(true);
      setAnswer("");
      const response = await fetch("http://localhost:2000/aiCompletion", {
        method: "post",
        headers: {
          Accept: "application/json, text/plain, */*", 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userPrompt: prompt }), // server is expecting JSON
      });
      if (!response.ok || !response.body) {
        throw response.statusText;
      }
      console.log("response  - ",response)
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      const loopRunner = true;

      while (loopRunner) {
        const { value, done } = await reader.read();
        if (done) {
          break;
        }
        const decodedChunk = decoder.decode(value, { stream: true });
        console.log("decodedChunk - ",decodedChunk)
        setAnswer((answer) => answer + decodedChunk);
      }
    } catch (err) {
      console.error(err, "err");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="app-container">
        <div className="spotlight__wrapper">
          <input
            type="text"
            className="spotlight__input"
            placeholder="Ask me anything..."
            disabled={loading}
            style={{
              backgroundImage: loading ? `url(${loadingGif})` : `url(${lens})`,
            }}
            onChange={(e) => updatePrompt(e.target.value)}
            onKeyDown={(e) => sendPrompt(e)}
          />
          <div className="spotlight__answer">{answer && <p>{answer}</p>}</div>
        </div>
      </div>
    </div>
  );
}

export default App;