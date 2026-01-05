import PropTypes from 'prop-types';
// @mui
import { styled, useTheme } from '@mui/material/styles';
import { Card, CardHeader, CardMedia, IconButton } from '@mui/material';
import CurvedSVG from './CurvedSVG';
import Iconify from './Iconify';

// ----------------------------------------------------------------------

const ClippedSVG = styled(CurvedSVG)({
  position: 'absolute',
  bottom: 36,
  left: 0,
});

const CatalogueMenu = styled('div')({
  position: 'absolute',
  bottom: 36,
  left: 0,
  border: '1px solid none',
  height: '20px',
  width: '100%',
  background: '#00000085',
  transition: 'ease-in-out 2s',
});

const ButtonIcon = styled(IconButton)(({ indicator }) => ({
  display: 'flex',
  alignItems: 'center',
  height: '20px',
  color: indicator,
}));

// ----------------------------------------------------------------------
CatalogueCard.propTypes = {
  small: PropTypes.bool,
};

export default function CatalogueCard({ small, catalogueData, image }) {
  const theme = useTheme();

  // Find the image data for this specific catalogue
  let catalogueImage;
  if (image !== undefined && Array.isArray(image)) {
    const imageObj = image.find(img => img && img[catalogueData.id]);
    catalogueImage = imageObj ? imageObj[catalogueData.id] : '/static/mock-images/avatars/avatar_1.jpg';
  } else {
    catalogueImage = '/static/mock-images/avatars/avatar_1.jpg';
  }

  const getIcon = (name) => <Iconify icon={name} width={18} height={18} />;
  return (
    <>
      <Card
        sx={{
          width: small ? 160 : 200,
          height: small ? 200 : 240,
          cursor: 'unset',
          borderRadius: '0.5rem',
          textDecoration: 'none',
        }}
      >
        <CardMedia
          component="img"
          height={small ? '160' : '200'}
          image={catalogueImage}
          alt="avatar"
          style={{ backgroundColor: catalogueData?.theme, objectFit: 'contain' }}
        />
        <CardHeader
          title={catalogueData?.title}
          sx={{
            fontSize: '1rem',
            padding: 0,
            height: 40,
            textAlign: 'center',
          }}
        />
      </Card>
    </>
  );
}
