const express = require("express");
const mysql = require("mysql"); // Import the mysql package
const app = express();
const cors = require("cors");
const multer = require("multer");
const { format } = require('date-fns');

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
// Add the following code in your server-side code

app.post("/employeeLogin", (req, res) => {
  const { employeeName, employeeId } = req.body;

  // Check if employee with provided name and id exists in the database
  const sql = "SELECT * FROM employees WHERE name = ? AND id = ?";

  db.query(sql, [employeeName, employeeId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "An error occurred while fetching employee data." });
    }

    if (result.length > 0) {
      // Employee exists, you can send a success message or employee data to the client
      return res.send("success");
    } else {
      // No matching employee found
      return res.send("failed");
    }
  });
});



// ... (existing code)

app.post("/create", upload.single("photo"), (req, res) => {
  const {
    name,
  
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



  // check if employeeid already exists
  db.query(
    "SELECT * FROM datas WHERE id = ?",
    id,
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "An error occurred while fetching employee data." });
      } else if (result.length > 0) {
        return res.status(400).json({ error: "Employee already exists" });
      } else {
        console.log("Employee does not exist");
      }
    }
  );


  // Set the mimetype to "image/jpeg"
  const sql =
    "INSERT INTO datas (name,  email, date, country, position, wage, photo) VALUES (?, ?, ?, ?, ?, ?, ?)";


  // Check if employeeid already exists
  db.query(
    "SELECT * FROM datas WHERE id = ?",
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
          "INSERT INTO datas (name, email, phone, date, country, post, position, wage, photo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        db.query(
          sql,
          [
            name,
       
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
  db.query("SELECT * FROM employees", (err, result) => {
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
    "UPDATE employees SET country = ?, post = ?, wage = ? WHERE employeeid = ?";

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
  db.query("SELECT * FROM employees WHERE id = ?", id, (err, result) => {
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
app.delete("/delete/:id", (req, res) => {
  const employeeid = req.params.employeeid;
  console.log("Deleting employee with id: " + id);

  // Check if db is properly connected before handling the delete request
  if (!db) {
    console.error("Database connection not established");
    res.status(500).json({ error: "Database connection not established" });
    return;
  }

  const sql = `DELETE FROM datas WHERE id = ${id}`;
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
  const sql = "SELECT position, COUNT(*) as count FROM employees GROUP BY position";

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching chart data from database:", err.message);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(result);
    }
  });
});
// Your existing code in server.js
app.get("/getEmployeeData/:id", (req, res) => {
  const Id = req.params.id;

  db.query("SELECT * FROM employees WHERE id = ?", [Id], (err, result) => {
    if (err) {
      console.error("Error fetching employee data:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else if (result.length > 0) {
      res.json(result[0]); // Assuming you want to send only the first result (assuming employee IDs are unique)
    } else {
      res.status(404).json({ error: "Employee not found" });
    }
  });
});
app.post("/markAttendance", (req, res) => {
  const { employeeId } = req.body;

  // Validate if employeeId is provided
  if (!employeeId) {
    return res.status(400).json({ error: "Employee ID is required." });
  }

  // Get the current date and time
  const currentDateTime = format(new Date(), "yyyy-MM-dd HH:mm:ss");

  // Check if attendance for the current date and time already exists
  const checkAttendanceQuery = "SELECT * FROM attendance WHERE employee_id = ? AND attendance_date = ?";
  db.query(checkAttendanceQuery, [employeeId, currentDateTime], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "An error occurred while checking attendance." });
    }

    // If attendance for the current date and time already exists, send a message
    if (result.length > 0) {
      return res.json({ message: "Attendance already marked for today." });
    }

    // Insert new attendance record
    const markAttendanceQuery = "INSERT INTO attendance (employee_id, attendance_date) VALUES (?, ?)";
    db.query(markAttendanceQuery, [employeeId, currentDateTime], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "An error occurred while marking attendance." });
      }

      // Successful attendance marking
      return res.json({ message: "Attendance marked successfully." });
    });
  });
});

// const attendance_list = [];
// // Assuming today is a JavaScript Date object representing the current date
// const today = new Date();

// // Assuming your employees array is named 'employees'
// const data = employeeList.map((employee) => {
//   // Assuming the 'id' and 'attendance_date' are properties of the employee object
//   // You can modify this based on the structure of your data
//   const employeeId = employee.id;

//   // Check if the employee has attendance for today
//   const hasAttendance = attendance_list.some(
//     (attendance) =>
//       attendance.employee_id === employeeId &&
//       new Date(attendance.attendance_date).toDateString() === today.toDateString()
//   );

//   // Assign the attendance status
//   employee.attendance = hasAttendance ? 'yes' : 'no';

//   // Return the modified employee object
//   return employee;
// });

// ... (existing code)

app.listen(3001, () => {
  console.log("App listening on port 3001");
});
