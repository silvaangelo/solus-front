import React from 'react';
import TopMenu from '../menu';
import { API_ROUTES, API_HEADERS } from '../../api'
import * as axios from 'axios';
import { notifyWithIcon } from '../helpers/notification';
import { Layout, Row, Col, Table, Button, Icon, Divider, Modal, List, Card } from 'antd';
import ArduinoForm from './arduinoModal';
import moment from 'moment';

class Arduino extends React.Component {
  constructor(props) {
    super(props);

    document.title = 'Solus | Estações';

    this.state = {
      loading: true,
      showArduinoFormModal: false,
      isEdit: false,
      width: 0,
      data: []
    };
  }

  async getArduinos() {
    try {
      const res = await axios.get(API_ROUTES.arduino, API_HEADERS);

      return res.data.data.map(arduino => {
        return {
          key: arduino._id,
          id: arduino._id,
          name: arduino.name,
          location: arduino.location,
          createdAt: arduino.createdAt,
          updatedAt: arduino.updatedAt
        };
      });
    } catch (e) {
      notifyWithIcon('error', 'Ocorreu um ero ao carregar as estações.');
    }
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth });
  }
  
  async componentWillMount() {
    this.updateWindowDimensions();

    await this.setState({
      data: await this.getArduinos(),
      loading: false
    });
  }

  async handleDelete(id) {
    try {
      Modal.confirm({
        title: 'Confirmar exclusão da estação e todas as suas capturas?',
        okText: 'Sim',
        cancelText: 'Não',

        onOk: async () => {
          await axios.delete(`${API_ROUTES.arduino}/${id}`, API_HEADERS);

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
    const arduino = this.state.data.filter(x => x.id === id)[0];

    const form = this.arduinoFormRef.props.form;

    this.setState({
      isEdit: true,
      showArduinoFormModal: true
    });

    form.setFieldsValue({
      name: arduino.name,
      location: arduino.location,
      id: arduino.id
    });
  }

  handleEdit = async (e) => {
    e.preventDefault();

    const form = this.arduinoFormRef.props.form;

    form.validateFields(async (err, values) => {
      if(err) {
        return;
      }

      this.arduinoFormRef.setState({
        loading: true
      });

      try {
        const res = await axios.post(`${API_ROUTES.arduino}/${values.id}`, { name: values.name, location: values.location }, API_HEADERS);

        const arduino = res.data.data;

        this.setState({
          data: this.state.data.map(e => {
            if(e.id === values.id) {
              e.name = arduino.name;
              e.location = arduino.location;
              e.updatedAt = arduino.updatedAt;
            }

            return e;
          }),
          showArduinoFormModal: false,
          isEdit: false
        });

        this.arduinoFormRef.setState({
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

  handleCreation = (e) => {
    e.preventDefault();
    
    const form = this.arduinoFormRef.props.form;

    form.validateFields(async (err, values) => {
      if(err){
        return;
      }

      this.arduinoFormRef.setState({
        loading: true
      });

      try {
        const res = await axios.post(`${API_ROUTES.arduino}`, { name: values.name, location: values.location }, API_HEADERS);

        const arduino = res.data;

        this.setState(prev => ({
          data: [...prev.data, {
            key: arduino._id,
            id: arduino._id,
            name: arduino.name,
            location: arduino.location,
            createdAt: arduino.createdAt,
            updatedAt: arduino.updatedAt
          }],
          showArduinoFormModal: false
        }));

        this.arduinoFormRef.setState({
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

  saveArduinoFormRef = (formRef) => {
    this.arduinoFormRef = formRef;
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
        title: 'Local',
        dataIndex: 'location',
        key: 'location',
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
          <span className="children-mr10">
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
                <h1>Estações meteorológicas</h1>
                <Divider/>
              </Col>
            </Row>

            <Row>
              <Col span={24}>
                <div className="mb10">
                  <Button type="primary" onClick={() => this.setState({ showArduinoFormModal: true })}>
                    Adicionar nova
                  </Button>
                </div>
              </Col>
            </Row>
          </Layout>

          <Layout className="no-background">
            <Row>
              <Col span={24}>
                {this.state.width > 575 ?
                  <Table loading={this.state.loading} columns={columns} dataSource={this.state.data} pagination={false} />
                :
                  <List
                    dataSource={this.state.data}
                    loading={this.state.loading}
                    renderItem={item => {
                      return(
                        <Card style={{marginBottom: 15}} bordered={true}>
                          <p><b>Nome:</b> {item.name}</p>
                          <p><b>Local:</b> {item.location}</p>
                          <p><b>Criado em:</b> {<span>{moment(item.createdAt).format('DD/MM/YYYY HH:mm')}</span>}</p>
                          <p><b>Última modificação:</b> {<span>{moment(item.updatedAt).format('DD/MM/YYYY HH:mm')}</span>}</p>
                          <span className="children-mr10">
                            <Button type="primary" onClick={() => this.handleOpenEdit(item.key)}><Icon type="edit" /> Editar</Button>
                            <Button type="danger" onClick={() => this.handleDelete(item.key) }><Icon type="delete" /> Deletar</Button>
                          </span>
                        </Card>
                      );
                    }}
                  />
                }
              </Col>
            </Row>
          </Layout>
        </div>

        <ArduinoForm
          wrappedComponentRef={this.saveArduinoFormRef}
          visible={this.state.showArduinoFormModal}
          onCancel={() => {
            this.setState({
              showArduinoFormModal: false
            });
            
            this.arduinoFormRef.props.form.resetFields();
          }}
          onCreate={this.state.isEdit ? this.handleEdit : this.handleCreation}
        />
      </div>
    )
  }
}

export default Arduino