import React from 'react';
import RegisterForm from '../../components/forms/auth/RegisterForm';
import { useNavigate } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate()
  const handleRegisterSuccess = ()=>{
    navigate("/auth/login")
  }
  return (
    <div className='w-full'>
        <RegisterForm onRegisterSuccess={handleRegisterSuccess} />
    </div>
  );
};

export default RegisterPage;
