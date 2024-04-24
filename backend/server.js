const express = require("express");
const mysql = require("mysql"); // Import the mysql package
const app = express();
const cors = require("cors");
const multer = require("multer");
const { format } = require("date-fns");

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
      return res
        .status(500)
        .json({ error: "An error occurred while fetching employee data." });
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
    post, // Make sure 'post' is included in the request body
    position,
    wage,
  } = req.body;

  const photo = req.file;

  // Ensure that the file is provided
  if (!photo) {
    return res.status(400).json({ error: "No file provided" });
  }

  if (!["image/jpeg", "image/png", "image/gif"].includes(photo.mimetype)) {
    return res.status(400).json({ error: "Invalid file type" });
  }

  // Check if employee with the given email already exists

  // Employee does not exist, proceed with the insert
  const sql =
    "INSERT INTO employees (name, email, phone, date, country, post, position, wage, photo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

  db.query(
    sql,
    [name, email, phone, date, country, post, position, wage, photo.filename],
    (err, result) => {
      if (err) {
        console.error("Error inserting data into the database: " + err.message);
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
});

// Serve uploaded files statically
app.use("/public", express.static("public"));
app.get("/getAttendanceStatus/:id", (req, res) => {
  const checkAttendanceQuery =
    "SELECT status FROM attendance WHERE employee_id = ? AND date(attendance_date) = CURRENT_DATE()";
  db.query(checkAttendanceQuery, [req.params.id], (err, result) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({
          error: "An error occurred while checking attendance.",
          details: err.message,
        });
    }
    res.json(result[0]); // Assuming result is an array with a single object
    console.log(result);
  });
});

app.get("/employees", (req, res) => {
  db.query("SELECT * FROM employees", (err, result) => {
    if (err) {
      console.error(err);
      res
        .status(500)
        .json({ error: "An error occurred while fetching employee data." });
    } else {
      const currentDateTime = format(new Date(), "yyyy-MM-dd");

      const employees = result;
      db.query(
        "SELECT status,employee_id FROM attendance WHERE date(attendance_date) = ?",
        [currentDateTime],
        (err, result) => {
          if (err) {
            console.error(err);
            res
              .status(500)
              .json({
                error: "An error occurred while fetching attendance data.",
              });
          } else {
            todays_attendance = result;
            console.log(todays_attendance);
            const data = employees.map((employee) => {
              employee.status =
                todays_attendance.find(
                  (attendance) => attendance.employee_id === employee.id
                )?.status || "Absent";
              return employee;
            });
            res.json(data);
          }
        }
      );
    }
  });
});

app.put("/update/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { country, post, position, wage } = req.body; // Add 'position' here

  const sql =
    "UPDATE employees SET country = ?, post = ?, position = ?, wage = ? WHERE id = ?";

  db.query(sql, [country, post, position, wage, id], (err, result) => {
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
  const employeeid = req.params.id; // Corrected to req.params.id
  console.log("Deleting employee with id: " + employeeid);

  // Check if db is properly connected before handling the delete request
  if (!db) {
    console.error("Database connection not established");
    res.status(500).json({ error: "Database connection not established" });
    return;
  }

  const sql = `DELETE FROM employees WHERE id = ${employeeid}`;
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
  const sql =
    "SELECT position, COUNT(*) as count FROM employees GROUP BY position";

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
app.post("/markAttendance/:id", (req, res) => {
  const { employeeId } = req.body;

  // Validate if employeeId is provided
  if (!employeeId) {
    return res.status(400).json({ error: "Employee ID is required." });
  }

  // Get the current date and time
  const currentDateTime = format(new Date(), "yyyy-MM-dd HH:mm:ss");

  // Check if attendance for the current date already exists
  const checkAttendanceQuery =
    "SELECT * FROM attendance WHERE employee_id = ? AND DATE(attendance_date) = CURDATE()";

  db.query(checkAttendanceQuery, [employeeId], (err, result) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ error: "An error occurred while checking attendance." });
    }

    // If attendance for the current date already exists, send a message
    if (result.length > 0) {
      // Get the last attendance time
      const lastAttendanceTime = result[0].attendance_date;
      return res.json({ message: "Attendance already marked for today", lastAttendanceTime });
    }

    // Check if the current time is past midnight (beginning of the next day)

    // Insert new attendance record
    const markAttendanceQuery =
      "INSERT INTO attendance (employee_id, attendance_date, status) VALUES (?, ?, 'Yes')";
    db.query(
      markAttendanceQuery,
      [employeeId, currentDateTime],
      (err, result) => {
        if (err) {
          console.error(err);
          return res
            .status(500)
            .json({ error: "An error occurred while marking attendance." });
        }

        // Successful attendance marking
        return res.json({
          message: "Attendance marked successfully",
        });
      }
    );
  });
});



app.get("/totalMonthAttendance/:id", (req, res) => {
  // Get the first day and last day of the current month
  const firstDayOfMonth = format(new Date(), "yyyy-MM-01");
  const lastDayOfMonth =
    format(new Date(), "yyyy-MM-") +
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();

  // Query to get the total attendance for the current month
  const totalMonthAttendanceQuery =
    "SELECT COUNT(*) as totalDaysPresent FROM attendance WHERE status = 'Yes' and DATE(attendance_date) between ? and ? AND employee_id = ?";
    console.log("SQL Query:", totalMonthAttendanceQuery);
  db.query(
    totalMonthAttendanceQuery,
    [firstDayOfMonth, lastDayOfMonth, req.params.id],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          error: "An error occurred while fetching total month attendance.",
        });
      }
      console.log("Database Result:", result);

      // Send the total days present for the current month to the client
      res.json(result[0]);
    }
  );
});


app.get("/getTotalPresentToday", (req, res) => {
  // Get the current date
  const currentDateTime = format(new Date(), "yyyy-MM-dd");

  // Query to get the total number of employees present today
  const totalPresentTodayQuery =
    "SELECT COUNT(DISTINCT employee_id) as totalEmployeesPresent FROM attendance WHERE status = 'Yes' AND DATE(attendance_date) = ?";
console.log(totalPresentTodayQuery);
  db.query(totalPresentTodayQuery, [currentDateTime], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        error: "An error occurred while fetching total present today data.",
      });
    }

    // Send the total employees present today to the client
    res.json(result[0]);
  });
});

app.get("/getTotalAbsentToday", (req, res) => {
  // Get the current date
  const currentDateTime = format(new Date(), "yyyy-MM-dd");

  // Query to get the total number of employees absent today
  const totalAbsentTodayQuery =
    "SELECT COUNT(DISTINCT employee_id) as totalEmployeesAbsent FROM attendance WHERE status = 'Absent' AND DATE(attendance_date) = ?";

  db.query(totalAbsentTodayQuery, [currentDateTime], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        error: "An error occurred while fetching total absent today data.",
      });
    }

    // Send the total employees absent today to the client
    res.json(result[0]);
  });
});
app.get("/monthAttendanceLogs/:id", async (req, res) => {
  try {
    // Query to get the total attendance for each month
    const totalMonthAttendanceQuery =
      "SELECT MONTH(attendance_date) as month, COUNT(*) as totalDaysPresent " +
      "FROM attendance " +
      "WHERE status = 'Yes' AND YEAR(attendance_date) = YEAR(CURRENT_DATE()) " +
      "AND employee_id = ? " +
      "GROUP BY MONTH(attendance_date)";
      
    // Execute the SQL query
    const result = await new Promise((resolve, reject) => {
      db.query(totalMonthAttendanceQuery, [req.params.id], (err, rows) => {
        if (err) {
          // Log the error
          console.error("Error executing SQL query:", err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });

    // Send the result to the client
    res.json(result);
  } catch (err) {
    // Handle errors and send an error response
    console.error("Error fetching total month attendance:", err);
    res.status(500).json({
      error: "An error occurred while fetching total month attendance.",
    });
  }
});



app.listen(3001, () => {
  console.log("App listening on port 3001");
});
