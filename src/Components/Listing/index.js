import Sidebar from "../Sidebar"


const Listing = ()=>{
    return(
        <>
        <section className="product_Listing_Page">
            <div className="container">
                <div className="productListing d-flex">
                    <Sidebar/>

                    <div className="content_right">
                        content_right
                    </div>
                </div>
            </div>
        </section>
        </>
    )

}
export default Listing