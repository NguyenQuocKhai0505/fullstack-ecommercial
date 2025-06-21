


const  UserAvatarImgComponent = (props) =>{
    return(
        <div className={`userImg ${props.lg ===true ?"lg":""} me-2 `}>
            <span className="rounded-circle overflow-hidden">
            <img src={props.img} alt="User" className="avatar-img" />
            </span>
        </div>
    )
}
export default UserAvatarImgComponent