const isProduction = true;

export const environment = {
  appVersion: require('../../package.json').version + (!isProduction ? '-development' : '-production'),
  production: isProduction,
  enable_console_log: isProduction ? false : true,
  enable_api_log: isProduction ? false : false,
  stripe_publishable_key: !isProduction ? 'pk_test_3CW9ePepWe2N91ZUvuuxNdJ80072HvLWry' : 'pk_live_ZponeqWdCYyuGhZp2nUDa4Ye00Wlax2B59',
  api_url: !isProduction ? 'https://dev.wasphk-rental.com/backend/request.php' : 'https://prod.wasphk-rental.com/backend/request.php',
  media_url: !isProduction ? 'https://dev.wasphk-rental.com/media/' : 'https://prod.wasphk-rental.com/media/',
  seven_url: !isProduction ? 'https://dev.wasphk-rental.com/seven_images/' : 'https://prod.wasphk-rental.com/seven_images/',
  asset_url: !isProduction ? 'https://dev.wasphk-rental.com/assets/' : 'https://prod.wasphk-rental.com/assets/',
  cms_url: !isProduction ? 'https://dev.wasphk-rental.com/cms' : 'https://prod.wasphk-rental.com/cms',
};