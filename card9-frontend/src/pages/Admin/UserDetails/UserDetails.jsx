import { Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CustomCard from 'src/components/CustomCard';
import adminService from 'src/services/admin.services';
import AccountImage from 'src/assets/images/account.png';

const UserDetails = () => {
  const { id } = useParams();
  const [details, setDetails] = useState([]);
  const [userDetails, setUserDetails] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      _getCardDetails(id);
    }
  }, [id]);

  const _getCardDetails = async (id) => {
    try {
      await adminService.getCardByUserId(id).then((resp) => {
        if (resp.data) {
          console.log(resp.data);
          setDetails({ card: resp.data.card, user: resp.data.user });
        }
      });
    } catch (error) {
      console.log('ERROR : ', error);
    }
  };

  const handleMoreInfoClick = (name) => {
    navigate(`edit/${name}`);
  };

  return (
    <Box
      sx={{
        backgroundColor: '#FFFFFF',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        padding: '20px',
      }}
    >
      {details ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box
              sx={{
                backgroundColor: '#FFFFFF',
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                padding: '5px',
                width: 100,
              }}
            >
              <img src={details?.user?.profile ?? AccountImage} alt="" />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography sx={{ textTransform: 'uppercase', color: 'red' }}>{details?.user?.role}</Typography>
              <Typography>{`${details?.user?.first_name} ${details?.user?.last_name}`}</Typography>
              <Typography>{details?.user?.email}</Typography>
            </Box>
          </Box>
          <h3>Cards</h3>
          <Box sx={{ display: 'flex', gap: 2, zIndex: 15 }}>
            {(Array.isArray(details.card) &&
              details.card.map((card) => (
                <CustomCard
                  key={card.id}
                  title={card.cardName}
                  headline={card.headline}
                  theme={card.theme}
                  profile={card.profile}
                  handleClick={handleMoreInfoClick}
                />
              ))) || (
              <CustomCard
                key={details?.card?.id}
                title={details?.card?.cardName}
                headline={details?.card?.headline}
                theme={details?.card?.theme}
                profile={details?.card?.profile}
                handleClick={handleMoreInfoClick}
              />
            )}
          </Box>
        </Box>
      ) : (
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      )}
    </Box>
  );
};

export default UserDetails;
