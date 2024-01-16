import { timer } from 'rxjs';

export const genericRetryStrategy = ({
  maxRetryAttempts = 3,
  scalingDuration = 500,
  excludedStatusCodes = [],
}: {
  maxRetryAttempts?: number;
  scalingDuration?: number;
  excludedStatusCodes?: number[];
} = {}) => {
  return {
    count: maxRetryAttempts,
    delay: (error, retryCount) => {
      const retryAttempt = retryCount + 1;
      // if maximum number of retries have been met
      // or response is a status code we don't wish to retry, throw error
      if (
        retryAttempt > maxRetryAttempts ||
        excludedStatusCodes.find((e) => e === error.status)
      ) {
        throw error;
      }
      // retry after 1s, 2s, etc...
      return timer(retryAttempt * scalingDuration);
    },
  };
};
