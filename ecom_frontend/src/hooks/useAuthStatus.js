import { useSelector } from 'react-redux';

export const useAuthStatus = () => {
  const { user } = useSelector(state => state.auth);
  const roles = user?.roles || [];

  const isAdmin = roles.includes("ROLE_ADMIN");
  const isSeller = roles.includes("ROLE_SELLER") && !isAdmin; 
  const isUser = roles.includes("ROLE_USER") && !roles.includes("ROLE_ADMIN") && !roles.includes("ROLE_SELLER") 

  return { isAdmin, isSeller, user, isUser }; 
};