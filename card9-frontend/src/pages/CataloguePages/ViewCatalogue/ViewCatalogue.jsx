import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { ColorRing } from 'react-loader-spinner';
// @MUI
import {
  Button,
  CardContent,
  CardMedia,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { CardActions, ActionIcon, CardsView, PreviewCard, CardInfo, BasicDetails } from './ViewCatalogueStyles';

// components
import Page from '../../../components/Page';
import IconSnackbar from '../../../components/IconSnackbar';
import SEO from '../../../common/seo';
import catalogueService from '../../../services/catalogue.services';

ActionBar.propTypes = {
  navigate: PropTypes.func,
};

function ActionBar({ navigate, catalogueId }) {
  const [deleteCard, setDeleteCard] = useState(false);
  const [processDelete, setProcessDelete] = useState(false);
  const [cardDeleted, setCardDeleted] = useState(false);

  const { id } = useParams();

  const handleDeleteCatalogue = () => {
    catalogueService.deleteCatalogue(catalogueId);
    setProcessDelete(true);
    setTimeout(() => {
      setProcessDelete(false);
      setDeleteCard(false);
      setCardDeleted(true);
    }, 2000);
    setTimeout(() => {
      navigate(-1);
    }, 3000);
  };

  return (
    <CardActions>
      <Tooltip title="Back">
        <ActionIcon icon="eva:arrow-back-fill" onClick={() => navigate(-1)} />
      </Tooltip>
      <Tooltip title="Edit">
        <ActionIcon icon="eva:edit-outline" onClick={() => navigate('edit')} />
      </Tooltip>
      <Tooltip title="Delete">
        <ActionIcon icon="eva:trash-2-outline" onClick={() => setDeleteCard(true)} />
      </Tooltip>
      <Dialog open={deleteCard} onClose={() => setDeleteCard(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Confirm Catalogue Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this catalogue?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => setDeleteCard(false)}>
            Cancel
          </Button>
          <LoadingButton loading={processDelete} onClick={() => handleDeleteCatalogue()}>
            Yes
          </LoadingButton>
        </DialogActions>
      </Dialog>
      <IconSnackbar open={cardDeleted} setOpen={setCardDeleted} title="Success" msg="Catalogue has been deleted." />
    </CardActions>
  );
}

const ViewCatalogue = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const { id } = useParams();

  const [catalogueDetails, setCatalogueDetails] = useState([]);

  const [loader, setLoader] = useState(false);

  useEffect(() => {
    setLoader(true);
    catalogueService.getOneCatalogueWithName(id).then((resp) => {
      setCatalogueDetails(resp.data.catalogue);
      setLoader(false);
    });
  }, []);

  return (
    <>
      <SEO title="View Catalogue" />
      {catalogueDetails ? (
        <Page title={`${catalogueDetails.title}`}>
          <ColorRing
            visible={loader}
            height="80"
            width="80"
            ariaLabel="blocks-loading"
            wrapperStyle={{ position: 'absolute', top: '40%', left: '40%' }}
            wrapperClass="blocks-wrapper"
            colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
          />
          {loader === false && (
            <Container maxWidth="xl">
              <ActionBar navigate={navigate} catalogueId={catalogueDetails.id} />
              <CardsView>
                <div id="cardAsImage" style={{ display: 'flex', justifyContent: 'center', width: 400 }}>
                  <PreviewCard theme={theme}>
                    <CardMedia
                      component="img"
                      height="385"
                      image={
                        catalogueDetails?.image !== undefined
                          ? catalogueDetails.image
                          : '/static/mock-images/avatars/avatar_1.jpg'
                      }
                      alt="avatar"
                      sx={{ userSelect: 'none', backgroundColor: catalogueDetails.theme, objectFit: 'contain' }}
                    />
                    <CardContent sx={{ p: '0 !important' }}>
                      <BasicDetails sx={{ p: 3, pb: 1 }}>
                        <CardInfo>
                          <Typography
                            sx={{
                              fontSize: 28,
                              fontWeight: 'bold',
                              lineHeight: 1.4,
                            }}
                          >
                            {catalogueDetails.title}
                          </Typography>
                          {catalogueDetails.price && (
                            <Typography sx={{ fontSize: 20, fontWeight: 700 }}>
                              {`Rs. ${catalogueDetails.price ? catalogueDetails.price : '-'}`}
                            </Typography>
                          )}
                          <Typography sx={{ fontSize: 20, fontWeight: 700, color: catalogueDetails.theme }}>
                            {catalogueDetails.description}
                          </Typography>
                        </CardInfo>
                      </BasicDetails>
                    </CardContent>
                  </PreviewCard>
                </div>
              </CardsView>
            </Container>
          )}
        </Page>
      ) : (
        <></>
      )}
    </>
  );
};

export default ViewCatalogue;
