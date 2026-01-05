import React from 'react';

import './cardStyle.css';
const CatalogueCard = ({ catalogue, image, color }) => {
  // Find the image data for this specific catalogue
  let catalogueImage;
  if (image !== undefined && Array.isArray(image)) {
    const imageObj = image.find(img => img && img[catalogue.id]);
    catalogueImage = imageObj ? imageObj[catalogue.id] : '/static/mock-images/avatars/avatar_1.jpg';
  } else {
    catalogueImage = '/static/mock-images/avatars/avatar_1.jpg';
  }

  const handleCatalogueClick = (url) => {
    if (url) {
      window.open(url);
    }
  };
  return (
    <div
      className="card__catalogue"
      style={{ background: color, cursor: catalogue.url ? 'pointer' : 'default' }}
      onClick={() => handleCatalogueClick(catalogue.url)}
    >
      <div className="img" style={{ background: color }}>
        <img src={catalogueImage} alt="catalogue-image" />
      </div>
      <span>{catalogue.title}</span>
      {catalogue.price && <span className="price">Price: {catalogue.price}</span>}
      <p className="job">{catalogue.description}</p>
    </div>
  );
};

export default CatalogueCard;
