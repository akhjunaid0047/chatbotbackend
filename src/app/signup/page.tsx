'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import email_icon from '../assets/email.png';
import password_icon from '../assets/password.png';
import eye_open from '../assets/watch.png';
import eye_close from '../assets/closed-eyes.png';

const Signup: React.FC = () => {
  const router = useRouter();
  const auth = useAuth();

  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string } | null>(null);
  const [visible, setVisible] = useState(false);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!values.name) newErrors.name = "Name is required.";
    if (!values.email) newErrors.email = "Email is required.";
    if (!values.password) newErrors.password = "Password is required.";
    if (values.password !== values.confirmPassword) newErrors.confirmPassword = "Passwords do not match.";
    setErrors(Object.keys(newErrors).length ? newErrors : null);
    return !Object.keys(newErrors).length;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      toast.loading("Signing Up", { id: "signup" });
      await auth?.signup(values.name, values.email, values.password);
      toast.success("Signed Up Successfully", { id: "signup" });
      router.push("/chat");
    } catch  {
      toast.error("Signing Up Failed", { id: "signup" });
    }
  };

  useEffect(() => {
    if (auth?.user) {
      router.push("/chat");
    }
  }, [auth?.user, router]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.body.style.margin = '0';
    return () => {
      document.body.style.overflow = '';
      document.body.style.margin = '';
    };
  }, []);

  // --- Your styles here (keep your existing inline style objects) ---

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#000000',
      padding: '20px',
      boxSizing: 'border-box',
    }}>
      <form onSubmit={handleSubmit} style={{
        background: '#000000',
        padding: '40px',
        width: '100%',
        maxWidth: '500px',
        borderRadius: '20px',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.9)',
        transition: 'all 0.3s ease',
      }} autoComplete="off">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '5px',
          width: '100%',
          marginBottom: '0',
        }}>
          <div style={{
            color: '#FFFFFF',
            fontSize: '2.5rem',
            fontWeight: '700',
            fontFamily: 'Roboto, sans-serif',
            margin: 0,
            textDecoration: 'none',
          }}>
            Sign Up
          </div>
          <div style={{ width: '100%', height: '1px', backgroundColor: '#FFFFFF', margin: '10px 0' }} />
        </div>

        <div style={{
          marginTop: '30px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          width: '100%',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            borderRadius: '6px',
            padding: '12px',
            backgroundColor: '#1C1C1C',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
          }}>
            <Image src={email_icon} alt="Name Icon" width={26} height={26} />
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={values.name}
              onChange={handleInput}
              style={{
                height: '2.8rem',
                width: '100%',
                background: 'transparent',
                border: '1px solid #333333',
                outline: 'none',
                color: '#E0E0E0',
                fontSize: '1.1rem',
                borderRadius: '4px',
                padding: '0 10px',
                transition: 'border-color 0.3s ease',
              }}
              autoComplete="off"
            />
          </div>
          {errors?.name && <span style={{ color: '#CF6679', fontSize: '12px', marginTop: '5px' }}>{errors.name}</span>}

          <div style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            borderRadius: '6px',
            padding: '12px',
            backgroundColor: '#1C1C1C',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
          }}>
            <Image src={email_icon} alt="Email Icon" width={26} height={26} />
            <input
              type="email"
              name="email"
              placeholder="Email Id"
              value={values.email}
              onChange={handleInput}
              style={{
                height: '2.8rem',
                width: '100%',
                background: 'transparent',
                border: '1px solid #333333',
                outline: 'none',
                color: '#E0E0E0',
                fontSize: '1.1rem',
                borderRadius: '4px',
                padding: '0 10px',
                transition: 'border-color 0.3s ease',
              }}
              autoComplete="off"
            />
          </div>
          {errors?.email && <span style={{ color: '#CF6679', fontSize: '12px', marginTop: '5px' }}>{errors.email}</span>}

          <div style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            borderRadius: '6px',
            padding: '12px',
            backgroundColor: '#1C1C1C',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
          }}>
            <Image src={password_icon} alt="Password Icon" width={26} height={26} />
            <input
              type={visible ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={values.password}
              onChange={handleInput}
              style={{
                height: '2.8rem',
                width: '100%',
                background: 'transparent',
                border: '1px solid #333333',
                outline: 'none',
                color: '#E0E0E0',
                fontSize: '1.1rem',
                borderRadius: '4px',
                padding: '0 10px',
                transition: 'border-color 0.3s ease',
              }}
              autoComplete="off"
            />
            <div
              onClick={() => setVisible(!visible)}
              style={{ cursor: 'pointer', marginLeft: '12px' }}
            >
              <Image src={visible ? eye_open : eye_close} alt="Password Visibility" width={26} height={26} />
            </div>
          </div>
          {errors?.password && <span style={{ color: '#CF6679', fontSize: '12px', marginTop: '5px' }}>{errors.password}</span>}

          <div style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            borderRadius: '6px',
            padding: '12px',
            backgroundColor: '#1C1C1C',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
          }}>
            <Image src={password_icon} alt="Confirm Password Icon" width={26} height={26} />
            <input
              type={visible ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={values.confirmPassword}
              onChange={handleInput}
              style={{
                height: '2.8rem',
                width: '100%',
                background: 'transparent',
                border: '1px solid #333333',
                outline: 'none',
                color: '#E0E0E0',
                fontSize: '1.1rem',
                borderRadius: '4px',
                padding: '0 10px',
                transition: 'border-color 0.3s ease',
              }}
              autoComplete="off"
            />
          </div>
          {errors?.confirmPassword && <span style={{ color: '#CF6679', fontSize: '12px', marginTop: '5px' }}>{errors.confirmPassword}</span>}
        </div>

        <div style={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          width: '100%',
          margin: '50px auto',
        }}>
          <button
            type="submit"
            style={{
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '15px 30px',
              background: '#333333',
              color: '#FFFFFF',
              borderRadius: '50px',
              fontSize: '1.5rem',
              textAlign: 'center',
              width: '70%',
              height: '55px',
              border: 'none',
              transition: 'background-color 0.3s ease, transform 0.2s ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = '#444444')}
            onMouseOut={(e) => (e.currentTarget.style.background = '#333333')}
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
