import { CiSearch } from "react-icons/ci";
const SearchBox = () => {
    return(
        <div className="searchBox position-relative d-flex align-items-center">
                <CiSearch className="mr-2"/>
                <input type="text" placeholder="Quick Searching...."></input>
        </div>
    )
}
export default SearchBox