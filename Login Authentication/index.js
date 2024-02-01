const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt'); 

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect("mongodb://127.0.0.1:27017/UserDataDB").then(() => {
    console.log("Database connected");
}).catch((e) => {
    console.log(e);
    console.log("Database can't be connected");
});

const User = require("./model/user");

app.post("/", async (req, res) => {
    const userData = new User(req.body);

    
    const saltRounds = 10;
    userData.password = await bcrypt.hash(userData.password, saltRounds);

    try {
        await userData.save();
        console.log("Data saved successfully");
        res.redirect("/"); 
    } catch (error) {
        console.error("Error saving data:", error);
        res.status(500).send(`Internal Server Error: ${error.message}`);
    }
});

app.get("/", (req, res) => {
    try {
        let a = fs.readFileSync(path.join(__dirname, 'public', 'index.html'));
        res.send(a.toString());
    } catch (error) {
        console.error("Error reading index.html:", error);
        res.status(500).send(`Internal Server Error: ${error.message}`);
    }
});

app.listen(port, () => {
    console.log("App running on port:", port);
});
