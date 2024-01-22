const express = require("express");
const mysql = require("mysql"); // Import the mysql package
const app = express();
const cors = require("cors");
const multer = require("multer");

app.use(cors());
app.use(express.json());
const db = mysql.createConnection({
  user: "root",
  password: "",
  host: "localhost",
  database: "employeeinfo",
});
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/"); // Specify the directory where uploaded files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // Use a unique filename for each uploaded file (timestamp + original file.originalname); // Use the original filename for the stored file
  },
});

const upload = multer({ storage: storage });

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  db.query(
    "SELECT * FROM admin WHERE username = ? AND password = ?",
    [username, password],
    (err, result) => {
      if (err) {
        console.error(err);
      } else if (result.length > 0) {
        return res.send("success");
      } else {
        return res.send("failed");
      }
    }
  );
});

// ... (existing code)

app.post("/create", upload.single("photo"), (req, res) => {
  const {
    name,
    employeeid,
    email,
    phone,
    date,
    country,
    post,
    position,
    wage,
  } = req.body;
  const photo = req.file;
  console.log(req.body);
  console.log(req.file);

  // Ensure that the file is provided
  if (!photo) {
    return res.status(400).json({ error: "No file provided" });
  }
  if (!["image/jpeg", "image/png", "image/gif"].includes(photo.mimetype)) {
    return res.status(400).json({ error: "Invalid file type" });
  }

  // Check if employeeid already exists
  db.query(
    "SELECT * FROM datas WHERE employeeid = ?",
    [employeeid],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          error: "An error occurred while fetching employee data.",
        });
      } else if (result.length > 0) {
        return res.status(400).json({ error: "Employee already exists" });
      } else {
        // Employee does not exist, proceed with the insert
        const sql =
          "INSERT INTO datas (name, employeeid, email, phone, date, country, post, position, wage, photo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        db.query(
          sql,
          [
            name,
            employeeid,
            email,
            phone,
            date,
            country,
            post,
            position,
            wage,
            photo.filename,
          ],
          (err, result) => {
            if (err) {
              console.error(
                "Error inserting data into the database: " + err.message
              );
              return res.status(500).json("Error");
            } else {
              console.log(result);
              console.log("Data inserted successfully");
              return res.status(200).json({
                result: "Employee created successfully.",
              });
            }
          }
        );
      }
    }
  );
});

// Serve uploaded files statically
app.use("/public", express.static("public"));

// Assuming you have an Express app and a MySQL database connection (db) already set up
app.get("/employees", (req, res) => {
  db.query("SELECT * FROM datas", (err, result) => {
    if (err) {
      console.error(err);
      res
        .status(500)
        .json({ error: "An error occurred while fetching employee data." });
    } else {
      res.json(result);
    }
  });
});

app.put("/update/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { country, post, wage } = req.body;

  const sql =
    "UPDATE datas SET country = ?, post = ?, wage = ? WHERE employeeid = ?";

  db.query(sql, [country, post, wage, id], (err, result) => {
    if (err) {
      console.error("Error updating data in the database: " + err.message);
      return res.status(500).json("Error");
    } else {
      console.log(result);
      console.log("Data updated successfully");
      return res.status(200).json({ result: "Employee updated successfully." });
    }
  });
});

app.get("/edit/:id", (req, res) => {
  const id = parseInt(req.params.id);
  console.log(req.params.id);
  db.query("SELECT * FROM datas WHERE employeeid = ?", id, (err, result) => {
    if (err) {
      console.error(err);
      res
        .status(500)
        .json({ error: "An error occurred while fetching employee data." });
    } else if (result.length > 0) {
      res.json(result[0]);
      console.log(res);
    } else {
      res.status(404).json({ error: "Employee not found" });
      console.log(err);
    }
  });
});

// Add a new route to handle DELETE requests
app.delete("/delete/:employeeid", (req, res) => {
  const employeeid = req.params.employeeid;
  console.log("Deleting employee with id: " + employeeid);

  // Check if db is properly connected before handling the delete request
  if (!db) {
    console.error("Database connection not established");
    res.status(500).json({ error: "Database connection not established" });
    return;
  }

  const sql = `DELETE FROM datas WHERE employeeid = ${employeeid}`;
  console.log("SQL Query: " + sql);

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error deleting employee: " + err.message);
      res
        .status(500)
        .json({ error: "An error occurred while deleting the employee." });
    } else {
      console.log("Delete operation result:", result);

      if (result.affectedRows > 0) {
        res.json({ message: "Employee deleted successfully" });
      } else {
        res.status(404).json({ error: "Employee not found" });
      }
    }
  });
});
// ... (existing code)

app.get("/employeeChartData", (req, res) => {
  const sql = "SELECT position, COUNT(*) as count FROM datas GROUP BY position";

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching chart data from database:", err.message);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(result);
    }
  });
});

// ... (existing code)

app.listen(3001, () => {
  console.log("App listening on port 3001");
});
