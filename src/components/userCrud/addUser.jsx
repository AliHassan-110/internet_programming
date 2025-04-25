import { Button, TextField } from "@mui/material";
// import { FormControl } from '@mui/material';
import '../../styles/myStyles.css';
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
export default function AddUser(props) {

  const [formData, setformData] = useState({});
  const navigate = useNavigate()  

  const handleInputChange = (event) => {
        let name=event.target.name
        let value = event.target.value
        console.log('name = '+name);
        
        setformData((pre) => ({ ...pre, [name]: value }));
        
       
        // setformData((pre) => ({ ...pre, [name]: value }));
        // name='id';
        // value = 7;
         console.log(formData);
  };


  const handleSubmit = () => {
    if(formData === undefined){
      return alert('Please Enter All Fields');
    }else if(formData.name === undefined || formData.name === ''){
      return alert('Name is Required');
    }else if(formData.email === undefined || formData.email === '' ){
      return alert('Email is Required');
    }else if(formData.phoneNumber === undefined || formData.phoneNumber === '' ){
      return alert('Phone Number is Required');
    }else if(formData.address === undefined || formData.address === '' ){
      return alert('Address is Required');
    }
    setformData([formData, {'id': '6'} ]);
    console.log(formData);
    props.setUsers([...props.users,formData]);      
      navigate('/');  
      // return alert('User Added Successfully. Click OK to view user Listing');;
  };
  
  return (
    <>
      <div className="add-user">
          <TextField
            label="Name"
            type="text"
            variant="outlined"
            placeholder="Enter Name"
            onChange={handleInputChange}
            name="name"
          />
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            placeholder="assad.tawakal@gmail.com"
            onChange={handleInputChange}
            name="email"

          />

          <TextField
            label="Phone Number"
            type="string"
            variant="outlined"
            placeholder="+923334665164"
            onChange={handleInputChange}
            name="phoneNumber"
            style={{backgroundColor:"#e8f0fe00"}}
          />
          <TextField
            label="Address"
            type="text"
            variant="outlined"
            placeholder="Enter Address"
            onChange={handleInputChange}
            name="address"
          />
          <Button  variant="contained" color="success" size="large" onClick={handleSubmit}>Submit</Button>
      </div>
    </>
  );
}
