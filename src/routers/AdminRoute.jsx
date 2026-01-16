/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import { AdminNavigation, AdminSideBar } from '@/components/common';
import { ADMIN_OTP_VERIFY } from '@/constants/routes';
import PropType from 'prop-types';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';

const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:3001";

// Check if admin verification is valid
const checkAdminVerification = async (adminId) => {
  // First check localStorage
  const storedVerification = localStorage.getItem('adminVerification');
  if (storedVerification) {
    try {
      const verification = JSON.parse(storedVerification);
      if (verification.verified && verification.expiresAt > Date.now()) {
        return true;
      }
      // Clear expired verification
      localStorage.removeItem('adminVerification');
    } catch (e) {
      localStorage.removeItem('adminVerification');
    }
  }

  // Then check with backend
  try {
    const response = await fetch(
      `${BACKEND_API_URL}/api/admin/verification-status/${adminId}`
    );
    const data = await response.json();
    
    if (data.verified) {
      localStorage.setItem('adminVerification', JSON.stringify({
        verified: true,
        expiresAt: data.expiresAt
      }));
      return true;
    }
  } catch (err) {
    console.error('Failed to check admin verification:', err);
  }

  return false;
};

const AdminRouteInner = ({
  isAuth, role, authId, component: Component, ...rest
}) => {
  const [isVerified, setIsVerified] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const verify = async () => {
      if (isAuth && role === 'ADMIN' && authId) {
        const verified = await checkAdminVerification(authId);
        setIsVerified(verified);
      } else {
        setIsVerified(false);
      }
      setChecking(false);
    };

    verify();
  }, [isAuth, role, authId]);

  // Show loading while checking
  if (checking) {
    return (
      <Route
        {...rest}
        component={() => (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh',
            fontSize: '18px',
            color: '#6b7280'
          }}>
            Checking verification...
          </div>
        )}
      />
    );
  }

  return (
    <Route
      {...rest}
      component={(props) => {
        if (!isAuth || role !== 'ADMIN') {
          return <Redirect to="/" />;
        }

        if (!isVerified) {
          return <Redirect to={ADMIN_OTP_VERIFY} />;
        }

        return (
          <>
            <AdminNavigation />
            <main className="content-admin">
              <AdminSideBar />
              <div className="content-admin-wrapper">
                <Component {...props} />
              </div>
            </main>
          </>
        );
      }}
    />
  );
};

const mapStateToProps = ({ auth }) => ({
  isAuth: !!auth,
  role: auth?.role || '',
  authId: auth?.id || null
});

AdminRouteInner.defaultProps = {
  isAuth: false,
  role: 'USER',
  authId: null
};

AdminRouteInner.propTypes = {
  isAuth: PropType.bool,
  role: PropType.string,
  authId: PropType.string,
  component: PropType.func.isRequired,
  // eslint-disable-next-line react/require-default-props
  rest: PropType.any
};

export default connect(mapStateToProps)(AdminRouteInner);
