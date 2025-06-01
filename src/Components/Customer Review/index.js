
import Rating from '@mui/material/Rating';
const CustomerReview =()=>{
    // Dữ liệu đánh giá mẫu
    const reviewStats = {
        totalReviews: 5,
        averageRating: 4.8,
        ratings: [
            { star: 5, percentage: 75, count: 15 },
            { star: 4, percentage: 50, count: 10 },
            { star: 3, percentage: 55, count: 11 },
            { star: 2, percentage: 35, count: 7 },
            { star: 1, percentage: 25, count: 5 }
        ]
    };
    return(
        <>
          {/* Phần Customer Reviews mới */}
                                <div className="col-md-4">
                                    <div className="customerReviews">
                                        <h3>Customer reviews</h3>
                                        
                                        {/* Tổng quan đánh giá */}
                                        <div className="reviewSummary d-flex align-items-center mb-3">
                                            <div className="d-flex align-items-center">
                                                <Rating 
                                                    name="overall-rating" 
                                                    value={reviewStats.averageRating} 
                                                    precision={0.1} 
                                                    readOnly 
                                                    size="small"
                                                />
                                                <span className="ml-2 font-weight-bold">
                                                    {reviewStats.averageRating} out of {reviewStats.totalReviews}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Biểu đồ đánh giá */}
                                        <div className="ratingBars">
                                            {reviewStats.ratings.map((rating, index) => (
                                                <div key={index} className="progressBarBox d-flex align-items-center">
                                                    <div className="ratingLabel">
                                                        <span className="font-weight-bold">{rating.star}</span>
                                                        <br/>
                                                        <small className="text-muted">star</small>
                                                    </div>
                                                    
                                                    <div className="ratingBar flex-grow-1 mx-3">
                                                        <div className="progress">
                                                            <div 
                                                                className="progress-bar bg-success" 
                                                                style={{width: `${rating.percentage}%`}}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="ratingPercentage">
                                                        <span className="font-weight-bold text-success">
                                                            {rating.percentage}%
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
        </>
    )
}
export default CustomerReview