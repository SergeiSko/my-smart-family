const express = require("express");

const app = express();
      port = 80;
app.get("/", (req, res) => {
  res.send("good");
});

app.listen(port, ()=>{
  console.log(`Server ready listen ${port} port.`);
})
