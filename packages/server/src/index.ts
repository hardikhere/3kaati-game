import express from "express";
// rest of the code remains same
const app = express();
const PORT = 8000;
app.get("/", (req, res) => res.send("Express + TypeScript Server"));
app.listen(PORT, () => {
  console.log("🚀 ~ file: index.ts ~ line 7 ~ app.listen ~ PORT", PORT)
  console.log("hiiiii hardik");
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
