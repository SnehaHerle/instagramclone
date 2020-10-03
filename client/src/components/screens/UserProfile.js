//eslint-disable-next-line
import React, {useEffect, useState, useContext} from 'react'
import {UserContext} from '../../App'
import {useParams, userParams} from 'react-router-dom'

const Profile =()=>{

    const [userProfile, setProfile] = useState(null)
    const {state, dispatch} = useContext(UserContext)
    const {userid} = useParams()
    console.log(userid)
    const [showFollow, setShowFollow] = useState(state ? !state.following.includes(userid) : true)

    useEffect(()=>{
        fetch(`/user/${userid}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
        .then(res=>res.json())
        .then(result=>{
            console.log(result)
            setProfile(result)

        })
    },[])

    const followUser = () => {
        fetch('/follow', {
            method: "put",
            headers: {
                "Content-Type" : "application/json",
                "Authorization" : "Bearer " + localStorage.getItem("jwt")
            },
            body : JSON.stringify({
                followId : userid
            })
        }).then(res => res.json())
        .then(data => {
            console.log(data)
            dispatch( {
                type: "UPDATE",
                payload: {
                    following : data.following,
                    followers : data.followers
                }
            })
            localStorage.setItem("user" , JSON.stringify(data))
            setProfile( (prevState) => {
                return {
                    ...prevState,
                    user : {
                        ...prevState.user,
                        followers : [...prevState.user.followers, data._id]
                    }
                }
                
            })
            setShowFollow(false)
        })
    }

    const unfollowUser = () => {
        fetch('/unfollow', {
            method: "put",
            headers: {
                "Content-Type" : "application/json",
                "Authorization" : "Bearer " + localStorage.getItem("jwt")
            },
            body : JSON.stringify({
                unfollowId : userid
            })
        }).then(res => res.json())
        .then(data => {
            console.log(data)
            dispatch( {
                type: "UPDATE",
                payload: {
                    following : data.following,
                    followers : data.followers
                }
            })
            localStorage.setItem("user" , JSON.stringify(data))

            setProfile( (prevState) => {
                const newFollower = prevState.user.followers.filter(item => item != data._id)
                return {
                    ...prevState,
                    user : {
                        ...prevState.user,
                        followers : newFollower
                    }
                }
                
            })
            setShowFollow(true)
        })
    }



    return (
        <>
        {userProfile ? 
        <div style = {{maxWidth: "550px", margin: "0px auto"}}> 
        <div style=
        {{display: "flex",
        justifyContent: "space-evenly",
        margin: "18px 0px",
        paddingBottom: "10px",
        borderBottom: "1px solid grey"
        }}>
            <div>
                <img style={{width: "160px", height: "160px", borderRadius: "80px"}}
                src={userProfile.user.pic}
                />
            </div>
            <div>
                <h4>
                    {userProfile.user.name}
                </h4>
                <h5>
                    {userProfile.user.email}
                </h5>
                <div style ={{display: "flex", 
                width: "108%",
                justifyContent: "space-between"}}>
                    <h6>
                        {userProfile.posts.length} Posts
                    </h6>
                    <h6>
                        {userProfile.user.followers.length} Followers
                    </h6>
                    <h6>
                        {userProfile.user.following.length} Following
                    </h6>
                </div>
                <br></br>
                {showFollow ? 
                <button className="btn waves-effect waves-light"
                onClick = {()=>followUser()}>
                    Follow
                </button>
                :
                <button className="btn waves-effect waves-light"
                onClick = {()=>unfollowUser()}>
                    Unfollow
                </button>
                }
                <br></br>
                <br></br>
            </div>
        </div>

        <div className = "gallery">
            {
                userProfile.posts.map(item=>{
                    return(
                        <img key={item._id} className="item" src= {item.photo} alt={item.title}/>
                    )
                })
            }
        </div>
    </div>
        : <h2>Loading....</h2>}
        </>
    )
}

export default Profile;