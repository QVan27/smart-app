import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const RoleProtectedRoute = ({ allowedRoles, children }) => {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch('https://smart-api.hop.sh/api/user', {
          headers: {
            'x-access-token': localStorage.getItem('accessToken')
          }
        });

        if (response.ok) {
          const user = await response.json();

          setUserInfo(user);
        } else {
          console.log('Failed to fetch user information.');
        }
      } catch (error) {
        console.error('Error fetching user information:', error);
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    const hasRole = (roles, requiredRoles) => {
      return requiredRoles.some((requiredRole) => roles.includes(requiredRole));
    };

    const checkUserRole = () => {
      if (userInfo && userInfo.roles) {
        const userRoles = userInfo.roles;

        console.log('userRoles:', userRoles);

        if (!hasRole(userRoles, allowedRoles)) {
          router.push('/unauthorized');
        }
      }
    };

    checkUserRole();
  }, [allowedRoles, router, userInfo]);

  return <>{children}</>;
};

export default RoleProtectedRoute;