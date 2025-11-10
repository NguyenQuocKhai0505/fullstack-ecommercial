import { IoMenu } from "react-icons/io5";
import Button from '@mui/material/Button';
import { FaAnglesDown } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { FaAngleRight } from "react-icons/fa";
import {fetchDataFromApi} from "../../../utils/api"
const Navigation =()=>
{
    const [isopenSidebarVal,setisopenSidebarVal] = useState(true)
    const [categories, setCategories] = useState([]);
    const [subByCat, setSubByCat] = useState({});
    const [hoveredCatId,setHoveredCatId] = useState(null)
    useEffect(()=>{
        const load = async ()=>{
            try{
                const [catRes,subRes] = await Promise.all([
                    fetchDataFromApi(`/api/category?all=true`),
                    fetchDataFromApi(`/api/subcat`)
                ])
                setCategories(catRes?.categoryList || [])
                const grouped = {}
                ;(subRes?.subcats || []).forEach((s)=>{
                    const catId = s.category?._id || s.category
                    if(!catId) return
                    if(!grouped[catId]) grouped[catId] = []
                    grouped[catId].push({_id: s._id, name: s.subCategory})
                })
                setSubByCat(grouped)
            }catch(e){
                // optional: log
            }
        }
        load();
    },[])
    return(
        <nav>
        <div className="container">
            <div className ="row">
                <div className ="col-sm-10 navPart1">
                    <div className="catWrapper">
                        <Button className="allCatTab align-items-center mt-2" 
                        onClick={()=>setisopenSidebarVal(!isopenSidebarVal)}
                            >
                        <span className="icon1 mr-2"><IoMenu/></span>
                        <span className="text">ALL CATEGORIES</span>
                        <span className="icon2 ml-2"><FaAnglesDown/></span>
                        </Button>
                        <div className={`sidebarNav ${isopenSidebarVal===true ? 'open':''}`}
                            onMouseLeave={()=>setHoveredCatId(null)}>
                              <ul className="catList">
                                {categories.map(cat => (
                                <li key={cat._id} onMouseEnter={() => setHoveredCatId(cat._id)}>
                                    <Link to={`/cat/${cat._id}`}>
                                        <Button>
                                            {cat.name}
                                            <FaAngleRight className="ml-auto" />
                                        </Button>
                                    </Link>
                                </li>
                                ))}
                            </ul>
                            <div className={`subcatPanel ${hoveredCatId ?"open":""}`}>
                                {(subByCat[hoveredCatId] || []).length===0 ? (
                                    <div className="px-3 py-2 text-muted">No subcategories</div>
                                ):(
                                    (subByCat[hoveredCatId] || []).map(sub => (
                                        <Link key={sub._id} to={`/cat/${hoveredCatId}?subcat=${sub._id}`}>
                                          <Button>{sub.name || sub.subCategory}</Button>
                                        </Link>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                    
                </div>

                <div className ="col-sm-10 navPart2 d-flex align-items-center">
                    <ul className="list list-inline ml-1">
                        <li className="list-inline-item"><Link to="/"><Button>Home</Button></Link></li>
                        {categories.map((cat) => (
                            <li className="list-inline-item" key={cat._id}>
                                <Link to={`/cat/${cat._id}`}>
                                    <Button>{cat.name}</Button>
                                </Link>
                                <div className="submenu shadow">
                                    {(subByCat[cat._id] || []).map((sub) => (
                                        <Link key={sub._id} to={`/cat/${cat._id}?subcat=${sub._id}`}>
                                            <Button>{sub.name || sub.subCategory}</Button>
                                        </Link>
                                    ))}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    </nav>
    )
}
export default Navigation