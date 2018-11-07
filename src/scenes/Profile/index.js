import React from 'react';
import TopMenu from '../menu';
import { API_ROUTES, API_HEADERS } from '../../api'
import * as axios from 'axios';
import { notifyWithIcon } from '../helpers/notification';
import { Layout, Row, Col, Divider, Card, Icon, Button, Form, Input } from 'antd';
import moment from 'moment';
import { Auth } from '../../lib/auth';

class Profile extends React.Component {
  constructor(props) {
    super(props);

    document.title = 'Solus | Meu perfil';

    this.state = {
      loading: true,
      isEdit: false,
      data: []
    };
  }

  async getData() {
    try {
        const res = await axios.get(`${API_ROUTES.user}/${Auth.getId()}`, API_HEADERS);

        return {
          key: res.data.data.id,
          id: res.data.data.id,
          name: res.data.data.name,
          email: res.data.data.email,
          createdAt: res.data.data.createdAt,
          updatedAt: res.data.data.updatedAt
        };
    } catch (e) {
      notifyWithIcon('error', 'Ocorreu um ero ao carregar o perfil.');
    }
  }
  
  async componentWillMount() {
    await this.setState({
      data: await this.getData(),
      loading: false
    });
  }

  async cancelEditing(form) {
    form.setFieldsValue({
      name: this.state.data.name,
      email: this.state.data.email
    });

    await this.setState({
      isEdit: false,
      loading: false
    });
  }

  async handleEditSubmit(e, form) {
    e.preventDefault();

    form.validateFields(async (err, values) => {
      if(err) {
        return;
      }

      this.setState({
        loading: true
      });
      
      try {
        let data = {
          name: values.name,
          email: values.email
        };

        if(values.password) {
          data.password = values.password;
        }

        const res = await axios.post(`${API_ROUTES.user}/${this.state.data.id}`, data, API_HEADERS);

        const user = res.data.data;

        form.setFieldsValue({
          name: user.name,
          email: user.email,
          password: null
        });

        this.setState({
          loading: false,
          isEdit: false,
          data: {
            key: user.id,
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
          }
        });
      } catch(e) {
        if(!e.response) {
          return notifyWithIcon('error', 'Algum erro aconteceu, por favor, tente novamente mais tarde.');
        }
        
        if(e.response.status < 500) {
          notifyWithIcon('error', 'Dados incorretos, verifique os campos.');
        } else {
          notifyWithIcon('error', 'Algum erro aconteceu, por favor, tente novamente mais tarde.');
        }
      }
    });
  }

  async handleEdit(form) {
    await this.setState({
      isEdit: true
    });
    
    form.setFieldsValue({
      name: this.state.data.name,
      email: this.state.data.email
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { form } = this.props;

    return (
      <div>
        <TopMenu></TopMenu>

        <div id={"root-with-header"}>
          <Layout className="no-background">
            <Row>
              <Col span={24}>
                <h1>Meu perfil</h1>
                <Divider/>
              </Col>
            </Row>
          </Layout>

          <Layout className="no-background">
            <Row>
              <Card
                title="Meus dados"
                actions={[<Button onClick={() => this.handleEdit(form)}>Editar <Icon type="edit"/></Button>]}
              >
                {!this.state.isEdit &&
                  <div>
                    <p><b>Nome: </b> {this.state.data.name}</p>
                    <p><b>Email: </b> {this.state.data.email}</p>
                    <p><b>Data de cadastro: </b> {moment(this.state.data.createdAt).format('HH:mm D/M/Y')}</p>
                    <p><b>Última modificação: </b> {moment(this.state.data.updatedAt).format('HH:mm D/M/Y')}</p>
                  </div>
                }

                {this.state.isEdit && 
                  <div>
                    <Form
                      onSubmit={(e) => this.handleEditSubmit(e, form)}
                    >
                      <Form.Item label='Nome'>
                        {getFieldDecorator('name', {
                          rules: [{ required: true, message: 'Por favor insira o nome.' }],
                        })(
                          <Input placeholder={"Nome"} required={true} type='text' />
                        )}
                      </Form.Item>

                      <Form.Item label='E-mail'>
                        {getFieldDecorator('email', {
                          rules: [{ required: true, message: 'Por favor insira o email.' }],
                        })(
                          <Input placeholder={"E-mail"} required={true} type='email' />
                        )}
                      </Form.Item>

                      <Form.Item label='Senha'>
                        {getFieldDecorator('password', {
                          rules: [],
                        })(
                          <Input placeholder={"Senha"} minLength={8} maxLength={16} type='password' />
                        )}
                      </Form.Item>
                      
                      <Button key="submit" type="primary" htmlType="submit" loading={this.state.loading}>
                        Salvar
                      </Button>
                      &nbsp;
                      <Button key="back" onClick={() => this.cancelEditing(form)}>Cancelar</Button>
                    </Form>
                  </div>
                }
              </Card>
            </Row>
          </Layout>
        </div>
      </div>
    )
  }
}

export default Form.create()(Profile);