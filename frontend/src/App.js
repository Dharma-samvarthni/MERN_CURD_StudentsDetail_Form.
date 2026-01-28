import axios from "axios";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

function App() {

  const [people, setPeople] = useState([]);
  const [form, setForm] = useState({
    name: "",
    regNo: "",
    age: "",
    dob: "",
    department: "",
    email: "",
    year: "",
    phnNo: "",
    skills: "",
    address: ""
  });

  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadPeople();
  }, []);

  const loadPeople = async () => {
    const res = await axios.get(API);
    setPeople(res.data);
  };

  const clearForm = () => {
    setForm({
      name: "",
      regNo: "",
      age: "",
      dob: "",
      department: "",
      email: "",
      year: "",
      phnNo: "",
      skills: "",
      address: ""
    });
  };

  const addPerson = async () => {
    if (Object.values(form).some(v => v === "")) {
      alert("All fields are required");
      return;
    }

    const res = await axios.post(API, {
      ...form,
      age: Number(form.age),
      year: Number(form.year)
    });

    setPeople([...people, res.data]);
    clearForm();
  };

  const startEdit = (p) => {
    setEditId(p._id);
    setForm(p);
  };

  const updatePerson = async () => {
    const res = await axios.put(`${API}/${editId}`, form);

    setPeople(
      people.map(p =>
        p._id === editId ? res.data : p
      )
    );

    setEditId(null);
    clearForm();
  };

  const deletePerson = async (id) => {
    if (!window.confirm("Are you sure you want to delete?")) return;

    await axios.delete(`${API}/${id}`);
    setPeople(people.filter(p => p._id !== id));
  };

  return (
    <div className="container mt-4">

      <h3 className="text-center mb-4">
         Student Details -MERN CRUD
      </h3>

      {/* ---------------- FORM ---------------- */}
      <div className="card shadow p-4 mb-4">
        <div className="row g-3">

          {[
            ["Name", "name"],
            ["Register No", "regNo"],
            ["Age", "age"],
            ["DOB", "dob", "date"],
            ["Department", "department"],
            ["Email", "email", "email"],
            ["Year", "year"],
            ["Phone", "phnNo"],
            ["Skills", "skills"],
            ["Address", "address"]
          ].map(([label, key, type]) => (
            <div className="col-md-6" key={key}>
              <input
                type={type || "text"}
                className="form-control"
                placeholder={label}
                value={form[key]}
                onChange={(e) =>
                  setForm({ ...form, [key]: e.target.value })
                }
              />
            </div>
          ))}

        </div>

        <div className="text-center mt-4">
          {editId ? (
            <button
              className="btn btn-success px-5"
              onClick={updatePerson}
            >
              Update
            </button>
          ) : (
            <button
              className="btn btn-primary px-5"
              onClick={addPerson}
            >
              Submit
            </button>
          )}
        </div>
      </div>

      {/* ---------------- TABLE ---------------- */}
      <div className="table-responsive">
        <table className="table table-bordered table-striped table-hover align-middle text-center">

          <thead className="table-dark">
            <tr>
              <th>S.NO</th>
              <th>Name</th>
              <th>Register No</th>
              <th>Age</th>
              <th>DOB</th>
              <th>Department</th>
              <th>Email</th>
              <th>Year</th>
              <th>Phone</th>
              <th>Skills</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {people.length === 0 ? (
              <tr>
                <td colSpan="12" className="text-muted">
                  No records found
                </td>
              </tr>
            ) : (
              people.map((p, index) => (
                <tr key={p._id}>
                  <td>{index + 1}</td>
                  <td>{p.name}</td>
                  <td>{p.regNo}</td>
                  <td>{p.age}</td>
                  <td>{p.dob}</td>
                  <td>{p.department}</td>
                  <td>{p.email}</td>
                  <td>{p.year}</td>
                  <td>{p.phnNo}</td>
                  <td>{p.skills}</td>
                  <td>{p.address}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => startEdit(p)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deletePerson(p._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>

    </div>
  );
}

export default App;
