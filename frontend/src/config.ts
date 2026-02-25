export const config = {
  apiEndpoint: import.meta.env.PROD
    ? 'https://api.cianandsimon.xyz'
    : 'http://localhost:3000',
};
