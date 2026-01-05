import { useState } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
// @mui
import { styled, useTheme } from '@mui/material/styles';
import { Card, CardHeader, CardMedia } from '@mui/material';
import CurvedSVG from './CurvedSVG';
import { extractExtensionFromBase64 } from 'src/common/utilities';


const ClippedSVG = styled(CurvedSVG)({
  position: 'absolute',
  bottom: 36,
  left: 0,
});

// ----------------------------------------------------------------------
ProfileCard.propTypes = {
  small: PropTypes.bool,
};

export default function ProfileCard({ small, cardData, image }) {
  const [fileType, setFileType] = useState(null);
  const theme = useTheme();

  const { id } = useParams();

  let profile;
  let contentType;

  if (id) {
    profile = image.profile;
  } else {
    // Find the image data for this specific card
    if (image !== undefined && Array.isArray(image)) {
      const imageObj = image.find(img => img && img[cardData.id]);
      profile = imageObj ? imageObj[cardData.id] : '/static/mock-images/avatars/avatar_1.jpg';
    } else {
      profile = '/static/mock-images/avatars/avatar_1.jpg';
    }
  }

  if (profile) {
    let ext = extractExtensionFromBase64(profile);
    contentType = ext;
  }

  return (
    <>
      <Card
        sx={{
          width: small ? 160 : 200,
          height: small ? 200 : 240,
          cursor: 'pointer',
          borderRadius: '0.5rem',
          textDecoration: 'none',
        }}
      >
        {contentType === 'mp4' ? (
          <CardMedia
            component="video"
            src={profile}
            muted
            alt="avatar"
            height={small ? '160' : '200'}
            style={{ backgroundColor: cardData?.theme }}
          />
        ) : (
          <CardMedia
            component="img"
            height={small ? '160' : '200'}
            image={profile}
            alt="avatar"
            style={{ backgroundColor: cardData?.theme }}
          />
        )}

        <ClippedSVG color={cardData?.theme} />
        <CardHeader
          title={cardData?.cardName}
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
