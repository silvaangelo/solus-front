import React from 'react';
import { Form, Input, Button, Layout, Row, Col, Icon } from 'antd';
import { withRouter } from 'react-router-dom';
import './style.css';
import { API_ROUTES, API_HEADERS } from '../../api';
import * as axios from 'axios';
import { notifyWithIcon } from '../helpers/notification';
import { Auth } from '../../lib/auth';

class Login extends React.Component {
  constructor(props) {
    super(props);

    document.title = 'Solus';
  }

  handleSubmit = (e) => {
    e.preventDefault();

    this.props.form.validateFields(async (err, values) => {
      if(err) {
        return;
      }

      try {
        const res = await axios.post(API_ROUTES.login, { email: values.email, password: values.password }, API_HEADERS);

        Auth.setUserData(res.data.token, res.data.data._id);

        window.location.href = '/dashboard';
      } catch (e) {
        if(!e.response) {
          return notifyWithIcon('error', 'Não foi possível se conectar com o servidor, verifique a conexão ou tente novamente mais tarde.');
        }

        if(e.response.status < 500) {
          notifyWithIcon('error', 'Dados incorretos, verifique os campos.');
        } else {
          notifyWithIcon('error', 'Algum erro aconteceu, por favor, tente novamente mais tarde.');
        }
      }
    });
  }

  render () {
    const FormItem = Form.Item;
    const { getFieldDecorator } = this.props.form;

    return (
      <div>
        <Layout className="vh100">
          <Row style={{minWidth: '100%'}}>
            <Col className="banner left center all" xs={{span: 0}} sm={{span: 0}} md={{span: 0}} lg={{span: 8}}>
              <div>
                <h1>Solus</h1>
              </div>

              <div className="credits">
                <footer>
                  <p className="footer-copyright">Desenvolvido por <a target="_blank" rel='noreferrer noopener' href="http://github.com/silvaangelo">Angelo</a> | <a target="_blank" rel='noreferrer noopener' href="http://github.com/silvaangelo/solus-front"><Icon type="github" theme="outlined" /></a></p>
                </footer>
              </div>
            </Col>
            <Col className="center all" xs={{span: 24}} sm={{span: 24}} md={{span: 16}} lg={{span: 16}}>
              <div className="w100">
              <Row style={{minWidth: '100%'}}>
                <Col xs={{span: 18, offset: 3}} sm={{span: 18, offset: 3}} md={{span: 8, offset: 8}} lg={{span: 8, offset: 8}}>
                  <Form onSubmit={this.handleSubmit}>
                    <FormItem label='E-mail'>
                      {getFieldDecorator('email', {
                        rules: [{ required: true, message: 'Por favor insira o e-mail.' }],
                      })(
                        <Input placeholder={"E-mail"} required={true} type='email' />
                      )}
                    </FormItem>

                    <FormItem label='Senha'>
                      {getFieldDecorator('password', {
                        rules: [{ required: true, message: 'Por favor insira a senha.' }],
                      })(
                        <Input placeholder={"Senha"} required={true} type='password' />
                      )}
                    </FormItem>

                    <FormItem>
                      <Button type="primary" htmlType='submit'>Entrar</Button>
                    </FormItem>
                  </Form>
                </Col>
              </Row>
              </div>
            </Col>
          </Row>
        </Layout>
      </div>
    )
  }
}

const FormLogin = Form.create()(Login);

export default withRouter(FormLogin);