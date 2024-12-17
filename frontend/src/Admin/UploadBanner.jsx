import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UploadBanner = () => {
  const [bannerImage, setBannerImage] = useState(null);
  const [name, setName] = useState('');
  const [detailsName, setDetailsName] = useState(''); // Updated to match backend
  const [serviceName, setServiceName] = useState(''); // Updated to match backend
  const [addressName, setAddressName] = useState(''); // Updated to match backend
  const [bannerList, setBannerList] = useState([]);
  const [selectedBanner, setSelectedBanner] = useState(null);

  // Handle image selection
  const handleImageChange = (e) => {
    setBannerImage(e.target.files[0]);
  };

  // Handle banner name input
  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  // Handle details input
  const handleDetailsNameChange = (e) => {
    setDetailsName(e.target.value);
  };

  // Handle service select change
  const handleServiceNameChange = (e) => {
    setServiceName(e.target.value);
  };

  // Handle address input
  const handleAddressNameChange = (e) => {
    setAddressName(e.target.value);
  };

  // Handle banner upload
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!bannerImage) {
      alert('Please select an image!');
      return;
    }

    const formData = new FormData();
    formData.append('image', bannerImage);
    formData.append('name', name);
    formData.append('detailsName', detailsName); // Use detailsName
    formData.append('serviceName', serviceName); // Use serviceName
    formData.append('addressName', addressName); // Use addressName

    try {
      const response = await axios.post(
        'http://localhost:3001/api/upload-banner',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      setBannerList((prevList) => [...prevList, response.data.banner]);
      setName('');
      setDetailsName('');
      setServiceName('');
      setAddressName('');
      setBannerImage(null);
      alert('Banner uploaded successfully!');
    } catch (error) {
      console.error('Error uploading banner:', error);
      alert(error.response?.data?.message || 'Error uploading banner');
    }
  };

  // Fetch banners on component mount
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/banners');
        setBannerList(response.data);
      } catch (error) {
        console.error('Error fetching banners:', error);
        alert('Error fetching banners');
      }
    };

    fetchBanners();
  }, []);

  // Handle banner deletion
  const handleDelete = async () => {
    if (!selectedBanner) {
      alert('Please select a banner to delete');
      return;
    }

    try {
      await axios.delete(`http://localhost:3001/api/delete-banner/${selectedBanner._id}`);
      setBannerList((prevList) =>
        prevList.filter((banner) => banner._id !== selectedBanner._id)
      );
      setSelectedBanner(null);
      alert('Banner deleted successfully');
    } catch (error) {
      console.error('Error deleting banner:', error);
      alert(error.response?.data?.message || 'Error deleting banner');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Banner Name"
          value={name}
          onChange={handleNameChange}
          required
        />
        <input
          type="text"
          placeholder="Details"
          value={detailsName}
          onChange={handleDetailsNameChange}
          required
        />
        <select
          value={serviceName}
          onChange={handleServiceNameChange}
          required
        >
          <option value="">Select Service</option>
          <option value="Plumber">Plumber</option>
          <option value="Electrician">Electrician</option>
          <option value="Carpenter">Carpenter</option>
          <option value="Painter">Painter</option>
          <option value="Cleaner">Cleaner</option>
        </select>
        <input
          type="text"
          placeholder="Address"
          value={addressName}
          onChange={handleAddressNameChange}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          required
        />
        <button type="submit">Upload Banner</button>
      </form>

      <div>
        <h3>Uploaded Banners</h3>
        {bannerList.length > 0 ? (
          <ul>
            {bannerList.map((banner) => (
              <li key={banner._id}>
                <img
                  src={`http://localhost:3001${banner.image}`}
                  alt={banner.name}
                  style={{ width: '200px', height: 'auto' }}
                />
                <h5>{banner.name}</h5>
                <p>{banner.detailsName}</p>
                <p>{banner.serviceName}</p>
                <p>{banner.addressName}</p>
                <button onClick={() => setSelectedBanner(banner)}>
                  Select to Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No banners available</p>
        )}
      </div>

      {selectedBanner && (
        <div>
          <h4>Selected Banner: {selectedBanner.name}</h4>
          <button type="button" onClick={handleDelete}>
            Delete Selected Banner
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadBanner;
