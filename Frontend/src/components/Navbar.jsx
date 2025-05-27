import React from "react";
import { useNavigate } from "react-router-dom";
import { post } from "../services/ApiEndPoint";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { logout } from "../Redux/AuthSlice";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const request = await post("/auth/logout");
      const response = request.data;
      if (response.success) {
        toast.success(response.message);
        dispatch(logout());
        navigate("/login");
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      }
      console.log(error);
    }
  };

  return (
    <nav className="navbar bg-white border-bottom py-2 px-3">
      <div className="container-fluid d-flex justify-content-between align-items-center flex-wrap">
        {/* Title */}
        <h5 className="mb-0">NOTE APP</h5>

        {/* Logout button on right always */}
        <button
          type="button"
          className="btn btn-dark btn-sm"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
