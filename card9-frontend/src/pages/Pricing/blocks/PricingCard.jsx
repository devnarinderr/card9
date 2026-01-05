import React from 'react';
import { MostPopularTitle, PricingBox, FeaturesList, ButtonContainer, BuyNowButton } from './PricingCardStyles';
import { Card } from '@mui/material';

// Array of colors
const colors = ['red', 'blue', 'green', 'purple', 'orange', 'brown'];

// Function to select a random color from the array
const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};

const PricingCard = ({ mostPopular, oneTime, price, planName, features }) => {
  const randomColor = getRandomColor();

  return (
    <div>
      <Card
        sx={{
          width: 250,
          height: 450,
          borderRadius: '0.5rem',
          textDecoration: 'none',
          border: '1px solid rgba(0, 0, 0, 0.07)',
          borderTop: `5px solid ${randomColor}`,
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        <div style={{ margin: '1rem' }}>
          <h1 style={{ fontWeight: 100 }}>{planName}</h1>
        </div>

        <PricingBox>
          <h1 style={{ fontWeight: 100 }}> {price} </h1>
          {oneTime ? <p>Only One time payment. No hidden cost</p> : <p>You will be billed annually</p>}
        </PricingBox>

        <FeaturesList>
          {features ? (
            features.map((data, index) => {
              return <li key={index}>{data.title}</li>;
            })
          ) : (
            <></>
          )}
        </FeaturesList>

        {mostPopular === true ? (
          <MostPopularTitle sx={{ backgroundColor: randomColor }}>
            <h4>MOST POPULAR</h4>
          </MostPopularTitle>
        ) : (
          <></>
        )}

        <ButtonContainer>
          <BuyNowButton color={randomColor}>BUY NOW</BuyNowButton>
        </ButtonContainer>
      </Card>
    </div>
  );
};

export default PricingCard;
