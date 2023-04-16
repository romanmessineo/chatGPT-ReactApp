import { useState,useEffect  } from "react";
import axios from "axios";

import send from "./assets/send.svg";
import user from "./assets/user.png";
import bot from "./assets/bot.png";
import loadingIcon from "./assets/loader.svg";

/* let arr = [
 {type:"user", post:"fafafafafaf"},
 {type:"bot", post:"fafafafafaf"},
]; */

function App() {
  const [input, setInput] = useState("");
  const [post, setPosts] = useState([]);

  useEffect(() => {
    document.querySelector(".layout").scrollTop =
        document.querySelector(".layout").scrollHeight;
}, [post]);

  const fetchBotResponse = async () => {
    const { data } = await axios.post(
      "http://localhost:4000",
      { input },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return data;
  };

  const onSubmit = () => {
    if (input.trim() === "") return;
    updatePosts(input);
    updatePosts("loading..", false, true);
    setInput("");
    fetchBotResponse().then((res) => {
      console.log(res);
      updatePosts(res.bot.trim(), true);
    });
  };

  const autoTypingBotResponse = (text) => {
    let index = 0;
    let interval = setInterval(() => {
      if (index < text.length) {
        setPosts((prevState) => {
          let lastItem = prevState.pop();
          if (lastItem.type !== "bot") {
            prevState.push({
              type: "bot",
              post: text.charAt(index - 1),
            });
          } else {
            prevState.push({
              type: "bot",
              post: lastItem.post + text.charAt(index - 1),
            });
          }
          return [...prevState];
        });
        index++;
      } else {
        clearInterval(interval);
      }
    });
  };

  const updatePosts = (post, isBot, isLoading) => {
    if (isBot) {
      autoTypingBotResponse(post);
    } else {
      setPosts((prevState) => {
        return [...prevState, { type: isLoading ? "loading" : "user", post }];
      });
    }
  };
  const onKeyUp = (e) => {
    if (e.key === "Enter" || e.whitch === 13) {
      onSubmit();
    }
  };

  return (
    <main className="chatGPT-app">
      <section className="chat-container">
        <div className="layout">
          {post.map((post, index) => (
            <div
              key={index}
              className={`chat-bubble ${
                post.type === "bot" || post.type === "loading" ? "bot" : ""
              }`}
            >
              <div className="avatar">
                <img
                  src={
                    post.type === "bot" || post.type === "loading" ? bot : user
                  }
                  alt="avatar"
                />
              </div>
              {post.type === "loading" ? (
                <div className="loader">
                  <img src={loadingIcon} alt="" />
                </div>
              ) : (
                <div className="post">{post.post}</div>
              )}
            </div>
          ))}
        </div>
      </section>
      <footer>
        <input
          value={input}
          className="composebar"
          autoFocus
          type="text"
          placeholder="Pregunta lo que quieras!"
          onChange={(e) => setInput(e.target.value)}
          onKeyUp={onKeyUp}
        />
        <div className="send-button" onClick={onSubmit}>
          <img src={send} alt="enviar" />
        </div>
      </footer>
    </main>
  );
}

export default App;
