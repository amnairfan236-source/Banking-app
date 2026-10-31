// Get all users from localStorage
export const getUsers = () => {
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : [];
};

// Save a new user to localStorage (supports both saveUser and saveUsers)
export const saveUser = (user) => {
  const users = getUsers();
  users.push(user);
  localStorage.setItem('users', JSON.stringify(users));
};

export const saveUsers = saveUser;

// Get currently logged-in user
export const getCurrentUser = () => {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};

// Set currently logged-in user
export const setCurrentUser = (user) => {
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  } else {
    localStorage.removeItem('currentUser');
  }
};

// Remove currently logged-in user (Logout)
export const removeCurrentUser = () => {
  localStorage.removeItem('currentUser');
};