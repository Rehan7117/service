import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/banners');  // Updated API endpoint
        setBanners(response.data);  // Assuming the response contains an array of banners
      } catch (err) {
        console.error('Error fetching banners:', err);
      }
    };

    fetchBanners();
  }, []);

  return (
    <div>
      <h1>Uploaded Banners</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {banners.length > 0 ? (
          banners.map((banner) => (
            <div key={banner._id} style={{ margin: '10px', width: '200px' }}>
              <img
                src={`http://localhost:3001${banner.image}`}  // Ensure the image URL is complete
                alt={banner.name}
                style={{ width: '100%', height: 'auto' }}
              />
              <h3>{banner.name}</h3>
              <p>{banner.detailsName}</p>
              <p>{banner.serviceName}</p>
              <p>{banner.addressName}</p>
            </div>
          ))
        ) : (
          <p>No banners available</p>
        )}
      </div>
    </div>
  );
};

export default Home;