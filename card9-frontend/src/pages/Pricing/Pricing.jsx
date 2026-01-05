import React from 'react';
import PricingCard from './blocks/PricingCard';
import Page from 'src/components/Page';

const PLANS_DATA = [
  {
    name: 'Online Digital Card',
    price: '₹1200',
    popular: true,
    features: [{ title: '1 Online Digital Card' }, { title: '24/7 Support' }],
  },
  {
    name: 'Digital Card (PDF)',
    price: '₹1200 - ₹2000',
    popular: false,
    oneTime: true,
    features: [{ title: '1 Digital Card in PDF format' }],
  },
];

const Pricing = () => {
  return (
    <Page title="Pricing">
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {PLANS_DATA.map((data, index) => (
          <PricingCard
            mostPopular={data.popular}
            oneTime={data.oneTime}
            price={data.price}
            planName={data.name}
            features={data.features}
          />
        ))}
      </div>
    </Page>
  );
};

export default Pricing;
