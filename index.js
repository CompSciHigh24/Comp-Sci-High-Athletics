const mongoose = require("mongoose");
const ejs = require("ejs");

const express = require("express");
const { stringify } = require("querystring");
const app = express();

app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));

app.use((req, res, next) => {
  console.log(`${req.method}: ${req.path}`);
  next();
});

const mongoDBConnectionString =
  "mongodb+srv://SE12:CSH2024@cluster0.xr0mdbb.mongodb.net/CompSciHighathletics?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB and use .then and .catch to check if the connection worked
mongoose
  .connect(mongoDBConnectionString)
  .then(() => console.log("MongoDB connection successful."))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(express.static(__dirname + "/public"));

// Define the middleware to parse incoming requests as JSON
app.set("view engine", "ejs");
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${req.method}: ${req.path}`);
  next();
});

const compsciteamsSchema = new mongoose.Schema({
  teamname: { type: String },
  teamimage: { type: String },
});

const gameSchema = new mongoose.Schema({
  score: { type: String },
  date: { type: String },
  result: { type: String },
  opponent: { type: String },
});
const playerBioSchema = new mongoose.Schema({
  // Write your Schema here, ignore timestamps\
  team: { type: mongoose.Types.ObjectId, required: true },
  number: { type: Number, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  year: { type: Number },
  height: { type: String },
  bio: { type: String },
});

const Compsciteams = mongoose.model("compsciteams", compsciteamsSchema);

const Game = mongoose.model("game", gameSchema);

const PlayerBio = mongoose.model("playerBio", playerBioSchema);

const homeList = {
  image:
    "https://image.maxpreps.io/school-mascot/e/0/e/e0ed04ef-54cc-404c-bb0b-766e0119834c.gif?version=638076292800000000&width=1024&height=1024",
  checked: true,

  missionStatement:
    "CSH Athletics mainly focuses on making students young leaders in their enviorment and makes them grow indivisually on every team they participate in.",
};
app.get("/", (req, res) => {
  res.render("home.ejs", homeList);
});

app.get("/boysbball", (req, res) => {
  PlayerBio.find({ team: "boysbball" }).then((found) => {
    res.render("boysbball.ejs", { found: found });
  });
});

app.get("/playerdes", (req, res) => {
  PlayerBio.find({ team: "boysbball" }).then((found) => {
    res.render("playerbiopage.ejs", { found: found });
  });
});

app.get("/teams/:team", (req, res) => {
  PlayerBio.find({ team: req.params.team }).then((found) => {
    console.log(found);
    res.render("showteams.ejs", { found: found });
  });
});
app.get("/girlsbball", (req, res) => {
  PlayerBio.find({ team: "6655feee711c2381c2dd2589" }).then((found) => {
    res.render("girlsbball.ejs", { found: found });
  });
});

app.get("/playerBio", (req, res) => {
  PlayerBio.find({}).then((found) => {
    res.render("players.ejs", { found: found });
    res.json(found);
  });
});
app.get("/Game", (req, res) => {
  Game.find({}).then((found) => {
    // res.render("players.ejs", {found:found});
    res.json(found);
  });
});
app.get("/Compsciteams", (req, res) => {
  Compsciteams.find({}).then((found) => {
    // res.render("players.ejs", {found:found});
    res.json(found);
  });
});
app.post("/players", (req, res) => {
  const playerbio = new PlayerBio({
    team: req.body.team,
    number: req.body.number,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    year: req.body.year,
    height: req.body.height,
    bio: req.body.bio,
  });

  playerbio.save().then((newplayerBio) => {
    res.json(newplayerBio);
  });
});
app.patch("/teams/:id",(req,res)=>{
  const filter ={_id: req.params.id};
    const update ={$set:{ teamname: req.body.teamname,teamimage: req.body.teamimage}};
    Compsciteams.findOneAndUpdate(filter,update,{new:true}) .then((found) => {
            res.json(found);
      
          });
})

/*
"API Endpoints" – these will commit the operations to the database and be called from your .js files
- app.patch("/teams/:id")
- app.delete("/teams/:id")
- app.patch("/players/:id")
- app.delete("/players/:id")

"View Endpoints"
- app.get("/manage-teams") // on delete calls to /teams/:id or /player/:id
- app.get("/edit-team/:id") // on save this calls PATCH /teams/:id

- app.get("/edit-player/:id") // on save this calls PATCH /players/:id
*/

app.get("/edit/teams/:id",(req,res)=>{
  Compsciteams.findOne({_id:req.params.id}).then((team) => {
    res.render("updateteam.ejs",{ team })
  });
})

app.post("/teams", (req, res) => {
  const team = new Compsciteams({
    teamname: req.body.teamname,
    teamimage: req.body.teamimage,
  });

  team.save().then((newteam) => {
    res.json(newteam);
  });
});

app.get("/teams", (req, res) => {
  Compsciteams.find({})
    .exec()
    .then((teams) => {
      res.json(teams);
    });
});

app.post("/newGame", (req, res) => {
  const game = new Game({
    score: req.body.score,
    date: req.body.date,
    result: req.body.result,
    opponent: req.body.opponent,
  });
  game.save().then((newGame) => {
    res.json(newGame);
  });
});

app.get("/addplayer", (req, res) => {
  res.render("addplayer");
});

app.get("/addteam", (req, res) => {
  res.render("addteam");
});

// const boysbkballRoutes = require(__dirname+'/routes/boysbkballRoutes.js')

// app.use("/boysbasketball",boysbkballRoutes)

// const girlsbkballRoutes = require(__dirname+'/routes/girlsbkballRoutes.js')

// app.use("/girlsbasketball",girlsbkballRoutes)

// app.get('/boysbasketball', (req, res) => {
//   res.sendFile(__dirname+'/public/index.html')
// })

app.use((req, res, next) => {
  res.status(404).send("404 Not Found");
});

app.listen(3000, () => {
  console.log("Server is running.");
});
