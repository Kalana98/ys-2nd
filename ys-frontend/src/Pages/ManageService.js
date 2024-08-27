import React, { useEffect, useState } from 'react'
import './ManageService.css'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'
import {Form, Button, Row, Col, Table} from 'react-bootstrap'

const ManageService = () => {

    const [services, setServices] = useState([]); // for the list
    const [selectedServices, setSelectedServices] = useState(null); //for update user
    //for the form
    const [faciID, setFaciID] = useState(selectedServices?.facilityID || "");
    const [faciTitle, setFaciTitle] = useState(selectedServices?.facilityTitle || "");
    const [faciDes, setFaciDes] = useState(selectedServices?.facilityDescription || "");
    const [charCount, setCharCount] = useState(0);

    const selectFacility = (facility) => {
        setSelectedServices(facility);
    }

    useEffect(() => {
        setFaciID(selectedServices?.facilityID || "");
        setFaciTitle(selectedServices?.facilityTitle || "");
        setFaciDes(selectedServices?.facilityDescription || "");
        setCharCount(selectedServices?.facilityDescription.length || 0);
    }, [selectedServices]);

    const clearFields = () => {
        setFaciID("");
        setFaciTitle("");
        setFaciDes("");
        setCharCount(0);
    }

    const validateFields = () => {
        if(!faciID.trim() || !faciTitle.trim() || !faciDes.trim()){
            alert("You should fill this all fields");
            return false;
        }else{
            return true;
        }
    }

    const fetchAllFacilities = async () => {
        try{
            const response = await axios.get('http://localhost:8080/api/v1/facilities/getAllFacilities');
            setServices(response.data)
        }catch(error){
            console.error("Error Fetching data", error);
        }
    }

    useEffect(() => {
        fetchAllFacilities();
    }, []);

    const saveFacility = async () => {
        try{
            if(!validateFields()) return
            const response = await axios.post('http://localhost:8080/api/v1/facilities/saveFacility', {
                facilityID : faciID,
                facilityTitle : faciTitle,
                facilityDescription : faciDes
            });
            alert(response.data);
            fetchAllFacilities();
            clearFields();
        }catch(error){
            console.error(error);
        }
    }

    const updateFacility = async () => {
        try{
            if(!validateFields) return
            const response = await axios.put('http://localhost:8080/api/v1/facilities/updateFacility', {
                facilityID : faciID,
                facilityTitle : faciTitle,
                facilityDescription : faciDes
            });
            alert(response.data);
            fetchAllFacilities();
            clearFields();
        }catch(error){
            console.log(error);
        }
    }

    const deleteFacility = async () => {
        try{
            const response = await axios.delete(`http://localhost:8080/api/v1/facilities/deleteFacility/${faciID}`);
            alert(response.data);
            fetchAllFacilities();
            clearFields();
        }catch(error){

        }
    }

    const handleDescriptionChange = (e) => {
        setFaciDes(e.target.value);
        setCharCount(e.target.value.length); // Update character counter
    }


  return (
    <div className='manage-service-section'>
      <h1>hi</h1>
        

      <Form className='mt-5'>
            <Row className='justify-content-center'>
                <Col xs={12} md={6}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Facility ID</Form.Label>
                        <Form.Control type="text" placeholder="Auto Generated ID" value={faciID} onChange={(e) => setFaciID(e.target.value)} />
                    </Form.Group>
                </Col>
            </Row>

            <Row className='justify-content-center'>
                <Col xs={12} md={6}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Facility Title</Form.Label>
                        <Form.Control type="text" placeholder="Enter your name here" value={faciTitle} onChange={(e) => setFaciTitle(e.target.value)}/>
                    </Form.Group>
                </Col>
            </Row>

            <Row className='justify-content-center'>
                <Col xs={12} md={6}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Facility Description</Form.Label>
                        <Form.Control type="text" placeholder="Enter your email here" maxLength={255} value={faciDes} onChange={handleDescriptionChange}/>
                        <div className="char-counter">{charCount}/255 characters</div> {/* Character counter */}
                    </Form.Group>
                </Col>
            </Row>

            

            <Button variant="primary" onClick={saveFacility}>Save</Button>{' '}
            <Button variant="secondary" onClick={updateFacility}>Update</Button>{' '}
            <Button variant="success" onClick={deleteFacility}>Delete</Button>{' '}
        </Form>    

        <Table className="service-table">
            <thead>
                <tr>
                    <th>Facility ID</th>
                    <th>Facility Title</th>
                    <th>Faciltiy Description</th>
                </tr>
            </thead>
            <tbody>
            {services.map(sf => (
                    <tr key={sf.facilityID} onClick={() => selectFacility(sf)}>
                        <td>{sf.facilityID}</td>
                        <td>{sf.facilityTitle}</td>
                        <td>{sf.facilityDescription}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
        
    </div>
  )
}

export default ManageService
