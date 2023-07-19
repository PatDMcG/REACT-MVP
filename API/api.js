const ViteExpress = require("vite-express");
const { Pool } = require("pg");
const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config();
const app = express();
app.use(express.json());
// app.use("/", express.static(path.join(__dirname, "../Front_END")));
const PORT = process.env.PORT;
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({
  connectionString,
});
//get all Main
app.get("/goals/main", async (req, res) => {
    try {
        let data = await pool.query('select * from MainGoals;') 
        res.status(200).json(data.rows)
    } catch (error) {

        res.status(500).json(error.message)
        
    }
})
// get all Sub
app.get("/goals/sub", async (req, res) => {
    try {
        let data = await pool.query('select * from SubGoals;') 
        res.status(200).json(data.rows)
    } catch (error) {

        res.status(500).json(error.message)
        
    }
})
// get one Main
app.get("/goals/main/:id", async (req, res) => {
    try {
        let id = req.params.id;
        let data = await pool.query('select * from MainGoals where id = $1;' , [id]) 
        res.status(200).json(data.rows)
    } catch (error) {

        res.status(500).json(error.message)
        
    }
})
//get one Sub
app.get("/goals/sub/:id", async (req, res) => {
    try {
        let id = req.params.id;
        let data = await pool.query('select * from SubGoals where id = $1;' , [id]) 
        res.status(200).json(data.rows)
    } catch (error) {

        res.status(500).json(error.message)
        
    }
})
// get all sub goals from parent
app.get("/goals/sub/parent/:id", async (req, res) => {
    try {
        let id = req.params.id;
        let data = await pool.query('select * from SubGoals where Parent = $1;' , [id]) 
        res.status(200).json(data.rows)
    } catch (error) {

        res.status(500).json(error.message)
        
    }
})
//delete one Main
app.delete("/goals/main/:id", async (req, res) => {
    try {
        let id = req.params.id;
        let data = await pool.query('delete from MainGoals where id = $1 returning *;' , [id]) 
        res.status(200).json(data.rows)
    } catch (error) {

        res.status(500).json(error.message)
        
    }
})
//delete one Sub
app.delete("/goals/sub/:id", async (req, res) => {
    try {
        let id = req.params.id;
        let data = await pool.query('delete from SubGoals where id = $1 returning *;' , [id]) 
        res.status(200).json(data.rows)
    } catch (error) {

        res.status(500).json(error.message)
        
    }
})
// make one Main
app.post("/goals/main", async (req, res) => {
    try {
        let name = req.body.name;
        let data = await pool.query(`insert into MainGoals(Title) values ($1) returning *;`, [name] ) 
        res.status(200).json(data.rows)
    } catch (error) {

        res.status(500).json(error.message)
    
    }
})
//make one Sub
app.post("/goals/sub", async (req, res) => {
    try {
        let parent = req.body.parent;
        let name = req.body.name;
        let data = await pool.query("insert into SubGoals(Title,Complete,Parent) values ('$1',false,$2) returning *;" , [name,parent]) 
        res.status(200).json(data.rows)
    } catch (error) {

        res.status(500).json(error.message)
        
    }
})

// update one Main
app.put("/goals/main/:id", async (req, res) => {
    try {
        let id = req.params.id
        let name = req.body.name;
        let data = await pool.query(`set MainGoals Title = $1 where id = $2 returning *;`, [name,id] ) 
        res.status(200).json(data.rows)
    } catch (error) {

        res.status(500).json(error.message)
    
    }
})
//update one Sub
app.post("/goals/sub/:id", async (req, res) => {
    try {
        let id = req.params.id
        let parent = req.body.parent;
        let name = req.body.name;
        let completion = req.body.completion
        if (name == undefined) {
            name = null;
          }
          if (parent == undefined) {
            parent = null;
          }
          if (completion == undefined) {
            completion = null;
          }
        if(name !== null)
        {
            let data = await pool.query("update SubGoals set Title = $1 where  id = $2 returning *;" , [name,id])
        }
        if(completion !== null)
        {
            let data = await pool.query("update SubGoals set Title = $1 where id = $2 returning *;" , [name,id])
        }
        if(parent !== null)
        {
            let data = await pool.query("update SubGoals set Parent = $1 where id =  $2 returning *;" , [name,id])
        }
         
        res.status(200).json(data.rows)
    } catch (error) {

        res.status(500).json(error.message)
        
    }
})

app.listen( PORT, () => {
    console.log(`listening on ${PORT}`);})