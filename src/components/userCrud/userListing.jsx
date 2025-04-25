  import TableCell from '@mui/material/TableCell';
  import TableRow from '@mui/material/TableRow';

  export default function UserListing ({users, handleDelete}){
      return ( 
          <>
          {console.log('listing users',users)}
          {users.map((user) => (
              <TableRow key={user.id} >
                <TableCell component="th" scope="user">{user.id}</TableCell>
                <TableCell align="right">{user.name}</TableCell>
                <TableCell align="right">{user.email}</TableCell>
                <TableCell align="right">{user.phoneNumber}</TableCell>
                <TableCell align="right">{user.address}</TableCell>
                <TableCell align="right" >
                  <i onClick={() => handleDelete(user.id)} style={{color:"red", fontSize:"20px", cursor:"pointer"}} className="fa fa-trash-o" aria-hidden="true"></i>
                  <i style={{ marginLeft:"5px",color:"green", fontSize:"20px", cursor:"pointer"}} className="fa  fa-pencil-square-o" aria-hidden="true"></i>
                </TableCell>
              </TableRow>
            ))}
            </>
      );
  }