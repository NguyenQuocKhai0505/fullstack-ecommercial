import React from "react";
import { Rating } from "@mui/material";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    TextField
} from "@mui/material";
import { Select, MenuItem, InputLabel, FormControl } from "@mui/material";

const EditProductDialog = ({
    open,
    onClose,
    onSubmit,
    loading,
    editFields,
    onInputChange,
    title = "Edit Product",
    content = "Update the product information below and click 'Save' to confirm.",
    categories = []
}) => (
    <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
    >
        <form onSubmit={onSubmit}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {content}
                </DialogContentText>
                
                <TextField
                    autoFocus
                    required
                    margin="dense"
                    id="name"
                    name="name"
                    label="Product Name"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={editFields.name}
                    onChange={onInputChange('name')}
                />
                
                <TextField
                    required
                    margin="dense"
                    id="description"
                    name="description"
                    label="Product Description"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={editFields.description}
                    onChange={onInputChange('description')}
                    multiline
                    rows={3}
                />
                
                <TextField
                    required
                    margin="dense"
                    id="brand"
                    name="brand"
                    label="Brand"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={editFields.brand}
                    onChange={onInputChange('brand')}
                />
                
                <FormControl fullWidth margin="dense" required>
                    <InputLabel id="category-label">Category</InputLabel>
                    <Select
                        labelId="category-label"
                        id="category"
                        name="category"
                        value={editFields.category}
                        label="Category"
                        onChange={onInputChange('category')}
                    >
                        {categories.map(cat => (
                            <MenuItem key={cat._id} value={cat._id}>
                                {cat.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                
                <TextField
                    required
                    margin="dense"
                    id="price"
                    name="price"
                    label="Price"
                    type="number"
                    fullWidth
                    variant="outlined"
                    value={editFields.price}
                    onChange={onInputChange('price')}
                />
                
                <TextField
                    margin="dense"
                    id="oldPrice"
                    name="oldPrice"
                    label="Old Price"
                    type="number"
                    fullWidth
                    variant="outlined"
                    value={editFields.oldPrice}
                    onChange={onInputChange('oldPrice')}
                />
                
                <TextField
                    required
                    margin="dense"
                    id="countInStock"
                    name="countInStock"
                    label="Count In Stock"
                    type="number"
                    fullWidth
                    variant="outlined"
                    value={editFields.countInStock}
                    onChange={onInputChange('countInStock')}
                />
                
                <div style={{ margin: '16px 0' }}>
                <label style={{ fontWeight: 500, marginRight: 8 }}>Rating:</label>
                <Rating
                    name="rating"
                    value={Number(editFields.rating) || 0}
                    precision={1}
                    max={5}
                    onChange={(event, newValue) => {
                        onInputChange('rating')({ target: { value: newValue } });
                    }}
                />
                <span style={{ marginLeft: 8 }}>{editFields.rating}</span>
            </div>
                            
                <TextField
                    margin="dense"
                    id="images"
                    name="images"
                    label="Product Images (separate with commas)"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={Array.isArray(editFields.images) ? editFields.images.join(', ') : editFields.images}
                    onChange={onInputChange('images')}
                    helperText="Enter image URLs separated by commas"
                    multiline
                    rows={3}
                />
                
                <div style={{ marginTop: '10px' }}>
                    <label>
                        <input
                            type="checkbox"
                            checked={editFields.isFeatured}
                            onChange={onInputChange('isFeatured')}
                        />
                        Featured Product
                    </label>
                </div>
            </DialogContent>
            <DialogActions>
                <Button 
                    onClick={onClose} 
                    variant="outlined" 
                    disabled={loading}
                >
                    Cancel
                </Button>
                <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                    disabled={loading}
                >
                    {loading ? 'Saving...' : 'Save Changes'}
                </Button>
            </DialogActions>
        </form>
    </Dialog>
);

export default EditProductDialog;