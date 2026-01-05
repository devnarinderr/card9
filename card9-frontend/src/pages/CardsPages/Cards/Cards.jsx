import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// @mui
import { Typography } from '@mui/material';
// components
import IconSnackbar from '../../../components/IconSnackbar';
import { ColorRing } from 'react-loader-spinner';
import { CardsContainer, AddCard, CardContainer, WarningBox, LoaderContainer } from './CardsStyles';
import Page from '../../../components/Page';
import Iconify from '../../../components/Iconify';
import ProfileCard from '../../../components/ProfileCard';
import cardService from '../../../services/card.services';
import { getCard } from '../../../actions/card';
import WarningIcon from '../../../assets/images/warning.svg';
import { ExpDateChecker } from '../../../common/cardExp';

export default function Cards() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [cardData, setCardData] = useState();
  const [images, setImages] = useState();
  const [loader, setLoader] = useState(false);
  const [limit, setLimit] = useState(user.data ? user.data.limit : user.limit);
  const [exp, setExp] = useState(false);
  const [warningMsg, setWarningMsg] = useState('');
  const [cardExpired, setCardExpired] = useState(false);
  const [open, setOpen] = useState(false);

  const gettingAll = async () => {
    try {
      setLoader(true);
      await cardService
        .getAllCards(user.data ? user.data.id : user.id)
        .then((resp) => {
          setImages(resp?.images);
          setCardData(resp?.cards);
          if (resp?.cards?.length > 1) {
            setLoader(false);
            return;
          } else {
            const DaysLeft = resp?.cards?.map((card) => {
              let days = ExpDateChecker(card.expiredAt);
              return days;
            });
            if (DaysLeft[0] <= 30) {
              setExp(true);
              setWarningMsg(`Warning! Your annual subscription is ending in ${DaysLeft[0]} days.`);
              if (DaysLeft[0] <= 30) {
                setWarningMsg(
                  `Warning! Your card will be disabled in ${DaysLeft[0]} days, Please contact us for renewal.`
                );
                if (DaysLeft[0] <= 0) {
                  setWarningMsg(`Warning! Your card is disabled, Please contact us for renewal.`);
                  setCardExpired(true);
                }
              }
            }
            setLoader(false);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.log('ERROR:::', error);
    }
  };

  useEffect(() => {
    gettingAll();
  }, []);

  const getIcon = (icon, width = 22, height = 22) => <Iconify icon={icon} width={width} height={height} />;

  return (
    <Page title="Cards">
      {exp ? (
        <WarningBox>
          <img width="24" height="24" style={{ marginLeft: 5, marginRight: 10 }} src={WarningIcon} alt="warning" />
          <h3 style={{ fontWeight: 'lighter' }}>{warningMsg}</h3>
        </WarningBox>
      ) : (
        <></>
      )}

      <IconSnackbar open={open} setOpen={setOpen} type="warning" title="Warning" msg="Sorry, your card is disabled." />

      <CardsContainer maxWidth="xl">
        {limit > cardData?.length && (
          <AddCard onClick={() => navigate('new')}>
            {getIcon('carbon:add', 48, 48)}
            <Typography sx={{ fontSize: 20 }}>Add Card</Typography>
          </AddCard>
        )}
        <LoaderContainer>
          <ColorRing
            visible={loader}
            height="80"
            width="80"
            ariaLabel="blocks-loading"
            wrapperClass="blocks-wrapper"
            colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
          />
        </LoaderContainer>
        {cardData ? (
          cardData.map((data, idx) => (
            <CardContainer
              key={idx}
              onClick={() => {
                cardExpired ? setOpen(true) : navigate(`${data.cardName}`);
                dispatch(getCard(data.cardName));
              }}
            >
              <ProfileCard cardData={data} image={images[idx]} />
            </CardContainer>
          ))
        ) : (
          <></>
        )}
      </CardsContainer>
    </Page>
  );
}
