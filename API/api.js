const { Pool } = require("pg");
const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config();
const app = express();
app.use(express.json());
app.get("/", express.static("../public/React_MVP/public"));
console.log(path.join(__dirname, "../public/REACT_MVP/public"))
const PORT = process.env.PORT;
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({
  connectionString,
});
// redo server side html serving
async function createServer() {
    const app = express()
  
    // Create Vite server in middleware mode and configure the app type as
    // 'custom', disabling Vite's own HTML serving logic so parent server
    // can take control
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom'
    })
  
    // Use vite's connect instance as middleware. If you use your own
    // express router (express.Router()), you should use router.use
    app.use(vite.middlewares)
  
    app.use('*', async (req, res, next) => {
        const url = req.originalUrl
      
        try {
          // 1. Read index.html
          let template = fs.readFileSync(
            path.resolve(__dirname, 'index.html'),
            'utf-8',
          )
      
          // 2. Apply Vite HTML transforms. This injects the Vite HMR client,
          //    and also applies HTML transforms from Vite plugins, e.g. global
          //    preambles from @vitejs/plugin-react
          template = await vite.transformIndexHtml(url, template)
      
          // 3. Load the server entry. ssrLoadModule automatically transforms
          //    ESM source code to be usable in Node.js! There is no bundling
          //    required, and provides efficient invalidation similar to HMR.
          const { render } = await vite.ssrLoadModule('/src/entry-server.js')
      
          // 4. render the app HTML. This assumes entry-server.js's exported
          //     `render` function calls appropriate framework SSR APIs,
          //    e.g. ReactDOMServer.renderToString()
          const appHtml = await render(url)
      
          // 5. Inject the app-rendered HTML into the template.
          const html = template.replace(`<!--ssr-outlet-->`, appHtml)
      
          // 6. Send the rendered HTML back.
          res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
        } catch (e) {
          // If an error is caught, let Vite fix the stack trace so it maps back
          // to your actual source code.
          vite.ssrFixStacktrace(e)
          next(e)
        }
      })
  
    app.listen(PORT, () => {
        console.log(`listening on ${PORT}`);
      });
  }

  createServer()
//get all Main
app.get("/goals/main", async (req, res) => {
    try {
        let data = await pool.query('select * from MainGoals;') 
        res.status(200).json(data.rows)
    } catch (error) {

        res.status(500).json(error)
        
    }
})
// get all Sub
app.get("/goals/sub", async (req, res) => {
    try {
        let data = await pool.query('select * from SubGoals;') 
        res.status(200).json(data.rows)
    } catch (error) {

        res.status(500).json(error)
        
    }
})
// get one Main
app.get("/goals/main/:id", async (req, res) => {
    try {
        let id = req.params.id;
        let data = await pool.query('select * from MainGoals where id = $1;' , [id]) 
        res.status(200).json(data.rows)
    } catch (error) {

        res.status(500).json(error)
        
    }
})
//get one Sub
app.get("/goals/sub/:id", async (req, res) => {
    try {
        let id = req.params.id;
        let data = await pool.query('select * from SubGoals where id = $1;' , [id]) 
        res.status(200).json(data.rows)
    } catch (error) {

        res.status(500).json(error)
        
    }
})
// get all sub goals from parent
app.get("/goals/sub/parent/:id", async (req, res) => {
    try {
        let id = req.params.id;
        let data = await pool.query('select * from SubGoals where Parent = $1;' , [id]) 
        res.status(200).json(data.rows)
    } catch (error) {

        res.status(500).json(error)
        
    }
})
//delete one Main
app.delete("/goals/main/:id", async (req, res) => {
    try {
        let id = req.params.id;
        let data = await pool.query('delete from MainGoals where id = $1 returning *;' , [id]) 
        res.status(200).json(data.rows)
    } catch (error) {

        res.status(500).json(error)
        
    }
})
//delete one Sub
app.delete("/goals/sub/:id", async (req, res) => {
    try {
        let id = req.params.id;
        let data = await pool.query('delete from SubGoals where id = $1 returning *;' , [id]) 
        res.status(200).json(data.rows)
    } catch (error) {

        res.status(500).json(error)
        
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

        res.status(500).json(error)
        
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

        res.status(500).json(error)
        
    }
})

