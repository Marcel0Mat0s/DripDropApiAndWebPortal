import { useState } from "react"

export default function CreateUser(){

    const [inputs, setInputs] = useState({})

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}));
    }
    const handleSubmit = (event) => {
        event.preventDefault()

        console.log(inputs);
    }
    return(
        <div>  
            <h1>Create User</h1>
            <form onSubmit={handleSubmit}>
                <table cellSpacing="10">
                    <tbody>
                        <tr>
                            <th>
                                <label>Name: </label>
                            </th>
                            <td>
                                <input type="text" name="name" onChange={handleChange}/>
                            </td>
                        </tr>

                        <tr>
                            <th>
                                <label>Email: </label>
                            </th>
                            <td>
                                <input type="text" name="email" onChange={handleChange}/>
                            </td>
                        </tr>

                        <tr>
                            <th>
                                <label>Password: </label>
                            </th>
                            <td>
                                <input type="text" name="password" onChange={handleChange}/>
                            </td>
                        </tr>

                        <tr>
                            <td colSpan="2" align="right">
                                <button>Save</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
    )
}