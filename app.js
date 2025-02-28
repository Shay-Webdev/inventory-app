const express = require('express');
const indexRouter = require('./routes/indexRoute');
const path = require('path');
const app = express();

const assetsPath = path.join(__dirname, 'public');
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(assetsPath));

app.use('/', indexRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
