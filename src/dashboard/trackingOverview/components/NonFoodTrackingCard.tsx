import React from 'react';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';
import {
  withStyles,
  Theme,
  StyleRules,
  WithStyles,
} from '@material-ui/core/styles';
import { v4 } from 'uuid';
import TrackingOverviewCardHeader from './TrackingOverviewCardHeader';
import {
  getIntlLabelForTrackingType,
  getTranslatedTextIdForTrackingDataValue,
  getTextForNonTranslatableDataValue,
  getArrayOfTags,
  getTrackingIconClassName,
  getLocalizedTagId,
} from '../trackingOverviewUtils';
import { TrackingDataPoint, TrackingTypes } from '../../types';
import { getTime } from '../../../utils/dateUtils';

import './NonFoodTrackingCard.css';

const styles = (theme: Theme): StyleRules => ({
  container: {
    padding: '20px 0',
    borderBottom: '1px solid #e0e0e0',
  },
  body: {
    margin: `${theme.spacing()}px auto`,
    width: '80%',
  },
  footer: {
    margin: '0 auto',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    width: '80%',
  },
  chip: {
    margin: `${theme.spacing(0.5)}px ${theme.spacing()}px`,
  },
  imageFluid: {
    display: 'block',
    width: '100%',
    maxWidth: '100%',
    height: 'auto',
  },
});

interface OwnProps {
  trackingDataPoint: TrackingDataPoint;
}

type Props = OwnProps & InjectedIntlProps & WithStyles<typeof styles>;

const NonFoodTrackingCard: React.FC<Props> = ({
  classes,
  intl,
  trackingDataPoint,
}) => {
  const { type, timestampTracking, tags } = trackingDataPoint;

  let textContent = null;
  let textValue = getTranslatedTextIdForTrackingDataValue(trackingDataPoint);

  if (textValue) {
    if (type === TrackingTypes.waterType) {
      textContent = (
        <FormattedMessage
          id={textValue}
          values={
            trackingDataPoint.value
              ? { count: 1 + trackingDataPoint.value / 25 }
              : { count: 1 }
          }
        />
      );
    } else {
      textContent = <FormattedMessage id={textValue} />;
    }
  } else {
    textContent = getTextForNonTranslatableDataValue(trackingDataPoint);
  }

  return (
    <div className={classes.container}>
      <TrackingOverviewCardHeader
        time={getTime(timestampTracking).toString()}
        type={
          <FormattedMessage
            // @ts-ignore
            id={getIntlLabelForTrackingType(type)}
          />
        }
      />
      <div className={classes.body}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div className={getTrackingIconClassName(trackingDataPoint)} />
          <Typography>{textContent}</Typography>
        </div>
      </div>
      <div className={classes.footer}>
        {getArrayOfTags(tags).map((tag: string) => {
          const tagId = getLocalizedTagId(tag, type);
          return (
            <Chip
              key={v4()}
              color="primary"
              label={tagId ? intl.formatMessage({ id: tagId }) : tag}
              className={classes.chip}
            />
          );
        })}
      </div>
    </div>
  );
};

export default injectIntl(withStyles(styles)(NonFoodTrackingCard));
