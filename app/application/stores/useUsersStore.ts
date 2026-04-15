export const useUsers = () => {
  const users = useState('users', () => [
    { id: 1, name: 'Admin Utama', email: 'admin@surau.com', role: 'Administrator', status: 'Active' },
    { id: 2, name: 'Budi Santoso', email: 'budi@surau.com', role: 'Staff', status: 'Active' },
    { id: 3, name: 'Siti Aminah', email: 'siti@surau.com', role: 'Staff', status: 'Inactive' },
  ]);

  const getUsers = () => {
    return users.value;
  };

  const getUserById = (id: number) => {
    return users.value.find(u => u.id === id);
  };

  const addUser = (user: any) => {
    const newId = users.value.length > 0 ? Math.max(...users.value.map(u => u.id)) + 1 : 1;
    users.value.push({ ...user, id: newId });
  };

  const updateUser = (id: number, updatedUser: any) => {
    const index = users.value.findIndex(u => u.id === id);
    if (index !== -1) {
      users.value[index] = { ...users.value[index], ...updatedUser };
    }
  };

  const deleteUser = (id: number) => {
    users.value = users.value.filter(u => u.id !== id);
  };

  return {
    users,
    getUsers,
    getUserById,
    addUser,
    updateUser,
    deleteUser
  };
};
