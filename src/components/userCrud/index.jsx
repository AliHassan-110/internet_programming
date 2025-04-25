import * as React from 'react';
import '../../styles/myStyles.css';
import { Button } from '@mui/material';
import Table from '@mui/material/Table';
import UserListing from './userListing';
import Paper from '@mui/material/Paper';
import TableRow from '@mui/material/TableRow';
import 'font-awesome/css/font-awesome.min.css'; 
// import { useNavigate } from 'react-router-dom';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableContainer from '@mui/material/TableContainer';
// import { Input, InputLabel, TextField } from '@mui/material';
import {Link}  from 'react-router-dom' 


 // useState, useEffectl
export default function ListingTable(props) {
  

  
  // const navigate = useNavigate()
  // const loadAddUserComponent = () => {
  //   navigate('/add-user');
  // }

  // React.useEffect(() => {
  // });
  const handleDelete = (userId) => {
    const updatedUsers = props.users.filter(user => user.id !== userId)
    props.setUsers(updatedUsers);
  }

  return (
    <>  
      <div className="table-div">
        {/* <Button onClick={loadAddUserComponent} variant="contained" color="success" size="large" style={{margin:"10px 10px 10px 0px",}}>Add User<i style={{marginLeft:"14px"}} className="fa fa-plus"></i> </Button> */}
        <Link to="/add-user" ><Button variant="contained" color="success" size="large" style={{margin:"10px 10px 10px 0px",}}>Add User<i style={{marginLeft:"14px"}} className="fa fa-plus"></i> </Button></Link>
        <TableContainer sx={{ width: 1000 }} component={Paper}>
          <Table  aria-label="simple table">
            <TableHead className='table-head'>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell align="right">Name</TableCell>
                <TableCell align="right">Email</TableCell>
                <TableCell align="right">Phone Number</TableCell>
                <TableCell align="right">Address</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className='table-body'>
              <UserListing users={props.users} handleDelete={handleDelete}/>
              {/* <UserListing users={users.filter((user)=>user.name.toLowerCase().includes('bilal'))}  /> */}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
}