import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Page from 'src/components/Page';
import EditCard from 'src/pages/CardsPages/EditCard/EditCard';
import cardService from 'src/services/card.services';

const ModifyCard = () => {
  const [cardDetails, setCardDetails] = useState(null);

  const { name } = useParams();

  useEffect(() => {
    if (name) {
      cardService
        .getOneCard(name)
        .then((response) => {
          if (response.status === 200) {
            let tempData = {
              ...response.data.card,
              profile: response.data.images.profile,
              logo: response.data.images.logo,
            };
            setCardDetails(tempData);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [name]);

  return (
    <Page title={name}>
      <EditCard data={cardDetails} user="admin" />
    </Page>
  );
};

export default ModifyCard;
