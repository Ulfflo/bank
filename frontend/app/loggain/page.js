"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Loggain() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState(""); // "success" or "error"
  const router = useRouter();

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setFeedbackMessage("Användarnamn och lösenord måste fyllas i.");
      setFeedbackType("error");
      setPassword("");
      setUsername("");
      return; // Stop further execution if validation fails
    }

    try {
      const response = await fetch("http://localhost:3001/sessions", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("sessionId", data.session.token);

        // Success message before redirection
        setFeedbackMessage("Inloggning lyckades! Du skickas vidare...");
        setFeedbackType("success");

        setTimeout(() => {
          router.push("/konto");
        }, 2000); // 2 seconds delay before redirecting
      } else {
        setFeedbackMessage("Fel användarnamn eller lösenord.");
        setFeedbackType("error");
      }
    } catch (error) {
      console.error("Något gick fel.", error);
      setFeedbackMessage("Något gick fel vid inloggning. Försök igen.");
      setFeedbackType("error");
    } finally {
      setPassword("");
      setUsername("");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl text-center">Välkommen till Arbetarbanken</h1>
      <div className="flex flex-col bg-black justify-content items-center w-96 h-96 text-yellow-50 rounded">
        <p className="mt-8">Logga in</p>

        {/* Feedback Message */}
        {feedbackMessage && (
          <div
            className={`mt-4 px-4 py-2 rounded ${
              feedbackType === "success" ? "bg-green-500" : "bg-red-500"
            } text-white`}
          >
            {feedbackMessage}
          </div>
        )}

        <label htmlFor="username" className="mt-8">
          Användarnamn:
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-2 p-2 rounded"
        />
        <label htmlFor="password" className="mt-8">
          Lösenord:
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 p-2 rounded"
        />
        <button
          onClick={handleLogin}
          className="bg-white text-black rounded-full px-5 py-2 cursor-pointer mt-8"
        >
          Logga in
        </button>
      </div>
    </div>
  );
}
