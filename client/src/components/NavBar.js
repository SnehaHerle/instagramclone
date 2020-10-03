// eslint-disable-next-line
import React, {useContext} from 'react'
import {Link, useHistory} from 'react-router-dom'
import { UserContext } from '../App'

const NavBar = ()=>{

  const {state, dispatch} = useContext(UserContext)
  const history = useHistory()

  const renderList = () => {
    if(state){
      return [
        <li><Link to="/profile">Profile</Link></li>,
        <li><Link to="/create">Create Post</Link></li>,
        <li><Link to="/myfollowersposts">My Follower's Posts</Link></li>,
        <li>
          <button className="btn #90a4ae blue-grey lighten-2"
                onClick = {()=>{

                  localStorage.clear()
                  dispatch({type:"CLEAR"})
                  history.push('/signin')
                }}>
                  Log Out
                </button>
        </li>
      ]
    }
    else{
      return [
        <li><Link to="/signin">Sign In</Link></li>,
        <li><Link to="/signup">Sign Up</Link></li>
      ]
    }
  }


    return(
    <nav>
    <div className="nav-wrapper teal">
      <Link to= {state ? "/" : "/signin"} className="brand-logo left" style={{paddingLeft: "20px"}}>Instagram</Link>
      <ul id="nav-mobile" className="right">
         {renderList()}
      </ul>
    </div>
  </nav>
    )
}

export default NavBar;