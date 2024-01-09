const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

const port = 3000;
let db;

const initializeDBAndServer = async () => {
  try {
    db = await new Pool({
      connectionString:
        "postgres://database_ox5f_user:UzmbtXNbp4HU4mbd1RF1pGCcz1FVx8bF@dpg-cme0i5ed3nmc73dns450-a.oregon-postgres.render.com/database_ox5f?ssl=true",
    });
    app.listen(port, () => console.log(`Server is running on Port: ${port}`));
  } catch (error) {
    console.log(`Error is not started. some error occured:`, error.message);
    process.exit(1);
  }
};

initializeDBAndServer();

app.get("/", async (request, response) => {
  try {
    const query = `SELECT * FROM todolist ;`;
    const dbResponse = await db.query(query);
    console.log(dbResponse.rows);
    response.send(dbResponse.rows);
  } catch (error) {
    console.log(error.message);
    response.status(500).json({ msg: "Internal Server Error" });
  }
});

app.post("/", async (req, res) => {
  try {
    const { work } = req.body;
    const query = `INSERT INTO todolist 
        (work, isChecked) 
    VALUES 
        ('${work}', false)
    `;
    await db.query(query);
    res.send({ msg: "Todo created successfu" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: `Internal Server Error: ${error.message}` });
  }
});

app.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { ischecked } = req.query;
    console.log(id, ischecked);
    const query = `UPDATE todolist SET isChecked = ${ischecked} WHERE id = ${id}`;
    await db.query(query);
    const dataQuery = `SELECT * FROM todolist WHERE id = ${id}`;
    const todo = await db.query(dataQuery);
    console.log(todo);
    res.send({ msg: "Updated Successfully", updatedTodo: todo.rows[0] });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

app.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const query = `DELETE FROM todolist WHERE id = ${id};`;
    await db.query(query);
    res.send({ msg: "Deleted Successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});
