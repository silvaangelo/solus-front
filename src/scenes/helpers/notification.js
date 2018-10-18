import { notification } from 'antd';

export const notifyWithIcon = (type, message) => {
  notification[type]({
    message: message
  });
};
