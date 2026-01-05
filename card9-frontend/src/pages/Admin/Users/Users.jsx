import React, { useEffect, useState } from 'react';
import CustomTable from 'src/components/CustomTable';
import adminService from '../../../services/admin.services';

const Users = () => {
  const [usersList, setUsersList] = useState([]);
  const [trigger, setTrigger] = useState(false);

  useEffect(async () => {
    await adminService
      .getAllUsers()
      .then((res) => {
        setUsersList(res.payload);
      })
      .catch((error) => {
        console.log('Error: ', error);
      });
  }, [trigger]);

  return <CustomTable dataList={usersList} trigger={trigger} setTrigger={setTrigger} />;
};

export default Users;
