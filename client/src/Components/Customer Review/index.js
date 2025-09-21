
import Rating from '@mui/material/Rating';
import { use, useEffect,useState } from 'react';
import { toast } from "react-toastify";
const CustomerReview =({productId})=>{
    //State cho review va thong ke
    const [reviews,setReviews] = useState([])
    const [stats,setStats] = useState({
        totalReviews:0,
        averageRating:0,
        ratings:(0,0,0,0,0)
    })
    //State cho form 
    const [name,setName] = useState("")
    const [comment,setComment]= useState("")
    const [rating,setRating] = useState(0)
    //Lay review khi co productId 
    useEffect(()=>{
        if(!productId) return 
        fetch(`${process.env.REACT_APP_API_URL}/api/reviews/${productId}`)
            .then(res => res.json())
            .then(data =>{
                if(Array.isArray(data)){
                    setReviews(data)
                    //Tinh toan thong ke 
                    const total = data.length
                    const sum = data.reduce((acc,r)=> acc+ r.rating,0)
                    const avg = total ? (sum / total).toFixed(1) : 0
                    const ratingCounts = [5,4,3,2,1].map(star => data.filter(r=>r.rating === star).length)
                    setStats({
                        totalReviews: total,
                        averageRating: avg,
                        ratings: ratingCounts
                    })
                }
            })
    },[productId])
    // Ham gui review
    const handleSubmitReview = async (e) => {
        e.preventDefault();
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/reviews`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                product: productId,
                name,
                comment,
                rating
            })
        });
        const data = await res.json();
        if (data.message) {
            toast.success("Thank you for your review! It will be shown after admin approval.");
            setName(""); setComment(""); setRating(0);
        } else {
            toast.error("Error submitting review!");
        }
    };
    return(
        <div className='customerReviews'>
            <h3>Customer Reviews</h3>
            {/* Tong quan */}
            <div className='reviewSummary d-flex align-items-center mb-3'>
                <Rating
                name="overall-rating"
                value={Number(stats.averageRating)}
                precision={0.1}
                readOnly
                size="small"
                />
                <span className='ml-2 font-weight-bold'>
                    {stats.averageRating} / 5 ({stats.totalReviews} reviews)
                </span>
            </div>
            {/* Bieu do so sao */}
            <div className='ratingBars'>
                {[5,4,3,2,1].map((star,idx)=>{
                    const count = stats.ratings[idx]
                    const percent = stats.totalReviews ? Math.round((count / stats.totalReviews)* 100) : 0
                    return(
                        <div key={star} className='progressBarBox d-flex align-items-center'>
                            <div className="ratingLabel">
                                <span className='font-weight-bold'>{star}</span>
                                <br/>
                                <small className='text-muted'>star</small>
                            </div>
                            <div className='ratingBar flex-grow-1 mx-3'>
                                <div className='progress'>
                                    <div className='progress-bar bg-success' style={{width:`${percent}%`}}></div>
                                </div>
                            </div>
                            <div className="ratingPercentage">
                            <span className="font-weight-bold text-success">
                            {percent}%
                            </span>
                        </div>
                        </div>
                    )
                })}
            </div>
            {/* Danh sach review */}
            <div className='reviewList mt-4'>
                <h5>All reviews</h5>
                {reviews.length ===0 ? (
                    <p>No reviews yet.</p>
                ):(
                    reviews.map(r => (
                        <div key={r._id} className="review-item mb-3">
                          <div className="d-flex align-items-center">
                            <b>{r.name}</b>
                            <Rating value={r.rating} readOnly size="small" className="ml-2" />
                            <span className="ml-2 text-muted" style={{ fontSize: 12 }}>
                              {new Date(r.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <div>{r.comment}</div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
export default CustomerReview