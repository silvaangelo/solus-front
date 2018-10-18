import React from 'react';
import TopMenu from '../menu';
import { API_ROUTES, API_HEADERS } from '../../api'
import * as axios from 'axios';
import { notifyWithIcon } from '../helpers/notification';
import { Layout, Row, Col, Table, Button, Icon, Divider, Modal } from 'antd';
import UserForm from './userModal';
import moment from 'moment';

class User extends React.Component {
  constructor(props) {
    super(props);

    document.title = 'Solus | Usuarios';

    this.state = {
      loading: true,
      showUserFormModal: false,
      isEdit: false,
      data: []
    };
  }

  async getUsers() {
    try {
      const res = await axios.get(API_ROUTES.user, API_HEADERS);

      return res.data.data.map(user => {
        return {
          key: user._id,
          id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        };
      });
    } catch (e) {
      notifyWithIcon('error', 'Ocorreu um ero ao carregar os users.');
    }
  }
  
  async componentWillMount() {
    await this.setState({
      data: await this.getUsers(),
      loading: false
    });
  }

  async handleDelete(id) {
    try {
      Modal.confirm({
        title: 'Confirmar exclusão do user e todas as suas capturas?',
        okText: 'Sim',
        cancelText: 'Não',

        onOk: async () => {
          await axios.delete(`${API_ROUTES.user}/${id}`, API_HEADERS);

          this.setState({
            data: this.state.data.filter(x => x.id !== id)
          });
        }
      });
    } catch(e) {
      if(e.response.status < 500) {
        notifyWithIcon('error', 'Dados incorretos, verifique os campos.');
      } else {
        notifyWithIcon('error', 'Algum erro aconteceu, por favor, tente novamente mais tarde.');
      }
    }
  }

  handleOpenEdit = async (id) => {
    const user = this.state.data.filter(x => x.id === id)[0];
    const form = this.userFormRef.props.form;

    this.setState({
      isEdit: true,
      showUserFormModal: true
    });

    this.userFormRef.setState({
      loading: false,
      isPasswordRequired: false
    });

    form.setFieldsValue({
      name: user.name,
      email: user.email,
      id: user.id
    });
  }

  handleEdit = async (e) => {
    e.preventDefault();

    const form = this.userFormRef.props.form;

    form.validateFields(async (err, values) => {
      if(err) {
        return;
      }

      this.userFormRef.setState({
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

        const res = await axios.post(`${API_ROUTES.user}/${values.id}`, data, API_HEADERS);

        const user = res.data.data;

        this.setState({
          data: this.state.data.map(e => {
            if(e.id === values.id) {
              e.name = user.name;
              e.email = user.email;
              e.updatedAt = user.updatedAt;
            }

            return e;
          }),
          showUserFormModal: false,
          isEdit: false
        });

        this.userFormRef.setState({
          loading: false,
          isPasswordRequired: true
        });

        form.resetFields();
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

  handleCreation = (e) => {
    e.preventDefault();

    const form = this.userFormRef.props.form;

    form.validateFields(async (err, values) => {
      if(err) {
        return;
      }

      this.userFormRef.setState({
        loading: true
      });

      try {
        const res = await axios.post(`${API_ROUTES.user}`, { name: values.name, email: values.email, password: values.password }, API_HEADERS);

        const user = res.data;

        this.setState(prev => ({
          data: [...prev.data, {
            key: user._id,
            id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
          }],
          showUserFormModal: false
        }));

        this.userFormRef.setState({
          loading: false
        });

        form.resetFields();
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

  saveUserFormRef = (formRef) => {
    this.userFormRef = formRef;
  }

  render() {
    const columns = [
      {
        title: 'Nome',
        dataIndex: 'name',
        key: 'name',
        render: text => <span>{text}</span>
      },
      {
        title: 'E-mail',
        dataIndex: 'email',
        key: 'email',
        render: text => <span>{text}</span>
      },
      {
        title: 'Criado em',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: date => <span>{moment(date).format('DD/MM/YYYY HH:mm')}</span>
      },
      {
        title: 'Última modificação',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        render: date => <span>{moment(date).format('DD/MM/YYYY HH:mm')}</span>
      },
      {
        title: 'Ações',
        dataIndex: 'key',
        key: 'key',
        render: id => (
          <span>
            <Button type="primary" onClick={() => this.handleOpenEdit(id)}><Icon type="edit" /> Editar</Button>

            <Button type="danger" onClick={() => this.handleDelete(id) }><Icon type="delete" /> Deletar</Button>
          </span>
        )
      },
    ];

    return (
      <div>
        <TopMenu></TopMenu>

        <div id={"root-with-header"}>
          <Layout className="no-background">
            <Row>
              <Col span={24}>
                <h1>Usuários</h1>
                <Divider/>
              </Col>
            </Row>

            <Row>
              <Col span={24}>
                <div className="mb10">
                  <Button type="primary" onClick={() => this.setState({ showUserFormModal: true })}>
                    Adicionar novo
                  </Button>
                </div>
              </Col>
            </Row>
          </Layout>

          <Layout>
            <Row>
              <Col span={24}>
                <Table loading={this.state.loading} columns={columns} dataSource={this.state.data} pagination={false} />
              </Col>
            </Row>
          </Layout>
        </div>

        <UserForm
          wrappedComponentRef={this.saveUserFormRef}
          visible={this.state.showUserFormModal}
          onCancel={() => {
            this.setState({
              showUserFormModal: false
            });

            this.userFormRef.setState({
              isPasswordRequired: true
            });
            this.userFormRef.props.form.resetFields();
          }}
          onCreate={this.state.isEdit ? this.handleEdit : this.handleCreation}
        />
      </div>
    )
  }
}

export default User