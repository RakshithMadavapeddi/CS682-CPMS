import React from 'react';
import jwt_decode from 'jwt-decode';
import ClientDashBoard from 'components/Dashboard/ClientDashboard';
import AdminDashboard from 'components/Dashboard/AdminDashboard';
import { useNavigate } from 'react-router-dom';

export default function DashBoardPage() {
  const navigate = useNavigate();
  const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
  const decodedToken = jwt_decode(token);
  const role = decodedToken.role;

  React.useEffect(()=>{
    if (!role) {
      navigate("/signin", {replace: true});
    }

    if (role === "STUDENT") {
      navigate("/courses", {replace: true});
    }
  },[]);

  return (
    <div>
      {role === "ADMIN" && <AdminDashboard />}
      {role === "CLIENT" && <ClientDashBoard /> }
    </div>
  );
}
