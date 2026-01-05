import React from 'react';
import './componentStyles.css';
import adminService from 'src/services/admin.services';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

const CustomRenewButton = ({ onClick, cardId, setTrigger, trigger }) => {
  const handleButtonClick = (event) => {
    event.stopPropagation();
    if (onClick) {
      onClick(event);
    }

    if (cardId) _getCardRenewed(cardId);
  };

  const _getCardRenewed = (id) => {
    try {
      if (id) {
        adminService.renewCard(id).then((resp) => {
          setTrigger(!trigger);
        });
      }
    } catch (error) {
      console.log('Error: ', error);
    }
  };

  return (
    <button className="customRenewButton" onClick={handleButtonClick}>
      <div className="bell">
        <RestartAltIcon />
      </div>
    </button>
  );
};

export default CustomRenewButton;
