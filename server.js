const express = require('express');
const app = express();

// ...existing code...

const PORT = 8080; // Change this line to set the port to 8080

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
