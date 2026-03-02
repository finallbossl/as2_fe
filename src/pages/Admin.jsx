import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Check, Upload } from 'lucide-react';
import { useStore } from '../store/useStore';
import { supabase } from '../supabaseClient';
import './Admin.css';

const Admin = () => {
  const { products, fetchProducts, addProduct, removeStoreProduct, updateStoreProduct } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchProducts().finally(() => setLoading(false));
  }, [fetchProducts]);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    imageUrl: '',
    imageFile: null,
    previewUrl: '',
  });

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        price: product.price,
        description: product.description,
        imageUrl: product.imageUrl || '',
        imageFile: null,
        previewUrl: product.imageUrl || '',
      });
    } else {
      setEditingProduct(null);
      setFormData({ name: '', price: '', description: '', imageUrl: '', imageFile: null, previewUrl: '' });
    }
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        imageFile: file,
        imageUrl: '', // Clear URL if file is selected
        previewUrl: URL.createObjectURL(file)
      });
    }
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setFormData({
      ...formData,
      imageUrl: url,
      imageFile: null, // Clear file if URL is entered
      previewUrl: url
    });
  };

  const uploadToSupabase = async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { data, error } = await supabase.storage
      .from('images') // Ensure 'images' bucket exists in Supabase
      .upload(filePath, file);

    if (error) {
      console.error('Supabase Upload Error:', error);
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      let finalImageUrl = formData.imageUrl;

      if (formData.imageFile) {
        finalImageUrl = await uploadToSupabase(formData.imageFile);
      }

      const productData = {
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description,
        imageUrl: finalImageUrl,
      };

      if (editingProduct) {
        await updateStoreProduct(editingProduct.id, productData);
      } else {
        await addProduct(productData);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await removeStoreProduct(id);
      } catch (err) {
        alert(err.message);
      }
    }
  };

  return (
    <div className="admin-page container">
      <div className="admin-header">
        <h1>Product <span>Management</span></h1>
        <button onClick={() => handleOpenModal()} className="primary-btn">
          <Plus size={18} />
          Add New Product
        </button>
      </div>

      <div className="products-table glass">
        <div className="table-header">
          <span>Product</span>
          <span>Price</span>
          <span>Actions</span>
        </div>
        <div className="table-body">
          {products.map((product) => (
            <div key={product.id} className="table-row">
              <div className="product-info-cell">
                <img src={product.imageUrl} alt={product.name} />
                <div>
                  <h4>{product.name}</h4>
                  <p>{product.description}</p>
                </div>
              </div>
              <div className="price-cell">${product.price}</div>
              <div className="actions-cell">
                <button onClick={() => handleOpenModal(product)} className="edit-btn">
                  <Edit2 size={18} />
                </button>
                <button onClick={() => handleDelete(product.id)} className="delete-btn">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass">
            <div className="modal-header">
              <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="close-btn"><X /></button>
            </div>
            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-group">
                <label>Product Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Price ($)</label>
                <input 
                  type="number" 
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required 
                ></textarea>
              </div>
              <div className="form-group">
                <label>Product Image</label>
                <div className="image-preview-container">
                  {formData.previewUrl ? (
                    <img src={formData.previewUrl} alt="Preview" className="image-preview" />
                  ) : (
                    <div className="image-placeholder">No image selected</div>
                  )}
                </div>
                <div className="image-input-options">
                  <div className="file-input-wrapper">
                    <button type="button" className="secondary-btn upload-btn">
                      <Plus size={16} /> Choose Local File
                    </button>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
                  <span className="or-text">OR</span>
                  <input 
                    type="text" 
                    placeholder="Paste Image URL"
                    value={formData.imageUrl}
                    onChange={handleUrlChange}
                    className="url-input"
                  />
                </div>
              </div>
              <button type="submit" className="primary-btn submit-btn" disabled={isUploading}>
                {isUploading ? <Upload className="animate-spin" size={18} /> : <Check size={18} />}
                {isUploading ? 'Uploading...' : (editingProduct ? 'Update Product' : 'Create Product')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
