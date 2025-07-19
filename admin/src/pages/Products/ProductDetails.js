import React, { useState, useRef } from 'react';
import Chip from "@mui/material/Chip";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { emphasize, styled } from "@mui/material/styles";
import { IoHomeSharp } from "react-icons/io5";
import { MdExpandMore } from "react-icons/md";
import Slider from "react-slick";
// Import CSS cho slick carousel
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { TbBrandCodesandbox } from "react-icons/tb";
import { BiCategory } from "react-icons/bi";
import { IoPricetagsOutline } from "react-icons/io5";
import { PiResizeDuotone } from "react-icons/pi";
import { MdOutlinePriceChange } from "react-icons/md";
import { AiOutlineStock } from "react-icons/ai";
import { MdOutlineReviews } from "react-icons/md";
import { MdPublishedWithChanges } from "react-icons/md";
import { IoColorPaletteOutline } from "react-icons/io5";
import UserAvatarImgComponent from '../../components/userAvatarImg';
import Admin from "../../assets/images/admin.png"
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import { FaReplyAll } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { fetchDataFromApi } from "../../utils/api"; 
// Breadcrumb styled component
const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor = 
    theme.palette.mode === "light"
      ? theme.palette.grey[100]
      : theme.palette.grey[800];

  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    '&:hover, &:focus': {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    '&:active': {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
});

const ProductDetails = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const mainSliderRef = useRef(null);
    const thumbSliderRef = useRef(null);
    const {id} = useParams();
    const [productInformation, setProductInformation] = useState(null);

    useEffect(() => {
        fetchDataFromApi(`/api/products/${id}`).then((res)=>{
            setProductInformation(res.data || res)
            // console.log(res.data)
            // console.log(res)
        }).catch((error)=>{
            console.error('Error fetching product details:', error);
        })
    }, [id])
    // Slider chính
    const productSliderOptions = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        autoplay: false,
        beforeChange: (current, next) => setCurrentSlide(next),
        ref: mainSliderRef
    };
    
    // Slider thumbnail
    const productSliderSmlOptions = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        arrows: false,
        centerMode: false,
        focusOnSelect: true,
        ref: thumbSliderRef,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            }
        ]
    };

    // Hàm xử lý click thumbnail
    const handleThumbnailClick = (index) => {
        setCurrentSlide(index);
        if (mainSliderRef.current) {
            mainSliderRef.current.slickGoTo(index);
        }
    };

    // Component ProductInfoRow để tái sử dụng
    const ProductInfoRow = ({ icon, label, value, isCategory = false }) => (
        <div className="row mb-2">
            <div className="col-sm-5 d-flex align-items-center">
                <span className="icon">
                    {icon}
                </span>
                <span className="name">{label}</span>
            </div>
            <div className="col-sm-7">
                {isCategory ? (
                    <div className="category-info">
                        <span className="colon">:</span>
                        <ul className="list list-inline category-tags">
                            {value.map((tag, index) => (
                                <li key={index} className="list-inline-item">
                                    <span className="tag">{tag}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p>:<span>&nbsp; {value}</span></p>
                )}
            </div>
        </div>
    );
    // function getDiscountPercent(oldPrice, price){
    //     if(!oldPrice || !price || oldPrice <= price) return 0;
    //     return Math.round(((oldPrice - price) / oldPrice) * 100);
    // }
    // const discountPercent = getDiscountPercent(productInformation.oldPrice, productInformation.price);

    if (!productInformation) return <div>Loading...</div>;

    const productImages = productInformation.images || [];

    return (
        <>
            <div className="right-content w-100">
                {/* BREADCRUMB */}
                <div className="card shadow border-0 w-100 flex-row p-4 mb-3 breadcrumb-container">
                    <h5 className="mb-0">Product View</h5>
                    <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
                        <div className="breadcrumb-item">
                            <IoHomeSharp className="breadcrumb-icon" />
                            <a href="/dashboard" className="breadcrumb-link">Dashboard</a>
                        </div>
                        <div className="breadcrumb-item current">
                            <MdExpandMore className="breadcrumb-icon-expand" />
                            <a href="/products" className="breadcrumb-link">Product List</a>
                        </div>
                        <div className="breadcrumb-item current">
                            <span>Product View</span>
                            <MdExpandMore className="breadcrumb-icon-expand" />
                        </div>
                    </Breadcrumbs>
                </div>

                <div className="card productDetailSection">
                    <div className="row">
                        {/* Product Gallery */}
                        <div className="col-md-5">
                            <div className="sliderWrapper pt-3 pb-3 pl-4 pr-4">
                                <h5 className="mb-3">Product Gallery</h5>
                                
                                {/* Slider chính */}
                                <Slider 
                                    {...productSliderOptions} 
                                    className="sliderBig mb-3"
                                    ref={mainSliderRef}
                                >
                                    {productImages.map((image, index) => (
                                        <div key={index} className="item">
                                            <img 
                                                src={image}
                                                className="w-100"
                                                alt={`Product ${index + 1}`}
                                                style={{ 
                                                    borderRadius: '8px',
                                                    objectFit: 'cover',
                                                    height: '400px'
                                                }}
                                            />
                                        </div>
                                    ))}
                                </Slider>
                                
                                {/* Slider thumbnail */}
                                <Slider 
                                    {...productSliderSmlOptions} 
                                    className="sliderSml"
                                    ref={thumbSliderRef}
                                >
                                    {productImages.map((image, index) => (
                                        <div 
                                            key={index} 
                                            className="item"
                                            onClick={() => handleThumbnailClick(index)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <img 
                                                src={image}
                                                className="w-100"
                                                alt={`Thumbnail ${index + 1}`}
                                                style={{ 
                                                    borderRadius: '4px',
                                                    objectFit: 'cover',
                                                    height: '80px',
                                                    border: currentSlide === index ? '2px solid #007bff' : '2px solid transparent',
                                                    transition: 'border 0.3s ease'
                                                }}
                                            />
                                        </div>
                                    ))}
                                </Slider>
                            </div>
                        </div>

                        {/* Product Information */}
                        <div className="col-md-7">
                            <div className="pt-3 pb-3 pl-4 pr-4">
                                <h5 className="mb-3">Product Details</h5>
                                <h4 className="mb-4">{productInformation.name}</h4>
                                
                                <div className="productInfo">
                                    <ProductInfoRow 
                                        icon={<TbBrandCodesandbox />}
                                        label="Brand"
                                        value={productInformation.brand}
                                    />
                                    
                                    <ProductInfoRow 
                                        icon={<BiCategory />}
                                        label="Category"
                                        value={
                                            productInformation.category && productInformation.category.name
                                                ? [productInformation.category.name]
                                                : ["No Category"]
                                        }
                                        isCategory={true}
                                    />

                                    <ProductInfoRow 
                                        icon={<PiResizeDuotone />}
                                        label="Price"
                                        value={productInformation.price}
                                    />
                                    
                                    <ProductInfoRow 
                                        icon={<MdOutlinePriceChange />}
                                        label="Old Price"
                                        value={productInformation.oldPrice}
                                    />

                                     {/* <ProductInfoRow 
                                        icon={<IoPricetagsOutline />}
                                        label="Discount Percentage"
                                        value={`${discountPercent}%`}
                                    /> */}
                                    
                                    <ProductInfoRow 
                                        icon={<AiOutlineStock />}
                                        label="Stock"
                                        value={productInformation.countInStock}
                                    />
                                    
                                    <ProductInfoRow 
                                        icon={<MdPublishedWithChanges />}
                                        label="Published"
                                        value={productInformation.dateCreated
                                            ? new Date(productInformation.dateCreated).toLocaleDateString('vi-VN')
                                            : ''}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Product Description */}
                        <div className='p-4 pb-2'>
                            <h5 className='mr-4 mt-4 mb-3'>Product Description</h5>
                            <p>{productInformation.description}</p>

                                <br/>
                                {/* Rating */}
                            <h5>Rating Analytics</h5>
                            <div className='ratingSection'>
                                {/* Rating */}
                                <div className='ratingrow d-flex align-items-center'>
                                    <span className='col1'>
                                        5 Star
                                    </span>

                                    <div className='col2 mr-5'>
                                        <div className='progress'>
                                            <div className='progress-bar bg-warning' role="progressbar" style={{width:"75%"}} aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>
                                    </div>
                                   
                                    <span className='col3'>
                                        (22)
                                    </span>

                                </div>
                                 <div className='ratingrow d-flex align-items-center'>
                                    <span className='col1'>
                                        4 Star
                                    </span>

                                    <div className='col2 mr-5'>
                                        <div className='progress'>
                                            <div className='progress-bar bg-warning' role="progressbar" style={{width:"20%"}} aria-valuenow="20" aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>
                                    </div>
                                   
                                    <span className='col3'>
                                        (13)
                                    </span>

                                </div>
                                 <div className='ratingrow d-flex align-items-center'>
                                    <span className='col1'>
                                        3 Star
                                    </span>

                                    <div className='col2 mr-5'>
                                        <div className='progress'>
                                            <div className='progress-bar bg-warning' role="progressbar" style={{width:"10%"}} aria-valuenow="10" aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>
                                    </div>
                                   
                                    <span className='col3'>
                                        (06)
                                    </span>

                                </div>
                                 <div className='ratingrow d-flex align-items-center'>
                                    <span className='col1'>
                                        2 Star
                                    </span>

                                    <div className='col2 mr-5'>
                                        <div className='progress'>
                                            <div className='progress-bar bg-warning' role="progressbar" style={{width:"5%"}} aria-valuenow="5" aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>
                                    </div>
                                   
                                    <span className='col3'>
                                        (02)
                                    </span>

                                </div>
                                 <div className='ratingrow d-flex align-items-center'>
                                    <span className='col1'>
                                        1 Star
                                    </span>

                                    <div className='col2 mr-5'>
                                        <div className='progress'>
                                            <div className='progress-bar bg-warning' role="progressbar" style={{width:"5%"}} aria-valuenow="5" aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>
                                    </div>
                                   
                                    <span className='col3'>
                                        (02)
                                    </span>

                                </div>

                            </div>
                        </div>
                        {/* Customer Review */}
                        <br/>
                        
                        <div className='reviewsSection p-4 '>
                            <h5>Customer Review</h5>
                            {/* Comment */}
                            <div className='reviewsRow'>
                                <div className='row'>
                                    <div className='col-sm-7 d-flex'>
                                        <div className='d-flex algin-items-center flex-column'>
                                        <div className='userInfo d-flex align-items-center mb-3'>
                                            <UserAvatarImgComponent img={Admin} lg={true}/>
                                            <div className='info pl-2'>
                                                <h6>Nguyen Quoc Khai</h6>
                                                <span>10 minutes ago</span>
                                            </div>
                                        </div>
                                        <Rating name="read-only" value={4.5} readOnly precision={0.5} />
                                        </div>
                                    </div>

                                    <div className='col-md-5 d-flex align-items-center'>
                                        <div className='ml-auto'>
                                            <Button className='btn-blue btn-lg ml-auto btn-round btn-big'><FaReplyAll />&nbsp; Reply</Button>
                                        </div>
                                    </div>
                                    
                                     <p className='mt-3'>Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                         Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
                                        when an unknown printer took a galley of type and scrambled it to make a type specimen book. 
                                        It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</p>
                                </div>
                                
                            </div>
                            {/* Reply */}
                                  <div className='reviewsRow reply'>
                                <div className='row'>
                                    <div className='col-sm-7 d-flex'>
                                        <div className='d-flex algin-items-center flex-column'>
                                        <div className='userInfo d-flex align-items-center mb-3'>
                                            <UserAvatarImgComponent img={Admin} lg={true}/>
                                            <div className='info pl-2'>
                                                <h6>Nguyen Quoc Khai</h6>
                                                <span>10 minutes ago</span>
                                            </div>
                                        </div>
                                        <Rating name="read-only" value={4.5} readOnly precision={0.5} />
                                        </div>
                                    </div>

                                    <div className='col-md-5 d-flex align-items-center'>
                                        <div className='ml-auto'>
                                            <Button className='btn-blue btn-lg ml-auto btn-round btn-big'><FaReplyAll />&nbsp; Reply</Button>
                                        </div>
                                    </div>
                                    
                                     <p className='mt-3'>Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                         Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
                                        when an unknown printer took a galley of type and scrambled it to make a type specimen book. 
                                        It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</p>
                                </div> 
                            </div>

                            {/* Reply */}
                                  <div className='reviewsRow reply'>
                                <div className='row'>
                                    <div className='col-sm-7 d-flex'>
                                        <div className='d-flex algin-items-center flex-column'>
                                        <div className='userInfo d-flex align-items-center mb-3'>
                                            <UserAvatarImgComponent img={Admin} lg={true}/>
                                            <div className='info pl-2'>
                                                <h6>Nguyen Quoc Khai</h6>
                                                <span>10 minutes ago</span>
                                            </div>
                                        </div>
                                        <Rating name="read-only" value={4.5} readOnly precision={0.5} />
                                        </div>
                                    </div>

                                    <div className='col-md-5 d-flex align-items-center'>
                                        <div className='ml-auto'>
                                            <Button className='btn-blue btn-lg ml-auto btn-round btn-big'><FaReplyAll />&nbsp; Reply</Button>
                                        </div>
                                    </div>
                                    
                                     <p className='mt-3'>Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                         Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
                                        when an unknown printer took a galley of type and scrambled it to make a type specimen book. 
                                        It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</p>
                                </div>
                                
                            </div>
                            {/* Comment */}
                            <div className='reviewsRow'>
                                <div className='row'>
                                    <div className='col-sm-7 d-flex'>
                                        <div className='d-flex algin-items-center flex-column'>
                                        <div className='userInfo d-flex align-items-center mb-3'>
                                            <UserAvatarImgComponent img={Admin} lg={true}/>
                                            <div className='info pl-2'>
                                                <h6>Nguyen Quoc Khai</h6>
                                                <span>10 minutes ago</span>
                                            </div>
                                        </div>
                                        <Rating name="read-only" value={4.5} readOnly precision={0.5} />
                                        </div>
                                    </div>

                                    <div className='col-md-5 d-flex align-items-center'>
                                        <div className='ml-auto'>
                                            <Button className='btn-blue btn-lg ml-auto btn-round btn-big'><FaReplyAll />&nbsp; Reply</Button>
                                        </div>
                                    </div>
                                    
                                     <p className='mt-3'>Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                         Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
                                        when an unknown printer took a galley of type and scrambled it to make a type specimen book. 
                                        It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</p>
                                </div>
                            </div>
                            <br/>

                            <h5 className='mt-4 mb-4'>Review Reply Form</h5>
                            <form className='reviewForm'>
                                    <textarea placeholder='  Write Here'></textarea>
                                    <Button className='btn-blue btn-big btn-lg w-100 mt-4'>Drop your Replies</Button>
                            </form>
                        </div>            
                    </div>
                </div>
            </div>
            </>
    )}
    export default ProductDetails