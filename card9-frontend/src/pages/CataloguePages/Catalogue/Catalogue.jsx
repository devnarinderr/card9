import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Typography } from '@mui/material';
// Componets
import { CataloguesContainer, AddCatalogue, CatalogueContainer, WarningBox, LoaderContainer } from './CatalogueStyles';
import Page from '../../../components/Page';
import Iconify from '../../../components/Iconify';
import catalogueService from '../../../services/catalogue.services';
import { useDispatch, useSelector } from 'react-redux';
import { ColorRing } from 'react-loader-spinner';
import { getCatalogue } from '../../../actions/catalogue';
import CatalogueCard from '../../../components/CatalogueCard';

const Catalogue = () => {
  const navigate = useNavigate();
  const [catalogueData, setCatalogueData] = useState();
  const [images, setImages] = useState();
  const [loader, setLoader] = useState(false);
  const [catalogueDelete, setCatalogueDelete] = useState(false);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const _getAllCatalogues = async () => {
    setLoader(true);
    try {
      await catalogueService
        .getAllCataloguesByUserId(user.data ? user.data.id : user.id)
        .then((response) => {
          setCatalogueData(response?.data.catalogues);
          setImages(response?.data.images);
          setLoader(false);
        })
        .catch((error) => {
          console.error('Error: ', error);
        });
    } catch (error) {
      console.log('Error: ', error);
    }
  };

  useEffect(() => {
    _getAllCatalogues();
  }, [catalogueDelete]);

  const getIcon = (icon, width = 22, height = 22) => <Iconify icon={icon} width={width} height={height} />;
  return (
    <Page title="Catalogue">
      <CataloguesContainer maxWidth="xl">
        {/* {limit < 2 ? (
          <></>
        ) : ( */}
        <AddCatalogue onClick={() => navigate('new')}>
          {getIcon('carbon:add', 48, 48)}
          <Typography sx={{ fontSize: 20 }}>Add Catalogue</Typography>
        </AddCatalogue>
        {/* )} */}
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
        {catalogueData ? (
          catalogueData.map((data, idx) => (
            <CatalogueContainer
              key={idx}
              onClick={() => {
                navigate(`${data.title}`);
                dispatch(getCatalogue(data.id));
              }}
            >
              <CatalogueCard catalogueData={data} image={images ? images[idx] : undefined} />
            </CatalogueContainer>
          ))
        ) : (
          <></>
        )}
      </CataloguesContainer>
    </Page>
  );
};

export default Catalogue;
