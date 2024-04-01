import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Form, Input, Label } from 'reactstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function UpdateUserDetails({ id, handleUpdate }) {
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [clickedCell, setClickedCell] = useState(null); // State to keep track of clicked cell

  const toggle = () => setModal(!modal);

  const columnNames = [
  'Employee ID',
  'Employee Name',
  'Band',
  'Employee Type',
  'OBU',
  'OBU Description',
  'Customer ID',
  'Customer Name',
  'Project ID',
  'Project Description',
  'Program Description',
  'Program Manager',
  'Contract Category',
  'Project Manager ID',
  'Project Manager Name',
  'Project Start Date',
  'Project End Date',
  'Country',
  'Location',
  'Location Descr',
  'JobCode',
  'JobCode Descr',
  'Allocation %tage',
  'Resource Type',
  'Manager ID',
  'Manager Name',
  'Hire Date',
  'UST Experience',
  'Employee Status',
  'Department ID',
  'Department Descr',
  '1st Manager',
  'Category',
  'Primary Skill',
  'Skill Category for Primary Skill',
  'Skill Level for Primary Skill',
];

  useEffect(() => {
    if (modal && id) {
      fetchData(id);
    }
  }, [modal, id]);

  const fetchData = async (employeeId) => {
    try {
      const response = await axios.get(`http://localhost:3004/fetchEmpByID/${employeeId}`);
      console.log('Response:', response.data); // Add logging here
      if (response.status === 200) {
        setFormData(response.data[0]);
        setIsLoading(false);
      } else {
        console.error('Error fetching data');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formDataWithoutId = { ...formData };
    delete formDataWithoutId._id;
  
    try {
      const updateResponse = await axios.put(`http://localhost:3004/updaterecord/${formData['Employee ID']}`, formDataWithoutId);
      if (updateResponse.status === 200) {
        alert("Updated successfully");
        fetchData(id); // Fetch updated data
        toggle(); // Close modal after submission
      } else {
        console.error('Error updating the data');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCellClick = (columnName) => {
    setClickedCell(columnName); // Set the clicked cell
  };

  return (
    <div>
      <Button style={{ background: "#0A6E7C" }}  onClick={toggle}>
        Update
      </Button>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Update Details</ModalHeader>
        <ModalBody>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <Form onSubmit={handleSubmit}>
              {columnNames.map((columnName) => (
                <FormGroup key={columnName}>
                  <Label for={columnName}>{columnName}</Label>
                  <Input
                    id={columnName}
                    name={columnName}
                    placeholder={columnName}
                    type="text"
                    value={formData[columnName] || ''}
                    onChange={handleChange}
                    style={{ flex: clickedCell === columnName ? 2 : 1 }} // Conditionally set flex value
                    onClick={() => handleCellClick(columnName)} // Handle cell click
                  />
                </FormGroup>
              ))}
              <Button type="submit" color="primary">
                Update
              </Button>
            </Form>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default UpdateUserDetails;
