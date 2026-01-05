import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CatalogueCard from './CatalogueCard';
import './cardStyle.css';

const CatalogueAccordation = ({ color, catalogueData, images }) => {
  return (
    <div>
      <Accordion
        TransitionProps={{ unmountOnExit: true }}
        sx={{ background: 'fff', color: color, top: '8px', border: '1px solid' }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: color }} />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Catalogues</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{}}>
          <div class="container scroll-1">
            {catalogueData ? (
              catalogueData.map((catalogue, index) => {
                return (
                  <CatalogueCard
                    key={catalogue?.id}
                    catalogue={catalogue}
                    image={images ? images[index] : []}
                    color={color}
                  />
                );
              })
            ) : (
              <></>
            )}
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default CatalogueAccordation;
