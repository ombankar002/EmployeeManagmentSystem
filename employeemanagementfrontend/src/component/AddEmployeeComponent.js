import React, { useState, useEffect } from 'react';
import EmployeeService from '../service/EmployeeService';
import { Link, useNavigate, useParams } from 'react-router-dom';

const AddEmployeeComponent = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { id } = useParams();

    const employeeData = { firstName, lastName, email };

    const validate = () => {
        const newErrors = {};
        if (!firstName.trim()) newErrors.firstName = "First Name is required.";
        if (!lastName.trim()) newErrors.lastName = "Last Name is required.";
        if (!email.trim()) {
            newErrors.email = "Email is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "Invalid email format.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const saveEmployee = (e) => {
        e.preventDefault();
        if (!validate()) return;

        if (id) {
            EmployeeService.updateEmployee(id, employeeData)
                .then(() => navigate("/employee"))
                .catch(e => console.log(e));
        } else {
            EmployeeService.saveEmployee(employeeData)
                .then(() => navigate("/employee"))
                .catch(e => console.log(e));
        }
    };

    const title = () => (id ? "Update Employee" : "Add Employee");

    useEffect(() => {
        if (id) {
            EmployeeService.getEmployeeById(id)
                .then(res => {
                    setFirstName(res.data.firstName);
                    setLastName(res.data.lastName);
                    setEmail(res.data.email);
                })
                .catch(e => console.log(e));
        }
    }, [id]);

    return (
        <div>
            <div className='container mt-5'>
                <div className='row'>
                    <div className='card col-md-6 offset-md-3'>
                        <h2 className='text-center'>{title()}</h2>
                        <div className='card-body'>
                            <form>
                                <div className='form-group mb-2'>
                                    <input
                                        className='form-control'
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        type="text"
                                        placeholder='Enter First Name'
                                    />
                                    {errors.firstName && (
                                        <div className="text-danger">{errors.firstName}</div>
                                    )}
                                </div>
                                <div className='form-group mb-2'>
                                    <input
                                        className='form-control'
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        type="text"
                                        placeholder='Enter Last Name'
                                    />
                                    {errors.lastName && (
                                        <div className="text-danger">{errors.lastName}</div>
                                    )}
                                </div>
                                <div className='form-group mb-2'>
                                    <input
                                        className='form-control'
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        type="email"
                                        placeholder='Enter Email'
                                    />
                                    {errors.email && (
                                        <div className="text-danger">{errors.email}</div>
                                    )}
                                </div>
                                <button onClick={saveEmployee} className='btn btn-success'>Save</button>{" "}
                                <Link to={"/employee"} className='btn btn-danger'>Cancel</Link>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddEmployeeComponent;
