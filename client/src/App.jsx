import './App.css'
import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ALL_USERS } from './query/users';
import { useEffect } from 'react';
import { CREATE_USER } from './mutations/users';

function App() {
  const {data, loading, error, refetch} = useQuery(GET_ALL_USERS, {
    pollInterval: 2500
  });
  const [users, setUsers] = useState([]);
  const [createUserRequest] = useMutation(CREATE_USER); 

  const [userData, setUserData] = useState({
    username: "",
    age: 0
  });

  useEffect(() => {
    if (!loading) {
      setUsers(data.getAllUsers);
    }
  }, [data]);

  const createUser = (e) => {
    e.preventDefault();

    createUserRequest({
      variables: {
        input: userData
      }
    }).then(({data}) => {
      console.log(data);
      setUserData({username: "", age: 0})
    })
  }

  const getAllUsers = (e) => {
    e.preventDefault();
    refetch();
  }

  if (loading) {
    return (
      <h1>Loading...</h1>
    )
  }

  return (
    <div className='wrapper'>
      <form className='form'>
        <h3>Create user</h3>
        <input 
          value={userData.username} 
          onChange={(e) => setUserData(prev => ({...prev, username: e.target.value}))} 
          type="text" 
          placeholder='Enter name'
        />
        <input 
          value={userData.age} 
          onChange={(e) => setUserData(prev => ({...prev, age: parseInt(e.target.value)}))} 
          type="number" 
          placeholder='Enter age'
        />
        <div className="btns">
          <button onClick={(e) => createUser(e)}>Create user</button>
          <button onClick={(e) => getAllUsers(e)}>Get all users</button>
        </div>
      </form>
      <div className="users">
        {users.map((user) => {
          return (
            <div className="user" key={user.id}>
              <div><span>ID: </span><span>{user.id}</span></div>
              <div><span>Name: </span><span>{user.username}</span></div>
              <div><span>Age: </span><span>{user.age}</span></div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default App
