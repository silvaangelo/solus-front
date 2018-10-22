import { Auth } from './lib/auth';

export const HOST = process.env.REACT_APP_API_HOST;

export const API_ROUTES = {
  arduino: `${HOST}/arduino`,
  user: `${HOST}/user`,
  statistic: `${HOST}/statistic`,
  login: `${HOST}/user/login`
};

export const API_HEADERS = {
  headers: {
    Authorization: `Bearer ${Auth.getToken()}`,
    'Content-Type': 'application/json'
  }
}