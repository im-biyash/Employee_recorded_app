import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

function Employeeedit() {
  const { id } = useParams();
  const [employeeData, setEmployeeData] = useState(null);
  const [updatedCountry, setUpdatedCountry] = useState("");
  const [updatedPost, setUpdatedPost] = useState("");
  const [updatedWage, setUpdatedWage] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get(`http://localhost:3001/edit/${id}`)
      .then((response) => {
        console.log(response);
        setEmployeeData(response.data);
        setUpdatedCountry(response.data.country);
        setUpdatedPost(response.data.post);
        setUpdatedWage(response.data.wage);
      })
      .catch((error) => {
        console.log("Error fetching employee data", error);
      });
  }, [id]);

  const updateEmployee = () => {
    axios
      .put(`http://localhost:3001/update/${id}`, {
        country: updatedCountry,
        post: updatedPost,
        wage: updatedWage,
      })
      .then((response) => {
        console.log("Employee updated successfully", response);
        // Update the local state with the new data, including existing position value
        setEmployeeData(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error updating employee", error);
      });
    navigate("/employee");
  };

  return (
    <div className="bg-[#0a192f] min-h-screen">
      <Navbar />

      {employeeData && (
        <div className="p-2 max-w-md mx-auto bg-[#0a192f]">
          <div className="">
            <img
              src={`http://localhost:3001/public/${employeeData.photo}`} // Assuming `photo` is the correct property name
              alt="Employee Photo"
              className="my-1 mx-auto rounded-full w-48 h-48 shadow-md"
            />
          </div>
          <form className="b shadow-md rounded px-4 pt-2 pb-8 mb-8 bg-[#0a192f] h-auto">
            {/* ... other input fields */}

            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-white text-sm font-bold mb-2"
              >
                Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-slate-200 leading-tight focus:outline-none focus:shadow-outline bg-gray-500"
                id="name"
                type="text"
                value={employeeData.name}
                readOnly
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="country"
                className="block text-white text-sm font-bold mb-2"
              >
                Country
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="country"
                type="text"
                placeholder="Enter country"
                value={updatedCountry}
                onChange={(e) => setUpdatedCountry(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="position"
                className="block text-white text-sm font-bold mb-2"
              >
                Post
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="position"
                type="text"
                placeholder="Enter position"
                value={updatedPost}
                onChange={(e) => setUpdatedPost(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="wage"
                className="block text-white text-sm font-bold mb-2"
              >
                Wage
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="wage"
                type="text"
                placeholder="Enter wage"
                value={updatedWage}
                onChange={(e) => setUpdatedWage(e.target.value)}
              />
            </div>

            <div className="buttons">
              <button
                className="px-2 py-1 w-20 border-2 stroke-orange-300 rounded-2xl bg-green-600"
                onClick={() => {
                  updateEmployee();
                }}
              >
                Update
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
export default Employeeedit;




// ckjshcsc