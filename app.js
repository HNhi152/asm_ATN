const express = require("express");
const hbs = require("handlebars")
const exphbs = require("express-handlebars");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require('express-session')
const passport = require('passport')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');

require('./config/passport')(passport)

const app = express();
let port = process.env.PORT || 3000;

const user = require(path.join(__dirname, "routes/user"));
const stats = require(path.join(__dirname, "routes/stats"));
const products = require(path.join(__dirname, "routes/products"));
const category = require(path.join(__dirname, "routes/category"));
const sales = require(path.join(__dirname, "routes/sales"));

const { checkAuthenticated } = require('./helpers/auth')

const db = require(path.join(__dirname, "config/database"));

mongoose.connect(db.mongoURI, {
	useNewUrlParser: true,
	useUnifiedTopology: true
})
	.then(() => console.log("Connected to database"))
	.catch(err => console.log(err));

app.use(express.static(path.join(__dirname, "/public")));

app.engine("handlebars", exphbs({
	handlebars: allowInsecurePrototypeAccess(hbs)
}));
app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
	secret: 'key-secret',
	resave: true,
	saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())

require('./models/User');
const User = mongoose.model('user')

app.use("/user", user);
app.get("/", async (req, res) => {
	if (req.isAuthenticated()) {
		res.locals.isAuthenticated = true
		if (req.user.role == 'admin') {
			res.locals.isAdminRole = true

			let users = await User.find({ role: 'staff' })
			res.locals.users = users
		}
	}
	res.render("home");
});
app.use(checkAuthenticated);
app.use("/stats", stats);
app.use("/products", products);
app.use("/category", category);
app.use("/sales", sales);

app.listen(port, err => {
	if (err) throw err;
	console.log(`Server is listening on port ${port}`);
});
