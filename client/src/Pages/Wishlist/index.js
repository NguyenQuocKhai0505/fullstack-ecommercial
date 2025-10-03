import {useWishlist} from "../../contexts/WishlistContext.js"
import { getWishlistAPI, removeFromWishlistAPI } from "../../utils/api.js";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
export default function WishlistPage() {
  const { wishlist, setWishlist } = useWishlist();

  const handleRemove = async (productId) => {
    const token = localStorage.getItem("token");
    await removeFromWishlistAPI(productId, token);
    const updated = await getWishlistAPI(token);
    setWishlist(updated || []);
    toast.info("This product is deleted from wish list!");
  };


  if (!wishlist.length) return <div className="text-center">There are no products in your wish list</div>;

  return (
    <div className="container py-4">
      <h2 className="mb-4">WISH LIST</h2>
      <table className="table table-bordered align-middle">
        <thead>
          <tr>
            <th>Image</th>
            <th>Product Name</th>
            <th>Price</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {wishlist.map(product => (
            <tr key={product._id}>
              <td style={{ width: 120 }}>
                <Link to={`/product/${product._id}`}>
                  <img
                    src={product.images?.[0] || "https://via.placeholder.com/100"}
                    alt={product.name}
                    style={{ width: 80, borderRadius: 8 }}
                  />
                </Link>
              </td>
              <td>
                <Link to={`/product/${product._id}`}>
                  {product.name}
                </Link>
              </td>
              <td style={{ color: "#d32f2f", fontWeight: 600 }}>
                ${product.price?.toLocaleString()} 
              </td>
              <td>
                <button className="btn btn-outline-danger btn-sm" onClick={() => handleRemove(product._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}