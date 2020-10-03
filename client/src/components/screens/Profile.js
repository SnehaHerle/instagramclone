//eslint-disable-next-line
import React, {useEffect, useState, useContext} from 'react'
import {UserContext} from '../../App'

const Profile =()=>{

    const [mypics, setPics] = useState([])
    const {state, dispatch} = useContext(UserContext)
    const [image, setImage] = useState("")
    const [url, setUrl] = useState(undefined)

    useEffect(()=>{
        fetch('/mypost', {
            headers: {
                "Authorization": "Bearer "+ localStorage.getItem("jwt")
            }
        })
        .then(res=>res.json())
        .then(result=>{
            //console.log(result)
            setPics(result.mypost)

        })
    },[])

    useEffect(()=>{
        if(image){
            const data = new FormData()
            data.append("file", image)
            data.append("upload_preset","instagram-clone")
            data.append("cloud_name","cloud29sep20")
    
            fetch("https://api.cloudinary.com/v1_1/cloud29sep20/image/upload", {
                method: "post",
                body: data 
            })
            .then(res=>res.json())
            .then(data=>{
                console.log(data)

                fetch('/updatepic', {
                    method: "put",
                    headers: {
                        "Content-Type" : "application/json",
                        "Authorization" : "Bearer " + localStorage.getItem("jwt")
                    },
                    body: JSON.stringify({
                        pic: data.url
                    })
                }).then(res => res.json())
                .then(result => {
                    console.log(result)
                    localStorage.setItem("user", JSON.stringify({...state, pic:data.pic}))
                    dispatch({
                        type: "UPDATEPIC",
                        payload : result.pic
                    })
                })

                //window.location.reload()
            })
            .catch(err=>{
                console.log(err)
            })               
        }
    })

    const updatePhoto = (file) => {
        setImage(file)
    }

    return (
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
                    src={state ? state.pic : "Loading..."}
                    />

                <div className="file-field input-field" style= {{margin: "10px"}}>
                    <div className="btn">
                        <span>Update Picture</span>
                        <input type="file"
                        onChange = {(e) => updatePhoto(e.target.files[0])}
                    />
                    </div>
                        <div className="file-path-wrapper">
                        <input className="file-path validate" type="text"/>
                    </div>
                </div>
                

                </div>
                <div>
                    <h4>
                        {state ? state.name : "Loading..."}
                        
                    </h4>
                    <h5>
                        {state ? state.email : "Loading..."}
                        
                    </h5>
                    <div style ={{display: "flex", 
                    width: "108%",
                    justifyContent: "space-between"}}>
                        <h6>
                            {mypics.length} Posts
                        </h6>
                        <h6>
                        {state ? state.followers.length : "Loading..."} Followers
                        </h6>
                        <h6>
                        {state ? state.following.length : "Loading..."} Following
                        </h6>
                    </div>
                </div>
            </div>

            <div className = "gallery">
                {
                    mypics.map(item=>{
                        return(
                            <img key={item._id} className="item" src= {item.photo} alt={item.title}/>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Profile;


/*
Tasks:
1) Allow user to edit profile data.
2) Allow user to edit their posts.
3) Show user's profile picture in front of posts.
4) Show user's profile picture in front of comments.
*/