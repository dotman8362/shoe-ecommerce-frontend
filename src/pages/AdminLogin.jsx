import { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const res = await fetch("https://jofta-backend.onrender.com/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      // Save token
      localStorage.setItem("adminToken", data.token);

      Swal.fire("Success", "Login successful", "success");

      navigate("/admin");
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  return (
    <div style={container}>
      <div style={card}>
        <h2>Admin Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          style={input}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          style={input}
        />

        <button onClick={handleLogin} style={button}>
          Login
        </button>
      </div>
    </div>
  );
}
const container = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#f5f5f5",
};

const card = {
  background: "#fff",
  padding: "30px",
  borderRadius: "12px",
  width: "300px",
  display: "flex",
  flexDirection: "column",
  gap: "15px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
};

const input = {
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ddd",
};

const button = {
  padding: "12px",
  background: "#c850c0",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};
