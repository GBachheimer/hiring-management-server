const express = require("express");
const app = express();
const cors = require("cors");
const Pool = require("pg").Pool;
require("dotenv").config();

const db = new Pool({
    user: process.env.REACT_APP_POSTGRES_USER,
    password: process.env.REACT_APP_POSTGRES_PASSWORD,
    host: process.env.REACT_APP_HOST,
    database: process.env.REACT_APP_DATABASE,
});

app.use(cors());
app.use(express.json());

//routes
app.post("/company/add", (req, res) => {
    try {
        const Co_Name = req.body.companyName;
        const Co_Country = req.body.country;
        const Co_City = req.body.city;
        const Co_Address = req.body.address;
        const Co_Postal_Code = req.body.postalCode;
        const Co_Initial_Total_Pos = req.body.totalPositions;
        const Co_Initial_Open_Pos = req.body.openPositions;
        const Co_Lat = req.body.lat;
        const Co_Lng = req.body.lng;
        const Co_state = req.body.state;
        const createTableQuery = "CREATE TABLE IF NOT EXISTS companies(co_id SERIAL PRIMARY KEY, co_name TEXT NOT NULL, co_country TEXT NOT NULL, co_city TEXT NOT NULL, co_address TEXT NOT NULL, co_postal_code TEXT NOT NULL, co_initial_total_positions TEXT NOT NULL, co_initial_free_positions TEXT NOT NULL, co_lat TEXT, co_lng TEXT, co_state TEXT NOT NULL, co_occupied_positions INTEGER DEFAULT 0)";
        db.query(createTableQuery, (error, result) => {
            if(error) {
                console.log(error);
            }
        });
        db.query("INSERT INTO companies (co_name, co_country, co_city, co_address, co_postal_code, co_initial_total_positions, co_initial_free_positions, co_lat, co_lng, co_state) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)", 
            [Co_Name, Co_Country, Co_City, Co_Address, Co_Postal_Code, Co_Initial_Total_Pos, Co_Initial_Open_Pos, Co_Lat, Co_Lng, Co_state], 
            (error, result) => {
                if (error) {
                    console.log(error);
                } else {
                    res.send("New company created successfully!");
                }
            }
        );
    } catch (error) {
        console.log(error);
    }
});

app.get("/company/list", async(req, res) => {
    const allCompanies = await db.query("SELECT * FROM companies");
    res.json(allCompanies);
});

app.delete("/company/delete/:id", (req, res) => {
    const id = req.params.id;
    db.query("DELETE FROM companies WHERE co_id = $1",
    [id], (error, result) => {
        if (error) {
            console.log(error);
        } else {
            res.send("Deleted successfully!");
        }
    });
});

app.put("/company/edit/:id", (req, res) => {
    const id = req.params.id;
    const Co_Name = req.body.companyName;
    const Co_Country = req.body.country;
    const Co_City = req.body.city;
    const Co_Address = req.body.address;
    const Co_Postal_Code = req.body.postalCode;
    const Co_Initial_Total_Pos = req.body.totalPositions;
    const Co_Initial_Open_Pos = req.body.openPositions;
    const Co_Lat = req.body.lat;
    const Co_Lng = req.body.lng;
    const Co_state = req.body.state;
    const previousCoName = req.body.previousCoName;
    db.query("UPDATE companies SET co_name = $1, co_country = $2, co_city = $3, co_address = $4, co_postal_code = $5, co_initial_total_positions = $6, co_initial_free_positions = $7, co_lat = $8, co_lng = $9, co_state = $10 WHERE co_id = $11", 
    [Co_Name, Co_Country, Co_City, Co_Address, Co_Postal_Code, Co_Initial_Total_Pos, Co_Initial_Open_Pos, Co_Lat, Co_Lng,Co_state, id], (error, result) => {
        if (error) {
            console.log(error);
        } else {
            res.send("Updated successfully!");
        }
    })
});

app.post("/positions/add/:companyId", (req, res) => {
    const co_id = req.params.companyId;
    const position = req.body.position;
    const description = req.body.description;
    const deadline = req.body.deadline;
    const link = req.body.link;
    const occupied = req.body.occupied;
    const query1 = "CREATE TABLE IF NOT EXISTS positions(pos_id SERIAL PRIMARY KEY, company_id INTEGER NOT NULL, pos_name TEXT NOT NULL, pos_description TEXT, pos_deadline TEXT, pos_link TEXT, pos_occupied TEXT)";
    const query2 = "INSERT INTO positions (company_id, pos_name, pos_description, pos_deadline, pos_link, pos_occupied) VALUES ($1, $2, $3, $4, $5, $6)";
    db.query(query1, (error, result) => {
        if (error) {
            console.log(error);
        } else {
            db.query(query2, [co_id, position, description, deadline, link, occupied], (error, result) => {
                if(error) {
                    console.log(error);
                } else {
                    res.send("Position saved successfully!")
                }
            })
        }
    });
});

app.get("/positions/list/:companyId", (req, res) => {
    const co_id = req.params.companyId;
    const query = "SELECT * FROM positions WHERE company_id = $1";
    db.query(query, [co_id], (error, result) => {
        if(error) {
            console.log(error);
            res.send("Failed!")
        } else {
            res.send(result);
        }
    })
});

app.put("/positions/edit/:id", (req, res) => {
    const pos_id = req.params.id;
    const position = req.body.position;
    const description = req.body.description;
    const deadline = req.body.deadline;
    const link = req.body.link;
    const occupied = req.body.occupied;
    const query = "UPDATE positions SET pos_name = $1, pos_description = $2, pos_deadline = $3, pos_link = $4, pos_occupied = $5 WHERE pos_id = $6";
    db.query(query, [position, description, deadline, link, occupied, pos_id], (error, result) => {
        if(error) {
            console.log(error);
        } else {
            res.send("Saved successfully!");
        }
    });
});

app.delete("/positions/delete/:id", (req, res) => {
    const pos_id = req.params.id;
    const query = "DELETE FROM positions WHERE pos_id = $1";
    db.query(query, [pos_id], (error, result) => {
        if(error) {
            console.log(error);
        } else {
            res.send("Deleted successfully!");
        }
    });
});

app.listen(process.env.PORT || 3030, () => {
    console.log("Server is running on port 5000!");
});



