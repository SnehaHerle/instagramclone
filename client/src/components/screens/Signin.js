import React, {useState, useContext} from 'react'
import M from 'materialize-css'
import {Link, useHistory} from 'react-router-dom'
import {UserContext} from '../../App'

const Signin =()=>{

    const history = useHistory()
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const {state, dispatch} = useContext(UserContext)

    const postData = () => {

        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            return M.toast({html: "Invalid email!",
                classes: "#f44336 red"})
        }
        fetch("/signin", {
            method: "post",
            headers: {
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                email:email,
                password:password
            })
        })
        .then(res=>res.json())
        .then(data=>{
            console.log(data)
            if(data.error){
                M.toast({html: data.error,
                classes: "#f44336 red"})
            }
            else{
                localStorage.setItem("jwt",data.token)
                localStorage.setItem("user", JSON.stringify(data.user))
                dispatch({type: "USER", payload: data.user})
                M.toast({html: "Signed In successfully!",
                classes: "#4caf50 green"})
                history.push('./')
            }
        }).catch(err=>{
            console.log(err)
        })
    }

    return (
        <div className="mycard">
            <div className="card auth-card">
                <h2 className="brand-logo">Instagram</h2>
                <input 
                type="text"
                placeholder="Email"
                value={email}
                onChange = {(e) => setEmail(e.target.value)}
                />
                <input 
                type="password"
                placeholder="Password"
                value={password}
                onChange = {(e) => setPassword(e.target.value)}
                />
                <br></br>
                <br></br>
                <br></br>
                <button className="btn waves-effect waves-light"
                onClick = {()=>postData()}>
                    Sign In
                </button>
                <br></br>
                <h6>
                    Don't have an account?
                    <Link to="/signup" className="signin"> Sign Up</Link>
                </h6>
                <br></br>
                <br></br>
                <br></br>
            </div>
        </div>
    )
}

export default Signin;